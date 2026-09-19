import React from 'react';

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children?: React.ReactNode;
}

export const Link: React.FC<LinkProps> = ({ href, children, onClick, className, ...props }) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(e);
    if (href.startsWith('#')) {
      const el = document.getElementById(href.slice(1));
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (href.startsWith('/') || href === '') {
      e.preventDefault();
      let targetView = 'home';
      if (href === '/discovery') targetView = 'discovery';
      else if (href === '/community') targetView = 'community-1';
      else if (href === '/community-2') targetView = 'community-2';
      else if (href === '/flashcards') targetView = 'flashcards';
      else if (href === '/reader') targetView = 'reader';

      window.dispatchEvent(new CustomEvent('app:navigate', { detail: targetView }));
    }
  };

  return (
    <a href={href} onClick={handleClick} className={className} {...props}>
      {children}
    </a>
  );
};

export default Link;
