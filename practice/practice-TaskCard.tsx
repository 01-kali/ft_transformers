function DeleteCard(){
  return (
    <div className="w-64 bg-red-100 p-4 rounded-lg flex justify-between group">
    <span className="font-bold text-red-800">Dangerous File</span>
    <button className="opacity-0 group-hover:opacity-100 transition-opacity">🗑️</button>
    </div>
  );
}
