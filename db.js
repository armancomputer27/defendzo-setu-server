let mandates = {};
let dealers = {
  D001: { name: "Manas Mobile Store", bank_account_no: "1234567890", ifsc: "HDFC0001234" },
  D002: { name: "Arman Telecom", bank_account_no: "2223334445", ifsc: "ICIC0005678" }
};

exports.initDB = () => console.log("🗄️ DB initialized");
exports.saveMandate = (id, dealerId, amount, status) => {
  mandates[id] = { id, dealerId, amount, status };
};
exports.updateMandate = (id, status) => {
  if (mandates[id]) mandates[id].status = status;
};
exports.getDealer = async (id) => dealers[id];
