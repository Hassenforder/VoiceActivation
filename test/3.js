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
		document.getElementById("nameShow").onclick = function (event) {
			if (event.target.checked) {
				document.getElementById("inputAlt1Name").style.display = "none";
			} else {
				document.getElementById("inputAlt1Name").style.display = "block";
			}
		};
		document.getElementById("altDisable").onclick = function (event) {
		   document.getElementById("inputAlt2Name").disabled = event.target.checked;
		};
		let count = 0;
		document.getElementById("submit").onclick = function (event) {
			event.preventDefault();
			if ((++count % 2) !== 0) {
				document.getElementById("submitHelpSuccess").style.display = "none";
				document.getElementById("submitHelpError").style.display = "block";
			} else {
				document.getElementById("submitHelpError").style.display = "none";
				document.getElementById("submitHelpSuccess").style.display = "block";
			}
		};
	}

	// order is not relevant
	voiceActivation ();
	regularInitialisation ();
	console.log ('done');
});
