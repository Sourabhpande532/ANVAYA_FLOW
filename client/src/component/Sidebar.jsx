import { NavLink } from "react-router-dom";
import { useState } from "react";
import "../component/style.css";

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* MOBILE TOGGLE BUTTON */}
      <button
        className='btn btn-outline-secondary d-md-none sidebar-toggle'
        onClick={() => setOpen(true)}>
        ☰
      </button>

      {/* OVERLAY (mobile only) */}
      {open && (
        <div className='sidebar-overlay' onClick={() => setOpen(false)} />
      )}

      {/* SIDEBAR */}
      <div className={`sidebar bg-light border-end ${open ? "open" : ""}`}>
        <div className='d-flex justify-content-between align-items-center mb-3'>
          <h5 className='fw-bold mb-0'></h5>
          {/* CLOSE BUTTON (mobile only) */}
          <button
            className='btn-close d-md-none'
            onClick={() => setOpen(false)}
          />
        </div>

        <nav className='nav flex-column gap-1'>
          <NavLink className='nav-link' to='/' onClick={() => setOpen(false)}>
            Dashboard
          </NavLink>
          <NavLink
            className='nav-link'
            to='/leads'
            onClick={() => setOpen(false)}>
            Leads
          </NavLink>
          <NavLink
            className='nav-link'
            to='/add-lead'
            onClick={() => setOpen(false)}>
            Add Lead
          </NavLink>
          <NavLink
            className='nav-link'
            to='/agents'
            onClick={() => setOpen(false)}>
            Agents
          </NavLink>
          <NavLink
            className='nav-link'
            to='/reports'
            onClick={() => setOpen(false)}>
            Reports
          </NavLink>
          <NavLink
            className='nav-link'
            to='/settings'
            onClick={() => setOpen(false)}>
            Settings
          </NavLink>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
