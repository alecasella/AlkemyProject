const express = require('express');
const sql = require('../database')
const router = express.Router();
const uniqId = require('uniqid');
const { key } = require('../utilities');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');


router.post('/register', (req, res) => {

    const { email, pass } = req.body;
    const idUser = uniqId();
    const sqlInsert = "INSERT INTO users (idUser, email, pass) VALUES (?,?,?)"

    const password = CryptoJS.AES.encrypt(pass, key).toString()


    sql.query(sqlInsert, [idUser, email, password], (err) => {
        if (err) {
            res.send('Email already in use');
        }
        else {
            res.send("Sucess");
        }
    });

});

const generateAcessToken = (user) => {
    return jwt.sign({ id: user.idUser, email: user.email },
        key,
        { expiresIn: '1h' })
}

router.post('/login', (req, res) => {

    const email = req.body.email;
    const pass = req.body.pass;

    const sqlGetUser = `SELECT * FROM users where email = '${email}'`;

    sql.query(sqlGetUser, [email], (err, results) => {
        if (err) {
            res.status(400).send(err);
            return;
        }
        if (results.length) {
            const bytes = CryptoJS.AES.decrypt(results[0].pass, key);
            const oldPass = bytes.toString(CryptoJS.enc.Utf8);

            if (oldPass !== pass) {
                res.send('User or Password are wrong')
            } else {
                const tkn = generateAcessToken(results[0]);
                const userEmail = results[0].email;
                const userId = results[0].idUser;

                res.json({userId , userEmail, tkn});
            }
        }
        else res.send('user or password are wrong');
    });
});

module.exports = router