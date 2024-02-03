import express from 'express';
import { createListing, deleteListing, updateListing, getListing, getListings } from '../controllers/listing.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

const createGroup = async (req, res, next) => {
 try {
   const listing = await Listing.create(req.body);
   return res.status(201).json(listing);
 } catch (error) {
   next(error);
 }
};




router.post('/create', verifyToken, createGroup);




router.delete('/delete/:id', verifyToken, deleteListing);
router.post('/update/:id', verifyToken, updateListing);
router.get('/get/:id', getListing);
router.get('/get', getListings);

export default router;