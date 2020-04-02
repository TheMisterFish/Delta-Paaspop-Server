const mongoose = require('mongoose');

const GameSchema = mongoose.Schema({
	name: {
		type: String,
		required: [true, "name is required"]
	},
	image: {
		type: String,
		default: "default.jpg"
	},
	joinMidGame: {
		type: Boolean,
		default: true
	},
	responseAnswer: {
		type: String,
		default: "wait"
	},
	histories: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'History'
	}],
	points: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Point'
	}]
}, {
	timestamps: true
});


module.exports = mongoose.model('Game', GameSchema);