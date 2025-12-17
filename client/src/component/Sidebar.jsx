import { NavLink } from "react-router-dom";
import "../component/style.css";
const Sidebar = () => {
  return (
    <div className='sidebar bg-light border-end'>
      <h5 className='fw-bold mb-3'>Anvaya</h5>

      <nav className='nav flex-column gap-1'>
        <NavLink className='nav-link' to='/'>
          Dashboard
        </NavLink>
        <NavLink className='nav-link' to='/leads'>
          Leads
        </NavLink>
        <NavLink className='nav-link' to='/add-lead'>
          Add Lead
        </NavLink>
        <NavLink className='nav-link' to='/agents'>
          Agents
        </NavLink>
        <NavLink className='nav-link' to='/reports'>
          Reports
        </NavLink>
        <NavLink to='/settings' className='nav-link'>
          Settings
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
