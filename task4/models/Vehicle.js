const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    vehicleName: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    desc: { type: String, required: true },
    brand: { type: String, required: true }
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;
