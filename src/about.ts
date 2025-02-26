import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitText from 'gsap/SplitText';

window.Webflow ||= [];
window.Webflow.push(() => {
  gsap.registerPlugin(ScrollTrigger, SplitText);

  // Get all elements with the class .split-text
  const splitTextArray = gsap.utils.toArray<HTMLParagraphElement>('.split-text');

  // First, apply word wrapping to prevent splitting across lines
  splitTextArray.forEach((element) => {
    // First split into words
    const splitWords = new SplitText(element, {
      type: 'words',
      wordsClass: 'split-word',
    });

    // Add word-wrap: nowrap to each word to prevent breaking
    gsap.set(splitWords.words, {
      display: 'inline-block',
      whiteSpace: 'nowrap',
      margin: '0 0.2em 0 0', // Add a small gap between words
    });
  });

  // Create the master timeline for sequential animations
  const masterTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: splitTextArray[0], // Use the first paragraph as trigger
      start: 'top bottom', // Start when the first paragraph enters viewport
      end: 'bottom top+=60%', // End when the last paragraph is about to leave viewport (before reaching partners)

      toggleActions: 'play none none reset',
      scrub: 0.5, // Smoother scrubbing
    },
  });

  // Process each split-text element for character animations
  splitTextArray.forEach((element, index) => {
    // Create character splits within each element
    const splitChars = new SplitText(element, {
      type: 'chars',
      charsClass: 'chars',
    });

    // Set initial states for characters
    gsap.set(splitChars.chars, {
      opacity: 0.3,
    });

    // Create timeline for this specific paragraph
    const paragraphTl = gsap.timeline();

    // Add character animation for opacity
    paragraphTl.to(splitChars.chars, {
      opacity: 1,
      duration: 0.2,
      stagger: 0.01,
      ease: 'back.out(1.7)',
    });

    // Add this paragraph's timeline to the master timeline
    // Each paragraph starts after the previous one completes
    masterTimeline.add(paragraphTl);
  });

  // Create a single color transition for all text elements
  const colorTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: splitTextArray[0], // Use the first paragraph as the trigger
      start: 'top center', // Start color change when first paragraph is at center
      end: '.partners-section top', // End when reaching the partners section
      scrub: true,
      // markers: true,
    },
  });

  // Add all character elements to the color timeline
  splitTextArray.forEach((element) => {
    const colorSplit = new SplitText(element, {
      type: 'chars',
      charsClass: 'color-chars',
    });

    // Add to the color timeline (all paragraphs change together)
    colorTimeline.to(
      colorSplit.chars,
      {
        color: 'white',
        duration: 0.5,
        ease: 'none',
      },
      0
    ); // The "0" makes all paragraphs start the color change at the same time
  });
});
