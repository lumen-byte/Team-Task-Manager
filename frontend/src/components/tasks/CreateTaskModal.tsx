import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X } from 'lucide-react';
import { Button } from '../ui/Button';
import { useCreateTask } from '../../hooks/useTasks';
import { useProjects } from '../../hooks/useProjects';

const taskSchema = z.object({
  title: z.string().min(3, 'Title is too short'),
  description: z.string().optional(),
  project_id: z.string().min(1, 'Please select a project'),
  priority: z.enum(['Low', 'Medium', 'High']),
  due_date: z.string().optional(),
});

type TaskForm = z.infer<typeof taskSchema>;

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateTaskModal({ isOpen, onClose }: CreateTaskModalProps) {
  const createTask = useCreateTask();
  const { data: projects } = useProjects();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<TaskForm>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      priority: 'Medium'
    }
  });

  const onSubmit = async (data: TaskForm) => {
    await createTask.mutateAsync({
      ...data,
      due_date: data.due_date ? new Date(data.due_date).toISOString() : null
    });
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-xl bg-zinc-950 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden animate-fade-in">
        <div className="p-8 space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-display font-extrabold tracking-tight">New Task.</h2>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-zinc-500">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 pl-1">Task Title</label>
              <input 
                {...register('title')}
                className="w-full bg-zinc-900 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold focus:border-primary focus:ring-0 outline-none transition-all"
                placeholder="e.g. Design System Audit"
              />
              {errors.title && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest pl-1">{errors.title.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 pl-1">Project</label>
                <select 
                  {...register('project_id')}
                  className="w-full bg-zinc-900 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold focus:border-primary focus:ring-0 outline-none transition-all appearance-none"
                >
                  <option value="">Select Project</option>
                  {projects?.map((p: any) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                {errors.project_id && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest pl-1">{errors.project_id.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 pl-1">Priority</label>
                <select 
                  {...register('priority')}
                  className="w-full bg-zinc-900 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold focus:border-primary focus:ring-0 outline-none transition-all appearance-none"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 pl-1">Due Date</label>
              <input 
                {...register('due_date')}
                type="date"
                className="w-full bg-zinc-900 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold focus:border-primary focus:ring-0 outline-none transition-all"
              />
            </div>

            <Button type="submit" className="w-full h-16 mt-4" isLoading={createTask.isPending}>
              Create Task
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
