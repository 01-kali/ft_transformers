import {useState} from "react";
import { X, Bold, Italic } from "lucide-react";

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, desc: string, status: string, priority: string) => void;
  defaultStatus: string;
}

export default function NewTaskModal({isOpen, onClose, onSave, defaultStatus}: NewTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');

  if(!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(title, description, defaultStatus, priority);
    onClose();
  }
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="w-[650px] max-h-[90vh] bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-5 border-b">
          <h2>Task Detail</h2>
          <button onClick={onClose} type="button">
            <X />
          </button>
        </div>
        
        <form className="p-6 flex-1 overflow-y-auto" onSubmit={handleSubmit}>
          <div className="mb-6">
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full text-lg font-semibold border" autoFocus/>
          </div>
        
          <div className="mb-6">
            <label>
              {['Low', 'Medium', 'High'].map((p) => ( 
                <button
                  key={p} onClick={() => setPriority(p)} type="button" className={priority === p ? 'bg-blue' : 'bg-white'"}>
                  {p}
                </button>
              }))
            </label>
          </div>

          <div className="mb-6">
            <textarea rows={6} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-4 border rounded-lg resize-none"/>
          </div>
          
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit">Save</button>
          </div>
        </form>

      </div>
    </div>
  )
}
