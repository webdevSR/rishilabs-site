// =========================
// RISHI LABS - MAIN JAVASCRIPT
// =========================

// Console log for debugging
console.log("🚀 Rishi Labs site loaded successfully!");

// =========================
// MOBILE MENU TOGGLE
// =========================
function toggleMenu() {
  const menu = document.getElementById("mobileMenu");
  const menuToggle = document.querySelector(".menu-toggle");
  const body = document.body;
  
  if (menu) {
    const isActive = menu.classList.toggle("active");
    
    // Update ARIA attribute for accessibility
    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", isActive);
    }
    
    // Prevent body scroll when menu is open
    if (isActive) {
      body.style.overflow = "hidden";
    } else {
      body.style.overflow = "";
    }
  }
}

// Close mobile menu when clicking outside
document.addEventListener("click", function(event) {
  const menu = document.getElementById("mobileMenu");
  const menuToggle = document.querySelector(".menu-toggle");
  
  if (menu && menu.classList.contains("active")) {
    // Check if click is outside menu and toggle button
    if (!menu.contains(event.target) && !menuToggle.contains(event.target)) {
      toggleMenu();
    }
  }
});

// Close mobile menu on escape key
document.addEventListener("keydown", function(event) {
  const menu = document.getElementById("mobileMenu");
  
  if (event.key === "Escape" && menu && menu.classList.contains("active")) {
    toggleMenu();
  }
});

// =========================
// CONTACT FORM HANDLING
// =========================
const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", async function(event) {
    event.preventDefault();
    
    const submitBtn = document.getElementById("submitBtn");
    const formMessage = document.getElementById("formMessage");
    const btnText = submitBtn.querySelector(".btn-text");
    const btnLoader = submitBtn.querySelector(".btn-loader");
    
    // Show loading state
    submitBtn.classList.add("loading");
    submitBtn.disabled = true;
    formMessage.style.display = "none";
    
    // Get form data
    const formData = new FormData(contactForm);
    
    try {
      // Submit to Web3Forms
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Success message
        formMessage.textContent = "✅ Thanks! I'll get back to you within 24 hours.";
        formMessage.className = "form-message success";
        formMessage.style.display = "block";
        
        // Reset form
        contactForm.reset();
        
        // Optional: Track conversion (Google Analytics)
        if (typeof gtag !== "undefined") {
          gtag("event", "form_submit", {
            event_category: "Contact",
            event_label: "Contact Form"
          });
        }
        
        // Optional: Redirect to thank you page after 2 seconds
        // setTimeout(() => {
        //   window.location.href = "thank-you.html";
        // }, 2000);
        
      } else {
        // Error message
        formMessage.textContent = "❌ Something went wrong. Please try WhatsApp instead.";
        formMessage.className = "form-message error";
        formMessage.style.display = "block";
      }
      
    } catch (error) {
      console.error("Form submission error:", error);
      formMessage.textContent = "❌ Connection error. Please try again or use WhatsApp.";
      formMessage.className = "form-message error";
      formMessage.style.display = "block";
    } finally {
      // Reset button state
      submitBtn.classList.remove("loading");
      submitBtn.disabled = false;
    }
  });
  
  // Form field validation feedback
  const formInputs = contactForm.querySelectorAll("input, textarea, select");
  
  formInputs.forEach(input => {
    input.addEventListener("blur", function() {
      if (this.hasAttribute("required") && !this.value.trim()) {
        this.style.borderColor = "#ef4444";
      } else if (this.validity.valid) {
        this.style.borderColor = "#10b981";
      }
    });
    
    input.addEventListener("input", function() {
      if (this.style.borderColor === "rgb(239, 68, 68)") {
        this.style.borderColor = "";
      }
    });
  });
}

// =========================
// SMOOTH SCROLL FOR ANCHOR LINKS
// =========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function(event) {
    const href = this.getAttribute("href");
    
    // Only handle internal anchors (not just "#")
    if (href && href !== "#") {
      event.preventDefault();
      const target = document.querySelector(href);
      
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    }
  });
});

// =========================
// INTERSECTION OBSERVER FOR ANIMATIONS
// =========================
// Enhance fade-up animations to trigger on scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animationPlayState = "running";
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all fade-up elements
document.querySelectorAll(".fade-up").forEach(element => {
  element.style.animationPlayState = "paused";
  observer.observe(element);
});

// =========================
// PERFORMANCE: LAZY LOAD IMAGES
// =========================
// Add loading="lazy" to images if not already set
document.addEventListener("DOMContentLoaded", function() {
  const images = document.querySelectorAll("img:not([loading])");
  images.forEach(img => {
    img.setAttribute("loading", "lazy");
  });
});

// =========================
// ACCESSIBILITY: FOCUS VISIBLE
// =========================
// Add keyboard focus indicator
let isUsingKeyboard = false;

document.addEventListener("keydown", function(event) {
  if (event.key === "Tab") {
    isUsingKeyboard = true;
    document.body.classList.add("keyboard-nav");
  }
});

document.addEventListener("mousedown", function() {
  isUsingKeyboard = false;
  document.body.classList.remove("keyboard-nav");
});

// =========================
// UTILITY: DEBOUNCE FUNCTION
// =========================
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// =========================
// ANALYTICS HELPER (OPTIONAL)
// =========================
// Track button clicks
function trackEvent(category, action, label) {
  if (typeof gtag !== "undefined") {
    gtag("event", action, {
      event_category: category,
      event_label: label
    });
  }
  console.log(`Event tracked: ${category} - ${action} - ${label}`);
}

// Add click tracking to important buttons
document.querySelectorAll(".cta-primary, .whatsapp-btn").forEach(button => {
  button.addEventListener("click", function() {
    const label = this.textContent.trim();
    trackEvent("CTA", "click", label);
  });
});

// =========================
// ERROR HANDLING
// =========================
window.addEventListener("error", function(event) {
  console.error("Global error caught:", event.error);
  // Optional: Send to error tracking service
});

window.addEventListener("unhandledrejection", function(event) {
  console.error("Unhandled promise rejection:", event.reason);
  // Optional: Send to error tracking service
});

// =========================
// PERFORMANCE MONITORING (OPTIONAL)
// =========================
if ("performance" in window && "PerformanceObserver" in window) {
  // Log page load time
  window.addEventListener("load", function() {
    setTimeout(() => {
      const perfData = window.performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      console.log(`⚡ Page loaded in ${pageLoadTime}ms`);
    }, 0);
  });
}

// =========================
// PRINT DETECTION
// =========================
window.addEventListener("beforeprint", function() {
  console.log("Page is being printed");
});

// =========================
// NOTIFICATION PERMISSION (FOR FUTURE USE)
// =========================
// Uncomment if you want to implement push notifications
/*
function requestNotificationPermission() {
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission().then(permission => {
      console.log("Notification permission:", permission);
    });
  }
}
*/

// =========================
// SERVICE WORKER (FOR FUTURE PWA)
// =========================
// Uncomment to register a service worker for offline functionality
/*
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    navigator.serviceWorker
      .register("/sw.js")
      .then(registration => {
        console.log("Service Worker registered:", registration);
      })
      .catch(error => {
        console.log("Service Worker registration failed:", error);
      });
  });
}
*/
