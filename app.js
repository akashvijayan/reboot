var express=require("express");
var fs=require("fs"); // file system
var mongoose=require("mongoose");
var bodyParser=require("body-parser");

var passport=require("passport"); // auth
var LocalStrategy=require("passport-local"); // auth local

var User=require("./models/user"); // user model
var Question=require("./models/question"); // question model

var middleware=require("./middleware"); // middleware

var app=express();

app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(__dirname+"/public"));

mongoose.connect("mongodb+srv://admin:reboot@admin@reboot0-5b7vl.mongodb.net/reboot_db?retryWrites=true&w=majority",{useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set("useFindAndModify",false);

// passport config
app.use(require("express-session")({
	secret: "hydra",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => { // send to every page
	res.locals.userData=req.user;
	next();
});

// main page
/**
 * Description of the function
 * @name renderHome
 * @function
 * @param {String} '/"" path
 * @param {Function} anonymous function that renders homepage
*/


app.get("/",(req,res) => {
	if(req.user) {
		User.findById(req.user._id,(err,foundUser) => {
			if(err) {
				console.log(err);
				res.send("failed");
			}
			else {
				console.log(foundUser);
				if(!foundUser.isQuizDone) {
					res.redirect("/quiz/1/1");
				}
				else {
					res.render("index");
				}
			}
		});
	}
	else {
		res.render("index");
	}
});

// temp: add question 
app.get("/addquestion",(req,res) => {
	res.render("addques");
});

app.post("/addquestion",(req,res) => {
	req.body.answer=Number(req.body.answer);
	req.body.difficulty=Number(req.body.difficulty);
	req.body.level=Number(req.body.level);
	// console.log(req.body);

	Question.create(req.body,(err,foundQue) => {
		if(err) {
			console.log(err);
			res.send("failed");
		}
		else {
			console.log(foundQue);
			res.redirect("/addquestion");
		}
	});
});

// quiz: show
app.get("/quiz/:level/:difficulty",(req,res) => {
	req.params.level=Number(req.params.level);
	req.params.difficulty=Number(req.params.difficulty);

	Question.find(req.params,(err,data) => {
		if(err) {
			console.log(err);
			res.send("failed");
		}
		else {
			randomNumber=Math.floor(Math.random() * Math.floor(data.length));
			console.log("random number: ",randomNumber);
			res.render("quiz",{data:data[randomNumber]});
		}
	});
});

app.post("/quiz",(req,res) => {
	// score calculation
	// goto quiz : show for next question
	// updation of mark at end of quiz
});

// register
/**
 * Description of the function
 * @name renderRegister
 * @function
 * @param {String} /register path
 * @param {Function} anonymous function that renders register page
*/
app.get("/register",(req,res) => {
	res.render("register");
});


/**
 * Description of the function
 * @name renderContact
 * @function
 * @param {String} /contact path
 * @param {Function} anonymous function that renders contact page
*/
app.get("/contact",(req,res) => {
	res.render("contact");
});

// register (post)

/**
 * Description of the function
 * @name registerUser
 * @function
 * @param {String} /register path_for_put_request
 * @param {Function} anonymous function that registers user to the database
*/
app.post("/register",(req,res) => {
	var user=new User({
		username: req.body.username,
		name: req.body.name,
		isQuizDone: false
	});
	User.register(user,req.body.password,(err,reguser) => {
		if(err) {
			console.log(err);
			return res.send(err.message);
		}
		passport.authenticate("local")(req,res,() => {
			res.redirect("/");
		});
	});
});

// login
/**
 * Description of the function
 * @name renderLogin
 * @function
 * @param {String} /login path_get
 * @param {Function} anonymous function that renders login page
*/
app.get("/login",(req,res) => {
	res.render("login");
});


//login(post)

/**
 * Description of the function
 * @name loginUser
 * @function
 * @param {String} /login path_post
 * @param {Function} anonymous function that renders logs the user in
*/
app.post("/login",passport.authenticate("local",{
	
	successRedirect: "/",
	faliureRedirect: "/login"
	
}),(req,res) => {
	
});

// logout

/**
 * Description of the function
 * @name logoutUser
 * @function
 * @param {String} /logout path_get
 * @param {Function} anonymous function that renders logs the user out
*/
app.get("/logout",(req,res) => {
	req.logout();
	res.redirect("/");
});

// video streaming
/**
 * Description of the function
 * @name streamVideo
 * @function
 * @param {String} /test/video path_get
 * @param {Function} anonymous function that renders videoplayer and streams video
*/
app.get("/test/video",(req,res) => {
	const path="videos/asd.mp4";
	const stat = fs.statSync(path);
	const fileSize = stat.size;
	const range = req.headers.range;
	
	console.log("size:"+fileSize);
	
	if(range) {
		const parts = range.replace(/bytes=/, "").split("-")
		const start = parseInt(parts[0], 10)
		const end = parts[1] 
		  ? parseInt(parts[1], 10)
		  : fileSize-1
		const chunksize = (end-start)+1
		const file = fs.createReadStream(path, {start, end})
		const head = {
		  'Content-Range': `bytes ${start}-${end}/${fileSize}`,
		  'Accept-Ranges': 'bytes',
		  'Content-Length': chunksize,
		  'Content-Type': 'video/mp4',
		}
		
		res.writeHead(206,head);
		file.pipe(res);
		
	}
	else {
		const head = {
			'Content-Length': fileSize,
			'Content-Type': 'video/mp4',
		};
		res.writeHead(200,head);
		fs.createReadStream(path).pipe(res);
	}
		
});

// listen
app.listen(3000,() => {
	console.log("server started at port 3000.");
});