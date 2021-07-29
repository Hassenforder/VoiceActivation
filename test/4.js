document.addEventListener("DOMContentLoaded", function() {

	// simple initialisation function of the voice activation
	function voiceActivation () {
		let va = new VoiceActivationUI(undefined, undefined);
	}

	// simple initialisation the page like in real pages
	function regularInitialisation () {
		document.getElementById("activation-toggle-stop").onclick = function (event) {
			if (event.target.checked) {
				document.getElementById("activation-stop").style.display = "none";
			} else {
				document.getElementById("activation-stop").style.display = "inline";
			}
		};
		let count = 0;
		document.getElementById("mid-submit").onclick = function (event) {
			event.preventDefault();
			if ((++count % 2) !== 0) {
				document.getElementById("mid-submitHelp").innerText = 'La connexion par le milieu a échoué';
			} else {
				document.getElementById("mid-submitHelp").innerText = 'Vous êtes maintenant connecté par le milieu';
			}
		};
		document.getElementById("right-submit").onclick = function (event) {
			event.preventDefault();
			if ((++count % 2) !== 0) {
				document.getElementById("right-submitHelp").innerText = 'La connexion par le droit a échoué';
			} else {
				document.getElementById("right-submitHelp").innerText = 'Vous êtes maintenant connecté par le droit';
			}
		};
		document.getElementById("left-submit").onclick = function (event) {
			event.preventDefault();
			if ((++count % 2) !== 0) {
				document.getElementById("left-submitHelp").innerText = 'La connexion par le gauche a échoué';
			} else {
				document.getElementById("left-submitHelp").innerText = 'Vous êtes maintenant connecté par le gauche';
			}
		};
	}

	// order is not relevant
	voiceActivation ();
	regularInitialisation ();
	console.log ('done');
});
