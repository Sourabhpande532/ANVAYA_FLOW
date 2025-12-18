import { createContext, useContext, useEffect, useState } from "react";
import { fetchJSON } from "../api";

const LeadContext = createContext();

const LeadProvider = ({ children }) => {
  const [agents, setAgents] = useState([]);
  const [tags, setTags] = useState([]);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "Success",
  });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type });
    }, 4000);
  };

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchJSON("/agents");
        setAgents(data?.data?.agents || []);
        const tagResponse = await fetchJSON("/tags");
        setTags(tagResponse?.data?.tags || []);
      } catch (error) {
        console.error("Failed to fetch agents", error);
      }
    }
    load();
  }, []);

  return (
    <LeadContext.Provider
      value={{ agents, tags, setTags, toast, setToast, showToast }}>
      {children}
    </LeadContext.Provider>
  );
};
const useLeadContext = () => useContext(LeadContext);
export { LeadContext, LeadProvider, useLeadContext };

/*  
NOTICE:
    (async () => {
      try {
        const data = await fetchJSON("/agents");
        setAgents(data.data?.agents);
      } catch (error) {
        console.error("Failed to fetch agents", error);
      }
    })(); below shorter
    async function load() {
      try {
        const data = await fetchJSON("/agents");
        setAgents(data?.data?.agents || []);
        const tagResponse = await fetchJSON("/tags");
        setTags(tagResponse?.data?.tags || []);
      } catch (error) {
        console.error("Failed to fetch agents", error);
      }
    }
    load();
    */
