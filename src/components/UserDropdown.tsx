import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  FileText, 
  Activity, 
  Settings, 
  User, 
  BookOpen, 
  LogOut, 
  Sun, 
  Moon, 
  Monitor,
  Check
} from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { Link } from 'react-router-dom';

interface UserDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserDropdown: React.FC<UserDropdownProps> = ({ isOpen, onClose }) => {
  const { theme, setTheme } = useTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const navLinks = [
    { label: 'Home', icon: Home, to: '/' },
    { label: 'Pages', icon: FileText, to: '#' },
    { label: 'Activity stream', icon: Activity, to: '#' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, scale: 0.95, x: -10 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.95, x: -10 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-72 bg-card/95 backdrop-blur-xl border border-border rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden z-[100] text-foreground"
        >
          {/* Section Header */}
          <div className="px-4 pt-4 pb-2">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold font-mono">
              Account context
            </p>
          </div>

          {/* Navigation Section */}
          <div className="p-1.5">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors group"
              >
                <link.icon className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                <span className="text-xs font-medium uppercase tracking-wider">{link.label}</span>
              </Link>
            ))}
          </div>

          <div className="h-px bg-border/50 mx-4" />

          {/* Preferences & Profile */}
          <div className="p-1.5">
            <Link
              to="#"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors group"
            >
              <User className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
              <span className="text-xs font-medium uppercase tracking-wider">Preferences</span>
            </Link>
            <Link
              to="#"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors group"
            >
              <BookOpen className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
              <span className="text-xs font-medium uppercase tracking-wider">Docs</span>
            </Link>
            <button
              onClick={onClose}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-500/10 transition-colors group text-red-500/80 hover:text-red-500"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="text-xs font-medium uppercase tracking-wider">Sign out</span>
            </button>
          </div>

          <div className="h-px bg-border/50 mx-4" />

          {/* Theme Switcher — Terminal style */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold font-mono">App Theme</span>
            </div>
            <div className="flex items-center gap-1 p-1 bg-muted/20 rounded-lg border border-border/50">
              {[
                { id: 'light', icon: Sun, label: 'Light' },
                { id: 'dark', icon: Moon, label: 'Dark' },
                { id: 'system', icon: Monitor, label: 'Sys' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id as any)}
                  className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md transition-all text-[10px] font-bold uppercase tracking-tighter ${
                    theme === t.id 
                      ? 'bg-foreground text-background shadow-lg' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                  }`}
                >
                  <t.icon className="w-3 h-3" />
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* User Card — Stats-style */}
          <div className="p-4 flex items-center gap-4 bg-muted/10 border-t border-border mt-auto">
            <div className="w-8 h-8 rounded-lg bg-foreground text-background flex items-center justify-center text-[10px] font-black border border-border">
              JD
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-xs font-bold tracking-tight truncate">Jane Doe</p>
                <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest truncate">jane.doe@quant.lab</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
