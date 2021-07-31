document.addEventListener("DOMContentLoaded", function() {

	let va = undefined;
	let steps = 0;
	const STEP_GRID1 = 0x01;
	const STEP_GRID2 = 0x02;
	const STEP_ALL = STEP_GRID1 | STEP_GRID2;

	// simple initialisation function of the voice activation
	function voiceActivation () {
		function handler (level, topic, text) {
			if (level !== 'info') return;
			let result = undefined;
			switch (topic) {
			case 'oninit' :
				result = 'Voice activation is initialiasing : ';+text
				break;
			case 'onready' :
				result = 'Voice activation is now initialized';
				va.config ();
				break;
			case 'onstart' :
				result = 'Voice activation is now normally started';
				break;
			case 'onend' :
				result = 'Voice activation is now normally stopped';
				break;
			case 'onerror' :
				result = 'Voice activation stopped abnormally';
				break;
			case 'onphrase' :
				result = text;
				break;
			case 'onnothing' :
				result = 'Voice activation do not find any activation';
				break;
			case 'onmany' :
				result = 'Voice activation find many activations';
				break;
			}
			if (result === undefined) return;
			document.getElementById("activation-report").innerText = result;
		}
		
		va = new VoiceActivationControl(handler);
		va.initialisation ();
		document.getElementById("activation-start").onclick = function (event) {
		   va.start();
		};
		document.getElementById("activation-stop").onclick = function (event) {
		   va.stop();
		};
	}

	function multiConfiguration (step) {
		// activation configuration only called when all grids are loaded
		steps |= step;
		if (steps === STEP_ALL) {
			va.config ();
		}
	}
	
	// simple initialisation the page like in real pages
	function regularInitialisation () {
		let grid1 = $("#grid1").bootgrid({
			rowCount: 3,
			formatters: {
				"actions": function(column, row) {
					return "<button type=\"button\" class=\"btn btn-xs btn-default command-edit\" data-row-id=\"" + row.id + "\"><span class=\"fa fa-pencil-alt\"></span></button> " + 
						"<button type=\"button\" class=\"btn btn-xs btn-default command-delete\" data-row-id=\"" + row.id + "\"><span class=\"fa fa-trash\"></span></button>";
				}
			}
		}).on("loaded.rs.jquery.bootgrid", function() {
			/* Executes after data is loaded and rendered */
			grid1.find(".command-edit").on("click", function(e) {
				alert("You pressed edit on row: " + $(this).data("row-id"));
			}).end().find(".command-delete").on("click", function(e) {
				alert("You pressed delete on row: " + $(this).data("row-id"));
			});
			multiConfiguration (STEP_GRID1);
		});
		let grid2 = $("#grid2").bootgrid({
			rowCount: 4,
			formatters: {
				"actions": function(column, row) {
					return "<button type=\"button\" class=\"btn btn-xs btn-default command-edit\" data-row-id=\"" + row.id + "\"><span class=\"fa fa-pencil-alt\"></span></button> " + 
						"<button type=\"button\" class=\"btn btn-xs btn-default command-delete\" data-row-id=\"" + row.id + "\"><span class=\"fa fa-trash\"></span></button>";
				}
			}
		}).on("loaded.rs.jquery.bootgrid", function() {
			/* Executes after data is loaded and rendered */
			grid2.find(".command-edit").on("click", function(e) {
				alert("You pressed edit on row: " + $(this).data("row-id"));
			}).end().find(".command-delete").on("click", function(e) {
				alert("You pressed delete on row: " + $(this).data("row-id"));
			});
			multiConfiguration (STEP_GRID2);
		});
	}

	// order is relevant as bootgrid build the pagination loaded
	// and should arrive before activation so dom can be found
	regularInitialisation ();
	voiceActivation ();
	console.log ('done');
});
