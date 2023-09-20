import mongoose from 'mongoose'

//CONFIG MONGOOSE
const URI = 'mongodb+srv://leozembo:leandro@cluster0.aa0c2zk.mongodb.net/ecommerce?retryWrites=true&w=majority'
mongoose.connect(URI)
.then(()=> console.log('conectado a la base de datos'))
.catch((error) => {
    console.error('Error al conectar a la base de datos:', error);
});