import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className='bg-info vh-100 p-3' style={{ width: 290 }}>
      <h4>Anvaya</h4>
      <ul className='nav flex-column'>
        <li className='nav-item'>
          <NavLink className='nav-link text-white fw-bold' to='/'>
            Dashboard
          </NavLink>
        </li>
        <li className='nav-item'>
          <NavLink className='nav-link' to='/leads'>
            Leads
          </NavLink>
        </li>
        <li className='nav-item'>
          <NavLink className='nav-link' to='/add-lead'>
            Add Lead
          </NavLink>
        </li>
        <li className='nav-item'>
          <NavLink className='nav-link' to='/agents'>
            Agents
          </NavLink>
        </li>
        <li className='nav-item'>
          <NavLink className='nav-link' to='/reports'>
            Reports
          </NavLink>
        </li>
      </ul>
    </div>
  );
};
export default Sidebar;
