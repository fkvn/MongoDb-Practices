const express = require('express')
const logger = require('morgan')
const errorHandler = require('errorhandler')
const mongodb = require('mongodb')
const bodyParser = require('body-parser')
const dbUtils = require('../DatabaseInfo')

// initilization
let app = express()

// connect to remote server
// remember to define your remote server information in DatabaseInfo.js
const reServer = dbUtils.getUrlWithUsernamePassword()

const mongoClient = mongodb.MongoClient

// middlerware
app.use(logger('dev'))
app.use(bodyParser.json())

// routes
mongoClient.connect(reServer, (error, client) => {
    if(error) return process.exit(1)
    var db = client.db(dbUtils.getDatabaseName()) 
    console.log('Connected successfully to server') 

    app.get('/accounts', (req, res) => {
        db.collection('edx-accounts')
            .find({}, {sort: {_id: -1}})
            .toArray((error, accounts) => {
                if(error) return next(error)
                res.send(accounts)
            })
    })

    app.post('/accounts', (req, res) => {
        let newAccount = req.body
        db.collection('edx-accounts').insert(newAccount, (error, results) => {
            if(error) return next(error)
            res.send(results)
        })
    })

    app.put('/accounts/:id', (req, res) => {
        db.collection('edx-accounts')
            .update({_id: mongodb.ObjectID(req.params.id)}, {$set: req.body}, (error, results) => {
                if(error) return next(error)
                res.send(results)
            })
    })

    app.delete('/accounts/:id', (req, res) => {
        db.collection('edx-accounts')
            .remove({_id: mongodb.ObjectID(req.params.id)}, (error, results) => {
                if (error) return next(error)
                res.send(results)
            })
    })

    app.listen(3000)
})