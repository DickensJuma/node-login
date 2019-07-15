	var http = require('http');
	var express = require('express');
	var session = require('express-session');
	var bodyParser = require('body-parser');
	var cookieParser = require('cookie-parser');
	var MongoClient = require('mongodb').MongoClient;
	var mongodb = require('mongodb');
	var MongoStore = require('connect-mongo')(session);
	var mongoose = require('mongoose');

	
	
	


	var app = express();
	const db = require('./app/config/keys_prod.js').mongoURI;

	//initializine connection
	MongoClient.connect(db, function(err, database){
		if(err) throw err;
		db = database;

		// start the application after the database is connected
		app.listen(5000);
		console.log("Listening on port 5000");
	});


mongoose.connect(db, {
	
	
	useNewUrlParser:true
	  }).then(
		() => { 
			console.log("Database connected");
		},
		err => { 
			/** handle initial connection error */ 
			console.log("Error in database connection. ", err);
		}
	);


	app.locals.pretty = true;
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/app/server/views');
	app.set('view engine', 'pug');
	app.use(cookieParser());
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(require('stylus').middleware({ src: __dirname + '/app/public' }));
	app.use(express.static(__dirname + '/app/public'));

	// build mongo database connection url //



	app.use(session({
		secret: '5d2931089ccf642c7e99d25c',
		proxy: true,
		resave: true,
		saveUninitialized: true,
		store: new MongoStore({ mongooseConnection: mongoose.connection })
		})
	);

	require('./app/server/routes')(app);

	http.createServer(app).listen(app.get('port'), function(){
		console.log('Express server listening on port ' + app.get('port'));
	});
	



	
						  