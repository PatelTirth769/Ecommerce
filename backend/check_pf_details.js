const { http } = require('./src/services/erpnext/client');

async function checkPfs() {
  const p1 = await http.get('/api/resource/Print Format/new sales 24x7 invoice');
  const p2 = await http.get('/api/resource/Print Format/Sales24x7 Invoice');
  console.log("new sales 24x7 invoice created at:", p1.data.data.creation);
  console.log("Sales24x7 Invoice created at:", p2.data.data.creation);
}

checkPfs();
