var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const dbConnection = require("../lib/db");
const { authCheck } = require("../middleware/auth");

router.get("/", (req, res) => {
	res.render("home");
});

router.get("/login", (req, res) => {
	res.render("auth/login", { title: "Login | Quick Post", email: "" });
});

router.post("/auth-login", (req, res) => {
	const { email, password } = req.body;
	let error = false;

	if (!email.length || !password.length) {
		error = true;
		req.flash("error", "Please complete the form!");
		res.render("auth/login", { email });
	}

	dbConnection.query(
		`SELECT * FROM user WHERE email = '${email}'`,
		(error, data) => {
			if (error) {
				req.flash("error", "Incorrect email or password! *" + error);
				res.render("auth/login", { email });
			} else {
				bcrypt.compare(password, data[0].password, (err, result) => {
					if (err) {
						req.flash("error", "Incorrect email or password!" + err);
						res.render("auth/login", { email });
					} else {
						req.session.userId = data[0].id;
						res.redirect("/profile");
					}
				});
			}
		}
	);
});

router.get("/register", (req, res) => {
	res.render("auth/register", {
		title: "Register | Quick Post",
		name: "",
		email: "",
		password: "",
	});
});

router.post("/auth-register", async (req, res) => {
	const { name, email, password } = req.body;
	let error = false;

	if (!name.length || !email.length || !password.length) {
		error = true;
		req.flash("error", "Please complete the form!");
		res.render("auth/register", { name, email, password });
	}

	if (!error) {
		const saltRounds = 10;

		const formData = {
			name,
			email,
			password: await bcrypt.hash(password, saltRounds),
		};

		dbConnection.query("INSERT INTO user SET ?", formData, (error, data) => {
			if (error) {
				req.flash("error", error);
			} else {
				req.flash("success", `Welcome! ${name} `);
				req.session.userId = data.insertId;
				res.redirect("/profile");
			}
		});
	}
});

router.get("/logout", (req, res) => {
	req.session.destroy(() => {
		res.redirect("/login");
	});
});

router.get("/profile", authCheck, (req, res) => {
	dbConnection.query(
		`SELECT * FROM user WHERE id='${req.session.userId}'`,
		(error, data) => {
			if (error) {
				console.log(error);
				req.flash("error", error);
			} else {
				res.render("auth/profile", {
					timeLeft: req.session.cookie.expires,
					maxAge: req.session.cookie.maxAge,
					data: data[0],
				});
			}
		}
	);
});

module.exports = router;
