import { useEffect, useState } from "react";
import { fetchJSON } from "../api";

const Agents = () => {
  const [agents, setAgents] = useState([]);
  const [form, setForm] = useState({ name: "", email: "" });

  useEffect(() => {
    (async () => {
      try {
        const a = await fetchJSON("/agents");
        setAgents(a.data.agents);
      } catch (e) {}
    })();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await fetchJSON("/agents", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setForm({ name: "", email: "" });
      const a = await fetchJSON("/agents");
      setAgents(a?.data?.agents);
    } catch (err) {
      alert("Failed to add agent");
    }
  };

  return (
    <div className="container-fluid">
      {/* Page Header */}
      <div className="mb-3">
        <h4 className="fw-bold">Sales Agents</h4>
        <p className="text-muted small mb-0">
          Manage and assign sales agents
        </p>
      </div>

      <div className="row">
        {/* Add Agent Form */}
        <div className="col-xl-6 col-lg-7 col-md-12 mb-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h6 className="fw-semibold mb-3">Add New Agent</h6>

              <form onSubmit={submit}>
                <div className="row g-2">
                  <div className="col-md-5">
                    <input
                      required
                      className="form-control"
                      placeholder="Agent name"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                    />
                  </div>

                  <div className="col-md-5">
                    <input
                      required
                      type="email"
                      className="form-control"
                      placeholder="Agent email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                    />
                  </div>

                  <div className="col-md-2 d-grid">
                    <button className="btn btn-primary">
                      Add
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Agent List */}
        <div className="col-xl-6 col-lg-5 col-md-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <h6 className="fw-semibold mb-3">Agents List</h6>

              {agents.length === 0 ? (
                <p className="text-muted small mb-0">
                  No agents added yet.
                </p>
              ) : (
                <ul className="list-group list-group-flush">
                  {agents.map((a) => (
                    <li
                      key={a._id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <div className="fw-semibold">{a.name}</div>
                        <div className="text-muted small">{a.email}</div>
                      </div>
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

export { Agents };
