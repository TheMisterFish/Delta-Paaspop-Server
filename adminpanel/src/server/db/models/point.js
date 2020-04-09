const mongoose = require('mongoose');

const PointsSchema = mongoose.Schema({
	game: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Game'
	},
	history: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'History'
	},
	reason: {
		type: String
	},
	points: {
		type: Number,
		required: [true, "can't be blank"],
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}
}, {
	timestamps: true
});

module.exports = mongoose.model('Point', PointsSchema);