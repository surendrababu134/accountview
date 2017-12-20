var express = require('express'),
  app = express(),
  port = process.env.PORT || 8000;

const request = require('request');

app.listen(port);
var path = require('path');

app.use(express.static('public'));

// viewed at http://localhost:8080
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

console.log('RESTful API server started on: ' + port);

let baseURL = 'https://accountview.net/';
let AUTHORIZATION_CODE = '';
let API_KEY = 'krNQnfYB62ZzDBrJugByt43IdOJe0AStiB8yCj3e';
let API_SECRET = '2QJc3EkXWGEdLtBPjHfDjrG1SU8wml8ADrKddYeX';
let redirectURL = 'http://localhost:8000/api/callback';

let data = {
  grant_type: 'authorization_code',
  code: AUTHORIZATION_CODE,
  redirect_uri: redirectURL,
  client_id: API_KEY,
  client_secret: API_SECRET
};

data = decodeURIComponent(data);

app.get('/api/callback', function (req, res) {

  AUTHORIZATION_CODE = req.url.split('code=')[1];

  /*request({
    url: baseURL + 'api/v3/token',
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: data,
    json: true
  },
  (err, res, body) => {
    if (err) { return console.log(err); }
    console.log(res.statusCode);
    console.log(body);
  });*/
  console.log(AUTHORIZATION_CODE);

  res.send(AUTHORIZATION_CODE);

});

app.get('/api/getCodeGrant',function(req, res){
  console.log('skjdfhjshfjksdf');
  console.log(AUTHORIZATION_CODE);
  res.send({'message':AUTHORIZATION_CODE});
});




