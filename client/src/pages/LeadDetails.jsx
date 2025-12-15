import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchJSON } from "../api";

function LeadDetails() {
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success", // success | danger
  });
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type });
    }, 3000);
  };

  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [status, setStatus] = useState("");

  const load = async () => {
    try {
      const l = await fetchJSON("/leads/" + id);
      setLead(l?.data?.lead);
      setStatus(l?.data?.lead?.status);
      const comment = await fetchJSON("/leads/" + id + "/comments");
      setComments(comment.data.comments);
    } catch (e) {
      console.error(e);
    }
  };
  useEffect(() => {
    load(); /* eslint-disable-next-line */
  }, [id]);

  const addComment = async (ev) => {
    ev.preventDefault();
    try {
      const body = { commentText: text, author: lead.salesAgent?._id };
      await fetchJSON("/leads/" + id + "/comments", {
        method: "POST",
        body: JSON.stringify(body),
      });
      setText("");
      load();
      showToast("Comment added successfully", "success");
    } catch (e) {
      showToast("Failed to add comment ❌", "danger");
    }
  };

  const updateStatus = async () => {
    try {
      await fetchJSON("/leads/" + id, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
      load();
      showToast("Status updated successfully", "Success");
    } catch (e) {
      showToast("Failed to update status ❌", "danger");
    }
  };

  if (!lead) return <p>Loading...</p>;
  return (
    <div>
      {toast.show && (
        <div
          className='toast show position-fixed top-0 end-0 m-3'
          role='alert'
          style={{ zIndex: 9999 }}>
          <div className={`toast-header bg-${toast.type} text-white`}>
            <strong className='me-auto'>
              {toast.type === "success" ? "Success" : "Error"}
            </strong>
            <button
              type='button'
              className='btn-close btn-close-white'
              onClick={() => setToast({ ...toast, show: false })}
            />
          </div>
          <div className='toast-body'>{toast.message}</div>
        </div>
      )}

      <div className='d-flex justify-content-between align-items-center'>
        <h2>{lead.name}</h2>
        <div>
          <select
            className='form-select'
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{ width: 200, display: "inline-block", marginRight: 8 }}>
            <option>New</option>
            <option>Contacted</option>
            <option>Qualified</option>
            <option>Proposal Sent</option>
            <option>Closed</option>
          </select>
          <button className='btn btn-sm btn-primary' onClick={updateStatus}>
            Save
          </button>
        </div>
      </div>
      <p>Agent: {lead.salesAgent?.name}</p>
      <p>Source: {lead.source}</p>
      <p>Priority: {lead.priority}</p>
      <hr />
      <h5>Comments</h5>
      <form onSubmit={addComment}>
        <div className='mb-2'>
          <textarea
            className='form-control'
            required
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <button className='btn btn-sm btn-primary'>Add Comment</button>
      </form>
      <div className='mt-3'>
        {comments.map((comment) => (
          <div key={comment._id} className='border p-2 mb-2'>
            <strong>{comment.author?.name}</strong>{" "}
            <small className='text-muted'>
              {new Date(comment.createdAt).toLocaleString()}
            </small>
            <p>{comment.commentText}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
export { LeadDetails };
