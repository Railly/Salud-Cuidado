const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const helpers = require('./helpers');

passport.use('local.signin', new LocalStrategy({
    usernameField: 'correo_electronico',
    passwordField: 'contrasenia',
    passReqToCallback: true
}, async (req, correo_electronico, contrasenia, done) => {

    const rows = await pool.query('SELECT * FROM usuario WHERE correo_electronico = ?', [correo_electronico]);
    if(rows.length > 0) {
        const user = rows[0];
        const validPassword = await helpers.matchPassword(contrasenia, user.contrasenia);
        if(validPassword) {
            done(null, user, req.flash('success','Ingresaste correctamente'));
        } else {
            done(null, false, req.flash('message','Contraseña incorrecta'));
        }
    } else {
        return done(null, false, req.flash('message','El correo ingresado no está registrado'));
    }
}));

passport.use('local.signup', new LocalStrategy({
    usernameField: 'nombre',
    passwordField: 'contrasenia',
    passReqToCallback: true
}, async (req, nombre, contrasenia, done) => {

    const { apellido, correo_electronico } = req.body;

    const newUser = {
        nombre,
        apellido,
        contrasenia,
        correo_electronico
    }
    newUser.contrasenia = await helpers.encryptPassword(contrasenia);

    const result = await pool.query('INSERT INTO usuario SET ?', [newUser]);
    newUser.usuario_id = result.insertId;
    return done(null, newUser);
}));

passport.serializeUser((user, done) => {
    done(null, user.usuario_id);    
});

passport.deserializeUser(async (id, done) => {
    const rows = await pool.query('SELECT * FROM usuario WHERE usuario_id = ?', [id]); 
    done(null, rows[0]);
});
