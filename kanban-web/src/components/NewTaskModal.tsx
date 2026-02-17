import { useState , useEffect, useRef} from "react";
import {
  X,
  Paperclip,
  Bold,
  Italic,
  List,
  AlignLeft,
  Link,
  ChevronDown,
  Calendar as CalendarIcon,
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
  startDate?: string;
  dueDate?: string;
  start_date?: string;
  due_date?: string;
  attachment_url?: string;
  attachmentUrl?: string;
}

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: any, file?: File) => void;
  taskToEdit?: Task | null;
  defaultStatus: string;
  isReadOnly?: boolean;
}

export default function NewTaskModal({
  isOpen,
  onClose,
  onSave,
  taskToEdit,
  defaultStatus,
  isReadOnly = false
}: NewTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [assignedTo, setAssignedTo] = useState<number | undefined>(undefined);
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [existingFile, setExistingFile] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSelectedFile(null);
      if (taskToEdit) {
        setTitle(taskToEdit.title);
        setDescription(taskToEdit.description || '');
        setPriority(taskToEdit.priority || 'Medium');
        setAssignedTo(taskToEdit.assignedTo || taskToEdit.assigned_to);
        const rawStart = taskToEdit.startDate || taskToEdit.start_date;
        const rawDue = taskToEdit.dueDate || taskToEdit.due_date;
        setStartDate(rawStart ? String(rawStart).substring(0, 10) : "");
        setDueDate(rawDue ? String(rawDue).substring(0, 10) : "");
        setExistingFile(taskToEdit.attachment_url || taskToEdit.attachmentUrl || null);
      } else {
        setTitle('');
        setDescription('');
        setPriority('Medium');
        setAssignedTo(undefined);
        setStartDate('');
        setDueDate('');
        setExistingFile(null);
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
      startDate,
      dueDate,
    }, selectedFile || undefined);
    
    onClose();
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
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
              disabled={!isReadOnly}
              autoFocus={isReadOnly}
              readOnly={!isReadOnly}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task Title"
              className="w-full p-3 text-lg font-semibold text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Start Date</label>
              <div className="relative">
                <input
                  autoFocus={isReadOnly}
                  readOnly={!isReadOnly}
                  type="date"
                  value={startDate || ""}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-2 pl-10 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <CalendarIcon size={16} className="absolute left-3 top-2.5 text-gray-400" />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Due Date</label>
              <div className="relative">
                <input
                  autoFocus={isReadOnly}
                  readOnly={!isReadOnly}
                  type="date"
                  value={dueDate || ""}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full p-2 pl-10 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <CalendarIcon size={16} className="absolute left-3 top-2.5 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Priority
            </label>
            <div className="flex gap-2">
              {["Low", "Medium", "High"].map((p) => (
                <button
                  disabled={!isReadOnly}
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`px-3 py-1.5 rounded text-sm font-medium border transition-all 
                    ${priority === p
                      ? "bg-blue-50 border-blue-500 text-blue-700"
                      : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                    }
                    ${isReadOnly
                    ? "hover:bg-gray-50 cursor-pointer"
                    : "cursor-default opacity-80"
                    }`
                  }
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
                disabled={!isReadOnly}
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
              {isReadOnly && (
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                <ChevronDown size={16} />
              </div>
              )}
            </div>
          </div>

          <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 transition-all">
            <textarea
              disabled={!isReadOnly}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details to this task..."
              rows={6}
              className="w-full p-4 resize-none focus:outline-none text-gray-700 text-sm leading-relaxed"
            />
          </div>
          
          <div className="mb-6">
            <label 
            className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Attachments
            </label>
            
            {isReadOnly && (
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden" 
              />
            )}

            <div 

              onClick={isReadOnly ? handleFileClick : undefined} 
              
              className={`border border-dashed rounded-lg p-4 flex items-center justify-center gap-2 transition-colors 
                ${selectedFile || existingFile 
                  ? 'bg-blue-50 border-blue-300 text-blue-600'
                  : 'border-gray-300 text-gray-500'
                }
                ${isReadOnly 
                  ? 'hover:bg-gray-50 cursor-pointer'
                  : 'cursor-default opacity-80'
                }
              `}
            >
              <Paperclip size={16} />
              <span className="text-sm font-medium">
                {selectedFile 
                  ? selectedFile.name 
                  : existingFile
                  ? existingFile
                  : isReadOnly 
                    ? "No attachments"
                    : "Add File"
                }
              </span>
            </div>

            {!selectedFile && existingFile && (
               <div className="mt-2 text-xs text-right text-blue-500 hover:underline">
                 <a href={`http://localhost:3003/uploads/${existingFile}`} target="_blank" rel="noreferrer">
                   View / Download
                 </a>
               </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            {isReadOnly && (
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
            )}
            {isReadOnly && (
            <button
              type="submit"
              className="px-6 py-2 bg-[#5B5CFF] text-white rounded-lg font-bold hover:bg-[#4d4eed] shadow-md transition-all"
            >
              {taskToEdit ? 'Save Changes' : 'Create Task'}
            </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
