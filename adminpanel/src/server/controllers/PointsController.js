import Point from '../db/models/point'
import History from '../db/models/history'

exports.game = async function (req, res) {
	/**
	 * Get /points/game/:id 
	 * @export *
	 * @param { any } req
	 * @param { any } res
	 * @returns { res } All points of a certain game *
	 */
	Points.find({
		game: req.params.id
	}).populate('game').then(function (points) {
		res.send(points);
	})
}
exports.apply_points = async function (req, res) {
	/**
	 * Post /points/apply
	 * @export *
	 * @param { any } req
	 * @param { any } res
	 * @returns { boolean } Whether the points are applied to the game or not
	 */
	
	//Find active game
	History.findOne({
		gameEnded: null
	}).then(function (history) {
		
		if (!history)
			return res.status(500).send("No game is running.");//Error: No game is running.
		
		var game = history.game;

		//TODO: Convert points to specified paaspop-points
		var convertedPoints = convertToPaaspopPoints(history, req.body.points);
		console.log(convertedPoints);

		var newPoint = new Point(
		{
			game: game._id,
			reason: req.body.reason,
			points: convertedPoints,
			user: req.body.u_id
		});
		return res.status(501).send("DEBUG: save functionality reached, but skipped");

		//TODO: Use mongoose or mongoDB bulk insertion (insertmany)
		newPoint.save()
			.then(item => {
				/*DEBUG*/console.log("##### Object Saved #####");
				/*DEBUG*/console.log(item);
				res.status(201).send("Record saved");
			})
			.catch(err => {
				res.status(500).send(err);
			});
	});
}

function convertToPaaspopPoints(gHistory, points)
{
	var userCount = gHistory.users.length;

	//TODO: get all users and calucate all points that have been given.

	var maxPoints = 500;//TODO: This is game independend, either receive it from DB or pass in by body.
	var paaspopMaxPoints = 100;

	var pointPercentage = points * 100 / maxPoints;
	var convertedPoints = pointPercentage / 100 * paaspopMaxPoints;
	
	return convertedPoints;
}