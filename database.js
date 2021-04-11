const mysql = require("mysql");
require("dotenv").config();

const ignore = new Set(["ER_DB_CREATE_EXISTS", "ER_TABLE_EXISTS_ERROR"]);

const db = mysql.createConnection({
  user: process.env.DB_MYSQL_USER,
  password: process.env.DB_MYSQL_PASSWORD,
});

db.query(`CREATE DATABASE newsbot;`);
db.query(`USE newsbot;`);

db.query(`CREATE TABLE newsbot.news(
    id INT NOT NULL AUTO_INCREMENT,
    source VARCHAR(90) NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    url TEXT NOT NULL,
    urltoimage TEXT NOT NULL,
    publishedat DATE NOT NULL,
    shared BOOLEAN,
    PRIMARY KEY (id)
);`);

db.on("error", (err) => {
  if (ignore.has(err.code)) return;
  throw err;
});

class dbQuery {
  async insertValues(...[obj]) {
    const permission = await this.verifyDuplicates(obj);

    if (permission) {
      new Promise((resolve, reject) => {
        const sql = `INSERT INTO newsbot.news (source, title, description, url, urltoimage, publishedat, shared)
      VALUES (?, ?, ?, ?, ?, ?, ?);`;

        db.query(sql, Object.values(obj), (err, result) => {
          if (err) {
            reject(err);
            // throw err
            return;
          }
          resolve(result);
        });
      });
    }
  }

  verifyDuplicates(...[obj]) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * from newsbot.news WHERE title = (?)`;
      db.query(sql, obj.title, (err, result) => {
        if (err) reject(err);
        if (result.length > 0) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }
  updateShared(id, bool) {
    const sql = `UPDATE newsbot.news set shared = (?) WHERE id = (?)`;
    const options = [bool, id];
    db.query(sql, options);
  }

  getUnsharedNews() {
    return new Promise((resolve, reject) => {
      const sql = `SELECT id, publishedat, source, title, description, url, urltoimage 
      from newsbot.news where publishedat = (select MIN(publishedat) from newsbot.news WHERE shared = (?)) and shared = (?) `;
      const options = [false, false];
      db.query(sql, options, (err, result) => {
        if (err) throw err;
        resolve(result);
      });
    });
  }
}

module.exports = dbQuery;
