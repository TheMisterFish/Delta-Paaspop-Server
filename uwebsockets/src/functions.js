module.exports = {
	AB2String: function (message) {
		return String.fromCharCode.apply(null, new Uint8Array(message));
	},
	hashedRemoteAdress: function (remoteAdress) {
		return new Uint8Array(remoteAdress).toString().split(",").join("");
	},
	getHeaderObject: function (req) {
		let user = {};
		req.forEach((k, v) => {
			if (v.includes(', ') && k == 'sec-websocket-protocol') {
				user[v.split(', ')[0]] = v.split(', ')[1];
			} else {
				user[k] = v;
			}
		});
		return user;
	},
	readJson(res, cb, err) {
		let buffer;
		/* Register data cb */
		res.onData((ab, isLast) => {
			let chunk = Buffer.from(ab);
			if (isLast) {
				let json;
				if (buffer) {
					try {
						json = JSON.parse(Buffer.concat([buffer, chunk]));
					} catch (e) {
						/* res.close calls onAborted */
						res.close();
						return;
					}
					cb(json);
				} else {
					try {
						json = JSON.parse(chunk);
					} catch (e) {
						/* res.close calls onAborted */
						res.close();
						return;
					}
					cb(json);
				}
			} else {
				if (buffer) {
					buffer = Buffer.concat([buffer, chunk]);
				} else {
					buffer = Buffer.concat([chunk]);
				}
			}
		});
		res.onAborted(err);

	}
}