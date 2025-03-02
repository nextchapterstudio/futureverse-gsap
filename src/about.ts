import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitText from 'gsap/SplitText';

window.Webflow ||= [];
window.Webflow.push(() => {
  gsap.registerPlugin(ScrollTrigger, SplitText);

  // ---------------------------
  // Founders Images Animation
  // ---------------------------
  const foundersWrapper = document.querySelector('.founders-wrapper') as HTMLElement;
  const foundersImages = gsap.utils.toArray<HTMLDivElement>('.founders-image');
  const foundersSection = document.querySelector('.founders-section');

  // Set initial opacity for all founder image divs to 40%
  gsap.set(foundersImages, { opacity: 0.4 });

  // Calculate the total scroll distance required for cycling through the images.
  // Adjust the multiplier (200) as needed for your desired scroll distance.
  const scrollDistance = foundersImages.length * 200;

  // Create a timeline that pins the foundersSection until all highlights have run.
  const foundersTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: foundersSection, // Use the entire section as the trigger
      start: 'top top', // When the section hits the top of the viewport
      end: `+=${scrollDistance}`, // Remain pinned for the calculated scroll distance
      pin: foundersSection, // Pin the foundersSection
      pinSpacing: true, // Maintain the layout spacing during pinning
      scrub: true, // Sync the timeline with scroll progress
    },
  });

  // Cycle through each founder image: highlight (opacity to 1) then revert back (opacity to 0.4)
  foundersImages.forEach((div) => {
    foundersTimeline
      .to(div, {
        opacity: 1,
        duration: 0.5,
        ease: 'none',
      })
      .to(div, {
        opacity: 0.4,
        duration: 0.5,
        ease: 'none',
      });
  });

  // ---------------------------
  // Split Text Animations
  // ---------------------------
  const splitTextArray = gsap.utils.toArray<HTMLParagraphElement>('.split-text');

  // Apply word splitting and wrapping to prevent breaking across lines
  splitTextArray.forEach((element) => {
    const splitWords = new SplitText(element, {
      type: 'words',
      wordsClass: 'split-word',
    });
    gsap.set(splitWords.words, {
      display: 'inline-block',
      whiteSpace: 'nowrap',
      margin: '0 0.2em 0 0', // Add a small gap between words
    });
  });

  // Create the master timeline for sequential paragraph animations
  const masterTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: splitTextArray[0],
      start: 'top bottom',
      end: 'bottom top+=60%', // Adjust as needed
      toggleActions: 'play none none reset',
      scrub: 0.5,
    },
  });

  // Animate each paragraph's characters sequentially
  splitTextArray.forEach((element) => {
    const splitChars = new SplitText(element, {
      type: 'chars',
      charsClass: 'chars',
    });
    gsap.set(splitChars.chars, { opacity: 0.3 });
    const paragraphTl = gsap.timeline();
    paragraphTl.to(splitChars.chars, {
      opacity: 1,
      duration: 0.2,
      stagger: 0.01,
      ease: 'back.out(1.7)',
    });
    masterTimeline.add(paragraphTl);
  });

  // Create a color transition timeline for text elements
  const colorTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: splitTextArray[0],
      start: 'top center',
      end: '.partners-section top',
      scrub: true,
    },
  });

  splitTextArray.forEach((element) => {
    const colorSplit = new SplitText(element, {
      type: 'chars',
      charsClass: 'color-chars',
    });
    colorTimeline.to(
      colorSplit.chars,
      {
        color: 'white',
        duration: 0.5,
        ease: 'none',
      },
      0 // All animations start simultaneously
    );
  });
});
