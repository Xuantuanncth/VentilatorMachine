let isGetData = false;

function selectMachine(id_machine){
    console.log("Check selectMachine");
    let nameMachine = document.getElementById("nameMachine");
    getData(id_machine);
    if(id_machine == 1){
        nameMachine.innerHTML = "Machine 1";
    } else if (id_machine == 2) {
        nameMachine.innerHTML = "Machine 2";
    } else if (id_machine == 3) {
        nameMachine.innerHTML = "Machine 3";
    }else{
        //Do nothing
    }
}

function getData(machine_id){
    if(isGetData){
        clearOldData();
        isGetData = false;
    }
    console.log("getData from database machine: ",machine_id);
    const url = "/workingTime/getDataMachine?machine="+machine_id;
    fetch(url).then((response)=>{
        response.json().then((data)=>{
            if(data.error){
                console.log("Data error", data.error);
            } else {
                createDataView(data);
                isGetData= true;
            }
        })
    });
}

function clearOldData(){
    let mainTb = document.getElementById('mainTable');
    while(mainTb.firstChild){
        mainTb.removeChild(mainTb.lastChild);
    }
}

function createTemplateData(index, date, time_on, time_off){

    let tr_main = document.createElement("tr");
    let th_empty1 = document.createElement("th");
    let th_empty2 = document.createElement("th");
    let th_index = document.createElement("th");
    let th_date = document.createElement("th");
    let th_time_on = document.createElement("th");
    let th_time_off = document.createElement("th");

    th_index.innerHTML = index;
    th_date.innerHTML = date;
    th_time_on.innerHTML = time_on;
    th_time_off.innerHTML= time_off;

    tr_main.appendChild(th_empty1);
    tr_main.appendChild(th_empty2);
    tr_main.appendChild(th_index);
    tr_main.appendChild(th_date);
    tr_main.appendChild(th_time_on);
    tr_main.appendChild(th_time_off);
    tr_main.appendChild(th_empty1);
    
    return tr_main;
}
/**
 * Index
 * Date
 * Time ON
 * Time OFF
*/
function createDataView(data){
    data.forEach(element => {
        console.log("[Element data] ",element);
        console.log("Length of time_on: ", element.time_on.length)
        console.log("Length of time_off: ", element.time_off.length)
        // let child_tb = createTemplateData(element);
        // mainTb.appendChild(child_tb);
        createElement(element);
    });
}

function createElement(value){
    let mainTb = document.getElementById("mainTable");
    let length_time_on = value.time_on.length;
    let length_time_off = value.time_off.length;
    let index_temp = 0;
    let child_tb;
    if(length_time_on > length_time_off){
        value.time_on.forEach((element)=>{
            console.log("Loop time on: ", element);
            if(index_temp == 0){
                child_tb = createTemplateData(value.index, value.date, element,value.time_off[0]);
                mainTb.appendChild(child_tb);
            } else {
                if(index_temp <= length_time_off){
                    child_tb = createTemplateData("","",element,value.time_off[index_temp]);
                    mainTb.appendChild(child_tb);
                } else {
                    child_tb = createTemplateData("","",element,"0");
                    mainTb.appendChild(child_tb);
                }
            }
            index_temp++;
        })
    } else {
        value.time_off.forEach((element)=>{
            console.log("Loop time off: ", element);
            if(index_temp == 0){
                child_tb = createTemplateData(value.index, value.date,value.time_on[0],element);
                mainTb.appendChild(child_tb);
            } else {
                if(index_temp < length_time_on){
                    child_tb = createTemplateData("","",value.time_on[index_temp],element);
                    mainTb.appendChild(child_tb);
                } else {
                    child_tb = createTemplateData("","","0",element);
                    mainTb.appendChild(child_tb);
                }
            }
            index_temp++;
        })
    }
}

window.onload = function loadData(){
    getData(1);
}