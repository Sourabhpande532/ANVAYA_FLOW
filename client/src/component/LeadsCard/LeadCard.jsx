import { Link } from "react-router-dom";

const LeadCard = ({ lead, onDelete }) => {
  return (
    <div className="card mb-2 shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h6 className="card-title mb-1">
              <Link
                style={{ textDecoration: "none" }}
                to={"/leads/" + lead._id}
              >
                {lead.name}
              </Link>
            </h6>
            <small className="text-muted">
              {new Date(lead.createdAt).toLocaleDateString()}
            </small>
          </div>

          {/* Delete icon */}
          <button
            className="btn btn-sm btn-link text-danger p-0"
            title="Delete lead"
            onClick={() => onDelete(lead._id)}
          >
            ❌
          </button>
        </div>

        <p className="card-text mt-2 mb-1">
          Status: <strong>{lead.status}</strong> | Agent:{" "}
          {lead.salesAgent?.name || "—"}
        </p>

        <p className="card-text mb-2">
          Priority: {lead.priority} | Time to Close: {lead.timeToClose} days
        </p>

        <div>
          {lead.tags?.map((t) => (
            <span key={t} className="badge bg-info text-dark me-1">
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export { LeadCard };
