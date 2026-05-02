import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/axios';
import { LayoutList, Clock, CheckCircle2, AlertCircle, Plus, ArrowUpRight } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../hooks/useAuth';
import { useTasks, useUpdateTaskStatus } from '../hooks/useTasks';
import { Button } from '../components/ui/Button';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const updateTaskStatus = useUpdateTaskStatus();
  const isAdmin = user?.email === 'admin@team.com';

  const { data: stats } = useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => (await api.get('/dashboard/stats')).data.data
  });

  const { data: overdue } = useQuery({
    queryKey: ['dashboard', 'overdue'],
    queryFn: async () => (await api.get('/dashboard/overdue')).data.data
  });

  const { data: activity } = useQuery({
    queryKey: ['dashboard', 'activity'],
    queryFn: async () => (await api.get('/dashboard/activity')).data.data
  });

  const { data: myTasks } = useTasks({ assignee: user?.id });

  const activeTasks = myTasks?.filter((t: any) => t.status !== 'Done') || [];

  return (
    <div className="space-y-12 pb-20">
      {/* Editorial Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4 max-w-2xl">
          <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.3em] text-[10px]">
            <span className="h-px w-8 bg-primary" />
            Workspace Overview
          </div>
          <h1 className="editorial-header">
            Welcome back, <br />
            <span className="text-zinc-500">{user?.name?.split(' ')[0]}.</span>
          </h1>
          <p className="text-muted-foreground text-lg font-medium leading-relaxed">
            You have <span className="text-foreground font-bold">{activeTasks.length} active tasks</span> across {stats ? Object.keys(stats).length : 0} projects. Let's make some progress today.
          </p>
        </div>
        
        {isAdmin && (
          <Link to="/projects">
            <Button size="lg" className="shrink-0 group">
              <Plus className="mr-2 h-5 w-5 transition-transform group-hover:rotate-90" />
              New Project
            </Button>
          </Link>
        )}
      </header>


      {/* Asymmetric Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard 
            label="In Progress" 
            value={stats?.['In Progress'] || 0} 
            icon={Clock} 
            color="text-primary" 
          />
          <StatCard 
            label="Review" 
            value={stats?.['Review'] || 0} 
            icon={LayoutList} 
            color="text-amber-400" 
          />
          <StatCard 
            label="Completed" 
            value={stats?.Done || 0} 
            icon={CheckCircle2} 
            color="text-emerald-400" 
          />
        </div>
        <div className="md:col-span-4">
          <div className="premium-card p-6 h-full bg-red-500/5 border-red-500/10 flex flex-col justify-between group cursor-pointer hover:bg-red-500/10 transition-colors">
            <div className="flex justify-between items-start">
              <p className="text-[10px] font-black uppercase tracking-widest text-red-400/70">Urgent Attention</p>
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <p className="text-5xl font-display font-black text-red-500">{overdue?.length || 0}</p>
              <p className="text-sm font-bold text-red-400/80 mt-2">Overdue Tasks</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area: Asymmetric 2-Column */}
      <div className="asymmetric-grid">
        {/* Left Column: Active Tasks */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-display font-bold tracking-tight">Your Priority Stack</h2>
            <Button variant="ghost" size="sm" className="text-[10px]">View All</Button>
          </div>
          
          <div className="space-y-4">
            {activeTasks.slice(0, 4).map((task: any) => (
              <div key={task.id} className="premium-card p-6 flex items-center justify-between group hover:translate-x-2 transition-all">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{task.project.name}</p>
                  <h4 className="font-display font-bold text-lg leading-tight group-hover:text-primary transition-colors">
                    {task.title}
                  </h4>
                </div>
                <div className="flex items-center gap-6">
                   <div className="hidden sm:block text-right">
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Status</p>
                      <p className="text-xs font-bold text-primary">{task.status}</p>
                   </div>
                   <button 
                    className="h-10 w-10 rounded-full border border-white/5 flex items-center justify-center hover:bg-primary hover:text-black transition-all"
                    onClick={() => updateTaskStatus.mutate({ id: task.id, status: 'Done' })}
                   >
                     <ArrowUpRight size={18} />
                   </button>
                </div>
              </div>
            ))}
            {activeTasks.length === 0 && (
              <div className="premium-card p-12 text-center space-y-4">
                <p className="text-zinc-500 font-medium italic text-lg">"The best way to get something done is to begin."</p>
                <p className="text-sm text-muted-foreground">No tasks in your stack. Time to recharge or pick up something new.</p>
              </div>
            )}
          </div>
        </section>

        {/* Right Column: Activity Feed */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-display font-bold tracking-tight">Pulse</h2>
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          </div>

          <div className="premium-card p-8 bg-zinc-900/20">
            <div className="space-y-10">
              {activity?.slice(0, 5).map((item: any, idx: number) => (
                <div key={item.id} className="relative flex gap-6 group">
                  {/* Vertical Line */}
                  {idx !== activity.length - 1 && (
                    <div className="absolute left-3 top-8 bottom-[-2.5rem] w-px bg-white/5" />
                  )}
                  
                  <div className={cn(
                    "h-6 w-6 rounded-full border-4 border-zinc-950 shrink-0 mt-1 z-10",
                    item.status === 'Done' ? 'bg-emerald-500' : 'bg-zinc-800'
                  )} />
                  
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                      {item.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Moved to <span className="text-foreground font-black uppercase tracking-widest text-[10px]">{item.status}</span>
                    </p>
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mt-2">
                      {format(new Date(item.updated_at), 'MMM d, HH:mm')}
                    </p>
                  </div>
                </div>
              ))}
              {(!activity || activity.length === 0) && (
                <p className="text-sm text-zinc-600 italic">No activity recorded in the last 24 hours.</p>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }: any) {
  return (
    <div className="premium-card p-6 flex flex-col justify-between min-h-[160px] group transition-all hover:bg-zinc-900/50">
      <div className="flex justify-between items-start">
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</p>
        <div className={cn("p-2 rounded-xl bg-zinc-900 border border-white/5", color)}>
          <Icon size={18} />
        </div>
      </div>
      <div>
        <p className="text-4xl font-display font-black tracking-tight">{value}</p>
      </div>
    </div>
  );
}
