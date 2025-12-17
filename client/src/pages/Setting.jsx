import { useContext, useEffect, useState } from "react";
import { fetchJSON } from "../api";
import { LeadContext } from "../context/LeadContext";

const Settings = () => {
  const [leads, setLeads] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast, showToast, setToast } = useContext(LeadContext);
  const [confirmAction, setConfirmAction] = useState(null);

  const loadData = async () => {
    try {
      const leadsRes = await fetchJSON("/leads");
      const agentsRes = await fetchJSON("/agents");

      setLeads(leadsRes.data.leads || []);
      setAgents(agentsRes.data.agents || []);
    } catch (e) {
      console.error("Failed to load settings data", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const deleteLead = async (id) => {
    setConfirmAction({
      type: "lead",
      id,
      message: "Are you sure you want to delete this lead",
    });
    showToast("Are you sure you want to delete this lead?", "warning");
  };

  const deleteAgent = async (id) => {
    setConfirmAction({
      type: "agent",
      id,
      message: "Are you sure you want to delete this sales agent?",
    });
    showToast("Are you sure you want to delete this sales agent?", "warning");
  };

  const handleConfirmDelete = async () => {
    if (!confirmAction) return;

    try {
      if (confirmAction.type === "lead") {
        await fetchJSON(`/leads/${confirmAction.id}`, { method: "DELETE" });
        setLeads((prev) => prev.filter((l) => l._id !== confirmAction.id));
        showToast("Lead deleted successfully", "success");
      }

      if (confirmAction.type === "agent") {
        await fetchJSON(`/agents/${confirmAction.id}`, { method: "DELETE" });
        setAgents((prev) => prev.filter((a) => a._id !== confirmAction.id));
        showToast("Sales agent deleted successfully", "success");
      }
    } catch (e) {
      showToast("Delete failed ❌", "danger");
    } finally {
      setConfirmAction(null);
    }
  };

  if (loading) {
    return <p className='text-muted p-4'>Loading settings...</p>;
  }

  return (
    <div className='container-fluid'>
      <h4 className='fw-bold mb-4 text-center text-md-start'>Settings</h4>

      {/* TOAST */}
      {toast.show && (
        <div
          className='toast show position-fixed top-0 end-0 m-3'
          style={{ zIndex: 9999 }}>
          <div className={`toast-header bg-${toast.type} text-white`}>
            <strong className='me-auto'>
              {toast.type === "success"
                ? "Success"
                : toast.type === "warning"
                ? "Confirm"
                : "Error"}
            </strong>

            <button
              className='btn-close btn-close-white'
              onClick={() => setToast({ ...toast, show: false })}
            />
          </div>

          <div className='toast-body'>
            <p className='mb-2'>{toast.message}</p>

            {toast.type === "warning" && (
              <div className='d-flex justify-content-end gap-2'>
                <button
                  className='btn btn-sm btn-secondary'
                  onClick={() => {
                    setConfirmAction(null);
                    setToast({ ...toast, show: false });
                  }}>
                  Cancel
                </button>

                <button
                  className='btn btn-sm btn-danger'
                  onClick={handleConfirmDelete}>
                  Confirm
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className='row g-4'>
        {/* LEADS LIST */}
        <div className='col-12 col-lg-6'>
          <div className='card shadow-sm h-100'>
            <div className='card-body'>
              <h6 className='fw-semibold mb-3'>Leads</h6>

              {leads.length === 0 ? (
                <p className='text-muted small'>No leads found.</p>
              ) : (
                <ul className='list-group list-group-flush'>
                  {leads.map((lead) => (
                    <li
                      key={lead._id}
                      className='list-group-item d-flex justify-content-between align-items-center'>
                      <div>
                        <div className='fw-semibold'>{lead.name}</div>
                        <div className='small text-muted'>
                          Status: {lead.status}
                        </div>
                      </div>

                      <button
                        className='btn btn-sm btn-outline-danger'
                        onClick={() => deleteLead(lead._id)}>
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* SALES AGENTS LIST */}
        <div className='col-12 col-lg-6'>
          <div className='card shadow-sm h-100'>
            <div className='card-body'>
              <h6 className='fw-semibold mb-3'>Sales Agents</h6>

              {agents.length === 0 ? (
                <p className='text-muted small'>No agents found.</p>
              ) : (
                <ul className='list-group list-group-flush'>
                  {agents.map((agent) => (
                    <li
                      key={agent._id}
                      className='list-group-item d-flex justify-content-between align-items-center'>
                      <div>
                        <div className='fw-semibold'>{agent.name}</div>
                        <div className='small text-muted'>{agent.email}</div>
                      </div>

                      <button
                        className='btn btn-sm btn-outline-danger'
                        onClick={() => deleteAgent(agent._id)}>
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Settings };
