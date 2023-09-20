import { productModel } from "../db/models/products.model.js";

class ProductsMongo {
  // async findAll(obj) {
  //   const {limit,page,sortPrice,lean, ...query} = obj
  //   try {
  //     const result = await productModel.paginate(
  //       limit,page,{price:sortPrice},{lean:true}, query)
  //     const info = {
  //       status: 'success',
  //       payload: result.docs, 
  //       totalPages: result.totalPages,
  //       prevPage: result.hasPrevPage ? result.prevPage : null,
  //       nextPage: result.hasNextPage ? result.nextPage : null,
  //       page: result.page,
  //       hasPrevPage: result.hasPrevPage,
  //       hasNextPage: result.hasNextPage,
  //       prevLink: result.hasPrevPage ? `/api/products?limit=${limit}&page=${result.prevPage}&query=${query}&sort=${sort}` : null,
  //       nextLink: result.hasNextPage ? `/api/products?limit=${limit}&page=${result.nextPage}&query=${query}&sort=${sort}` : null,
  //     }
  //     //console.log(result.docs);
  //     return info
  //   } catch (error) {
  //     return error
  //   }
  // }
  async findAll(queryOptions = {}, sortOptions = {}, limit = 10, page = 1) {
    const options = {
      sort: sortOptions,
      page: page,
      limit: limit,
      lean: true,
    };

    const result = await productModel.paginate(queryOptions, options);
    return result;
  }

  async createOne(obj) {
    try {
      const newProd = await productModel.create(obj)
      return newProd
      // const newProduct = new productModel(obj);
      // await newProduct.save();
      // console.log(newProduct);
      // return newProduct;
    } catch (error) {
      return  error
    }
  }

  async findById(id) {
    try {
      const product = await productModel.findById(id)
      return product
    } catch (error) {
      return error
    }
  }

  async updateOne(id, obj) {
    try {
      const response = await productModel.updateOne({ _id: id }, { ...obj })
      return response
    } catch (error) {
      return error
    }
  }

  async deleteOne(id) {
    try {
      const response = await productModel.findByIdAndDelete(id)
      return response
    } catch (error) {
      return error
    }
  }

  // async add(product) {
  //   try {
  //     await productModel.create(product)
  //     return 'product added'
  //   } catch (error) {
  //     return error
  //   }
  // }

  // async findOne(obj) {
  //   try {
  //     const product = await productModel.findOne(obj).explain('executionStats')
  //     console.log(product)
  //     return product
  //   } catch (error) {
  //     return error
  //   }
  // }
}

export const productManagerInstance = new ProductsMongo()