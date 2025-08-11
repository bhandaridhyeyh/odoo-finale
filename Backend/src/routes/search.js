import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { query, type } = req.query;
    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    const serpRes = await axios.get("https://serpapi.com/search.json", {
      params: {
        q: query,
        api_key: process.env.SERP_API_KEY,
        engine: "google",
        tbm: type === "activity" ? "pla" : "", // You can adjust based on SERP API's available engines
      },
    });

    // You can map SERP API data to match your frontend structure
    const results = (serpRes.data.organic_results || []).map((item, index) => ({
      id: String(index + 1),
      name: item.title || "Unknown",
      country: item.source || "Unknown",
      type: type || "destination",
      image: item.thumbnail || "/default-image.jpg",
      rating: 4.5, // SERP may not return ratings; set default or map if available
      reviewCount: Math.floor(Math.random() * 500) + 50,
      price: item.price || "₹1000-2000",
      duration: "3-7 days", // adjust mapping
      description: item.snippet || "",
      highlights: ["Popular Spot", "Must Visit", "Trending"],
    }));

    res.json({ results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch search results" });
  }
});

export default router;
