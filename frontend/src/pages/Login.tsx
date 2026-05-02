import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { api } from '../lib/axios';
import React from 'react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const [loginError, setLoginError] = React.useState('');
  const [isLoggingIn, setIsLoggingIn] = React.useState(false);

  const onSubmit = async (data: LoginForm) => {
    try {
      setLoginError('');
      setIsLoggingIn(true);
      const response = await api.post('/auth/login', data);
      login(response.data.data.accessToken, response.data.data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setLoginError(err.response?.data?.error?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background relative overflow-hidden">
      {/* Handcrafted Visual Tension: Large Asymmetrical background text */}
      <div className="absolute top-[-10%] right-[-10%] select-none pointer-events-none opacity-[0.02] transform rotate-12">
        <h1 className="text-[30rem] font-black font-display leading-none">AUTH</h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-24 xl:px-48 z-10">
        <div className="max-w-md w-full space-y-12">
          {/* Logo/Brand */}
          <div className="space-y-6">
             <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center">
                <span className="font-display font-black text-black text-2xl">T.</span>
             </div>
             <div className="space-y-2">
                <h1 className="text-6xl font-display font-extrabold tracking-tighter leading-none">
                  Sign in.
                </h1>
                <p className="text-zinc-500 font-medium text-lg">
                  Back to the pulse of your workspace.
                </p>
             </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {loginError && (
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl text-red-400 text-xs font-bold text-center animate-fade-in">
                {loginError}
              </div>
            )}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 pl-1">
                  Email Address
                </label>
                <input
                  {...register('email')}
                  className="w-full bg-zinc-950 border-2 border-white/5 rounded-2xl px-6 py-4 text-sm font-bold focus:border-primary focus:ring-0 outline-none transition-all placeholder:text-zinc-800"
                  placeholder="name@team.com"
                />
                {errors.email && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest pl-1">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
                    Password
                  </label>
                  <Link to="#" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">
                    Forgot?
                  </Link>
                </div>
                <input
                  {...register('password')}
                  type="password"
                  className="w-full bg-zinc-950 border-2 border-white/5 rounded-2xl px-6 py-4 text-sm font-bold focus:border-primary focus:ring-0 outline-none transition-all placeholder:text-zinc-800"
                  placeholder="••••••••"
                />
                {errors.password && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest pl-1">{errors.password.message}</p>}
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-16 text-lg" 
              isLoading={isLoggingIn}
            >
              Enter Workspace
            </Button>
          </form>


          <p className="text-center text-zinc-500 font-medium">
            New here?{' '}
            <Link to="/signup" className="text-primary font-black hover:underline tracking-tight">
              Create an account
            </Link>
          </p>
        </div>
      </div>

      {/* Decorative Right Panel (Asymmetry) */}
      <div className="hidden lg:flex lg:flex-1 bg-zinc-900/20 items-center justify-center p-24 border-l border-white/5 relative">
        <div className="space-y-8 relative z-10">
          <div className="space-y-4">
            <h3 className="text-5xl font-display font-extrabold tracking-tighter leading-tight italic">
              "Focus is a matter of deciding what things you're not going to do."
            </h3>
            <p className="text-zinc-500 font-black uppercase tracking-widest text-xs">— Steve Jobs</p>
          </div>
        </div>
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
      </div>
    </div>
  );
}
