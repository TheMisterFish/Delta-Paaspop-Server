const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt'),
	SALT_WORK_FACTOR = 10;

const UserSchema = mongoose.Schema({
	username: {
		type: String,
		lowercase: true,
		unique: true,
		required: [true, "can't be blank"],
		match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
		index: true
	},
	email: {
		type: String,
		lowercase: true,
		unique: true,
		required: [true, "can't be blank"],
		match: [/\S+@\S+\.\S+/, 'is invalid'],
		index: true
	},
	nickname: {
		type: String,
		required: true,
		unique: true,	
	},
	password: {
		type: String,
		required: true,
	},
	points: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Point'
	}]
}, {
	timestamps: true
});

UserSchema.plugin(uniqueValidator, {
	message: 'is already taken.'
});

UserSchema.pre('save', function (next) {
	var user = this;
	// only hash the password if it has been modified (or is new)
	if (!user.isModified('password')) return next();
	// generate a salt
	bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
		if (err) return next(err);
		// hash the password using our new salt
		bcrypt.hash(user.password, salt, function (err, hash) {
			if (err) return next(err);
			// override the cleartext password with the hashed one
			user.password = hash;
			next();
		});
	});
});

UserSchema.methods.comparePassword = function (password) {
	return bcrypt.compareSync(password, this.password);
};


module.exports = mongoose.model('User', UserSchema);