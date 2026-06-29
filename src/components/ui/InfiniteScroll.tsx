'use client';

import { ReactNode, useEffect, useRef } from 'react';

interface InfiniteScrollProps {
  children: ReactNode;
  speed?: number;
  direction?: 'left' | 'right';
  pauseOnHover?: boolean;
  className?: string;
}

export default function InfiniteScroll({
  children,
  speed = 40,
  direction = 'left',
  pauseOnHover = true,
  className = '',
}: InfiniteScrollProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollerRef.current || !innerRef.current) return;

    const inner = innerRef.current;

    // Clone the items multiple times for seamless loop
    const scrollerContent = Array.from(inner.children);
    
    // Duplicate 3 times for truly seamless scrolling
    for (let i = 0; i < 3; i++) {
      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true) as HTMLElement;
        duplicatedItem.setAttribute('aria-hidden', 'true');
        inner.appendChild(duplicatedItem);
      });
    }
  }, [children]);

  return (
    <div
      ref={scrollerRef}
      className={`overflow-hidden ${className}`}
      style={{
        maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
      }}
    >
      <div
        ref={innerRef}
        className={`flex gap-4 ${
          pauseOnHover ? 'hover:[animation-play-state:paused]' : ''
        }`}
        style={{
          animation: `scroll-${direction} ${speed}s linear infinite`,
        }}
      >
        {children}
      </div>
      <style jsx>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-25%);
          }
        }
        @keyframes scroll-right {
          0% {
            transform: translateX(-25%);
          }
          100% {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
