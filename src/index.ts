import gsap from 'gsap';
import Draggable from 'gsap/Draggable';
import InertiaPlugin from 'gsap/InertiaPlugin';
import ScrambleTextPlugin from 'gsap/ScrambleTextPlugin';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitText from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin, Draggable, InertiaPlugin, SplitText);

interface BlinkInConfig {
  duration?: number; // Duration for each half-cycle (e.g., 0.1s)
  blinkCount?: number; // Total full blinks desired
  ease?: string;
}

// Register the custom "blink" effect.
gsap.registerEffect({
  name: 'blinkIn',
  effect: (targets: gsap.TweenTarget, config: BlinkInConfig) => {
    // For a "blink in", we want to start at 0 and toggle to 1 repeatedly,
    // ending at 1 (visible). Each half-cycle is one toggle.
    // For example, for 5 full blinks, we need:
    //   totalHalfCycles = (blinkCount * 2 - 1)
    // and then:
    //   repeat = totalHalfCycles - 1  (since the first half-cycle is not a repeat)
    const blinkCount = config.blinkCount ?? 5;
    const totalHalfCycles = blinkCount * 2 - 1;
    const repeatCount = totalHalfCycles - 1;

    return gsap.to(targets, {
      opacity: 1, // Toggle to fully visible
      duration: config.duration, // Duration for each half-cycle
      yoyo: true, // Reverse back to 0 on each cycle
      repeat: repeatCount, // Repeat to achieve the desired blink count
      ease: config.ease,
    });
  },
  defaults: {
    duration: 0.1,
    blinkCount: 5,
    ease: 'power1.inOut',
  },
  extendTimeline: true, // Allow using this effect in timelines
});

gsap.registerEffect({
  name: 'fadeIn',
  effect: (targets: gsap.TweenTarget, config: gsap.TweenVars) => {
    return gsap.to(targets, {
      opacity: 1,
      duration: config.duration || 0.5,
      ease: config.ease || 'power2.out',
      ...config,
    });
  },
  extendTimeline: true,
});

gsap.registerEffect({
  name: 'fadeOut',
  effect: (targets: gsap.TweenTarget, config: gsap.TweenVars) => {
    return gsap.to(targets, {
      opacity: 0,
      duration: config.duration || 0.5,
      ease: config.ease || 'power2.out',
      ...config,
    });
  },
  extendTimeline: true,
});

const landingTimeline = () => {
  const landing = gsap.timeline({
    scrollTrigger: {
      trigger: '.home-landing-section',
      start: 'top top', // Start animation when reaching the section
      end: '+=150%', // Keep it pinned for longer
      pin: true, // Keep the section fixed
      scrub: 1, // Play the animation naturally
      anticipatePin: 1, // Start the animation before reaching the section
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
      duration: 1,
      ease: 'power3.out',
    })
    .set('.intro-text', { visibility: 'visible' }) // Ensure text is visible
    .to('.line-1', {
      scrambleText: {
        text: 'THE IMMERSIVE SOCIAL PLATFORM',
        chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
        speed: 0.6,
        delimiter: ' ',
        tweenLength: false,
      },
      duration: 2,
      ease: 'power3.out',
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
        duration: 2,
        ease: 'power3.out',
      },
      '-=1.5'
    ) // Overlap animation slightly
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
        duration: 2,
        ease: 'power3.out',
      },
      '-=1.5'
    ); // Overlap animation slightly

  return landing;
};

const createAnythingV2 = () => {
  const secondImage = document.querySelector('.second-img') as HTMLElement;
  const firstImage = document.querySelector('.first-img') as HTMLElement;
  const centerImage = document.querySelector('.center-img') as HTMLElement;
  const clippedBox = document.querySelector('.clipped-box') as HTMLElement;
  const swappableWrapper = document.querySelector('.swappable-wrapper') as HTMLElement;
  const content = document.querySelector('.content') as HTMLElement;
  const scramble1 = document.querySelector('.scramble-1') as HTMLElement;
  const scramble2 = document.querySelector('.scamble-2') as HTMLElement;
  gsap.timeline({ defaults: { duration: 1 } });

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
    ],
    { autoAlpha: 0 }
  );

  const firstTl = gsap.timeline({
    scrollTrigger: {
      trigger: '.home-scroll-section',
      start: 'top top',
      end: '+=300%',
      pin: true,
      scrub: 1,
      anticipatePin: 1,
      markers: true,
    },
  });

  firstTl
    .to(firstImage, { autoAlpha: 1 })
    .to(clippedBox, { autoAlpha: 1 }, '>')
    .to(swappableWrapper, { autoAlpha: 1 }, '>')
    .to(content, { autoAlpha: 1 })
    .to(scramble1, { autoAlpha: 1 }, '>')
    .to(scramble2, { autoAlpha: 1 }, '>')
    .to(clippedBox, { width: '100%', height: '100%', ease: 'power2.out', duration: 1.5 })
    .to(firstImage, { autoAlpha: 0, ease: 'power3.out' }, '-=1')
    .to(swappableWrapper, { autoAlpha: 0, ease: 'power3.out' }, '-=1')
    .to(secondImage, { autoAlpha: 1, duration: 3, ease: 'power3.out' }, '-=1')
    .to(content, { autoAlpha: 0, ease: 'power3.out' }, '-=1')
    .to(centerImage, { autoAlpha: 1, duration: 2, ease: 'power3.out' }, '-=1')
    .set(secondImage, { visibility: 'hidden' })
    .to(
      centerImage,
      {
        scale: 0.7,
        duration: 2,
        ease: 'power2.inOut',
      },
      '+=0.5'
    )
    .call(() => {
      gsap.set('.fade-in-content', { overflow: 'visible' });
    }, []);
  // .to('.new-content', { opacity: 1, y: 0, duration: 2, ease: 'power3.out' }, '-=0.8');

  return firstTl;
};

function createAnything() {
  const centerSlideImg = document.querySelector('.center-img') as HTMLElement;
  const homeScrollSection = document.querySelector('.home-scroll-section') as HTMLElement;
  const horizontalSection = document.querySelector('.horizontal-section') as HTMLElement;
  const sections = gsap.utils.toArray('.slide');

  // Master timeline

  // First Animation Timeline (boxTl)
  const boxTl = gsap.timeline({
    scrollTrigger: {
      trigger: homeScrollSection,
      start: 'top top',
      end: '+=300%',
      pin: true,
      scrub: 1,
      anticipatePin: 1,
      markers: true,
    },
  });

  // gsap.set('.slide-v2', { yPercent: -200, zIndex: 100, position: 'absolute' });
  gsap.set(centerSlideImg, {
    opacity: 0,
  });
  gsap.set('.content', { opacity: 0 });

  // Build boxTl animations
  boxTl

    .to('.content', { opacity: 0, duration: 1 })

    .to('.clipped-box')

    .to('.scramble-3', {
      scrambleText: {
        text: 'CREATE',
        chars: 'BCDEFW',
        speed: 0.5,
        revealDelay: 0.5,
      },
    })
    .to('.scramble-4', {
      scrambleText: {
        text: 'ANYTHING',
        chars: 'BCDEFGHI',
        revealDelay: 0.5,
        speed: 1,
      },
    })
    // .to(centerSlideImg, {
    //   opacity: 1,
    //   duration: 2,
    //   ease: 'power2.out',
    // })
    .to('.content-bottom', { opacity: 0, duration: 1, ease: 'power2.out' }, '-=0.5')
    .to('.second-img', { opacity: 0, visibility: 'hidden' }, '>')

    .to('.create-anything-wrapper', { y: '-70vh', duration: 1, ease: 'power2.out' }, '>')
    .to('.slide-img', { opacity: 1, duration: 1, ease: 'power2.out' }, '+=0.5');

  // Horizontal Scroll Timeline
  // const horizontalTl = gsap.timeline({
  //   scrollTrigger: {
  //     trigger: '.horizontal-section',
  //     start: 'top top',
  //     end: '+=5000',
  //     pin: true,
  //     scrub: 1,
  //     snap: 1 / (sections.length - 1),
  //   },
  // });

  // // Build horizontalTl animations
  // horizontalTl.to(sections, {
  //   xPercent: -100 * (sections.length - 1),
  //   duration: 10,
  //   ease: 'none',
  // });

  // Initial states

  // Transition Timeline
  // const transitionTl = gsap.timeline({
  //   onComplete: () => {
  //     gsap.set(horizontalSection, {
  //       width: '600%',
  //       position: 'static',
  //     });
  //     horizontalTl.play(0);
  //   },
  // });

  // transitionTl.to(centerSlideImg, {
  //   width: '70vw',
  //   height: 'auto',
  //   scale: 1,
  //   duration: 1,
  // });

  // // Build master timeline
  // masterTl.add(boxTl).add(transitionTl).add(horizontalTl);

  return boxTl;
}

function meetAnybody() {
  const elements = {
    section: document.querySelector('.meet-anybody-section') as HTMLElement,
    text: document.querySelector('.meet-text') as HTMLElement,
    anyBodyText: document.querySelector('.anybody-text') as HTMLElement,
    windowContainer: document.querySelector('.meet-window-container') as HTMLElement,
    meetContent: document.querySelector('.meet-content') as HTMLElement,
    meetImg: document.querySelector('.meet-img') as HTMLElement,
  };

  // Initial states
  gsap.set(
    [
      elements.text,
      elements.anyBodyText,
      elements.windowContainer,
      elements.meetContent,
      elements.meetImg,
    ],
    {
      opacity: 0,
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

  gsap.set(elements.anyBodyText, { yPercent: -20 });

  ScrollTrigger.create({
    trigger: elements.section,
    start: 'top top',
    onEnter: () => {
      gsap.timeline().blinkIn(elements.text).blinkIn(elements.anyBodyText);
    },
    onLeaveBack: () => {
      // Smooth tween back to hidden state
      gsap.to([elements.text, elements.anyBodyText], {
        opacity: 0,
        yPercent: -10,
        duration: 0.5,
        ease: 'power2.out',
        onComplete: () => {
          gsap.set([elements.text, elements.anyBodyText], { yPercent: 0 });
          gsap.set(elements.meetImg, { zIndex: 10 });
        },
      });
    },
  });

  // BLINK (no scrub)
  masterTimeline
    .to(elements.windowContainer, { opacity: 1, duration: 0.5 })
    .to(elements.windowContainer, { width: '100%', height: '100%', duration: 1.5 })
    .to(elements.meetImg, { opacity: 1, duration: 1 }, '-=1.8')
    .to(elements.meetContent, { opacity: 1, duration: 1 }, '-=1');

  return masterTimeline;
}
function readyPlayerTl() {
  const readyPlayerSection = document.querySelector('.ready-player-section') as HTMLElement;
  const readyText = document.querySelector('.ready-text') as HTMLElement;
  const playerText = document.querySelector('.player-text') as HTMLElement;
  const cartridgeWrapper = document.querySelector('.cartridge-wrapper') as HTMLElement;
  const cartridgeVideo = document.querySelector('.cartridge-vid') as HTMLElement;

  // Single timeline with scroll trigger but no pinning
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: readyPlayerSection,
      start: 'top top',
      end: '+=200%', // This now represents actual scroll distance
      scrub: 1,
      markers: true, // Helpful for debugging, remove in production
      onUpdate: (self) => {
        // Optional: could use this to trigger the video expansion
        // when reaching a certain scroll progress
        if (self.progress > 0.8) {
          // Could trigger final state here
        }
      },
    },
  });

  // Initial states
  gsap.set(cartridgeVideo, {
    scale: 0,
    opacity: 0,
  });
  gsap.set(cartridgeWrapper, {
    transformOrigin: '50% 50% -150',
    perspective: 1200,
    backfaceVisibility: 'visible',
    transformStyle: 'preserve-3d',
    yPercent: -350,
  });
  gsap.set([readyText, playerText], { opacity: 0 });

  tl
    // Cartridge movement
    .to(
      cartridgeWrapper,
      {
        yPercent: 60,
        duration: 10,
        ease: 'none',
      },
      0
    )

    // Text animations
    .to(
      readyText,
      {
        opacity: 1,
        duration: 2,
        ease: 'power2.out',
      },
      3
    )
    .to(
      playerText,
      {
        opacity: 1,
        duration: 2,
        ease: 'power2.out',
      },
      5
    )

    // Video growth can now scale beyond viewport
    .to(
      cartridgeVideo,
      {
        scale: 0.3,
        opacity: 1,
        duration: 2,
        ease: 'power2.in',
      },
      6
    )
    .to(
      cartridgeVideo,
      {
        scale: 1.5, // Can go bigger than viewport
        duration: 4,
        ease: 'power2.inOut',
      },
      8
    )

    // Fade out other elements
    .to(
      [readyText, playerText, cartridgeWrapper],
      {
        opacity: 0,
        duration: 2,
        ease: 'power2.in',
      },
      9
    );

  return tl;
}

function beAnyoneTl() {
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
    .add(meetAnybody())
    .add(readyPlayerTl());
  // .add(createAnythingV2()); // Overlap createAnything timeline by 0.5 seconds
  // .add(horizontalScroll());
});
