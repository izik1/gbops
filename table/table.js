'use strict';

var cycle_mode = null;

var width = null;

var tables = [];

var macOS = false;

function create_op(op) {
    return $("<td>/").append($("<pre/>").html(
        `${op.Name}\n` +
        `${op.Length} ${op_timing(op)}\n` +
        `${op.Flags.Z}&#8203;${op.Flags.N}&#8203;${op.Flags.H}&#8203;${op.Flags.C}`
    )).addClass("opcode").addClass(op.Group);
}


function get_top_header(width) {
    const row = $('<tr><th>--</th></tr>')
    for (let i = 0; i < width; i++) {
        row.append($('<th/>').html('+' + i.toString(16).toUpperCase()));
    }

    return row;
}

function get_rows(step, table_data) {
    const get_prefix = row => (row * step).toString(16).toUpperCase().padStart(2, '0') + '+';
    const rows = $('<div/>');

    for (let row_num = 0; row_num < 0x100 / step; row_num++) {
        const row = $('<tr/>').append(`<th>${get_prefix(row_num)}</th>`).appendTo(rows);

        for (let i = 0; i < step; i++) {
            row.append(create_op(table_data[row_num * step + i]));
        }
    }

    return rows;
}

function cycle_timing(min, max, mode) {
    mode = mode || cycle_mode;
    switch (mode) {
        case "t": return min !== max ? `${min}t-${max}t` : `${min}t`;
        case "m": return min !== max ? `${min / 4}m-${max / 4}m` : `${min / 4}m`;
        case "both": // &#8203; is a 0 width space.
        default: return cycle_timing(min, max, 't') + "&#8203;/&#8203;" + cycle_timing(min, max, 'm');
    }
}

function op_timing(op) {
    return cycle_timing(op.TCyclesNoBranch, op.TCyclesBranch);
}

function redrawTables() {
    let new_unprefixed = loadTable('unprefixed');
    let new_cbprefixed = loadTable('cbprefixed');

    if (new_unprefixed && new_cbprefixed) {
        $('table.opcode').hide();
        new_unprefixed.show();
        new_cbprefixed.show();
        return;
    }

    // Don't use `getJson()` because it complains locally about the mimetype.
    $.ajax({
        dataType: "json",
        url: "dmgops.json",
        data: null,
        mimeType: "application/json",
        success: ops => {
            if (!new_unprefixed) new_unprefixed = loadTable('unprefixed', ops.Unprefixed);
            if (!new_cbprefixed) new_cbprefixed = loadTable('cbprefixed', ops.CBPrefixed);
            $('table.opcode').hide();
            $('body').append(new_unprefixed).append(new_cbprefixed);
        }
    })
}

function loadTable(id, table) {
    const loaded_table = $(`#${id}-${width}-${cycle_mode}`);
    if (loaded_table.length > 0) return loaded_table;
    if (!table) return null;

    return $('<table/>')
        .attr('id', `${id}-${width}-${cycle_mode}`)
        .addClass('opcode')
        .append(
            get_top_header(width),
            get_rows(width, table).children()
        ).on("dblclick", "td.opcode", table, (e) => {
            if (e.target === e.currentTarget) enableFloatingBox($(e.target), e.data);
        }).on("click", "td.opcode", table, (e) => {
            if ((!macOS && e.ctrlKey) || (macOS && e.metaKey)) enableFloatingBox($(e.target), e.data);
        })
}

function generateAdvancedTiming(cell) {
    const container = $('<div>')

    function generate(timing_points, tcycles, header_text) {
        container.append($(`<b>${header_text}:</b> (${cycle_timing(tcycles, tcycles)})<br>`));

        for (let timing_point of timing_points) {
            container.append(timing_point.Type, '<br>', timing_point.Comment, '<br>');
        }
    }

    if (cell.TimingNoBranch) generate(cell.TimingNoBranch, cell.TCyclesNoBranch, "timing w/o branch");
    if (cell.TimingBranch) generate(cell.TimingBranch, cell.TCyclesBranch, "timing with branch");

    return container;
}

function enableFloatingBox(target, table) {
    // kind of a hack, calculate the 2-dim index of the cell.
    const x = target.index() - 1;
    const width = target.parent().children().length - 1;
    const y = target.parent().index() - 1;

    const cell = table[y * width + x];

    const timing_info = generateAdvancedTiming(cell).contents();

    if (timing_info.length === 0) return;

    $('#floating-box').html(timing_info);
    $('#floating-box-container').show();
}

function disableFloatingBox() {
    $('#floating-box-container').hide();
}

$(document).ready(() => {
    function bind_get(name, fn) {
        return $(`select[name="${name}"]`).on('change', e => {
            fn(e);
            redrawTables();
        }).find(':selected').val();
    }

    $('#floating-box').click(e => e.stopPropagation());
    width = bind_get("table_width", e => width = e.target.value);
    cycle_mode = bind_get("cycle_mode", e => cycle_mode = e.target.value);
    macOS = navigator.appVersion.indexOf("Mac") != -1;
    redrawTables();
})
