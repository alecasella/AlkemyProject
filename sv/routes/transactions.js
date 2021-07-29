const express = require('express');
const  sql = require('../database')
const router = express.Router();

router.post('/addTransaction', (req, res) => {

    const { amount, type_movement, concept, trans_date, id_user, category } = req.body;

    const sqlAddTrans = "INSERT INTO transactions (amount, type_movement, concept, trans_date, id_user, category) VALUES (?, ?, ?, ?, ? ,?) ";

    sql.query(sqlAddTrans, [amount, type_movement, concept, trans_date, id_user, category], (err, results) => {
        if (err) {
            res.status(400).send(err);
            return;
        }
        res.status(200).json({
            status: 200,
            sucess: true
        });
    });
});


router.post('/getTransactionsByIdUser', (req, res) => {

    const { id_user } = req.body;
    const sqlTransactionsByID = "SELECT * FROM transactions where id_user = ? ORDER BY id_transaction DESC LIMIT 10 ";

    sql.query(sqlTransactionsByID, [id_user], (err, results) => {
        if (err) {
            res.status(400).send(err);
            return;
        }
        if (results.length) res.json(results);
        else res.send('Empty list');
    });
})

router.post('/getTransactionsById', (req, res) => {

    const { id_transaction } = req.body;

    const sqlTransactionsByID = "SELECT * FROM transactions where id_transaction = ?";

    sql.query(sqlTransactionsByID, [id_transaction], (err, results) => {
        if (err) {
            res.status(400).send(err);
            return;
        }
        if (results.length) res.json(results);
        else res.json({});
    });
})

router.delete('/deleteTransaction', (req, res) => {

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
});


router.patch('/editTransactcion', (req, res) => {

    const { amount, concept, trans_date, category, id_transaction } = req.body;

    const sqlEditTrans = `UPDATE transactions SET amount = '${amount}', concept = '${concept}', trans_date = '${trans_date}',
                         category = '${category}' WHERE id_transaction = '${id_transaction}'`

    sql.query(sqlEditTrans, (err, results) => {
        if (err) {
            res.status(400).send(err);
            return;
        }
        res.status(200).json({
            status: 200,
            sucess: true
        });
    });
})


router.post('/foundTransactionsByCategory', (req, res) => {

    const { id_user, category } = req.body;
 

    const sqlFoundTransByCat = ` SELECT * FROM transactions WHERE id_user = '${id_user}' and category = '${category}' ORDER BY id_transaction DESC LIMIT 10  `;

    sql.query(sqlFoundTransByCat, (err, results) => {
        if (err) {
            res.status(400).send(err);
            return;
        }
        if (results.length) res.json(results);
        else res.send('Empty list');
    });
});


module.exports = router