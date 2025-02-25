import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitText from 'gsap/SplitText';

window.Webflow ||= [];
window.Webflow.push(() => {
  gsap.registerPlugin(ScrollTrigger, SplitText);

  // Get all elements with the class .split-text
  const splitTextArray = gsap.utils.toArray<HTMLParagraphElement>('.split-text');

  // First, apply word wrapping to prevent splitting across lines
  // This creates a nested structure: words containing chars
  splitTextArray.forEach((element) => {
    // First split into words
    const splitWords = new SplitText(element, {
      type: 'words',
      wordsClass: 'split-word', // Add a class to words for styling
    });

    // Add word-wrap: nowrap to each word to prevent breaking
    gsap.set(splitWords.words, {
      display: 'inline-block',
      whiteSpace: 'nowrap',
      margin: '0 0.2em 0 0', // Add a small gap between words
    });
  });

  // Now create the master timeline for sequential animations
  const masterTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: '.partners-section', // Use the first paragraph as trigger
      start: 'top bottom',
      end: '+=100%', // Extend the end point
      markers: true, // Uncomment for debugging
      toggleActions: 'play none none reset',
      scrub: 1, // Smooth scrubbing
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
      color: 'inherit', // Start with the inherited color
    });

    // Create timeline for this specific paragraph
    const paragraphTl = gsap.timeline();

    // Add character animation for opacity (sped up)
    paragraphTl.to(splitChars.chars, {
      opacity: 1,
      duration: 0.2, // Reduced from 0.4
      stagger: 0.01, // Reduced from 0.02
      ease: 'back.out(1.7)',
    });

    // Add this paragraph's timeline to the master timeline
    // Each paragraph starts after the previous one completes
    masterTimeline.add(paragraphTl);
  });

  // Add a separate ScrollTrigger for the color change of all characters
  splitTextArray.forEach((element) => {
    // Get all characters in this element
    const splitChars = new SplitText(element, {
      type: 'chars',
      charsClass: 'color-chars', // Different class to avoid conflicts
    });

    // Create a color transition timeline
    gsap
      .timeline({
        scrollTrigger: {
          trigger: element,
          start: 'top bottom', // Start when top of element hits bottom of viewport
          end: 'top center',
          // markers: true, // Uncomment for debugging
        },
      })
      .to(splitChars.chars, {
        color: 'white', // Transition to white
        duration: 0.5, // Reduced from 1
        ease: 'none',
        stagger: 0, // All change at once based on scroll position
      });
  });
});
