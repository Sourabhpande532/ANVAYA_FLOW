/* eslint-disable no-lone-blocks */
import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchJSON } from "../api";
import { LeadContext } from "../context/LeadContext";
import { LeadCard } from "../component/LeadsCard/LeadCard";

/**
 *
 * Features:
 * - Read filters from URL on mount and when URL changes
 * - Update URL when user applies filters
 * - Fetch leads whenever the URL search changes
 * - Uses agents from LeadContext
 * - Loading state and simple error logging
 */

function LeadList() {
  const { agents = [], tags = [] } = useContext(LeadContext); // agents/tags from context
  const location = useLocation();
  const navigate = useNavigate();

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);

  // Helper: parse current URL search into an object of filter values
  const parseSearch = (search) => {
    const sp = new URLSearchParams(search);
    return {
      salesAgent: sp.get("salesAgent") || "",
      status: sp.get("status") || "",
      source: sp.get("source") || "",
      tags: sp.get("tags") || "",
      sortBy: sp.get("sortBy") || "",
      sortDir: sp.get("sortDir") || "asc",
    };
  };

  // filters state mirrors the URL params
  const [filters, setFilters] = useState(() => parseSearch(location.search));

  // Keep filters in sync with URL: whenever location.search changes, update filters
  useEffect(() => {
    setFilters(parseSearch(location.search));
  }, [location.search]);

  // Build URL search string from filters and navigate to it
  const applyFilters = () => {
    const sp = new URLSearchParams();
    if (filters.salesAgent) sp.set("salesAgent", filters.salesAgent);
    if (filters.status) sp.set("status", filters.status);
    if (filters.source) sp.set("source", filters.source);
    if (filters.tags) sp.set("tags", filters.tags);
    if (filters.sortBy) sp.set("sortBy", filters.sortBy);
    if (filters.sortDir) sp.set("sortDir", filters.sortDir);
    navigate(`/leads?${sp.toString()}`);
  };

  // Fetch leads whenever URL search changes
  useEffect(() => {
    let cancelled = false; // avoid setting state after unmount
    const fetchLeads = async () => {
      setLoading(true);
      try {
        // reuse the raw search string so server receives same query format
        const path = "/leads" + (location.search ? location.search : "");
        const data = await fetchJSON(path);
        if (!cancelled) {
          // expects API result shape: { data: { leads: [...] } }
          setLeads((data && data.data && data.data.leads) || []);
        }
      } catch (err) {
        console.error("Failed to fetch leads:", err);
        if (!cancelled) setLeads([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchLeads();
    // cleanup to avoid setting state if component unmounts
    return () => {
      cancelled = true;
    };
  }, [location.search]);

  // Quick helper to update a single field in filters
  const updateFilterField = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div>
      <h2>Leads</h2>

      {/* Filters card */}
      <div className='card mb-3 p-3'>
        <div className='row g-2 align-items-end'>
          {/* Sales Agent */}
          <div className='col-md-3'>
            <label className='form-label small'>Sales Agent</label>
            <select
              className='form-select'
              value={filters.salesAgent}
              onChange={(e) => updateFilterField("salesAgent", e.target.value)}>
              <option value=''>All</option>
              {agents.map((a) => (
                <option key={a._id} value={a._id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className='col-md-2'>
            <label className='form-label small'>Status</label>
            <select
              className='form-select'
              value={filters.status}
              onChange={(e) => updateFilterField("status", e.target.value)}>
              <option value=''>All</option>
              <option>New</option>
              <option>Contacted</option>
              <option>Qualified</option>
              <option>Proposal Sent</option>
              <option>Closed</option>
            </select>
          </div>

          {/* Source */}
          <div className='col-md-2'>
            <label className='form-label small'>Source</label>
            <select
              className='form-select'
              value={filters.source}
              onChange={(e) => updateFilterField("source", e.target.value)}>
              <option value=''>All</option>
              <option>Website</option>
              <option>Referral</option>
              <option>Cold Call</option>
              <option>Advertisement</option>
              <option>Email</option>
              <option>Other</option>
            </select>
          </div>

          {/* Tags */}
          <div className='col-md-2'>
            <label className='form-label small'>Tags (comma)</label>
            <input
              className='form-control'
              placeholder='High Value,Follow-up'
              value={filters.tags}
              onChange={(e) => updateFilterField("tags", e.target.value)}
            />
          </div>

          {/* Sort */}
          <div className='col-md-1'>
            <label className='form-label small'>Sort</label>
            <select
              className='form-select'
              value={filters.sortBy}
              onChange={(e) => updateFilterField("sortBy", e.target.value)}>
              <option value=''>Default</option>
              <option value='priority'>Priority</option>
              <option value='timeToClose'>Time to Close</option>
              <option value='createdAt'>Created At</option>
            </select>
          </div>

          {/* Sort Dir */}
          <div className='col-md-1'>
            <label className='form-label small'>Dir</label>
            <select
              className='form-select'
              value={filters.sortDir}
              onChange={(e) => updateFilterField("sortDir", e.target.value)}>
              <option value='asc'>Asc</option>
              <option value='desc'>Desc</option>
            </select>
          </div>

          {/* Apply button */}
          <div className='col-md-1 text-end'>
            <button className='btn btn-primary' onClick={applyFilters}>
              Apply
            </button>
          </div>
        </div>
      </div>

      {/* Loading / Leads list */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className='row'>
          <div className='col-md-8'>
            {leads.length === 0 ? (
              <p>No leads found</p>
            ) : (
              leads.map((l) => <LeadCard key={l._id} lead={l} />)
            )}
          </div>

          {/* Quick Filters or sidebar */}
          <div className='col-md-4'>
            <div className='card p-2'>
              <h6>Quick Filters</h6>
              <div className='d-flex flex-wrap'>
                <button
                  className='btn btn-sm btn-outline-primary me-1 mb-1'
                  onClick={() => navigate("/leads?status=New")}>
                  New
                </button>
                <button
                  className='btn btn-sm btn-outline-secondary me-1 mb-1'
                  onClick={() => navigate("/leads?status=Contacted")}>
                  Contacted
                </button>
                <button
                  className='btn btn-sm btn-outline-success me-1 mb-1'
                  onClick={() => navigate("/leads?status=Closed")}>
                  Closed
                </button>
              </div>

              {/* show known tags for quick set */}
              {tags && tags.length > 0 && (
                <>
                  <hr />
                  <h6 className='mb-2'>Tags</h6>
                  <div>
                    {tags.map((t) => (
                      <button
                        key={t}
                        className='btn btn-sm btn-outline-dark me-1 mb-1'
                        onClick={() => updateFilterField("tags", t)}>
                        {t}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { LeadList };

{
  /**
   *
   * Features:
   * - Read filters from URL on mount and when URL changes
   * - Update URL when user applies filters
   * - Fetch leads whenever the URL search changes
   * - Uses agents from LeadContext
   * - Loading state and simple error logging
   */
}
