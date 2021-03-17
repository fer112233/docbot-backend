const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const PORT = process.env.PORT || 5000

const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors())

const getRecords = (request, response) => {
    pool.query('SELECT * FROM records', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const addRecord = (request, response) => {
    const {id, timeOfMeasure, glucoseValue} = request.body

    pool.query(
        'INSERT INTO records (id, timeofmeasure, glucosevalue) VALUES ($1, $2, $3)',
        [id, timeOfMeasure, glucoseValue],
        (error) => {
            if (error) {
                throw error
            }
            response.status(201).json({status: 'success', message: 'Record added.'})
        },
    )
}

app
    .route('/records')
    // GET endpoint
    .get(getRecords)
    // POST endpoint
    .post(addRecord)

// Start server
app.listen(PORT, () => {
    console.log(`Server listening`)
})