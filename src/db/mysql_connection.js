mysql = require('mysql');
const { Sequelize } = require('sequelize');

class MySQLConnection {   // Classe de connexion à la base de données

  MYSQL_ADDON_HOST="localhost"
  MYSQL_ADDON_DB="scrap"
  MYSQL_ADDON_USER="root"
  MYSQL_ADDON_PORT=3306
  MYSQL_ADDON_PASSWORD=""
  
  constructor (){   // Connexion à la base de données
    this.connection = new Sequelize(this.MYSQL_ADDON_DB, this.MYSQL_ADDON_USER, this.MYSQL_ADDON_PASSWORD, {
      dialect: "mysql", host: this.MYSQL_ADDON_HOST
    });

    this.get_tables();
  };
  
  get_tables() {    // Avoir toutes les tables
    this.connection.query('SHOW TABLES', function (error, results, fields) {
      this.tables = results

      if (error) throw error;
      console.log(error);
    });
  };

  create_table(table_name) {    // Créer table si elle n'existe pas
    this.connection.query(`CREATE TABLE IF NOT EXISTS ${table_name} (
        appart_id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        city VARCHAR(255),
        zipcode VARCHAR(10),
        area INT,
        rooms INT NOT NULL,
        level INT,
        price INT NOT NULL,
        photo VARCHAR(255)
      )`, function (error, results, fields) {
      this.tables = results
      if (error) throw error;
      console.log(error);
    });
  };

  drop_table(table_name){   // Supprimer table
    this.connection.query(`DROP TABLE ${table_name}`, function (error, results, fields) {
      this.tables = this.get_tables();
      if (error) throw error; {
        console.log(error);
      }
    })
  };
  
  async get_content(table_name) {   // Avoir le contenu d'une table
    const request = await this.connection.query(`SELECT * FROM ${table_name}`, function (error, results, fields) {
      return results;
      if (error) throw error;
      console.log(error);
    });
    return request;
  };

  insert_content(table, object) {   // Insérer un objet dans une table
    this.connection.query(`INSERT INTO ${table} (title, city, zipcode, area, rooms, level, price, photo)
                            VALUES('${object.title}', '${object.city}', '${object.zipcode}', ${object.area}, ${object.rooms}, ${object.level}, ${object.price}, '${object.photo}')`, function (error, results, fields) {
      if (error) throw error;
      console.log(error);
    });
  };

  disconnect() {    // Déconnecter de la base de données
    connection.end();
  };
};

module.exports = MySQLConnection