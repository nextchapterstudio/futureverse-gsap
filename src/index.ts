import gsap from 'gsap';
import Draggable from 'gsap/Draggable';
import InertiaPlugin from 'gsap/InertiaPlugin';
import ScrambleTextPlugin from 'gsap/ScrambleTextPlugin';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitText from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin, Draggable, InertiaPlugin, SplitText);

function createSequentialScrambleAnimation(element) {
  if (!element) return gsap.timeline(); // Return empty timeline if no element

  // Split text into lines
  const splitText = new SplitText(element, {
    type: 'lines',
    linesClass: 'scramble-line',
  });

  // Initially hide all lines
  gsap.set(splitText.lines, { opacity: 0 });

  // Create a master timeline for the entire animation
  const masterTl = gsap.timeline();

  // Animate each line sequentially
  splitText.lines.forEach((line, index) => {
    // Create a timeline for this specific line
    const lineTl = gsap.timeline();

    // Animate the line with scramble text
    lineTl.to(line, {
      duration: 1.2,
      opacity: 1,
      scrambleText: {
        text: line.innerHTML,
        chars: 'upperCase',
        revealDelay: 0.5,
        speed: 0.3,
        tweenLength: false,
        delimiter: ' ',
      },
      ease: 'power1.inOut',
    });

    // Add this line's animation to the master timeline
    masterTl.add(lineTl, index > 0 ? '-=0.8' : 0);
  });

  // Just return the timeline
  return masterTl;
}

export const landingTimeline = () => {
  const intoText = document.querySelector('.landing-text') as HTMLElement;

  // Use the new line-based splitting function
  const splitTextAnimation = createSequentialScrambleAnimation(intoText);
  const landing = gsap.timeline({
    scrollTrigger: {
      trigger: '.home-landing-section',
      start: 'top top',
      end: '+=200%',
      pin: true,
      scrub: 1.5,
      anticipatePin: 0.5,
    },
  });

  landing
    .to('.readyverse-logo-home', {
      opacity: 1,
      duration: 2,
    })
    .to('.readyverse-logo-home', {
      opacity: 0,
      y: -50,
      duration: 1.5,
      ease: 'power2.out',
    })
    .add(splitTextAnimation, '<');

  return landing;
};

const createAnythingV2 = () => {
  const secondImage = document.querySelector('.second-img') as HTMLElement;
  const firstImage = document.querySelector('.first-img') as HTMLElement;
  const centerImage = document.querySelector('.third-img') as HTMLElement;
  const clippedBox = document.querySelector('.clipped-box') as HTMLElement;
  const swappableWrapper = document.querySelector('.swappable-wrapper') as HTMLElement;
  const content = document.querySelector('.content') as HTMLElement;
  const scramble1 = document.querySelector('.scramble-1') as HTMLElement;
  const scramble2 = document.querySelector('.scamble-2') as HTMLElement;
  const goAnywhereCopy = document.querySelector('.go-anywhere-copy') as HTMLElement;
  const createText = document.querySelector('.scramble-3') as HTMLElement;
  const anythingText = document.querySelector('.scramble-4') as HTMLElement;
  const createAnythingCopy = document.querySelector('.create-anything-copy') as HTMLElement;

  // Use line-based splitting for both text elements
  const goAnywhereTextSplit = createSequentialScrambleAnimation(goAnywhereCopy);
  const createAnythingTextSplit = createSequentialScrambleAnimation(createAnythingCopy);

  // Pre-set elements to hidden for performance
  gsap.set(
    [
      secondImage,
      centerImage,
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
      end: '+=650%',
      pin: true,
      scrub: 2.5,
      anticipatePin: 0.5,
    },
  });

  firstTl
    .to(clippedBox, { autoAlpha: 1, duration: 1.5, ease: 'power1.inOut' }, '>')
    .to(swappableWrapper, { autoAlpha: 1, duration: 1.5, ease: 'power1.inOut' }, '>')
    .to(content, { autoAlpha: 1, duration: 2, ease: 'power1.inOut' })
    .to(scramble1, { autoAlpha: 1, duration: 1.5, ease: 'power1.inOut' }, '>')
    .to(scramble2, { autoAlpha: 1, duration: 1.5, ease: 'power1.inOut' }, '>')
    .add(goAnywhereTextSplit, '<')
    .to(
      secondImage,
      {
        autoAlpha: 0.15,
        duration: 3,
        ease: 'power1.inOut',
      },
      '-=1'
    )
    .to(clippedBox, {
      width: '100%',
      height: '100%',
      duration: 7,
      ease: 'power2.inOut',
    })
    .to(
      secondImage,
      {
        autoAlpha: 0.4,
        duration: 3,
        ease: 'power1.inOut',
      },
      '-=6'
    )
    .to(
      swappableWrapper,
      {
        autoAlpha: 0,
        duration: 3,
        ease: 'power1.inOut',
      },
      '-=4'
    )
    .to(
      content,
      {
        autoAlpha: 0,
        duration: 3,
        ease: 'power1.inOut',
      },
      '-=3'
    )
    .to(
      firstImage,
      {
        autoAlpha: 0,
        duration: 3,
        ease: 'power1.inOut',
      },
      '>-0.5'
    )
    .to(
      secondImage,
      {
        autoAlpha: 1,
        duration: 4,
        ease: 'power1.inOut',
      },
      '-=2'
    )
    .to(
      createText,
      {
        autoAlpha: 1,
        duration: 3.5,
        ease: 'power1.inOut',
      },
      '-=3.5'
    )
    .to(
      anythingText,
      {
        autoAlpha: 1,
        duration: 3.5,
        ease: 'power1.inOut',
      },
      '-=2.5'
    )
    .add(createAnythingTextSplit, '-=2')
    .to(
      centerImage,
      {
        autoAlpha: 1,
        duration: 4.5,
        ease: 'power1.inOut',
      },
      '-=3.5'
    )
    .to(
      secondImage,
      {
        autoAlpha: 0,
        duration: 3,
        ease: 'power1.inOut',
      },
      '<'
    )
    .to(
      '.content-bottom',
      {
        opacity: 0,
        duration: 2.5,
        ease: 'power1.inOut',
      },
      '-=1.5'
    )
    .to(
      centerImage,
      {
        scale: 0.7,
        ease: 'power1.inOut',
        duration: 4,
      },
      '-=2'
    );

  return firstTl;
};

export function meetAnybody() {
  const elements = {
    section: document.querySelector('.meet-anybody-section') as HTMLElement,
    meetHeading: document.querySelector('.meet-text') as HTMLElement,
    anyBodyHeading: document.querySelector('.anybody-text') as HTMLElement,
    windowContainer: document.querySelector('.image-box-home') as HTMLElement,
    meetContent: document.querySelector('.meet-content') as HTMLElement,
    meetImg: document.querySelector('.meet-img') as HTMLElement,
  };

  // Use line-based splitting for text elements
  const meetContentSplit = createSequentialScrambleAnimation(elements.meetContent);

  // Set initial states for key elements

  gsap.set(
    [elements.meetHeading, elements.anyBodyHeading, elements.windowContainer, elements.meetImg],
    { autoAlpha: 0 }
  );

  // Master timeline with scroll trigger for a seamless scroll-driven sequence
  const masterTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: elements.section,
      start: 'top top',
      end: '+=350%',
      pin: true,
      scrub: true,
    },
  });

  masterTimeline
    // Fade in the headings
    .to(elements.meetHeading, { autoAlpha: 1, duration: 2, ease: 'power2.out' })
    .to(elements.anyBodyHeading, { autoAlpha: 1, duration: 2, ease: 'power2.out' }, '>')
    // Fade in the window container before expanding it
    .to(elements.windowContainer, { autoAlpha: 1, duration: 1, ease: 'power2.out' }, '>')
    // Expand the window container to fill the viewport
    .to(elements.windowContainer, {
      width: '100vw',
      height: '100vh',
      duration: 5,
      ease: 'power2.inOut',
    })
    // Start the scrambled text effect shortly after the window expansion begins
    .add(meetContentSplit, '-=2')
    // Fade out all text elements (both headings and scrambled content)
    .to(
      [elements.meetHeading, elements.anyBodyHeading, elements.meetContent],
      { autoAlpha: 0, duration: 2, ease: 'power2.inOut' },
      '-=3' // start fading out just before the window expansion tween ends
    );

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

function readyPlayerTl() {
  const readyPlayerSection = document.querySelector('.ready-player-section') as HTMLElement;
  const readyText = document.querySelector('.ready-text') as HTMLElement;
  const playerText = document.querySelector('.player-text') as HTMLElement;
  const cartridgeWrapper = document.querySelector('.cartridge-wrapper') as HTMLElement;

  // Increase scroll distance and adjust scrub for a slower, smoother effect
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: readyPlayerSection,
      start: 'top top',
      end: '+=200%', // Increased scroll distance
      pin: true,
      scrub: 2, // Increased scrub value for smoother animation
    },
  });

  // Initial states
  gsap.set([readyText, playerText], { autoAlpha: 0 });

  tl.to(readyText, {
    autoAlpha: 1,
    duration: 2, // Longer fade-in duration
    ease: 'power2.out',
  })
    .to(
      playerText,
      {
        autoAlpha: 1,
        duration: 2, // Longer fade-in duration
        ease: 'power2.out',
      },
      '-=1' // Overlap fade-in slightly for a smoother transition
    )
    .from(cartridgeWrapper, { yPercent: -100, autoAlpha: 0, duration: 3, ease: 'none' }, 0);

  return tl;
}

window.Webflow ||= [];
window.Webflow.push(() => {
  console.log('GSAP Scroll Animation Loaded with Line-Based Splitting!');

  const pageTl = gsap.timeline({});

  pageTl
    .add(landingTimeline())
    .add(beAnyoneTl())
    .add(createAnythingV2())
    .add(meetAnybody())
    .add(readyPlayerTl());
});
