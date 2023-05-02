const express = require('express');  // Framework Express pour Node.js
const SeLoger = require("./api/seloger");  // SeLoger API
const MySQLConnection = require("./db/mysql_connection");  // MySQL Connexion
const Housing = require("./model/appartement");  // Housing Model

const app = express()
const port = 3000
var seloger = new SeLoger()

const table_name = "annonces"

connector = new MySQLConnection();
connector.create_table(table_name);

app.get('/', async(req, res) => {

  // Get data from SeLoger API
  appart_data = await seloger.get_list()
  var data = JSON.parse(appart_data)

  // Push data as Objects to the database
  data.items.forEach(element => {
    appart = new Housing(element.title, element.city, element.zipCode, element.livingArea, element.rooms, element.level, element.price, element.photos[0]);
    connector.insert_content(table_name, appart)
  });

  const result = await connector.get_content(table_name)
  console.log(result)
  res.send(result);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
