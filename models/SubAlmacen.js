const mongoose = require('mongoose');

const SubAlmacenSchema = mongoose.Schema({
    almacenados:{
        type: Array,
        required: true
    },
    estadoSubAlmacen:{
        type: String,
        required: true,
        default: "VIGENTE"
    },
    grupo:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Grupo',
        unique:true
    },
    creador:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    creado: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('SubAlmacen', SubAlmacenSchema);