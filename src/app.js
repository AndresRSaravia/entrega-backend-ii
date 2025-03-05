import express from 'express';
import mongoose from 'mongoose';
import dotenv from "dotenv";
import handlebars from 'express-handlebars';
import methodOverride from 'method-override';
import __dirname from './utils.js';
import cartRouter from './routes/carts.router.js';
import productRouter from './routes/products.router.js';
import viewsRouter from './routes/views.router.js';
import path from 'path';

// Inicialización server
const app = express();

// Acceso al .env
dotenv.config();

// Inicialización de las variables de entorno
const URLMONGO = process.env.URLMONGO;
const PORT = process.env.PORT

// Conexión a la base de datos
console.log(URLMONGO)
mongoose.connect(URLMONGO)
    .then( () => console.log("Conexión a base de datos exitosa."))
    .catch( (error) => {
        console.error("Error en la conexión a la base de datos: ", error);
        process.exit();
    });

// Configuración para trabajar con json
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Configuración del motor de plantillas handlebars
app.engine('handlebars',handlebars.engine())
app.set('views',path.join(__dirname,'/views'))
app.set('view engine', 'handlebars')

// Configuración para archivos estáticos
app.use(express.static(path.join(__dirname,'/public')))

// Method Override
app.use(methodOverride('_method'));

// Configuración para routers
app.use('/',viewsRouter);
app.use('/api/carts',cartRouter);
app.use('/api/products',productRouter);

// Inicialización del servidor
app.listen(PORT, () => {
	console.log("Servidor inicializado. Escuchando.");
});