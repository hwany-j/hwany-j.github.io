/**
* Template Name: iPortfolio
* Template URL: https://bootstrapmade.com/iportfolio-bootstrap-portfolio-websites-template/
* Updated: Jun 29 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  /**
   * Header toggle
   */
  const headerToggleBtn = document.querySelector('.header-toggle');

  function headerToggle() {
    document.querySelector('#header').classList.toggle('header-show');
    headerToggleBtn.classList.toggle('bi-list');
    headerToggleBtn.classList.toggle('bi-x');
  }
  headerToggleBtn.addEventListener('click', headerToggle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.header-show')) {
        headerToggle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Init typed.js
   */
  const selectTyped = document.querySelector('.typed');
  if (selectTyped) {
    let typed_strings = selectTyped.getAttribute('data-typed-items');
    typed_strings = typed_strings.split(',');
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Animate the skills items on reveal
   */
  let skillsAnimation = document.querySelectorAll('.skills-animation');
  skillsAnimation.forEach((item) => {
    new Waypoint({
      element: item,
      offset: '80%',
      handler: function(direction) {
        let progress = item.querySelectorAll('.progress .progress-bar');
        progress.forEach(el => {
          el.style.width = el.getAttribute('aria-valuenow') + '%';
        });
      }
    });
  });

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

  /**
   * Load publications dynamically from JSON
   */
  async function loadPublications() {
    try {
      console.log('Loading publications...');
      const response = await fetch('./publication.json');
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Loaded data:', data);
      
      // Load main publications
      const publicationsContainer = document.querySelector('#publications-list');
      console.log('Publications container:', publicationsContainer);
      
      if (publicationsContainer) {
        publicationsContainer.innerHTML = '';
        
        data.publications.forEach(pub => {
          const li = createPublicationElement(pub);
          publicationsContainer.appendChild(li);
        });
        console.log(`Loaded ${data.publications.length} publications`);
      } else {
        console.error('Publications container not found!');
      }
      
      // Load preprints
      const preprintsContainer = document.querySelector('#preprints-list');
      console.log('Preprints container:', preprintsContainer);
      
      if (preprintsContainer && data.preprints) {
        preprintsContainer.innerHTML = '';
        
        data.preprints.forEach(pub => {
          const li = createPublicationElement(pub);
          preprintsContainer.appendChild(li);
        });
        console.log(`Loaded ${data.preprints.length} preprints`);
      } else {
        console.error('Preprints container not found!');
      }
      
    } catch (error) {
      console.error('Error loading publications:', error);
    }
  }

  function createPublicationElement(pub) {
    const li = document.createElement('li');
    
    // Get category color
    const categoryColors = {
      'Vision': '#4285f4',
      'NLP': '#db4437', 
      'ML': '#0f9d58',
      'Etc': '#808080'
    };
    
    const categoryColor = categoryColors[pub.category] || '#808080';
    
    // Create venue badge
    let venueBadge = '';
    if (pub.type) {
      venueBadge = `<span style="background: ${categoryColor}; color: #ffffff">&nbsp;&nbsp;${pub.venue} ${pub.year} ${pub.type}&nbsp;&nbsp;</span>`;
    } else {
      venueBadge = `<span style="background: ${categoryColor}; color: #ffffff">&nbsp;&nbsp;${pub.venue} ${pub.year}&nbsp;&nbsp;</span>`;
    }
    
    // Create links
    let links = '';
    if (pub.paper_url) {
      links += `<a href="${pub.paper_url}">[paper]</a>`;
    }
    if (pub.code_url) {
      if (links) links += ' <span>|</span> ';
      links += `<a href="${pub.code_url}">[code]</a>`;
    }
    if (pub.video_url) {
      if (links) links += ' <span>|</span> ';
      links += `<a href="${pub.video_url}">[video]</a>`;
    }
    
    li.innerHTML = `
      <div class="d-flex flex-column flex-md-row justify-content-between mb-5">
        <div class="flex-grow-1">
          ${venueBadge}
          <h5>${pub.title}</h5>
          <span>${pub.authors.replace(/Jihwan Bang/g, '<strong>Jihwan Bang</strong>')}</span>
          ${links ? `<div>${links}</div>` : ''}
        </div>
      </div>
    `;
    
    return li;
  }

  // Load publications when page loads
  window.addEventListener('load', loadPublications);

})();