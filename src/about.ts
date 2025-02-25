import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitText from 'gsap/SplitText';

window.Webflow ||= [];
window.Webflow.push(() => {
  gsap.registerPlugin(ScrollTrigger, SplitText);

  // Get all elements with the class .split-text
  const splitTextArray = gsap.utils.toArray<HTMLParagraphElement>('.split-text');

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
      y: 20,
    });

    // Create timeline for character animation only
    const charsTl = gsap.timeline({
      scrollTrigger: {
        trigger: element,
        start: 'top 70%',
        end: 'bottom 20%',
        // markers: true, // Uncomment for debugging
        toggleActions: 'play none none reset',
      },
    });

    charsTl.to(splitChars.chars, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      stagger: 0.02,
      ease: 'back.out(1.7)',
    });
  });
});
