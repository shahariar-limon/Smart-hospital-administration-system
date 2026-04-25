const BASE_URL = "http://127.0.0.1:8000";

console.log("auth.js loaded");

const getValue = (id) => {
  const value = document.getElementById(id).value;
  return value;
};

// Function to get CSRF token from cookie
const getCookie = (name) => {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
};

// Function to get CSRF token from form or cookie
const getCSRFToken = () => {
  // First try to get from form input
  const csrfInput = document.querySelector('input[name="csrfmiddlewaretoken"]');
  if (csrfInput) {
    return csrfInput.value;
  }
  // Fallback to cookie
  return getCookie('csrftoken');
};

const handleRegistration = (event) => {
  event.preventDefault();
  const username = getValue("username");
  const first_name = getValue("first_name");
  const last_name = getValue("last_name");
  const email = getValue("email");
  const password = getValue("password");
  const confirm_password = getValue("confirm_password");
  const info = {
    username,
    first_name,
    last_name,
    email,
    password,
    confirm_password,
  };

  if (password === confirm_password) {
    document.getElementById("error").innerText = "";
    if (
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
        password
      )
    ) {
      console.log("Registration payload:", info);

      const csrfToken = getCSRFToken();
      console.log("CSRF Token:", csrfToken);

      fetch(`${BASE_URL}/patient/register/`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "X-CSRFToken": csrfToken
        },
        body: JSON.stringify(info),
      })
        .then((res) => {
          console.log("Response status:", res.status);
          return res.json();
        })
        .then((data) => {
          console.log("Registration response:", data);
          console.log("Response type:", typeof data);

          // Check if registration was successful (response is a string)
          if (typeof data === 'string' && data.includes('Check your mail')) {
            document.getElementById("success").innerText = data;
            document.getElementById("error").innerText = "";

            // Clear the form
            document.getElementById("username").value = "";
            document.getElementById("first_name").value = "";
            document.getElementById("last_name").value = "";
            document.getElementById("email").value = "";
            document.getElementById("password").value = "";
            document.getElementById("confirm_password").value = "";
            document.getElementById("terms").checked = false;

            // Optionally redirect to login after 3 seconds
            setTimeout(() => {
              window.location.href = "/login/";
            }, 3000);
          }
          // Handle validation errors from backend (object with error fields)
          else if (typeof data === 'object' && data !== null) {
            let errorMessage = "";

            // Check for general error message
            if (data.error) {
              errorMessage = Array.isArray(data.error) ? data.error.join(", ") : data.error;
            }
            // Check for specific field errors
            else {
              if (data.username) {
                errorMessage += "Username: " + (Array.isArray(data.username) ? data.username.join(", ") : data.username) + "\n";
              }
              if (data.email) {
                errorMessage += "Email: " + (Array.isArray(data.email) ? data.email.join(", ") : data.email) + "\n";
              }
              if (data.password) {
                errorMessage += "Password: " + (Array.isArray(data.password) ? data.password.join(", ") : data.password) + "\n";
              }
              if (data.confirm_password) {
                errorMessage += "Confirm Password: " + (Array.isArray(data.confirm_password) ? data.confirm_password.join(", ") : data.confirm_password) + "\n";
              }
              if (data.first_name) {
                errorMessage += "First Name: " + (Array.isArray(data.first_name) ? data.first_name.join(", ") : data.first_name) + "\n";
              }
              if (data.last_name) {
                errorMessage += "Last Name: " + (Array.isArray(data.last_name) ? data.last_name.join(", ") : data.last_name) + "\n";
              }

              // If no specific field errors, show the whole response
              if (!errorMessage) {
                errorMessage = JSON.stringify(data, null, 2);
              }
            }

            document.getElementById("error").innerText = errorMessage || "Registration failed. Please check your input.";
            document.getElementById("success").innerText = "";
          }
          else {
            document.getElementById("error").innerText = "Something went wrong. Please try again. Response: " + JSON.stringify(data);
            document.getElementById("success").innerText = "";
          }
        })
        .catch((err) => {
          console.error("Registration error:", err);
          document.getElementById("error").innerText = "Network error. Please check your connection and try again.";
          document.getElementById("success").innerText = "";
        });
    } else {
      document.getElementById("error").innerText =
        "pass must contain eight characters, at least one letter, one number and one special character:";
    }
  } else {
    document.getElementById("error").innerText =
      "password and confirm password do not match";
    alert("password and confirm password do not match");
  }
};

const handleLogin = (event) => {
  event.preventDefault();
  console.log("handleLogin called");  // debug

  const username = getValue("login-username");
  const password = getValue("login-password");
  console.log("Login input:", username, password);

  if (username && password) {
    const csrfToken = getCSRFToken();
    console.log("CSRF Token:", csrfToken);

    fetch(`${BASE_URL}/patient/api/login/`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-CSRFToken": csrfToken
      },
      body: JSON.stringify({ username, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Login response:", data);

        if (data.token && data.user_id) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user_id", data.user_id);
          window.location.href = "/index.html";
        } else {
          alert("Login failed. Check username/password.");
        }
      })
      .catch((err) => {
        console.error("Login error:", err);
        alert("Something went wrong while logging in.");
      });
  } else {
    alert("Please enter username and password.");
  }
};
