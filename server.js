// ✅ Defendzo Setu Server (Fixed + Tested)

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// ✅ Health check
app.get("/", (req, res) => {
  res.send("✅ Defendzo Setu Server Running");
});

// ✅ Create Mandate API
app.post("/dealer/:dealerId/create-mandate", async (req, res) => {
  try {
    const { dealerId } = req.params;
    const {
      customerName,
      customerMobile,
      amount,
      frequency,
      installments,
      startDate,
      oneTime,
      mandateReason
    } = req.body;

    console.log("📥 Mandate request from dealer:", dealerId, req.body);

    if (!customerName || !customerMobile || !amount || !startDate) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
      });
    }

    // Simulate mandate link creation
    const fakeAuthorizationUrl = `https://demo.setu.co.in/emandate/${Date.now()}`;

    res.status(200).json({
      success: true,
      authorizationUrl: fakeAuthorizationUrl,
      message: "Mandate link created successfully",
    });
  } catch (err) {
    console.error("❌ Mandate creation error:", err);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
});

// ✅ Fetch Mandates (for list view)
app.get("/dealer/:dealerId/mandates", async (req, res) => {
  try {
    const sampleData = [
      { id: "M1", customerName: "Ravi Kumar", amount: 500, totalAmount: 1000, status: "ACTIVE" },
      { id: "M2", customerName: "Anjali Singh", amount: 1200, totalAmount: 1200, status: "FINISHED" },
      { id: "M3", customerName: "Amit Sharma", amount: 800, totalAmount: 1600, status: "EXPIRED" },
    ];
    res.json(sampleData);
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: "Internal error" });
  }
});

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ success: false, error: "Route not found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
