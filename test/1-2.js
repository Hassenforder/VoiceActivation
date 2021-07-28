document.addEventListener("DOMContentLoaded", function() {

	// simple initialisation function of the voice activation
	function voiceActivation () {
		function handler (level, topic, text) {
			if (level !== 'info') return;
			let result = undefined;
			switch (topic) {
			case 'onstart' :
				result = 'Voice activation is now normally started';
				break;
			case 'onend' :
				result = 'Voice activation is now normally stopped';
				break;
			case 'onerror' :
				result = 'Voice activation stopped abnormally';
				break;
			case 'phrase' :
				result = text;
				break;
			case 'nothing' :
				result = 'Voice activation do not find any activation';
				break;
			case 'many' :
				result = 'Voice activation find many activations';
				break;
			}
			if (result === undefined) return;
			document.getElementById("activation-report").innerText = result;
		}
		
		let va = new VoiceActivationControl(handler);
		va.initialisation ();
		va.config ();
		document.getElementById("activation-start").onclick = function (event) {
		   va.start();
		};
		document.getElementById("activation-stop").onclick = function (event) {
		   va.stop();
		};
	}

	// simple initialisation the page like in real pages
	function regularInitialisation () {
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
