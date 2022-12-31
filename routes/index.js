var express = require('express');
var router = express.Router();
let db = require('../db');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home_page/homePage', { title: 'Hear rate monitor' });
});

router.get('/update_data', (req, res, next)=>{
  console.log("Update data: ", req.query.id, req.query.date, req.query.time, req.query.power);
  let dataRaw = {
    time: req.query.time,
    power: req.query.power
  };
  let isUpdateData = updateData(req.query.id,req.query.date,dataRaw);
  if(isUpdateData){
    res.send("success");
  } else {
    res.send("error");
  }
})

/**
 * Prepare parameter
 * Check null parameter
 * Check ranger parameter
*/
function validateParameter(){
  
}
/**
 * updateData in db
 * date: 31/12/2022
 * time: 11:21
 * power: ON
*/
function updateData(m_id, m_date, m_data){
  console.log('[UpdateData]');
  _machineDB = checkDatabase(m_id);
  try{
    let old_value = db.get(_machineDB).find({date:m_date}).value();
    // console.log("Is old value: ",old_value);
    if(old_value){
      old_value.data.push(m_data);
      // console.log("Data update: ",old_value);
      db.get(_machineDB).find({date:m_date}).assign({data:old_value.data}).write();
      return 1;
    } else {
      let _createNewData = createNewData(_machineDB, m_date, m_data);
      if(_createNewData){
        console.log("createNewData is oke");
        return 1;
      } else {
        console.log("createNewData is error");
        return 0;
      }
    }
  } catch(error){
    console.log("[UpdateData]: ",error);
    return 0;
  }
}

function createNewData(_machineDB,_date,_data){
  try {
    db.get(_machineDB).push({
      date:_date,
      data:[_data]
    }).write();
    return 1;
  } catch (error) {
    console.log("Create data employee_time fail! Can't access into DataBase: ",error);
    return 0;
  }
}

function checkDatabase(id){
  let machine = "";
  if(id == 1){
    machine = "machine_1_info";
  } else if (id == 2){
    machine = "machine_2_info";
  } else if (id == 3){
    machine = "machine_3_info";
  } else {
    /**
     * Do nothing
    */
  }
  return machine;
}
module.exports = router;
