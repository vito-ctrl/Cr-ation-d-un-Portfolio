$(document).ready(function() {
  // Enhanced smooth scroll functionality with easing
  function smoothScroll(target, duration = 1000) {
    const targetPosition = $(target).offset().top;
    const startPosition = $(window).scrollTop();
    const headerOffset = 70; // Adjust based on your header height
    const distance = targetPosition - startPosition - headerOffset;
    
    $('html, body').animate({
      scrollTop: targetPosition - headerOffset
    }, {
      duration: duration,
      easing: 'easeInOutCubic', // More natural feeling easing
      complete: function() {
        // Ensure hash change doesn't jump the page
        window.history.pushState(null, null, target);
      }
    });
  }

  // Add jQuery easing function for smoother animation
  $.easing.easeInOutCubic = function(x) {
    return x < 0.5 ?
      4 * x * x * x :
      1 - Math.pow(-2 * x + 2, 3) / 2;
  };

  // Enhanced navigation click handler with debouncing
  let isScrolling = false;
  $('a.nav-link, .btn').on('click', function(event) {
    if (this.hash !== "" && !isScrolling) {
      event.preventDefault();
      const hash = this.hash;
      
      // Prevent multiple scroll events
      isScrolling = true;
      
      // Update active state for nav links
      if ($(this).hasClass('nav-link')) {
        $('a.nav-link').removeClass('active');
        $(this).addClass('active');
      }
      
      smoothScroll(hash);
      
      // Reset scroll lock after animation
      setTimeout(() => {
        isScrolling = false;
      }, 1000);
    }
  });

  // Enhanced scroll spy with throttling
  let scrollTimeout;
  $(window).scroll(function() {
    if (!scrollTimeout) {
      scrollTimeout = setTimeout(function() {
        const scrollDistance = $(window).scrollTop() + 100;
        
        // Find the current section in viewport
        $('section').each(function() {
          const section = $(this);
          const sectionTop = section.offset().top - 100;
          const sectionBottom = sectionTop + section.outerHeight();
          
          if (scrollDistance >= sectionTop && scrollDistance < sectionBottom) {
            const sectionId = section.attr('id');
            $('a.nav-link').removeClass('active');
            $(`a.nav-link[href="#${sectionId}"]`).addClass('active');
          }
        });
        
        scrollTimeout = null;
      }, 50); // Throttle scroll events
    }
  });

  // Handle keyboard navigation
  $(document).keydown(function(event) {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
      
      const currentSection = $('section').filter(function() {
        return $(this).offset().top <= $(window).scrollTop() + 100;
      }).last();
      
      const sections = $('section');
      const currentIndex = sections.index(currentSection);
      
      if (event.key === 'ArrowUp' && currentIndex > 0) {
        smoothScroll(`#${sections.eq(currentIndex - 1).attr('id')}`);
      } else if (event.key === 'ArrowDown' && currentIndex < sections.length - 1) {
        smoothScroll(`#${sections.eq(currentIndex + 1).attr('id')}`);
      }
    }
  });
});

$(window).scroll(function() {
  if ($(window).scrollTop() > 50) {
      $('.navbar').addClass('scrolled');
  } else {
      $('.navbar').removeClass('scrolled');
  }
});