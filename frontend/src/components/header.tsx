import { useRouter } from 'next/router';
import Link from 'next/link';
import MenuIcon from '../../public/icons/menu-icon.svg'; // Update with actual path
import OpenMenuIcon from '../../public/icons/open-menu-icon.svg'; // Update with actual path
import { useState, useEffect } from 'react';

export default function Header() {
  const [isClient, setIsClient] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    document.body.classList.toggle('menu-open', !menuOpen);
  };

  const getHeaderClass = () => {
    if (router.pathname === '/signup') {
      return 'alt-header'; // Green header for the signup page
    } else {
      return 'main-header'; // Pink header for the home page and others
    }
  };

  return (
    <header className={getHeaderClass()}>
      <Link href="/" className="title-link">
        <h1>manguro</h1>
      </Link>
      <nav>
        <ul>
          <li>
            <Link href="/login" className="login">
              Login
            </Link>
          </li>
          <li>
            <Link href="/signup" className="sign-up">
              Sign Up
            </Link>
          </li>
          <li>
            <button onClick={toggleMenu}>
              {isClient && (menuOpen ? <OpenMenuIcon /> : <MenuIcon />)}
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}
