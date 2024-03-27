import { Component, HostListener, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { AppComponent } from '../app.component';
import { AppConstants } from '../app.constants';
declare var PureCounter: any;
declare var AOS: any;
declare var Isotope: any;
declare var Swiper: any;
declare var Typed: any;
declare var Waypoint: any;

@Component({
  selector: 'app-resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ResumeComponent implements OnInit {
  @Input()
  AppConstants;

  @Input()
  dataCV = null;

  linkScript = [
    "/assets/vendor/purecounter/purecounter_vanilla.js",
    "/assets/vendor/aos/aos.js",
    "/assets/vendor/bootstrap/js/bootstrap.bundle.min.js",
    // "/assets/vendor/glightbox/js/glightbox.min.js",
    "/assets/vendor/isotope-layout/isotope.pkgd.min.js",
    "/assets/vendor/swiper/swiper-bundle.min.js",
    "/assets/vendor/typed.js/typed.umd.js",
    "/assets/vendor/waypoints/noframework.waypoints.js",
    // "/assets/js/main.js",
  ];

  constructor() {
    this.AppConstants = AppConstants;
    AppComponent.isLoad = true;
  }

  ngAfterViewInit(): void {
    this.linkScript.forEach((element, index) => {
      this.AppendJS(element);
    });
    this.callRegisterEven();
  }

  callRegisterEven() {
    if (
      typeof PureCounter !== 'undefined'
      && typeof AOS !== 'undefined'
      && typeof Isotope !== 'undefined'
      && typeof Swiper !== 'undefined'
      && typeof Typed !== 'undefined'
      && typeof Waypoint !== 'undefined'
    ) {
      this.navbarlinksActive();
      this.toggleBacktotop();
      this.skillsAnimation();
      this.heroEffect();
      this.RegisterEvent();
      AppComponent.isLoad
      AppComponent.isLoad = false;
      return;
    }
    else {
      setTimeout(() => {
        this.callRegisterEven();
      }, 100);
      return;
    }
  }

  ngOnInit(): void {
  }

  GoCv() {
    AppComponent.typeComponent = 'app-cv';
  }

  @HostListener('load', ['$event'])
  onPageLoad(event: Event, func: any) {
    func(event);
  }
  /**
   * Append JS
   */
  AppendJS(url) {
    const scriptExsist = this.select(`script[src="${url}"]`);
    if (scriptExsist === null) {
      const script = document.createElement('script');
      script.async = true;
      script.src = url;
      document.body.appendChild(script);
    }
  }

  RegisterEvent() {
    const self = this;
    /**
     * Mobile nav toggle
     */
    this.on('click', '.mobile-nav-toggle', function (e) {
      self.select('body').classList.toggle('mobile-nav-active')
      this.classList.toggle('bi-list')
      this.classList.toggle('bi-x')
    })

    /**
     * Scrool with ofset on links with a class name .scrollto
     */
    this.on('click', '.scrollto', function (e) {
      if (self.select(this.hash)) {
        console.log(this.hash)
        e.preventDefault()

        let body = self.select('body')
        if (body.classList.contains('mobile-nav-active')) {
          body.classList.remove('mobile-nav-active')
          let navbarToggle = self.select('.mobile-nav-toggle')
          navbarToggle.classList.toggle('bi-list')
          navbarToggle.classList.toggle('bi-x')
        }
        self.scrollto(this.hash)
      }
    }, true);

    /**
     * Scroll with ofset on page load with hash links in the url
     */
    this.onPageLoad(null, () => {
      if (window.location.hash) {
        if (this.select(window.location.hash)) {
          this.scrollto(window.location.hash)
        }
      }
    });


    /**
     * Porfolio isotope and filter
     */

    this.onPageLoad(null, () => {
      let portfolioContainer = this.select('.portfolio-container');
      if (portfolioContainer) {
        let portfolioIsotope = new Isotope(portfolioContainer, {
          itemSelector: '.portfolio-item'
        });

        let portfolioFilters = this.select('#portfolio-flters li', true);

        this.on('click', '#portfolio-flters li', function (e) {
          e.preventDefault();
          portfolioFilters.forEach(function (el) {
            el.classList.remove('filter-active');
          });
          this.classList.add('filter-active');

          portfolioIsotope.arrange({
            filter: this.getAttribute('data-filter')
          });
          portfolioIsotope.on('arrangeComplete', function () {
            AOS.refresh()
          });
        }, true);
      }
    });


    /**
     * Portfolio details slider
     */
    new Swiper('.portfolio-details-slider', {
      speed: 400,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false
      },
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true
      }
    });

    /**
     * Testimonials slider
     */
    new Swiper('.testimonials-slider', {
      speed: 600,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false
      },
      slidesPerView: 'auto',
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true
      }
    });

    /**
     * Animation on scroll
     */
    this.onPageLoad(null, () => {
      console.log('Animation on scroll')
      AOS.init({
        duration: 1000,
        easing: 'ease-in-out',
        once: true,
        mirror: false
      })
    });

    /**
     * Initiate Pure Counter 
     */
    new PureCounter();
  }

  /**
   * Hero type effect
   */
  heroEffect() {
    const typed = this.select('.typed')
    if (typed) {
      let typed_strings = typed.getAttribute('data-typed-items')
      typed_strings = typed_strings.split(',')
      new Typed('.typed', {
        strings: typed_strings,
        loop: true,
        typeSpeed: 100,
        backSpeed: 50,
        backDelay: 2000
      });
    }
  }

  /**
   * Skills animation
   */
  skillsAnimation() {
    const self = this;
    let skilsContent = this.select('.skills-content');
    if (skilsContent) {
      new Waypoint({
        element: skilsContent,
        offset: '80%',
        handler: function (direction) {
          let progress = self.select('.progress .progress-bar', true);
          progress.forEach((el) => {
            el.style.width = el.getAttribute('aria-valuenow') + '%'
          });
        }
      })
    }
  }

  /**
   * Back to top button
   */
  toggleBacktotop() {
    let backtotop = this.select('.back-to-top')
    if (backtotop) {
      const toggleBacktotop = () => {
        if (window.scrollY > 100) {
          backtotop.classList.add('active')
        } else {
          backtotop.classList.remove('active')
        }
      }
      this.onPageLoad(null, toggleBacktotop)
      this.onscroll(document, toggleBacktotop)
    }
  }

  /**
   * Scrolls to an element with header offset
   */
  scrollto(el) {
    let elementPos = this.select(el).offsetTop
    window.scrollTo({
      top: elementPos,
      behavior: 'smooth'
    })
  }

  /**
   * Navbar links active state on scroll
   */
  navbarlinksActive() {
    const self = this;
    let navbarlinks = this.select('#navbar .scrollto', true)
    const navbarlinksActive = () => {
      let position = window.scrollY + 200
      navbarlinks.forEach(navbarlink => {
        if (!navbarlink.hash) return
        let section = self.select(navbarlink.hash)
        if (!section) return
        if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
          navbarlink.classList.add('active')
        } else {
          navbarlink.classList.remove('active')
        }
      })
    }
    this.onPageLoad(null, navbarlinksActive)
    this.onscroll(document, navbarlinksActive)
  }

  /**
   * Easy selector helper function
   */
  select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...(document.querySelectorAll(el) as any)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  on = (type, el, listener, all = false) => {
    let selectEl = this.select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Easy on scroll event listener 
   */
  onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }
}
