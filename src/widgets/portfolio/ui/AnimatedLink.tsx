import type { ReactNode } from 'react';

type AnimatedLinkProps = {
  href: string;
  children: ReactNode;
  target?: string;
  rel?: string;
  className?: string;
};

export const AnimatedLink = ({ href, children, target, rel, className = '' }: AnimatedLinkProps) => {
  return (
    <a
      href={href}
      target={target}
      rel={rel}
      className={`flex items-center gap-1.5 hover:text-pink-100 transition-colors relative 
        before:absolute before:-bottom-1 before:left-0 before:w-full before:h-0.5 before:bg-pink-300 
        before:scale-x-0 before:origin-left before:transition-transform before:duration-300 
        hover:before:scale-x-100 ${className}`}
    >
      {children}
    </a>
  );
};
