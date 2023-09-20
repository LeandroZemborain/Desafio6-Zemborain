import { Router } from "express";
import { cartsMongo } from "../managers/CartsMongo.js";

const router = Router()

router.get('/',async(req,res)=>{
  try {
      const carts = await cartsMongo.findAll()
      res.status(200).json({ message: 'cart found', carts })
  } catch (error) {
      res.status(500).json({ error })
  }
})

router.get('/:cid',async(req,res)=>{
  const {id} = req.params
  try {
      const cart = await cartsMongo.findById(id)
  if (!cart) {
    res.status(400).json({ message: 'Invalid ID' })
  } else {
    res.status(200).json({ message: 'cart found', cart })
  }
  } catch (error) {
      res.status(500).json({ error })
  }
})

// router.post('/', async (req, res) => {
//   const newCart = await cartsMongo.createOne();
//   res.status(201).json(newCart);
// });
router.post('/', async (req,res)=>{
  const {prod} = req.body
  // if(!prod){
  //     return res.status(400).json({ message: 'Some data is missing' })
  // }
  try {
      const newCart = await cartsMongo.createOne(req.body)
      res.status(200).json({ message: 'cart created', cart: newCart })
  } catch (error) {
      res.status(500).json({ error })
  }
})

router.post("/:cid/product/:pid", async (req, res) => {
  let cid = req.params.cid
  let pid = req.params.pid
  try{
  if(cid.length!=24){
      res.status(400).json({mesage:"Put a correct Cart Id"})
      return
  }if(pid.length!=24){
      res.status(400).json({mesage:"Put a correct Prod Id"})
      return
  }
  const cartUpdate = await cartsMongo.updateOne(cid,pid)
  if(cartUpdate=="cart update"){res.status(200).json({mesage:cartUpdate})  }
  else{
      res.status(400).json({mesage:cartUpdate})
  }
   }
  catch (error){ res.status(500).json({ error }) }
})

// router.delete("/:cid", async (req, res) => {
//   let cid = req.params.cid
//   if(cid.length!=24){
//    res.status(400).json({mesage:"Put a correct Id"})
//    return
//   }
//   try{
//    const del = await cartsMongo.deleteOne(cid)
//    if(!del || del.name== "CastError"){
//        res.status(400).json({mesage:`no exist a cart whith id ${cid}`})
//    }else {res.status(200).json({mesage:"cart deleted"})}
//   }
//   catch (error){ res.status(500).json({ error }) }
// })
router.delete('/:cid', async (req, res) => {
  const cartId = req.params.cid;

  try {
    const cart = await cartsMongo.clearCart(cartId);
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar todos los productos del carrito' });
  }
});

router.delete('/:cid/product/:pid',async(req,res)=>{
  const {idCart,idProduct} = req.params
  try {
      await cartsMongo.deleteProduct(idCart,idProduct)
      res.status(200).json({ message: 'Success' })
  } catch (error) {
      res.status(500).json({ error })
  }
})
 
router.put('/:cid', async (req, res) => {
  const cartId = req.params.cid;
  const newProducts = req.body.products;

  try {
    console.log(' Nuevos productos recibidos:', newProducts);
    
    const cart = await cartsMongo.updateCart(cartId, newProducts);

    console.log('Carrito actualizado:', cart);
    res.json(cart);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al actualizar el carrito' });
  }
});
router.put('/:cid/product/:pid', async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const newQuantity = req.body.quantity;

  try {
    const cart = await cartsMongo.updateProductQuantity(cartId, productId, newQuantity);
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la cantidad del producto en el carrito' });
  }
});
export default router