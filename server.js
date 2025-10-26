// ✅ DEFENDZO SETU SERVER (Final)
// --------------------------------

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// ✅ Health check route
app.get("/", (req, res) => {
  res.send("✅ Defendzo Setu Server Running");
});

// ✅ Mandate creation route (main API)
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

    // Validation
    if (!customerName || !customerMobile || !amount || !startDate) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
      });
    }

    console.log("📥 New Mandate Request from Dealer:", dealerId);
    console.log(req.body);

    // 🔹 Simulated Mandate link (in production this will be Setu / NPCI / Razorpay link)
    const fakeAuthorizationUrl = `https://demo.setu.co.in/emandate/${Date.now()}`;

    // Response back to Android app
    return res.status(200).json({
      success: true,
      authorizationUrl: fakeAuthorizationUrl,
      message: "Mandate link created successfully",
    });
  } catch (err) {
    console.error("❌ Mandate creation failed:", err);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
});

// ✅ Fetch Mandates (for Mandate List)
app.get("/dealer/:dealerId/mandates", async (req, res) => {
  try {
    const { dealerId } = req.params;

    // Simulated sample list
    const fakeMandates = [
      {
        id: "MD001",
        customerName: "Ravi Kumar",
        amount: 500,
        totalAmount: 1500,
        status: "ACTIVE",
      },
      {
        id: "MD002",
        customerName: "Anjali Singh",
        amount: 1200,
        totalAmount: 1200,
        status: "FINISHED",
      },
      {
        id: "MD003",
        customerName: "Amit Sharma",
        amount: 800,
        totalAmount: 1600,
        status: "EXPIRED",
      },
    ];

    res.json(fakeMandates);
  } catch (error) {
    console.error("❌ Fetch mandates failed:", error);
    res.status(500).json({ success: false, error: "Internal error" });
  }
});

// ✅ Default error handling
app.use((req, res) => {
  res.status(404).json({ success: false, error: "Route not found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
