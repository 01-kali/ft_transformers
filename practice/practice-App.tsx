function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <h1> The count is: {count} </h1>
      <button onClick={() => setCount(count + 1)}>
        Increase
      </button>
    </div>
  );
}

function WelcomeMessage() {
  const [name, setName] = useState("Guest");
  return (
    <div>
      <h1> Hello {name} </h1>
      <button onClick={() => setName("Khalid")}>
        Click to Login
      </button>
    </div>
  );
}

import { useEffect, useState } from 'react';

interface TeamMember {
  id: number;
  name: string;
  role: string;
}

function TeamList() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  useEffect(() => {
    setTimeout(() => {
      setMembers([
        { id: 1, name: "Alice", role: "Dev" },
        { id: 2, name: "Bob", role: "Design" }
      ]);
    }, 2000);
  }, []);
  return (
    <div>
      {members.map((member) => (
        <div key={member.id}>
          Member name is {member.name} and his role is {member.role}
        </div>
      ))}
    </div>
  );
}

export default TeamList;
