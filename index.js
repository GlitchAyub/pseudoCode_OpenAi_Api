const express = require('express')
require('dotenv').config()
const generateResponse = require('./controller/app')
const getAlLBooksSummaries = require('./controller/app')
// const getAlLBooksSummaries = require('./test')
const booksData = require('./data/booksData')

const app = express()
const port =  process.env.PORT || 5000
app.use(express.json())

app.post('/generate',generateResponse);

app.listen(port,async()=>{
  await getAlLBooksSummaries(booksData)
  console.log(`Server Running On Port No: ${port}`);
})
