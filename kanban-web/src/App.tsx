import { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import Sidebar from './components/Sidebar';
import KanbanColumn from './components/KanbanColumn';
import NewTaskModal from './components/NewTaskModal';
import { Search, Bell, Filter, Home, User, X } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { DragDropContext, type DropResult } from '@hello-pangea/dnd';

interface Task {
  id: number;
  title: string;
  description?: string;
  status: string;
  priority?: string;
  assignedTo: number;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeStatus, setActiveStatus] = useState('TODO');
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [searchQuery, setSearchQuery] = useState('');

  const [filterPriority, setFilterPriority] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    fetchTasks();

    const socket = io('http://localhost:3003');

      socket.on('task:created', (newTask: Task) => {
      setTasks((prevTasks) => {
        if (prevTasks.some(t => t.id === newTask.id)) return prevTasks;
        return [...prevTasks, newTask];
      }); 
    });

    socket.on('task:updated', (updatedTask: Task) => {
      setTasks((prevTasks) => 
               prevTasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
    });

    socket.on('task:deleted', ({ id }: { id: number }) => {
      setTasks((prevTasks) => prevTasks.filter((t) => t.id !== id));
    });

    socket.on('board:updated', () => {
      fetchTasks();
    });

    socket.on('notification', (data: { message: string }) => {
      toast(data.message, {
        icon: '🔔',
        position: 'top-left',
        style: {
          border: '1px solid #3b82f6',
          padding: '16px',
          color: '#3b82f6',
        },
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchTasks = () => {
    axios.get(`http://localhost:3003/tasks?timestamp=${Date.now()}`)
      .then(res => {
        setTasks(res.data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  };

  const openNewTaskModal = (status: string) => {
    setActiveStatus(status);
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const openEditTaskModal = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true)
  }

  const handleSaveTask = async (taskData: Partial<Task>) => {
    try {
      if (taskData.id) {
        await axios.patch(`http://localhost:3003/tasks/${taskData.id}`, {
          title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        assignedTo: taskData.assignedTo
        });
        toast.success("Task updated successfully!");
      } else {
        await axios.post('http://localhost:3003/tasks', {
          title: taskData.title,
        description: taskData.description,
        status: taskData.status,
        priority: taskData.priority,
        assignedTo: taskData.assignedTo
        });
        toast.success("New task created!");
      }
      setIsModalOpen(false);
      setEditingTask(null);
    } catch (error) {
      console.error("Error saving task:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
  
    try {
      await axios.delete(`http://localhost:3003/tasks/${id}`);
      toast.success("Task deleted successfully");
    } catch (error) {
        console.error("Failed to delete task:", error);
        toast.error("Could not delete task. Please try again.");
      }
  };

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const movedTaskId = parseInt(draggableId);

    if (source.droppableId === destination.droppableId){
      const columnId = source.droppableId;
      const columnTasks = getTasksByStatus(columnId);
      const newColumnTasks = Array.from(columnTasks);
      const [movedTask] = newColumnTasks.splice(source.index, 1);

      newColumnTasks.splice(destination.index, 0, movedTask);
      const otherTasks = tasks.filter(t => t.status !== columnId);
      setTasks([...otherTasks, ...newColumnTasks]);
      try {
        const taskIds = newColumnTasks.map(t => t.id);
        await axios.patch('http://localhost:3003/tasks/reorder', { taskIds });
      } catch (error) {
          console.error("Failed to reorder:", error);
          toast.error("Failed to save new order. Please try again.");
          fetchTasks();
        }
        return;
    }

    const newStatus = destination.droppableId;
    const taskToMove = tasks.find(t => t.id === movedTaskId);
    if(!taskToMove) return ;
    const updatedTask = {...taskToMove, status: newStatus};
    const destColumnTasks = tasks.filter(t => t.status === newStatus && t.id !== movedTaskId);

    destColumnTasks.splice(destination.index, 0, updatedTask);
    const otherTasks = tasks.filter(t => t.status !== newStatus && t.id !== movedTaskId);
    setTasks([...otherTasks, ...destColumnTasks]);

    try {
      await axios.patch(`http://localhost:3003/tasks/${movedTaskId}`, { status: newStatus });
        const taskIds = destColumnTasks.map(t => t.id);
      await axios.patch(`http://localhost:3003/tasks/reorder`, {taskIds: taskIds});
    } catch (error) {
        console.error("Failed to move task:", error);
        fetchTasks();
      }
  };

  const getTasksByStatus = (status: string) => {
    return tasks
    .filter(task => task.status === status)
    .sort((a, b) => a.position - b.position)
    .filter(task => {
      if (!searchQuery) return true;
      const searchLower = searchQuery.toLowerCase();
      return (
        task.title.toLowerCase().includes(searchLower) || 
          (task.description && task.description.toLowerCase().includes(searchLower))
      );
    })
    .filter(task => {
      if (!filterPriority) return true;
        return task.priority === filterPriority;
    });
  };
  return (
    <div className="flex h-screen bg-white font-sans text-gray-900">
    <Toaster position="bottom-right" />
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden bg-white">
        <header className="h-16 flex items-center justify-between px-8 bg-white border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3 text-sm text-gray-400">
             <Home size={16} className="cursor-pointer hover:text-gray-800 transition-colors" />
             <span>/</span>
             <span className="text-gray-900 font-medium">Product Launch</span>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search tasks..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-64 transition-all placeholder-gray-400 hover:border-gray-300" 
              />
          </div>
        </header>

        <div className="flex-1 p-8 overflow-hidden flex flex-col">
          <div className="flex justify-between items-end mb-8 shrink-0">
            <h1 className="text-3xl font-bold text-gray-900">Product Launch</h1>
            <div className="flex gap-3">

            <div className="relative">
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                  filterPriority ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Filter size={16} />
                {filterPriority ? `${filterPriority} Priority` : 'Filter'}
                {filterPriority && (
                  <X 
                    size={14} 
                    className="ml-1 hover:text-red-500" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setFilterPriority(null);
                    }}
                  />
                )}
              </button>

              {isFilterOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Filter by Priority
                  </div>
                  {['High', 'Medium', 'Low'].map((p) => (
                    <button
                      key={p}
                      onClick={() => {
                        setFilterPriority(p);
                        setIsFilterOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <span className={`w-2 h-2 rounded-full ${
                        p === 'High' ? 'bg-red-500' : p === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'
                      }`} />
                      {p}
                    </button>
                  ))}
                  
                  {filterPriority && (
                    <button
                      onClick={() => {
                        setFilterPriority(null);
                        setIsFilterOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t border-gray-50 mt-1"
                    >
                      Clear Filter
                    </button>
                  )}
                </div>
              )}
            </div>

            </div>
          </div>

          <DragDropContext onDragEnd={onDragEnd}>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-y-auto pb-2">
                {['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'].map(status => (
                  <KanbanColumn 
                    key={status}
                    id={status}
                    title={status.replace('_', ' ')}
                    count={getTasksByStatus(status).length} 
                    tasks={getTasksByStatus(status)} 
                    onAdd={() => openNewTaskModal(status)}
                    onDelete={handleDeleteTask}
                    onEdit={openEditTaskModal}
                    loading={loading}
                  />
                ))}
              </div>
          </DragDropContext>
        </div>
      </main>

      <NewTaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveTask}
        taskToEdit={editingTask}
        defaultStatus={activeStatus}
      />
    </div>
  );
}

export default App;
