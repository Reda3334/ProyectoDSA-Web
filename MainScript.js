let username;
$(document).ready(() => {
    username = localStorage.getItem("username");
    if(username == null){
        goToLogin("unauthenticated");
        return;
    }

    drawUserInfo();
})

function logout(){
    localStorage.removeItem("username");
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
        url: "dsaApp/users/puntos/" + username,
        method: "GET",
        statusCode: {
            200: (response) => {
                $("#points").text(response);
            },
            403: () => goToLogin("session-expired")
        }
    })
}