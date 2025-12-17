import { useEffect, useState } from "react";
import { fetchJSON } from "../api";

const STATUS_COLORS = {
  New: "primary",
  Contacted: "info",
  Qualified: "warning",
  "Proposal Sent": "secondary",
  Closed: "success",
};

const StatusAnalysis = () => {
  const [counts, setCounts] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchJSON("/leads");
        const byStatus = res.data.leads.reduce((acc, l) => {
          acc[l.status] = (acc[l.status] || 0) + 1;
          return acc;
        }, {});
        setCounts(byStatus);
      } catch (e) {
        console.error("Failed to load status analysis");
      }
    })();
  }, []);

  return (
    <div className="row g-3">
      {["New", "Contacted", "Qualified", "Proposal Sent", "Closed"].map(
        (status) => (
          <div className="col-6 col-md-4 col-lg-3" key={status}>
            <div
              className={`card text-center h-100 border-${STATUS_COLORS[status]} bg-dark`}>
              <div className="card-body py-3">
                <div className="text-muted small mb-1">
                  {status}
                </div>

                <div
                  className={`fs-3 fw-bold text-${STATUS_COLORS[status]}`}>
                  {counts[status] || 0}
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export { StatusAnalysis };
