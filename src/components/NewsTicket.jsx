import React, { useRef, useEffect, useState } from "react";

const NewsTicker = ({ messages = [], baseSpeed = 50 }) => {
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const [contentWidth, setContentWidth] = useState(0);
  const [animationDuration, setAnimationDuration] = useState(baseSpeed);

  useEffect(() => {
    if (contentRef.current && containerRef.current) {
      const width = contentRef.current.scrollWidth;
      const containerWidth = containerRef.current.offsetWidth;
      setContentWidth(width);

      // Ajusta a duração proporcional à largura do conteúdo
      const duration = (width + containerWidth) / 50; // 50 px/s
      setAnimationDuration(duration);
    }
  }, [messages]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-10 bg-gray-800 overflow-hidden flex items-center"
    >
      {/* Fade nas bordas */}
      <div className="absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-gray-800 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-gray-800 to-transparent z-10 pointer-events-none" />

      {/* Conteúdo rolante */}
      <div
        className="flex whitespace-nowrap"
        style={{
          animation: `marquee ${animationDuration}s linear infinite`,
          animationPlayState: "running",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.animationPlayState = "paused")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.animationPlayState = "running")
        }
      >
        <div ref={contentRef} className="flex">
          {[...messages, ...messages].map((msg, index) => (
            <span key={index} className="mx-8 text-white">
              {msg}
            </span>
          ))}
        </div>
      </div>

      {/* Keyframes inline */}
      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-${contentWidth}px); }
          }
        `}
      </style>
    </div>
  );
};

export default NewsTicker;
