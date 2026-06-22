import { useState } from 'react';
import { useTheme } from '../context/theme';

interface NavbarProps {
  currentPage: 'home' | 'about';
  onNavigate: (page: 'home' | 'about') => void;
}

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md"
      style={{
        background: 'var(--nav-bg)',
        borderBottom: '1px solid var(--border)',
        boxShadow: 'var(--shadow)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <button onClick={() => onNavigate('home')} className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-md flex items-center justify-center"
            style={{ background: 'var(--accent-bg)', border: '1px solid var(--accent-border)' }}
          >
            <i className="ti ti-radar text-sm" style={{ color: 'var(--accent)' }} />
          </div>
          <span className="font-semibold text-sm tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Disaster<span style={{ color: 'var(--accent)' }}>SUM</span>
          </span>
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {(['home', 'about'] as const).map((page) => (
            <button
              key={page}
              onClick={() => onNavigate(page)}
              className="px-3.5 py-1.5 rounded-md text-sm transition-colors"
              style={{
                background: currentPage === page ? 'var(--border-md)' : 'transparent',
                color: currentPage === page ? 'var(--text-primary)' : 'var(--text-secondary)',
              }}
            >
              {page === 'home' ? 'Ekstraksi' : 'Tentang'}
            </button>
          ))}

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="ml-2 w-8 h-8 rounded-md flex items-center justify-center transition-colors"
            style={{ background: 'var(--border)', color: 'var(--text-secondary)' }}
            title={theme === 'dark' ? 'Mode terang' : 'Mode gelap'}
          >
            <i className={`ti ${theme === 'dark' ? 'ti-sun' : 'ti-moon'} text-sm`} />
          </button>
        </div>

        {/* Mobile right side */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="w-8 h-8 rounded-md flex items-center justify-center"
            style={{ background: 'var(--border)', color: 'var(--text-secondary)' }}
          >
            <i className={`ti ${theme === 'dark' ? 'ti-sun' : 'ti-moon'} text-sm`} />
          </button>
          <button
            className="w-8 h-8 rounded-md flex items-center justify-center"
            style={{ color: 'var(--text-secondary)' }}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <i className={`ti ${menuOpen ? 'ti-x' : 'ti-menu-2'} text-lg`} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden px-6 py-3 flex flex-col gap-1" style={{ borderTop: '1px solid var(--border)' }}>
          {(['home', 'about'] as const).map((page) => (
            <button
              key={page}
              onClick={() => { onNavigate(page); setMenuOpen(false); }}
              className="px-3 py-2 rounded-md text-sm text-left transition-colors"
              style={{
                background: currentPage === page ? 'var(--border-md)' : 'transparent',
                color: currentPage === page ? 'var(--text-primary)' : 'var(--text-secondary)',
              }}
            >
              {page === 'home' ? 'Ekstraksi' : 'Tentang'}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
