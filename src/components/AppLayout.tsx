import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";

export default function AppLayout() {
  return (
    <div className="relative min-h-screen text-[#18201d] transition-colors dark:text-[#edf3f0]">
      {/* Animated gradient mesh background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-emerald-400/10 blur-[120px] animate-float dark:bg-emerald-600/8" />
        <div className="absolute -right-32 top-1/3 h-[450px] w-[450px] rounded-full bg-teal-300/10 blur-[100px] animate-float-slow dark:bg-teal-500/6" />
        <div className="absolute -bottom-32 left-1/4 h-[500px] w-[500px] rounded-full bg-cyan-200/8 blur-[110px] animate-float-slower dark:bg-emerald-700/5" />
      </div>

      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 animate-fade-in">
        <Outlet />
      </main>
    </div>
  );
}