const mongodb = require('mongodb')
const mongoClient = mongodb.MongoClient
const dbUtils = require('../DatabaseInfo')

// connecting localhost
const localhost = dbUtils.getUrlLocalhost()

// connect to remote server
// remember to define your remote server information in DatabaseInfo.js
const reServer = dbUtils.getUrlWithUsernamePassword()

// use connect method to connect to the server
// if you want to connect to localhost, simply replace ecstUrl to url
mongoClient.connect(localhost, (error, client) => {
    if(error) return process.exit(1)
    console.log('Connected successfully to server')
    
    // connect to the database
    // var db = client.db('edxTest1');

    // connect to the your remote database
    var reDb = client.db(dbUtils.getDatabaseName())

    // perform queries
    client.close()
})