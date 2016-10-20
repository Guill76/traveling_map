var path = require('path');
var mongoose = require('mongoose');

// Mongoose connection to MongoDB
mongoose.connect('mongodb://localhost:27017/db_Mapping', function (error) {
    if (error) {
        console.log(error);
    }
});
var Schema = mongoose.Schema;
var JsonSchema = new Schema({
	properties:{
		Name: String,
		Status: String,
        ShowOnTheMap: String,
        Address: String,
		Created_Date: Date,
		PopupContent: String
	}
});

var JsonSchemaUpd = new Schema({
    type: Schema.Types.String,
    geometry: {
        type: Schema.Types.Mixed,
        coordinates: [ Number ]
    },
    properties: {
        Name: String,
        Status: String,
        ShowOnTheMap: String,
        Address: String,
        Created_Date: { type: Date, default:Date.now },
        PopupContent: String
    }
});

// Mongoose Model definition
var Json = mongoose.model('JString', JsonSchema, 'mapItems');
var JsonUpd = mongoose.model('JString_', JsonSchemaUpd, 'mapItems');
exports.soccerPitch = function (req,res){
	res.sendFile('soccerPitchTeamEditionV1.0.1/index.html',{root: path.join(__dirname, '../public')} );
};

exports.img = function (req,res){
	res.render('home',{user:req.query.user});
};

exports.mapJson=function (req, res) {
    Json.find({}, {}, function (err, docs) {
            console.log(docs);
    });
};

exports.geoJson = function (req, res) {
    if (req.query.type) {
        Json.find({ 'geometry.type': req.query.type }, {'geometry':1, 'properties':1}, function (err, docs) {
            res.json(docs);
        });
    }
};

exports.map = function (req, res) {
	res.render('map',{title:'Cartographie des voyages'});
};
exports.save = function (req, res) {
  console.log(JSON.stringify(req.body));
    JsonUpd.create(req.body, function (err, list) {
        if (err) {
            console.log(err);
        }
        console.log("\nlist:", list);
    });
  res.send(req.body);
};

exports.updateObj = function (req, res) {
    var id = req.body.id;
    console.log('requete post recue');
    JsonUpd.findOne({ _id: id }, function (err,foundObj) {
        if (err) {
            console.log(err);
            res.status(500).send();
        } else {
            if (!foundObj) {
                res.status(404).send();
            } else {
                if (req.body.Nom) {
                    foundObj.properties.Name = req.body.Nom;
                }
                if (req.body.Address) {
                    foundObj.properties.Address = req.body.Address;
                }
                if (req.body.popupContent) {
                    foundObj.properties.PopupContent = req.body.popupContent;
                }
                if (req.body.lat) {
                    foundObj.geometry.coordinates[0] = parseFloat(req.body.lat);
                }
                if (req.body.lng) {
                    foundObj.geometry.coordinates[1] = parseFloat(req.body.lng);
                }
                foundObj.save(function (err, updateObj) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('POST: Object successfully updated');
                        res.render('map', { title: 'Cartographie des voyages' });
                    }
                });
            } 
        }
    });
};