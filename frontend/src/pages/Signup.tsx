import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { api } from '../lib/axios';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, 'Must contain 1 uppercase, 1 number, 1 special character'),
});

type SignupForm = z.infer<typeof signupSchema>;

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema)
  });

  const onSubmit = async (data: SignupForm) => {
    try {
      setError('');
      const response = await api.post('/auth/signup', data);
      // Auto-login after signup
      login(response.data.data.accessToken, response.data.data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Signup failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex bg-background relative overflow-hidden">
      {/* Handcrafted Visual Tension: Large Asymmetrical background text */}
      <div className="absolute bottom-[-10%] left-[-10%] select-none pointer-events-none opacity-[0.02] transform -rotate-12">
        <h1 className="text-[30rem] font-black font-display leading-none">JOIN</h1>
      </div>

      {/* Decorative Left Panel (Asymmetry) */}
      <div className="hidden lg:flex lg:flex-1 bg-zinc-900/20 items-center justify-center p-24 border-r border-white/5 relative">
        <div className="space-y-8 relative z-10">
          <div className="space-y-4">
            <h3 className="text-5xl font-display font-extrabold tracking-tighter leading-tight">
              "Great things in business are never done by one person."
            </h3>
            <p className="text-zinc-500 font-black uppercase tracking-widest text-xs">— Steve Jobs</p>
          </div>
        </div>
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
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
                  Join.
                </h1>
                <p className="text-zinc-500 font-medium text-lg">
                  Start synchronizing your team's momentum.
                </p>
             </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl text-red-400 text-xs font-bold text-center">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 pl-1">
                  Full Name
                </label>
                <input
                  {...register('name')}
                  className="w-full bg-zinc-950 border-2 border-white/5 rounded-2xl px-6 py-4 text-sm font-bold focus:border-primary focus:ring-0 outline-none transition-all placeholder:text-zinc-800"
                  placeholder="Alex Smith"
                />
                {errors.name && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest pl-1">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 pl-1">
                  Email Address
                </label>
                <input
                  {...register('email')}
                  className="w-full bg-zinc-950 border-2 border-white/5 rounded-2xl px-6 py-4 text-sm font-bold focus:border-primary focus:ring-0 outline-none transition-all placeholder:text-zinc-800"
                  placeholder="alex@team.com"
                />
                {errors.email && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest pl-1">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 pl-1">
                  Password
                </label>
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
              className="w-full h-16 text-lg mt-4" 
              isLoading={isSubmitting}
            >
              Create Account
            </Button>
          </form>

          <p className="text-center text-zinc-500 font-medium">
            Already in the sync?{' '}
            <Link to="/login" className="text-primary font-black hover:underline tracking-tight">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
