import gsap from 'gsap';
import Draggable from 'gsap/Draggable';
import InertiaPlugin from 'gsap/InertiaPlugin';
import ScrambleTextPlugin from 'gsap/ScrambleTextPlugin';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitText from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin, Draggable, InertiaPlugin, SplitText);

export const landingTimeline = () => {
  const landing = gsap.timeline({
    scrollTrigger: {
      trigger: '.home-landing-section',
      start: 'top top',
      end: '+=400%', // Increased scroll distance for a more gradual animation
      pin: true,
      scrub: 1.5, // Increased scrub delay for smoother syncing
      // Consider removing or tweaking anticipatePin if it doesn't feel right
      anticipatePin: 0.5,
      // markers: true, // Disable in production
    },
  });

  landing
    .to('.readyverse-logo', {
      opacity: 1,
      duration: 2,
    })
    .to('.readyverse-logo', {
      opacity: 0,
      y: -50,
      duration: 1.5, // Slightly longer duration for smoother exit
      ease: 'power2.out',
    })
    .set('.intro-text', { visibility: 'visible' })
    .to('.line-1', {
      scrambleText: {
        text: 'THE IMMERSIVE SOCIAL PLATFORM',
        chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
        speed: 0.6,
        delimiter: ' ',
        tweenLength: false,
      },
      duration: 2.5, // Extended duration for a more gradual effect
      ease: 'power2.out',
    })
    .to(
      '.line-2',
      {
        scrambleText: {
          text: 'POWERING AN INTERCONNECTED UNIVERSE',
          chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
          speed: 0.6,
          delimiter: ' ',
          tweenLength: false,
        },
        duration: 2.5,
        ease: 'power2.out',
      },
      '-=1.8'
    )
    .to(
      '.line-3',
      {
        scrambleText: {
          text: 'OF GAMES AND EXPERIENCES',
          chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
          speed: 0.6,
          delimiter: ' ',
          tweenLength: false,
        },
        duration: 2.5,
        ease: 'power2.out',
      },
      '-=1.8'
    );

  return landing;
};

const createAnythingV2 = () => {
  const secondImage = document.querySelector('.second-img') as HTMLElement;
  const firstImage = document.querySelector('.first-img') as HTMLElement;
  const centerImage = document.querySelector('.slide-1') as HTMLElement;
  const clippedBox = document.querySelector('.clipped-box') as HTMLElement;
  const swappableWrapper = document.querySelector('.swappable-wrapper') as HTMLElement;
  const content = document.querySelector('.content') as HTMLElement;
  const scramble1 = document.querySelector('.scramble-1') as HTMLElement;
  const scramble2 = document.querySelector('.scamble-2') as HTMLElement;
  const goAnywhereCopy = document.querySelector('.go-anywhere-copy') as HTMLElement;
  const createText = document.querySelector('.scramble-3') as HTMLElement;
  const anythingText = document.querySelector('.scramble-4') as HTMLElement;

  const splitGoAnywhereCopy = new SplitText(goAnywhereCopy, {
    type: 'chars',
    charsClass: 'char',
  });

  const scrambleTl = gsap.timeline();
  scrambleTl.fromTo(
    splitGoAnywhereCopy.chars,
    {
      opacity: 0,
    },
    {
      duration: 1.5,
      scrambleText: {
        text: '{original}',
        chars: 'upperCase',
        revealDelay: 0.2,
        speed: 0.6,
        tweenLength: false,
      },
      opacity: 1,
      stagger: 0.05,
      ease: 'none',
    }
  );

  // Pre-set elements to hidden for performance
  gsap.set(
    [
      secondImage,
      centerImage,
      firstImage,
      clippedBox,
      scramble1,
      scramble2,
      content,
      swappableWrapper,
      createText,
      anythingText,
    ],
    { autoAlpha: 0 }
  );

  gsap.set(centerImage, { zIndex: 5 });

  const firstTl = gsap.timeline({
    scrollTrigger: {
      trigger: '.home-scroll-section',
      start: 'top top',
      end: '+=350%', // Increased distance for smoother transitions
      pin: true,
      scrub: 1.5,
      anticipatePin: 0.5,
      // markers: true,
    },
  });

  firstTl
    .to(firstImage, { autoAlpha: 1 })
    .to(clippedBox, { autoAlpha: 1 }, '>')
    .to(swappableWrapper, { autoAlpha: 1 }, '>')
    .to(content, { autoAlpha: 1 })
    .to(scramble1, { autoAlpha: 1 }, '>')
    .to(scramble2, { autoAlpha: 1 }, '>')
    .add(scrambleTl, '<')
    .to(clippedBox, { width: '100%', height: '100%', ease: 'power2.out', duration: 1.8 })
    .to(firstImage, { autoAlpha: 0, ease: 'power2.out' }, '-=1')
    .to(swappableWrapper, { autoAlpha: 0, ease: 'power2.out' }, '-=1')
    .to(secondImage, { autoAlpha: 1, duration: 3.5, ease: 'power2.out' }, '-=1')
    .to(content, { autoAlpha: 0, ease: 'power2.out' }, '-=1')
    .to('.new-content', { opacity: 1, y: 0, duration: 2.5, ease: 'power2.out' }, '-=0.8')
    .to(createText, { autoAlpha: 1, duration: 2.5, ease: 'power2.out' }, '-=1')
    .to(anythingText, { autoAlpha: 1, duration: 2.5, ease: 'power2.out' }, '-=1')
    .to(centerImage, { autoAlpha: 1, duration: 2.5, ease: 'power2.out' }, '-=1')
    .to(secondImage, { autoAlpha: 0 }, '<')
    .to('.content-bottom', { opacity: 0, duration: 1.2, ease: 'power2.out' }, '-=0.5')
    .to(centerImage, { scale: 0.7, ease: 'power2.out' }, '-=1');

  return firstTl;
};

export function meetAnybody() {
  const elements = {
    section: document.querySelector('.meet-anybody-section') as HTMLElement,
    meetHeading: document.querySelector('.meet-text') as HTMLElement,
    anyBodyHeading: document.querySelector('.anybody-text') as HTMLElement,
    windowContainer: document.querySelector('.meet-window-container') as HTMLElement,
    meetContent: document.querySelector('.meet-content') as HTMLElement,
    meetImg: document.querySelector('.meet-img') as HTMLElement,
  };

  // Initial states
  gsap.set(
    [
      elements.meetHeading,
      elements.anyBodyHeading,
      elements.windowContainer,
      elements.meetContent,
      elements.meetImg,
    ],
    {
      autoAlpha: 0,
    }
  );

  // Separate non-scrubbed blink animations with their own triggers
  const masterTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: elements.section,
      start: 'top top',
      end: '+=200%',
      pin: true,
      scrub: true, // or only enable scrub once blinking is done
    },
  });

  // BLINK (no scrub)
  masterTimeline
    .to(elements.meetHeading, { autoAlpha: 1, duration: 0.5 })
    .to(elements.anyBodyHeading, { autoAlpha: 1, duration: 0.5 }, '>')
    .to(elements.windowContainer, { autoAlpha: 1, duration: 0.5 })
    .to(elements.windowContainer, { width: '100vw', height: '100vh', duration: 5 })
    .to(elements.meetImg, { autoAlpha: 1, duration: 1 }, '-=1.8') // start just after the start of the window expansion
    .to(elements.meetContent, { autoAlpha: 1, duration: 1 }, '-=1'); // start half thrid way through window expansion

  return masterTimeline;
}

export function beAnyoneTl() {
  const wrapper = document.querySelector('.video-wrapper') as HTMLElement;
  const vidCard = document.querySelector('.vid-card') as HTMLElement;
  const images = gsap.utils.toArray<HTMLElement>('.avatar-img');
  let currentIndex = 0;
  let isScrolling = false;
  let scrollTimeout: NodeJS.Timeout;

  // Setup initial states
  images.forEach((img, i) => {
    gsap.set(img, {
      opacity: i === 0 ? 1 : 0.5,
      scale: i === 0 ? 1 : 0.95,
    });
  });

  // Smooth scroll function with synchronized card animation
  function smoothScrollTo(element: HTMLElement) {
    isScrolling = true;

    // Timeline for synchronized animations
    const tl = gsap.timeline({
      onComplete: () => {
        isScrolling = false;
      },
    });

    // Scale down card slightly
    tl.to(
      vidCard,
      {
        scale: 0.98,
        duration: 0.3,
        ease: 'power2.out',
      },
      0
    );

    // Scroll to new position
    tl.to(
      wrapper,
      {
        scrollLeft: element.offsetLeft,
        duration: 0.5,
        ease: 'power2.out',
      },
      0
    );

    // Scale card back up
    tl.to(
      vidCard,
      {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
      },
      0.3
    );
  }

  // Handle scroll events with debounce and synchronized animations
  wrapper.addEventListener('scroll', () => {
    if (isScrolling) return;

    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const { scrollLeft } = wrapper;
      const imageWidth = wrapper.clientWidth;
      const newIndex = Math.round(scrollLeft / imageWidth);

      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < images.length) {
        // Create timeline for synchronized animations
        const tl = gsap.timeline();

        // Scale down card
        tl.to(
          vidCard,
          {
            scale: 0.98,
            duration: 0.3,
            ease: 'power2.out',
          },
          0
        );

        // Animate out current image
        tl.to(
          images[currentIndex],
          {
            opacity: 0.5,
            scale: 0.95,
            duration: 0.3,
            ease: 'power2.out',
          },
          0
        );

        // Animate in new image
        tl.to(
          images[newIndex],
          {
            opacity: 1,
            scale: 1,
            duration: 0.3,
            ease: 'power2.out',
          },
          0
        );

        // Scale card back up
        tl.to(
          vidCard,
          {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out',
          },
          0.15
        );

        currentIndex = newIndex;
      }
    }, 50);
  });

  // Add touch event handling
  let touchStart: number;
  let touchStartTime: number;

  wrapper.addEventListener(
    'touchstart',
    (e) => {
      touchStart = e.touches[0].clientX;
      touchStartTime = Date.now();

      // Scale down card slightly on touch start
      gsap.to(vidCard, {
        scale: 0.98,
        duration: 0.3,
        ease: 'power2.out',
      });
    },
    { passive: true }
  );

  wrapper.addEventListener(
    'touchend',
    (e) => {
      const touchEnd = e.changedTouches[0].clientX;
      const touchEndTime = Date.now();
      const touchDuration = touchEndTime - touchStartTime;
      const diff = touchStart - touchEnd;

      // Calculate velocity of swipe
      const velocity = Math.abs(diff / touchDuration);

      // Scale card back up
      gsap.to(vidCard, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
      });

      // Adjust sensitivity based on velocity and distance
      if (Math.abs(diff) > 30 || velocity > 0.5) {
        const nextIndex =
          diff > 0 ? Math.min(currentIndex + 1, images.length - 1) : Math.max(currentIndex - 1, 0);

        smoothScrollTo(images[nextIndex]);
      }
    },
    { passive: true }
  );

  // Optional: Add mouse drag scrolling
  let isMouseDown = false;
  let startX: number;
  let scrollLeft: number;

  wrapper.addEventListener('mousedown', (e) => {
    isMouseDown = true;
    startX = e.pageX - wrapper.offsetLeft;
    scrollLeft = wrapper.scrollLeft;
    wrapper.style.cursor = 'grabbing';

    // Scale down card on mouse down
    gsap.to(vidCard, {
      scale: 0.98,
      duration: 0.3,
      ease: 'power2.out',
    });
  });

  wrapper.addEventListener('mouseleave', () => {
    if (isMouseDown) {
      // Scale card back up
      gsap.to(vidCard, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
    isMouseDown = false;
    wrapper.style.cursor = 'grab';
  });

  wrapper.addEventListener('mouseup', () => {
    isMouseDown = false;
    wrapper.style.cursor = 'grab';

    // Scale card back up
    gsap.to(vidCard, {
      scale: 1,
      duration: 0.3,
      ease: 'power2.out',
    });
  });

  wrapper.addEventListener('mousemove', (e) => {
    if (!isMouseDown) return;
    e.preventDefault();
    const x = e.pageX - wrapper.offsetLeft;
    const walk = (x - startX) * 2;
    wrapper.scrollLeft = scrollLeft - walk;
  });

  // Set initial cursor style
  wrapper.style.cursor = 'grab';

  return gsap.timeline();
}

window.Webflow ||= [];
window.Webflow.push(() => {
  console.log('GSAP Scroll Animation Loaded!');

  const pageTl = gsap.timeline({});

  pageTl
    .add(landingTimeline()) // Add landing timeline
    .add(beAnyoneTl()) // Add beAnyone timeline
    .add(createAnythingV2()) // Overlap createAnything timeline by 0.5 seconds
    .add(meetAnybody());

  // .add(horizontalScroll());
});
