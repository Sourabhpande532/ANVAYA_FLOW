const API_BASE = process.env.REACT_APP_API_URL || "https://anvaya-flow.vercel.app";
export async function fetchJSON(path, opts = {}) {
  const res = await fetch(API_BASE + path, {
    headers: { "Content-Type": "application/json" },
    ...opts,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: res.statusText }));
    throw error;
  }
  return res.json();
}

/*NOTE:
 ->async means “this function will take some time, so don’t freeze the page — keep running other code until I’m done.” 
 ->await means “pause inside this async function until the data comes from the server.”
 fetch() does NOT give data instantly.
 It returns a Promise (like: “I’ll give you the result later”).
 can headers overide if someone sent Yes
 */
