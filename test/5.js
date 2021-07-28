document.addEventListener("DOMContentLoaded", function() {

	let va = undefined;

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
		
		va = new VoiceActivationControl(handler);
		va.initialisation ();
		document.getElementById("activation-start").onclick = function (event) {
		   va.start();
		};
		document.getElementById("activation-stop").onclick = function (event) {
		   va.stop();
		};
	}

	// simple initialisation the page like in real pages
	function regularInitialisation () {
		let grid = $("#grid").bootgrid({
			rowCount: [ 5, 10, 20, -1 ],
			formatters: {
				"actions": function(column, row) {
					return "<button type=\"button\" class=\"btn btn-xs btn-default command-edit\" data-row-id=\"" + row.id + "\"><span class=\"fa fa-pencil-alt\"></span></button> " + 
						"<button type=\"button\" class=\"btn btn-xs btn-default command-delete\" data-row-id=\"" + row.id + "\"><span class=\"fa fa-trash\"></span></button>";
				}
			}
		}).on("loaded.rs.jquery.bootgrid", function() {
			/* Executes after data is loaded and rendered */
			grid.find(".command-edit").on("click", function(e) {
				alert("You pressed edit on row: " + $(this).data("row-id"));
			}).end().find(".command-delete").on("click", function(e) {
				alert("You pressed delete on row: " + $(this).data("row-id"));
			});
			va.config ();
		});
	}

	// order is relevant as bootgrid build the pagination as loaded
	// and should arrive before activation occurs so dom element in grids can be found
	// activation configuration moved in the loaded call back of the grid
	regularInitialisation ();
	voiceActivation ();
	console.log ('done');
});
