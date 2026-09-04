interface User {
  name: string;
}

const Header = ({ user, onLogout }: { user: User | null; onLogout: () => void }) => {
  return (
    <header className="bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-blue-600">TaskFlow</h1>
        <div className="flex items-center gap-4">
          <span className="text-slate-700">Welcome, {user?.name}</span>
          <button onClick={onLogout} className="btn-secondary">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;