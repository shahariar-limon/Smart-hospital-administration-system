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
    .catch((err) => console.error("Doctor detail fetch error:", err));

  // doctor reviews
  fetch(`${BASE_URL}/doctor/review/?doctor_id=${param}`)
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
    .catch((err) => console.error("Review fetch error:", err));
};

const doctorReview = (reviews) => {
  if (!Array.isArray(reviews)) {
    console.error("doctorReview expected array, got:", reviews);
    return;
  }

  const parent = document.getElementById("doc-details-review");
  parent.innerHTML = "";

  reviews.forEach((review) => {
    const div = document.createElement("div");
    div.classList.add("review-card");
    div.innerHTML = `
      <img src="./Images/girl.png" alt="" />
      <h4>${review.reviewer}</h4>
      <p>${(review.body || "").slice(0, 100)}</p>
      <h6>${review.rating}</h6>
    `;
    parent.appendChild(div);
  });
};

const displayDetails = (doctor) => {
  console.log("Doctor detail:", doctor);

  const parent = document.getElementById("doc-details");
  parent.innerHTML = ""; 

  const div = document.createElement("div");
  div.classList.add("doc-details-container");

  const specializationHtml = Array.isArray(doctor.specialization)
    ? doctor.specialization
        .map((item) => `<button class="doc-detail-btn">${item}</button>`)
        .join("")
    : "";

  const designationHtml = Array.isArray(doctor.designation)
    ? doctor.designation.map((item) => `<h4>${item}</h4>`).join("")
    : "";

  div.innerHTML = `
    <div class="doctor-img">
      <img src="${doctor.image}" alt="" />
    </div>
    <div class="doc-info">
      <h1>${doctor.full_name}</h1>
      ${specializationHtml}
      ${designationHtml}

      <p class="w-50">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Et quibusdam
        quis excepturi tempore. Eius, qui!
      </p>

      <h4>Fees: ${doctor.fee} BDT</h4>
      <button
        type="button"
        class="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        Take Appointment
      </button>
    </div>
  `;
  parent.appendChild(div);
};

const loadTime = (id) => {
  if (!id) {
    console.error("loadTime called without doctor id");
    return;
  }

  fetch(`${BASE_URL}/doctor/availabletime/?doctor_id=${id}`)
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
      parent.innerHTML = ""; 

      data.forEach((item) => {
        const option = document.createElement("option");
        option.value = item.id;
        option.innerText = item.name;
        parent.appendChild(option);
      });
      console.log("Available times:", data);
    })
    .catch((err) => console.error("Available time fetch error:", err));
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
      window.location.href = `/pdf.html?doctorId=${param}`;
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
