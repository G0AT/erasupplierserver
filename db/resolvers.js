const Usuario = require('../models/Usuario');
const Almacen = require('../models/Almacen');
const Grupo = require('../models/Grupo');
const SubAlmacen = require('../models/SubAlmacen');

const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variables.env' });


const crearToken = (usuario, secreta, expiresIn) => {
    // console.log(usuario);
    const { id, email, nombre, apellido } = usuario;

    return jwt.sign( { id, email, nombre, apellido }, secreta, { expiresIn } )
}

// Resolvers
const resolvers = {
    Query: {
        obtenerUsuario: async (_, {}, ctx) => {
            return ctx.usuario;
        }, 
        obtenerUsuarios: async () => {
            try {
                const usuario = await Usuario.find({});
                return usuario;
            } catch (error) {
                console.log(error);
            }
        },
        obtenerUsuarioId: async (_, { id }) => {
            // revisar si el producto existe o no
            const usuario = await Usuario.findById(id);

            if(!usuario) {
                throw new Error('Usuario no encontrado');
            }

            return usuario;
        }, 
        obtenerAlmacen: async () => {
            try {
                const almacen = await Almacen.find({});
                return almacen;
            } catch (error) {
                console.log(error);
            }
        }, 
        obtenerAlmacenId: async (_, { id }) => {
            // revisar si el material existe existe en almacén o no
            const almacen = await Almacen.findById(id);

            if(!almacen) {
                throw new Error('Material no encontrado');
            }

            return almacen;
        },
        obtenerGrupo: async () => {
            try {
                const grupo = await Grupo.find({});
                return grupo;
            } catch (error) {
                console.log(error);
            }
        },         
        obtenerGrupoId: async (_, { id }) => {
            // Revisar si el grupo existe o no
            const grupo = await Grupo.findById(id);

            if(!grupo) {
                throw new Error('Grupo no encontrado');
            }

            return grupo;
        }, 
        obtenerSubAlmacen: async () => {
            try {
                const subAlmacen = await SubAlmacen.find({}).populate('grupo');
                //console.log(subAlmacen);
                return subAlmacen;
            } catch (error) {
                console.log(error);
            }
        },
        obtenerSubAlmacenId: async(_, {id}) => {
            // Si el subAlmacen existe o no
            const subAlmacen = await SubAlmacen.findById(id);
            if(!subAlmacen) {
                throw new Error('Sub Almacén no encontrado');
            }

            // retornar el resultado
            return subAlmacen;
        }, 
        obtenerSubAlmacenEstado: async (_, { estadoMaterial }) => {
            //Esto se añade antes del estado para validar si se desea ajustar a que solo el creador lo vea
            const subAlmacen = await SubAlmacen.find({ estadoMaterial });

            return subAlmacen;
        },
        buscarAlmacen: async(_, { texto }) => {
            const almacen = await Almacen.find({ $text: { $search: texto  } }).limit(10);
            
            return almacen;
        }
    }, 
    Mutation: {
        nuevoUsuario: async (_, { input } ) => {
            const { email, password } = input;
            
            // Revisar si el usuario ya esta registrado
            const existeUsuario = await Usuario.findOne({email});
            if (existeUsuario) {
                throw new Error('El usuario ya esta registrado');
            }

            // Hashear su password
            const salt = await bcryptjs.genSalt(10);
            input.password = await bcryptjs.hash(password, salt);

            try {
                 // Guardarlo en la base de datos
                const usuario = new Usuario(input);
                usuario.save(); // guardarlo
                return usuario;
            } catch (error) {
                console.log(error);
            }
        },
        nuevoUsuarioInterno: async (_, { input } ) => {
            const { email, password } = input;
            
            // Revisar si el usuario ya esta registrado
            const existeUsuario = await Usuario.findOne({email});
            if (existeUsuario) {
                throw new Error('El usuario ya esta registrado');
            }

            // Hashear su password
            const salt = await bcryptjs.genSalt(10);
            input.password = await bcryptjs.hash(password, salt);

            try {
                 // Guardarlo en la base de datos
                const usuario = new Usuario(input);
                usuario.save(); // guardarlo
                return usuario;
            } catch (error) {
                console.log(error);
            }
        },
        actualizarUsuario: async (_, {id, input}) => {
            // revisar si el usuario existe o no
            let usuario = await Usuario.findById(id);

            if(!usuario) {
                throw new Error('Usuario no encontrado');
            }

            // guardarlo en la base de datos
            usuario = await Usuario.findOneAndUpdate({ _id : id }, input, { new: true } );

            return usuario;
        }, 
        eliminarUsuario: async(_, {id}) => {
            // revisar si el usuario existe o no
            let usuario = await Usuario.findById(id);

            if(!usuario) {
                throw new Error('Usuario no encontrado');
            }

            // Eliminar
            await Usuario.findOneAndDelete({_id :  id});

            return "Usuario eliminado correctamente";
        },
        autenticarUsuario: async (_, {input}) => {

            const { email, password } = input;

            // Si el usuario existe
            const existeUsuario = await Usuario.findOne({email});
            if (!existeUsuario) {
                throw new Error('El usuario o la contraseña son incorrectos');
            }

            if(existeUsuario.estatus === 'I'){
                throw new Error('Su cuenta está inactiva, comuniquese con el administrador');
            }

            // Revisar si el password es correcto
            const passwordCorrecto = await bcryptjs.compare( password, existeUsuario.password );
            if(!passwordCorrecto) {
                throw new Error('El usuario o la contraseña son incorrectos');
            }

            // Crear el token
            return {
                token: crearToken(existeUsuario, process.env.SECRETA, '8h' ) 
            }
            
        },
        nuevoAlmacen: async (_, {input}) => {
            try {
                const almacen = new Almacen(input);

                // almacenar en la bd
                const resultado = await almacen.save();

                return resultado;
            } catch (error) {
                console.log(error);
            }
        }, 
        actualizarAlmacen: async (_, {id, input}) => {
            // revisar si el material en almacén existe o no
            let almacen = await Almacen.findById(id);

            if(!almacen) {
                throw new Error('Producto no encontrado');
            }

            // guardarlo en la base de datos
            almacen = await Almacen.findOneAndUpdate({ _id : id }, input, { new: true } );

            return almacen;
        }, 
        eliminarAlmacen: async(_, {id}) => {
            // revisar si el material existe o no
            let almacen = await Almacen.findById(id);

            if(!almacen) {
                throw new Error('Producto no encontrado');
            }

            // Eliminar
            await Almacen.findOneAndDelete({_id :  id});

            return "Material eliminado del almacén";
        },
        nuevoGrupo: async (_, { input }, ctx) => {

            //console.log(ctx);

            const { codigoGrupo } = input
            // console.log(input);
            
            // Verificar si el grupo ya esta registrado
            const grupo = await Grupo.findOne({ codigoGrupo });
            if(grupo) {
                throw new Error('El grupo ya está registrado');
            }

            const nuevoGrupo = new Grupo(input);

            // asignar el vendedor
            nuevoGrupo.creador = ctx.usuario.id;

            // guardarlo en la base de datos

            try {
                const resultado = await nuevoGrupo.save();
                return resultado;
            } catch (error) {
                console.log(error);
            }
        },
        actualizarGrupo: async (_, {id, input}, ctx) => {
            // Verificar si existe o no
            let grupo = await Grupo.findById(id);

            if(!grupo) {
                throw new Error('El grupo no existe');
            }

            // Verificar si el vendedor es quien edita
            // if(grupo.creador.toString() !== ctx.usuario.id ) {
            //     throw new Error('No tienes las credenciales');
            // }

            // guardar el grupo
            grupo = await Grupo.findOneAndUpdate({_id : id}, input, {new: true} );
            return grupo;
        },
        eliminarGrupo : async (_, {id}, ctx) => {
            // Verificar si existe o no
            let grupo = await Grupo.findById(id);

            if(!grupo) {
                throw new Error('El grupo no existe');
            }

            // Verificar si el creador es quien edita
            // if(grupo.creador.toString() !== ctx.usuario.id ) {
            //     throw new Error('No tienes las credenciales');
            // }

            // Eliminar Grupo
            await Grupo.findOneAndDelete({_id : id});
            return "Grupo Eliminado"
        },
        nuevoSubAlmacen: async (_, {input}, ctx) => {
            const { grupo } = input
            //console.log(grupo)

            // Verificar si existe o no
            const grupoExiste = await Grupo.findById(grupo);

            if(!grupoExiste) {
                throw new Error('El grupo no existe');
            }

            // Verificar si el creador es dueño
            // if(grupoExiste.creador.toString() !== ctx.usuario.id ) {
            //     throw new Error('No tienes las credenciales');
            // }

            // Revisar que el stock este disponible
            for await ( const articulo of input.almacenados ) {
                const { id } = articulo;
                //console.log(id)
                
                const almacen = await Almacen.findById(id);

                if(articulo.cantidad > almacen.existenciaMaterial) {
                    throw new Error(`El articulo: ${almacen.nombreMaterial} excede la cantidad disponible`);
                } else {
                    // Restar la cantidad a lo disponible
                    almacen.existenciaMaterial = almacen.existenciaMaterial - articulo.cantidad;

                    await almacen.save();
                }
            }

            // Crear un nuevo sub almacén
            const nuevoSubAlmacen = new SubAlmacen(input);
            // asignarle un creador
            nuevoSubAlmacen.creador = ctx.usuario.id;

            // Guardarlo en la base de datos
            const resultado = await nuevoSubAlmacen.save();
            return resultado;
        },
        actualizarSubAlmacen: async(_, {id, input}, ctx) => {

            const { grupo } = input;

            // Si el subalmacén existe
            const existeSubAlmacen = await SubAlmacen.findById(id);
            if(!existeSubAlmacen) {
                throw new Error('El pedido no existe');
            }

            // Si el subalmacén existe
            const existeGrupo = await Grupo.findById(grupo);
            if(!existeGrupo) {
                throw new Error('El Cliente no existe');
            }

            // Si el cliente y pedido pertenece al vendedor
            // if(existeGrupo.creador.toString() !== ctx.usuario.id ) {
            //     throw new Error('No tienes las credenciales');
            // }

            // Revisar el stock
            if( input.subAlmacen ) {
                for await ( const articulo of input.subAlmacen ) {
                    const { id } = articulo;
    
                    const almacen = await Almacen.findById(id);
    
                    if(articulo.cantidad > almacen.existenciaMaterial) {
                        throw new Error(`El articulo: ${almacen.nombreMaterial} excede la cantidad disponible`);
                    } else {
                        // Restar la cantidad a lo disponible
                        almacen.existenciaMaterial = almacen.existenciaMaterial - articulo.cantidad;
    
                        await almacen.save();
                    }
                }
            }

            // Guardar el pedido
            const resultado = await SubAlmacen.findOneAndUpdate({_id: id}, input, { new: true });
            return resultado;

        },
        eliminarSubAlmacen: async (_, {id}, ctx) => {
            // Verificar si el subAlmacen existe o no
            const subAlmacen = await SubAlmacen.findById(id);
            if(!subAlmacen) {
                throw new Error('El subAlmacen no existe')
            }

            // verificar si el vendedor es quien lo borra
            // if(subAlmacen.creador.toString() !== ctx.usuario.id ) {
            //     throw new Error('No tienes las credenciales')
            // }

            // eliminar de la base de datos
            await SubAlmacen.findOneAndDelete({_id: id});
            return "Sub Almacén Eliminado"
        }
    }
}

module.exports = resolvers;