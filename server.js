const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Vehicle = require('./models/Vehicle');
const app = express();
const PORT = 3000;

mongoose.connect('mongodb://localhost:27017/vehiclesdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected')).catch(err => console.log(err));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/views', express.static(path.join(__dirname, 'views')));

// Home - List all vehicles
app.get('/', async (req, res) => {
    const vehicles = await Vehicle.find();
    res.render('index', { vehicles });
});

// Show form to add vehicle
app.get('/vehicles/new', (req, res) => {
    res.render('new');
});

// Create vehicle
app.post('/vehicles', async (req, res) => {
    const { vehicleName, price, image, desc, brand } = req.body;
    await Vehicle.create({ vehicleName, price, image, desc, brand });
    res.redirect('/');
});

// Show form to edit vehicle
app.get('/vehicles/:id/edit', async (req, res) => {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).send('Vehicle not found');
    res.render('edit', { vehicle });
});

// Update vehicle
app.post('/vehicles/:id', async (req, res) => {
    const { vehicleName, price, image, desc, brand } = req.body;
    await Vehicle.findByIdAndUpdate(req.params.id, { vehicleName, price, image, desc, brand });
    res.redirect('/');
});

// Delete vehicle
app.post('/vehicles/:id/delete', async (req, res) => {
    await Vehicle.findByIdAndDelete(req.params.id);
    res.redirect('/');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
