const {MongoClient} = require('mongodb');
const fs = MongoClient;

//const database = 'mongodb://localhost:27017'; // for localhost
const database = 'mongodb://lab123:lab123@ds245210.mlab.com:45210/weatherapp';//for cloud

const saveData = (newdata) => {
  return new Promise((resolve, reject) => {

    // connect to mango server
    MongoClient.connect(database, {useNewUrlParser: true}, (err, client) => {
      if (err) {
        reject('Unable connect to MongoDB');//reject promise (error)
      }

      console.log('Connected to MongoDB');
      //function to create database
      const db = client.db('WeatherApp');

      // insert on function
      db.collection('weatherCollection').insertOne(newdata, (err, result) => {
        if (err) {
          reject ('Unable to insert'); //reject promise (error)
        }
        resolve(result); //resolve promise
      })

      client.close();
    });

  });
};

const  getAllData = () => {
  return new Promise ((resolve, reject) => {
    // connect to mango server
    MongoClient.connect(database, {useNewUrlParser: true}, (err, client) => {
      if (err) {
        reject('Unable connect to MongoDB');
      }

      console.log('Connected to MongoDB');
      //function to create database
      const db = client.db('WeatherApp');

      // insert on function

    db.collection('weatherCollection').find().toArray().then( (docs) => {
      resolve(docs);
    }, (err) => {
      reject ('Unable to fetch docs');
    });

      client.close();
    });
  });
};

const deleteAll = () => {
  return new Promise ((resolve, reject) => {
    // connect to mango server
    MongoClient.connect(database, {useNewUrlParser: true}, (err, client) => {
      if (err) {
        reject('Unable connect to MongoDB');
      }

      console.log('Connected to MongoDB');
      //function to create database
      const db = client.db('WeatherApp');

      // insert on function

    db.collection('weatherCollection').remove({}).then( (result) => {
      resolve(result);
    }, (err) => {
      reject ('Unable to delete');
    });

      client.close();
    });
  });
};

//export function
module.exports = {
  saveData,
  getAllData,
  deleteAll,
}
