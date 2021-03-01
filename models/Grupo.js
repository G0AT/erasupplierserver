const mongoose = require('mongoose');

const GrupoSchema = mongoose.Schema({
    nombreGrupo:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    codigoGrupo:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    creador: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    creado: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Grupo', GrupoSchema);