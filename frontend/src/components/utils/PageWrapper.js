import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const PageWrapper = ({ children }) => {
  const pageRef = useRef();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        pageRef.current,
        { x: 100, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef}>
      {children}
    </div>
  );
};

export default PageWrapper;
