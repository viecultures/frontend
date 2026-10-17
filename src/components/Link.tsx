import React from 'react';
import { useNavigate } from 'react-router-dom';

interface LinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href?: string;
  to?: string;
  children?: React.ReactNode;
}

export const Link: React.FC<LinkProps> = ({ href, to, children, onClick, className, ...props }) => {
  const navigate = useNavigate();
  const target = to || href || '';

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(e);
    if (target.startsWith('#')) {
      const el = document.getElementById(target.slice(1));
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (target.startsWith('/') || target === '') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      navigate(target || '/');
    }
  };

  return (
    <a href={target} onClick={handleClick} className={className} {...props}>
      {children}
    </a>
  );
};

export default Link;
