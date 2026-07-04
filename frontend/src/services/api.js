const BASE_URL = "http://127.0.0.1:8000";

export const getDashboardData = async () => {
  const res = await fetch(`${BASE_URL}/api/predictions/dashboard-data`);
  if (!res.ok) throw new Error("Failed to fetch dashboard data");
  return res.json();
};

export const getAlerts = async () => {
  const res = await fetch(`${BASE_URL}/api/alerts`);
  if (!res.ok) throw new Error("Failed to fetch alerts");
  return res.json();
};

export const getFeedback = async () => {
  const res = await fetch(`${BASE_URL}/api/feedback`);
  if (!res.ok) throw new Error("Failed to fetch feedback reports");
  return res.json();
};

export const submitFeedback = async (reportData) => {
  const res = await fetch(`${BASE_URL}/api/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reportData),
  });
  if (!res.ok) throw new Error("Failed to submit feedback report");
  return res.json();
};

export const askAgent = async (agent, message) => {
  const res = await fetch(`${BASE_URL}/api/recommendations/recommend`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ agent, message }),
  });
  if (!res.ok) throw new Error("Failed to communicate with AI agent");
  return res.json();
};

export const getResources = async () => {
  const res = await fetch(`${BASE_URL}/api/recommendations/resources`);
  if (!res.ok) throw new Error("Failed to fetch resource planning data");
  return res.json();
};

export const getBenchmark = async () => {
  const res = await fetch(`${BASE_URL}/api/predictions/benchmark`);
  if (!res.ok) throw new Error("Failed to run benchmark");
  return res.json();
};
