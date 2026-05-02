import { X, Calendar, Flag, User, Trash2, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { format } from 'date-fns';
import { cn } from '../../lib/utils';

interface TaskSlideOverProps {
  task: any;
  isOpen: boolean;
  onClose: () => void;
  onDelete?: (id: string) => void;
  onStatusChange?: (id: string, status: string) => void;
}

export default function TaskSlideOver({ task, isOpen, onClose, onDelete, onStatusChange }: TaskSlideOverProps) {
  if (!task) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-500",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Panel */}
      <div 
        className={cn(
          "fixed right-0 top-0 h-full w-full max-w-xl bg-zinc-950 border-l border-white/10 z-50 shadow-2xl transition-transform duration-500 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-full transition-colors text-muted-foreground hover:text-foreground"
              >
                <X size={20} />
              </button>
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Task Details
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-red-400 hover:text-red-500 hover:bg-red-500/10"
                onClick={() => onDelete?.(task.id)}
              >
                <Trash2 size={18} />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8 space-y-12">
            {/* Title & Project */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: task.project.color }} 
                />
                <span className="text-sm font-bold text-muted-foreground">
                  {task.project.name}
                </span>
              </div>
              <h2 className="text-4xl font-display font-extrabold tracking-tight leading-[1.1]">
                {task.title}
              </h2>
            </div>

            {/* Meta Grid */}
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Assignee</p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center font-bold text-sm">
                    {task.assignee?.name?.[0].toUpperCase() || <User size={16} />}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{task.assignee?.name || 'Unassigned'}</p>
                    <p className="text-xs text-muted-foreground">Team Member</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Due Date</p>
                <div className="flex items-center gap-3 text-sm font-bold">
                  <Calendar size={18} className="text-primary" />
                  <span>{task.due_date ? format(new Date(task.due_date), 'MMMM d, yyyy') : 'No due date'}</span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Priority</p>
                <div className="flex items-center gap-3">
                  <Flag size={18} className={cn(
                    task.priority === 'High' ? 'text-red-500' :
                    task.priority === 'Medium' ? 'text-amber-500' : 'text-blue-500'
                  )} />
                  <span className="text-sm font-bold">{task.priority}</span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</p>
                <select 
                  value={task.status}
                  onChange={(e) => onStatusChange?.(task.id, e.target.value)}
                  className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-2 text-sm font-bold w-full focus:ring-2 focus:ring-primary outline-none transition-all"
                >
                  <option value="Todo">Todo</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Review">Review</option>
                  <option value="Done">Done</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Description</p>
              <div className="text-muted-foreground leading-relaxed text-lg">
                {task.description || (
                  <span className="italic text-zinc-600">No description provided. Add one to give this task more context.</span>
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-8 border-t border-white/5 bg-zinc-950/50">
            <Button 
              className="w-full h-14"
              onClick={() => onStatusChange?.(task.id, 'Done')}
              disabled={task.status === 'Done'}
            >
              <CheckCircle size={20} className="mr-2" />
              Mark as Completed
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
