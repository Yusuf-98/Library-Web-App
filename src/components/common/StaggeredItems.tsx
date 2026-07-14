import type { ReactNode } from 'react';
import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/utils';

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const FADE_EASING = 'cubic-bezier(0.25, 0.1, 0.58, 1)';

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

const AXIS: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 1 },
  down: { x: 0, y: -1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
  none: { x: 0, y: 0 },
};

// Atur kecepatan & jarak per arah
const CONFIG: Record<Direction, { duration: number; distance: number }> = {
  up: { duration: 1400, distance: 30 },
  down: { duration: 1400, distance: 30 },
  left: { duration: 1400, distance: 30 },
  right: { duration: 1400, distance: 30 },
  none: { duration: 2400, distance: 0 },
};

interface StaggerItemProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
}

function StaggerItem({
  direction,
  children,
  // Atur delay
  delay = 0,
  duration = CONFIG[direction].duration,
  distance = CONFIG[direction].distance,
  className,
}: StaggerItemProps & { direction: Direction }) {
  const { ref, isInView } = useInView<HTMLDivElement>();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const axis = AXIS[direction];
  const hiddenTranslate = `${axis.x * distance}px ${axis.y * distance}px`;

  return (
    <div
      ref={ref}
      className={cn(isInView ? 'opacity-100' : 'opacity-0', className)}
      style={{
        translate: isInView ? '0 0' : hiddenTranslate,
        transitionProperty:
          direction === 'none' ? 'opacity' : 'opacity, translate',
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: FADE_EASING,
        transitionDelay: isInView ? `${delay}ms` : '0ms',
      }}
    >
      {children}
    </div>
  );
}

export function FadeInUp(props: StaggerItemProps) {
  return <StaggerItem direction='up' {...props} />;
}

export function FadeInDown(props: StaggerItemProps) {
  return <StaggerItem direction='down' {...props} />;
}

export function FadeInLeft(props: StaggerItemProps) {
  return <StaggerItem direction='left' {...props} />;
}

export function FadeInRight(props: StaggerItemProps) {
  return <StaggerItem direction='right' {...props} />;
}

export function FadeIn(props: StaggerItemProps) {
  return <StaggerItem direction='none' {...props} />;
}
