interface emailimport { useState } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';

interface Email {
  id: string;
  subject: string;
  folder: 'inbox' | 'archive';
}

function MailApp() {

  const [emails, setEmails] = useState<Email[]>([
    { id: "1", subject: "Welcome", folder: "inbox" },
    { id: "2", subject: "Invoice", folder: "inbox" },
    { id: "3", subject: "Old News", folder: "archive" }
  ]);

  const getEmailsInFolder = (folderName: string) => {
    return emails.filter(email => email.folder === folderName);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }
    const updatedList = emails.map((email) => {
      if (email.id === result.draggableId) {
        return { ...email, folder: result.destination.droppableId }; 
      } else {
        return email;
      }
    });
    setEmails(updatedList);
    console.log("Sending to server...");
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
    <div className="p-10 bg-gray-50 h-screen">
    <h1 className="text-2xl mb-4">Mail Sorter</h1>
    <div className="grid grid-cols-2 gap-4">
    <div className="bg-blue-100 p-4 rounded min-h-[200px]">
    <h2 className="font-bold">Inbox</h2>
    <p>Count: {getEmailsInFolder('inbox').length}</p>
    </div>
    <div className="bg-yellow-100 p-4 rounded min-h-[200px]">
    <h2 className="font-bold">Archive</h2>
    <p>Count: {getEmailsInFolder('archive').length}</p>
    </div>

    </div>
    </div>
    </DragDropContext>
  );
}

export default MailApp;

//kanbanbord

import {Plus, MoreHorizontal} from 'lucide-react'
import TaskCard from './TaskCard.tsx'
import Droppable from '@hello-pangea/dnd'

interface Task {
  id: number;
  title: string;
  status: string;
}

interface KanbanColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  count: number;
}

export default function KanbanColumn({ id, title, tasks, count}: KanbanColumnProps){
  return(
    <div className="flex-1 min-w-[280px] bg-[#F7F8FA] rounded-xl p-4 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
           <h2 className="font-bold text-gray-700">{title}</h2>
           <span className="text-gray-400">({count})</span>
        </div>
        <MoreHorizontal className="text-gray-400" />
      </div>
      <Droppable droppableId={id}>
        {(provided) => (
          <div 
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex-1 overflow-y-auto min-h-0 space-y-3 pr-1"
            >
            {tasks.map((task, index) => (
              <TaskCard key={task.id} id={task.id} index={index} title={task.title} />
            )}
            {provided.placeholder}
          </div>
        )}
        </Droppable>
    </div>
  );
}
