const { http } = require('./backend/src/services/erpnext/client');

async function getPrintFormats() {
  try {
    const res = await http.get('/api/resource/Print Format', {
      params: {
        filters: JSON.stringify([['doc_type', '=', 'Sales Invoice']]),
        fields: JSON.stringify(['name'])
      }
    });
    console.log("Print Formats:", res.data.data);
  } catch (err) {
    console.error(err.message);
  }
}

getPrintFormats();
