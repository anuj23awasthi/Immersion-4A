const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Vehicle = require('./models/Vehicle');
const app = express();
const PORT = 3000;

mongoose.connect('mongodb://localhost:27017/vehiclesdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected')).catch(err => console.log(err));

app.use(session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/views', express.static(path.join(__dirname, 'views')));

passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        const user = await User.findOne({ username });
        if (!user) return done(null, false, { message: 'Incorrect username.' });
        const match = await bcrypt.compare(password, user.password);
        if (!match) return done(null, false, { message: 'Incorrect password.' });
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/login');
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Registration route
app.get('/register', (req, res) => {
    res.render('register');
});
app.post('/register', async (req, res) => {
    const { username, password, email, age } = req.body;
    const hash = await bcrypt.hash(password, 10);
    await User.create({ username, password: hash, email, age });
    res.redirect('/login');
});

// Login route
app.get('/login', (req, res) => {
    res.render('login');
});
app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}));

// Logout
app.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/login');
    });
});

// Protect all CRUD routes
app.get('/', ensureAuthenticated, async (req, res) => {
    const vehicles = await Vehicle.find();
    res.render('index', { vehicles });
});
app.get('/vehicles/new', ensureAuthenticated, (req, res) => {
    res.render('new');
});
app.post('/vehicles', ensureAuthenticated, async (req, res) => {
    const { vehicleName, price, image, desc, brand } = req.body;
    await Vehicle.create({ vehicleName, price, image, desc, brand });
    res.redirect('/');
});
app.get('/vehicles/:id/edit', ensureAuthenticated, async (req, res) => {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).send('Vehicle not found');
    res.render('edit', { vehicle });
});
app.post('/vehicles/:id', ensureAuthenticated, async (req, res) => {
    const { vehicleName, price, image, desc, brand } = req.body;
    await Vehicle.findByIdAndUpdate(req.params.id, { vehicleName, price, image, desc, brand });
    res.redirect('/');
});
app.post('/vehicles/:id/delete', ensureAuthenticated, async (req, res) => {
    await Vehicle.findByIdAndDelete(req.params.id);
    res.redirect('/');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
