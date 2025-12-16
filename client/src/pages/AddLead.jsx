import { useContext, useState } from "react";
import { LeadContext } from "../context/LeadContext";
import { useNavigate } from "react-router-dom";
import { fetchJSON } from "../api";
import "../App.css"

const AddLeads = () => {
  const { agents } = useContext(LeadContext);
  const [form, setForm] = useState({
    name: "",
    source: "Website",
    salesAgent: "",
    status: "New",
    tags: [],
    timeToClose: 30,
    priority: "Medium",
  });
  const [tagInput, setTagInput] = useState("");
  const navigate = useNavigate();

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addTag = () => {
    if (!tagInput) return;
    setForm((prev) => ({
      ...prev,
      tags: Array.from(new Set([...prev.tags, tagInput.trim()])),
    }));
    setTagInput("");
  };

  const removeTag = (tag) =>
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((x) => x !== tag) }));

  const submit = async (ev) => {
    ev.preventDefault();
    try {
      await fetchJSON("/leads", { method: "POST", body: JSON.stringify(form) });
      navigate("/leads");
    } catch (e) {
      alert("Failed to fetch");
      console.error(e);
    }
  };

  return (
    <div className='container-fluid px-4'>
      {/* Page title */}
      <div className='mb-3'>
        <h4 className='fw-bold'>Add Lead</h4>
        <p className='text-muted small mb-0'>
          Create and assign a new lead to a sales agent
        </p>
      </div>

      {/* Form Card */}
      <div className='row'>
        <div className='col-12'>
          <div className='card shadow-sm full-width-card'>
            <div className='card-body'>
              <form onSubmit={submit}>
                {/* Lead Name */}
                <div className='mb-3'>
                  <label className='form-label'>Lead Name</label>
                  <input
                    required
                    name='name'
                    className='form-control'
                    placeholder='Enter lead name'
                    value={form.name}
                    onChange={handle}
                  />
                </div>

                {/* Row 1 */}
                <div className='row'>
                  <div className='col-md-4 mb-3'>
                    <label className='form-label'>Source</label>
                    <select
                      name='source'
                      className='form-select'
                      value={form.source}
                      onChange={handle}>
                      <option>Website</option>
                      <option>Referral</option>
                      <option>Cold Call</option>
                      <option>Advertisement</option>
                      <option>Email</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div className='col-md-4 mb-3'>
                    <label className='form-label'>Sales Agent</label>
                    <select
                      name='salesAgent'
                      className='form-select'
                      value={form.salesAgent}
                      onChange={handle}
                      required>
                      <option value=''>-- Select Agent --</option>
                      {agents.map((a) => (
                        <option key={a._id} value={a._id}>
                          {a.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className='col-md-2 mb-3'>
                    <label className='form-label'>Priority</label>
                    <select
                      name='priority'
                      className='form-select'
                      value={form.priority}
                      onChange={handle}>
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </select>
                  </div>

                  <div className='col-md-2 mb-3'>
                    <label className='form-label'>Time to Close</label>
                    <input
                      type='number'
                      min='1'
                      name='timeToClose'
                      className='form-control'
                      value={form.timeToClose}
                      onChange={handle}
                    />
                  </div>
                </div>

                {/* Tags */}
                <div className='mb-4'>
                  <label className='form-label'>Tags</label>

                  <div className='input-group mb-2'>
                    <input
                      className='form-control'
                      placeholder='Type tag and click Add'
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                    />
                    <button
                      type='button'
                      className='btn btn-outline-primary'
                      onClick={addTag}>
                      Add
                    </button>
                  </div>

                  <div className='d-flex flex-wrap gap-2'>
                    {form.tags.map((tag) => (
                      <span key={tag} className='badge bg-secondary'>
                        {tag}
                        <button
                          type='button'
                          className='btn btn-sm btn-link text-white ms-1 p-0'
                          onClick={() => removeTag(tag)}>
                          ❌
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Submit */}
                <div className='d-flex justify-content-end'>
                  <button className='btn btn-primary px-4'>Create Lead</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { AddLeads };
