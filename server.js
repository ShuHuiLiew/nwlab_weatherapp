const express = require('express');
const server = express();
const hbs = require('hbs');
const axios = require('axios');
const bodyParser = require('body-parser');
const filemgr = require('./filemgr');

const port = process.env.PORT || 3000;

server.use(bodyParser.urlencoded({extended: true}));

server.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');

var weatherdata;

hbs.registerHelper('list', (items, options) => {
  items = weatherdata;
  var out = "<tr><th>Address</th><th>Summary</th><th>Temp</th></tr>";
  const length = items.length;
  for(var i=0; i<length;  i++){
    out = out + options.fn(items[i]);
  }
  return out;
});

server.get('/', (req,res) => {
  res.render('main.hbs');
});

server.get('/main', (req,res) => {
  res.render('main.hbs');
});


server.post('/form', (req,res) => {
  res.render('form.hbs');
});

server.get('/result', (req,res) => {
  res.render('result.hbs');
});

server.get('/historical', (req,res) => {
  filemgr.getAllData().then((result) => {
    weatherdata = result;
    res.render('historical.hbs');
  }).catch((errorMessage) => {
    console.log(errorMessage);
  });
});

server.post('/delete', (req,res) => {
  filemgr.deleteAll().then((result) => {
    weatherdata = result;
    res.render('historical.hbs');
  }).catch((errorMessage) => {
    console.log(errorMessage);
  });
});


server.post(`/getweather`,(req, res) => {
  const addr = req.body.address;

  const locationReq = `https://maps.googleapis.com/maps/api/geocode/json?address=${addr}&key=AIzaSyCADzgYLX1xlfX6HOwU8Hf0-qFmp8cNAVs`;

  axios.get(locationReq).then((response) => {
    console.log(response.data.results[0].formatted_address);
    const lat = response.data.results[0].geometry.location.lat;
    const lng = response.data.results[0].geometry.location.lng;
    const weatherReq = `https://api.darksky.net/forecast/6da0bd72474615959d3d3b6d22a62b66/${lat},${lng}`;
    return axios.get(weatherReq);
  }).then((response) => {

    console.log(response.data.currently.summary);
    const temp = (response.data.currently.temperature -32)*0.5556;
    const temperature = temp.toFixed(2);
    const tempString =`${temperature} Celsius`;

    const weatherresult ={
      address: addr,
      summary: response.data.currently.summary,
      temperature: tempString,
    };

    //Promise
    filemgr.saveData(weatherresult).then((result) => {
      //console.log(response.data);
      res.render('result.hbs', weatherresult);
    }).catch((errorMessage) => {
      console.log(errorMessage);
    });


  })
  .catch((error) => {
    console.log(error.code);
  });
});

server.get('/form',(req, res) => {
  res.render('form.hbs');
});


server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});//specified port 3000
