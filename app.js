var express=require ('express');
var app=express();
app.set('view engine', 'jade');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var path = require('path');
var routes=require('./routes');
var port=80;
app.use(express.static(path.join(__dirname, '/public')));

// parse application/json

//routes
app.get('/soccer/:user?', routes.soccerPitch);
app.get('/img/:user?', routes.img);
app.get('/mapjson', routes.mapJson);
app.get('/geoJson', routes.geoJson);
app.get('/map', routes.map);
app.post('/savingMap', routes.save);
app.post('/updateMap', routes.updateObj);
app.get('/', function (req, res) {
    // The form's action is '/' and its method is 'POST',
    // so the `app.post('/', ...` route will receive the
    // result of our form
    var html = '<form action="/" method="post">' +
               'Enter your name:' +
               '<input type="text" name="userName" placeholder="..." />' +
               '<br>' +
               '<button type="submit">Submit</button>' +
            '</form>';
    
    res.send(html);
});

// This route receives the posted form.
// As explained above, usage of 'body-parser' means
// that `req.body` will be filled in with the form elements
app.post('/', function (req, res) {
    var userName = req.body.userName;
    var html = 'Hello: ' + userName + '.<br>' +
             '<a href="/">Try again.</a>';
    res.send(html);
});

app.listen(port, function(){
console.log("application en cours d'execution sur le port "+port);	
});
