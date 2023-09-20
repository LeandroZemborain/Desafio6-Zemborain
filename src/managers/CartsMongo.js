import Cart from '../db/models/carts.model.js';

class CartsMongo {
  async findAll() {
    try {
      const products = await Cart.find({lean:true})
      return products
    } catch (error) {
      return error
    }
  }
  async createOne(obj){
    try {
        const newCart = await Cart.create(obj);
        return newCart;
    } catch (error) {
        return error;
    }
}
  async findById(id) {
    try {
      const product = await Cart.findById(id).populate('products')
      return product
    } catch (error) {
      return error
    }
  }
  async updateOne(id, obj) {
    try {
      const response = await Cart.updateOne({ _id: id }, { ...obj })
      return response
    } catch (error) {
      return error
    }
  }
  async deleteOne(id) {
    try {
      const response = await Cart.findByIdAndDelete(id)
      return response
    } catch (error) {
      return error
    }
  }
  async deleteProduct(idCart,idProduct){
    try {
        const cart = await Cart.findById(idCart)
        if(!cart) throw new Error('product not found')
        
        const response = await Cart.updateOne({_id:idCart},{$pull:{product:idProduct}})
      return response



    } catch (error) {
      return error
    }
  }
  async saveCart(cart) {
    try {
      await cart.save();
      console.log('Se guardó el carrito');
      return cart;
    } catch (error) {
      throw new Error('Error al guardar el carrito: ' + error.message);
    }
  }
  async updateProductQuantity(cartId, productId, newQuantity) {
    const cart = await this.findById(cartId);
    const product = cart.products.find(p => p.product.equals(productId));
    if (product) {
      product.quantity = newQuantity;
    }
    
    if (product) {

      product.quantity += quantity || 1;  

} else {

  cart.products.push({ product: productId, quantity: quantity || 1 });

}
    try {
      await this.saveCart(cart);
      console.log(`Cantidad del producto actualizada en el carrito ${cartId}`);
    } catch (error) {
      throw new Error('Error al guardar el carrito: ' + error.message);
    }

    return cart;
  }
  async updateCart(cartId, newProducts) {
    try {
      console.log(`Actualizando el carrito ${cartId}`);
      const cart = await this.findById(cartId);
      
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }
      
      if (!Array.isArray(newProducts)) {
        throw new Error("Invalid products data");
      }
      
      newProducts.forEach((newProduct) => {
        const existingProduct = cart.products.find(
          (product) => product.product.toString() === newProduct.product
        );
        
        if (existingProduct) {
          existingProduct.quantity += newProduct.quantity;
        } else {
          cart.products.push(newProduct);
        }
      });
      
      await this.saveCart(cart);
      console.log(`El carrito ${cartId} fue actualizado con los nuevos productos`);
      return cart;

      } catch (error) {
      console.error("Error al actualizar el carrito:", error);
      throw new Error("Error al actualizar el carrito: " + error.message);
      }
  }
  async clearCart(cartId) {
    const cart = await this.findById(cartId);
    cart.products = [];

    try {
      await this.saveCart(cart);
      console.log(`Carrito vaciado ${cartId}`);
    } catch (error) {
      throw new Error('Error al guardar el carrito: ' + error.message);
    }

    return cart;
  }
  
}
export const cartsMongo = new CartsMongo()