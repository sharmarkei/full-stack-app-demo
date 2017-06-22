'use strict';

const express = require('express');
const pg = require('pg');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

const connectionString = 'postgres://localhost:5432/demo'; // db name
const client = new pg.Client(connectionString); // cretes new client inst and connects us to the db

console.log('pg client obj:', client);

client.connect();

// MiddleWare- between the request and response, you manipulate asome stuff.  Application level
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('./public'));

//route you visit homepage, send back a response that send the index.html
app.get('/', function(request, response) {
  response.sendFile('./public/index.html');
});

app.get('/db/person', function(request, response) {
  client.query('SELECT * FROM persons;') // select everyhitng from persons table
  .then(function(data) { //only fire when the db returns the data. collects the data.
    response.send(data); // sends back data to user
  })
  .catch(function(err) {
    console.err(err);
  });
});

app.post('/db/person', function(request, response) {
  client.query(`
    INSERT INTO persons(name, age, ninja)
    VALUES($1, $2, $3);
    `,
    [
      request.body.name,
      request.body.age,
      request.body.ninja
    ]
  )
  .then(function(data) {
    response.redirect('/');
  })
  .catch(function(err) {
    console.err(err);
  });
});

createTable();

app.listen(PORT, () => {
  console.log(`currently listening on ${PORT}`);
});

function createTable() { //when you see a function declarations, they get housted.
  client.query(`
    CREATE TABLE IF NOT EXISTS persons(
      id SERIAL PRIMARY KEY,
      name VARCHAR(256),
      age INTEGER,
      ninja BOOLEAN
    );`
  )
  .then(function(response) {
    console.log('created table in db!!!!');
  });
};
