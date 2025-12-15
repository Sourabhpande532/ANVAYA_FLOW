import { useEffect, useState } from "react";
import { fetchJSON } from "../api";

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
      } catch (e) {}
    })();
  }, []);

  return (
    <div className="row g-2">
      {["New", "Contacted", "Qualified", "Proposal Sent", "Closed"].map(
        (s) => (
          <div className="col-6 col-md-4" key={s}>
            <div className="border rounded p-2 text-center">
              <div className="fw-semibold small">{s}</div>
              <div className="fs-5 fw-bold">{counts[s] || 0}</div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export { StatusAnalysis };
