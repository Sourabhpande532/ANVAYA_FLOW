import { useEffect, useRef, useState } from "react";
import { fetchJSON } from "../api";
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  PieController,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { FaChartPie, FaUserCheck, FaFire } from "react-icons/fa";

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  PieController,
  ArcElement,
  Tooltip,
  Legend
);

const Reports = () => {
  const [pipeline, setPipeline] = useState(null);
  const [closedLastWeek, setClosedLastWeek] = useState([]);

  const barChartRef = useRef(null);
  const pieChartRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const pipelineRes = await fetchJSON("/report/pipeline");
        const closedRes = await fetchJSON("/report/last-week");

        setPipeline(pipelineRes);
        setClosedLastWeek(closedRes);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  // 📊 Create charts AFTER data loads
  useEffect(() => {
    if (!pipeline) return;

    // ---- BAR CHART (Leads by Status) ----
    const statusLabels = Object.keys(pipeline.byStatus || {});
    const statusCounts = Object.values(pipeline.byStatus || {});

    const barChart = new Chart(barChartRef.current, {
      type: "bar",
      data: {
        labels: statusLabels,
        datasets: [
          {
            label: "Leads Count",
            data: statusCounts,
            backgroundColor: "#0d6efd",
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
        },
      },
    });

    // ---- PIE CHART (Closed vs Open) ----
    const pieChart = new Chart(pieChartRef.current, {
      type: "pie",
      data: {
        labels: ["Closed Last Week", "Others"],
        datasets: [
          {
            data: [
              closedLastWeek.length,
              pipeline.totalLeadsInPipeline - closedLastWeek.length,
            ],
            backgroundColor: ["#198754", "#ffc107"],
          },
        ],
      },
      options: {
        responsive: true,
      },
    });

    return () => {
      barChart.destroy();
      pieChart.destroy();
    };
  }, [pipeline, closedLastWeek]);

  return (
    <div className="container-fluid">
      <h4 className="fw-bold mb-4">Reports</h4>

      {/* KPI Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card shadow-sm report-card">
            <div className="card-body d-flex align-items-center gap-3">
              <FaChartPie size={26} className="text-primary" />
              <div>
                <div className="small text-muted">Leads in Pipeline</div>
                <div className="fs-4 fw-bold">
                  {pipeline?.totalLeadsInPipeline ?? "-"}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm report-card">
            <div className="card-body d-flex align-items-center gap-3">
              <FaUserCheck size={26} className="text-success" />
              <div>
                <div className="small text-muted">Closed Last Week</div>
                <div className="fs-4 fw-bold">
                  {closedLastWeek.length}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm report-card">
            <div className="card-body d-flex align-items-center gap-3">
              <FaFire size={26} className="text-danger" />
              <div>
                <div className="small text-muted">Top Activity</div>
                <div className="fw-semibold">Sales Performance</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="row g-4 mb-4">
        <div className="col-md-7">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h6 className="fw-semibold mb-3">Leads by Status</h6>
              <canvas ref={barChartRef} />
            </div>
          </div>
        </div>

        <div className="col-md-5">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h6 className="fw-semibold mb-3">Weekly Closure Ratio</h6>
              <canvas ref={pieChartRef} />
            </div>
          </div>
        </div>
      </div>

      {/* Closed Last Week Table */}
      <div className="card shadow-sm">
        <div className="card-body">
          <h6 className="fw-semibold mb-3">Leads Closed Last Week</h6>

          {closedLastWeek.length === 0 ? (
            <p className="text-muted small">No leads closed last week.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-sm align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Lead</th>
                    <th>Sales Agent</th>
                    <th>Closed On</th>
                  </tr>
                </thead>
                <tbody>
                  {closedLastWeek.map((c) => (
                    <tr key={c.id}>
                      <td>{c.name}</td>
                      <td>{c.salesAgent}</td>
                      <td>
                        {new Date(c.closedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { Reports };
