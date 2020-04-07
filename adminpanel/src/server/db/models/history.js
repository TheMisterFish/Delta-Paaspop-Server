const mongoose = require('mongoose');

const HistorySchema = mongoose.Schema({
	game: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Game'
	},
	game_token: {
		type: String,
		required: true
	},
	users: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}],
	points: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Point'
	}],
	gameStarted: {
		type: Date,
		required: [true, "can't be blank"]
	},
	gameEnded: {
		type: Date,
		default: null
	},
	roundStarted:{
		type: Boolean,
		default: false
	}
}, {
	timestamps: true
});

module.exports = mongoose.model('History', HistorySchema);