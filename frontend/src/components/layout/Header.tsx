import { useAuth } from '../../hooks/useAuth';
import { LogOut } from 'lucide-react';
import { Button } from '../ui/Button';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-10 flex h-16 flex-shrink-0 items-center gap-x-4 border-b border-white/5 bg-background/50 backdrop-blur-xl px-4 sm:gap-x-6 sm:px-6 lg:px-8">
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 justify-end items-center">
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <div className="flex items-center gap-x-3">
            <span className="hidden lg:flex lg:items-center">
              <span className="text-sm font-semibold leading-6 text-gray-100" aria-hidden="true">
                {user?.name}
              </span>
            </span>
            {user?.avatar_url ? (
              <img className="h-8 w-8 rounded-full border border-white/10" src={user.avatar_url} alt="" />
            ) : (
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold shadow-lg shadow-primary-500/20">
                {user?.name?.[0]?.toUpperCase()}
              </div>
            )}
            <Button variant="ghost" size="sm" onClick={logout} className="ml-2 text-gray-400 hover:text-white hover:bg-white/5">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
