const mongodb = require('mongodb')
const mongoClient = mongodb.MongoClient
const dbUtils = require('../DatabaseInfo')

// connect to remote server
// remember to define your remote server information in DatabaseInfo.js
const reServer = dbUtils.getUrlWithUsernamePassword()

// insertDocuments in a collection
const insertDocuments = (db, callback) => {
    // get reference to edxTest1 collections
    // don't need to create collection 
    // because the first time you save to a collection, it will be created automatically
    const collection = db.collection('edx-test-students')

    // insert 3 documents (rows) to the created collection
    // ".insert" is asynchorous method -> use callback with error-first signature
    collection.insertMany([{name: 'kevin'}, {name: 'kngo'}, {name: 'kvn'}], (error, result) => {
        if (error) return process.exit(1)
        console.log(result.result.n) // will be 3 -> result.n = 3 -> number of documents has been created
        callback(result) // return a callback as result of insert action
    })
}


// updateDocument in a collection
const updateDocument = (db, callback) => {
    // get the edx-test-students collection 
    var collection = db.collection('edx-test-students')

    // update document where a is 2 and b = 1
    // update by adding grade as a new attribute whose name = nameUpdate
    const nameUpdate = 'kvn'
    collection.updateMany({name: nameUpdate}, {$set: {grade: 'B'}}, (error, result) => {
        if (error) return process.exit(1)
        console.log(result.result.n) // will be 1 cuz we update only 1 document
        console.log(`Updated the student document where name = ${nameUpdate}`)
        callback(result)
    })
}

// removeDocument in a collection
const removeDocument = (db, callback) => {
        // get the edx-test-students collection 
        var collection = db.collection('edx-test-students')

        // delete a document whose name = nameDelete
        const nameDelete = 'kngo'
        collection.deleteMany({name: nameDelete}, (error, result)=> {
            if (error) return process.exit(1)
            console.log(result.result.n) // we will 1 cuz we delete only 1 document
            console.log(`Removed the document where name = ${nameDelete}`)
            callback(result)
        })
}

// findDocuments in a collection
const findDocuments = (db, callback) => {
    var collection = db.collection('edx-test-students')

    // find({}) -> means "find all" because there is no condition
    // toArray -> return list of all documents as an array of documents
    collection.find({}).toArray((error, docs) => {
        console.log("total docs: ", docs.length) // will be 2 because we deleted one above
        console.log(`Found the following documents: `)
        console.dir(docs)
        callback(docs)
    })
}

// use connect method to connect to the server
mongoClient.connect(reServer, (error, client) => {
    if(error) return process.exit(1)
    // var db = client.db('edxTest1');

    var db = client.db(dbUtils.getDatabaseName()) 

    console.log('Connected successfully to server')

    // perform insert queries
    // the insertDocuments needs to be placed inside of the connect callback
    // to ensure that the proper db reference to database connection exists
    insertDocuments(db, () => {
        // in this case, we nested the updateDocuments in insertDocuments
        // because we only can updated after creating it.
        updateDocument(db, () => {
            // again, we only can remove after we created it, 
            removeDocument(db, () => {
                // list all documents
                findDocuments(db, () => {
                    client.close()
                })
            })
        })
    })
})