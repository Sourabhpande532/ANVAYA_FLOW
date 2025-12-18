import "./App.css";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./component/Sidebar";
import {
  Dashboard,
  LeadDetails,
  LeadList,
  AddLeads,
  Agents,
  Reports,
  Settings,
} from "./pages/index";
function App() {
  return (
    <div className='d-flex'>
      <Sidebar />
      <div className='flex-grow-1 p-3 py-4 ms-md-4'>
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/leads' element={<LeadList />} />
          <Route path='/leads/:id' element={<LeadDetails />} />
          <Route path='/add-lead' element={<AddLeads />} />
          <Route path='/agents' element={<Agents />} />
          <Route path='/reports' element={<Reports />} />
          <Route path='/settings' element={<Settings />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
