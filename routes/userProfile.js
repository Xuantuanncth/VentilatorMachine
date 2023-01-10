var express = require('express');
var router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
let db = require('../db');

const handleError = (err, res) => {
  res
    .status(500)
    .contentType("text/plain")
    .end("Oops! Something went wrong!");
};

const upload_file = multer({
  dest:'./database/avatar/uploads/'
})

/* GET home page. */
router.get('/', function(req, res, next) {
  try {
    data = db.get('users').value();
    console.log("[] =======> data:",data);
  } catch (error) {
    
  }
  res.render('user_profile/userProfile', { title: 'User profile', data:data });
});

function create_user(data, avatar){
  data.users_avatar = avatar;
  let is_exist_id = db.get('users').find({users_id:data.users_id}).value();
  if(is_exist_id){
    console.log("[create_user] ==============> id exist");
    return false;
  } else {
    try {
      db.get('users').push(data).write();
    } catch (error) {
      console.log("[create_user] Can not update: ",error)
    }
    console.log("[create_user] ============> Updated");
    return true;
  }
}

/* Post upload data */
router.post('/createUser',upload_file.single('users_avatar'),(req, res, next) =>{
  console.log("[CreateUser] ==============>", req.body);
  const temp_path = req.file.path;
  let user_avatar_path = '../public/images/avatar/'+req.body.users_id+'.jpg';
  let avatar = "/images/avatar/"+req.body.users_id+'.jpg';
  const target_path = path.join(__dirname,user_avatar_path);
  let is_new_data = create_user(req.body, avatar);
  if(is_new_data){
    if(path.extname(req.file.originalname).toLowerCase() === ".jpg"){
      fs.rename(temp_path, target_path, (err) =>{
        if(err){
          console.log("[err]: ",err)
          return handleError(err, res);
        } else {
          res.status(200).redirect('/userProfile');
        }
      });
    } else {
      fs.unlink(temp_path,err => {
        if(err){
          return handleError(err, res);
        } else {
          res.status(403).contentType("text/plain").end("Only .png files are allowed");
        }
      })
    }
  } else {
    res.send(" Id is exist, please correct ID");
  }
})

router.get('/getDataUser', (req, res, next) =>{
  console.log("GetDataUser: ", req.query.users_id);
  try {
    let user_data = db.get('users').find({users_id:req.query.users_id}).value();
    console.log("User: ",user_data);
    res.status(200).send(user_data);
  } catch (error) {
    res.status(403).contentType("JSON/application").end("Only .png files are allowed");
  }
})

module.exports = router;