function ServerRow({ name, isOnline }: { name: string, isOnline: boolean }) {
  return (
    <div className={`p-4 border border-gray-700 rounded mb-2 font-bold ${isOnline ? 'text-green-500' : 'text-red-500'}`}>
      Name is {name}
    </div>
  );
}

function ServerList() {
  return (
    <div className="bg-black text-white h-screen p-10">
      <h1 className="text-2xl mb-5">Server Status</h1>
      
      <ServerRow name="Database-01" isOnline />
      
      <ServerRow name="Cache-Cluster" isOnline={true} />
      
      <ServerRow name="Auth-Service" isOnline={false} />
    </div>
  );
}

export default ServerList;
