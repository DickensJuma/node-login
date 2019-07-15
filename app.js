	var http = require('http');
	var express = require('express');
	var session = require('express-session');
	var bodyParser = require('body-parser');
	var cookieParser = require('cookie-parser');
	var MongoStore = require('connect-mongo')(session);
	var mongoose = require(['mongoose']);

	var app = express();
	mongoose.connect('mongodb://localhost/pag-kenya');
	const keys = require('./config/keys');

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

	process.env.DB_HOST = process.env.DB_HOST || 'localhost'
	process.env.DB_PORT = process.env.DB_PORT || 27017;
	process.env.DB_NAME = process.env.DB_NAME || 'pag-kenya';

	if (app.get('env') != 'live'){
		process.env.DB_URL = 'mongodb://'+process.env.DB_HOST+':'+process.env.DB_PORT;
	}	else {
	// prepend url with authentication credentials // 
		process.env.DB_URL = 'mongodb://'+process.env.DB_USER+':'+process.env.DB_PASS+'@'+process.env.DB_HOST+':'+process.env.DB_PORT;
	}

	app.use(session({
		secret: keys.process.env.SECRET,
		proxy: true,
		resave: true,
		saveUninitialized: true,
		store: new MongoStore({  db: mongoose.connection.db,collection: 'sessions',url: process.env.DB_URL })
		})
	);

	require('./app/server/routes')(app);

	http.createServer(app).listen(app.get('port'), function(){
		console.log('Express server listening on port ' + app.get('port'));
	});
	

	//DB Config
const db =require('./app/config/keys').mongoURI;

//connect to MongoDB
MongoStore.connect(db)
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err)
);


	
						  