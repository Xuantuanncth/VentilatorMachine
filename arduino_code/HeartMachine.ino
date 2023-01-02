#include <WiFi.h>
#include <HTTPClient.h>
#include "time.h"

#define POWER_ON  1
#define POWER_OFF 0

/**
* Need re-define pin
*/
#define machine_1_btn_on 1
#define machine_2_btn_on 2
#define machine_3_btn_on 3
#define machine_1_btn_off 4
#define machine_2_btn_off 5
#define machine_3_btn_off 6


const char* ssid = "TRAN THANG";
const char* password = "11112222";
String your_ip = "192.168.1.118";

//Your Domain name with URL path or IP address with path
String serverName = "http://"+your_ip+":3030/update_data";
HTTPClient http;

unsigned long lastTime = 0;
unsigned long timerDelay = 20000;

const char* ntpServer = "pool.ntp.org";
const long  gmtOffset_sec = 7*60*60;
const int   daylightOffset_sec = 3600;

char time_buff[30];
char date_buff[30];

bool is_machine1_on = false;
bool is_machine2_on = false;
bool is_machine3_on = false;


void setup() {
  Serial.begin(115200); 
  pinMode(machine_1_btn_on, INPUT_PULLUP);
  pinMode(machine_2_btn_on, INPUT_PULLUP);
  pinMode(machine_3_btn_on, INPUT_PULLUP);
  pinMode(machine_1_btn_off, INPUT_PULLUP);
  pinMode(machine_2_btn_off, INPUT_PULLUP);
  pinMode(machine_3_btn_off, INPUT_PULLUP);

  WiFi.begin(ssid, password);
  Serial.println("Connecting");
  while(WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());
  delay(2000);
  Serial.println("Timer set to 5 seconds (timerDelay variable), it will take 5 seconds before publishing the first reading.");
  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
}

void loop() {
  //Send an HTTP POST request every 10 minutes
  char keyPass = readButton();
  Serial.println(keyPass);
  switch (keyPass)
  {   
    case 1:
      if(!is_machine1_on)
      {
        sendDataToServer(1,POWER_ON);
        is_machine1_on = true;
      }
      break;
    case 2:
      if(!is_machine2_on)
      {
        sendDataToServer(2,POWER_ON);
        is_machine2_on = true;
      }
      break;
    case 3:
      if(!is_machine3_on)
      {
        sendDataToServer(3,POWER_ON);
        is_machine3_on = true;
      }
      break;
    case 4:
      if(is_machine1_on)
      {
        sendDataToServer(1,POWER_OFF);
        is_machine1_on = false;
      }
      break;
    case 5:
      if(is_machine2_on)
      {
        sendDataToServer(2,POWER_OFF);
        is_machine2_on = true;
      }
      break;
    case 6:
      if(is_machine3_on)
      {
        sendDataToServer(3,POWER_OFF);
        is_machine3_on = true;
      }
      break;
    default:
      //Do not thimg
      break;
  }
}



unsigned char readButton(){
    unsigned char key = 0;
    if(digitalRead(machine_1_btn_on) == 0){
      key = 1;
      while(digitalRead(machine_1_btn_on) == 0); //Chống dội
    } else if (digitalRead(machine_2_btn_on) == 0){
      key = 2;
      while(digitalRead(machine_2_btn_on) == 0);
    } else if (digitalRead(machine_3_btn_on) == 0) {
      key = 3;
      while(digitalRead(machine_3_btn_on) == 0);
    } else if (digitalRead(machine_1_btn_off) == 0) {
      key = 4;
      while(digitalRead(machine_1_btn_off) == 0);
    } else if (digitalRead(machine_2_btn_off) == 0) {
      key = 5;
      while(digitalRead(machine_2_btn_off) == 0);
    } else if (digitalRead(machine_3_btn_off) == 0) {
      key = 6;
      while(digitalRead(machine_3_btn_off) == 0);
    } else {

    }
    return key;
}

void getTime()
{
  struct tm timeinfo;
  if(!getLocalTime(&timeinfo)){
    Serial.println("Failed to obtain time");
    return;
  }
  strftime(date_buff,12, "%F", &timeinfo);
  strftime(time_buff,10, "%T", &timeinfo);
  Serial.println(date_buff);
  Serial.println(time_buff);
}

char sendDataToServer(unsigned char button_id, bool isPower)
{
  char status = 0;
  /*
   * Send data to server using http get
  */
  if(WiFi.status()== WL_CONNECTED)
  {

    getTime();
    /* Prepare url path */
    String serverPath = serverName + "?id="+button_id+"&date="+date_buff+"&time="+time_buff+"&power="+isPower;
    Serial.println(serverPath);

    /* Start connection to server */
    http.begin(serverPath.c_str());

    /* start request with method GET */
    int httpResponseCode = http.GET();
    if (httpResponseCode>0) 
    {
        Serial.print("HTTP Response code: ");
        Serial.println(httpResponseCode);
        String payload = http.getString();
        Serial.println(payload);
        status = 1;
    }
    else 
    {
        Serial.print("Error code: ");
        Serial.println(httpResponseCode);
    }
      http.end();
  }
  return status;
}