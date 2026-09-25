import React from 'react';
import { useNavigate } from 'react-router-dom';

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children?: React.ReactNode;
}

export const Link: React.FC<LinkProps> = ({ href, children, onClick, className, ...props }) => {
  const navigate = useNavigate();

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
      let targetPath = href;
      if (href === '/flashcards' || href === '/flashcard-study-page') targetPath = '/flashcard-study';
      else if (href === '/reader') targetPath = '/bilingual-reader';

      window.dispatchEvent(new CustomEvent('app-navigate', { detail: targetPath }));
      navigate(targetPath);
    }
  };

  return (
    <a href={href} onClick={handleClick} className={className} {...props}>
      {children}
    </a>
  );
};

export default Link;
