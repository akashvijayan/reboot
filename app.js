var express=require("express");
var fs=require("fs");
var mongoose=require("mongoose");
var bodyParser=require("body-parser");
var passport=require("passport");
var LocalStrategy=require("passport-local");
var User=require("./models/user");
var Question=require("./models/question");

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

// main page
app.get("/",(req,res) => {
	res.render("index");
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
		}
	});
});

// register
app.get("/register",(req,res) => {
	res.render("register");
});

// register (post)
app.post("/register",(req,res) => {
	var user=new User({
		username: req.body.username,
		name: req.body.name
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
app.get("/login",(req,res) => {
	res.render("login");
});


//login(post)
app.post("/login",passport.authenticate("local",{
	
	successRedirect: "/",
	faliureRedirect: "/login"
	
}),(req,res) => {
	
});

// logout
app.get("/logout",(req,res) => {
	req.logout();
	res.redirect("/");
});

// video streaming
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
	console.log("server started.at port 3000");
});