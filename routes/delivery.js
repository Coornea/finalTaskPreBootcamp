var express = require("express");
const { route } = require("../app");
var router = express.Router();
const dbConnection = require("../lib/db");

/* GET home page. */
router.get("/", (req, res, next) => {
	dbConnection.query(
		`SELECT delivery.id as id,
		 delivery.receiver as receiver FROM delivery LEFT JOIN
		  item ON delivery.item_id = item.id LEFT JOIN customer ON
		  delivery.customer_id = customer.id LEFT JOIN postman ON
		 delivery.postman_id = postman.id ORDER BY id ASC`,
		(error, data) => {
			if (error) {
				console.log(error);
			} else {
				console.log(data);
				res.render("delivery/index", { title: "Delivery", data: data });
			}
		}
	);
});

router.post("/store", (req, res) => {
	const { itemId, customerId, receiver, postmanId } = req.body;
	let error = false;

	if (!itemId.length || !customerId.length || !receiver.length || !postmanId.length) {
		error = true;

		req.flash("error", "Please check this fill again!");

		res.render("delivery/add", { itemId, customerId, receiver, postmanId });
	}

	if (!error) {
		const formData = {
			itemId,
			customerId,
			receiver,
			postmanId,
		};

		dbConnection.query(`INSERT INTO delivery SET ?`, formData, (error) => {
			if (error) {
				req.flash("error", error);
			} else {
				req.flash("success", "Success add new delivery!");
				res.redirect("/delivery");
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
	res.render("delivery/add", {
		itemId: "",
		customerId: "",
		receiver: "",
		postmanId: "",
	});
});

router.get("/delete/(:id)", (req, res) => {
	const id = req.params.id;

	dbConnection.query(`DELETE FROM delivery WHERE id =` + id, (error) => {
		if (error) {
			req.flash("error", error);
		} else {
			req.flash("success", "Success delete delivery!");
			res.redirect("/delivery");
		}
	});
});

router.get("/edit/(:id)", (req, res) => {
	const id = req.params.id;

	dbConnection.query(
		`SELECT * FROM delivery WHERE id =` + id,
		(error, data) => {
			if (error) {
				req.flash("error", error);
			} else {
				res.render("delivery/edit", {
					id: data[0].id,
					itemId: data[0].item_id,
					customerId: data[0].customer_id,
					receiver: data[0].receiver,
					postmanId: data[0].postman_id,
				});
			}
		}
	);
});

router.post("/update", (req, res) => {
	const {id, itemId, customerId, receiver, postmanId} = req.body;
	let error = false;

	if (!itemId.length || !customerId.length || !receiver.length || !postmanId.length) {
		error = true;

		req.flash("error", "Please check this fill again!");

		res.render("delivery/edit", { itemId, customerId, receiver, postmanId });
	}

	if (!error) {
		const formData = {
			itemId,
			customerId,
			receiver,
			postmanId,
		};

		dbConnection.query(
			`UPDATE delivery SET ? WHERE id=` + id,
			formData,
			(error) => {
				if (error) {
					req.flash("error", error);
				} else {
					req.flash("success", "Success for edit an delivery!");
					res.redirect("/delivery");
				}
			}
		);
	}
});

module.exports = router;
