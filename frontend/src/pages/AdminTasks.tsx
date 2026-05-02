import { useState } from 'react';
import { useTasks, useDeleteTask } from '../hooks/useTasks';
import { Button } from '../components/ui/Button';
import { Trash2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../lib/utils';

export default function AdminTasks() {
  const { data: tasks, isLoading } = useTasks({});
  const deleteTask = useDeleteTask();
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    setSelectedTasks(prev => 
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedTasks.length} tasks?`)) return;
    
    for (const id of selectedTasks) {
      await deleteTask.mutateAsync(id);
    }
    setSelectedTasks([]);
  };

  if (isLoading) return (
    <div className="flex justify-center items-center h-[60vh]">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
    </div>
  );

  return (
    <div className="space-y-12 pb-20">
      {/* Editorial Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4 max-w-2xl">
          <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.3em] text-[10px]">
            <span className="h-px w-8 bg-primary" />
            Administrative
          </div>
          <h1 className="editorial-header">System Audit.</h1>
          <p className="text-muted-foreground text-lg font-medium leading-relaxed">
            High-level oversight of all active streams. Use with caution.
          </p>
        </div>

        <div className="flex items-center gap-4">
          {selectedTasks.length > 0 && (
            <Button variant="secondary" onClick={handleBulkDelete} className="text-red-400 border-red-500/20 hover:bg-red-500/10">
              <Trash2 className="w-4 h-4 mr-2" />
              Purge {selectedTasks.length} Units
            </Button>
          )}
        </div>
      </header>

      <div className="premium-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-zinc-900/30">
                <th className="px-6 py-5">
                  <input 
                    type="checkbox" 
                    className="h-4 w-4 rounded border-zinc-800 bg-zinc-950 text-primary focus:ring-primary transition-all"
                    checked={selectedTasks.length === tasks?.length && tasks?.length > 0}
                    onChange={(e) => setSelectedTasks(e.target.checked ? tasks.map((t: any) => t.id) : [])}
                  />
                </th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Task Detail</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Domain</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Status</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Assignee</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">Deadline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {tasks?.map((task: any) => (
                <tr 
                  key={task.id} 
                  className={cn(
                    "hover:bg-zinc-900/20 transition-colors",
                    selectedTasks.includes(task.id) && "bg-primary/5"
                  )}
                >
                  <td className="px-6 py-5">
                    <input 
                      type="checkbox" 
                      className="h-4 w-4 rounded border-zinc-800 bg-zinc-950 text-primary focus:ring-primary transition-all"
                      checked={selectedTasks.includes(task.id)}
                      onChange={() => toggleSelect(task.id)}
                    />
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1">
                      <span className="font-display font-bold text-base">{task.title}</span>
                      <span className={cn(
                        "text-[9px] font-black uppercase tracking-widest w-fit px-1.5 py-0.5 rounded",
                        task.priority === 'High' ? 'bg-red-500/10 text-red-400' : 'bg-zinc-800 text-zinc-400'
                      )}>
                        {task.priority}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm font-medium text-zinc-400">{task.project.name}</td>
                  <td className="px-6 py-5">
                    <span className="text-xs font-bold text-primary italic uppercase tracking-tighter">
                      {task.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm font-bold">{task.assignee?.name || '---'}</td>
                  <td className="px-6 py-5 text-right font-display font-bold text-zinc-500">
                    {task.due_date ? format(new Date(task.due_date), 'MMM d, yyyy') : 'NO DATE'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {tasks?.length === 0 && (
        <div className="premium-card p-20 text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-zinc-800 mx-auto" />
          <p className="text-zinc-500 font-medium italic text-lg">No records found in the current audit stream.</p>
        </div>
      )}
    </div>
  );
}
