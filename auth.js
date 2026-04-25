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

      fetch(`${BASE_URL}/patient/register/`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "X-CSRFToken": csrfToken
        },
        body: JSON.stringify(info),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Registration response:", data);
          if (data.error || data.username || data.email) {
            // Handle validation errors
            document.getElementById("error").innerText = JSON.stringify(data);
          } else {
            // Success message
            document.getElementById("error").innerText = "";
            document.getElementById("success").innerText = data;
          }
        })
        .catch((err) => {
          console.error("Registration error:", err);
          document.getElementById("error").innerText = "An error occurred during registration.";
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

    fetch(`${BASE_URL}/patient/login/`, {
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
