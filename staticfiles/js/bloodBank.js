// Blood Bank JavaScript

const API_BASE_URL = 'http://127.0.0.1:8000/blood_bank/api/';

// Get CSRF token from cookie
function getCookie(name) {
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
}

// Load Blood Banks on page load
document.addEventListener('DOMContentLoaded', function() {
    loadBloodBanks();
    loadBloodRequests();
    setupDonorRegistration();
});

// Load Blood Banks
async function loadBloodBanks() {
    try {
        const response = await fetch(`${API_BASE_URL}banks/`);
        const data = await response.json();

        displayBloodBanks(data);
        populateCityFilter(data);
    } catch (error) {
        console.error('Error loading blood banks:', error);
        document.getElementById('bloodBanksList').innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger">
                    <i class="fas fa-exclamation-triangle"></i> Error loading blood banks. Please try again later.
                </div>
            </div>
        `;
    }
}

// Display Blood Banks
function displayBloodBanks(banks) {
    const container = document.getElementById('bloodBanksList');

    if (banks.length === 0) {
        container.innerHTML = `
            <div class="col-12">
                <div class="alert alert-info">
                    <i class="fas fa-info-circle"></i> No blood banks found.
                </div>
            </div>
        `;
        return;
    }

    container.innerHTML = banks.map(bank => `
        <div class="col-md-6 mb-4">
            <div class="blood-card">
                <h4><i class="fas fa-hospital text-danger"></i> ${bank.name}</h4>
                <p class="mb-2"><strong>Hospital:</strong> ${bank.hospital_name}</p>
                <p class="mb-2"><i class="fas fa-map-marker-alt"></i> ${bank.address}, ${bank.city}</p>
                <p class="mb-2"><i class="fas fa-phone"></i> ${bank.phone}</p>
                ${bank.email ? `<p class="mb-2"><i class="fas fa-envelope"></i> ${bank.email}</p>` : ''}

                <hr>
                <h5 class="mb-3">Blood Availability</h5>
                <div class="blood-unit-display">
                    <div class="blood-unit-card">
                        <div class="blood-group-badge" style="font-size: 1rem; padding: 5px 10px;">A+</div>
                        <h4>${bank.a_positive_units}</h4>
                        <small>units</small>
                    </div>
                    <div class="blood-unit-card">
                        <div class="blood-group-badge" style="font-size: 1rem; padding: 5px 10px;">A-</div>
                        <h4>${bank.a_negative_units}</h4>
                        <small>units</small>
                    </div>
                    <div class="blood-unit-card">
                        <div class="blood-group-badge" style="font-size: 1rem; padding: 5px 10px;">B+</div>
                        <h4>${bank.b_positive_units}</h4>
                        <small>units</small>
                    </div>
                    <div class="blood-unit-card">
                        <div class="blood-group-badge" style="font-size: 1rem; padding: 5px 10px;">B-</div>
                        <h4>${bank.b_negative_units}</h4>
                        <small>units</small>
                    </div>
                    <div class="blood-unit-card">
                        <div class="blood-group-badge" style="font-size: 1rem; padding: 5px 10px;">AB+</div>
                        <h4>${bank.ab_positive_units}</h4>
                        <small>units</small>
                    </div>
                    <div class="blood-unit-card">
                        <div class="blood-group-badge" style="font-size: 1rem; padding: 5px 10px;">AB-</div>
                        <h4>${bank.ab_negative_units}</h4>
                        <small>units</small>
                    </div>
                    <div class="blood-unit-card">
                        <div class="blood-group-badge" style="font-size: 1rem; padding: 5px 10px;">O+</div>
                        <h4>${bank.o_positive_units}</h4>
                        <small>units</small>
                    </div>
                    <div class="blood-unit-card">
                        <div class="blood-group-badge" style="font-size: 1rem; padding: 5px 10px;">O-</div>
                        <h4>${bank.o_negative_units}</h4>
                        <small>units</small>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Populate City Filter
function populateCityFilter(banks) {
    const cities = [...new Set(banks.map(bank => bank.city))];
    const cityFilter = document.getElementById('cityFilter');

    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        cityFilter.appendChild(option);
    });
}

// Filter Donors
async function filterDonors() {
    const bloodGroup = document.getElementById('bloodGroupFilter').value;
    const city = document.getElementById('donorCityFilter').value;

    let url = `${API_BASE_URL}donors/available/`;
    const params = new URLSearchParams();

    if (bloodGroup) params.append('blood_group', bloodGroup);
    if (city) params.append('city', city);

    if (params.toString()) {
        url = `${API_BASE_URL}donors/?${params.toString()}`;
    }

    try {
        const response = await fetch(url);
        const data = await response.json();
        displayDonors(data);
    } catch (error) {
        console.error('Error loading donors:', error);
        document.getElementById('donorsList').innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger">
                    <i class="fas fa-exclamation-triangle"></i> Error loading donors. Please try again later.
                </div>
            </div>
        `;
    }
}

// Display Donors
function displayDonors(donors) {
    const container = document.getElementById('donorsList');

    if (donors.length === 0) {
        container.innerHTML = `
            <div class="col-12">
                <div class="alert alert-info">
                    <i class="fas fa-info-circle"></i> No donors found with the selected criteria.
                </div>
            </div>
        `;
        return;
    }

    container.innerHTML = donors.map(donor => `
        <div class="col-md-6 mb-4">
            <div class="blood-card">
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <h5><i class="fas fa-user"></i> ${donor.user_details.first_name} ${donor.user_details.last_name}</h5>
                        <span class="blood-group-badge">${donor.blood_group}</span>
                    </div>
                    <div>
                        ${donor.is_available ?
                            '<span class="available-badge"><i class="fas fa-check-circle"></i> Available</span>' :
                            '<span class="unavailable-badge"><i class="fas fa-times-circle"></i> Not Available</span>'}
                    </div>
                </div>
                <hr>
                <p class="mb-2"><i class="fas fa-phone"></i> ${donor.phone}</p>
                <p class="mb-2"><i class="fas fa-map-marker-alt"></i> ${donor.city}</p>
                <p class="mb-2"><i class="fas fa-home"></i> ${donor.address}</p>
                ${donor.last_donation_date ?
                    `<p class="mb-2"><i class="fas fa-calendar"></i> Last Donation: ${new Date(donor.last_donation_date).toLocaleDateString()}</p>` :
                    '<p class="mb-2"><i class="fas fa-calendar"></i> No previous donations</p>'}
            </div>
        </div>
    `).join('');
}

// Load Blood Requests
async function loadBloodRequests() {
    try {
        const response = await fetch(`${API_BASE_URL}requests/`);

        if (response.status === 403 || response.status === 401) {
            document.getElementById('requestsList').innerHTML = `
                <div class="col-12">
                    <div class="alert alert-warning">
                        <i class="fas fa-lock"></i> Please login to view blood requests.
                    </div>
                </div>
            `;
            return;
        }

        const data = await response.json();
        displayBloodRequests(data);
    } catch (error) {
        console.error('Error loading blood requests:', error);
        document.getElementById('requestsList').innerHTML = `
            <div class="col-12">
                <div class="alert alert-info">
                    <i class="fas fa-info-circle"></i> Blood requests are available for logged-in users only.
                </div>
            </div>
        `;
    }
}

// Filter Blood Requests
async function filterRequests() {
    const bloodGroup = document.getElementById('requestBloodGroupFilter').value;
    const urgency = document.getElementById('requestUrgencyFilter').value;

    let url = `${API_BASE_URL}requests/`;
    const params = new URLSearchParams();

    if (bloodGroup) params.append('blood_group', bloodGroup);
    if (urgency) params.append('urgency', urgency);

    if (params.toString()) {
        url += `?${params.toString()}`;
    }

    try {
        const response = await fetch(url);

        if (response.status === 403 || response.status === 401) {
            document.getElementById('requestsList').innerHTML = `
                <div class="col-12">
                    <div class="alert alert-warning">
                        <i class="fas fa-lock"></i> Please login to view blood requests.
                    </div>
                </div>
            `;
            return;
        }

        const data = await response.json();
        displayBloodRequests(data);
    } catch (error) {
        console.error('Error loading blood requests:', error);
    }
}

// Display Blood Requests
function displayBloodRequests(requests) {
    const container = document.getElementById('requestsList');

    if (requests.length === 0) {
        container.innerHTML = `
            <div class="col-12">
                <div class="alert alert-info">
                    <i class="fas fa-info-circle"></i> No blood requests found.
                </div>
            </div>
        `;
        return;
    }

    container.innerHTML = requests.map(request => `
        <div class="col-md-6 mb-4">
            <div class="blood-card">
                <div class="d-flex justify-content-between align-items-start mb-3">
                    <span class="blood-group-badge">${request.blood_group}</span>
                    <span class="urgency-${request.urgency.toLowerCase()}">${request.urgency}</span>
                </div>
                <p class="mb-2"><strong>Patient:</strong> ${request.patient_name || 'N/A'}</p>
                <p class="mb-2"><strong>Units Required:</strong> ${request.units_required}</p>
                <p class="mb-2"><strong>Hospital:</strong> ${request.hospital_name}</p>
                <p class="mb-2"><i class="fas fa-map-marker-alt"></i> ${request.hospital_address}</p>
                <p class="mb-2"><i class="fas fa-phone"></i> ${request.contact_number}</p>
                <p class="mb-2"><strong>Required By:</strong> ${new Date(request.required_by_date).toLocaleDateString()}</p>
                <p class="mb-2"><strong>Reason:</strong> ${request.reason}</p>
                <hr>
                <div class="d-flex justify-content-between align-items-center">
                    <span class="badge status-${request.status.toLowerCase()}">${request.status}</span>
                    <small class="text-muted">Posted: ${new Date(request.created_at).toLocaleDateString()}</small>
                </div>
            </div>
        </div>
    `).join('');
}

// Setup Donor Registration Form
function setupDonorRegistration() {
    const form = document.getElementById('donorRegistrationForm');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Remove csrfmiddlewaretoken from data (we'll send it in header instead)
        delete data.csrfmiddlewaretoken;

        // Get CSRF token from cookie or form
        let csrftoken = getCookie('csrftoken');
        if (!csrftoken) {
            const csrfInput = form.querySelector('[name=csrfmiddlewaretoken]');
            if (csrfInput) {
                csrftoken = csrfInput.value;
            }
        }

        try {
            const response = await fetch(`${API_BASE_URL}donors/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken,
                },
                body: JSON.stringify(data)
            });

            const messageDiv = document.getElementById('registrationMessage');

            if (response.ok) {
                messageDiv.innerHTML = `
                    <div class="alert alert-success">
                        <i class="fas fa-check-circle"></i> Registration successful! Thank you for becoming a blood donor.
                    </div>
                `;
                form.reset();
            } else {
                const errorData = await response.json();
                messageDiv.innerHTML = `
                    <div class="alert alert-danger">
                        <i class="fas fa-exclamation-triangle"></i> Registration failed: ${JSON.stringify(errorData)}
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error registering donor:', error);
            document.getElementById('registrationMessage').innerHTML = `
                <div class="alert alert-danger">
                    <i class="fas fa-exclamation-triangle"></i> An error occurred. Please try again later.
                </div>
            `;
        }
    });
}

// Search functionality for blood banks
document.getElementById('bankSearchInput')?.addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const cards = document.querySelectorAll('#bloodBanksList .blood-card');

    cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        card.parentElement.style.display = text.includes(searchTerm) ? 'block' : 'none';
    });
});

// City filter for blood banks
document.getElementById('cityFilter')?.addEventListener('change', async function(e) {
    const city = e.target.value;

    try {
        let url = `${API_BASE_URL}banks/`;
        if (city) {
            url += `?city=${city}`;
        }

        const response = await fetch(url);
        const data = await response.json();
        displayBloodBanks(data);
    } catch (error) {
        console.error('Error filtering by city:', error);
    }
});
