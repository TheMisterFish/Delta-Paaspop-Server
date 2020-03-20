async function openModal(type) {
	var model_mask = document.getElementById("model_mask");
	var model_title = document.getElementById("model_title");
	var model_text = document.getElementById("model_text");
	var model_footer = document.getElementById("model_footer");

	if (type == 'stop_game') {
		model_title.innerHTML = "Spel stoppen"
		model_text.innerHTML = "Weet je zeker dat je het spel wilt stoppen?";
		let confirm_button = "<button class='button button-success' onClick='stop_game(), closeModal()'>Stop spel</button>";
		let cancel_button = "<button class='button button-danger' onClick='closeModal()'>Cancel</button>";
		model_footer.innerHTML += confirm_button;
		model_footer.innerHTML += cancel_button;
		model_mask.classList.remove("display-none");
	}
}

async function closeModal() {
	var model_mask = document.getElementById("model_mask");
	var model_title = document.getElementById("model_title");
	var model_text = document.getElementById("model_text");
	var model_footer = document.getElementById("model_footer");

	model_mask.classList.add("fadeOut");

	await wait(500).then(function (nothing) {
		model_title.innerHTML = "";
		model_text.innerHTML = "";
		model_footer.innerHTML = "";
		model_mask.classList.add("display-none");
		model_mask.classList.remove("fadeOut");
	})
}

async function wait(ms) {
	return new Promise(resolve => {
		setTimeout(resolve, ms);
	});
}