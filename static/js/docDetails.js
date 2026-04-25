const BASE_URL = "http://127.0.0.1:8000";

const getDoctorIdFromUrl = () => {
  const param = new URLSearchParams(window.location.search).get("doctorId");
  if (!param) {
    console.error("No doctorId provided in URL");
    return null;
  }
  return param;
};

const getparams = () => {
  const param = getDoctorIdFromUrl();
  if (!param) {
    showError("No doctor ID provided in URL");
    return;
  }

  loadTime(param);

  // doctor detail
  fetch(`${BASE_URL}/doctor/list/${param}/`)
    .then((res) => {
      if (!res.ok) {
        console.error("Doctor detail HTTP error:", res.status);
        return res.text().then((t) => {
          console.error("Doctor detail raw response:", t);
          throw new Error("Failed to load doctor details");
        });
      }
      return res.json();
    })
    .then((data) => displayDetails(data))
    .catch((err) => {
      console.error("Doctor detail fetch error:", err);
      showError(`Failed to load doctor details. ${err.message}`);
    });

  // doctor reviews
  fetch(`${BASE_URL}/doctor/reviews/?doctor_id=${param}`)
    .then((res) => {
      if (!res.ok) {
        console.error("Review HTTP error:", res.status);
        return res.text().then((t) => {
          console.error("Review raw response:", t);
          throw new Error("Failed to load reviews");
        });
      }
      return res.json();
    })
    .then((data) => doctorReview(data))
    .catch((err) => {
      console.error("Review fetch error:", err);
      // Show a message in the review section instead of hiding it
      const reviewContainer = document.getElementById("doc-details-review");
      if (reviewContainer) {
        reviewContainer.innerHTML = '<li class="text-center text-muted">No reviews available</li>';
      }
    });
};

const showError = (message) => {
  const parent = document.getElementById("doc-details");
  if (parent) {
    parent.innerHTML = `
      <div class="alert alert-danger text-center" role="alert">
        <i class="fas fa-exclamation-triangle"></i> ${message}
        <br><br>
        <a href="index.html" class="btn btn-primary">
          <i class="fas fa-home"></i> Go Back to Home
        </a>
      </div>
    `;
  }
};

const doctorReview = (reviews) => {
  const parent = document.getElementById("doc-details-review");
  if (!parent) return;

  if (!Array.isArray(reviews)) {
    console.error("doctorReview expected array, got:", reviews);
    parent.innerHTML = '<li class="text-center text-muted">No reviews available</li>';
    return;
  }

  parent.innerHTML = "";

  if (reviews.length === 0) {
    parent.innerHTML = '<li class="text-center text-muted py-4">No reviews yet for this doctor</li>';
    return;
  }

  reviews.forEach((review) => {
    const li = document.createElement("li");

    // Generate star rating using function from app.js
    const stars = typeof generateStarRating === 'function'
      ? generateStarRating(review.rating || 5)
      : '★★★★★'; // Fallback if function not available

    li.innerHTML = `
      <div class="review-card">
        <div class="review-image-wrapper">
          <img src="https://i.pravatar.cc/150?u=${review.reviewer}" alt="${review.reviewer}" onerror="this.src='https://i.pravatar.cc/150?img=68'" />
        </div>
        <h4 class="reviewer-name">${review.reviewer}</h4>
        <div class="star-rating">
          ${stars}
        </div>
        <p class="review-text">${review.body || "No comment provided"}</p>
      </div>
    `;
    parent.appendChild(li);
  });
};

const displayDetails = (doctor) => {
  console.log("Doctor detail:", doctor);

  const parent = document.getElementById("doc-details");
  if (!parent) {
    console.error("doc-details container not found");
    return;
  }

  parent.innerHTML = "";

  const div = document.createElement("div");
  div.classList.add("doc-details-container", "row", "align-items-center", "g-4");

  const specializationHtml = Array.isArray(doctor.specialization) && doctor.specialization.length > 0
    ? `<div class="specializations mb-3">
         ${doctor.specialization.map((item) => `<span class="badge bg-primary me-2 mb-2">${item}</span>`).join("")}
       </div>`
    : "";

  const designationHtml = Array.isArray(doctor.designation) && doctor.designation.length > 0
    ? `<p class="text-muted mb-3"><i class="fas fa-user-md"></i> ${doctor.designation.join(", ")}</p>`
    : "";

  div.innerHTML = `
    <div class="col-md-4 text-center">
      <div class="doctor-img-wrapper">
        <img src="${doctor.image || 'https://via.placeholder.com/300x300?text=No+Image'}"
             alt="${doctor.full_name || 'Doctor'}"
             class="img-fluid rounded shadow"
             onerror="this.src='https://via.placeholder.com/300x300?text=No+Image'" />
      </div>
    </div>
    <div class="col-md-8">
      <div class="doc-info">
        <h1 class="mb-3">${doctor.full_name || 'Doctor Name Not Available'}</h1>
        ${designationHtml}
        ${specializationHtml}

        <div class="doctor-description mb-4">
          <h5><i class="fas fa-info-circle"></i> About</h5>
          <p>
            ${doctor.description || 'Professional healthcare provider with expertise in various medical fields. Dedicated to providing quality care and treatment to all patients.'}
          </p>
        </div>

        <div class="doctor-fees mb-4">
          <h4><i class="fas fa-money-bill-wave"></i> Consultation Fee: <span class="text-primary">${doctor.fee || 'N/A'} BDT</span></h4>
        </div>

        <button
          type="button"
          class="btn btn-primary btn-lg"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
        >
          <i class="fas fa-calendar-plus"></i> Book Appointment
        </button>
      </div>
    </div>
  `;
  parent.appendChild(div);
};

const loadTime = (id) => {
  if (!id) {
    console.error("loadTime called without doctor id");
    return;
  }

  fetch(`${BASE_URL}/doctor/available_time/?doctor_id=${id}`)
    .then((res) => {
      if (!res.ok) {
        console.error("Available time HTTP error:", res.status);
        return res.text().then((t) => {
          console.error("Available time raw response:", t);
          throw new Error("Failed to load available times");
        });
      }
      return res.json();
    })
    .then((data) => {
      const parent = document.getElementById("time-container");
      if (!parent) {
        console.error("time-container not found");
        return;
      }

      parent.innerHTML = '<option value="" selected>Select available time</option>';

      if (!Array.isArray(data) || data.length === 0) {
        const option = document.createElement("option");
        option.value = "";
        option.innerText = "No available times";
        option.disabled = true;
        parent.appendChild(option);
        console.log("No available times for this doctor");
        return;
      }

      data.forEach((item) => {
        const option = document.createElement("option");
        option.value = item.id;
        option.innerText = item.name;
        parent.appendChild(option);
      });
      console.log("Available times loaded:", data.length);
    })
    .catch((err) => {
      console.error("Available time fetch error:", err);
      const parent = document.getElementById("time-container");
      if (parent) {
        parent.innerHTML = '<option value="">Error loading times</option>';
      }
    });
};

const handleAppointment = () => {
  const param = getDoctorIdFromUrl();
  if (!param) return;

  const status = document.getElementsByName("status");
  const selected = Array.from(status).find((button) => button.checked);
  const symptom = document.getElementById("symptom").value;
  const time = document.getElementById("time-container");
  const selectedTime = time.options[time.selectedIndex];
  const patient_id = localStorage.getItem("patient_id");

  const info = {
    appointment_type: selected ? selected.value : null,
    appointment_status: "Pending",
    time: selectedTime ? selectedTime.value : null,
    symptom: symptom,
    cancel: false,
    patient: patient_id,
    doctor: param,
  };

  console.log("Appointment payload:", info);

  fetch(`${BASE_URL}/appointment/`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(info),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("Appointment response:", data);
      window.location.href = `pdf.html?doctorId=${param}`;
    })
    .catch((err) => console.error("Appointment error:", err));
};

const loadPatientId = () => {
  const user_id = localStorage.getItem("user_id");
  if (!user_id) {
    console.error("No user_id in localStorage");
    return;
  }

  fetch(`${BASE_URL}/patient/list/?user_id=${user_id}`)
    .then((res) => res.json())
    .then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        localStorage.setItem("patient_id", data[0].id);
      } else {
        console.error("No patient for this user_id:", data);
      }
    })
    .catch((err) => console.error("loadPatientId error:", err));
};

loadPatientId();
getparams(); 
