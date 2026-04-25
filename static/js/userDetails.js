const formatDate = (dateString) => {
  if (!dateString) return 'Not provided';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return 'N/A';
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const loadPatientDetails = () => {
  const user_id = localStorage.getItem("user_id");

  if (!user_id) {
    const parent = document.getElementById("user-detais-container");
    parent.innerHTML = `
      <div class="text-center py-5">
        <div class="alert alert-warning">
          <i class="fas fa-exclamation-triangle"></i>
          <p>Please login first to view your profile.</p>
          <a href="/login/" class="btn btn-primary mt-3">Go to Login</a>
        </div>
      </div>
    `;
    return;
  }

  Promise.all([
    fetch(`http://127.0.0.1:8000/patient/by-user/${user_id}/`),
    fetch(`http://127.0.0.1:8000/appointment/?patient__user__id=${user_id}`)
  ])
    .then(([patientRes, appointmentRes]) => {
      if (!patientRes.ok) {
        throw new Error(`HTTP error! status: ${patientRes.status}`);
      }
      return Promise.all([patientRes.json(), appointmentRes.json()]);
    })
    .then(([patientData, appointments]) => {
      const parent = document.getElementById("user-detais-container");
      parent.innerHTML = '';

      const user = patientData.user;
      const age = calculateAge(patientData.date_of_birth);

      const profileHTML = `
        <div class="container py-4">
          <!-- Profile Header -->
          <div class="profile-header card shadow-sm mb-4">
            <div class="card-body p-4">
              <div class="row align-items-center">
                <div class="col-md-3 text-center">
                  <div class="profile-image-wrapper">
                    ${patientData.image
                      ? `<img src="${patientData.image}" alt="Profile" class="profile-image" />`
                      : `<div class="profile-image-placeholder">
                           <i class="fas fa-user fa-5x text-muted"></i>
                         </div>`
                    }
                  </div>
                </div>
                <div class="col-md-9">
                  <h2 class="mb-1">${user.first_name} ${user.last_name}</h2>
                  <p class="text-muted mb-2"><i class="fas fa-at"></i> ${user.username}</p>
                  <div class="row mt-3">
                    <div class="col-md-6">
                      <p class="mb-2"><i class="fas fa-envelope text-primary"></i> ${user.email}</p>
                      <p class="mb-2"><i class="fas fa-phone text-primary"></i> ${patientData.mobile_no || 'Not provided'}</p>
                    </div>
                    <div class="col-md-6">
                      <p class="mb-2"><i class="fas fa-birthday-cake text-primary"></i> Age: ${age} years</p>
                      <p class="mb-2"><i class="fas fa-tint text-primary"></i> Blood Group: <span class="badge bg-danger">${patientData.blood_group}</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="row">
            <!-- Basic Information -->
            <div class="col-md-6 mb-4">
              <div class="card shadow-sm h-100">
                <div class="card-header bg-primary text-white">
                  <h5 class="mb-0"><i class="fas fa-user-circle"></i> Basic Information</h5>
                </div>
                <div class="card-body">
                  <table class="table table-borderless">
                    <tr>
                      <td><strong>Gender:</strong></td>
                      <td>${patientData.gender || 'Not specified'}</td>
                    </tr>
                    <tr>
                      <td><strong>Date of Birth:</strong></td>
                      <td>${formatDate(patientData.date_of_birth)}</td>
                    </tr>
                    <tr>
                      <td><strong>Height:</strong></td>
                      <td>${patientData.height ? patientData.height + ' cm' : 'Not provided'}</td>
                    </tr>
                    <tr>
                      <td><strong>Weight:</strong></td>
                      <td>${patientData.weight ? patientData.weight + ' kg' : 'Not provided'}</td>
                    </tr>
                    <tr>
                      <td><strong>Address:</strong></td>
                      <td>${patientData.address || 'Not provided'}</td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>

            <!-- Emergency Contact -->
            <div class="col-md-6 mb-4">
              <div class="card shadow-sm h-100">
                <div class="card-header bg-danger text-white">
                  <h5 class="mb-0"><i class="fas fa-phone-square-alt"></i> Emergency Contact</h5>
                </div>
                <div class="card-body">
                  <table class="table table-borderless">
                    <tr>
                      <td><strong>Contact Name:</strong></td>
                      <td>${patientData.emergency_contact_name || 'Not provided'}</td>
                    </tr>
                    <tr>
                      <td><strong>Contact Phone:</strong></td>
                      <td>${patientData.emergency_contact_phone || 'Not provided'}</td>
                    </tr>
                  </table>
                  ${!patientData.emergency_contact_name ?
                    '<div class="alert alert-warning mt-3 mb-0"><small><i class="fas fa-exclamation-triangle"></i> Please add emergency contact information for safety.</small></div>'
                    : ''}
                </div>
              </div>
            </div>

            <!-- Medical History -->
            <div class="col-md-12 mb-4">
              <div class="card shadow-sm">
                <div class="card-header bg-success text-white">
                  <h5 class="mb-0"><i class="fas fa-notes-medical"></i> Medical History</h5>
                </div>
                <div class="card-body">
                  <div class="row">
                    <div class="col-md-6">
                      <div class="medical-info-item mb-3">
                        <h6 class="text-primary"><i class="fas fa-allergies"></i> Allergies:</h6>
                        <p>${patientData.allergies || 'No known allergies'}</p>
                      </div>
                      <div class="medical-info-item mb-3">
                        <h6 class="text-primary"><i class="fas fa-pills"></i> Current Medications:</h6>
                        <p>${patientData.current_medications || 'None'}</p>
                      </div>
                      <div class="medical-info-item mb-3">
                        <h6 class="text-primary"><i class="fas fa-procedures"></i> Past Surgeries:</h6>
                        <p>${patientData.past_surgeries || 'None'}</p>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="medical-info-item mb-3">
                        <h6 class="text-primary"><i class="fas fa-heartbeat"></i> Chronic Diseases:</h6>
                        <p>${patientData.chronic_diseases || 'None'}</p>
                      </div>
                      <div class="medical-info-item mb-3">
                        <h6 class="text-primary"><i class="fas fa-dna"></i> Family Medical History:</h6>
                        <p>${patientData.family_medical_history || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Appointment History -->
            <div class="col-md-12 mb-4">
              <div class="card shadow-sm">
                <div class="card-header bg-info text-white d-flex justify-content-between align-items-center">
                  <h5 class="mb-0"><i class="fas fa-calendar-alt"></i> Appointment History</h5>
                  <span class="badge bg-light text-dark">${appointments.length || 0} Total</span>
                </div>
                <div class="card-body">
                  ${appointments.length > 0 ? `
                    <div class="table-responsive">
                      <table class="table table-hover">
                        <thead class="table-light">
                          <tr>
                            <th>Doctor</th>
                            <th>Symptom</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th>Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          ${appointments.slice(0, 10).map(apt => `
                            <tr>
                              <td>${apt.doctor}</td>
                              <td>${apt.symptom}</td>
                              <td><span class="badge bg-secondary">${apt.appointment_types}</span></td>
                              <td><span class="badge ${
                                apt.appointment_status === 'Completed' ? 'bg-success' :
                                apt.appointment_status === 'Running' ? 'bg-warning' : 'bg-primary'
                              }">${apt.appointment_status}</span></td>
                              <td>${apt.time}</td>
                            </tr>
                          `).join('')}
                        </tbody>
                      </table>
                    </div>
                    ${appointments.length > 10 ? '<p class="text-muted text-center mb-0"><small>Showing 10 most recent appointments</small></p>' : ''}
                  ` : `
                    <div class="text-center py-4">
                      <i class="fas fa-calendar-times fa-3x text-muted mb-3"></i>
                      <p class="text-muted">No appointments found</p>
                      <a href="/" class="btn btn-primary btn-sm">Book Appointment</a>
                    </div>
                  `}
                </div>
              </div>
            </div>
          </div>

          <!-- Edit Profile Button -->
          <div class="text-center mt-4">
            <a href="/patient/edit-profile/" class="btn btn-primary btn-lg">
              <i class="fas fa-edit"></i> Edit Profile
            </a>
          </div>
        </div>
      `;

      parent.innerHTML = profileHTML;
    })
    .catch((error) => {
      console.error("Error loading patient details:", error);
      const parent = document.getElementById("user-detais-container");
      parent.innerHTML = `
        <div class="container py-5">
          <div class="alert alert-danger text-center">
            <i class="fas fa-exclamation-circle fa-3x mb-3"></i>
            <h4>Failed to load profile</h4>
            <p>There was an error loading your profile. Please try again.</p>
            <button onclick="location.reload()" class="btn btn-primary mt-3">
              <i class="fas fa-redo"></i> Retry
            </button>
          </div>
        </div>
      `;
    });
};

loadPatientDetails();
