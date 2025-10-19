import { useUser, UserButton } from "@clerk/clerk-react";

export default function Dashboard() {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-slate-900">
      <nav className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-white">Spectra Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-slate-300">Hello, {user?.firstName}</span>
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </nav>
      <div className="p-8">
        <h2 className="text-2xl font-bold text-white">
          Welcome to Spectra! 🚀
        </h2>
        <p className="text-slate-400 mt-2">Your dashboard is ready.</p>
      </div>
    </div>
  );
}
