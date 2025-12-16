import { Link } from "react-router-dom";
import { StatusAnalysis } from "../component/ByStatus";

const Dashboard = () => {
  return (
    <div className='container-fluid'>
      <div className='row g-3'>
        {/* Header */}
        <div className='col-12'>
          <div className='d-flex justify-content-between align-items-center'>
            <h4 className='fw-bold mb-0'>Dashboard</h4>
            <Link to='/add-lead' className='btn btn-primary btn-sm'>
              + Add New Lead
            </Link>
          </div>
        </div>

        {/* Lead cards */}
        <div className='col-12'>
          <div className='row g-3'>
            {["Lead 1", "Lead 2", "Lead 3"].map((l) => (
              <div className='col-sm-6 col-lg-4' key={l}>
                <div className='card shadow-sm h-100'>
                  <div className='card-body'>
                    <h6 className='fw-semibold'>{l}</h6>
                    <p className='text-muted small mb-0'>Assigned Agent</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status + Filters */}
        <div className='col-lg-8'>
          <div className='card shadow-sm'>
            <div className='card-body'>
              <h6 className='fw-semibold mb-3'>Lead Status</h6>
              <StatusAnalysis />

              <hr />

              <h6 className='fw-semibold mb-2'>Quick Filters</h6>
              <div className='d-flex gap-2 flex-wrap'>
                <Link
                  to='/leads?status=New'
                  className='btn btn-outline-primary btn-sm'>
                  New
                </Link>
                <Link
                  to='/leads?status=Contacted'
                  className='btn btn-outline-secondary btn-sm'>
                  Contacted
                </Link>
                <Link
                  to='/leads?status=Closed'
                  className='btn btn-outline-secondary btn-sm'>
                  Closed
                </Link>
                <Link
                  to='/leads?status=Qualified'
                  className='btn btn-outline-secondary btn-sm'>
                  Qualified
                </Link>
                <Link
                  to='/leads?status=Proposal Sent'
                  className='btn btn-outline-secondary btn-sm'>
                  Proposal Sent
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className='col-lg-4'>
          <div className='card shadow-sm'>
            <div className='card-body'>
              <h6 className='fw-semibold mb-3'>Quick Actions</h6>
              <div className='d-grid gap-2'>
                <Link to='/leads' className='btn btn-outline-dark btn-sm'>
                  View All Leads
                </Link>
                <Link to='/agents' className='btn btn-outline-dark btn-sm'>
                  Manage Agents
                </Link>
                <Link to='/reports' className='btn btn-outline-dark btn-sm'>
                  View Reports
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Dashboard };
