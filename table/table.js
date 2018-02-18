var cycleMode = "t";

function cycle_mode_changed(event) { // this is done very inefficiently
	cycleMode = event.target.value;
	redrawTables();
}

var op_tmpl_helpers = {
    timing: (min, max) => {
		switch(cycleMode) {
			case "t": return min !== max ? `${min}t-${max}t` : `${min}t`
			case "m": return min !== max ? `${min/4}m-${max/4}m` : `${min/4}m`
			case "both":
			default: return min !== max ? `${min}t‑${max}t&#8203;/&#8203;${min/4}m‑${max/4}m` : `${min}t&#8203;/&#8203;${min/4}m` // &#8203; is a non-breaking space.
		}
	},
	color: function(group) {
		switch(group) {
			case "x16/lsm": return "MediumOrchid"
			case "x16/alu": return "LimeGreen"
			case "x8/rsb": return "Cyan"
			case "x8/alu": return "Lime"
			case "control/misc": return "Tomato"
			case "x8/lsm": return "Orchid"
			case "control/br": return "LightSalmon"
			case "unused": return "SlateGray"
			default: return "inherit"
		}
	}
};

function redrawTables() {
	var old_unprefixed = $('#unprefixed');
	var old_cbprefixed = $('#cbprefixed');
    $.getJSON("dmgops.json", null, ops => {
		var new_unprefixed = loadTable16x(ops.Unprefixed).attr('id', 'unprefixed');
		var new_cbprefixed = loadTable16x(ops.CBPrefixed).attr('id', 'cbprefixed');
        old_unprefixed.remove();
		old_cbprefixed.remove();
		$('body').append(new_unprefixed)
            .append(new_cbprefixed);
    });
}

function loadTable16x(op_table) {
    var mapparr = fn => Array.from(Array(0x10).keys()).map(fn);
    return $("<table />").append($("<tr />").append($("<th>--</th>"),
        ...mapparr(i => $(`<th>+${i.toString(16)}</th>`))),
        ...mapparr(i => $("<tr />").append(
            $(`<th>${i.toString(16)}+</th>`),
            ...mapparr(j => $.templates("#op-tmpl").render(op_table[i * 0x10 + j], op_tmpl_helpers))
        ))
    );
}

function loadTables() {
    $.getJSON("dmgops.json", null, ops => {
        $('body').append(loadTable16x(ops.Unprefixed).attr('id', 'unprefixed'))
            .append(loadTable16x(ops.CBPrefixed).attr('id', 'cbprefixed'));
    });
}
