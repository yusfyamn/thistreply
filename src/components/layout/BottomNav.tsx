'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Clock, Settings, Moon, Sun } from 'lucide-react';
import { ExpandableTabs } from '@/components/ui/ExpandableTabs';
import './BottomNav.css';

const navItems = [
  { title: 'Home', icon: Home, href: '/dashboard' },
  { title: 'History', icon: Clock, href: '/history' },
  { title: 'Settings', icon: Settings, href: '/settings' },
];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const activeIndex = navItems.findIndex(item => pathname === item.href);

  const handleChange = (index: number) => {
    if (navItems[index]) {
      router.push(navItems[index].href);
    }
  };

  if (!mounted) return null;

  return (
    <nav className="bottom-nav-wrapper">
      <div className="bottom-nav-inner">
        <ExpandableTabs
          tabs={navItems}
          activeIndex={activeIndex >= 0 ? activeIndex : 0}
          onChange={handleChange}
          activeColor="text-[#ff4d6d]"
        />
        <button 
          onClick={toggleTheme} 
          className="theme-toggle-btn"
          aria-label="Toggle dark mode"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>
    </nav>
  );
}
