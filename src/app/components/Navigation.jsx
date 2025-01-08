'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '../styles/Navigation.module.css';
import { useState } from 'react';

export default function Navigation() {
  const pathname = usePathname();
  const [isNavExpanded, setIsNavExpanded] = useState(false);

  return (
    <nav className={styles.navigation}>
      <Link href="/" className={styles.logo}>Expense Tracker</Link>

      <button
        className={styles.hamburger}
        onClick={() => {
          setIsNavExpanded(!isNavExpanded);
        }}
      >
        {/* icon from Heroicons.com */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="white"
        >
          <path
            fillRule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>

   <div className={`${styles.navigationMenu} ${isNavExpanded ? styles.expanded : ''}`.trim()}
   >
      <ul>
            <li>
              <Link 
               href="/" 
               className={pathname === '/' ? styles.active : ''} 
               onClick={() => setIsNavExpanded(false)}
               >
                 Add Expense
              </Link>
            </li>
            <li>
              <Link 
                href="/summary" 
                className={pathname === '/summary' ? styles.active : ''}
                onClick={() => setIsNavExpanded(false)}
              >
                Summary
              </Link>
              </li>
             <li>
              <Link 
                  href="/limits" 
                  className={pathname === '/limits' ? styles.active : ''}
                  onClick={() => setIsNavExpanded(false)}
                >
                  Limits
                </Link>
             </li>
      </ul>
   </div>

  
    </nav>
  );
}
