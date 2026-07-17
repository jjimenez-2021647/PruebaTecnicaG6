import { useEffect, useRef } from 'react';

export function CustomCursor() {
  const dotRef = useRef(null);
  const followerRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) {
      return undefined;
    }

    const dot = dotRef.current;
    const follower = followerRef.current;
    let mouseX = 0;
    let mouseY = 0;
    let followerX = 0;
    let followerY = 0;
    let frame = 0;

    const move = (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    };

    const animate = () => {
      followerX += (mouseX - followerX) * 0.18;
      followerY += (mouseY - followerY) * 0.18;
      follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0)`;
      frame = requestAnimationFrame(animate);
    };

    const setActive = () => document.body.classList.add('cursor-active');
    const clearActive = () => document.body.classList.remove('cursor-active');

    document.addEventListener('mousemove', move);
    document.querySelectorAll('a, button, input').forEach((element) => {
      element.addEventListener('mouseenter', setActive);
      element.addEventListener('mouseleave', clearActive);
    });
    frame = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', move);
      document.querySelectorAll('a, button, input').forEach((element) => {
        element.removeEventListener('mouseenter', setActive);
        element.removeEventListener('mouseleave', clearActive);
      });
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <span className="cursor-dot" ref={dotRef} aria-hidden="true" />
      <span className="cursor-follower" ref={followerRef} aria-hidden="true" />
    </>
  );
}
