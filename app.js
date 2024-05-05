const express = require('express');
const userRoutes = require('./routes/users')
const session = require('express-session');
const secret = require('./crypto/config');
const app = express();

const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
    session({
        secret: secret,
        resave: false,
        saveUninitialized: true,
        cookie: {secure: false}
    })
);

app.use('/', userRoutes);

app.listen(port, () => {
    console.log(`Server intialized at http://localhost:${port}`);
});