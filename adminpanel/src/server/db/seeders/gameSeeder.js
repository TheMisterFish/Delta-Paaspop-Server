import Game from '../models/game'

async function seedGames() {
	var games = [{
		name: 'paaspopquiz',
		joinMidGame: true,
		responseAnswer: "wait",
		image: "default.jpg"
	},
	{
		name: 'knikkerbaan',
		joinMidGame: false,
		responseAnswer: "wait",
		image: "knikkerbaan.jpg"
	},
	{
		name: 'horserace',
		joinMidGame: false,
		responseAnswer: "wait",
		image: "horserace.jpg"
	},
	{
		name: 'ikhebliever',
		joinMidGame: true,
		responseAnswer: "wait",
		image: "wouldyourather.jpg"
	}

	];
	for (let index = 0; index < games.length; index++) {

		const game = games[index];
		Game.findOne({
			name: game.name
		}).then(async function (found_game) {
			if (!found_game) {
				console.log("no game found with name:", game.name, "making it.");
				var newGame = new Game(game);
				await newGame.save();
			}
		});
	}
}

try {
	seedGames();
} catch (e) {
	console.error(e);
}
