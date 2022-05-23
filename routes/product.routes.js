const express = require('express');
const router = express.Router();

// MULTER Start
const multer = require('multer');

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './uploads/');
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname);
	},
});

const upload = multer({ storage: storage, limits: { fieldSize: 1024 * 1024 * 5 } });

// Multer Ends

const product = require('../controllers/product.controller');

router.post('/', upload.single('imageUrl'), product.create);
router.get('/', product.findAll);
router.put('/:id', upload.single('imageUrl'), product.update);
router.post('/payment', product.payment);
router.post('/paymentintent', product.paymentIntent);
router.get('/retrieve/:id', product.retrieve);
router.get('/config', product.config);


router.get('/:id', product.findOneeee);
router.delete('/:id', product.delete);
module.exports = router;
