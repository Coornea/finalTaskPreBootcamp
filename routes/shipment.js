var express = require("express");
const { route } = require("../app");
var router = express.Router();
const dbConnection = require("../lib/db");

/* GET home page. */
router.get("/", (req, res, next) => {
	dbConnection.query(
		`SELECT item.id as id, item.weight as weight FROM item LEFT JOIN customer ON item.customer_id = customer.id ORDER BY name ASC`,
		(error, data) => {
			if (error) {
				console.log(error);
			} else {
				console.log(data);
				res.render("shipment/index", { title: "Express", data: data });
			}
		}
	);
});

router.post("/store", (req, res) => {
	const { weight, customerId } = req.body;
	let error = false;

	if (!weight.length || !customerId.length) {
		error = true;

		req.flash("error", "Please check this fill again!");

		res.render("shipment/add", { weight, customerId });
	}

	if (!error) {
		const formData = {
			weight,
			customerId,
		};

		dbConnection.query(`INSERT INTO item SET ?`, formData, (error) => {
			if (error) {
				req.flash("error", error);
			} else {
				req.flash("success", "Success add new user!");
				res.redirect("/shipment");
			}
		});
	}
});

router.get("/about", (req, res) => {
	res.render("about", {
		company: "Quick Post Indonesia",
		cars: ["Daihatsu", "Toyota", "Honda", "Mitsubushi"],
	});
});

router.get("/add", (req, res) => {
	res.render("shipment/add", {
		weight: "",
		customerId: "",
	});
});

router.get("/delete/(:id)", (req, res) => {
	const id = req.params.id;

	dbConnection.query(`DELETE FROM item WHERE id =` + id, (error) => {
		if (error) {
			req.flash("error", error);
		} else {
			req.flash("success", "Success delete user!");
			res.redirect("/shipment");
		}
	});
});

router.get("/edit/(:id)", (req, res) => {
	const id = req.params.id;

	dbConnection.query(`SELECT * FROM item WHERE id =` + id, (error, data) => {
		if (error) {
			req.flash("error", error);
		} else {
			res.render("shipment/edit", {
				id: data[0].id,
				weight: data[0].weight,
				customerId: data[0].customer_id,
			});
		}
	});
});

router.post("/update", (req, res) => {
	const {id, weight, customerId } = req.body;
	let error = false;

	if (!weight.length || !customerId.length) {
		error = true;

		req.flash("error", "Please check this fill again!");

		res.render("shipment/edit", { weight, customerId });
	}

	if (!error) {
		const formData = {
			weight,
			customerId,
		};

		dbConnection.query(
			`UPDATE item SET ? WHERE id=` + id,
			formData,
			(error) => {
				if (error) {
					req.flash("error", error);
				} else {
					req.flash("success", "Success for edit an user!");
				 	res.redirect("/shipment");
				}
			}
		);
	}
});

module.exports = router;
