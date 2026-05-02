import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  ListTodo, 
  ShieldCheck, 
  LogOut, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
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
        "fixed left-0 top-0 h-screen bg-zinc-950 border-r border-white/5 z-40 transition-all duration-500 ease-in-out flex flex-col",
        collapsed ? "w-24" : "w-80"
      )}
    >
      {/* Editorial Branding */}
      <div className="p-8 pb-12 flex items-center justify-between">
        <div className={cn("flex items-center gap-3 transition-opacity duration-300", collapsed && "opacity-0 invisible")}>
           <div className="h-8 w-8 bg-primary rounded-xl flex items-center justify-center">
              <span className="font-display font-black text-black text-lg">T.</span>
           </div>
           <span className="font-display font-black text-2xl tracking-tighter uppercase">Sync.</span>
        </div>
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 rounded-full border border-white/5 flex items-center justify-center hover:bg-white/5 transition-colors text-muted-foreground"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-4 px-4 py-4 rounded-2xl transition-all group relative overflow-hidden",
              isActive 
                ? "bg-primary text-black font-black" 
                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            )}
          >
            <item.icon size={22} className={cn("shrink-0", !collapsed && "transition-transform group-hover:scale-110")} />
            {!collapsed && <span className="text-sm tracking-tight">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User & Actions */}
      <div className="p-4 mt-auto border-t border-white/5 bg-zinc-900/10">
        {!collapsed && (
          <div className="mb-6 px-4 pt-4">
             <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-2xl bg-zinc-800 border border-white/5 flex items-center justify-center font-black text-sm">
                  {user?.name?.[0].toUpperCase()}
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
        
        <div className="space-y-2">
          <Button 
            variant="ghost" 
            className={cn("w-full h-12 flex items-center justify-start gap-4 px-4 hover:bg-red-500/10 hover:text-red-500", collapsed && "justify-center px-0")}
            onClick={() => logout()}
          >
            <LogOut size={18} className="shrink-0" />
            {!collapsed && <span className="text-xs font-black uppercase tracking-widest">Sign Out</span>}
          </Button>
        </div>
      </div>
    </aside>
  );
}
