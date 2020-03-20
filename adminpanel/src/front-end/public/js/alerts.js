async function openSuccess(message, time = 2000) {
	var success = document.getElementById("alert_success");
	success.innerHTML = message;
	success.classList.remove("display-none");
	await wait(time).then(async function (nothing) {
		success.classList.add("fadeOut");
		await wait(500).then(function (nothing) {
			success.classList.add("display-none");
			success.classList.remove("fadeOut");
		});
	})
}

async function openWarning(message, time = 2000) {
	var warning = document.getElementById("alert_warning");
	warning.innerHTML = message;
	warning.classList.remove("display-none");
	await wait(time).then(async function (nothing) {
		warning.classList.add("fadeOut");
		await wait(500).then(function (nothing) {
			warning.classList.add("display-none");
			warning.classList.remove("fadeOut");
		});
	})
}

async function openDanger(message, time = 2000) {
	var danger = document.getElementById("alert_danger");
	danger.innerHTML = message;
	danger.classList.remove("display-none");
	await wait(time).then(async function (nothing) {
		danger.classList.add("fadeOut");
		await wait(500).then(function (nothing) {
			danger.classList.add("display-none");
			danger.classList.remove("fadeOut");
		});
	})
}

async function wait(ms) {
	return new Promise(resolve => {
		setTimeout(resolve, ms);
	});
}