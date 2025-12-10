import { Link } from "react-router-dom";
const Dashboard = () => {
  return (
    <div>
      <h2>Dashboard</h2>
      <p>Quick Links</p>
      <div className='d-flex gap-2'>
        <Link className='btn btn-primary' to='/leads'>
          View Leads
        </Link>
        <Link className='btn btn-secondary' to='/add-lead'>
          Add Lead
        </Link>
      </div>
    </div>
  );
};
export default Dashboard;
