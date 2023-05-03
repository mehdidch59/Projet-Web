const express = require('express');
const fs = require('fs');
const SeLoger = require('./api/seloger');
const LeBonCoin = require('./api/leboncoin');
const MySQLConnection = require('./db/mysql_connection');
const Housing = require('./model/appartement');

const app = express();
const port = 3000;
const table_name = 'annonces';

const connector = new MySQLConnection();
connector.drop_table(table_name);
connector.create_table(table_name);

const seloger = new SeLoger();
const leboncoin = new LeBonCoin();

app.get('/', async (req, res) => {
  try {
    // Get data from SeLoger API
    const seloger_appart_data = await seloger.get_list();
    const seloger_data = JSON.parse(seloger_appart_data);

    // Get data from LeBonCoin API
    const leboncoin_appart_data = await leboncoin.get_list();

    // Push seloger_data comme des Objets à la base de données
    seloger_data.items.forEach((element) => {
      const appart_seloger = new Housing(
        element.title,
        element.city,
        element.zipCode,
        element.livingArea,
        element.rooms,
        element.level,
        element.price,
        element.photos[0],
      );
      connector.insert_content(table_name, appart_seloger);
    });   

    const result = await connector.get_content(table_name);
    //console.log(result);
    //res.send(result);

    fs.readFile('connexion.json', (err, data) => {
      if (err) throw err;
      const jsonData = JSON.parse(data);
      const Data = {
        seloger: seloger_data,
        leboncoin: Object.values(jsonData),
      };
      console.log(Data.leboncoin[8].price);
      res.render('index.ejs', { data: Data });
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
