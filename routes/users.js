const express = require('express');
const userData = require('../data/users');
const {generateToken, verifyToken, alreadyLoged} = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/', alreadyLoged, (req, res) => {
    const userId = req.user;
    const user = userData.find((user) => user.id === userId);

    if (!user) {
        res.send(`
        <form action="/login" method="post">
            <label for="username">Usuario:</label>
            <input type="text" id="username" name="username" required><br>
            <label for="password">Contraseña:</label>
            <input type="password" id="password" name="password" required><br>
            <button type="submit">Iniciar sesión</button>
        </form>
        `);
    } else {
        res.send(`
        <h1>Already loged</h1>
        <form action="/logout" method="post">
            <button type="submit">Cerrar sesion</button>
        </form>
        <a href="/dashboard">dashboard</a> 
        `);  
    }  
});

router.post('/login', (req, res) => {
    const {username, password} = req.body;
    const user = userData.find((user) => user.username === username && user.password === password);

    if (user) {
        const token = generateToken(user);
        req.session.token = token;
        res.redirect('/dashboard');
    } else {
        res.status(401).json( { mensaje: 'Credenciales incorrectas' });
    }
});

router.get('/dashboard', verifyToken, (req, res) => {
    const userId = req.user;

    const user = userData.find((user) => user.id === userId);
  
    if (user) {
      res.send(`
        <h1>Bienvenido, ${user.name}</h1>
        <p>ID: ${user.id}</p>
        <p>UserName: ${user.username}</p>
        <a href="/">Home</a>
        <form action="/logout" method="post">
            <button type="submit">Cerrar sesion</button>
        </form>
      `);
    } else {
      res.status(401).json({ mensaje: 'Usuario no encontrado' });
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;