import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  ListTodo, 
  Settings, 
  ChevronLeft,
  ChevronRight,
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../lib/utils';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}

export default function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const { user, logout } = useAuth();
  
  const isAdmin = user?.email === 'admin@team.com';
  
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Briefcase, label: 'Projects', path: '/projects' },
    { icon: ListTodo, label: 'Tasks', path: '/tasks' },
    ...(isAdmin ? [{ icon: ShieldCheck, label: 'Admin', path: '/admin-tasks' }] : []),
  ];

  return (
    <aside 
      className={cn(
        "relative h-screen bg-zinc-950 border-r border-white/5 transition-all duration-500 ease-in-out flex flex-col z-40",
        collapsed ? "w-[80px]" : "w-[260px]"
      )}
    >
      {/* Editorial Logo */}
      <div className="h-24 flex items-center px-6 overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
            <span className="font-display font-black text-black text-xl">T.</span>
          </div>
          {!collapsed && (
            <span className="font-display font-bold text-xl tracking-tighter transition-all duration-300">
              TEAM<span className="text-primary">TASK</span>
            </span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "sidebar-link",
              isActive && "active",
              collapsed && "justify-center px-0"
            )}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-white/5 space-y-2">
        <button 
          onClick={() => logout.mutate()}
          className={cn(
            "sidebar-link w-full text-red-400/70 hover:text-red-400 hover:bg-red-500/5",
            collapsed && "justify-center px-0"
          )}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>

        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="w-full h-10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* User Avatar Section (Handcrafted touch) */}
      {!collapsed && (
        <div className="p-6 bg-zinc-900/30">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center overflow-hidden">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                <span className="font-display font-bold text-xs">{user?.name?.charAt(0)}</span>
              )}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold truncate">{user?.name}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">
                {user?.email === 'admin@team.com' ? 'Administrator' : 'Team Member'}
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
