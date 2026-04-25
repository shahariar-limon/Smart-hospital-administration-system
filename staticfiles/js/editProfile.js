const loadProfileData = () => {
  const user_id = localStorage.getItem("user_id");

  if (!user_id) {
    window.location.href = "/login/";
    return;
  }

  fetch(`http://127.0.0.1:8000/patient/by-user/${user_id}/`)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      const user = data.user;

      // Populate form fields with existing data
      document.getElementById("first_name").value = user.first_name || "";
      document.getElementById("last_name").value = user.last_name || "";
      document.getElementById("email").value = user.email || "";
      document.getElementById("mobile_no").value = data.mobile_no || "";
      document.getElementById("gender").value = data.gender || "";
      document.getElementById("date_of_birth").value = data.date_of_birth || "";
      document.getElementById("blood_group").value = data.blood_group || "Unknown";
      document.getElementById("address").value = data.address || "";
      document.getElementById("height").value = data.height || "";
      document.getElementById("weight").value = data.weight || "";
      document.getElementById("emergency_contact_name").value = data.emergency_contact_name || "";
      document.getElementById("emergency_contact_phone").value = data.emergency_contact_phone || "";
      document.getElementById("allergies").value = data.allergies || "";
      document.getElementById("chronic_diseases").value = data.chronic_diseases || "";
      document.getElementById("current_medications").value = data.current_medications || "";
      document.getElementById("past_surgeries").value = data.past_surgeries || "";
      document.getElementById("family_medical_history").value = data.family_medical_history || "";

      // Hide loading spinner and show form
      document.getElementById("loading-spinner").style.display = "none";
      document.getElementById("edit-profile-form").style.display = "block";
    })
    .catch((error) => {
      console.error("Error loading profile:", error);
      document.getElementById("loading-spinner").style.display = "none";
      document.getElementById("error-container").style.display = "block";
      document.getElementById("error-message").textContent = "Failed to load profile data. Please try again.";
    });
};

const handleFormSubmit = (e) => {
  e.preventDefault();

  const user_id = localStorage.getItem("user_id");
  const token = localStorage.getItem("token");

  if (!user_id || !token) {
    window.location.href = "/login/";
    return;
  }

  // Get form data
  const formData = {
    first_name: document.getElementById("first_name").value,
    last_name: document.getElementById("last_name").value,
    email: document.getElementById("email").value,
    mobile_no: document.getElementById("mobile_no").value,
    gender: document.getElementById("gender").value,
    date_of_birth: document.getElementById("date_of_birth").value,
    blood_group: document.getElementById("blood_group").value,
    address: document.getElementById("address").value,
    height: document.getElementById("height").value,
    weight: document.getElementById("weight").value,
    emergency_contact_name: document.getElementById("emergency_contact_name").value,
    emergency_contact_phone: document.getElementById("emergency_contact_phone").value,
    allergies: document.getElementById("allergies").value,
    chronic_diseases: document.getElementById("chronic_diseases").value,
    current_medications: document.getElementById("current_medications").value,
    past_surgeries: document.getElementById("past_surgeries").value,
    family_medical_history: document.getElementById("family_medical_history").value,
  };

  // Disable submit button to prevent double submission
  const saveBtn = document.getElementById("save-btn");
  saveBtn.disabled = true;
  saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

  // Send update request
  fetch(`http://127.0.0.1:8000/patient/update-profile/${user_id}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(formData),
  })
    .then((res) => {
      if (!res.ok) {
        return res.json().then(err => {
          throw new Error(err.error || `HTTP error! status: ${res.status}`);
        }).catch(() => {
          throw new Error(`HTTP error! status: ${res.status}`);
        });
      }
      return res.json();
    })
    .then((data) => {
      // Show success message
      const successAlert = document.createElement("div");
      successAlert.className = "alert alert-success alert-dismissible fade show";
      successAlert.innerHTML = `
        <i class="fas fa-check-circle"></i> ${data.message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      `;

      const form = document.getElementById("edit-profile-form");
      form.insertBefore(successAlert, form.firstChild);

      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: "smooth" });

      // Redirect to profile page after 2 seconds
      setTimeout(() => {
        window.location.href = "/userDetails.html";
      }, 2000);
    })
    .catch((error) => {
      console.error("Error updating profile:", error);

      // Show error message with details
      const errorAlert = document.createElement("div");
      errorAlert.className = "alert alert-danger alert-dismissible fade show";
      errorAlert.innerHTML = `
        <i class="fas fa-exclamation-circle"></i> Failed to update profile. ${error.message || 'Please try again.'}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      `;

      const form = document.getElementById("edit-profile-form");
      form.insertBefore(errorAlert, form.firstChild);

      // Scroll to top to show error message
      window.scrollTo({ top: 0, behavior: "smooth" });

      // Re-enable submit button
      saveBtn.disabled = false;
      saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Changes';
    });
};

// Load profile data when page loads
document.addEventListener("DOMContentLoaded", () => {
  loadProfileData();

  // Attach form submit handler
  const form = document.getElementById("edit-profile-form");
  if (form) {
    form.addEventListener("submit", handleFormSubmit);
  }
});
