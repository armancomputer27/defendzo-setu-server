const axios = require("axios");
require("dotenv").config();

const BASE = process.env.CASHFREE_BASE;
const CLIENT_ID = process.env.CASHFREE_CLIENT_ID;
const CLIENT_SECRET = process.env.CASHFREE_CLIENT_SECRET;

async function getCFToken() {
  const resp = await axios.post(`${BASE}/authorize`, {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET
  });
  return resp.data.data.token;
}

exports.sendPayout = async (dealer, amount) => {
  const token = await getCFToken();
  const resp = await axios.post(`${BASE}/payouts`, {
    amount,
    transferId: "TXN" + Date.now(),
    narration: "Dealer EMI Settlement",
    bankAccount: dealer.bank_account_no,
    ifsc: dealer.ifsc,
    name: dealer.name
  }, { headers: { Authorization: `Bearer ${token}` } });
  return resp;
};
