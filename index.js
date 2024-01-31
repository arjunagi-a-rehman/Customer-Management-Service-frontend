// Function to fetch customer data from the API
var customers;
async function fetchCustomers() {
  try {
      // Get the JWT token from local storage
      var jwtToken = localStorage.getItem("jwtToken");
      console.log(jwtToken);
      if (!jwtToken) {

          console.error("JWT token not found in local storage.");
          window.location="/Login_Page/index.html"
          return;
      }

      // Fetch data from the API using Authorization header
      var response = await fetch("http://localhost:8080/api/v0/customer/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
              "Authorization": "Bearer " + jwtToken
          }
      });

      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }

      var data = await response.json();
      return data;
  } catch (error) {
    window.location="/Login_Page/index.html"
      console.error("Error fetching data:", error);
      return [];
  }
}

// Function to render customers in the table
async function renderCustomers(customers) {
  var tableBody = document.getElementById("customerTableBody");
  tableBody.innerHTML = "";

  // Fetch customer data from the API
  

  customers.forEach(function (customer) {
      var row = tableBody.insertRow();
      row.innerHTML = `
          <td>${customer.firstName}</td>
          <td>${customer.lastName}</td>
          <td>${customer.street}</td>
          <td>${customer.address}</td>
          <td>${customer.city}</td>
          <td>${customer.state}</td>
          <td>${customer.email}</td>
          <td>${customer.phone}</td>
          <td>
              <button type="button" class="btn btn-primary btn-sm" onclick="updateCustomer('${customer.uuid}')">Update</button>
              <button type="button" class="btn btn-danger btn-sm" onclick="deleteCustomer('${customer.uuid}')">Delete</button>
          </td>
      `;
  });
}

// Function to handle update button click

// Function to handle delete button click
// Function to delete a customer by UUID
async function deleteCustomerByUUID(uuid) {
  try {
      // Get the JWT token from local storage
      var jwtToken = localStorage.getItem("jwtToken");

      if (!jwtToken) {
          console.error("JWT token not found in local storage.");
          return false;
      }

      // Fetch data from the API using Authorization header
      var response = await fetch(`http://localhost:8080/api/v0/customer/${uuid}`, {
          method: "DELETE",
          headers: {
              "Authorization": "Bearer " + jwtToken
          }
      });

      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return true;
  } catch (error) {
      console.error("Error deleting customer:", error);
      return false;
  }
}

// Function to handle delete button click
async function deleteCustomer(uuid) {
  console.log(uuid.slice(1));
  // Implement delete logic
  var confirmed = confirm("Are you sure you want to delete this customer?");
  
  if (confirmed) {
      // Try to delete the customer
      var success = await deleteCustomerByUUID(uuid);

      if (success) {
          // If deletion is successful, re-render the table
          renderCustomers();
      } else {
          alert("Error deleting customer. Please try again.");
      }
  }
}

// Function to populate the update form with customer details
function populateUpdateForm(customer) {
  // Example: populate form fields with customer details
  document.getElementById("PoPupFirstName").value = customer.firstName;
  document.getElementById("PoPupLastName").value = customer.lastName;
  document.getElementById("PoPupStreet").value = customer.street;
  document.getElementById("PoPupAddress").value = customer.address;
  document.getElementById("PoPupCity").value = customer.city;
  document.getElementById("PoPupState").value = customer.state;
  document.getElementById("PoPupEmail").value = customer.email;
  document.getElementById("PoPupPhone").value = customer.phone;
  document.getElementById("PoPupSubmitButton").innerText="Update";
}

function populateAddForm(){
  document.getElementById("PoPupSubmitButton").innerText="Add";
}
// Function to submit the updatPoPup
async function submitUpdateForm(uuid) {
  try {
      // Get the JWT token from local storage
      var jwtToken = localStorage.getItem("jwtToken");

      if (!jwtToken) {
          console.error("JWT token not found in local storage.");
          return;
      }

      // Get updated values from the form
      var updatedCustomer = {
          uuid:uuid,
          firstName: document.getElementById("PoPupFirstName").value,
          lastName: document.getElementById("PoPupLastName").value,
          street: document.getElementById("PoPupStreet").value,
          address: document.getElementById("PoPupAddress").value,
          city: document.getElementById("PoPupCity").value,
          state: document.getElementById("PoPupState").value,
          email: document.getElementById("PoPupEmail").value,
          phone: document.getElementById("PoPupPhone").value
          // Add other fields as needed
      };
      console.log(updatedCustomer);
      // Perform the update using the API
      var response = await fetch("http://localhost:8080/api/v0/customer/", {
          method: "PUT",
          headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + jwtToken
          },
          body: JSON.stringify(updatedCustomer)
      });

      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Close the modal after successful update
      $('#updateModal').modal('hide');

      // Re-render the table with updated data
      customers = await fetchCustomers();
      renderCustomers(customers);
  } catch (error) {
      console.error("Error updating customer:", error);
      alert("Error updating customer. Please try again.");
  }
}

// Function to handle update button click
function updateCustomer(uuid) {
  // Find the customer in the array by UUID
  var customerToUpdate = customers.find(customer => customer.uuid === uuid);

  // Populate the update form with customer details
  populateUpdateForm(customerToUpdate);

  // Show the update modal
  $('#PoPupModal').modal('show');
  document.getElementById("PoPupSubmitButton").onclick = function () {
    submitUpdateForm(uuid);
    $('#PoPupModal').modal('hide');
};
}

async function submitAddForm() {
  try {
      // Get the JWT token from local storage
      var jwtToken = localStorage.getItem("jwtToken");

      if (!jwtToken) {
          console.error("JWT token not found in local storage.");
          return;
      }

      // Get values from the add form
      var newCustomer = {
          firstName: document.getElementById("PoPupFirstName").value,
          lastName: document.getElementById("PoPupLastName").value,
          street: document.getElementById("PoPupStreet").value,
          address: document.getElementById("PoPupAddress").value,
          city: document.getElementById("PoPupCity").value,
          state: document.getElementById("PoPupState").value,
          email: document.getElementById("PoPupEmail").value,
          phone: document.getElementById("PoPupPhone").value
          // Add other fields as needed
      };

      // Perform the add using the API
      var response = await fetch("http://localhost:8080/api/v0/customer/", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + jwtToken
          },
          body: JSON.stringify(newCustomer)
      });

      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Close the modal after successful add
      $('#addModal').modal('hide');

      // Re-render the table with updated data
      customers = await fetchCustomers();
      renderCustomers(customers);
  } catch (error) {
      console.error("Error adding customer:", error);
      alert("Error adding customer. Please try again.");
  }
}
function addCustomer() {
  // Populate the add form with empty fields
  
  populateAddForm();
  // Show the add modal
  $('#PoPupModal').modal('show');
  document.getElementById("PoPupSubmitButton").onclick = function () {
    submitAddForm();
    $('#PoPupModal').modal('hide');
};
}

// Function to handle search button click
function performSearch() {
  // Get values from the search form
  var searchType = document.getElementById("searchType").value;
  var searchValue = document.getElementById("searchValue").value;
  if(!searchValue){
    renderCustomers(customers);
    return;
  }
  // Get the JWT token from local storage
  var jwtToken = localStorage.getItem("jwtToken");

  if (!jwtToken) {
      console.error("JWT token not found in local storage.");
      // Handle the absence of the token (e.g., redirect to login)
      return;
  }

  // Define the API endpoint based on the selected search type
  var apiEndpoint;
  switch (searchType) {
      case "firstname":
          apiEndpoint = `http://localhost:8080/api/v0/customer/search/n?name=${searchValue}`;
          break;
      case "email":
          apiEndpoint = `http://localhost:8080/api/v0/customer/search/e?email=${searchValue}`;
          break;
      case "phone":
          apiEndpoint = `http://localhost:8080/api/v0/customer/search/p?phone=${searchValue}`;
          break;
      case "city":
          apiEndpoint = `http://localhost:8080/api/v0/customer/search/c?city=${searchValue}`;
          break;
      default:
          console.error("Invalid search type");
          return;
  }

  // Perform the search using the API with the JWT token in the headers
  fetch(apiEndpoint, {
      headers: {
          "Authorization": `Bearer ${jwtToken}`
      }
  })
  .then(response => {
      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
  })
  .then(data => {
    console.log(data);
    renderCustomers(data)
  })
  .catch(error => console.error("Error performing search:", error));
}

// Call the renderCustomers function to display the initial data
document.addEventListener("DOMContentLoaded",async ()=>{
  customers = await fetchCustomers();
  renderCustomers(customers);
})

