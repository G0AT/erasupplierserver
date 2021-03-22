const {gql} = require('apollo-server');

const typeDefs = gql `
    type Usuario {
        id: ID
        nombre: String
        apellido: String
        email: String
        password: String
        estatus: String
        registro: String
    }

    type Almacen {
        id: ID
        nombreMaterial: String
        descripcionMaterial: String
        existenciaMaterial: Int
        maximoMaterial: Int
        codigoMaterial: String
        estatusMaterial: String
        creado: String
    }

    type Token {
        token: String
    }

    type Grupo {
        id: ID
        nombreGrupo: String
        codigoGrupo: String
    }

    type SubAlmacen {
        id: ID
        almacenados: [AlmacenGrupo]
        grupo: Grupo
        creador: ID
        estadoSubAlmacen: EstadoSubAlmacen
        creado: String
    }

    type AlmacenGrupo {
        id: ID
        cantidad: Int
        nombreMaterial: String
    }

    input UsuarioInput {
        nombre: String!
        apellido: String!
        email: String!
        password: String!
    }

    input UsuarioInternoInput {
        nombre: String!
        apellido: String!
        email: String!
        password: String!
        estatus: String!
    }

    input AutenticarInput {
        email: String!
        password: String!
    }

    input AlmacenInput {
        nombreMaterial: String!
        descripcionMaterial: String!
        existenciaMaterial: Int!
        maximoMaterial: Int!
        codigoMaterial: String!
    }

    input GrupoInput {
        nombreGrupo: String!
        codigoGrupo: String!
    }

    input SubAlmacenAlmacenInput {
        id: ID
        cantidad: Int
        nombreMaterial: String
    }

    input SubAlmacenInput {
        grupo: ID
        almacenados: [SubAlmacenAlmacenInput]
        estadoSubAlmacen: EstadoSubAlmacen
    }

    enum EstadoSubAlmacen {
        VIGENTE
        DESCONTINUADO
    }
    
    type Query {
        #Usuarios
        obtenerUsuario: Usuario
        obtenerUsuarios: [Usuario]
        obtenerUsuarioId(id: ID!): Usuario

        #Almacen
        obtenerAlmacen: [Almacen]
        obtenerAlmacenId(id: ID!): Almacen

        #Grupo
        obtenerGrupo: [Grupo]
        obtenerGrupoId(id: ID!): Grupo

        #SubAlmacen
        obtenerSubAlmacen: [SubAlmacen]
        obtenerSubAlmacenGrupo: [SubAlmacen]
        obtenerSubAlmacenId(id: ID!): SubAlmacen
        obtenerSubAlmacenEstado(estado: String!): [SubAlmacen]

        #Busquedas avanzadas
        buscarAlmacen(texto: String!): [Almacen]
    }

    type Mutation {
        # Usuario
        nuevoUsuario(input: UsuarioInput): Usuario
        nuevoUsuarioInterno(input: UsuarioInternoInput): Usuario
        autenticarUsuario(input: AutenticarInput): Token
        actualizarUsuario(id: ID!, input: UsuarioInternoInput): Usuario
        eliminarUsuario(id: ID!): String

        #Almacen
        nuevoAlmacen(input: AlmacenInput): Almacen
        actualizarAlmacen(id: ID!, input: AlmacenInput): Almacen
        eliminarAlmacen(id: ID!): String

        #Grupos
        nuevoGrupo(input: GrupoInput): Grupo
        actualizarGrupo(id: ID!, input: GrupoInput): Grupo
        eliminarGrupo(id: ID!): String

        #SubAlmacén
        nuevoSubAlmacen(input: SubAlmacenInput): SubAlmacen
        actualizarSubAlmacen(id: ID!, input: SubAlmacenInput): SubAlmacen
        eliminarSubAlmacen(id: ID!): String
    }
`;

module.exports = typeDefs;