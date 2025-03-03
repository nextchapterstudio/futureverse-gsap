import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitText from 'gsap/SplitText';

window.Webflow ||= [];
window.Webflow.push(() => {
  gsap.registerPlugin(ScrollTrigger, SplitText);

  // Shared helper function to ensure the element is fully visible horizontally
  function ensureVisible(
    div: HTMLElement,
    foundersSection: HTMLElement,
    foundersWrapper: HTMLElement
  ) {
    const sectionRect = foundersSection.getBoundingClientRect();
    const rect = div.getBoundingClientRect();
    let shift = 0;
    // If the image is too far left (hidden), shift right.
    if (rect.left < sectionRect.left) {
      shift = sectionRect.left - rect.left;
    }
    // If the image is too far right (hidden), shift left leaving 16px padding.
    else if (rect.right > sectionRect.right - 16) {
      shift = sectionRect.right - 16 - rect.right;
    }
    if (shift !== 0) {
      gsap.to(foundersWrapper, { x: `+=${shift}`, duration: 0.3, ease: 'power1.out' });
    }
  }

  // Use matchMedia to create separate ScrollTrigger configurations for desktop and mobile.
  ScrollTrigger.matchMedia({
    // Desktop: enable pinning and horizontal scroll with a fixed distance of 800
    '(min-width: 768px)': () => {
      const foundersWrapper = document.querySelector('.founders-wrapper') as HTMLElement;
      const foundersImages = gsap.utils.toArray<HTMLDivElement>('.founders-image');
      const foundersSection = document.querySelector('.founders-section') as HTMLElement;

      // Force overflow visible so that any horizontal shifts reveal content
      foundersSection.style.overflow = 'visible';
      gsap.set(foundersImages, { opacity: 0.4 });

      // Set scroll distance to 800 on desktop
      const scrollDistance = 800;

      const foundersTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: foundersSection,
          start: 'top top',
          end: `+=${scrollDistance}`,
          pin: foundersSection,
          pinSpacing: true,
          scrub: true,
          fastScrollEnd: false,
          invalidateOnRefresh: true,
        },
      });

      foundersImages.forEach((div) => {
        foundersTimeline
          .to(div, { opacity: 1, duration: 1, ease: 'none' })
          .call(() => ensureVisible(div, foundersSection, foundersWrapper))
          .to(div, { opacity: 0.4, duration: 1, ease: 'none' });
      });
    },
    // Mobile: enable pinning and horizontal scroll with a fixed distance of 400
    '(max-width: 767px)': () => {
      const foundersWrapper = document.querySelector('.founders-wrapper') as HTMLElement;
      const foundersImages = gsap.utils.toArray<HTMLDivElement>('.founders-image');
      const foundersSection = document.querySelector('.founders-section') as HTMLElement;

      gsap.set(foundersImages, { opacity: 0.4 });

      // Set scroll distance to 400 on mobile
      const scrollDistance = 400;

      const mobileTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: foundersSection,
          start: 'top top',
          end: `+=${scrollDistance}`,
          scrub: true,
          pin: foundersSection,
          pinSpacing: true,
        },
      });

      foundersImages.forEach((div) => {
        mobileTimeline
          .to(div, { opacity: 1, duration: 1, ease: 'none' })
          .call(() => ensureVisible(div, foundersSection, foundersWrapper))
          .to(div, { opacity: 0.4, duration: 1, ease: 'none' });
      });
    },
  });

  // ---------------------------
  // Split Text Animations (unchanged)
  // ---------------------------
  const splitTextArray = gsap.utils.toArray<HTMLParagraphElement>('.split-text');

  splitTextArray.forEach((element) => {
    const splitWords = new SplitText(element, {
      type: 'words',
      wordsClass: 'split-word',
    });
    gsap.set(splitWords.words, {
      display: 'inline-block',
      whiteSpace: 'nowrap',
      margin: '0 0.2em 0 0',
    });
  });

  const masterTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: splitTextArray[0],
      start: 'top bottom',
      end: 'bottom top+=60%',
      toggleActions: 'play none none reset',
      scrub: 0.5,
    },
  });

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
      0
    );
  });
});
