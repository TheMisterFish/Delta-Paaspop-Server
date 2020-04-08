import Point from '../db/models/point'
import History from '../db/models/history'
import Game from '../db/models/game'
import User from '../db/models/user'

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
	 * @returns { HttpResponse } Whether the points are applied to the game or not
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
			.then(function(doc)
			{
				updateGameUsersHistory(doc, history);
				console.log(doc);
				res.status(200).send(doc);
			})
			.catch(err => res.status(500).send(err));
	});
}

//Reads the property called 'points' in all array items.
//Converts it to Paaspop Points and adds the result as a new property called 'paaspopPoints' 
function calculatePaaspopPoints(pointsArray)
{
	const paaspopMaxPoints = 75;
	const participationPercentage = 10;
	const participationPoints = paaspopMaxPoints / 100 * participationPercentage;

	var multipliedPointsArray = reduceCeil(pointsArray);

	//Get the highest amount of points any user has recieved. (Score of the winner)
	var maxPoints = multipliedPointsArray.reduce((previous,current) => (previous.points > current.points) ? previous : current).points
					+ participationPoints;

	let pointPercentage;
	multipliedPointsArray.forEach(user =>
	{
		pointPercentage = user.points * 100 / maxPoints;
		user.paaspopPoints = Math.ceil(pointPercentage / 100 * paaspopMaxPoints);

		user.paaspopPoints += participationPoints;//Add 10% of participation points to the user.
	});

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

	let newPoint;
	userPointArray.forEach(el =>
	{
		newPoint = new Point(
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

async function updateGameUsersHistory(points,history)
{
	var ids = points.map(p => p._id);
	var gameId = points[0].game;
	var historyId = history._id;

	//Save points into Games
	Game.updateOne({_id: gameId},
	{
		$push:{
			"points": ids
		}
	});

	//Save points into Users
	for (const obj of points)
	{
		let user = await User.findById(obj.user);

		if(!user)
			continue;

		user.points.push(obj._id);
		user.save();
	}

	//Save points into Histories
	History.updateOne({_id: history._id },
	{
		$push:{
			"points": ids
		}
	});
}