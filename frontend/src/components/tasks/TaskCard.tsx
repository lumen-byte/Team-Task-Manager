import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { format } from 'date-fns';
import { GripVertical, Calendar, User } from 'lucide-react';
import { cn } from '../../lib/utils';

interface TaskCardProps {
  task: any;
  onClick?: () => void;
}

export default function TaskCard({ task, onClick }: TaskCardProps) {
  const { 
    attributes, 
    listeners, 
    setNodeRef, 
    transform, 
    transition, 
    isDragging 
  } = useSortable({ id: task.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    zIndex: isDragging ? 50 : 1,
  };

  const priorityColors: Record<string, string> = {
    High: 'bg-red-500',
    Medium: 'bg-amber-500',
    Low: 'bg-blue-500',
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="group cursor-default outline-none"
      onClick={onClick}
    >
      <div className={cn(
        "premium-card p-6 flex flex-col gap-4 relative overflow-hidden active:scale-[0.98]",
        isDragging && "ring-2 ring-primary"
      )}>
        {/* Project Accent Bar */}
        <div 
          className="absolute left-0 top-0 w-1.5 h-full opacity-20 group-hover:opacity-100 transition-opacity" 
          style={{ backgroundColor: task.project.color || '#bef264' }} 
        />

        {/* Card Header */}
        <div className="flex justify-between items-start gap-4">
          <div className="flex items-center gap-2">
            <span className={cn("h-2 w-2 rounded-full", priorityColors[task.priority])} />
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              {task.priority}
            </span>
          </div>
          
          <div 
            {...attributes} 
            {...listeners} 
            className="cursor-grab p-1 -mr-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <GripVertical size={14} />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-1">
          <h4 className="font-display font-bold text-lg leading-tight group-hover:text-primary transition-colors">
            {task.title}
          </h4>
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
            {task.project.name}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 mt-2 border-t border-white/5">
          <div className="flex items-center gap-3">
            {task.due_date && (
              <div className={cn(
                "flex items-center gap-1.5 text-[10px] font-bold",
                new Date(task.due_date) < new Date() && task.status !== 'Done' ? 'text-red-400' : 'text-muted-foreground'
              )}>
                <Calendar size={12} />
                <span>{format(new Date(task.due_date), 'MMM d')}</span>
              </div>
            )}
          </div>

          <div className="flex -space-x-2">
            {task.assignee ? (
              <div 
                className="h-8 w-8 rounded-full bg-zinc-800 border-2 border-zinc-950 flex items-center justify-center text-[10px] font-bold overflow-hidden" 
                title={task.assignee.name}
              >
                {task.assignee.avatar_url ? (
                  <img src={task.assignee.avatar_url} alt={task.assignee.name} className="h-full w-full object-cover" />
                ) : (
                  <span>{task.assignee.name[0].toUpperCase()}</span>
                )}
              </div>
            ) : (
              <div className="h-8 w-8 rounded-full bg-zinc-900 border-2 border-zinc-950 flex items-center justify-center text-muted-foreground">
                <User size={12} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
