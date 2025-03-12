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

  targetElement.innerHTML = ''; // Clear the element's content

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
      onLeaveBack: () => {
        console.log(`leaving back ${options.text}`);
        animation.pause(0);
      },
      // Optionally, you can handle onLeave, onEnterBack, onLeaveBack, etc.
    },
    defaults: { ease: 'customEase' },
  });

  return scrollAndTimeline;
};

// Set up responsive breakpoints
const breakpoints = {
  mobile: 767,
  tablet: 992,
  smallDesktop: 1024,
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
    end: '+=20%',
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

  const goHeading = document.querySelector('.go-heading') as HTMLElement;
  const goHeadingTrigger = document.querySelector('.go-heading-trigger') as HTMLElement;

  const anywhereText = document.querySelector('.anywhere-heading') as HTMLElement;
  const anywhereTextTrigger = document.querySelector('.anywhere-trigger') as HTMLElement;

  const goAnywhereCopy = document.querySelector('.go-copy') as HTMLElement;
  const goCopyDesktopText = document.querySelector('.go-copy-desktop-text') as HTMLElement;

  const goCopyTrigger = document.querySelector('.go-anywhere-trigger') as HTMLElement;

  const spacer = document.querySelector('.go-anywhere-spacer') as HTMLElement;

  const createHeading = document.querySelector('.create-heading') as HTMLElement;
  const createHeadingTrigger = document.querySelector('.create-heading-trigger') as HTMLElement;

  const anythingHeading = document.querySelector('.anything-heading') as HTMLElement;
  const anythingHeadingTrigger = document.querySelector('.anything-heading-trigger') as HTMLElement;

  const createAnythingCopy = document.querySelector('.create-anything-max-width') as HTMLElement;
  const createAnythingTrigger = document.querySelector('.content-bottom') as HTMLElement;

  const thirdImageTrigger = document.querySelector('.third-image-trigger') as HTMLElement;

  const goCopyMobileTrigger = document.querySelector('.go-copy-mobile-trigger') as HTMLElement;
  const goCopyDesktopTrigger = document.querySelector('.go-copy-desktop') as HTMLElement;

  const gallerySection = document.querySelector('.gallery-section') as HTMLElement;

  const isSmall = window.innerWidth <= breakpoints.smallDesktop;

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

  if (isSmall) {
    setupTypingAnimation({
      element: goAnywhereCopy,
      scrollTrigger: {
        trigger: goCopyMobileTrigger,
        start: 'top bottom',
        end: 'bottom bottom',
        // markers: true,
      },
    });

    const goAnywhereMobileTL = gsap.timeline({
      scrollTrigger: {
        trigger: goCopyTrigger,
        start: 'top 80%',
        end: 'bottom -50%',
        markers: true,
        scrub: 1.5,
      },
      defaults: { ease: 'customEase' },
    });

    goAnywhereMobileTL
      .to(swappableWrapper, { autoAlpha: 1, duration: 1 })
      .to(
        clippedBox,
        {
          height: '100%',
          width: '100%',
          duration: 5,
        },
        '<'
      )
      .to([swappableWrapper, clippedBox], {
        autoAlpha: 0,
        duration: 2,
      });
  } else {
    setupTypingAnimation({
      element: goCopyDesktopText,
      scrollTrigger: {
        trigger: goCopyDesktopTrigger,
        start: 'top center',
        end: 'bottom bottom',
        // markers: true,
      },
    });

    const copyScrubbedScrollTrigger = gsap.timeline({
      scrollTrigger: {
        trigger: goCopyTrigger,
        start: '20% bottom',
        end: 'bottom -90%',
        scrub: 1.5,
        markers: { startColor: 'pink', endColor: 'purple' },
      },
      defaults: { ease: 'customEase' },
    });

    copyScrubbedScrollTrigger
      .to(swappableWrapper, { autoAlpha: 1, duration: 2 })
      .to(
        clippedBox,
        {
          height: '100%',
          width: '100%',
          duration: 5,
        },
        '<'
      )
      .to([swappableWrapper, clippedBox], { autoAlpha: 0, duration: 2 });
  }

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
    scrollTrigger: {
      trigger: createHeadingTrigger,
      start: 'top 80%',
      end: 'bottom bottom',
      // markers: true,
    },
  });

  const anythingHeadingScrollTrigger = setupTypingAnimation({
    element: anythingHeading,
    text: 'Anything',
    staggerDelay: 0.05,
    scrollTrigger: {
      trigger: anythingHeadingTrigger,
      start: 'bottom bottom',
      end: 'bottom center',
      // markers: true,
    },
  });

  const createAnythingCopyScrollTrigger = setupTypingAnimation({
    element: createAnythingCopy,
    scrollTrigger: {
      trigger: createAnythingTrigger,
      start: 'top 80%',
      end: 'bottom bottom',
      // markers: { startColor: 'blue', endColor: 'orange' },
    },
  });

  const spacerScrollTrigger = gsap.timeline({
    scrollTrigger: {
      trigger: spacer,
      start: 'bottom bottom',
      end: 'bottom center',
      // markers: true,
      scrub: 1.5,
    },
    defaults: { ease: 'customEase' },
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
    .to(secondImage, { autoAlpha: 0 }, '<')
    .to(thirdImage, { autoAlpha: 0, duration: 5 })
    .to(gallerySection, { autoAlpha: 1, duration: 10 }, '-=2');

  parentTL
    .add(goHeadingTL, 0)
    .add(anywhereHeadingTL, 0)
    .add(spacerScrollTrigger, 0)
    .add(createHeadgingScrollTrigger, 0)
    .add(anythingHeadingScrollTrigger, 0)
    .add(createAnythingCopyScrollTrigger, 0)
    .add(thirdImageTL, 0);

  return parentTL;
};

export function meetAnybody() {
  const isSmall = window.innerWidth <= breakpoints.smallDesktop;

  const elements = {
    section: document.querySelector('.meet-anybody-section') as HTMLElement,
    meetHeading: document.querySelector('.meet-text') as HTMLElement,
    anyBodyHeading: document.querySelector('.anybody-text') as HTMLElement,
    windowContainer: document.querySelector('.clipped-path') as HTMLElement,
    meetContent: document.querySelector('.meet-anybody-text') as HTMLElement,
    meetText: document.querySelector('.meet-content') as HTMLElement,
    meetTextMobile: document.querySelector('.meet-content-mobile-copy') as HTMLElement,
    meetHeadingTrigger: document.querySelector('.meet-heading-trigger') as HTMLElement,
    anybodyHeadingTrigger: document.querySelector('.anybody-heading-trigger') as HTMLElement,
    backgroundExpandTrigger: document.querySelector('.background-expand-trigger') as HTMLElement,
    leftCorner: document.querySelector('.top-left-meet') as HTMLElement,
    rightCorner: document.querySelector('.right-corner-meet') as HTMLElement,
    bottomLeftCorner: document.querySelector('.bottom-left-meet') as HTMLElement,
    bottomRightCorner: document.querySelector('.bottom-right-meet') as HTMLElement,
    meetAnybodyCorners: document.querySelectorAll(
      '.meet-anybody-corners'
    ) as NodeListOf<HTMLElement>,

    meetCopyDesktopTrigger: document.querySelector('.meet-anybody-text') as HTMLElement,
    meetCopyMobileTrigger: document.querySelector('.meet-mobile-copy') as HTMLElement,
  };

  if (isSmall) {
    setupTypingAnimation({
      element: elements.meetTextMobile,
      scrollTrigger: {
        trigger: elements.meetCopyMobileTrigger,
        start: 'top 80%',
        end: 'bottom bottom',
        // markers: true,
      },
    });
  } else {
    setupTypingAnimation({
      element: elements.meetText,
      scrollTrigger: {
        trigger: elements.meetCopyDesktopTrigger,
        start: 'top 60%',
        end: 'bottom bottom',
        // markers: { startColor: 'blue', endColor: 'orange' },
      },
    });
  }

  const meetHeadingScrollTrigger = setupTypingAnimation({
    element: elements.meetHeading,
    text: 'MEET',
    staggerDelay: 0.05,
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
      start: isSmall ? 'bottom bottom' : 'bottom 80%',
      end: isSmall ? 'bottom 70%' : 'bottom center',
      scrub: 1.5,
      markers: true,
    },
    defaults: { ease: 'customEase' },
  });

  backgroundExpandTl
    .to(elements.windowContainer, {
      duration: 2, // duration is less relevant when scrubbed; it's the animation's total length
      ease: 'customEase',
      clipPath:
        ' polygon(0% 0%, 0% 100%, 0% 100%, 0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 100%, 100% 100%, 100% 0%) ',
    })
    .to(elements.meetAnybodyCorners, { height: '100%', width: '100%', duration: 2 }, '<');

  // Master timeline with scroll trigger for a seamless scroll-driven sequence
  const masterTimeline = gsap.timeline({});

  masterTimeline
    .add(meetHeadingScrollTrigger, 0)
    .add(anybodyHeadingScrollTrigger, 0)
    .add(backgroundExpandTl, 0);

  return masterTimeline;
}

function readyPlayerTl() {
  const readyText = document.querySelector('.ready-text') as HTMLElement;
  const playerTextCopy = document.querySelector('.ready-player-copy') as HTMLElement;
  const playerText = document.querySelector('.player-text') as HTMLElement;
  const playerHeading = document.querySelector('.player-heading') as HTMLElement;

  const isSmall = window.innerWidth <= breakpoints.smallDesktop;

  playerTextCopy.textContent = '';

  const readyTypingAnimation = setupTypingAnimation({
    element: readyText,
    staggerDelay: 0.05,
    scrollTrigger: {
      trigger: playerText,
      start: isSmall ? 'top 90%' : 'top bottom',
      end: 'bottom center',
    },
  });

  const playerTypingAnimation = setupTypingAnimation({
    element: playerHeading,
    staggerDelay: 0.05,
    scrollTrigger: {
      trigger: playerText,
      start: isSmall ? 'top 80%' : 'top 60%',
      end: 'bottom center',
      // markers: true,
    },
  });

  const readyPlayerCopyTypingAnimation = setupTypingAnimation({
    text: 'Launch into the action and discover an ever-expanding catalog of games and experiences.',
    element: playerTextCopy,
    scrollTrigger: {
      trigger: playerText,
      start: isSmall ? 'top 70%' : 'top center',
      end: 'bottom center',
    },
  });

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
  pageTl.add(landingTimeline()).add(createAnythingV2()!).add(meetAnybody()).add(readyPlayerTl()!);

  // Add a small delay before refreshing everything
  setTimeout(() => {
    ScrollTrigger.refresh();
  }, 200);
});
