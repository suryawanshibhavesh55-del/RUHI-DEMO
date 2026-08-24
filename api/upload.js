// Cloudinary Image Upload Handler for RUHI PERFUMES Admin
const cloudinary = require('cloudinary').v2;
const { verifyAdminSession } = require('../lib/auth');
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Security Verification
  if (!verifyAdminSession(req)) {
    return res.status(401).json({ error: 'Unauthorized: Admin authentication required.' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) {}
    }

    const { image, folder } = body || {};

    if (!image) {
      return res.status(400).json({ error: 'No image data provided for upload.' });
    }

    const targetFolder = folder || 'ruhi-perfumes/products';

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(image, {
      folder: targetFolder,
      resource_type: 'auto',
      quality: 'auto:best',
      fetch_format: 'auto',
    });

    return res.status(200).json({
      success: true,
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
    });
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    return res.status(500).json({ error: 'Failed to upload image to Cloudinary.', details: err.message });
  }
};
