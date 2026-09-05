import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-[#f4f6f5] text-[#18201d] transition-colors dark:bg-[#101513] dark:text-[#edf3f0]">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}