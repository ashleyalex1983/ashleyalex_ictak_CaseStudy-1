let userobj =[{
    userid : 1,
    username : "admin",
    password : "12345",
    isloggedIn : false,
    loginDate: "",
    logoutDate: ""
}];

$(document).ready(function(){

    //login page
    $("form button").click(function(){
        // console.log("submit button clicked");
        const loginform     = document.getElementById("loginform");
        const loginpassword = document.getElementById("password");
        const loginusername = document.getElementById("username");

        //Event Listener for validating inputs on submit of login
        loginform.addEventListener('submit',(e)=>{
            e.preventDefault();
            var isInvalid = checkLoginInputs(loginusername,loginpassword);
            //isInvalid=false no error
            //isInvalid=true error
            if(isInvalid){
                // return error;
                alert("Invalid Username or Password.");
            }
            else{
                var username =loginusername.value.trim();
                var password =loginpassword.value.trim();
                // console.log(username+" "+password);
                //call function to authenticate user login in which 
                //page is redirected to main page using callback method
                authenticateUserLogin(username,password,pageRedirect);
            }
        });
    });

    //main page
    $("div.box1").hide();
    //loads todo checklist  
    $(".todo").click(function(){
        $("a:first").addClass("active");
        $("div.box1").show(2000, function(){
            $.getJSON("https://jsonplaceholder.typicode.com/todos",function(todo_data,status,xhr){
                var chklist_data ="";
                $("div.check-list").empty();
                $.each(todo_data,function(i,value){
                    if(value.userId === userobj[0].userid){
                        if(value.completed == true ){
                            chklist_data +=`<input type='checkbox' class='check' id=${value.id} checked disabled style='text-decoration: line-through;'>`+
                            `<label for=${value.id}> &nbsp; ${value.title} </label><br>`;
                        }
                        else{
                            chklist_data +=`<input type='checkbox' id=${value.id} >`+
                            `<label for=${value.id}> &nbsp; ${value.title} </label><br>`;
                        }
                        // console.log(value.id+"checked ="+value.completed + " title : "+value.title);
                    }
                });
                $("div.check-list").append(chklist_data);

                //track the checkbox change event in success status
                if(status == "success"){ 
                    var checkboxes = document.querySelectorAll('input[type=checkbox]');
                    var checkboxArray =Array.from(checkboxes);
                    
                    //reset the totalchecked counter to 0 by default for every success of checklist reload
                    var count =0;
                    resetTotalchecked_Count(count);
                    
                    checkboxArray.forEach(function(checkbox){
                        //add eventListener checkbox - change
                        checkbox.addEventListener('change',(e)=>{
                            e.preventDefault();

                            //function call using Promise method
                            confirmCheck5(checkbox)
                            .then(function(){
                                alert("Congrats. 5 Tasks have been Successfully Completed");
                            })
                            .catch(function(e){
                                // console.log(e);
                                return "error";
                            });
                        });
                    });
                }
                if(status == "error"){
                    console.log("Error type: "+xhr.status+" and the error is "+xhr.statusText);
                }
            });
        });
    });    

    $(".logout").click(function(){
        userobj.isloggedIn =false;
        var d =new Date();
        userobj.logoutDate=d;
    });

    // console.log(userobj);
});

var totalchecked=0;
function resetTotalchecked_Count(new_count){
    totalchecked=new_count;
}

function confirmCheck5(obj)
{ 
    var success = false;
    return  new Promise(function(resolve,reject){
        setTimeout(function(){
            if(obj.checked){
                totalchecked += 1;  
                if(totalchecked === 5) {  success=true; }
                // else{success=false;}
            }
            else{
                totalchecked -= 1;
            }
            if(success){
                resolve();
            }
            else{
                reject("Error occurred!!");
            }
        },500)
    })
}

function checkLoginInputs(loginusername,loginpassword){
    const usernameValue = loginusername.value.trim();    
    const loginpasswordValue = loginpassword.value.trim(); 

    var invalidUsernameInput =false;
    var invaliPasswordInput =false;

    if(usernameValue ==="")
    {
        invalidUsernameInput =true;
        setErrorFor(loginusername, "Username cannot be blank");
    }  else {
        invalidUsernameInput =false;
        setSuccessFor(loginusername);
    }

    if(loginpasswordValue ==="")
    {
        invaliPasswordInput =true;
        setErrorFor(loginpassword, "Password cannot be blank");
    } 
    else{
        invaliPasswordInput =false;
        setSuccessFor(loginpassword);
    }

    if((invalidUsernameInput===true)||(invaliPasswordInput===true)){
        return true;
    }
    else{
        return false;
    }
    

}

function setErrorFor(input, message){
    const formControl = input.parentElement; //form_control
    const small = formControl.querySelector("small");
    //add error msg in small
    small.innerText = message;
    //add error class
    formControl.className = "form_control error";
}

function setSuccessFor(input){
    const formControl = input.parentElement;
    //add success class
    formControl.className="form_control success";
}

//call function to authenticate user login in which page is redirected to main page using callback method
// authenticateUserLogin(username,password,pageRedirect);
function authenticateUserLogin(username,password,callback){
    var isValidUser = false ;
    setTimeout(function(){
        if((userobj[0].username === username) && (userobj[0].password === password)){
            userobj[0].isloggedIn =true;
            isValidUser =true;
            // callback(isValidUser);
        }
        else{ 
            alert("Invalid User Credentials !!"); 
        }
        callback(isValidUser);
    },1000);
}

function pageRedirect(isAuthenticate){
    setTimeout(function(){
        if(isAuthenticate){
            var pageUrl ="./main.html";
            // window.$(location).attr("href",pageUrl);
            window.location.href =pageUrl;
        }
        else{
            alert("Please...Login with valid credentials.");
        }
    },500);
}

