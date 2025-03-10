import gsap from 'gsap';
import CustomEase from 'gsap/CustomEase';
import { SteppedEase } from 'gsap/gsap-core';
import ScrollSmoother from 'gsap/ScrollSmoother';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitText from 'gsap/SplitText';

//https://futureverse-gsap.vercel.app

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText, CustomEase, SteppedEase);

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
  const { element, text, duration = 0.03, staggerDelay = 0.01, onComplete } = options;

  // Get the target element
  const targetElement =
    typeof element === 'string' ? (document.querySelector(element) as HTMLElement) : element;

  if (!targetElement) {
    console.error('Target element not found for typing animation');
    return gsap.timeline(); // Return an empty timeline
  }

  // Determine text to animate:
  // Use the provided text or fall back to the element's current text content
  const animationText = text || targetElement.textContent || '';

  // Clear the element's innerHTML before running the animation
  targetElement.innerHTML = '';
  // Re-insert the text for the animation
  targetElement.textContent = animationText;

  // Ensure the container is visible
  gsap.set(targetElement, { opacity: 1 });

  // Create a SplitText instance to split text into words and characters
  const splitText = new SplitText(targetElement, {
    type: 'words, chars',
    wordsClass: 'word',
    charsClass: 'char',
  });

  // Get the array of character elements
  const { chars } = splitText;

  // Initially hide all characters
  gsap.set(chars, { opacity: 0 });

  // Create timeline for the typing animation
  const timeline = gsap.timeline({
    onComplete: () => {
      if (onComplete) onComplete();
    },
  });

  // Use a stepped ease with the number of steps equal to the number of characters.

  timeline.to(chars, {
    opacity: 1,
    duration,
    stagger: staggerDelay,
    ease: 'none',
  });

  return timeline;
};

interface TypingScrollOptions extends TypeAnimationOptions {
  scrollTrigger: gsap.plugins.ScrollTriggerVars;
}

const setupTypingAnimation = (options: TypingScrollOptions): gsap.core.Timeline => {
  // Create the typing animation timeline and pause it initially.
  const animation = createTypingAnimation({
    element: options.element,
    text: options.text,
    duration: options.duration,
    staggerDelay: options.staggerDelay,
    ease: options.ease,
    onComplete: options.onComplete,
  }).paused(true);

  // Create a timeline with the scrollTrigger using GSAP's default type.
  const scrollAndTimeline = gsap.timeline({
    scrollTrigger: {
      ...options.scrollTrigger,
      onEnter: () => {
        console.log(`entering ${options.text}`);
        return animation.play();
      },
      // onLeave: () => {
      //   console.log(`leaving ${options.text}`);
      // },
      // onEnterBack: () => {
      //   console.log(`entering back ${options.text}`);
      //   return animation.restart();
      // },
      // onLeaveBack: () => {
      //   console.log(`leaving back ${options.text}`);
      // },
      // Optionally, you can handle onLeave, onEnterBack, onLeaveBack, etc.
    },
  });

  return scrollAndTimeline;
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

  console.log('landing section running');

  // Base scroll settings
  const baseSettings = {
    trigger: '.home-landing-section',
    start: 'top top',
    end: '+=50%',
    pin: true,
    scrub: 1.5,
    // markers: true,
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
      scale: 1.2,
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
    .add(typingAnimation, '-=5') // Slightly overlap the typing animation with the previous tween
    // Add a small pause at the end for mobile to prevent abrupt endings
    .to({}, { duration: isMobile ? 1 : 2 });

  return landing;
};

// Example of using the standalone typing animation elsewhere

const createAnythingV2 = () => {
  const secondImage = document.querySelector('.second-img') as HTMLElement;
  const firstImage = document.querySelector('.first-img') as HTMLElement;
  const thirdImage = document.querySelector('.third-img') as HTMLElement;
  const clippedBox = document.querySelector('.clipped-box') as HTMLElement;
  const swappableWrapper = document.querySelector('.swappable-embed') as HTMLElement;

  const content = document.querySelector('.content') as HTMLElement;

  const goHeading = document.querySelector('.go-heading') as HTMLElement;
  const goHeadingTrigger = document.querySelector('.go-heading-trigger') as HTMLElement;

  const anywhereText = document.querySelector('.anywhere-heading') as HTMLElement;
  const anywhereTextTrigger = document.querySelector('.anywhere-trigger') as HTMLElement;

  const goAnywhereCopy = document.querySelector('.go-copy') as HTMLElement;
  const goCopyTrigger = document.querySelector('.go-copy-trigger') as HTMLElement;

  const spacer = document.querySelector('.go-anywhere-spacer') as HTMLElement;

  const createHeading = document.querySelector('.create-heading') as HTMLElement;
  const createHeadingTrigger = document.querySelector('.create-heading-trigger') as HTMLElement;

  const anythingHeading = document.querySelector('.anything-heading') as HTMLElement;
  const anythingHeadingTrigger = document.querySelector('.anything-heading-trigger') as HTMLElement;

  const createAnythingCopy = document.querySelector('.create-anything-max-width') as HTMLElement;
  const createAnythingTrigger = document.querySelector('.content-bottom') as HTMLElement;

  const thirdImageTrigger = document.querySelector('.third-image-trigger') as HTMLElement;

  const gallerySection = document.querySelector('.gallery-section') as HTMLElement;

  // Pre-set elements to hidden for performance
  gsap.set([secondImage, thirdImage, swappableWrapper, gallerySection], {
    autoAlpha: 0,
  });

  gsap.set(thirdImage, { zIndex: 5 });

  const parentTL = gsap.timeline({
    defaults: {
      ease: 'customEase',
    },
  });

  // Create typing animations - keeping them paused initially
  const goCopyTypingAnimation = createTypingAnimation({
    element: goAnywhereCopy,
    staggerDelay: 0.05,
  });

  const copyScrubbedScrollTrigger = gsap.timeline({
    scrollTrigger: {
      trigger: goCopyTrigger,
      start: '20% bottom',
      end: 'bottom top',
      scrub: 1.5,
      // markers: { startColor: 'pink', endColor: 'purple' },
    },
  });

  copyScrubbedScrollTrigger
    .add(goCopyTypingAnimation)
    .to(swappableWrapper, { autoAlpha: 1, duration: 2 }, '<+=15%')
    .to(swappableWrapper, { autoAlpha: 0, duration: 2 }, '+=6');

  const goHeadingTL = setupTypingAnimation({
    element: goHeading,
    text: 'GO',
    staggerDelay: 0.05,
    scrollTrigger: {
      trigger: goHeadingTrigger,
      start: 'top 80%',
      end: 'bottom 40%',
      // markers: { startColor: 'blue', endColor: 'orange' },
    },
  });

  // Create separate timelines for each trigger

  const anywhereHeadingTL = setupTypingAnimation({
    element: anywhereText,
    text: 'ANYWHERE',
    staggerDelay: 0.05,

    scrollTrigger: {
      trigger: anywhereTextTrigger,
      start: 'top 80%',
      end: 'bottom bottom',
      // markers: true,
    },
  });

  const createHeadgingScrollTrigger = setupTypingAnimation({
    element: createHeading,
    text: 'Create',
    staggerDelay: 0.05,
    duration: 0,
    scrollTrigger: {
      trigger: createHeadingTrigger,
      start: 'top 80%',
      end: 'bottom bottom',
      // markers: true,
    },
  }).paused(true);

  const anythingHeadingScrollTrigger = setupTypingAnimation({
    element: anythingHeading,
    text: 'Anything',
    staggerDelay: 0.05,
    duration: 0,
    scrollTrigger: {
      trigger: anythingHeadingTrigger,
      start: 'bottom bottom',
      end: 'bottom center',
      // markers: true,
    },
  }).paused(true);

  const spacerScrollTrigger = gsap.timeline({
    scrollTrigger: {
      trigger: spacer,
      start: 'bottom bottom',
      end: 'bottom center',
      // markers: true,
      scrub: 1.5,
    },
  });

  const createAnythingCopyTypingAnimation2 = createTypingAnimation({
    element: createAnythingCopy,
  });

  const thirdImageTL = gsap.timeline({
    scrollTrigger: {
      trigger: thirdImageTrigger,
      start: 'bottom 75%',
      end: 'bottom 10%',
      scrub: 1.5,
      // markers: { startColor: 'blue', endColor: 'orange' },
    },
  });

  spacerScrollTrigger
    .to(secondImage, { autoAlpha: 0.7, duration: 2 }, '-=2')
    .to(firstImage, { autoAlpha: 0 });

  thirdImageTL
    .to(thirdImage, { autoAlpha: 0.7, duration: 5 })
    .to(thirdImage, { autoAlpha: 1, duration: 2 })
    .add(createAnythingCopyTypingAnimation2, '+=2')
    .to(secondImage, { autoAlpha: 0 }, '<')
    .to(createAnythingCopy, { autoAlpha: 0, duration: 2 }, '+=5')
    .to(thirdImage, { autoAlpha: 0, duration: 5 })
    .to(gallerySection, { autoAlpha: 1, duration: 10 }, '-=2');

  parentTL
    .add(goHeadingTL, 0)
    .add(anywhereHeadingTL, 0)
    .add(spacerScrollTrigger, 0)
    .add(createHeadgingScrollTrigger, 0)
    .add(anythingHeadingScrollTrigger, 0)
    .add(thirdImageTL, 0);

  return parentTL;
};

export function meetAnybody() {
  const elements = {
    section: document.querySelector('.meet-anybody-section') as HTMLElement,
    meetHeading: document.querySelector('.meet-text') as HTMLElement,
    anyBodyHeading: document.querySelector('.anybody-text') as HTMLElement,
    windowContainer: document.querySelector('.clipped-path') as HTMLElement,
    meetContent: document.querySelector('.meet-anybody-text') as HTMLElement,
    meetText: document.querySelector('.meet-content') as HTMLElement,
    meetHeadingTrigger: document.querySelector('.meet-heading-trigger') as HTMLElement,
    anybodyHeadingTrigger: document.querySelector('.anybody-heading-trigger') as HTMLElement,
    backgroundExpandTrigger: document.querySelector('.background-expand-trigger') as HTMLElement,
  };

  const meetCopyTypingAnimation = createTypingAnimation({
    element: elements.meetText,
    text: 'Join a global community, explore new worlds, and connect through interactive in-game features.',
    staggerDelay: 0.01,
  }).paused(true);

  const meetHeadingScrollTrigger = setupTypingAnimation({
    element: elements.meetHeading,
    text: 'MEET',
    staggerDelay: 0.05,
    duration: 0,
    scrollTrigger: {
      trigger: elements.meetHeadingTrigger,
      start: 'top 80%',
      end: 'bottom bottom',
      // markers: { startColor: 'blue', endColor: 'orange' },
    },
  });

  const anybodyHeadingScrollTrigger = setupTypingAnimation({
    element: elements.anyBodyHeading,
    text: 'ANYBODY',
    staggerDelay: 0.05,
    duration: 0,
    scrollTrigger: {
      trigger: elements.anybodyHeadingTrigger,
      start: 'top 80%',
      end: 'bottom bottom',
      // markers: { startColor: 'pink', endColor: 'red' },
    },
  });

  const backgroundExpandTl = gsap.timeline({
    scrollTrigger: {
      trigger: elements.backgroundExpandTrigger,
      start: 'bottom 80%',
      end: 'bottom 10%',
      scrub: 1.5,
    },
  });

  backgroundExpandTl.to(elements.windowContainer, {
    duration: 3, // duration is less relevant when scrubbed; it's the animation's total length
    ease: 'customEase',
    clipPath:
      ' polygon(0% 0%, 0% 100%, 0% 100%, 0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 100%, 100% 100%, 100% 0%) ',
  });

  // Master timeline with scroll trigger for a seamless scroll-driven sequence
  const masterTimeline = gsap.timeline({});

  masterTimeline
    .add(meetHeadingScrollTrigger, 0)
    .add(anybodyHeadingScrollTrigger, 0)
    .add(meetCopyTypingAnimation.play(), 0)
    .add(backgroundExpandTl, 0);

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
  const playerTextCopy = document.querySelector('.ready-player-copy') as HTMLElement;
  const cartridgeWrapper = document.querySelector('.cartridge-wrapper') as HTMLElement;
  const playerText = document.querySelector('.player-text') as HTMLElement;
  const playerHeading = document.querySelector('.player-heading') as HTMLElement;
  const isMobile = window.innerWidth <= breakpoints.mobile;

  playerTextCopy.textContent = '';

  const readyPlayerCopyTypingAnimation = createTypingAnimation({
    text: 'Launch into the action and discover an ever-expanding catalog of games and experiences.',
    element: playerTextCopy,
  });

  // Base settings - increase the end value to allow more time for animation
  const baseSettings = {
    trigger: readyPlayerSection,
    start: 'top top',
    end: '+=100%', // Increased from 200% to 300% to provide more scroll space
    // pin: true,
    // scrub: isMobile ? 3 : 2, // Smoother scrub for mobile
  };

  const readyTypingAnimation = createTypingAnimation({
    element: readyText,
    staggerDelay: 0.05,
  });

  const playerTypingAnimation = createTypingAnimation({
    element: playerHeading,
    staggerDelay: 0.05,
  });

  const playerTypeTl = gsap.timeline({
    scrollTrigger: {
      trigger: playerText,
      start: 'top center',
      end: 'bottom center',
      markers: true,
    },
    defaults: {
      ease: 'customEase',
    },
  });

  playerTypeTl
    .add(readyTypingAnimation)
    .add(playerTypingAnimation)
    .add(readyPlayerCopyTypingAnimation);

  return null;
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
    });

    // Store the instance for potential use later
    window.smoother = smoother;

    return smoother;
  };

  // Set up resize handler
  setupResizeHandler();

  // Set up mobile-specific class
  if (window.innerWidth <= breakpoints.mobile) {
    document.body.classList.add('is-mobile');
  }

  // Initialize everything in the correct order
  // setupScrollSmoother();
  // const smoother = initScrollSmoother();
  setupResizeHandler();
  // Create the main timeline
  const pageTl = gsap.timeline({});

  // Add all the animations to the timeline
  pageTl
    .add(landingTimeline())
    .add(beAnyoneTl())
    .add(createAnythingV2()!)
    .add(meetAnybody())
    .add(readyPlayerTl()!);

  // Add a small delay before refreshing everything
  setTimeout(() => {
    ScrollTrigger.refresh();
  }, 200);
});
