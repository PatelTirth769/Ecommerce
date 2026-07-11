const { doc, setDoc, getDoc } = require('firebase/firestore');
const { db } = require('../config/firebase.config');

const saveSeller = async (req, res) => {
  try {
    const sellerData = req.body;
    console.log('Received request to save seller:', sellerData.email);

    if (!sellerData.email) {
      return res.status(400).json({ error: 'Email is required to save a seller.' });
    }

    // Add metadata for tracking
    const sellerDoc = {
      ...sellerData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save to Firestore 'ecommerce_system/metadata/sellers' collection
    // Using the seller's email as the document ID, with merge: true to avoid overwriting existing fields
    await setDoc(doc(db, 'ecommerce_system/metadata/sellers', sellerData.email), sellerDoc, { merge: true });

    res.status(200).json({ success: true, message: 'Seller saved successfully to Firebase.' });
  } catch (error) {
    console.error('Error saving seller to Firebase:', error);
    res.status(500).json({ error: 'Failed to save seller to database.' });
  }
};

const getSeller = async (req, res) => {
  try {
    const email = req.params.email;
    if (!email) {
      return res.status(400).json({ error: 'Email parameter is required.' });
    }

    const docRef = doc(db, 'ecommerce_system/metadata/sellers', email);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      res.status(200).json({ success: true, data: docSnap.data() });
    } else {
      res.status(404).json({ success: false, error: 'Seller not found in Firebase.' });
    }
  } catch (error) {
    console.error('Error fetching seller from Firebase:', error);
    res.status(500).json({ error: 'Failed to fetch seller from database.' });
  }
};

module.exports = {
  saveSeller,
  getSeller
};
