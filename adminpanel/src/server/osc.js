require('dotenv').config()
const OSC = require('osc-js')

import {
	GameController
} from './controllers'

const osc_port = process.env.OSC_URL_PORT;
var debug = process.env.DEBUG_MODE == "true";

const osc = new OSC()

osc.on('/paaspopminigames', message => {
	if(debug)
		console.log(message.args)
	if("start_game" in message.args){
		if(debug)
			console.log("Trying to start game (OSC signal)");

		if(GameController.osc_start_game() == true){
			if(debug)
				console.log("Started a game (OSC signal)")
			const message = new OSC.Message('/', true)
			osc.send(message)
		} else {
			if(debug)
				console.log("Couldn't start a game (OSC signal)")
			const message = new OSC.Message('/', false)
			osc.send(message)
		}

	} else if("stop_game" in message.args){
		if(debug)
			console.log("Trying to stop game (OSC signal)");
		
		if(GameController.osc_stop_game() == true){
			if(debug)
				console.log("Stopped a game (OSC signal)")
			const message = new OSC.Message('/', true)
			osc.send(message)
		} else {
			if(debug)
				console.log("Couldn't stop a game (OSC signal)")
			const message = new OSC.Message('/', false)
			osc.send(message)
		}
	}
})

osc.on('open', () => {
	if(debug)
		console.log("OSC Client opened, sending 'true'")
	const message = new OSC.Message('/', true)
	osc.send(message)
})

exports.osc_connect = function(){
	osc.open({
		port: parseInt(osc_port)
	})
}

exports.osc_status = function(){
	let status = "NO STATUS"
	switch (osc.status()) {
		case OSC.STATUS.IS_OPEN:
			status = "IS OPEN"
			break;
		case OSC.STATUS.IS_NOT_INITIALIZED:
			status = "IS NOT INITIALIZED"
			break;
		case OSC.STATUS.IS_CONNECTING:
			status = "IS CONNECTING"
			break;
		case OSC.STATUS.IS_CLOSING:
			status = "IS CLOSING"
			break;
		case OSC.STATUS.IS_CLOSED:
			status = "IS CLOSED"
			break;
		default:
			break;
	}
	return status;
}