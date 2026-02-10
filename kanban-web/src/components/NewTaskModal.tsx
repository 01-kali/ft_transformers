import { useState , useEffect} from "react";
import {
  X,
  Paperclip,
  Bold,
  Italic,
  List,
  AlignLeft,
  Link,
  ChevronDown,
} from "lucide-react";
import { USERS } from '../data/users';

interface Task{
  id?: number;
  title: string;
  description: string;
  status:string;
  priority: string;
  assignedTo?: number;
  assigned_to?: number;
}

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  taskToEdit?: Task | null;
  defaultStatus: string;
}

export default function NewTaskModal({
  isOpen,
  onClose,
  onSave,
  taskToEdit,
  defaultStatus,
}: NewTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [assignedTo, setAssignedTo] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (isOpen) {
      if (taskToEdit) {
        setTitle(taskToEdit.title);
        setDescription(taskToEdit.description || '');
        setPriority(taskToEdit.priority || 'Medium');
        setAssignedTo(taskToEdit.assignedTo || taskToEdit.assigned_to);
      } else {
        setTitle('');
        setDescription('');
        setPriority('Medium');
        setAssignedTo(undefined);
      }
    }
  }, [isOpen, taskToEdit]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      id: taskToEdit?.id,
      title,
      description,
      status: taskToEdit ? taskToEdit.status : defaultStatus,
      priority,
      assignedTo,
    });
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white w-[650px] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">{taskToEdit ? 'Edit Task' : 'New Task'}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex-1 overflow-y-auto">

          <div className="mb-6">
            <input
              autoFocus
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task Title"
              className="w-full p-3 text-lg font-semibold text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            />
          </div>

          <div className="mb-6">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Priority
            </label>
            <div className="flex gap-2">
              {["Low", "Medium", "High"].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`px-3 py-1.5 rounded text-sm font-medium border transition-all ${
                    priority === p
                      ? "bg-blue-50 border-blue-500 text-blue-700"
                      : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Assign To</label>
            <div className="relative">
              <select
                value={assignedTo || ""}
                onChange={(e) => setAssignedTo(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full appearance-none bg-white border border-gray-200 text-gray-700 py-2 px-3 pr-8 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-300 cursor-pointer"
              >
                <option value="">Unassigned</option>
                {USERS.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>

          <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 transition-all">
            <div className="bg-white border-b border-gray-200 p-2 flex gap-1 text-gray-500">
              <button type="button" className="p-1.5 hover:bg-gray-100 rounded">
                <Bold size={16} />
              </button>
              <button type="button" className="p-1.5 hover:bg-gray-100 rounded">
                <Italic size={16} />
              </button>
              <button type="button" className="p-1.5 hover:bg-gray-100 rounded">
                <AlignLeft size={16} />
              </button>
              <button type="button" className="p-1.5 hover:bg-gray-100 rounded">
                <List size={16} />
              </button>
              <button type="button" className="p-1.5 hover:bg-gray-100 rounded">
                <Link size={16} />
              </button>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details to this task..."
              rows={6}
              className="w-full p-4 resize-none focus:outline-none text-gray-700 text-sm leading-relaxed"
            />
          </div>

          <div className="mb-6">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Attachments
            </label>
            <div className="border border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center gap-2 text-gray-500 hover:bg-gray-50 cursor-pointer transition-colors">
              <Paperclip size={16} />
              <span className="text-sm">Add File</span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#5B5CFF] text-white rounded-lg font-bold hover:bg-[#4d4eed] shadow-md transition-all"
            >
              {taskToEdit ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
