let username;
let userID;

$(document).ready(() => {
    username = localStorage.getItem("username");
    userID = localStorage.getItem("userID");
    if(username == null){
        goToLogin("unauthenticated");
        return;
    }

    getUserInfo();

})

function getUserInfo(){
    $.ajax({
        url: "dsaApp/users/userinfo/" + userID,
        method: "GET",
        contentType: "application/json",
        statusCode: {
            200: (r) => {
                $("#username").text(r.username);
                $("#email").text(r.mail);
                $("#money").text(r.money);
                $("#points").text(r.puntos);
            },
            403: (r) => {
                goToLogin("session-expired");
            }
        }
    })
}

function goToLogin(reason = null){
    if(reason == null){
        window.location.href = "LoginRegister.html"
    }else{
        window.location.href = "LoginRegister.html?reason=" + reason;
    }
    
}

function exit(){
    window.location.href = "/";
}

function cambiarNombre(){
    $("#username-error").hide();
    $("#username-success").hide();
    const newUsername = $("#new-username").val();
    if(!newUsername){
        $("#username-error").text("Introduzca un nombre en el campo superior");
        $("#username-error").show();
        return;
    }

    $.ajax({
        url: "dsaApp/users/changeUsername/" + userID,
        method: "PUT",
        contentType: 'text/plain',
        data: newUsername,
        statusCode: {
            200: () => {
                getUserInfo();
                $("#username-success").text("Nombre de usuario cambiado!");
                $("#username-success").show();
                username = newUsername;
                localStorage.setItem("username", newUsername);
            },
            403: () => {
                goToLogin("unauthenticated");
            },
            500: () => {
                $("#username-error").text("Error de servidor");
                $("#username-error").show();
            }
        }
    })
}

function cambiarCorreo(){
    $("#email-error").hide();
    $("#email-success").hide();
    const newEmail = $("#new-email").val();
    if(!newEmail){
        $("#email-error").text("Introduzca un correo en el campo superior");
        $("#email-error").show();
        return;
    }

    $.ajax({
        url: "dsaApp/users/changeEmail/" + userID,
        method: "PUT",
        contentType: 'text/plain',
        data: newEmail,
        statusCode: {
            200: () => {
                getUserInfo();
                $("#email-success").text("Correo electrónico cambiado!");
                $("#email-success").show();
            },
            403: () => {
                goToLogin("unauthenticated");
            },
            500: () => {
                $("#email-error").text("Error de servidor");
                $("#email-error").show();
            }
        }
    })
}


function changePassword(){
    $("#password-error").hide();
    $("#password-success").hide();
    const currentPassword = $("#current-password").val();
    const newPassword = $("#new-password").val();
    const repeatPassword = $("#repeat-password").val();

    if(!currentPassword || !newPassword || !repeatPassword){
        $("#password-error").text("Rellene todos los campos!");
        $("#password-error").show();
        return;
    }

    if(newPassword != repeatPassword){
        $("#password-error").text("Las contraseñas no coinciden!");
        $("#password-error").show();
        return;
    }

    $.ajax({
        url: "dsaApp/users/changePassword/" + userID,
        method: "PUT",
        contentType: 'application/json',
        data: JSON.stringify({
            oldPassword: currentPassword,
            newPassword: newPassword
        }),
        statusCode: {
            200: () => {
                localStorage.removeItem("userID");
                goToLogin();
            },
            403: () => {
                $("#password-error").text("La contraseña actual es incorrecta");
                $("#password-error").show();
            },
            401: () => {
                goToLogin("session-expired");
            },
            500: () => {
                $("#password-error").text("Error de servidor");
                $("#password-error").show();
            }
        }
    })
}