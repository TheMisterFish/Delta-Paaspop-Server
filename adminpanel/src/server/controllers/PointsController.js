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
		
		//TODO: Check if input is correctly formatted

		var game = history.game;

		var convertedPointsArray = calculatePaaspopPoints(history, req.body.points);

		var pointObjects = convertToPointObjectArray(game._id, req.body.reason, convertedPointsArray);
		
		//Try to save the object into MongoDB
		Point.insertMany(pointObjects)
			.then(doc => res.status(200).send(doc))
			.catch(err => res.status(500).send(err));
	});
}

//Reads the property called 'points' in all array items.
//Converts it to Paaspop Points and adds the result as a new property called 'paaspopPoints' 
function calculatePaaspopPoints(gHistory, pointsArray)
{
	var maxPoints = pointsArray.reduce((a,b) => a + b.points, 0);//Get the sum of all points.
	var paaspopMaxPoints = 100;

	pointsArray.forEach(user =>
	{
		var pointPercentage = user.points * 100 / maxPoints;
		user.paaspopPoints = parseInt(pointPercentage / 100 * paaspopMaxPoints);
	});

	return pointsArray;
}

function convertToPointObjectArray(gameId, reason, userPointArray)
{
	var output = [];

	userPointArray.forEach(el =>
	{
		var newPoint = new Point(
		{
			game: gameId,
			reason: reason,
			points: el.paaspopPoints,
			user: el.user_id
		});
		output.push(newPoint);
	});

	return output;
}