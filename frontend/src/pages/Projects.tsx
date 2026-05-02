import { useProjects, useCreateProject } from '../hooks/useProjects';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Plus, LayoutGrid, Users, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Projects() {
  const { data: projects, isLoading } = useProjects();
  const createProject = useCreateProject();
  const { user } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  const handleCreate = async () => {
    if (!newProjectName) return;
    await createProject.mutateAsync({ name: newProjectName, color: '#bef264' });
    setNewProjectName('');
    setIsCreating(false);
  };

  const isAdmin = user?.email === 'admin@team.com';

  return (
    <div className="space-y-12 pb-20">
      {/* Editorial Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4 max-w-2xl">
          <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.3em] text-[10px]">
            <span className="h-px w-8 bg-primary" />
            Infrastructure
          </div>
          <h1 className="editorial-header">Active Streams.</h1>
          <p className="text-muted-foreground text-lg font-medium leading-relaxed">
            Every great initiative starts with a clear boundary. Manage your team's domains and project scopes here.
          </p>
        </div>
        
        {isAdmin && (
          <Button size="lg" onClick={() => setIsCreating(!isCreating)} variant={isCreating ? 'secondary' : 'primary'}>
            <Plus className={cn("mr-2 h-5 w-5 transition-transform", isCreating && "rotate-45")} />
            {isCreating ? 'Close' : 'New Project'}
          </Button>
        )}
      </header>

      {/* Inline Creation Form */}
      {isAdmin && isCreating && (
        <div className="premium-card p-10 bg-primary/5 border-primary/20 animate-fade-in">
          <div className="flex flex-col md:flex-row gap-8 items-end">
            <div className="flex-1 space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/70 pl-1">
                Project Domain Name
              </label>
              <input 
                value={newProjectName} 
                onChange={(e) => setNewProjectName(e.target.value)} 
                placeholder="e.g. Next-Gen Marketing Interface"
                className="w-full bg-zinc-950/50 border-b-2 border-primary/20 text-2xl font-display font-bold py-4 focus:border-primary outline-none transition-all placeholder:text-zinc-800"
              />
            </div>
            <Button onClick={handleCreate} isLoading={createProject.isPending} size="lg" className="w-full md:w-auto">
              Initialize Project
            </Button>
          </div>
        </div>
      )}

      {/* Projects Grid */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {projects?.map((project: any) => (
            <Link key={project.id} to={`/projects/${project.id}`} className="group">
              <div className="premium-card h-full flex flex-col p-8 group-hover:bg-zinc-900/30 group-hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
                {/* Asymmetric Decorator */}
                <div 
                  className="absolute top-0 right-0 w-32 h-32 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none"
                  style={{ color: project.color }}
                >
                  <LayoutGrid size={128} className="transform translate-x-1/2 -translate-y-1/2" />
                </div>

                <div className="space-y-6 relative z-10">
                  <div className="flex justify-between items-start">
                    <div 
                      className="h-12 w-12 rounded-2xl flex items-center justify-center border border-white/5 bg-zinc-950"
                      style={{ color: project.color }}
                    >
                      <LayoutGrid size={24} />
                    </div>
                    <ArrowRight className="text-zinc-800 group-hover:text-primary transition-colors" size={20} />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-2xl font-display font-black tracking-tight group-hover:text-primary transition-colors">
                      {project.name}
                    </h3>
                    <p className="text-muted-foreground text-sm font-medium line-clamp-2 leading-relaxed">
                      {project.description || 'Focusing on the architectural integrity of the core mission.'}
                    </p>
                  </div>

                  <div className="flex items-center gap-6 pt-6 border-t border-white/5">
                    <div className="flex items-center gap-2">
                       <LayoutGrid size={14} className="text-primary" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                         {project._count.tasks} Tasks
                       </span>
                    </div>
                    <div className="flex items-center gap-2">
                       <Users size={14} className="text-zinc-600" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                         {project._count.members} Members
                       </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
          
          {projects?.length === 0 && (
            <div className="col-span-full premium-card p-20 text-center space-y-6">
              <p className="text-zinc-500 italic text-xl">"Great things are not done by impulse, but by a series of small things brought together."</p>
              <p className="text-muted-foreground">You haven't initialized any projects yet.</p>
              {isAdmin && <Button onClick={() => setIsCreating(true)}>Get Started</Button>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
