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

const draggableSlider = () => {
  const track = document.querySelector('.slider-v2');
  const slides = document.querySelectorAll<HTMLElement>('.slide');
  const numSlides = slides.length;

  if (!track || !slides.length) {
    console.error('Required elements not found');
    return;
  }

  // Set initial positions - spread slides horizontally
  gsap.set(slides, {
    xPercent: (i) => i * 100,
  });

  // Create proxy for dragging
  const proxy = document.createElement('div');
  let slideWidth = 0;
  let wrapWidth = 0;

  function resize() {
    slideWidth = slides[0].offsetWidth;
    wrapWidth = slideWidth * (numSlides - 1); // Total draggable distance

    // Update draggable bounds after resize
    if (draggable) {
      draggable.applyBounds({ minX: 0, maxX: wrapWidth });
    }
  }

  function updateSlides() {
    const x = gsap.getProperty(proxy, 'x');
    const normalizedProgress = x / wrapWidth;
    const currentIndex = Math.round(normalizedProgress * (numSlides - 1));

    slides.forEach((slide, i) => {
      // Calculate distance from center for scaling
      const distance = Math.abs(i - currentIndex);
      const scale = gsap.utils.clamp(0.6, 1, 1 - distance * 0.2);
      const opacity = gsap.utils.clamp(0.4, 1, 1 - distance * 0.3);

      gsap.to(slide, {
        scale: scale,
        opacity: opacity,
        duration: 0.2,
      });
    });
  }

  const draggable = Draggable.create(proxy, {
    type: 'x',
    trigger: '.slide-container',
    inertia: true,
    bounds: { minX: 0, maxX: wrapWidth },
    snap: {
      x: (value) => gsap.utils.snap(slideWidth, value),
    },
    onDrag: updateSlides,
    onThrowUpdate: updateSlides,
  })[0];

  // Initial setup
  resize();
  updateSlides();

  // Handle window resize
};

// function createAnything() {
//   const centerSlideImg = document.querySelector('.center-img') as HTMLElement;

//   gsap.set(centerSlideImg, {
//     position: 'absolute',
//     width: '100vw',
//     height: '100vh',

//     top: '0',
//     left: '50%',
//     x: '-50%',
//     zIndex: 5,
//   });

//   gsap.set('.content', { opacity: 0 });

//   /**
//    * ScrollTrigger Timeline (boxTl)
//    */
//   const boxTl = gsap.timeline({
//     scrollTrigger: {
//       trigger: '.home-scroll-section',
//       start: 'top top',
//       end: '+=300%',
//       pin: true,
//       scrub: 1,
//       anticipatePin: 1,
//       markers: true,
//     },
//   });

//   boxTl
//     .to('.content', { opacity: 1, duration: 1 }, '>') // Fade in content
//     .to('.scramble-1', { opacity: 1, duration: 1 }, '>')
//     .to('.scamble-2', { opacity: 1, duration: 1 }, '>')
//     .to('.content', { opacity: 0, duration: 1 })
//     .to('.swappable-wrapper', { opacity: 0, duration: 1 }, '-=1')
//     .to('.clipped-box', { width: '100%', height: '100%', ease: 'power2.out', duration: 1.5 })
//     .to('.first-img', { opacity: 0, duration: 1, ease: 'power3.out' }, '-=1')
//     .to('.second-img', { opacity: 1, duration: 3, ease: 'power3.out' }, '-=1')
//     .to('.new-content', { opacity: 1, y: 0, duration: 2, ease: 'power3.out' }, '-=0.8')
//     .to('.scramble-3', {
//       scrambleText: {
//         text: 'CREATE',
//         chars: 'BCDEFW',
//         speed: 0.5,
//         revealDelay: 0.5,
//       },
//     })
//     .to('.scramble-4', {
//       scrambleText: {
//         text: 'ANYTHING',
//         chars: 'BCDEFGHI',
//         revealDelay: 0.5,
//         speed: 1,
//       },
//     })
//     .to(centerSlideImg, {
//       opacity: 1,
//       duration: 2,
//       ease: 'power2.out',
//     })
//     .to('.content-bottom', { opacity: 0, duration: 1, ease: 'power2.out' }, '-=0.5')
//     .to('.second-img', { opacity: 0, visibility: 'hidden' }, '>')
//     .to(
//       centerSlideImg,
//       {
//         scale: 0.6, // Scale to 50% of original size
//         duration: 2,
//         ease: 'power2.inOut',
//       },
//       '+=0.5'
//     )
//     .to('.create-anything-wrapper', { y: '-70vh', duration: 1, ease: 'power2.out' }, '>')
//     .to('.slide-img', { opacity: 1, duration: 1, ease: 'power2.out' }, '+=0.5');
//   // .call(() => {
//   //   gsap.set(centerSlideImg, {
//   //     position: 'relative', // Reintegrate into slider
//   //     width: '70vw', // Match other slides
//   //     height: 'auto',
//   //     top: 'auto',
//   //     left: 'auto',
//   //     x: '0',
//   //     scale: 1,
//   //   });
//   // });

//   return boxTl;
// }

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
        },
      });
    },
  });

  // BLINK (no scrub)
  masterTimeline
    .to(elements.windowContainer, { opacity: 1, duration: 0.5 })
    .to(elements.windowContainer, { width: '100%', height: '100%', duration: 1.5 })
    .to(elements.meetImg, { opacity: 1, duration: 1 }, '-=1')
    .to(elements.meetContent, { opacity: 1, duration: 1 }, '-=1');

  return masterTimeline;
}

function readyPlayerTl() {
  const readyPlayerSection = document.querySelector('.ready-player-section') as HTMLElement;
  const readyText = document.querySelector('.ready-text') as HTMLElement;
  const playerText = document.querySelector('.player-text') as HTMLElement;
  const cartridgeWrapper = document.querySelector('.cartridge-wrapper') as HTMLElement;
  const cartridgeVideo = document.querySelector('.cartridge-vid') as HTMLElement;
  const textWrapper = document.querySelector('.text-wrapper') as HTMLElement;

  const readyPlayerTl = gsap.timeline({
    scrollTrigger: {
      trigger: readyPlayerSection,
      start: 'top top',
      end: '+=300%',
      pin: true,
      scrub: 1,
    },
  });

  // Initial states
  gsap.set(cartridgeVideo, { scale: 0 });
  gsap.set(cartridgeWrapper, {
    transformOrigin: '50% 50% -150',
    perspective: 1200,
    backfaceVisibility: 'visible',
    transformStyle: 'preserve-3d',
    yPercent: -100,
  });
  gsap.set([readyText, playerText], { opacity: 0 });
  gsap.set(textWrapper, { yPercent: 0 }); // Initial position for text wrapper

  readyPlayerTl
    // Initial cartridge movement
    .to(cartridgeWrapper, {
      yPercent: 60,
      duration: 8,
      ease: 'power1.inOut',
    })
    // Rotation during movement
    .to(
      cartridgeWrapper,
      {
        rotateY: '+=45',
        ease: 'power2.inOut',
        duration: 3,
        yoyo: true,
        repeat: 1,
      },
      '<+=1'
    )
    // READY text
    .to(
      readyText,
      {
        opacity: 1,
        duration: 2,
        ease: 'power2.out',
      },
      '-=5'
    )
    // PLAYER text with longer visibility
    .to(
      playerText,
      {
        opacity: 1,
        duration: 2,
        ease: 'power2.out',
      },
      '>'
    )
    // Start moving text up while keeping it visible
    .to(
      [readyText, playerText],
      {
        yPercent: -100,
        duration: 4,
        ease: 'power1.inOut',
      },
      '>'
    )
    // Begin video scale later
    .to(
      cartridgeVideo,
      {
        scale: 1,
        duration: 6,
        ease: 'power3.out',
      },
      '>-=1'
    )
    // Fade out texts more gradually
    .to(
      [readyText, playerText],
      {
        opacity: 0,
        duration: 3,
        ease: 'power2.in',
      },
      '<+=1'
    );

  return readyPlayerTl;
}

window.Webflow ||= [];
window.Webflow.push(() => {
  console.log('GSAP Scroll Animation Loaded!');

  const pageTl = gsap.timeline({});

  pageTl
    .add(landingTimeline()) // Add landing timeline
    .add(readyPlayerTl());

  // .add(createAnything()) // Overlap createAnything timeline by 0.5 seconds
  // .add(meetAnybody());
});
