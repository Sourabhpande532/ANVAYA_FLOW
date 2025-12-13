import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchJSON } from "../api";

function LeadDetails() {
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  const load = async () => {
    try {
      const l = await fetchJSON("/leads/" + id);
      setLead(l.data.lead);
      const c = await fetchJSON("/leads/" + id + "/comments");
      setComments(c.data.comments);
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
      // author not determined in UI; use first author id from lead.salesAgent as example
      const body = { commentText: text, author: lead.salesAgent?._id };
      await fetchJSON("/leads/" + id + "/comments", {
        method: "POST",
        body: JSON.stringify(body),
      });
      setText("");
      load();
    } catch (e) {
      alert("Failed to add comment");
    }
  };

  if (!lead) return <p>Loading...</p>;
  return (
    <div>
      <h2>{lead.name}</h2>
      <p>Agent: {lead.salesAgent?.name}</p>
      <p>Source: {lead.source}</p>
      <p>Status: {lead.status}</p>
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
        {comments?.map((c) => (
          <div key={c._id} className='border p-2 mb-2'>
            <strong>{c.author?.name}</strong>{" "}
            <small className='text-muted'>
              {new Date(c.createdAt).toLocaleString()}
            </small>
            <p>{c.commentText}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
export { LeadDetails };
