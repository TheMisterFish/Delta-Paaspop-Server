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
		var game = history.game;
		return game;
		//TODO: Return error if no game is running
		//if (!game)
			//res.send(false);

		//TODO: Convert points to specified paaspop-points

		var newPoint = new Point(
		{
			game: game._id,
			reason: req.body.reason,
			points: req.body.points,
			user: req.body.u_id
		});

		newPoint.save()
			.then(item => {
				/*DEBUG*/console.log("##### Object Saved #####");
				/*DEBUG*/console.log(item);
				res.send(true);
			})
			.catch(err => {
				/*DEBUG*/console.log(err);
				res.send(err);
			});
	});
}