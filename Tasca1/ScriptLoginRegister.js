
function register() {
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
     // Verificamos que los campos no estén vacíos
            if (!username || !email || !password) {
                alert("Please fill in all fields!");
                return;
            }

            // Mostrar en consola los valores para verificar
            console.log("Registering with:", { username, email, password });

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
            alert("Registration successful: " + response.message);
            localStorage.setItem('username', username);
            window.location.href = 'store.html';  // Esto es para que me redirija al store
         },
         error: function () {
             alert("Error registering. Please try again.");
         }
    });
}

function login() {
    const loginUsername = document.getElementById("loginUsername").value;
    const loginPassword = document.getElementById("loginPassword").value;

   $.ajax({
     url: 'http://localhost:8080/dsaApp/users/login',
     method: 'POST',
     contentType: 'application/json',
     data: JSON.stringify({
          username: loginUsername,
          password: loginPassword
     }),
     success: function (response) {
       alert("Login successful. Redirecting to the store...");
       localStorage.setItem('username', loginUsername); // Save username
       window.location.href = 'store.html';
     },
     error: function () {
      alert("Invalid username or password. Please try again.");
      }
   });
}