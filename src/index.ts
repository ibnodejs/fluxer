import express = require('express')
import influx from './config/database';
const os = require('os')

const app: express.Application = express()

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


app.get('/v1/query', function(req, res){
  influx.query('select * from exodus_table')
    .then(result => {
      res.json(result)
      res.end()
    })
})

app.post('/v1/insert', function(req, res){
  influx.writePoints([
    {
      measurement: 'exodus_table',
      fields: {
        date: req.body.date,
        symbol: req.body.symbol,
        open: 1.1,
        high: 1.1,
        low: 1.1,
        close: 1.1,
        volume: 1
      }
    }
  ])
  res.end()
})

influx.getDatabaseNames()
  .then(names => {
    if (!names.includes('exodus')) {
      return influx.createDatabase('exodus')
    }
  })
  .then(() => {
    app.listen(3000, function () {
      console.log('Listening on port 3000')
    })
  })
  .catch(err => {
    console.error(err)
    console.error('Error creating Influx database!')
  })