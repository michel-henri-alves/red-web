import React, { useState, useRef, useEffect } from "react";

export default function DraggableDiv({ children, width = 250, height = 160 }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        const x = e.clientX - offset.current.x;
        const y = e.clientY - offset.current.y;
        setPosition({
          x: clamp(x, 0, window.innerWidth - width),
          y: clamp(y, 0, window.innerHeight - height),
        });
      }
    };

    const handleTouchMove = (e) => {
      if (isDragging && e.touches.length === 1) {
        const touch = e.touches[0];
        const x = touch.clientX - offset.current.x;
        const y = touch.clientY - offset.current.y;
        setPosition({
          x: clamp(x, 0, window.innerWidth - width),
          y: clamp(y, 0, window.innerHeight - height),
        });
      }
    };

    const stopDragging = () => setIsDragging(false);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", stopDragging);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", stopDragging);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", stopDragging);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", stopDragging);
    };
  }, [isDragging, width, height]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setIsDragging(true);
    offset.current = {
      x: touch.clientX - position.x,
      y: touch.clientY - position.y,
    };
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        width,
        height,
        cursor: "move",
        userSelect: "none",
        zIndex: 9999,
        overflow: "auto",
      }}
    >
      {children}
    </div>
  );
}
