import express from 'express';
 import {
   getGiftCardsByVendedor,
   createGiftCard,
   updateGiftCard,
   deleteGiftCard
 } from '../controllers/giftCardController.js';
 
 const router = express.Router();
 
 router.get('/:vendedorId', getGiftCardsByVendedor);
 router.post('/', createGiftCard);
 router.put('/:id', updateGiftCard);
 router.delete('/:id', deleteGiftCard);
 
 export default router; 