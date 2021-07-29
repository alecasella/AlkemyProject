const express = require('express');
const sql = require ('../database')
const router = express.Router();


router.post('/addUser', (req, res) => {

    const { idUser, email, pass } = req.body;

    const sqlInsert = "INSERT INTO users (idUser, email, pass) VALUES (?,?,?)"

    sql.query(sqlInsert, [idUser, email, pass], (err) => {
        if (err) {
            res.send('Email already in use');
        }
        else{
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
        if(results.length) res.json(results);
        else res.json({});
    });
});

router.post('/logUser', (req, res) => {

    const {email, pass} = req.body;

    const sqlGetUser = "SELECT * FROM users where email = ? and pass = ? ";

    sql.query(sqlGetUser, [email, pass], (err, results) => {
        if (err) {
            res.status(400).send(err);
            return;
        }
        if(results.length) res.json(results);
        else res.send('user or password are wrong') ;
    });
});

module.exports = router