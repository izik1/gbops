var cycleMode = 't';

var width = 16;

var tables = [];

function table_width_changed(event) {
    width = event.target.value;
    redrawTables();
}

function cycle_mode_changed(event) {
    cycleMode = event.target.value;
    redrawTables();
}

var table_tmpl_helper = {
    get_top_header: width => {
        var row = $('<tr class="top"/>').append('<th>--</th>');
        for (var i = 0; i < width; i++) {
            row.append($('<th />').html('+' + i.toString(16).toUpperCase()));
        }

        return row[0].outerHTML;
    },

    get_rows: (step, table_data) => {
        var get_prefix = (row, width) => (row * width).toString(16).toUpperCase().padStart(2, '0') + '+';
        var rows = $('<div/>');
        for (var row_num = 0; row_num < 0x100 / step; row_num++) {
            var row = $('<tr />').append(`<th>${get_prefix(row_num, step)}</th>`).appendTo(rows);
            for (var i = 0; i < step; i++) {
                row.append($.templates('#op-tmpl').render(table_data[row_num * step + i], op_tmpl_helpers));
            }
        }

        return rows.html();
    }
};

var op_tmpl_helpers = {
    timing: (min, max) => {
        switch (cycleMode) {
            case "t": return min !== max ? `${min}t-${max}t` : `${min}t`;
            case "m": return min !== max ? `${min / 4}m-${max / 4}m` : `${min / 4}m`;
            case "both":
            default: return min !== max ? `${min}t‑${max}t&#8203;/&#8203;${min / 4}m‑${max / 4}m` : `${min}t&#8203;/&#8203;${min / 4}m`; // &#8203; is a non-breaking space.
        }
    },
    color: function (group) {
        switch (group) {
            case "x16/lsm": return "MediumOrchid";
            case "x16/alu": return "LimeGreen";
            case "x8/rsb": return "Cyan";
            case "x8/alu": return "Lime";
            case "control/misc": return "Tomato";
            case "x8/lsm": return "Orchid";
            case "control/br": return "LightSalmon";
            case "unused": return "SlateGray";
            default: return "inherit";
        }
    }
};

function redrawTables() {
    var old_unprefixed = $('#unprefixed');
    var old_cbprefixed = $('#cbprefixed');

    var new_unprefixed = loadTable('unprefixed');
    var new_cbprefixed = loadTable('cbprefixed');

    if (new_unprefixed && new_cbprefixed) {
        old_unprefixed.remove();
        old_cbprefixed.remove();
        $('body').append(new_unprefixed).append(new_cbprefixed);
        return;
    }

    $.getJSON("dmgops.json", null, ops => {
        if (!new_unprefixed) new_unprefixed = loadTable('unprefixed', ops.Unprefixed);
        if (!new_cbprefixed) new_cbprefixed = loadTable('cbprefixed', ops.CBPrefixed);
        old_unprefixed.remove();
        old_cbprefixed.remove();
        $('body').append(new_unprefixed)
            .append(new_cbprefixed);
    });
}

function loadTable(id, table) {
    if (!tables[width]) tables[width] = [];
    if (!tables[width][id + '_' + cycleMode]) {
        if (!table) return null;
        tables[width][id + '_' + cycleMode] = $($.templates('#table-tmpl').render(
            { width: width, id: id, table: table },
            table_tmpl_helper
        ));
    }

    return tables[width][id + '_' + cycleMode].clone().attr('id', id);
}

function loadTables() {
    redrawTables();
}
