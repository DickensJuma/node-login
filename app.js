var http = require('http');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var MongoStore = require('connect-mongo')(session);
var mongoose = require ('mongoose');

var app = express();

app.locals.pretty = true;
// app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/app/server/views');
app.set('view engine', 'pug');
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('stylus').middleware({ src: __dirname + '/app/public' }));
app.use(express.static(__dirname + '/app/public'));

// build mongo database connection url 
const db = require('./app/config/keys_prod').mongoURI;

// app.use(session({
// 	secret: 'faeb4453e5d14fe6f6d04637f78077c76c73d1b4',
// 	proxy: true,
// 	resave: true,
// 	saveUninitialized: true,
// 	store: new MongoStore({ url: process.env.DB_URL })
// 	})
// );
mongoose.connect(db, {useNewUrlParser: true})
	.then(()=>console.log('database connected successfully'))
	.catch(err=>console.log(err));

const port = process.env.port || 5000;


require('./app/server/routes')(app);

app.listen(port, ()=>{
	console.log(`server up and running on port ${port}`)
});

