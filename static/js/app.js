// Banner Carousel Functionality
let currentBannerSlide = 0;
const banners = document.querySelectorAll('.banner');
const totalBanners = banners.length;
let bannerAutoPlayInterval = null;
let isBannerPlaying = true;

const initBannerCarousel = () => {
  // Check if banners exist on this page
  const banners = document.querySelectorAll('.banner');
  if (banners.length === 0) {
    console.log("No banners found on this page, skipping banner carousel initialization");
    return;
  }

  createBannerDots();

  const prevBtn = document.getElementById("prevBanner");
  const nextBtn = document.getElementById("nextBanner");
  const playPauseBtn = document.getElementById("playPauseBanner");
  const carouselWrapper = document.querySelector(".banner-carousel-wrapper");

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener("click", () => {
      changeBannerSlide(-1);
      resetBannerAutoPlay();
    });
    nextBtn.addEventListener("click", () => {
      changeBannerSlide(1);
      resetBannerAutoPlay();
    });
  }

  // Play/Pause button functionality
  if (playPauseBtn) {
    playPauseBtn.addEventListener("click", toggleBannerAutoPlay);
  }

  // Pause on hover
  if (carouselWrapper) {
    carouselWrapper.addEventListener("mouseenter", pauseBannerAutoPlay);
    carouselWrapper.addEventListener("mouseleave", () => {
      if (isBannerPlaying) {
        startBannerAutoPlay();
      }
    });
  }

  // Start auto-play
  startBannerAutoPlay();

  // Touch/Swipe support for mobile
  initBannerTouchSupport();
};

// Touch/Swipe Support for Banner Carousel
const initBannerTouchSupport = () => {
  const carouselWrapper = document.querySelector(".banner-carousel-wrapper");
  if (!carouselWrapper) return;

  let touchStartX = 0;
  let touchEndX = 0;
  let touchStartY = 0;
  let touchEndY = 0;

  carouselWrapper.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  carouselWrapper.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleBannerSwipe();
  }, { passive: true });

  const handleBannerSwipe = () => {
    const swipeThreshold = 50; // Minimum distance for a swipe
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    // Check if horizontal swipe is more significant than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > swipeThreshold) {
        if (deltaX > 0) {
          // Swipe right - go to previous slide
          changeBannerSlide(-1);
        } else {
          // Swipe left - go to next slide
          changeBannerSlide(1);
        }
        resetBannerAutoPlay();
      }
    }
  };

  // Keyboard navigation support
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      changeBannerSlide(-1);
      resetBannerAutoPlay();
    } else if (e.key === "ArrowRight") {
      changeBannerSlide(1);
      resetBannerAutoPlay();
    }
  });
};

const changeBannerSlide = (direction) => {
  const banners = document.querySelectorAll('.banner');

  // Safety check
  if (banners.length === 0 || !banners[currentBannerSlide]) {
    return;
  }

  // Remove active class from current banner
  banners[currentBannerSlide].classList.remove('active');

  // Calculate new slide index
  currentBannerSlide += direction;

  if (currentBannerSlide >= banners.length) {
    currentBannerSlide = 0;
  } else if (currentBannerSlide < 0) {
    currentBannerSlide = banners.length - 1;
  }

  // Add active class to new banner
  banners[currentBannerSlide].classList.add('active');
  updateBannerDots();
};

const createBannerDots = () => {
  const dotsContainer = document.getElementById("bannerDots");
  if (!dotsContainer) return;

  dotsContainer.innerHTML = '';
  const banners = document.querySelectorAll('.banner');

  banners.forEach((_, index) => {
    const dot = document.createElement("span");
    dot.classList.add("banner-dot");
    if (index === 0) dot.classList.add("active");
    dot.addEventListener("click", () => {
      const banners = document.querySelectorAll('.banner');
      banners[currentBannerSlide].classList.remove('active');
      currentBannerSlide = index;
      banners[currentBannerSlide].classList.add('active');
      updateBannerDots();
    });
    dotsContainer.appendChild(dot);
  });
};

const updateBannerDots = () => {
  const dots = document.querySelectorAll(".banner-dot");
  dots.forEach((dot, index) => {
    if (index === currentBannerSlide) {
      dot.classList.add("active");
    } else {
      dot.classList.remove("active");
    }
  });
};

// Banner Auto-Play Control Functions
const startBannerAutoPlay = () => {
  if (bannerAutoPlayInterval) {
    clearInterval(bannerAutoPlayInterval);
  }
  bannerAutoPlayInterval = setInterval(() => {
    changeBannerSlide(1);
  }, 6000);
};

const pauseBannerAutoPlay = () => {
  if (bannerAutoPlayInterval) {
    clearInterval(bannerAutoPlayInterval);
    bannerAutoPlayInterval = null;
  }
};

const resetBannerAutoPlay = () => {
  if (isBannerPlaying) {
    pauseBannerAutoPlay();
    startBannerAutoPlay();
  }
};

const toggleBannerAutoPlay = () => {
  const playPauseBtn = document.getElementById("playPauseBanner");
  const icon = playPauseBtn.querySelector("i");

  if (isBannerPlaying) {
    // Pause
    pauseBannerAutoPlay();
    isBannerPlaying = false;
    icon.classList.remove("fa-pause");
    icon.classList.add("fa-play");
    playPauseBtn.setAttribute("aria-label", "Play carousel");
  } else {
    // Play
    startBannerAutoPlay();
    isBannerPlaying = true;
    icon.classList.remove("fa-play");
    icon.classList.add("fa-pause");
    playPauseBtn.setAttribute("aria-label", "Pause carousel");
  }
};

// Load banner reviews
const loadBannerReviews = () => {
  const bannerReviews = [
    {
      id: 1,
      name: "Sarah Ahmed",
      image: "https://i.pravatar.cc/150?img=1",
      review: "Excellent healthcare service! The doctors are very professional and caring.",
      rating: 5
    },
    {
      id: 2,
      name: "Mohammad Rahman",
      image: "https://i.pravatar.cc/150?img=12",
      review: "Great experience with SmartCare. The appointment booking system is very convenient.",
      rating: 5
    },
    {
      id: 3,
      name: "Fatima Khan",
      image: "https://i.pravatar.cc/150?img=5",
      review: "Very satisfied with the medical care I received. Highly recommended!",
      rating: 4
    }
  ];

  const reviewsGrid = document.getElementById("bannerReviewsGrid");
  if (!reviewsGrid) return;

  reviewsGrid.innerHTML = '';
  bannerReviews.forEach((review) => {
    const stars = generateStarRating(review.rating);
    const reviewCard = document.createElement("div");
    reviewCard.classList.add("banner-review-card");
    reviewCard.innerHTML = `
      <img src="${review.image}" alt="${review.name}" class="banner-review-img" onerror="this.src='https://i.pravatar.cc/150?img=68'" />
      <h5 class="banner-review-name">${review.name}</h5>
      <div class="banner-review-stars">${stars}</div>
      <p class="banner-review-text">${review.review}</p>
    `;
    reviewsGrid.appendChild(reviewCard);
  });
};

const loadServices = () => {
  // Define comprehensive services with Font Awesome icons
  const allServices = [
    {
      id: 1,
      name: "General Consultation",
      description: "Expert medical consultation for all general health concerns. Our experienced doctors provide thorough examinations and personalized treatment plans for your wellbeing.",
      icon: "fa-user-doctor",
      fullDescription: "Our general consultation services provide comprehensive medical care for a wide range of health concerns. Our team of experienced physicians offers thorough physical examinations, accurate diagnoses, and personalized treatment plans. We focus on preventive care, chronic disease management, and acute illness treatment. Book an appointment today for expert medical guidance.",
      features: ["Experienced Doctors", "Comprehensive Checkups", "Personalized Treatment", "Follow-up Care"]
    },
    {
      id: 2,
      name: "Laboratory Tests",
      description: "State-of-the-art diagnostic laboratory services with accurate results. Complete blood tests, urine analysis, biochemistry, and advanced pathology services available 24/7.",
      icon: "fa-flask-vial",
      fullDescription: "Our advanced diagnostic laboratory is equipped with cutting-edge technology to provide accurate and timely test results. We offer a complete range of pathology services including hematology, biochemistry, microbiology, serology, and specialized tests. All tests are conducted by qualified technicians following strict quality control measures.",
      features: ["24/7 Service", "Quick Results", "Advanced Equipment", "Qualified Technicians"]
    },
    {
      id: 3,
      name: "X-Ray & Imaging",
      description: "Advanced medical imaging services including digital X-ray, MRI, CT scans, ultrasound, and mammography for accurate diagnosis with latest technology and expert radiologists.",
      icon: "fa-x-ray",
      fullDescription: "Our radiology department features state-of-the-art imaging technology including digital X-ray, MRI, CT scans, ultrasound, and mammography. Our expert radiologists provide detailed reports to aid in accurate diagnosis. We ensure patient safety with minimal radiation exposure and comfortable imaging procedures.",
      features: ["Digital X-Ray", "MRI & CT Scan", "3D/4D Ultrasound", "Expert Radiologists"]
    },
    {
      id: 4,
      name: "Cardiology",
      description: "Comprehensive heart care services including ECG, echocardiography, TMT, Holter monitoring, and cardiac stress tests by experienced cardiologists with modern equipment.",
      icon: "fa-heart-pulse",
      fullDescription: "Our cardiology department offers complete cardiovascular care with advanced diagnostic facilities. We provide ECG, 2D Echo, TMT, Holter monitoring, and cardiac stress tests. Our experienced cardiologists specialize in treating heart diseases, hypertension, and other cardiovascular conditions with the latest treatment protocols.",
      features: ["ECG & Echo", "Heart Disease Treatment", "Cardiac Monitoring", "Expert Cardiologists"]
    },
    {
      id: 5,
      name: "Pediatric Care",
      description: "Specialized healthcare for infants, children, and adolescents. Complete child wellness programs, growth monitoring, vaccinations, and immunization services.",
      icon: "fa-baby",
      fullDescription: "Our pediatric department provides comprehensive healthcare for children from newborns to adolescents. We offer well-baby checkups, growth monitoring, developmental assessments, immunizations, and treatment for childhood illnesses. Our child-friendly environment and caring pediatricians ensure the best care for your little ones.",
      features: ["Growth Monitoring", "Vaccination Programs", "Child Specialists", "Nutrition Counseling"]
    },
    {
      id: 6,
      name: "Dental Services",
      description: "Complete dental care including routine check-ups, teeth cleaning, cavity fillings, root canal treatment, extractions, braces, and cosmetic dentistry procedures.",
      icon: "fa-tooth",
      fullDescription: "Our dental clinic offers comprehensive oral healthcare services including preventive care, restorative dentistry, cosmetic procedures, and orthodontics. Our skilled dentists use modern equipment and painless treatment techniques. We provide teeth cleaning, cavity fillings, root canal therapy, extractions, braces, and teeth whitening services.",
      features: ["Painless Treatment", "Cosmetic Dentistry", "Orthodontics", "Dental Surgery"]
    },
    {
      id: 7,
      name: "Physiotherapy",
      description: "Expert physiotherapy and rehabilitation services for pain management, sports injuries, post-surgery recovery, and chronic pain conditions with modern equipment.",
      icon: "fa-wheelchair",
      fullDescription: "Our physiotherapy department offers evidence-based rehabilitation services for various musculoskeletal conditions. We provide treatment for sports injuries, post-operative rehabilitation, chronic pain management, stroke rehabilitation, and orthopedic conditions. Our experienced physiotherapists use advanced techniques and modern equipment.",
      features: ["Sports Injury Care", "Pain Management", "Post-Surgery Rehab", "Modern Equipment"]
    },
    {
      id: 8,
      name: "Maternity Care",
      description: "Comprehensive prenatal and postnatal care with experienced obstetricians and gynecologists. Complete maternity packages, delivery services, and newborn care available.",
      icon: "fa-baby-carriage",
      fullDescription: "Our maternity services provide complete care for mothers and babies throughout pregnancy, delivery, and postpartum period. We offer prenatal checkups, ultrasound scans, normal and cesarean deliveries, NICU facilities, and postnatal care. Our experienced obstetricians and trained staff ensure safe and comfortable childbirth.",
      features: ["Prenatal Care", "Safe Delivery", "NICU Facility", "Lactation Support"]
    },
    {
      id: 9,
      name: "Emergency Services",
      description: "24/7 emergency medical services with fully equipped ambulances, trauma care, critical care units, and experienced emergency physicians ready to handle all emergencies.",
      icon: "fa-truck-medical",
      fullDescription: "Our emergency department operates 24/7 with a team of experienced emergency physicians and trauma specialists. We provide immediate care for all medical emergencies, accidents, and critical conditions. Our ambulance service is equipped with life-support systems for safe patient transport. We have a dedicated trauma care unit and emergency operation theater.",
      features: ["24/7 Availability", "Ambulance Service", "Trauma Care", "Emergency OT"]
    },
    {
      id: 10,
      name: "Pharmacy",
      description: "Well-stocked in-house pharmacy with genuine medicines, medical supplies, and healthcare products. Expert pharmacists available for consultation and medication guidance.",
      icon: "fa-prescription-bottle-medical",
      fullDescription: "Our in-house pharmacy stocks a wide range of genuine medications, medical supplies, and healthcare products. Our qualified pharmacists are available for medication counseling and drug interaction advice. We ensure quality medicines at reasonable prices. Home delivery service is also available for patient convenience.",
      features: ["Genuine Medicines", "24/7 Service", "Home Delivery", "Expert Pharmacists"]
    },
    {
      id: 11,
      name: "Surgery & OT",
      description: "Modern operation theaters equipped with latest technology for general surgery, orthopedic surgery, laparoscopic procedures, and minor surgical interventions.",
      icon: "fa-scissors",
      fullDescription: "Our surgical department features modern operation theaters equipped with advanced surgical instruments and monitoring systems. We perform general surgery, orthopedic surgery, laparoscopic procedures, and minor surgeries. Our experienced surgeons and anesthetists ensure safe surgical outcomes with minimal complications.",
      features: ["Modern OT", "Laparoscopic Surgery", "Expert Surgeons", "Post-op Care"]
    },
    {
      id: 12,
      name: "Vaccination",
      description: "Complete vaccination services for children and adults including routine immunizations, travel vaccines, flu shots, and COVID-19 vaccination with proper cold chain maintenance.",
      icon: "fa-syringe",
      fullDescription: "Our vaccination center provides immunization services for all age groups following national and international immunization schedules. We offer routine childhood vaccines, adult immunizations, travel vaccines, flu shots, and COVID-19 vaccination. Proper cold chain maintenance ensures vaccine efficacy and safety.",
      features: ["Child Immunization", "Adult Vaccines", "Travel Vaccines", "COVID-19 Shots"]
    },
    {
      id: 13,
      name: "Blood Bank",
      description: "Well-maintained blood bank facility with all blood groups available. Safe blood transfusion services, blood donation camps, and component separation facilities.",
      icon: "fa-droplet",
      fullDescription: "Our licensed blood bank maintains adequate stocks of all blood groups and blood components. We follow strict screening protocols to ensure safe blood transfusion. We conduct regular blood donation camps and provide component separation facilities. 24/7 blood availability for emergency requirements.",
      features: ["All Blood Groups", "Safe Screening", "Component Therapy", "24/7 Availability"]
    },
    {
      id: 14,
      name: "ICU & CCU",
      description: "Intensive Care Unit and Cardiac Care Unit with advanced life support systems, 24/7 monitoring, ventilators, and highly trained critical care specialists.",
      icon: "fa-bed-pulse",
      fullDescription: "Our ICU and CCU are equipped with advanced life support systems, ventilators, cardiac monitors, and dialysis machines. We provide 24/7 critical care services with highly trained intensivists and critical care nurses. We manage critically ill patients with multi-organ failure, post-operative care, and cardiac emergencies.",
      features: ["Advanced Monitoring", "Ventilator Support", "24/7 Specialists", "Critical Care"]
    },
    {
      id: 15,
      name: "Dialysis Center",
      description: "Modern dialysis facility with experienced nephrologists and trained technicians. Regular hemodialysis services for chronic kidney disease patients in a comfortable environment.",
      icon: "fa-lungs",
      fullDescription: "Our dialysis center provides high-quality hemodialysis services for patients with chronic kidney disease. We use modern dialysis machines with RO water purification systems. Our experienced nephrologists and trained dialysis technicians ensure safe and effective treatment. Comfortable seating and entertainment facilities make the dialysis experience better.",
      features: ["Modern Machines", "Expert Nephrologists", "RO Water System", "Comfortable Setup"]
    }
  ];
  
  displayService(allServices);
};

let currentServiceSlide = 0;
let totalServiceSlides = 0;

const displayService = (services) => {
  const parent = document.getElementById("servicesTrack");
  if (!parent) {
    console.log("servicesTrack element not found on this page");
    return;
  }

  parent.innerHTML = ''; // Clear existing content
  
  services.forEach((service) => {
    const div = document.createElement("div");
    div.classList.add("service-card");
    
    // Use Font Awesome icon if available, otherwise use image
    const iconHTML = service.icon 
      ? `<i class="fas ${service.icon}"></i>`
      : `<img src="${service.image}" alt="${service.name}" onerror="this.style.display='none'" />`;
    
    div.innerHTML = `
      <div class="service-card-inner">
        <div class="service-icon">
          ${iconHTML}
        </div>
        <div class="service-content">
          <h3 class="service-title">${service.name}</h3>
          <p class="service-description">${service.description}</p>
          <a href="#" class="service-btn" onclick="openServiceModal(${service.id}); return false;">
            Learn More <i class="fas fa-arrow-right"></i>
          </a>
        </div>
      </div>
    `;
    parent.appendChild(div);
  });
  
  // Store services globally for modal access
  window.servicesData = services;
  
  // Initialize carousel
  totalServiceSlides = Math.ceil(services.length / 3);
  initServiceCarousel();
  createServiceDots();
};

// Function to open service detail modal
const openServiceModal = (serviceId) => {
  const service = window.servicesData.find(s => s.id === serviceId);
  if (!service) return;
  
  const modal = document.getElementById('serviceModal');
  const modalTitle = document.getElementById('modalServiceTitle');
  const modalIcon = document.getElementById('modalServiceIcon');
  const modalDescription = document.getElementById('modalServiceDescription');
  const modalFeatures = document.getElementById('modalServiceFeatures');
  
  // Set modal content
  modalTitle.textContent = service.name;
  modalIcon.innerHTML = service.icon 
    ? `<i class="fas ${service.icon}"></i>`
    : `<img src="${service.image}" alt="${service.name}" />`;
  modalDescription.textContent = service.fullDescription;
  
  // Set features
  modalFeatures.innerHTML = service.features.map(feature => 
    `<li><i class="fas fa-check-circle"></i> ${feature}</li>`
  ).join('');
  
  // Show modal
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
};

// Function to close service modal
const closeServiceModal = () => {
  const modal = document.getElementById('serviceModal');
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';
};

// Close modal when clicking outside
window.onclick = function(event) {
  const modal = document.getElementById('serviceModal');
  if (event.target === modal) {
    closeServiceModal();
  }
};

const initServiceCarousel = () => {
  const prevBtn = document.getElementById("prevService");
  const nextBtn = document.getElementById("nextService");
  
  if (prevBtn && nextBtn) {
    prevBtn.addEventListener("click", () => moveServiceSlide(-1));
    nextBtn.addEventListener("click", () => moveServiceSlide(1));
  }
  
  // Auto-play carousel
  setInterval(() => {
    moveServiceSlide(1);
  }, 5000);
};

const moveServiceSlide = (direction) => {
  const track = document.getElementById("servicesTrack");
  const cards = track.querySelectorAll(".service-card");
  const cardsPerView = window.innerWidth < 768 ? 1 : window.innerWidth < 992 ? 2 : 3;
  const maxSlide = Math.ceil(cards.length / cardsPerView) - 1;
  
  currentServiceSlide += direction;
  
  if (currentServiceSlide > maxSlide) {
    currentServiceSlide = 0;
  } else if (currentServiceSlide < 0) {
    currentServiceSlide = maxSlide;
  }
  
  const cardWidth = cards[0].offsetWidth;
  const gap = 24; // 1.5rem in pixels
  const offset = -(currentServiceSlide * (cardWidth * cardsPerView + gap * (cardsPerView - 1)));
  
  track.style.transform = `translateX(${offset}px)`;
  updateServiceDots();
};

const createServiceDots = () => {
  const dotsContainer = document.getElementById("serviceDots");
  if (!dotsContainer) return;
  
  dotsContainer.innerHTML = '';
  const cardsPerView = window.innerWidth < 768 ? 1 : window.innerWidth < 992 ? 2 : 3;
  const track = document.getElementById("servicesTrack");
  const cards = track.querySelectorAll(".service-card");
  const numDots = Math.ceil(cards.length / cardsPerView);
  
  for (let i = 0; i < numDots; i++) {
    const dot = document.createElement("span");
    dot.classList.add("carousel-dot");
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => {
      currentServiceSlide = i;
      const cardWidth = cards[0].offsetWidth;
      const gap = 24;
      const offset = -(currentServiceSlide * (cardWidth * cardsPerView + gap * (cardsPerView - 1)));
      track.style.transform = `translateX(${offset}px)`;
      updateServiceDots();
    });
    dotsContainer.appendChild(dot);
  }
};

const updateServiceDots = () => {
  const dots = document.querySelectorAll(".carousel-dot");
  dots.forEach((dot, index) => {
    if (index === currentServiceSlide) {
      dot.classList.add("active");
    } else {
      dot.classList.remove("active");
    }
  });
};

// Handle window resize
window.addEventListener('resize', () => {
  const track = document.getElementById("servicesTrack");
  if (track) {
    track.style.transform = 'translateX(0)';
    currentServiceSlide = 0;
    createServiceDots();
  }
});


const loadDoctors = (search) => {
  const doctorsContainer = document.getElementById("doctors");
  const spinner = document.getElementById("spinner");
  const nodata = document.getElementById("nodata");
  
  // Clear previous results and show spinner
  doctorsContainer.innerHTML = "";
  if (spinner) spinner.style.display = "block";
  if (nodata) nodata.style.display = "none";
  
  console.log("Loading doctors with search:", search);
  
  fetch(`http://127.0.0.1:8000/doctor/list/?search=${search ? search : ""}`)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      console.log("Doctor data received:", data);
      if (spinner) spinner.style.display = "none";
      
      if (data.results && data.results.length > 0) {
        if (nodata) nodata.style.display = "none";
        displyDoctors(data.results);
      } else {
        doctorsContainer.innerHTML = "";
        if (nodata) nodata.style.display = "block";
      }
    })
    .catch((err) => {
      console.error("Error loading doctors:", err);
      if (spinner) spinner.style.display = "none";
      if (nodata) {
        nodata.style.display = "block";
        nodata.querySelector("p").textContent = "Error loading doctors. Please try again.";
      }
    });
};

const displyDoctors = (doctors) => {
  doctors?.forEach((doctor) => {
    const parent = document.getElementById("doctors");
    const div = document.createElement("div");
    div.classList.add("col-lg-3", "col-md-4", "col-sm-6", "doctor-card-item");
    div.innerHTML = `
      <div class="card doctor-card h-100 shadow-sm">
        <div class="card-body text-center">
          <div class="doctor-img-wrapper mb-3">
            <img src="${doctor.image}" alt="${doctor?.full_name}" class="doctor-img rounded-circle">
            <div class="availability-badge available">
              <i class="fas fa-check-circle"></i>
            </div>
          </div>
          <h5 class="doctor-name mb-2">${doctor?.full_name}</h5>
          <p class="doctor-designation text-muted mb-2">
            <i class="fas fa-user-md"></i> ${doctor?.designation[0] || 'Doctor'}
          </p>
          <div class="specializations mb-3">
            ${doctor?.specialization?.map((item) => {
              return `<span class="badge bg-primary mb-1">${item}</span>`;
            }).join('')}
          </div>
          <div class="doctor-info mb-3">
            <p class="mb-1"><i class="fas fa-hospital text-primary"></i> ${doctor?.designation[0] || 'Specialist'}</p>
          </div>
          <button class="btn btn-primary btn-sm w-100" onclick="window.location.href='/docDetails.html?doctorId=${doctor.id}'">
            <i class="fas fa-calendar-check"></i> View Details
          </button>
        </div>
      </div>
    `;
    parent.appendChild(div);
  });
};

const loadDesignation = () => {
  const parent = document.getElementById("drop-deg");
  if (!parent) {
    console.log("drop-deg element not found on this page");
    return;
  }

  fetch("http://127.0.0.1:8000/doctor/designation/")
    .then((res) => res.json())
    .then((data) => {
      // Clear loading text
      parent.innerHTML = '';

      // Add "All Designations" option first
      const allLi = document.createElement("li");
      allLi.innerHTML = `<a class="dropdown-item" href="#" onclick="loadDoctors(''); return false;">All Designations</a>`;
      parent.appendChild(allLi);

      // Add divider
      const divider = document.createElement("li");
      divider.innerHTML = `<hr class="dropdown-divider">`;
      parent.appendChild(divider);

      data.forEach((item) => {
        const li = document.createElement("li");
        li.innerHTML = `<a class="dropdown-item" href="#" onclick="loadDoctors('${item.name}'); return false;">${item.name}</a>`;
        parent.appendChild(li);
      });

      console.log("Designations loaded:", data.length);
    })
    .catch((err) => {
      console.log("Error loading designations:", err);
      parent.innerHTML = '<li><a class="dropdown-item" href="#">Error loading data</a></li>';
    });
};
const loadSpecialization = () => {
  const parent = document.getElementById("drop-spe");
  if (!parent) {
    console.log("drop-spe element not found on this page");
    return;
  }

  fetch("http://127.0.0.1:8000/doctor/specialization/")
    .then((res) => res.json())
    .then((data) => {
      // Clear loading text
      parent.innerHTML = '';

      // Add "All Specializations" option first
      const allLi = document.createElement("li");
      allLi.innerHTML = `<a class="dropdown-item" href="#" onclick="loadDoctors(''); return false;">All Specializations</a>`;
      parent.appendChild(allLi);

      // Add divider
      const divider = document.createElement("li");
      divider.innerHTML = `<hr class="dropdown-divider">`;
      parent.appendChild(divider);

      data.forEach((item) => {
        const li = document.createElement("li");
        li.innerHTML = `<a class="dropdown-item" href="#" onclick="loadDoctors('${item.name}'); return false;">${item.name}</a>`;
        parent.appendChild(li);
      });

      console.log("Specializations loaded:", data.length);
    })
    .catch((err) => {
      console.log("Error loading specializations:", err);
      parent.innerHTML = '<li><a class="dropdown-item" href="#">Error loading data</a></li>';
    });
};

const handleSearch = () => {
  const value = document.getElementById("search").value;
  console.log("Searching for:", value);
  loadDoctors(value);
};

// Add event listener for Enter key on search input
if (document.getElementById("search")) {
  document.getElementById("search").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  });
}

const loadReview = () => {
  // Static customer reviews data
  const customerReviews = [
    {
      id: 1,
      name: "Sarah Ahmed",
      image: "https://i.pravatar.cc/150?img=1",
      review: "Excellent healthcare service! The doctors are very professional and caring. I received top-notch treatment for my condition. The staff was friendly and the facilities were clean and modern.",
      rating: 5
    },
    {
      id: 2,
      name: "Mohammad Rahman",
      image: "https://i.pravatar.cc/150?img=12",
      review: "Great experience with SmartCare. The appointment booking system is very convenient and the doctors are highly skilled. They took time to explain my treatment plan thoroughly.",
      rating: 5
    },
    {
      id: 3,
      name: "Fatima Khan",
      image: "https://i.pravatar.cc/150?img=5",
      review: "Very satisfied with the medical care I received. The doctors are knowledgeable and compassionate. The hospital is well-equipped with modern medical technology.",
      rating: 4
    },
    {
      id: 4,
      name: "Karim Hassan",
      image: "https://i.pravatar.cc/150?img=13",
      review: "Outstanding medical facility! I had surgery here and the entire team was amazing. From pre-op to post-op care, everything was handled professionally. Highly recommended!",
      rating: 5
    },
    {
      id: 5,
      name: "Ayesha Begum",
      image: "https://i.pravatar.cc/150?img=9",
      review: "The pediatric department is exceptional. My children received excellent care during their checkups. The doctors are patient and great with kids. Very happy with the service!",
      rating: 5
    },
    {
      id: 6,
      name: "Tariq Islam",
      image: "https://i.pravatar.cc/150?img=14",
      review: "Good overall experience. The diagnostic services are fast and accurate. Wait times were reasonable and the staff was helpful throughout my visit.",
      rating: 4
    },
    {
      id: 7,
      name: "Nadia Sultana",
      image: "https://i.pravatar.cc/150?img=10",
      review: "Wonderful maternity care! The obstetrics team made my pregnancy journey comfortable and safe. I'm grateful for their expertise and compassionate care during delivery.",
      rating: 5
    },
    {
      id: 8,
      name: "Abdullah Malik",
      image: "https://i.pravatar.cc/150?img=15",
      review: "Impressive emergency services! When I had an accident, the emergency team responded quickly and efficiently. They provided excellent care and saved my life.",
      rating: 5
    },
    {
      id: 9,
      name: "Zainab Ali",
      image: "https://i.pravatar.cc/150?img=20",
      review: "The dental department is fantastic! Professional dentists with modern equipment. My root canal treatment was painless. Great hygiene standards maintained throughout.",
      rating: 4
    },
    {
      id: 10,
      name: "Ibrahim Hossain",
      image: "https://i.pravatar.cc/150?img=33",
      review: "Very professional cardiology department. The heart specialists are experienced and caring. They conducted thorough tests and provided an effective treatment plan for my condition.",
      rating: 5
    }
  ];

  displayReview(customerReviews);
};

const displayReview = (reviews) => {
  const parent = document.getElementById("review-container");
  if (!parent) {
    console.error("Review container not found");
    return;
  }

  reviews.forEach((review) => {
    const li = document.createElement("li");

    // Generate star rating HTML
    const stars = generateStarRating(review.rating);

    li.innerHTML = `
      <div class="review-card">
        <div class="review-image-wrapper">
          <img src="${review.image}" alt="${review.name}" onerror="this.src='https://i.pravatar.cc/150?img=68'" />
        </div>
        <h4 class="reviewer-name">${review.name}</h4>
        <div class="star-rating">
          ${stars}
        </div>
        <p class="review-text">${review.review}</p>
      </div>
    `;
    parent.appendChild(li);
  });

  // Reinitialize Swiffy Slider after adding reviews
  // Use setTimeout to ensure DOM is fully updated
  setTimeout(() => {
    if (window.swiffyslider && window.swiffyslider.init) {
      const sliderElement = parent.closest('.swiffy-slider');
      if (sliderElement) {
        window.swiffyslider.init(sliderElement);
      }
    }
  }, 100);
};

// Helper function to generate star rating HTML
const generateStarRating = (rating) => {
  let stars = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars += '<i class="fas fa-star"></i>';
    } else {
      stars += '<i class="far fa-star"></i>';
    }
  }
  return stars;
};

// Wait for DOM and swiffy-slider to be fully loaded
window.addEventListener('DOMContentLoaded', () => {
  // Initialize banner carousel
  initBannerCarousel();
  // loadBannerReviews(); // Removed - banner reviews section deleted

  loadServices();
  loadDesignation();
  loadSpecialization();

  // Load doctors on doctors page only
  if (document.getElementById("doctors")) {
    loadDoctors();
  }
});

// Load reviews after swiffy-slider script is loaded
window.addEventListener('load', () => {
  loadReview();
});
