const mongoose = require('mongoose');
require('dotenv').config({path: 'variables.env'});

const conectarDB = async () => {
    try {
        await mongoose.connect(process.env.DB_MONGO, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
        console.log('Base de datos conectada')
    } catch (error) {
        console.log('Error al conectar con la base de datos');
        console.log(error);
        process.exit(1);//Detenemos la app si falla la conexión
    }
}

module.exports = conectarDB;