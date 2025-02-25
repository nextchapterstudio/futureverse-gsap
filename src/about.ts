import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitText from 'gsap/SplitText';

window.Webflow ||= [];
window.Webflow.push(() => {
  gsap.registerPlugin(ScrollTrigger, SplitText);

  // Get all elements with the class .split-text
  const splitTextArray = gsap.utils.toArray<HTMLParagraphElement>('.split-text');

  // Create a master timeline for sequential animations
  const masterTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: splitTextArray[0], // Use the first paragraph as trigger
      start: 'top 70%',
      end: 'bottom 20%',
      // markers: true, // Uncomment for debugging
      toggleActions: 'play none none reset',
    },
  });

  // Process each split-text element
  splitTextArray.forEach((element, index) => {
    // Create only character splits
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

    // Add character animation for this paragraph
    paragraphTl.to(splitChars.chars, {
      opacity: 1,
      duration: 0.4,
      stagger: 0.02,
      ease: 'back.out(1.7)',
    });

    // Add this paragraph's timeline to the master timeline
    // Each paragraph starts after the previous one completes
    masterTimeline.add(paragraphTl);
  });
});
