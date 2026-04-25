const loadServices = () => {
  fetch("http://127.0.0.1:8000/services/")
    .then((res) => res.json())
    .then((data) => displayService(data))
    .catch((err) => console.log(err));
};

const displayService = (services) => {
  const parent = document.getElementById("service-container");

  services.forEach((service) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="card shadow h-100">
                <div class="ratio ratio-16x9">
                  <img
                    src=${service.image}
                    class="card-img-top"
                    loading="lazy"
                    alt="${service.name}"
                  />
                </div>
                <div class="card-body p-3 p-xl-5">
                  <h3 class="card-title h5">${service.name}</h3>
                  <p class="card-text">
                    ${service.description.slice(0, 140)}
                  </p>
                  <a href="#" class="btn btn-primary">Details</a>
                </div>
              </div>
      `;
    parent.appendChild(li);
  });

  // Initialize carousel after services are loaded
  initializeServicesCarousel(services.length);
};

// Enhanced Services Carousel Functionality
const initializeServicesCarousel = (totalServices) => {
  const carousel = document.getElementById("service-container");
  const prevBtn = document.getElementById("service-prev");
  const nextBtn = document.getElementById("service-next");
  const indicatorsContainer = document.getElementById("service-indicators");

  if (!carousel || !prevBtn || !nextBtn) return;

  let currentIndex = 0;
  let isScrolling = false;
  let autoScrollInterval;

  // Calculate number of slides based on viewport
  const getItemsPerSlide = () => {
    const width = window.innerWidth;
    if (width < 768) return 1;
    if (width < 1024) return 2;
    return 3;
  };

  const totalSlides = Math.ceil(totalServices / getItemsPerSlide());

  // Create indicators
  const createIndicators = () => {
    indicatorsContainer.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
      const indicator = document.createElement('button');
      indicator.setAttribute('aria-label', `Go to slide ${i + 1}`);
      indicator.addEventListener('click', () => scrollToIndex(i));
      if (i === 0) indicator.classList.add('active');
      indicatorsContainer.appendChild(indicator);
    }
  };

  // Update indicators
  const updateIndicators = () => {
    const indicators = indicatorsContainer.querySelectorAll('button');
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === currentIndex);
    });
  };

  // Update button states
  const updateButtons = () => {
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= totalSlides - 1;
  };

  // Scroll to specific index
  const scrollToIndex = (index) => {
    if (isScrolling || index < 0 || index >= totalSlides) return;

    isScrolling = true;
    currentIndex = index;

    const items = carousel.querySelectorAll('li');
    if (items.length > 0) {
      const itemsPerSlide = getItemsPerSlide();
      const targetItem = items[index * itemsPerSlide];

      if (targetItem) {
        carousel.scrollTo({
          left: targetItem.offsetLeft - carousel.offsetLeft,
          behavior: 'smooth'
        });
      }
    }

    updateIndicators();
    updateButtons();

    setTimeout(() => {
      isScrolling = false;
    }, 500);
  };

  // Next slide
  const nextSlide = () => {
    if (currentIndex < totalSlides - 1) {
      scrollToIndex(currentIndex + 1);
    } else {
      // Loop back to start
      scrollToIndex(0);
    }
  };

  // Previous slide
  const prevSlide = () => {
    if (currentIndex > 0) {
      scrollToIndex(currentIndex - 1);
    } else {
      // Loop to end
      scrollToIndex(totalSlides - 1);
    }
  };

  // Auto scroll functionality
  const startAutoScroll = () => {
    stopAutoScroll();
    autoScrollInterval = setInterval(() => {
      nextSlide();
    }, 5000); // Change slide every 5 seconds
  };

  const stopAutoScroll = () => {
    if (autoScrollInterval) {
      clearInterval(autoScrollInterval);
      autoScrollInterval = null;
    }
  };

  // Event listeners
  nextBtn.addEventListener('click', () => {
    nextSlide();
    stopAutoScroll();
    startAutoScroll();
  });

  prevBtn.addEventListener('click', () => {
    prevSlide();
    stopAutoScroll();
    startAutoScroll();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      prevSlide();
      stopAutoScroll();
      startAutoScroll();
    } else if (e.key === 'ArrowRight') {
      nextSlide();
      stopAutoScroll();
      startAutoScroll();
    }
  });

  // Touch swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoScroll();
  });

  carousel.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
    startAutoScroll();
  });

  const handleSwipe = () => {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  };

  // Pause auto-scroll on hover
  carousel.addEventListener('mouseenter', stopAutoScroll);
  carousel.addEventListener('mouseleave', startAutoScroll);

  // Handle scroll events to update current index
  let scrollTimeout;
  carousel.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const scrollLeft = carousel.scrollLeft;
      const itemWidth = carousel.querySelector('li')?.offsetWidth || 0;
      const gap = 30;
      const newIndex = Math.round(scrollLeft / (itemWidth + gap));

      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < totalSlides) {
        currentIndex = newIndex;
        updateIndicators();
        updateButtons();
      }
    }, 100);
  });

  // Handle window resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const newTotalSlides = Math.ceil(totalServices / getItemsPerSlide());
      if (newTotalSlides !== totalSlides) {
        location.reload(); // Reload to recalculate
      }
    }, 250);
  });

  // Initialize
  createIndicators();
  updateButtons();
  startAutoScroll();
};

const loadDoctors = (search) => {
  document.getElementById("doctors").innerHTML = "";
  document.getElementById("spinner").style.display = "block";
  console.log(search);
  fetch(
    `http://127.0.0.1:8000/doctor/list/?search=${
      search ? search : ""
    }`
  )
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data.results.length > 0) {
        document.getElementById("spinner").style.display = "none";
        document.getElementById("nodata").style.display = "none";
        displyDoctors(data?.results);
      } else {
        document.getElementById("doctors").innerHTML = "";
        document.getElementById("spinner").style.display = "none";
        document.getElementById("nodata").style.display = "block";
      }
    });
};

const displyDoctors = (doctors) => {
  doctors?.forEach((doctor) => {
    // console.log(doctor);
    const parent = document.getElementById("doctors");
    const div = document.createElement("div");
    div.classList.add("doc-card");
    div.innerHTML = `
        <img class="doc-img" src=${doctor.image} alt="" />
              <h4>${doctor?.full_name}</h4>
              <h6>${doctor?.designation[0]}</h6>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis,
                numquam!
              </p>
             
              <p>
              
              ${doctor?.specialization?.map((item) => {
                return `<button>${item}</button>`;
              })}
              </p>

              <button > <a target="_blank" href="/docDetails.html?doctorId=${
                doctor.id
              }">Details</a> </button>
        `;

    parent.appendChild(div);
  });
};

const loadDesignation = () => {
  fetch("http://127.0.0.1:8000/doctor/designation/")
    .then((res) => res.json())
    .then((data) => {
      data.forEach((item) => {
        const parent = document.getElementById("drop-deg");
        const li = document.createElement("li");
        li.classList.add("dropdown-item");
        li.innerText = item?.name;
        parent.appendChild(li);
      });
    });
};
const loadSpecialization = () => {
  fetch("http://127.0.0.1:8000/doctor/specialization/")
    .then((res) => res.json())
    .then((data) => {
      data.forEach((item) => {
        const parent = document.getElementById("drop-spe");
        const li = document.createElement("li");
        li.classList.add("dropdown-item");
        li.innerHTML = `
        <li onclick="loadDoctors('${item.name}')"> ${item.name}</li>
          `;
        parent.appendChild(li);
      });
    });
};

const handleSearch = () => {
  const value = document.getElementById("search").value;
  loadDoctors(value);
};

const loadReview = () => {
  fetch("http://127.0.0.1:8000/doctor/review/")
    .then((res) => res.json())
    .then((data) => displayReview(data));
};

const displayReview = (reviews) => {
  const parent = document.getElementById("review-container");

  reviews.forEach((review) => {
    const li = document.createElement("li");
    li.innerHTML = `
        <div class="review-card">
            <img src="./Images/girl.png" alt="${review.reviewer}" />
            <h4>${review.reviewer}</h4>
            <p>
             ${review.body.slice(0, 100)}
            </p>
            <h6>⭐ ${review.rating}</h6>
        </div>
        `;
    parent.appendChild(li);
  });

  // Initialize reviews carousel after reviews are loaded
  initializeReviewsCarousel(reviews.length);
};

// Enhanced Reviews Carousel Functionality
const initializeReviewsCarousel = (totalReviews) => {
  const carousel = document.getElementById("review-container");
  const prevBtn = document.getElementById("review-prev");
  const nextBtn = document.getElementById("review-next");
  const indicatorsContainer = document.getElementById("review-indicators");

  if (!carousel || !prevBtn || !nextBtn) return;

  let currentIndex = 0;
  let isScrolling = false;
  let autoScrollInterval;

  // Calculate number of slides based on viewport
  const getItemsPerSlide = () => {
    const width = window.innerWidth;
    if (width < 768) return 1;
    if (width < 1024) return 2;
    return 3;
  };

  const totalSlides = Math.ceil(totalReviews / getItemsPerSlide());

  // Create indicators
  const createIndicators = () => {
    indicatorsContainer.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
      const indicator = document.createElement('button');
      indicator.setAttribute('aria-label', `Go to slide ${i + 1}`);
      indicator.addEventListener('click', () => scrollToIndex(i));
      if (i === 0) indicator.classList.add('active');
      indicatorsContainer.appendChild(indicator);
    }
  };

  // Update indicators
  const updateIndicators = () => {
    const indicators = indicatorsContainer.querySelectorAll('button');
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === currentIndex);
    });
  };

  // Update button states
  const updateButtons = () => {
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= totalSlides - 1;
  };

  // Scroll to specific index
  const scrollToIndex = (index) => {
    if (isScrolling || index < 0 || index >= totalSlides) return;

    isScrolling = true;
    currentIndex = index;

    const items = carousel.querySelectorAll('li');
    if (items.length > 0) {
      const itemsPerSlide = getItemsPerSlide();
      const targetItem = items[index * itemsPerSlide];

      if (targetItem) {
        carousel.scrollTo({
          left: targetItem.offsetLeft - carousel.offsetLeft,
          behavior: 'smooth'
        });
      }
    }

    updateIndicators();
    updateButtons();

    setTimeout(() => {
      isScrolling = false;
    }, 500);
  };

  // Next slide
  const nextSlide = () => {
    if (currentIndex < totalSlides - 1) {
      scrollToIndex(currentIndex + 1);
    } else {
      scrollToIndex(0);
    }
  };

  // Previous slide
  const prevSlide = () => {
    if (currentIndex > 0) {
      scrollToIndex(currentIndex - 1);
    } else {
      scrollToIndex(totalSlides - 1);
    }
  };

  // Auto scroll functionality
  const startAutoScroll = () => {
    stopAutoScroll();
    autoScrollInterval = setInterval(() => {
      nextSlide();
    }, 6000); // Change slide every 6 seconds
  };

  const stopAutoScroll = () => {
    if (autoScrollInterval) {
      clearInterval(autoScrollInterval);
      autoScrollInterval = null;
    }
  };

  // Event listeners
  nextBtn.addEventListener('click', () => {
    nextSlide();
    stopAutoScroll();
    startAutoScroll();
  });

  prevBtn.addEventListener('click', () => {
    prevSlide();
    stopAutoScroll();
    startAutoScroll();
  });

  // Touch swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoScroll();
  });

  carousel.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
    startAutoScroll();
  });

  const handleSwipe = () => {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  };

  // Pause auto-scroll on hover
  carousel.addEventListener('mouseenter', stopAutoScroll);
  carousel.addEventListener('mouseleave', startAutoScroll);

  // Handle scroll events to update current index
  let scrollTimeout;
  carousel.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const scrollLeft = carousel.scrollLeft;
      const itemWidth = carousel.querySelector('li')?.offsetWidth || 0;
      const gap = 30;
      const newIndex = Math.round(scrollLeft / (itemWidth + gap));

      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < totalSlides) {
        currentIndex = newIndex;
        updateIndicators();
        updateButtons();
      }
    }, 100);
  });

  // Initialize
  createIndicators();
  updateButtons();
  startAutoScroll();
};

loadServices();
loadDoctors();
loadDesignation();
loadSpecialization();
loadReview();
