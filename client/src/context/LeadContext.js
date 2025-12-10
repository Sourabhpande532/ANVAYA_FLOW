import { createContext, useContext, useEffect, useState } from "react";
import { fetchJSON } from "../api";

const LeadContext = createContext();

const LeadProvider = ({ children }) => {
  const [agents, setAgents] = useState([]);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    /*NOTICE:
    (async () => {
      try {
        const data = await fetchJSON("/agents");
        setAgents(data.data?.agents);
      } catch (error) {
        console.error("Failed to fetch agents", error);
      }
    })(); below shorter*/
    async function load() {
      try {
        const data = await fetchJSON("/agents");
        setAgents(data?.data?.agents);
      } catch (error) {
        console.error("Failed to fetch agents", error);
      }
    }
    load();
  }, []);

  return (
    <LeadContext.Provider value={{ agents, tags, setTags }}>
      {children}
    </LeadContext.Provider>
  );
};
const useLeadContext = () => useContext(LeadContext);
export { LeadContext, LeadProvider, useLeadContext };
