const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");

const { campgroundSchema, reviewSchema } = require("./schemas");
const ExpressError = require("./utils/ExpressError");

const campgrounds = require("./routes/campgrounds");
const reviews = require("./routes/reviews");

const express = require("express");
const app = express();

const mongoose = require("mongoose");
const exp = require("constants");
mongoose.set("strictQuery", false); // To stop Mongoose from complaining about it

async function main() {
	await mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");
	console.log("Database connected.");
}

main().catch((err) => console.log(err));

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const sessionConfig = {
	secret: "secret",
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
		maxAge: 1000 * 60 * 60 * 24 * 7,
	},
};
app.use(session(sessionConfig));
app.use(flash());

app.use((req, res, next) => {
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");
	next();
});

app.use("/campgrounds", campgrounds);
app.use("/campgrounds/:id/reviews", reviews);

app.get("/", (req, res) => {
	res.render("home");
});

app.all("*", (req, res, next) => {
	next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
	const { statusCode = 500 } = err;
	if (!err.message) message = "Something went wrong";
	res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
	console.log("Serving on port 3000.");
});
