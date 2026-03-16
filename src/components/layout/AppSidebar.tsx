import { Logo } from '@/components/ui/Logo';
import { BarChart3, Home, Info, Settings } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useState } from 'react';
import { UserDropdown } from '@/components/UserDropdown';

const navItems = [
  { icon: Home, to: '/', label: 'Home' },
  { icon: BarChart3, to: '/dashboard', label: 'Dashboard' },
  { icon: Info, to: '/about', label: 'About' },
];

export function AppSidebar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  return (
    <aside className="hidden md:flex flex-col items-center w-16 py-5 gap-3 border-r border-sidebar-border shrink-0"
      style={{ background: 'hsl(var(--sidebar-background))' }}>
      {/* Logo */}
      <div className="flex items-center justify-center w-10 h-10 rounded-lg mb-3"
        style={{
          background: 'hsl(var(--sidebar-accent))',
          border: '1px solid hsl(var(--sidebar-border))',
          color: 'hsl(var(--sidebar-primary))',
        }}>
        <Logo className="w-5 h-5" />
      </div>

      {/* Nav items */}
      <div className="flex flex-col gap-1.5 flex-1 w-full px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className="flex items-center justify-center w-full aspect-square rounded-xl text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200"
            activeClassName="bg-sidebar-accent text-sidebar-primary border border-sidebar-border"
            aria-label={item.label}
            title={item.label}
          >
            <item.icon className="w-5 h-5" />
          </NavLink>
        ))}
      </div>

      {/* Bottom */}
      <div className="flex flex-col gap-3 items-center mt-auto px-2 pb-4 relative">
        <div 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all hover:scale-105 cursor-pointer"
          style={{
            background: 'hsl(var(--sidebar-accent))',
            border: '1px solid hsl(var(--sidebar-border))',
            color: 'hsl(var(--sidebar-primary))',
          }}>
          JD
        </div>

        {/* Floating Dropdown — positioned relative to the sidebar base */}
        <div className="absolute bottom-0 left-full ml-2">
          <UserDropdown 
            isOpen={isDropdownOpen} 
            onClose={() => setIsDropdownOpen(false)} 
          />
        </div>
      </div>
    </aside>
  );
}
