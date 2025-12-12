import { useContext, useState } from "react";
import { LeadContext } from "../context/LeadContext";
import { useNavigate } from "react-router-dom";
import { fetchJSON } from "../api";

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
      alert("Failed: " + (e.error || JSON.stringify(e)));
    }
  };

  return (
    <div>
      <h2>Add Lead</h2>
      <form onSubmit={submit}>
        <div className='mb-2'>
          <label className='form-label'>Lead Name</label>
          <input
            required
            name='name'
            className='form-control'
            value={form.name}
            onChange={handle}
          />
        </div>
        <div className='row'>
          <div className='col-md-4 mb-2'>
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
          <div className='col-md-4 mb-2'>
            <label className='form-label'>Sales Agent</label>
            <select
              name='salesAgent'
              className='form-select'
              value={form.salesAgent}
              onChange={handle}
              required>
              <option value=''>-- select --</option>
              {agents.map((a) => (
                <option key={a._id} value={a._id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
          <div className='col-md-2 mb-2'>
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
          <div className='col-md-2 mb-2'>
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

        <div className='mb-2'>
          <label className='form-label'>Tags</label>
          <div className='d-flex gap-2 mb-2'>
            <input
              className='form-control'
              placeholder='Add tag'
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
          <div>
            {form.tags.map((tag) => (
              <span key={tag} className='badge bg-secondary me-1'>
                {tag}{" "}
                <button
                  type='button'
                  className='btn btn-sm btn-link text-white'
                  onClick={() => removeTag(tag)}>
                  ❌
                </button>
              </span>
            ))}
          </div>
        </div>

        <button className='btn btn-primary'>Create Lead</button>
      </form>
    </div>
  );
};
export { AddLeads };
