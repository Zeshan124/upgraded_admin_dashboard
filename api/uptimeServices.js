export const getMonitors = async () => {
  try {
    const response = await fetch("https://api.uptimerobot.com/v2/getMonitors", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        api_key: process.env.NEXT_PUBLIC_UPTIME_ROBOT_API_KEY,
        format: "json",
        logs: "1",
      }),
    });

    const data = await response.json();
    if (data && data.monitors) {
      return data.monitors;
    } else {
      throw new Error("No monitors found in response");
    }
  } catch (error) {
    console.error("Error fetching monitors:", error);
    throw new Error("Failed to fetch monitors");
  }
};
