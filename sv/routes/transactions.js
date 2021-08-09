const express = require('express');
const sql = require('../database')
const router = express.Router();

const jwt = require('jsonwebtoken');
const { key } = require('../utilities');
// const verify = require('../verifyToken');

function verify(req, res, next) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, key, (err, user) => {
            if (err) res.status(403).json('Token is not valid!');
            req.user = user;
            console.log(req.user);
            next();
        });
    } else{
        return res.status(401).json('You are not authenticated');
    }
}

router.post('/transaction', verify, (req, res) => {

    if (req.user.id === req.body.id_user) {
        const { amount, type_movement, concept, trans_date, id_user, category } = req.body;

        const sqlAddTrans = "INSERT INTO transactions (amount, type_movement, concept, trans_date, id_user, category) VALUES (?, ?, ?, ?, ? ,?) ";

        sql.query(sqlAddTrans, [amount, type_movement, concept, trans_date, id_user, category], (err, results) => {
            if (err) {
                res.status(401).json(err);
                return;
            }
            res.status(200).json('Sucess');
        });
    } else {
        res.status(403).json('Your not Authorized to do this transaction!');
    }
});


router.get('/transaction/:id_user', verify, (req, res) => {

    const id_user = req.params.id_user;
    
    if (req.user.id === id_user) {
        
        const sqlTransactionsByID = "SELECT * FROM transactions where id_user = ? ORDER BY id_transaction DESC LIMIT 10 ";

        sql.query(sqlTransactionsByID, [id_user], (err, results) => {
            if (err) {
                res.status(400).send(err);
                return;
            }
            if (results.length) res.json(results);
            else res.send('Empty list');
        });
    } else {
        res.status(403).json('Your not Authorized to do this transaction!');
    }
})



router.get('/transaction/:id_user/:id_transaction', verify, (req, res) => {

    const id_transaction  = req.params.id_transaction;

    if (req.user.id === req.params.id_user) {


        const sqlTransactionsByID = "SELECT * FROM transactions where id_transaction = ?";

        sql.query(sqlTransactionsByID, [id_transaction], (err, results) => {
            if (err) {
                res.status(400).send(err);
                return;
            }
            if (results.length) res.json(results);
            else res.json({});
        });
    } else {
        res.status(403).json('Your not Authorized to do this transaction!');
    }
})

router.delete('/transaction', verify, (req, res) => {

    if (req.user.id === req.body.id_user) {

        const { id_transaction } = req.body;

        const sqlDeleteTrans = " DELETE FROM transactions WHERE id_transaction = ?";

        sql.query(sqlDeleteTrans, [id_transaction], (err, results) => {
            if (err) {
                res.status(400).send(err);
                return;
            }
            res.status(200).json({
                status: 200,
                sucess: true
            });
        });
    } else {
        res.status(403).json('Your not Authorized to do this transaction!');
    }
});


router.patch('/transaction/:id_user', verify, (req, res) => {

    if (req.user.id === req.params.id_user) {

        const { amount, concept, trans_date, category, id_transaction } = req.body;

        const sqlEditTrans = `UPDATE transactions SET amount = '${amount}', concept = '${concept}', trans_date = '${trans_date}',
                         category = '${category}' WHERE id_transaction = '${id_transaction}'`

        sql.query(sqlEditTrans, (err, results) => {
            if (err) {
                res.status(400).send(err);
                return;
            }
            res.status(200).json(results);
        });
    } else {
        res.status(403).json('Your not Authorized to do this transaction!');
    }
})


router.get('/filter/:id_user/:category', verify, (req, res) => {
    

    const category = req.params.category;
    const id_user = req.params.id_user;


    if (req.user.id === id_user) {

        const sqlFoundTransByCat = ` SELECT * FROM transactions WHERE id_user = '${id_user}' and category = '${category}' ORDER BY id_transaction DESC LIMIT 10  `;

        sql.query(sqlFoundTransByCat, (err, results) => {
            if (err) {
                res.status(400).send(err);
                return;
            }
            if (results.length) res.json(results);
            else res.send('Empty list');
        });
    } else {
        res.status(403).json('Your not Authorized to do this transaction!');
    }
});


module.exports = router