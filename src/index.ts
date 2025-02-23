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

function beAnyoneTl() {
  gsap.registerPlugin(ScrollTrigger);

  // Configuration
  let allowScroll = true;
  let isAnimating = false;
  const scrollTimeout = gsap
    .delayedCall(1, () => {
      allowScroll = true;
      isAnimating = false;
    })
    .pause();

  let currentIndex = 0;
  const images = gsap.utils.toArray<HTMLImageElement>('.avatar-img');

  // Kill any existing animations on the images
  gsap.killTweensOf(images);

  // Initial setup
  gsap.set(images, {
    opacity: 0,
    scale: 0.95,
  });
  gsap.set(images[0], {
    opacity: 1,
    scale: 1,
  });

  // Animation function with better state management
  function animateImages(index: number, isScrollingDown: boolean) {
    // Prevent animation if already animating or invalid index
    if (
      isAnimating ||
      (index === images.length && isScrollingDown) ||
      (index === -1 && !isScrollingDown) ||
      index === currentIndex
    ) {
      intentObserver.disable();
      return;
    }

    isAnimating = true;
    allowScroll = false;

    const fadeOut = images[currentIndex];
    const fadeIn = images[index];

    // Kill any existing tweens
    gsap.killTweensOf([fadeOut, fadeIn]);

    const animationTl = gsap.timeline({
      onComplete: () => {
        currentIndex = index;
        isAnimating = false;
        scrollTimeout.restart(true);

        // If we've reached the end of the images, disable the observer
        if (index === images.length - 1 || index === 0) {
          intentObserver.disable();
        }
      },
      onInterrupt: () => {
        isAnimating = false;
        allowScroll = true;
      },
    });

    // Fade out current image
    animationTl
      .to(fadeOut, {
        opacity: 0,
        scale: 0.95,
        duration: 0.4,
        ease: 'power2.out',
      })
      .to(
        fadeIn,
        {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          ease: 'power2.out',
        },
        '-=0.2'
      );

    return animationTl;
  }

  const intentObserver = ScrollTrigger.observe({
    type: 'wheel,touch,pointer',
    onUp: () => !isAnimating && allowScroll && animateImages(currentIndex - 1, false),
    onDown: () => !isAnimating && allowScroll && animateImages(currentIndex + 1, true),
    tolerance: 10,
    preventDefault: true,
    lockAxis: true,
    onEnable(self) {
      allowScroll = false;
      const savedY = window.scrollY;

      // Only maintain scroll position briefly
      let frameCount = 0;
      const maintainScroll = () => {
        if (self.isEnabled && frameCount < 10) {
          window.scrollTo(0, savedY);
          frameCount++;
          requestAnimationFrame(maintainScroll);
        }
      };
      maintainScroll();

      // Reset state after a short delay
      gsap.delayedCall(0.1, () => {
        allowScroll = true;
      });
    },
    onDisable() {
      // Cleanup any ongoing animations
      isAnimating = false;
      allowScroll = true;
    },
  });

  intentObserver.disable();

  // Create main timeline with ScrollTrigger
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.be-anyone-section',
      pin: true,
      pinSpacing: true,
      start: 'top top',
      end: '+=300',
      scrub: false, // Ensure this is false to prevent scroll locking
      preventOverlaps: true,
      fastScrollEnd: true,
      onEnter: (self) => {
        if (!intentObserver.isEnabled) {
          self.scroll(self.start + 1);
          intentObserver.enable();
        }
      },
      onEnterBack: (self) => {
        if (!intentObserver.isEnabled) {
          self.scroll(self.end - 1);
          intentObserver.enable();
        }
      },
      onLeave: () => {
        intentObserver.disable();
        // Reset states and ensure scroll is released
        isAnimating = false;
        allowScroll = true;
        ScrollTrigger.clearMatchMedia();
      },
      onLeaveBack: () => {
        intentObserver.disable();
        // Reset states and ensure scroll is released
        isAnimating = false;
        allowScroll = true;
        ScrollTrigger.clearMatchMedia();
      },
      onUpdate: (self) => {
        // If we're at the end of the section, ensure observer is disabled
        if (self.progress === 1 || self.progress === 0) {
          intentObserver.disable();
        }
      },
    },
  });

  // Add a minimal duration
  tl.to({}, { duration: 0.01 });

  return tl;
}

window.Webflow ||= [];
window.Webflow.push(() => {
  console.log('GSAP Scroll Animation Loaded!');

  const pageTl = gsap.timeline({});

  pageTl
    .add(landingTimeline()) // Add landing timeline
    .add(beAnyoneTl()); // Add beAnyone timeline
  // .add(createAnythingV2()); // Overlap createAnything timeline by 0.5 seconds
  // .add(readyPlayerTl())
  // .add(horizontalScroll());

  // .add(meetAnybody());
});
