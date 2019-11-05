const mongodb = require('mongodb')
const customers = require('./m3-customer-data.json')
const async = require('async')
const customerAddresses = require('./m3-customer-address-data.json')
const dbUtils = require('../DatabaseInfo')

// connect to the remote server
// remember to define your remote server information in DatabaseInfo.js
const reServer = dbUtils.getUrlWithUsernamePassword()

const mongoClient = mongodb.MongoClient

// in-memory to store the nums of tasks (query) we perform
let tasks = []

// the number of limit records we want to process in one MongoDb query 
// if we don't give any arguments when we run the file, it will take 1000 records as default for one query
const limit = parseInt(process.argv[2], 10) || 1000


// process data
mongoClient.connect(reServer, (error, client) => {
    if (error) return process.exit(1)
    var db = client.db(dbUtils.getDatabaseName())

    // loop through customers data withouth an address
    customers.forEach((customer, index, list) => {
        // get individual customer and add the address to each corresponding customer
        customers[index] = Object.assign(customer, customerAddresses[index])

        // limit will be the changing variable, determine how many records I want to process in a single MongoDB query
        // index % limit == 0 -> one query (has number of indexes we want to process) is ready to process
        // So, if the limit is 1000 -> we import 1000/1000/time -> 1 time = 1 task
            // if the limit is 1 -> we run 1/1000/time -> 1000 times = 1000 tasks
        if (index % limit == 0) {
            const start = index
            const end = (start + limit > customers.length) ? customers.length - 1 : start + limit
            tasks.push((done) => {
                console.log(`Processing ${start} - ${end} out of ${customers.length}`)

                // add subset pf customers to database
                db.collection('edx-customers').insert(customers.slice(start, end), (error, results) => {
                    done(error, results)
                })
            })
        } 
    })

    console.log(`Launching ${tasks.length} parallel tasks(s)`)
    const startTime = Date.now()

    // parallel is an async method which takes array of function (tasks) -> run those tasks in parallel 
    async.parallel(tasks, (error, result) => {
        if(error) console.error(error)
        const endTime = Date.now()
        console.log(`Execution time: ${endTime - startTime}`)
        client.close()
    })
})
