import { io } from "https://cdn.socket.io/4.7.4/socket.io.esm.min.js";

window.socket = io();

document.getElementById("signIn").onclick = function() {document.location.href="/";};

// to clear the psw and to unclear it
document.getElementById('togglePassword').addEventListener('click', function () {
    const passwordField = document.getElementById('pwd');
    const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordField.setAttribute('type', type);
});
document.getElementById('togglePassword2').addEventListener('click', function () {
    const passwordField = document.getElementById('pwd2');
    const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordField.setAttribute('type', type);
});

// add reaction to the signup buton,
// the reaction get and send information to the server
document.getElementById('signUp').onclick = function () {
    const userinfo = {
        UserName : document.getElementById("userName").value,
        UserFirstName : document.getElementById("userFirstName").value,
        UserPwd: '',
        UserMail: document.getElementById("userMail").value
    };
    var pwd1 = document.getElementById("passwordSignUp").value;
    var pwd2 = document.getElementById("passwordSignUp2").value;
    if (pwd1 === pwd2) {
        userinfo.UserPwd = pwd1;
    } else {
        alert("Pasword need to be the same");
        return;
    }

    if(userinfo.UserMail !== "" && userinfo.UserPwd !== "" && userinfo.UserName !== "" && userinfo.UserFirstName !== "") {
        socket.emit("newUser", userinfo);
      } else {
        alert("empty user mail or password");
        return;
      }
};

// when the user are sucefuly created
socket.on("UserCréationSucess", sucess => {
    document.location.href="/";
});

// in case of error
socket.on("Error", error => {
    alert(error);
});
