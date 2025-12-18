import { useContext } from "react";
import { LeadContext } from "../context/LeadContext";

const Toast = () => {
  const { toast } = useContext(LeadContext);

  if (!toast.show) return null;

  return (
    <div
      className="toast-container position-fixed bottom-0 end-0 p-3"
      style={{ zIndex: 9999 }}
    >
      <div
        className={`toast show text-bg-${toast.type} border-0`}
        role="alert"
      >
        <div className="toast-body fw-semibold">
          {toast.message}
        </div>
      </div>
    </div>
  );
};

export default Toast;
