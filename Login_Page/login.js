function submitForm() {
    // Get values from the form
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    // Create JSON request body
    var requestBody = {
        email: email,
        password: password
    };

    // Make fetch request
    fetch("http://localhost:8080/api/v0/user/generate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.text(); // Handle the response as text, not JSON
    })
    .then(data => {
        console.log("Request successful!", data);

        // Store the JWT token in local storage
        localStorage.setItem("jwtToken", data);

        console.log( "location",window.location);
        window.location = '/';
                // Redirect to another page or perform other actions as needed
        // window.location.href = "dashboard.html";
    })
    .catch(error => {
        console.error("Error:", error);
        // Handle errors
    });
}
