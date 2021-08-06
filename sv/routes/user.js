const express = require('express');
const sql = require('../database')
const router = express.Router();
const uniqId = require('uniqid');
const { key } = require('../utilities');
const CryptoJS = require('crypto-js');

router.post('/addUser', (req, res) => {

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

router.get('/getUsers', (req, res) => {
    const sqlGetAll = "SELECT * FROM users";

    sql.query(sqlGetAll, (err, results) => {
        if (err) {
            res.status(400).send(err);
            return;
        }
        if (results.length) res.json(results);
        else res.json({});
    });
});

router.post('/logUser',  (req, res) => {

    const email  = req.body.email;
    const pass  = req.body.pass;

    const sqlGetUser = `SELECT * FROM users where email = '${email}'`;

    sql.query(sqlGetUser, [email],  (err, results) => {
        if (err) {
            res.status(400).send(err);
            return;
        }
        if (results.length) {
            const bytes = CryptoJS.AES.decrypt(results[0].pass, key);
            const oldPass =  bytes.toString(CryptoJS.enc.Utf8);

            if (oldPass !== pass) {
                res.send('User or Password are wrong')
            }else
            {
                res.json(results);
            }
        }
        else res.send('user or password are wrong');
    });
});

module.exports = router