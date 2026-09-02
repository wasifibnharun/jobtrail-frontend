import { LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

import useAuth from "../auth/useAuth";

export default function Navbar() {
  const { username, signOut } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    signOut();
    navigate("/login", { replace: true });
  }

  return (
    <header className="navbar">
      <NavLink className="brand" to="/">
        JobTrail
      </NavLink>

      <nav aria-label="Main navigation">
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/applications">Applications</NavLink>
        <NavLink to="/applications/new">Add application</NavLink>
      </nav>

      <div className="account-actions">
        <span>{username ?? "Account"}</span>
        <button type="button" onClick={handleLogout}>
          <LogOut aria-hidden="true" size={18} />
          Logout
        </button>
      </div>
    </header>
  );
}