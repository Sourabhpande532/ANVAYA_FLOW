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

  const statusBarRef = useRef(null);
  const pipelinePieRef = useRef(null);
  const agentBarRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const pipelineRes = await fetchJSON("/report/pipeline");
        const closedRes = await fetchJSON("/report/last-week");

        setPipeline(pipelineRes);
        setClosedLastWeek(closedRes || []);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  useEffect(() => {
    if (!pipeline) return;

    const statusChart = new Chart(statusBarRef.current, {
      type: "bar",
      data: {
        labels: Object.keys(pipeline.byStatus || {}),
        datasets: [
          {
            label: "Leads",
            data: Object.values(pipeline.byStatus || {}),
            backgroundColor: "#0d6efd",
          },
        ],
      },
      options: { responsive: true, plugins: { legend: { display: false } } },
    });

    const pipelineChart = new Chart(pipelinePieRef.current, {
      type: "pie",
      data: {
        labels: ["Closed Last Week", "In Pipeline"],
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
    });

    const agentMap = {};
    closedLastWeek.forEach((l) => {
      const a = l.salesAgent || "Unassigned";
      agentMap[a] = (agentMap[a] || 0) + 1;
    });

    const agentChart = new Chart(agentBarRef.current, {
      type: "bar",
      data: {
        labels: Object.keys(agentMap),
        datasets: [
          {
            label: "Closed Leads",
            data: Object.values(agentMap),
            backgroundColor: "#6610f2",
          },
        ],
      },
      options: { responsive: true, plugins: { legend: { display: false } } },
    });

    return () => {
      statusChart.destroy();
      pipelineChart.destroy();
      agentChart.destroy();
    };
  }, [pipeline, closedLastWeek]);

  return (
    <div className="container-fluid px-2 px-md-4">
      <h4 className="fw-bold mb-4 text-center text-md-start">
        Anvaya CRM Reports
      </h4>

      {/* KPI CARDS */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <div className="card shadow-sm h-100">
            <div className="card-body d-flex gap-3 align-items-center">
              <FaChartPie className="text-primary" size={26} />
              <div>
                <div className="small text-muted">Leads in Pipeline</div>
                <div className="fs-4 fw-bold">
                  {pipeline?.totalLeadsInPipeline ?? "-"}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card shadow-sm h-100">
            <div className="card-body d-flex gap-3 align-items-center">
              <FaUserCheck className="text-success" size={26} />
              <div>
                <div className="small text-muted">Closed Last Week</div>
                <div className="fs-4 fw-bold">{closedLastWeek.length}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card shadow-sm h-100">
            <div className="card-body d-flex gap-3 align-items-center">
              <FaFire className="text-danger" size={26} />
              <div>
                <div className="small text-muted">Performance</div>
                <div className="fw-semibold">Sales Activity</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CHARTS */}
      <div className="row g-4">
        <div className="col-12 col-lg-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h6 className="fw-semibold">Lead Status Distribution</h6>
              <canvas ref={statusBarRef} />
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h6 className="fw-semibold">Closed vs Pipeline</h6>
              <canvas ref={pipelinePieRef} />
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <h6 className="fw-semibold">Leads Closed by Sales Agent</h6>
              <canvas ref={agentBarRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Reports };
