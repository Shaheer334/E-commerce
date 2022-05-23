const Product = require('../models/product.model');
const fs = require('fs');
// const stripe = require('stripe')(
// 	'sk_test_51KCeptA1IXnqbjZIXa0xJJjQep905UElz2eFdaskFHvY3OBRifVj220gyHIvscrciUE4zzmEJbJouQmFJAsDZVWx00koSEdGL4'
// ); //process.env.STRIPE_PRIVATE_KEY
// const stripeAPI = require('../stripe');
const stripe = require('stripe')('sk_test_51KCenDJ2SqQVVo39Zd2j4uG4GiG3vv2ZyWTxDhFHax4SoRLDQjiEqmuvUYUzkGxSM3ztCSkQqGwdrOXJKHJN8bKl00nXsdlBHH')
const { v4: uuid } = require('uuid')
// console.log(stripe)


// Creating Product
exports.create = async (req, res) => {
	try {
		//Validating Body
		if (!req.body) {
			return res.status(400).send({
				message: 'Please Enter Some Data',
			});
		}
		// ELSE
		const product = await new Product({
			name: req.body.name,
			imageUrl: req.file.path,
			price: req.body.price,
			detail: req.body.detail,
			quantity: req.body.quantity,
		});
		await product.save();
		return res.status(200).json({ message: 'Product Added Successfully !', product });
	} catch (error) {
		return res.status(401).json({
			message: 'Error at Creating Product !' || error,
		});
	}
};
// Creates Ends Here

// ------------------------------ //

// Get All Products
exports.findAll = async (req, res) => {
	try {
		const products = await Product.find().select('_id name imageUrl price detail quantity');
		return res.status(200).json({
			products,
		});
	} catch (error) {
		return res.status(401).json({
			message: 'Error at Getting All Products !' || error,
		});
	}
};
// Get All Ends Here

// ------------------------------ //

// Get One Product
exports.findOneeee = async (req, res) => {
	try {
		const product = await Product.findById({ _id: req.params.id }).select(
			'_id name imageUrl price detail quantity'
		);
		return res.status(200).json({
			product,
		});
	} catch (error) {
		return res.status(401).json({
			message: 'Error at Getting One Product heiiii !' || error,
		});
	}
};
// Get All Ends Here

// ------------------------------ //

// Delete a Product
exports.delete = async (req, res) => {
	try {
		// Deleting Image
		const url = await Product.findById({ _id: req.params.id });
		const img = url.imageUrl;
		fs.unlink(img, (err) => {
			if (err) {
				throw err;
			}
		});
		// Deleting Data
		const product = await Product.deleteOne({ _id: req.params.id });
		return res.status(200).json({
			product,
			message: 'Deleted !',
		});
	} catch (error) {
		return res.status(401).json({
			message: 'Error at Deleting Product !' || error,
		});
	}
};
// Delete Ends Here

// ------------------------------ //

// Update a Product
exports.update = async (req, res) => {
	try {
		// Updating Image
		// const url = await Product.findById({ _id: req.params.id });
		// const img = url.imageUrl;
		// fs.writeFile(img, function (err) {
		// 	if (err) {
		// 		throw err;
		// 	}
		// 	else{

		// 	}
		// });
		// Updating Data
		const product = await Product.updateOne(
			{ _id: req.params.id },
			{
				$set: {
					name: req.body.name,
					imageUrl: req.file.path,
					price: req.body.price,
					detail: req.body.detail,
					quantity: req.body.quantity,
				},
			}
		);
		if (product) {
			return res.status(200).json({
				message: product,
			});
		} else {
			return res.status(401).json({
				message: 'Error',
			});
		}
	} catch (error) {
		return res.status(401).json({
			message: 'Error at Updating Product !' || error,
		});
	}
};
// Update Ends Here


exports.paymentIntent = async (req, res) => {
	const { amount, id } = req.body;
	console.log("product dataaaaaa", amount, id);
	try {
		const paymentItent = await stripe.paymentIntents.create({
			amount,
			currency: "usd",
			payment_method: id,
			confirm: true,
			description: "E store Payment"
		});
		res.json({
			message: "Payment successful",
			success: true
		})
	} catch (err) {
		// console.log(err)
		// res.status(400).json({ err: 'an error occured, unable to create payment' })
		// console.log("Error:--- ", err)
		console.log("Error", err)
		res.status(400).json({
			message: "Payment failed",
			success: false
		})
	}
}

exports.retrieve = async (req, res) => {
	try {
		const paymentIntent = await stripe.paymentIntents.retrieve(req.params.id);
		res.send(paymentIntent)
	} catch (err) {
		res.send(err)
	}
}

exports.payment = async (req, res) => {
	const { product, token } = req.body
	const idempotencyKey = uuid()
	try {
		const customer = await stripe.customers.create({
			email: token.email,
			source: token.id
		})
		const charges = await stripe.charges.create({
			amount: product.price * 100,
			currency: 'usd',
			customer: customer.id,
			receipt_email: token.email,
			shipping: token.card.name,
			description: product.name,
			address: {
				country: token.card.address_country
			}
		}, { idempotencyKey })
		res.status(200).json({ message: "charges paid" })
	} catch (err) {
		console.log(err)
	}
}

exports.config = (req, res) => {
	try {
		const publishableKey = "pk_test_51KCenDJ2SqQVVo39VimwT20bpwuczWHC8joVPhejWpZbVvu07OWJ6aYxWJpXHQu0HTfQgfSUX5FBbOpS5LA7fi8A00xRL7qOm1"
		res.send(publishableKey)
	}
	catch (err) {
		console.log("Error====  ", err);

	}
}
