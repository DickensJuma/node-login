var mongoose = require('mongoose');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var MongoStore = require('connect-mongo')(session);

var app = express();

app.locals.pretty = true;
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/app/server/views');
app.set('view engine', 'pug');
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('stylus').middleware({ src: __dirname + '/app/public' }));
app.use(express.static(__dirname + '/app/public'));

//configure the database
const db = require('./app/config').mongoURI;

// Import Keys
// const uri = require("./app/config");
// const mongouri = uri.mongoUri;


//db connection
mongoose.connect(db, {useNewUrlParser: true})
	.then(()=>console.log('database connected successfully'))
  .catch(err=>console.log(err));
  
  

// app.use(session({
// 	secret: '2f4c9793-7464-4816-93d4-6d4fd6be22cf',

// 	store: new MongoStore({ url: process.env.DB_URL })
// 	})
// );

// var mongoose = require('mongoose')(session);


   app.use(session({
      secret: 'my secret sign key',
      store: new MongoStore({
        // host: '127.0.0.1',
        // port: '27017',
        proxy: true,
        resave: true,
        saveUninitialized: true,
        url: db,
        db: 'pagkenya'
      })
     }))
  //   .use('/home', function (req, res) {
  //     if (req.pagkenya.views) {
  //       req.pagkenya.views++;
  //     }
  //     else {
  //       req.pagkenya.views = 1;
  //     }
  //     res.end('Total views for you:' + req.pagkenya.views);
  //   })
  //   .use('/reset', function(req, res) {
  //     delete req.pagkenya.views;
  //     res.end('Cleared all your views');
  //   })
	// .listen(3000);
	

require('./app/server/routes')(app);
const port = process.env.port || 5000; 

app.listen(port, function(){
	console.log(`Express server listening on port ',  ${port}`);
});


// Initialize the app
// const app = express();
// parse application/x-www-form-urlencoded

// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

// parse application/json
// app.use(bodyparser.json());



// passport middleware added

// app.use(passport.initialize());

// // include passport stratagy

// require("./config/passport")(passport);

// Use our router

// app.use("/api/user", users);
// app.use("/api/profile", profile);
// app.use("/api/transfer", transfer);

// Server static assets if in production
// if (process.env.NODE_ENV === "production") {
//   // Set static folder
//   app.use(express.static("client/build"));

//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
//   });
// }

//  Assigning the port eg. http://localhost:5000 for local environment for heroku we use process.env.port
// const port = process.env.PORT || 5000;

// // finally app listen the port 5000
// app.listen(port, () => {
//   console.log(`Port listen on : ${port}`);
// });
