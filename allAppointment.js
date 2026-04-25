const loadAllAppointment = () => {
  const patient_id = localStorage.getItem("patient_id");
  
  // Set timeout to hide loading after 3 seconds
  setTimeout(() => {
    fetch(`http://127.0.0.1:8000/appointment/?patient_id=${patient_id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        const parent = document.getElementById("table-body");
        parent.innerHTML = '';
        
        if (data.length === 0) {
          parent.innerHTML = `
            <tr>
              <td colspan="7" class="text-center py-5">
                <i class="fas fa-calendar-times fa-3x text-muted mb-3"></i>
                <p class="text-muted">No appointments found</p>
              </td>
            </tr>
          `;
        } else {
          data.forEach((item) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
              <td>${item.id}</td>
              <td>${item.symptom}</td>
              <td>${item.appointment_type}</td>
              <td>${item.appointment_status}</td>
              <td>${item.doctor}</td>
              ${
                item.appointment_status == "Pending"
                  ? `<td class="text-danger">X</td>`
                  : `<td>X</td>`
              }
              <td>1200</td>
            `;
            parent.appendChild(tr);
          });
        }
      })
      .catch((error) => {
        console.error('Error loading appointments:', error);
        const parent = document.getElementById("table-body");
        parent.innerHTML = `
          <tr>
            <td colspan="7" class="text-center py-5 text-danger">
              <i class="fas fa-exclamation-triangle fa-3x mb-3"></i>
              <p>Failed to load appointments. Please try again.</p>
            </td>
          </tr>
        `;
      });
  }, 3000);
};

loadAllAppointment();
