import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Left logo */}
        <div className="flex items-center gap-2">
          {/* <img src="/logo.svg" alt="Spectra" className="h-7 w-auto" /> */}
          <span className="text-lg font-semibold text-purple-600">Spectra</span>
        </div>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-8">
          {["Product", "Resources", "Pricing"].map((item) => (
            <button
              key={item}
              className="text-sm text-gray-600 hover:text-black transition-colors"
            >
              {item}
            </button>
          ))}
        </nav>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/sign-in")}
            className="px-4 py-2 text-sm font-medium text-gray-800 border border-gray-300 rounded-md hover:bg-gray-100 transition"
          >
            Sign In
          </button>
          <button className="px-4 py-2 text-sm font-semibold text-white bg-black rounded-md hover:bg-gray-900 transition">
            Start Free Trial
          </button>
        </div>
      </div>
    </header>
  );
}
