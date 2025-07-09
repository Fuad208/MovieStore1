let isInitialized = false;
let mouseMoveHandler = null;

const pageCursors = () => {
  // Prevent multiple initializations
  if (isInitialized) return;
  
  const cursor1 = document.getElementById('cursor');
  const cursor2 = document.getElementById('cursor2');
  const cursor3 = document.getElementById('cursor3');
  
  // Check if all cursor elements exist
  if (!cursor1 || !cursor2 || !cursor3) {
    console.warn('Cursor elements not found');
    return;
  }
  
  // Throttle mousemove events for better performance
  let rafId = null;
  
  mouseMoveHandler = (event) => {
    if (rafId) {
      cancelAnimationFrame(rafId);
    }
    
    rafId = requestAnimationFrame(() => {
      const { clientX, clientY } = event;
      const position = `${clientX}px`;
      const positionY = `${clientY}px`;
      
      cursor1.style.left = position;
      cursor1.style.top = positionY;
      cursor2.style.left = position;
      cursor2.style.top = positionY;
      cursor3.style.left = position;
      cursor3.style.top = positionY;
    });
  };
  
  document.body.addEventListener('mousemove', mouseMoveHandler, { passive: true });
  isInitialized = true;
};

// Cleanup function
export const cleanupCursors = () => {
  if (mouseMoveHandler && isInitialized) {
    document.body.removeEventListener('mousemove', mouseMoveHandler);
    mouseMoveHandler = null;
    isInitialized = false;
  }
};

export default pageCursors;