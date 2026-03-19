/**
* Template Name: iPortfolio
* Template URL: https://bootstrapmade.com/iportfolio-bootstrap-portfolio-websites-template/
* Updated: Jun 29 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function () {
  "use strict";

  let allPublications = [];
  let activePublicationCategories = new Set(['Vision', 'NLP', 'ML', 'Etc']);

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
    navmenu.addEventListener('click', function (e) {
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
      handler: function (direction) {
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
  document.querySelectorAll('.isotope-layout').forEach(function (isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function () {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function (filters) {
      filters.addEventListener('click', function () {
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
    document.querySelectorAll(".init-swiper").forEach(function (swiperElement) {
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
  window.addEventListener('load', function (e) {
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
      // Append a timestamp to prevent browser from caching the JSON file
      const response = await fetch('./publication.json?t=' + new Date().getTime());
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
        allPublications = [
          ...(data.publications || []),
          ...(data.preprints || []).map(pub => ({ ...pub, collection: 'Preprint' }))
        ];
        initPublicationFilters();
        renderFilteredPublications();
        console.log(`Loaded ${allPublications.length} publications`);
      } else {
        console.error('Publications container not found!');
      }

    } catch (error) {
      console.error('Error loading publications:', error);
    }
  }

  function sortPublications(publications) {
    return [...publications].sort((a, b) => parseInt(b.order) - parseInt(a.order));
  }

  function groupPublicationsByYear(publications) {
    return sortPublications(publications).reduce((groups, pub) => {
      const year = pub.year || 'Unknown';
      if (!groups[year]) {
        groups[year] = [];
      }
      groups[year].push(pub);
      return groups;
    }, {});
  }

  function renderPublicationGroups(container, publications) {
    container.innerHTML = '';
    const groupedPublications = groupPublicationsByYear(publications);

    if (Object.keys(groupedPublications).length === 0) {
      container.innerHTML = '<div class="publication-empty-state">No publications match the selected categories.</div>';
      return;
    }

    Object.keys(groupedPublications)
      .sort((a, b) => parseInt(b) - parseInt(a))
      .forEach(year => {
        const yearSection = document.createElement('section');
        yearSection.className = 'publication-year-section';

        const yearHeader = document.createElement('div');
        yearHeader.className = 'publication-year-header';
        yearHeader.innerHTML = `<span class="publication-year-label">${year}</span><span class="publication-year-count">${groupedPublications[year].length} item${groupedPublications[year].length > 1 ? 's' : ''}</span>`;

        const yearList = document.createElement('div');
        yearList.className = 'publication-list';

        groupedPublications[year].forEach(pub => {
          yearList.appendChild(createPublicationElement(pub));
        });

        yearSection.appendChild(yearHeader);
        yearSection.appendChild(yearList);
        container.appendChild(yearSection);
      });
  }

  function initPublicationFilters() {
    document.querySelectorAll('.publication-legend-item[data-category]').forEach(button => {
      button.addEventListener('click', () => {
        const category = button.dataset.category;
        const isAllActive = activePublicationCategories.size === 4;

        if (isAllActive) {
          activePublicationCategories = new Set([category]);
        } else if (activePublicationCategories.has(category)) {
          activePublicationCategories.delete(category);
        } else {
          activePublicationCategories.add(category);
        }

        if (activePublicationCategories.size === 0) {
          activePublicationCategories = new Set(['Vision', 'NLP', 'ML', 'Etc']);
        }

        syncPublicationFilterButtons();
        renderFilteredPublications();
      });
    });

    syncPublicationFilterButtons();
  }

  function syncPublicationFilterButtons() {
    document.querySelectorAll('.publication-legend-item[data-category]').forEach(button => {
      const isActive = activePublicationCategories.has(button.dataset.category);
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  function renderFilteredPublications() {
    const publicationsContainer = document.querySelector('#publications-list');
    if (!publicationsContainer) return;

    const filteredPublications = allPublications.filter(pub => activePublicationCategories.has(pub.category));
    renderPublicationGroups(publicationsContainer, filteredPublications);
  }

  function createPublicationElement(pub) {
    const article = document.createElement('article');
    article.className = 'publication-card';

    const categoryColors = {
      'Vision': '#4285f4',
      'NLP': '#db4437',
      'ML': '#0f9d58',
      'Etc': '#808080'
    };

    const categoryColor = categoryColors[pub.category] || '#808080';

    const venueParts = [pub.venue];
    if (pub.type) {
      venueParts.push(pub.type);
    }
    if (pub.collection) {
      venueParts.push(pub.collection);
    }
    const venueText = venueParts.join(' ');

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

    article.innerHTML = `
      <div class="publication-card-meta">
        <span class="publication-badge" style="--publication-category-color: ${categoryColor};">${venueText}</span>
        <span class="publication-category">${pub.category}</span>
      </div>
      <h5 class="publication-title">${pub.title}</h5>
      <p class="publication-authors">${pub.authors.replace(/Jihwan Bang/g, '<strong>Jihwan Bang</strong>')}</p>
      ${links ? `<div class="publication-links">${links}</div>` : ''}
    `;

    return article;
  }

  // Load publications when page loads
  window.addEventListener('load', loadPublications);

})();
