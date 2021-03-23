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

const getGlucoseLastRecord = (request, response) => {
    pool.query('SELECT * FROM records ORDER BY timeOfMeasure DESC LIMIT 1', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows[0])
    })
}

const addRecord = (request, response) => {
    const {id, timeOfMeasure, glucoseValue} = request.body
    console.log(request.body)
    pool.query(
        'INSERT INTO records (id, timeofmeasure, glucosevalue) VALUES ($1, $2, $3)',
        [id, timeOfMeasure, Math.round(100000*glucoseValue)],
        (error) => {
            if (error) {
                throw error
            }
            response.status(201).json({status: 'success', message: 'Record added.'})
        },
    )
}

const getGlucoseLastRecord = (request, response) => {
    pool.query('SELECT * FROM pulsioximeterRecords ORDER BY timeofmeasurelower DESC LIMIT 1', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows[0])
    })
}

const addRecord = (request, response) => {
    const {timeOfMeasureLower, timeOfMeasureTop, O2Value, BPMValue} = request.body
    console.log(request.body)
    pool.query(
        'INSERT INTO pulsioximeterRecords (timeofmeasurelower, timeofmeasuretop, o2value, bpmvalue) VALUES ($1, $2, $3, $4)',
        [timeOfMeasureLower, timeOfMeasureTop, O2Value, BPMValue],
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
app
    .route('/glucoseLastRecord')
    .get(getGlucoseLastRecord)

// Start server
app.listen(PORT, () => {
    console.log(`Server listening`)
})