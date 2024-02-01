function submitRegistrationForm() {
  // Get values from the form
  var name = document.getElementById("name").value;
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;

  // Create JSON request body
  var requestBody = {
      name: name,
      email: email,
      password: password,
      role: "ROLE_USER"
  };

  // Make fetch request
  fetch("http://localhost:8080/api/v0/user/register", {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
  })
  .then(response => {
      if (!response.ok) {
         // console.log(response.json());
          response.json().then(data=>{
            var errorMessageElement = document.getElementById("error-message");
            errorMessageElement.style.display = "block";
            if(data.errorMessage){
              errorMessageElement.innerText = data.errorMessage;
            }else{
              errorMessageElement.innerText="Registration failed. Please check your information."
            }
            console.error("Error:", data.errorMessage);
          }
          );
          throw new Error(`HTTP error! Status: ${response.json()}`);
      }
      return response.text(); // Handle the response as text, not JSON
  })
  .then(data => {
      console.log("Registration successful!", data);
      // Redirect to login page or perform other actions as needed
      window.location = '/login';
  })
  .catch(error => {
    var errorMessageElement = document.getElementById("error-message");
    errorMessageElement.style.display = "block";
    errorMessageElement.innerText = error.errorMessage;
    console.error("Error:", error.errorMessage);
      // Handle errors
  });
}
async function checkLogin(){
  var jwtToken = localStorage.getItem("jwtToken");
  if(!jwtToken){
      return;
  }
  var response = await fetch(`http://localhost:8080/api/v0/user/check/login`, {
      method: "GET",
      headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + jwtToken
      },
  });
  if(!response.ok){
      return;
  }

  window.location="/"
}
checkLogin().catch();