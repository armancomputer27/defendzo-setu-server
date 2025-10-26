require("dotenv").config();
const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const { initDB, saveMandate, updateMandate, getDealer } = require("./db");
const { sendPayout } = require("./payouts");

const app = express();
app.use(bodyParser.json());
initDB();

const PORT = process.env.PORT || 3000;
const SETU_BASE = process.env.SETU_BASE;
const CLIENT_ID = process.env.SETU_CLIENT_ID;
const CLIENT_SECRET = process.env.SETU_CLIENT_SECRET;
const ORG_ID = process.env.SETU_ORG_ID;

async function getAccessToken() {
  const resp = await axios.post(`${SETU_BASE}/auth/token`, {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    grant_type: "client_credentials"
  }, { headers: { "Content-Type": "application/json" }});
  return resp.data.access_token;
}

app.get("/", (req, res) => res.send("✅ Defendzo Setu Server Running"));

app.post("/dealer/:dealerId/create-mandate", async (req, res) => {
  try {
    const dealerId = req.params.dealerId;
    const { customerName, customerMobile, amount, frequency } = req.body;
    if (!customerName || !customerMobile || !amount)
      return res.status(400).json({ error: "Missing required fields" });

    const token = await getAccessToken();
    const payload = {
      orgId: ORG_ID,
      payer: { name: customerName, phone: customerMobile },
      amount: { currencyCode: "INR", value: amount },
      frequency: frequency || "MONTHLY",
      purpose: "EMI Collection",
      metadata: { dealer_id: dealerId },
      callbackUrl: "https://your-render-app.onrender.com/webhook/setu"
    };

    const resp = await axios.post(`${SETU_BASE}/mandates/initiate`, payload, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    });

    await saveMandate(resp.data.mandateId, dealerId, amount, "PENDING");
    res.json({
      success: true,
      authorizationUrl: resp.data.authorizationUrl || resp.data.url
    });
  } catch (err) {
    console.error("Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Setu API error" });
  }
});

app.post("/webhook/setu", async (req, res) => {
  console.log("📩 Webhook from Setu:", req.body);
  const event = req.body.event;
  const data = req.body.data;

  if (event === "mandate.active") {
    await updateMandate(data.mandateId, "ACTIVE");
  }

  if (event === "debit.success") {
    const dealer = await getDealer(data.dealer_id);
    if (dealer) {
      const payoutAmount = data.amount - 10;
      const payoutResp = await sendPayout(dealer, payoutAmount);
      console.log("💸 Payout result:", payoutResp.data);
    }
  }

  res.status(200).send("OK");
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
