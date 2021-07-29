document.addEventListener("DOMContentLoaded", function() {

	let va = undefined;

	// simple initialisation function of the voice activation
	function voiceActivation () {
		va = new VoiceActivationUI(undefined, undefined);
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
			va.refresh ("#grid1-tab", undefined);
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
			va.refresh ("#grid2-tab", undefined);
		});
	}

	// order is relevant as bootgrid after load notify  a loaded event
	// and we use it to refresh the activation
	// the va object mist be living
	voiceActivation ();
	regularInitialisation ();
	console.log ('done');
});
