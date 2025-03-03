import gsap from 'gsap';
import CustomEase from 'gsap/CustomEase';
import ScrollSmoother from 'gsap/ScrollSmoother';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitText from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText, CustomEase);

CustomEase.create('customEase', '0.42, 0.00, 0.08, 1.00');

interface TypeAnimationOptions {
  element: HTMLElement | string; // Element or selector
  text?: string; // Optional text to set (if not using existing text)
  duration?: number; // Duration per character
  staggerDelay?: number; // Delay between each character
  ease?: string; // GSAP easing function
  onComplete?: () => void; // Callback when animation completes
}

/**
 * Creates a typing animation on the target element
 * @param options Configuration options for the typing animation
 * @returns The GSAP timeline that controls the animation
 */
export const createTypingAnimation = (options: TypeAnimationOptions): gsap.core.Timeline => {
  // Default values
  const {
    element,
    text,
    duration = 0.03,
    staggerDelay = 0.03,
    ease = 'none',
    onComplete,
  } = options;

  // Get the element
  const targetElement =
    typeof element === 'string' ? (document.querySelector(element) as HTMLElement) : element;

  if (!targetElement) {
    console.error('Target element not found for typing animation');
    return gsap.timeline(); // Return empty timeline
  }

  // Set text content if provided
  if (text) {
    targetElement.textContent = text;
  }

  // Ensure the container is visible
  gsap.set(targetElement, { opacity: 1 });

  // Create SplitText instance
  const splitText = new SplitText(targetElement, {
    type: 'words, chars',
    wordsClass: 'word',
    charsClass: 'char',
  });

  // Get the characters array
  const { chars } = splitText;

  // Initially hide all characters
  gsap.set(chars, { opacity: 0 });

  // Create timeline for the typing animation
  const timeline = gsap.timeline({
    onComplete: () => {
      // Optional callback
      if (onComplete) onComplete();
    },
  });

  // Add the typing animation to the timeline
  timeline.to(chars, {
    opacity: 1,
    duration,
    stagger: staggerDelay,
    ease,
  });

  return timeline;
};

/**
 * Creates a typing animation within a ScrollTrigger context
 * @param options TypeAnimationOptions plus ScrollTrigger settings
 * @returns The GSAP timeline
 */
export const createScrollTriggeredTypingAnimation = (
  animationOptions: TypeAnimationOptions,
  scrollTriggerOptions: gsap.plugins.ScrollTriggerInstanceVars
): gsap.core.Timeline => {
  // Create the base timeline with scroll trigger
  const timeline = gsap.timeline({
    scrollTrigger: scrollTriggerOptions,
  });

  // Create the typing animation and add it to our timeline
  const typingTimeline = createTypingAnimation(animationOptions);
  timeline.add(typingTimeline);

  return timeline;
};

// Set up responsive breakpoints
const breakpoints = {
  mobile: 767,
  tablet: 992,
  desktop: 1200,
};

// Create helper function for responsive scroll settings
function getScrollSettings(baseSettings, isMobile) {
  // Clone the base settings to avoid mutation
  const settings = { ...baseSettings };

  if (isMobile) {
    // If mobile, adjust settings for better performance
    // Adjust end distance for mobile (smoother exit)
    settings.end = settings.end.replace(/\+=(\d+)%/, (match, percent) => {
      const mobilePercent = Math.round(parseInt(percent) * 0.9); // 90% of desktop value
      return `+=${mobilePercent}%`;
    });

    // Increase scrub value for smoother animations on mobile
    if (settings.scrub) {
      settings.scrub = typeof settings.scrub === 'boolean' ? 1 : Math.min(settings.scrub * 1.5, 5);
    }

    // Add a small delay to prevent immediate pinning when scrolling starts
    settings.anticipatePin = settings.anticipatePin || 0.2;
  }

  return settings;
}

// Helper function to apply word wrapping to prevent splitting across lines

export const landingTimeline = () => {
  const intoText = document.querySelector('.home-landing-text') as HTMLElement;
  const isMobile = window.innerWidth <= breakpoints.mobile;
  const blackOverlay = document.querySelector('.black-overlay-landing') as HTMLElement;

  // Base scroll settings
  const baseSettings = {
    trigger: '.home-landing-section',
    start: 'top top',
    end: '+=200%',
    pin: true,
    scrub: 1.5,
    anticipatePin: 0.5,
  };

  // Get responsive settings (assuming this function is defined elsewhere)
  const scrollSettings = getScrollSettings(baseSettings, isMobile);

  // Create timeline
  const landing = gsap.timeline({
    scrollTrigger: scrollSettings,
    defaults: { ease: 'customEase' },
  });

  landing
    // Fade in your logo
    .to('.readyverse-logo-home', {
      opacity: 1,
      duration: 2,
    })
    // Then fade it out and move it up
    .to('.readyverse-logo-home', {
      opacity: 0,
      y: -50,
      duration: 1.5,
    })
    .to(blackOverlay, {
      opacity: 1,
      duration: 5,
    });

  // Add the typing animation
  const typingAnimation = createTypingAnimation({
    element: intoText,
    text: 'THE IMMERSIVE GAMING PLATFORM POWERING A UNIVERSE OF CONNECTED PLAY.',
    staggerDelay: 0.03,
  });

  // Add the typing animation to our main timeline
  landing
    .add(typingAnimation)
    // Add a small pause at the end for mobile to prevent abrupt endings
    .to({}, { duration: isMobile ? 1 : 2 });

  return landing;
};

// Example of using the standalone typing animation elsewhere

const createAnythingV2 = () => {
  const secondImage = document.querySelector('.second-img') as HTMLElement;
  const firstImage = document.querySelector('.first-img') as HTMLElement;
  const centerImage = document.querySelector('.third-img') as HTMLElement;
  const clippedBox = document.querySelector('.clipped-box') as HTMLElement;
  const swappableWrapper = document.querySelector('.swappable-wrapper') as HTMLElement;
  const content = document.querySelector('.content') as HTMLElement;
  const goText = document.querySelector('.go-text') as HTMLElement;
  const scramble2 = document.querySelector('.anywhere-text') as HTMLElement;
  const goAnywhereCopy = document.querySelector('.go-copy') as HTMLElement;
  const createText = document.querySelector('.scramble-3') as HTMLElement;
  const anythingText = document.querySelector('.scramble-4') as HTMLElement;
  const createAnythingCopy = document.querySelector('.create-anything-max-width') as HTMLElement;
  const isMobile = window.innerWidth <= breakpoints.mobile;

  goAnywhereCopy.textContent = '';
  createAnythingCopy.textContent = '';

  // Pre-set elements to hidden for performance
  gsap.set([secondImage, centerImage, clippedBox, swappableWrapper, createText, anythingText], {
    autoAlpha: 0,
  });

  gsap.set(centerImage, { zIndex: 5 });

  // Base scroll settings
  const baseSettings = {
    trigger: '.home-scroll-section',
    start: 'top top',
    end: '+=450%',
    pin: true,
    scrub: 2.5,
    markers: true,
    anticipatePin: 0.5,
  };

  const scrollSettings = getScrollSettings(baseSettings, isMobile);

  const firstTl = gsap.timeline({
    scrollTrigger: scrollSettings,
    defaults: {
      ease: 'customEase',
    },
  });

  const goCopyTypingAnimation = createTypingAnimation({
    element: goAnywhereCopy,
    text: 'Unlock the true value of virtual assets and carry the items you own wherever your journey leads you.',
    staggerDelay: 0.05,
  });

  const createAnythingCopyTypingAnimation = createTypingAnimation({
    element: createAnythingCopy,
    text: 'Build, customize, and enhance your Surreal Estate - your home base in The Readyverse – with equipment, vehicles, art, loot and more.',
    staggerDelay: 0.05,
  });

  const mobileAdjustments = isMobile
    ? {
        durationMultiplier: 0.8,
      }
    : {
        durationMultiplier: 1,
      };

  const adjustDuration = (base) => base * mobileAdjustments.durationMultiplier;

  firstTl

    .to(
      clippedBox,
      {
        autoAlpha: 1,
        duration: adjustDuration(1.5),
      },
      '>'
    )
    .to(
      swappableWrapper,
      {
        autoAlpha: 1,
        duration: adjustDuration(1.5),
      },
      '>'
    )
    .add(goCopyTypingAnimation, '>-1')
    // Begin fading secondImage to low opacity with a slight overlap
    .to(
      secondImage,
      {
        autoAlpha: 0.15,
        duration: adjustDuration(3),
      },
      '-=1'
    )
    .to(clippedBox, {
      width: '100%',
      height: '100%',
      duration: adjustDuration(7),
      ease: mobileAdjustments.easeOut,
    })
    // Increase the overlap during the secondImage fade so the change is smoother
    .to(
      secondImage,
      {
        autoAlpha: 0.4,
        duration: adjustDuration(3),
      },
      '-=6'
    )
    .to(
      swappableWrapper,
      {
        autoAlpha: 0,
        duration: adjustDuration(3),
      },
      '-=4'
    )
    .to(
      content,
      {
        autoAlpha: 0,
        duration: adjustDuration(3),
      },
      '-=3'
    )
    // Start fading out firstImage earlier for a more blended crossfade
    .to(
      firstImage,
      {
        autoAlpha: 0,
        duration: adjustDuration(3),
      },
      '>-1' // adjusted offset (was >-0.5) for earlier overlap
    )
    // Fade secondImage back in with an earlier start for the crossfade effect
    .to(
      secondImage,
      {
        autoAlpha: 1,
        duration: adjustDuration(4),
      },
      '-=3' // adjusted offset (was -=2) to overlap more with the firstImage fade-out
    )
    // Start "create" text sooner by overlapping it with the image crossfade
    .to(
      createText,
      {
        autoAlpha: 1,
        duration: adjustDuration(3.5),
      },
      '-=4' // moved earlier compared to the previous timing
    )
    // Likewise, bring in the "anything" text sooner
    .to(
      anythingText,
      {
        autoAlpha: 1,
        duration: adjustDuration(3.5),
      },
      '-=3.5' // adjusted to start earlier than before
    )
    .add(createAnythingCopyTypingAnimation, '>-1')
    .to(
      centerImage,
      {
        autoAlpha: 1,
        duration: adjustDuration(8), // Longer fade‑in duration for center image
      },
      '-=4' // Adjusted offset so it starts earlier in relation to previous tween
    )
    .to(
      secondImage,
      {
        autoAlpha: 0,
        duration: adjustDuration(4), // Extended fade‑out duration for second image
      },
      '+=3' // Delay the fade‑out start by 1 second for a longer overlap
    )

    .to(
      '.content-bottom',
      {
        opacity: 0,
        duration: adjustDuration(2.5),
      },
      '-=1.5'
    );

  // Add a small pause at the end for mobile to prevent abrupt endings
  if (isMobile) {
    firstTl.to({}, { duration: 1 });
  }

  const mm = gsap.matchMedia();

  mm.add('(min-width: 768px)', () => {
    firstTl.add(
      gsap.to(centerImage, {
        scale: 0.7,
        ease: 'power1.inOut',
        duration: 4,
      }),
      '>'
    );
    return () => {};
  });

  mm.add('(max-width: 767px)', () => {
    gsap.set(centerImage, { scale: 1 });
    firstTl.add(gsap.to({}, { duration: 0.5 }), '>');
    return () => {};
  });

  return firstTl;
};

export function meetAnybody() {
  const elements = {
    section: document.querySelector('.meet-anybody-section') as HTMLElement,
    meetHeading: document.querySelector('.meet-text') as HTMLElement,
    anyBodyHeading: document.querySelector('.anybody-text') as HTMLElement,
    windowContainer: document.querySelector('.image-box-home') as HTMLElement,
    meetContent: document.querySelector('.meet-anybody-text') as HTMLElement,
    meetText: document.querySelector('.meet-content') as HTMLElement,
  };
  const isMobile = window.innerWidth <= breakpoints.mobile;

  elements.meetText.textContent = '';

  gsap.set([elements.anyBodyHeading, elements.windowContainer], {
    autoAlpha: 0,
  });

  // Base settings
  const baseSettings = {
    trigger: elements.section,
    start: 'top top',
    end: '+=350%',
    pin: true,
    scrub: true,
  };

  const meetCopyTypingAnimation = createTypingAnimation({
    element: elements.meetText,
    text: 'Join a global community, explore new worlds, and connect through interactive in-game features.',
    staggerDelay: 0.05,
  });

  // Get responsive settings
  const scrollSettings = getScrollSettings(baseSettings, isMobile);

  // Master timeline with scroll trigger for a seamless scroll-driven sequence
  const masterTimeline = gsap.timeline({
    scrollTrigger: scrollSettings,
    defaults: {
      ease: 'customEase',
    },
  });

  masterTimeline
    // Fade in the headings
    .to(elements.anyBodyHeading, { autoAlpha: 1, duration: 2 })
    // Fade in the window container before expanding it
    .to(elements.windowContainer, { autoAlpha: 1, duration: 1 }, '>')
    // Expand the window container to fill the viewport
    .to(elements.windowContainer, {
      width: '100vw',
      height: '100vh',
      duration: isMobile ? 4 : 5, // Slightly faster on mobile
    })
    // Fade in the meetText shortly after the window expansion begins
    .add(meetCopyTypingAnimation, '-=5');
  // Fade out all text elements (both headings and scrambled content)

  // Add a small pause at the end for mobile to prevent abrupt endings
  if (isMobile) {
    masterTimeline.to({}, { duration: 0.5 });
  }

  return masterTimeline;
}

export function beAnyoneTl() {
  const wrapper = document.querySelector('.video-wrapper') as HTMLElement;
  const vidCard = document.querySelector('.vid-card') as HTMLElement;
  const images = gsap.utils.toArray<HTMLElement>('.video-embed');
  const isMobile = window.innerWidth <= breakpoints.mobile;

  // Duplicate the first image and append it to the end for a seamless loop
  const firstClone = images[0].cloneNode(true) as HTMLElement;
  wrapper.appendChild(firstClone);
  images.push(firstClone);

  // Set initial states: first image fully visible, others partially faded
  images.forEach((img, i) => {
    gsap.set(img, {
      opacity: i === 0 ? 1 : 0.5,
      scale: i === 0 ? 1 : 0.95,
    });
  });

  // Build an infinite looping timeline
  const loopTl = gsap.timeline({
    repeat: -1,
    defaults: {
      ease: 'customEase',
      duration: isMobile ? 0.4 : 0.3, // Slightly slower transitions on mobile
    },
  });

  // Animate from each image to the next (including the clone at the end)
  for (let i = 0; i < images.length - 1; i++) {
    loopTl
      // Step 1: Scale down the card
      .to(vidCard, { scale: 0.98 })
      // Step 2: Animate current image out
      .to(images[i], { opacity: 0.5, scale: 0.95 }, '<')
      // Step 3: Scroll the wrapper to the next image position
      .to(
        wrapper,
        {
          scrollLeft: images[i + 1].offsetLeft,
          duration: isMobile ? 0.6 : 0.5,
        },
        '<'
      )
      // Step 4: Animate next image in
      .to(images[i + 1], { opacity: 1, scale: 1 }, '<')
      // Step 5: Scale card back up
      .to(vidCard, { scale: 1 }, 0.15)
      // Step 6: Pause before the next cycle
      .to({}, { duration: isMobile ? 1.5 : 1 });
  }

  // When reaching the clone (which is identical to the first image), reset scrollLeft instantly
  loopTl.set(wrapper, { scrollLeft: 0 });

  return loopTl;
}
function readyPlayerTl() {
  const readyPlayerSection = document.querySelector('.ready-player-section') as HTMLElement;
  const readyText = document.querySelector('.ready-text') as HTMLElement;
  const playerText = document.querySelector('.player-text') as HTMLElement;
  const cartridgeWrapper = document.querySelector('.cartridge-wrapper') as HTMLElement;
  const isMobile = window.innerWidth <= breakpoints.mobile;

  // Base settings - increase the end value to allow more time for animation
  const baseSettings = {
    trigger: readyPlayerSection,
    start: 'top top',
    end: '+=300%', // Increased from 200% to 300% to provide more scroll space
    pin: true,
    scrub: isMobile ? 3 : 2, // Smoother scrub for mobile
  };

  // Get responsive settings
  const scrollSettings = getScrollSettings(baseSettings, isMobile);

  const tl = gsap.timeline({
    scrollTrigger: scrollSettings,
    defaults: {
      ease: 'customEase',
    },
  });

  // Sequence the animations properly
  tl
    // First phase - fade in the heading
    .from(
      cartridgeWrapper,
      {
        autoAlpha: 0,
        yPercent: -50,
        duration: 4,
      },
      '-=1'
    );
  // Add a small pause to let the text be read fully
  // .to({}, { duration: 1 })

  // Second phase - bring in the cartridge after text is fully visible

  // Third phase - hold the final state for a moment
  // .to({}, { duration: 2 }); // Hold the final state longer

  // For mobile, add an additional pause at the end to ensure smooth exit
  if (isMobile) {
    tl.to({}, { duration: 1.5 });
  }

  return tl;
}

// Add a function to handle window resize events
function setupResizeHandler() {
  let resizeTimeout;
  let prevWidth = window.innerWidth;

  window.addEventListener('resize', () => {
    // Clear previous timeout to prevent multiple refreshes
    clearTimeout(resizeTimeout);

    // Set a timeout to avoid excessive refreshes during resize
    resizeTimeout = setTimeout(() => {
      const currentWidth = window.innerWidth;

      // Check if we've crossed a breakpoint
      const wasMobile = prevWidth <= breakpoints.mobile;
      const isMobile = currentWidth <= breakpoints.mobile;

      if ((wasMobile && !isMobile) || (!wasMobile && isMobile)) {
        // Refresh ScrollTrigger to update all pinned sections
        ScrollTrigger.refresh();
      }

      prevWidth = currentWidth;
    }, 250); // 250ms debounce
  });
}

// Main initialization
window.Webflow ||= [];
window.Webflow.push(() => {
  console.log('GSAP Scroll Animation with ScrollSmoother loaded!');

  // Set up the DOM structure required for ScrollSmoother
  // This needs to wrap all content that will be scrolled
  const setupScrollSmoother = () => {
    // Check if the wrapper elements already exist to avoid duplicates
    if (document.querySelector('#smooth-wrapper')) {
      return;
    }

    // Get the body element
    const { body } = document;

    // Create the smoother container
    const smoothContent = document.createElement('div');
    smoothContent.id = 'smooth-content';

    // Move all direct children of body into the smooth content
    while (body.firstChild) {
      smoothContent.appendChild(body.firstChild);
    }

    // Create the wrapper
    const smoothWrapper = document.createElement('div');
    smoothWrapper.id = 'smooth-wrapper';
    smoothWrapper.appendChild(smoothContent);

    // Add wrapper to the body
    body.appendChild(smoothWrapper);

    // Add necessary CSS for the containers
    const style = document.createElement('style');
    style.textContent = `
      html, body {
        overflow: hidden;
        height: 100%;
        width: 100%;
        margin: 0;
        padding: 0;
      }
      #smooth-wrapper {
        overflow: hidden;
        height: 100%;
        width: 100%;
      }
      #smooth-content {
        min-height: 100vh;
        will-change: transform;
      }
    `;
    document.head.appendChild(style);
  };

  // Set up ScrollSmoother with appropriate settings
  const initScrollSmoother = () => {
    const isMobile = window.innerWidth <= breakpoints.mobile;

    // Create the ScrollSmoother instance
    const smoother = ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: isMobile ? 0.8 : 1.2, // Less smoothing on mobile (more responsive)
      effects: true,
      smoothTouch: 0.2, // Light smoothing for touch devices
      normalizeScroll: true, // Normalizes scroll behavior across devices
      ignoreMobileResize: true, // Prevents issues with mobile browser address bars
      speed: 0.9, // Slightly slower scrolling (0.9x)
    });

    // Store the instance for potential use later
    window.smoother = smoother;

    return smoother;
  };

  // Set up resize handler
  const setupResizeHandler = () => {
    let resizeTimeout;
    let prevWidth = window.innerWidth;

    window.addEventListener('resize', () => {
      // Clear previous timeout to prevent multiple refreshes
      clearTimeout(resizeTimeout);

      // Set a timeout to avoid excessive refreshes during resize
      resizeTimeout = setTimeout(() => {
        const currentWidth = window.innerWidth;

        // Check if we've crossed a breakpoint
        const wasMobile = prevWidth <= breakpoints.mobile;
        const isMobile = currentWidth <= breakpoints.mobile;

        if ((wasMobile && !isMobile) || (!wasMobile && isMobile)) {
          // Update classes
          if (isMobile) {
            document.body.classList.add('is-mobile');
          } else {
            document.body.classList.remove('is-mobile');
          }

          // Refresh ScrollTrigger and ScrollSmoother
          ScrollTrigger.refresh();
          if (window.smoother) {
            window.smoother.kill();
            window.smoother = initScrollSmoother();
          }
        }

        prevWidth = currentWidth;
      }, 250); // 250ms debounce
    });
  };

  // Set up mobile-specific class
  if (window.innerWidth <= breakpoints.mobile) {
    document.body.classList.add('is-mobile');
  }

  // Initialize everything in the correct order
  setupScrollSmoother();
  const smoother = initScrollSmoother();
  setupResizeHandler();

  // Create the main timeline
  const pageTl = gsap.timeline({});

  // Add all the animations to the timeline
  pageTl
    .add(landingTimeline())

    .add(beAnyoneTl())
    .add(createAnythingV2())
    .add(meetAnybody())
    .add(readyPlayerTl());

  // Add a small delay before refreshing everything
  setTimeout(() => {
    ScrollTrigger.refresh();
    smoother.refresh();
  }, 200);
});
