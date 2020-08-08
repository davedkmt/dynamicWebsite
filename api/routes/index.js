var express = require('express');
var router = express.Router();
const ObjectID = require('mongodb').ObjectId;

router.get('/debts', (req, res, next) => {
    req.collection.find({})
        .toArray()
        .then(results => res.json(results))
        .catch(error => res.send(error));
});

router.post('/debts', (req, res, next) => {
    const { debtValue, interestRate, minimumPayment} = req.body;
    if (!debtValue || !interestRate || !minimumPayment) {
        return res.status(400).json({
            message: 'The field is required',
        });
    }

    const payload = { debtValue, interestRate, minimumPayment };
    req.collection.insertOne(payload)
        .then(result => res.json(result.ops[0]))
        .catch(error => res.send(error));
});

router.delete('/debts/:id', (req, res, next) => {
    const { id } = req.params;
    const _id = ObjectID(id);
    req.collection.deleteOne({ _id })
        .then(result => res.json(result))
        .catch(error => res.send(error));
});

module.exports = router;
