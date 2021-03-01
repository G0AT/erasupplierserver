const {ApolloServer} = require('apollo-server');
const typeDefs = require('./db/schema');
const resolvers = require('./db/resolvers');
const conectarDB = require('./config/db');
const jwt = require('jsonwebtoken');
require('dotenv').config({path: 'variables.env'});

//Conectar con la base de datos
conectarDB();

//Invocamos los valores de operaciones en el server
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req}) => {
        //console.log(req.headers['authorization']);
        const token = req.headers['authorization'] || '';

        if(token){
            try {
                const usuario = jwt.verify(token.replace('Bearer ', ''), process.env.SECRETA);

                return{
                    usuario
                }
            } catch (error) {
                console.log(error);
            }
        }
    }
});

//Definimos en que puerto se ejecuta apollo y se inicia
server.listen({port: process.env.PORT || 4000}).then(({url}) => {
    console.log(`Servidor funcionando en puerto: ${url}`)
})