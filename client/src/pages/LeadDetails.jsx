import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchJSON } from "../api";

function LeadDetails() {
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
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
  const [agents, setAgents] = useState([]);

  const [text, setText] = useState("");
  const [author, setAuthor] = useState("");
  const [status, setStatus] = useState("");

  // edit comment states
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  const load = async () => {
    try {
      const l = await fetchJSON("/leads/" + id);
      setLead(l?.data?.lead);
      setStatus(l?.data?.lead?.status);

      const comment = await fetchJSON("/leads/" + id + "/comments");
      setComments(comment.data.comments);

      const agentRes = await fetchJSON("/agents");
      setAgents(agentRes?.data?.agents || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, [id]);

  /* ================= ADD COMMENT ================= */
  const addComment = async (ev) => {
    ev.preventDefault();
    try {
      const body = {
        commentText: text,
        author,
      };

      await fetchJSON("/leads/" + id + "/comments", {
        method: "POST",
        body: JSON.stringify(body),
      });

      setText("");
      setAuthor("");
      load();
      showToast("Comment added successfully", "success");
    } catch (e) {
      showToast("Failed to add comment ❌", "danger");
    }
  };

  /* ================= EDIT COMMENT ================= */
  const saveEdit = async (commentId) => {
    try {
      await fetchJSON("/comments/" + commentId, {
        method: "PUT",
        body: JSON.stringify({ commentText: editText }),
      });

      setEditId(null);
      setEditText("");
      load();
      showToast("Comment updated", "success");
    } catch (e) {
      showToast("Failed to update comment ❌", "danger");
    }
  };

  /* ================= UPDATE STATUS ================= */
  const updateStatus = async () => {
    try {
      await fetchJSON("/leads/" + id, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
      load();
      showToast("Status updated successfully", "success");
    } catch (e) {
      showToast("Failed to update status ❌", "danger");
    }
  };

  if (!lead) return <p>Loading...</p>;

  return (
    <div>
      {/* TOAST */}
      {toast.show && (
        <div
          className="toast show position-fixed top-0 end-0 m-3"
          style={{ zIndex: 9999 }}
        >
          <div className={`toast-header bg-${toast.type} text-white`}>
            <strong className="me-auto">
              {toast.type === "success" ? "Success" : "Error"}
            </strong>
            <button
              className="btn-close btn-close-white"
              onClick={() => setToast({ ...toast, show: false })}
            />
          </div>
          <div className="toast-body">{toast.message}</div>
        </div>
      )}

      {/* LEAD HEADER */}
      <div className="d-flex justify-content-between align-items-center">
        <h2>{lead.name}</h2>
        <div>
          <select
            className="form-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{ width: 200, display: "inline-block", marginRight: 8 }}
          >
            <option>New</option>
            <option>Contacted</option>
            <option>Qualified</option>
            <option>Proposal Sent</option>
            <option>Closed</option>
          </select>
          <button className="btn btn-sm btn-primary" onClick={updateStatus}>
            Save
          </button>
        </div>
      </div>

      <p>Agent: {lead.salesAgent?.name}</p>
      <p>Source: {lead.source}</p>
      <p>Priority: {lead.priority}</p>

      <hr />

      {/* COMMENTS */}
      <h5>Comments</h5>

      <form onSubmit={addComment}>
        {/* AUTHOR DROPDOWN */}
        <div className="mb-2">
          <select
            className="form-select"
            required
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          >
            <option value="">Select Author</option>
            {agents.map((a) => (
              <option key={a._id} value={a._id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-2">
          <textarea
            className="form-control"
            required
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <button className="btn btn-sm btn-primary">Add Comment</button>
      </form>

      {/* COMMENT LIST */}
      <div className="mt-3">
        {comments.map((comment) => (
          <div key={comment._id} className="border p-2 mb-2">
            <strong>{comment.author?.name}</strong>{" "}
            <small className="text-muted">
              {new Date(comment.createdAt).toLocaleString()}
            </small>

            {editId === comment._id ? (
              <>
                <textarea
                  className="form-control my-2"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <button
                  className="btn btn-sm btn-success me-2"
                  onClick={() => saveEdit(comment._id)}
                >
                  Save
                </button>
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => setEditId(null)}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <p>{comment.commentText}</p>
                <button
                  className="btn btn-sm btn-link"
                  onClick={() => {
                    setEditId(comment._id);
                    setEditText(comment.commentText);
                  }}
                >
                  Edit
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export { LeadDetails };
