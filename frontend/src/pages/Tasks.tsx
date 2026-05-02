import { useState } from 'react';
import { useTasks, useUpdateTaskStatus } from '../hooks/useTasks';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus, Filter, Search } from 'lucide-react';
import { Button } from '../components/ui/Button';
import TaskCard from '../components/tasks/TaskCard';
import TaskSlideOver from '../components/tasks/TaskSlideOver';
import CreateTaskModal from '../components/tasks/CreateTaskModal';
import { useAuth } from '../hooks/useAuth';
import { cn } from '../lib/utils';

const COLUMNS = ['Todo', 'In Progress', 'Review', 'Done'];

export default function Tasks() {
  const { user } = useAuth();
  const { data: tasks, isLoading } = useTasks({});
  const updateTaskStatus = useUpdateTaskStatus();
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const isAdmin = user?.email === 'admin@team.com';
  
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over) return;
    
    const taskId = active.id;
    const overId = over.id;
    
    let column = COLUMNS.includes(overId as string) ? overId : tasks.find((t: any) => t.id === overId)?.status;
    
    const task = tasks.find((t: any) => t.id === taskId);
    if (task && column && task.status !== column) {
      updateTaskStatus.mutate({ id: taskId, status: column });
    }
  };

  const openTaskDetails = (task: any) => {
    setSelectedTask(task);
    setIsSlideOverOpen(true);
  };

  if (isLoading) return (
    <div className="flex justify-center items-center h-[60vh]">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
    </div>
  );

  return (
    <div className="h-full flex flex-col space-y-12 pb-10">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.3em] text-[10px]">
            <span className="h-px w-8 bg-primary" />
            Project Board
          </div>
          <h1 className="editorial-header">Task Flow.</h1>
          <p className="text-muted-foreground text-lg font-medium">
            Manage your team's momentum across all active streams.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden lg:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input 
              type="text" 
              placeholder="Search tasks..." 
              className="bg-zinc-950 border border-white/5 rounded-2xl pl-12 pr-6 py-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-all w-64"
            />
          </div>
          <Button variant="secondary" size="icon">
            <Filter size={20} />
          </Button>
          {isAdmin && (
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus size={20} className="mr-2" />
              Add Task
            </Button>
          )}
        </div>
      </header>

      {/* Kanban Board */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="flex gap-8 overflow-x-auto pb-10 -mx-8 px-8 scrollbar-hide">
          {COLUMNS.map(column => (
            <div key={column} className="flex-shrink-0 w-[22rem] flex flex-col gap-6" id={column}>
              {/* Column Header */}
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                   <h3 className="font-display font-black text-xl tracking-tight">{column}</h3>
                   <span className="text-[10px] font-black bg-zinc-900 border border-white/5 px-2 py-0.5 rounded text-muted-foreground">
                    {tasks?.filter((t: any) => t.status === column).length || 0}
                  </span>
                </div>
                <div className="h-1.5 w-1.5 rounded-full bg-zinc-800" />
              </div>
              
              {/* Column Content */}
              <div className={cn(
                "flex-1 flex flex-col gap-4 min-h-[600px] p-4 rounded-[2.5rem] bg-zinc-950/20 border border-white/[0.02] transition-colors duration-500",
                "hover:bg-zinc-950/40 hover:border-white/[0.05]"
              )}>
                <SortableContext items={tasks?.filter((t: any) => t.status === column).map((t: any) => t.id) || []} strategy={verticalListSortingStrategy}>
                  {tasks?.filter((t: any) => t.status === column).map((task: any) => (
                    <TaskCard 
                      key={task.id} 
                      task={task} 
                      onClick={() => openTaskDetails(task)}
                    />
                  ))}
                </SortableContext>
                
                {tasks?.filter((t: any) => t.status === column).length === 0 && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
                    <div className="h-12 w-12 rounded-full border border-dashed border-white/10 flex items-center justify-center text-zinc-700">
                      <Plus size={20} />
                    </div>
                    <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest">
                      No tasks in {column}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </DndContext>

      {/* Slide Over Details */}
      <TaskSlideOver 
        task={selectedTask}
        isOpen={isSlideOverOpen}
        onClose={() => setIsSlideOverOpen(false)}
        onStatusChange={(id, status) => {
          updateTaskStatus.mutate({ id, status });
          setIsSlideOverOpen(false);
        }}
      />

      {/* Creation Modal */}
      <CreateTaskModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}

