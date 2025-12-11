import { Link } from "react-router-dom";

const LeadCard = ({ lead }) => {
  return (
    <div className='card mb-2'>
      <div className='card-body'>
        <h5 className='card-title'>
          <Link to={"/leads/" + lead._id}>{lead.name}</Link>
        </h5>
        <p className='card-text'>
          Status: {lead.status} | Agent: {lead.salesAgent?.name || "—"}
        </p>
        <p className='card-text'>
          Priority: {lead.priority} | Time to Close: {lead.timeToClose} days
        </p>
      </div>
    </div>
  );
};
export { LeadCard };
