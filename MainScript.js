let username;
let userID;
$(document).ready(() => {
    username = localStorage.getItem("username");
    userID = localStorage.getItem("userID");
    if(username == null){
        goToLogin("unauthenticated");
        return;
    }

    drawUserInfo();
})

function logout(){
    localStorage.removeItem("username");
    localStorage.removeItem("userID");
    goToLogin();
}

function goToLogin(reason = null){
    if(reason == null){
        window.location.href = "LoginRegister.html"
    }else{
        window.location.href = "LoginRegister.html?reason=" + reason;
    }
    
}

function drawUserInfo(){
    $("#username").text(username);
    $.ajax({
        url: "dsaApp/users/puntos/" + userID,
        method: "GET",
        statusCode: {
            200: (response) => {
                $("#points").text(response);
            },
            403: () => goToLogin("session-expired")
        }
    })
}