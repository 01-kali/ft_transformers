import { LayoutDashboard, Settings, Calendar, MessageSquare, ListTodo, ChevronDown } from 'lucide-react';

interface SidebarProps {
  currentView: 'board' | 'calendar';
  onViewChange: (view: 'board' | 'calendar') => void;
}

const Sidebar = ({currentView, onViewChange}: SidebarProps) => {
  return (
    <div className="w-72 h-screen bg-[#12131a] text-slate-400 flex flex-col border-r border-gray-900/50">
      <div className="p-6">
        <div className="h-8 w-32 bg-gray-800/50 rounded mb-6 opacity-50"></div>
        <div className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">Workspace Switcher</div>
        <button className="flex items-center justify-between w-full bg-[#1f212d] text-white p-3 rounded-xl hover:bg-[#2a2d3d] transition-colors border border-gray-800/50">
          <span className="font-medium text-sm">Product Launch</span>
          <ChevronDown size={18} className="text-slate-400" />
        </button>
      </div>
      <nav className="flex-1 px-4 space-y-1">
        <button
          onClick={() => onViewChange('board')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
            currentView === 'board' 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
              : 'text-gray-400 hover:bg-gray-800 hover:text-white'
          }`}
        >
          <LayoutDashboard size={20} />
          <span className="font-medium">Board</span>
        </button>
        <SidebarItem icon={<MessageSquare size={20} />} label="Chat" />
        <SidebarItem icon={<ListTodo size={20} />} label="My Tasks" />
        <button
          onClick={() => onViewChange('calendar')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
            currentView === 'calendar' 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
              : 'text-gray-400 hover:bg-gray-800 hover:text-white'
          }`}
        >
          <Calendar size={20} />
          <span className="font-medium">Calendar</span>
        </button>
          <SidebarItem icon={<Settings size={20} />} label="Settings" />
      </nav>
    </div>
  );
}

function SidebarItem({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
  return (
    <div className={`flex items-center gap-4 px-4 py-3 rounded-lg cursor-pointer transition-colors font-medium text-sm ${active ? 'bg-[#1f212d] text-white' : 'hover:bg-[#1f212d]/50 hover:text-white'}`}>
      {icon}
      <span>{label}</span>
    </div>
  );
}

export default Sidebar;
