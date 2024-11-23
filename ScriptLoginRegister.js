$(document).ready(() => {
    const urlParameters = new URLSearchParams(window.location.search);
    const reason = urlParameters.get("reason");
    if(reason != null){
        if(reason == "unauthenticated"){
            $("#top-error").text("Tiene que iniciar sesion antes de acceder a una página restringida.");
        }else if(reason == "session-expired"){
            $("#top-error").text("Su sesión ha expirado. Por favor, vuelva a iniciarla.")
        }else{
            $("#top-error").text("Redirigido a login, motivo: " + reason);
        }
        $("#top-error").show();
    }
})


function register() {
    const username = $("#username").val();
    const email =  $("#email").val();
    const password =  $("#password").val();
    const confirmPassword = $("#confirmPassword").val();
    $("#registerError").text("");
     // Verificamos que los campos no estén vacíos
    if (!username || !email || !password || !confirmPassword) {
        $("#registerError").text("Por favor rellene todos los campos");
        return;
    }
    if(password != confirmPassword){
        $("#registerError").text("Las contraseñas no coinciden");
        return;
    }

    // Mostrar en consola los valores para verificar
    console.log("Registering with:", { username, email });
    $("#registerLoading").show();
    $.ajax({
         url: 'http://localhost:8080/dsaApp/users/register',
         method: 'PUT',
         contentType: 'application/json',
         data: JSON.stringify({
                         username: username,
                         mail: email,
                         password: password
                         }),

        success: function (response) {
            $("#registerLoading").hide();
            localStorage.setItem('username', username);
            window.location.href = 'store.html';  // Esto es para que me redirija al store
        },
        error: function () {
            alert("Error registering. Please try again.");
            $("#registerLoading").hide();
        }
    });
}

function login() {
    const loginUsername = $("#loginUsername").val();
    const loginPassword = $("#loginPassword").val();
    if(!loginUsername || !loginPassword){
        $("#loginError").text("Por favor rellene todos los campos");
    }
    $("#loginError").text("");
    $("#loginLoading").show();
    $.ajax({
        url: 'http://localhost:8080/dsaApp/users/login',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            username: loginUsername,
            password: loginPassword
        }),
        statusCode: {
            403: () => {
                $("#loginLoading").hide();
                $("#loginError").text("El usuario no existe o la contraseña es incorrecta");
            },
            400: () => {
                $("#loginLoading").hide();
                $("#loginError").text("Error interno, vuelve a intentar");
            },
            200: () => {
                $("#loginLoading").hide();
                localStorage.setItem('username', loginUsername); // Save username
                window.location.href = 'store.html';
            }
        }
    });
}