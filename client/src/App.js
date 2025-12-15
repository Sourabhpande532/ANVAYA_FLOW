import "./App.css";
import { Routes, Route, Link } from "react-router-dom";
import Sidebar from "./component/Sidebar";
import {
  Dashboard,
  LeadDetails,
  LeadList,
  AddLeads,
  Agents,
  Reports,
} from "./pages/index";
function App() {
  return (
    <div className='d-flex'>
      <Sidebar />
      <div className='container-fluid p-4 flex-grow-1 p-3'>
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/leads' element={<LeadList />} />
          <Route path='/leads/:id' element={<LeadDetails />} />
          <Route path='/add-lead' element={<AddLeads />} />
          <Route path='/agents' element={<Agents />} />
          <Route path='/reports' element={<Reports />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
