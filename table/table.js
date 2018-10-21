var cycle_mode = null;

var width = null;

var tables = [];

group_colors = {
    "x16/lsm": "MediumOrchid",
    "x16/alu": "LimeGreen",
    "x8/rsb": "Cyan",
    "x8/alu": "Lime",
    "control/misc": "Tomato",
    "x8/lsm": "Orchid",
    "control/br": "LightSalmon",
    "unused": "SlateGray"
};

function table_width_changed(event) {
    width = event.target.value;
    redrawTables();
}

function cycle_mode_changed(event) {
    cycle_mode = event.target.value;
    redrawTables();
}

function create_op(op) {
    if(op.Name != "UNUSED")
        span = $("<span/>").html(`${op.Name}<br/>
            ${op.Length} ${op_tmpl_helpers.timing(op.TCyclesMin, op.TCyclesMax)}<br>
            ${op.Flags.Z}&#8203;${op.Flags.N}&#8203;${op.Flags.H}&#8203;${op.Flags.C}`);
    else span = null;
    td = $("<td>/").append(span).css("background-color", op_tmpl_helpers.color(op.Group));
    if(op.TimingMax !== undefined && op.Name != "UNUSED") {
        td.dblclick(op, enableFloatingBox);
    }

    return td; 
}

var table_tmpl_helper = {
    get_top_header: width => {
        var row = $('<tr><th>--</th></tr>')
        for (var i = 0; i < width; i++) {
            row.append($('<th/>').html('+' + i.toString(16).toUpperCase()));
        }

        return row[0].outerHTML;
    },

    get_rows: (step, table_data) => {
        var get_prefix = row => (row * step).toString(16).toUpperCase().padStart(2, '0') + '+';
        var rows = $('<div/>');
        for (var row_num = 0; row_num < 0x100 / step; row_num++) {
            var row = $('<tr/>').append(`<th>${get_prefix(row_num)}</th>`).appendTo(rows);
            for (var i = 0; i < step; i++) {
                current = table_data[row_num * step + i];
                row.append(create_op(current));
            }
        }

        return rows;
    }
};

var op_tmpl_helpers = {
    timing: (min, max) => {
        switch (cycle_mode) {
            case "t": return min !== max ? `${min}t-${max}t` : `${min}t`;
            case "m": return min !== max ? `${min / 4}m-${max / 4}m` : `${min / 4}m`;
            case "both":
            default: return min !== max ? `${min}t‑${max}t&#8203;/&#8203;${min / 4}m‑${max / 4}m` : `${min}t&#8203;/&#8203;${min / 4}m`; // &#8203; is a non-breaking space.
        }
    },

    color: group => group_colors[group] ? group_colors[group] : "inherit"
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
    if (!tables[width][id + '_' + cycle_mode]) {
        if (!table) return null;
        table_tmp = $('<table/>').attr('id', id).append(table_tmpl_helper.get_top_header(width)).append(table_tmpl_helper.get_rows(width, table).children())
        tables[width][id + '_' + cycle_mode] = table_tmp;
    }
    
    return tables[width][id + '_' + cycle_mode].attr('id', id);
}

function init() {
    function bind_get(name, fn) {
        var v = $(`select[name="${name}"]`);
        v.on('change', fn);
        return v.find(':selected').val();
    }

    $('#floating-box').click((e) => e.stopPropagation());
    width = bind_get("table_width", table_width_changed);
    cycle_mode = bind_get("cycle_mode", cycle_mode_changed);
    redrawTables();
}

function enableFloatingBox(event, cell, supportBubbling) {
    if (supportBubbling || event.target === event.currentTarget) {
        cell = event.data;
        $('#floating-box').html("");

        for(i = 0; i < cell.TimingMax.length; i++) {
            $('#floating-box').append(cell.TimingMax[i].Type + "<br/>");
            if(cell.TimingMax[i].Comment !== "") {
                $('#floating-box').append(cell.TimingMax[i].Comment + "<br/>");
            }
        }

        $('#floating-box-container').show();
    }
}

function disableFloatingBox() {
    $('#floating-box-container').hide();
}
