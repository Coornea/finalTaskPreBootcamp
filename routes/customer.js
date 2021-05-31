var express = require("express");
const { route } = require("../app");
var router = express.Router();
const dbConnection = require("../lib/db");

/* GET home page. */
router.get("/", (req, res, next) => {
	dbConnection.query(
		`SELECT * FROM customer ORDER BY name ASC`,
		(error, data) => {
			if (error) {
				console.log(error);
			} else {
				console.log(data);
				res.render("customer/index", { title: "Express", data: data });
			}
		}
	);
});

router.post("/store", (req, res) => {
	const { name, phone, address, profile } = req.body;
	let error = false;

	if (!name.length || !phone.length || !address.length || !profile.length) {
		error = true;

		req.flash("error", "Please check this fill again!");

		res.render("customer/add", { name, phone, address, profile });
	}

	if (!error) {
		const formData = {
			name,
			phone,
			address,
			profile,
		};

		dbConnection.query(`INSERT INTO customer SET ?`, formData, (error) => {
			if (error) {
				req.flash("error", error);
			} else {
				req.flash("success", "Success add new customer!");
				res.redirect("/customer");
			}
		});
	}
});

router.get("/about", (req, res) => {
	res.render("about", {
		company: "Quick Post Indonesia",
	});
});

router.get("/add", (req, res) => {
	res.render("customer/add", {
		name: "",
		phone: "",
		address: "",
		profile: "",
	});
});

router.get("/delete/(:id)", (req, res) => {
	const id = req.params.id;

	dbConnection.query(`DELETE FROM customer WHERE id =` + id, (error) => {
		if (error) {
			req.flash("error", error);
		} else {
			req.flash("success", "Success delete customer!");
			res.redirect("/customer");
		}
	});
});

router.get("/edit/(:id)", (req, res) => {
	const id = req.params.id;

	dbConnection.query(
		`SELECT * FROM customer WHERE id =` + id,
		(error, data) => {
			if (error) {
				req.flash("error", error);
			} else {
				res.render("customer/edit", {
					id: data[0].id,
					name: data[0].name,
					phone: data[0].phone,
					address: data[0].address,
					profile: data[0].profile,
				});
			}
		}
	);
});

router.post("/update", (req, res) => {
	const { name, phone, address, profile, id } = req.body;
	let error = false;

	if (!name.length || !phone.length || !address.length || !profile.length) {
		error = true;

		req.flash("error", "Please check this fill again!");

		res.render("customer/edit", { name, phone, address, profile });
	}

	if (!error) {
		const formData = {
			name,
			phone,
			address,
			profile,
		};

		dbConnection.query(
			`UPDATE customer SET ? WHERE id=` + id,
			formData,
			(error) => {
				if (error) {
					req.flash("error", error);
				} else {
					req.flash("success", "Success for edit an customer!");
					res.redirect("/customer");
				}
			}
		);
	}
});

module.exports = router;
