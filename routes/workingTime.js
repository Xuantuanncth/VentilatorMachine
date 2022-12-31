var express = require('express');
var router = express.Router();
let db = require('../db');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('working_time/workingTime', { title: 'Working Time' });
});

router.get('/getDataMachine', (req, res, next)=>{
  console.log("[getDataMachine] req.query: ", req.query.machine);
  let data_temp = [];
  let machineDB = checkDatabase(req.query.machine);
  try {
    let _data = db.get(machineDB).value();
    let index_temp = 0;
    _data.forEach(element => {
      data_temp.push(prepareData(index_temp,element));
      index_temp+=1;
    });
    return res.status(200).send(data_temp);
  } catch (error) {
    console.log("Error: ",error);
    res.send(error);
  }
})

function prepareData(index,value){
  let _value = {};
  let time_on = [];
  let time_off = [];
  _value.index = index;
  _value.date = value.date;
  value.data.forEach(element =>{
    // console.log("Element of data: ",element);
    if(element.power == '1'){
      time_on.push(element.time)
    } else {
      time_off.push(element.time);
    }
  })
  // console.log("Time on: ", time_on);
  // console.log("Time off: ", time_off);
  _value.time_on = time_on;
  _value.time_off= time_off;

  return _value;
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