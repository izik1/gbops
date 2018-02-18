var op_tmpl_helpers = {
    timing: (min, max) => min !== max ? `${min}t‑${max}t&#8203;/&#8203;${min/4}m‑${max/4}m` : `${min}t&#8203;/&#8203;${min/4}m`, // &#8203; is a non-breaking space.
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
        $('body').append(loadTable16x(ops.Unprefixed))
            .append(loadTable16x(ops.CBPrefixed));
    });
}
