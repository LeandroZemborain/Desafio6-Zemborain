import { Router } from "express";
import { productManagerInstance } from '../managers/ProductsMongo.js';


const router = Router()

// router.get('/', async (req, res) => {
//   try {
//     const products = await productManagerInstance.findAll(req.query)
//     // if (products.length) {
//     //   res.status(200).json({ message: 'products', products })
//     // } else {
//     //   res.status(200).json({ message: 'No products found' })
//     // }
//     res.status(200).json({ products })
//   } catch (error) {
//     res.status(500).json({ error })
//   }
// })
router.get('/', async (req, res) => {
  try {
    const { limit = 10, page = 1, query, sort } = req.query;

    let queryOptions = {};
    if (query) {
      queryOptions = {
        $or: [
          { title: { $regex: query, $options: 'i' } }, 
          { category: { $regex: query, $options: 'i' } }, 
        ],
      };
    }

    const sortOptions = {};
    if (sort === 'asc') {
      sortOptions.price = 1; 
    } else if (sort === 'desc') {
      sortOptions.price = -1; 
    }

    const result = await productManagerInstance.findAll(queryOptions, sortOptions, limit, page);

    const response = {
      status: 'success',
      payload: result.docs, 
      totalPages: result.totalPages,
      prevPage: result.hasPrevPage ? result.prevPage : null,
      nextPage: result.hasNextPage ? result.nextPage : null,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? `/api/products?limit=${limit}&page=${result.prevPage}&query=${query}&sort=${sort}` : null,
      nextLink: result.hasNextPage ? `/api/products?limit=${limit}&page=${result.nextPage}&query=${query}&sort=${sort}` : null,
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener listado de productos' });
  }
});

router.get('/:pid', async (req, res) => {
  const { id } = req.params.pid
  try {
    const product = await productManagerInstance.findById(id)
    if (!product) {
      res.status(400).json({ message: 'Invalid ID' })
    } else {
      res.status(200).json({ message: 'product found', product })
    }
  } catch (error) {
    res.status(500).json({ error })
  }
})

router.post('/', async (req, res) => {
  const { title, description, price, thumbnail, code, stock, category, status } = req.body
  if (!title || !description || !price || !thumbnail || !code || !stock || !category ) {
    return res.status(400).json({ message: 'Some data is missing' })
  }
  try {
    const newProduct = await productManagerInstance.createOne(req.body)
    res.status(200).json({ message: 'New product', newProduct })
  } catch (error) {
    res.status(500).json({ error })
  }
})



router.put('/:pid', async (req, res) => {
  const productId = req.params.pid; 
  const updatedFields = req.body; 
  await productManagerInstance.updateOne(productId, updatedFields);
  res.json({ message: 'Producto actualizado exitosamente' });
});


router.delete('/:pid', async (req, res) => {
  const productId = req.params.pid; 
  await productManagerInstance.deleteOne(productId);
  res.json({ message: 'Producto eliminado exitosamente' });
});




////// Agregar 5000 usuarios en la bd
// const path = __dirname+'/Students.json'
// router.get('/add',async (req,res)=>{
//   const usersData = await fs.promises.readFile(path,'utf-8')
//   console.log('products',usersData);
//   await productManagerInstance.add(JSON.parse(usersData))
//   res.json({message:'products added'})
// })

// router.get('/',async(req,res)=>{
//   const obj = {first_name:'Wren'}
//   const product = await productManagerInstance.findOne(obj)
//   res.json({product})
// })

export default router