import { BetaAnalyticsDataClient } from "@google-analytics/data";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { startDate, endDate, device } = req.query;
    const analyticsDataClient = new BetaAnalyticsDataClient({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/gm, "\n"),
      },
    });

    let propertyId;
    if (device === "website") {
      propertyId = "326990002";
    } else if (device === "app") {
      propertyId = "406514869";
    }

    try {
      const [response] = await analyticsDataClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: "city" }],
        metrics: [{ name: "activeUsers" }, { name: "newUsers" }],
      });

      let totalUsers = 0;
      let totalNewUsers = 0;
      response.rows.forEach((row) => {
        totalUsers += parseInt(row.metricValues[0].value);
        totalNewUsers += parseInt(row.metricValues[1].value);
      });
      const returningUsers = totalUsers - totalNewUsers;

      res.status(200).json({
        totalActiveUsers: totalUsers,
        totalNewUsers,
        totalReturningUsers: returningUsers,
        // detailedData: response.rows
      });
    } catch (error) {
      console.error("The API returned an error:", error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}