// Product Management API Endpoint for RUHI PERFUMES
const { connectToDatabase } = require('../lib/db');
const { verifyAdminSession } = require('../lib/auth');
const { ObjectId } = require('mongodb');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('products');

    // ----------------------------------------------------
    // GET: Retrieve Products
    // ----------------------------------------------------
    if (req.method === 'GET') {
      const { id, admin } = req.query;

      if (id) {
        if (!ObjectId.isValid(id)) {
          return res.status(400).json({ error: 'Invalid product ID format.' });
        }
        const product = await collection.findOne({ _id: new ObjectId(id) });
        if (!product) {
          return res.status(404).json({ error: 'Product not found.' });
        }
        return res.status(200).json(product);
      }

      const isAdminRequest = admin === 'true' && verifyAdminSession(req);
      const filter = isAdminRequest ? {} : { isActive: { $ne: false } };

      const products = await collection.find(filter).sort({ displayOrder: 1, createdAt: -1 }).toArray();
      return res.status(200).json(products);
    }

    // ----------------------------------------------------
    // AUTH CHECK FOR WRITE OPERATIONS (POST, PUT, DELETE)
    // ----------------------------------------------------
    const isAdmin = verifyAdminSession(req);
    if (!isAdmin) {
      return res.status(401).json({ error: 'Unauthorized: Admin session required for product modifications.' });
    }

    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) {}
    }
    body = body || {};

    // ----------------------------------------------------
    // POST: Create New Product
    // ----------------------------------------------------
    if (req.method === 'POST') {
      const { productName, description, sizeML, family, personality, notesPyramid, imageUrl, cloudinaryPublicId, displayOrder, isActive } = body;

      if (!productName || !description) {
        return res.status(400).json({ error: 'Product Name and Description are required.' });
      }

      const newProduct = {
        productName: productName.trim(),
        slug: productName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        description: description.trim(),
        sizeML: sizeML ? sizeML.trim() : '8ML',
        family: family ? family.trim() : 'WOODY AMBER',
        personality: personality ? personality.trim() : 'Deep • Dark • Sophisticated',
        notesPyramid: notesPyramid || { top: '', heart: '', base: '' },
        imageUrl: imageUrl || '',
        cloudinaryPublicId: cloudinaryPublicId || '',
        displayOrder: displayOrder !== undefined ? parseInt(displayOrder, 10) : 1,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await collection.insertOne(newProduct);
      newProduct._id = result.insertedId;

      return res.status(201).json({ success: true, message: 'Product created successfully.', product: newProduct });
    }

    // ----------------------------------------------------
    // PUT: Update Existing Product
    // ----------------------------------------------------
    if (req.method === 'PUT') {
      const { id, _id } = body;
      const targetId = id || _id;

      if (!targetId || !ObjectId.isValid(targetId)) {
        return res.status(400).json({ error: 'Valid Product ID is required for update.' });
      }

      const existingProduct = await collection.findOne({ _id: new ObjectId(targetId) });
      if (!existingProduct) {
        return res.status(404).json({ error: 'Product not found.' });
      }

      // If replacing image and old public ID exists, delete old image from Cloudinary
      if (body.cloudinaryPublicId && existingProduct.cloudinaryPublicId && body.cloudinaryPublicId !== existingProduct.cloudinaryPublicId) {
        try {
          await cloudinary.uploader.destroy(existingProduct.cloudinaryPublicId);
        } catch (destroyErr) {
          console.warn('Warning: Could not delete old Cloudinary image:', destroyErr);
        }
      }

      const updateFields = {
        updatedAt: new Date(),
      };

      if (body.productName !== undefined) {
        updateFields.productName = body.productName.trim();
        updateFields.slug = body.productName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      }
      if (body.description !== undefined) updateFields.description = body.description.trim();
      if (body.sizeML !== undefined) updateFields.sizeML = body.sizeML.trim();
      if (body.family !== undefined) updateFields.family = body.family.trim();
      if (body.personality !== undefined) updateFields.personality = body.personality.trim();
      if (body.notesPyramid !== undefined) updateFields.notesPyramid = body.notesPyramid;
      if (body.imageUrl !== undefined) updateFields.imageUrl = body.imageUrl;
      if (body.cloudinaryPublicId !== undefined) updateFields.cloudinaryPublicId = body.cloudinaryPublicId;
      if (body.displayOrder !== undefined) updateFields.displayOrder = parseInt(body.displayOrder, 10);
      if (body.isActive !== undefined) updateFields.isActive = Boolean(body.isActive);

      await collection.updateOne({ _id: new ObjectId(targetId) }, { $set: updateFields });

      const updatedProduct = await collection.findOne({ _id: new ObjectId(targetId) });
      return res.status(200).json({ success: true, message: 'Product updated successfully.', product: updatedProduct });
    }

    // ----------------------------------------------------
    // DELETE: Remove Product
    // ----------------------------------------------------
    if (req.method === 'DELETE') {
      const id = req.query.id || body.id || body._id;

      if (!id || !ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Valid Product ID is required for deletion.' });
      }

      const productToDelete = await collection.findOne({ _id: new ObjectId(id) });
      if (!productToDelete) {
        return res.status(404).json({ error: 'Product not found.' });
      }

      // Delete Cloudinary image if present
      if (productToDelete.cloudinaryPublicId) {
        try {
          await cloudinary.uploader.destroy(productToDelete.cloudinaryPublicId);
        } catch (cloudinaryErr) {
          console.warn('Warning: Failed to delete Cloudinary image during product removal:', cloudinaryErr);
        }
      }

      await collection.deleteOne({ _id: new ObjectId(id) });
      return res.status(200).json({ success: true, message: `Product ${productToDelete.productName} deleted successfully.` });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Products API Exception:', err);
    return res.status(500).json({ error: 'Internal server error processing products request.', details: err.message });
  }
};
