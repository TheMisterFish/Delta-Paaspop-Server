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

		var convertedPointsArray = calculatePaaspopPoints(req.body.points);
		
		//Try to save the object into MongoDB
		Point.insertMany(convertToPointObjectArray(game._id, req.body.reason, convertedPointsArray))
			.then(doc => res.status(200).send(doc))
			.catch(err => res.status(500).send(err));
	});
}

//Reads the property called 'points' in all array items.
//Converts it to Paaspop Points and adds the result as a new property called 'paaspopPoints' 
function calculatePaaspopPoints(pointsArray)
{
	var paaspopMaxPoints = 75;
	var participationPercentage = 10;
	var participationPoints = paaspopMaxPoints / 100 * participationPercentage;

	var multipliedPointsArray = reduceCeil(pointsArray);

	//Get the highest amount of points any user has recieved. (Score of the winner)
	var maxPoints = multipliedPointsArray.reduce((previous,current) => (previous.points > current.points) ? previous : current).points
					+ participationPoints;

	multipliedPointsArray.forEach(user =>
	{
		user.points += participationPoints;//Add 10% of participation points to the user.

		var pointPercentage = user.points * 100 / maxPoints;
		user.paaspopPoints = Math.ceil(pointPercentage / 100 * paaspopMaxPoints);
	});
	console.log(multipliedPointsArray);//dEBUG
	return multipliedPointsArray;
}

function reduceCeil(pointsArray)
{
	pointsArray.forEach(user => user.points = user.points * 100);
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