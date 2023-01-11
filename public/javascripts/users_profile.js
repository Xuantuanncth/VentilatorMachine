let u_name = document.getElementById('users_name');
let u_id = document.getElementById('users_id');
let u_date = document.getElementById('users_birthday');
let u_address = document.getElementById('users_address');
let u_male = document.getElementById('users_sex_male');
let u_female = document.getElementById('users_sex_female');
let u_info = document.getElementById('users_info');
<<<<<<< HEAD
let u_avatar = document.getElementById('users_avatar');
=======
>>>>>>> ff3fa7404688e35b191e50a831b237fa27c87ade

let view_name = document.getElementById('v_name');
let view_date = document.getElementById('v_birthday');
let view_address = document.getElementById('v_address');
let view_sex = document.getElementById('v_sex');
let view_age = document.getElementById('v_age');
let view_info = document.getElementById('v_info');
let view_avatar = document.getElementById('v_avatar');

function view_info_user(user_id) {
    console.log("[view user]: ",user_id);
    getData(true,user_id);
    $('#view_user_info').modal('show')
}


function edit_info_user(user_id){
    console.log("[edit_user] ", user_id);
    getData(false,user_id);
<<<<<<< HEAD
    $('#edit_user').modal('show')
=======
    $('#add_new_user').modal('show')
>>>>>>> ff3fa7404688e35b191e50a831b237fa27c87ade
}

function getData(is_view,users_id){
    const url = "/userProfile/getDataUser?users_id="+users_id;
    fetch(url).then((response)=>{
        response.json().then((data)=>{
            if(data.error){
                console.log("Data error", data.error);
            } else {
                console.log("[data]: ",data);
                createDataView(is_view,data)
            }
        })
    });
}

function createDataView(is_view_data,data){
    if(is_view_data){
        view_name.innerHTML = data.users_name;
        view_date.innerHTML = data.users_birthday;
        view_address.innerHTML = data.users_address;
        view_info.innerHTML= data.users_info;
        view_sex.innerHTML = data.users_sex;
        view_age.innerHTML = 26;
        view_avatar.src    = data.users_avatar;
    }  else {
        u_name.value = data.users_name;
        u_date.value = data.users_birthday;
        u_address.value = data.users_address;
        u_id.value = data.users_id;
<<<<<<< HEAD
        u_id.hidden = true;
        u_info.value= data.users_info
        u_avatar.required = "";
        u_avatar.disabled = true;
=======
        u_info.value= data.users_info
>>>>>>> ff3fa7404688e35b191e50a831b237fa27c87ade
    }

}
