import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchJSON } from "../api";
import { StatusAnalysis } from "../component/ByStatus";
const Dashboard = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchJSON("/leads");
        setLeads(res.data.leads || []);
      } catch (e) {
        console.error("Failed to load leads", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className='container-fluid'>
      <div className='row g-3'>
        {/* HEADER */}
        <div className='col-12'>
          <div className='d-flex justify-content-between align-items-center'>
            <h4 className='fw-bold mb-0 d-none d-md-block'>Dashboard</h4>
            <Link to='/add-lead' className='btn btn-primary btn-sm'>
              + Add New Lead
            </Link>
          </div>
        </div>

        {/* LEADS (DYNAMIC) */}
        <div className='col-12'>
          <div className='row g-3'>
            {loading ? (
              <p className='text-muted small'>Loading leads...</p>
            ) : leads.length === 0 ? (
              <p className='text-muted small'>No leads found.</p>
            ) : (
              leads.slice(0, 6).map((lead) => (
                <div className='col-sm-6 col-lg-4' key={lead._id}>
                  <Link
                    to={`/leads/${lead._id}`}
                    className='text-decoration-none'>
                    <div className='card shadow-sm h-100 dashboard-card'>
                      <div className='card-body'>
                        <h6 className='fw-semibold text-white'>
                          {lead.name}
                        </h6>
                        <p className='text-muted small mb-0'>
                          Status: {lead.status}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* STATUS + FILTERS */}
        <div className='col-lg-8'>
          <div className='card shadow-sm p-4'>
            <h6 className='fw-semibold mb-3'>Lead Status</h6>
            <StatusAnalysis />
            <hr />

            <h6 className='fw-semibold mb-2'>Quick Filters</h6>
            <div className='d-flex gap-2 flex-wrap'>
              {[
                "New",
                "Contacted",
                "Qualified",
                "Proposal Sent",
                "Closed",
              ].map((status) => (
                <Link
                  key={status}
                  to={`/leads?status=${status}`}
                  className='btn btn-outline-secondary btn-sm'>
                  {status}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className='col-lg-4'>
          <div className='card shadow-sm'>
            <div className='card-body'>
              <h6 className='fw-semibold mb-3'>Quick Actions</h6>
              <div className='d-grid gap-2'>
                <Link to='/leads' className='btn btn-outline-primary btn-sm'>
                  View All Leads
                </Link>
                <Link to='/agents' className='btn btn-outline-secondary btn-sm'>
                  Manage Agents
                </Link>
                <Link to='/reports' className='btn btn-outline-info btn-sm'>
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
