const mongoose = require ('mongoose');

const AlmacenSchema = mongoose.Schema({
    nombreMaterial: {
        type: String,
        required: true,
        trim: true
    },
    descripcionMaterial: {
        type: String,
        required: true,
        trim: true
    },
    existenciaMaterial: {
        type: Number,
        required: true,
        trim: true
    },
    maximoMaterial: {
        type: Number,
        required: true,
        trim: true
    },
    codigoMaterial: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    estatusMaterial: {
        type: String,
        required: true,
        trim: true,
        default: "VIGENTE"
    },
    creado: {
        type: Date,
        default: Date.now()
    }
});

AlmacenSchema.index({nombreMaterial: 'text'});

module.exports = mongoose.model('Almacen', AlmacenSchema);