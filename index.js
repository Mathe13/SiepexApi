console.log('I am running!')

const express = require('express'),
  participante_rotas = require("./src/participante/participante_routes.js"),
  bodyParser = require('body-parser');

const app = express();

var rawBodySaver = function (req, res, buf, encoding) {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || 'utf8');
  }
}

app.use(bodyParser.json({
  verify: rawBodySaver
}));

app.use(bodyParser.urlencoded({
  verify: rawBodySaver,
  extended: true
}));
app.use(bodyParser.raw({
  verify: rawBodySaver,
  type: '*/*'
}));


app.use('/participante', participante_rotas);
app.get('/', function (req, res) {
  res.json("the server is on")
})


app.listen(process.env.PORT || 3000, function () {
  console.log('Example app listening on port ', (process.env.PORT || 3000));
});