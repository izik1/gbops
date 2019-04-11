'use strict';

import _tables from './dmgops.json'
import { Opcode, Flags, OpcodeTable } from "./opcode"

const tables: OpcodeTable = _tables;

import { runOpcodeSearch } from "./search";

var cycle_mode: string | null = null;

function paddedOpcode(number: number) {
    return number.toString(16).toUpperCase().padStart(2, '0');
}

function create_op(op: Opcode) {
    if(op.Name === "UNUSED") return $(`<td class="opcode ${op.Group}"></td>`);
    else return $("<td/>").append($("<div/>").append($("<pre/>").html(
        `${op.Name}\n` +
        `${op.Length} ${op_timing(op)}\n` +
        `${op.Flags.Z}&#8203;${op.Flags.N}&#8203;${op.Flags.H}&#8203;${op.Flags.C}`
    ))).addClass("opcode").addClass(op.Group);
}

function get_top_header(width: number) {
    const row = $('<tr><th>--</th></tr>')
    for (let i = 0; i < width; i++) {
        row.append(`<th>${'+' + i.toString(16).toUpperCase()}</th>`);
    }

    return row;
}

function get_rows(step: number, table_data: Opcode[]) {
    const get_prefix = (row: number) => paddedOpcode(row * step) + '+';
    const rows = $('<div/>');

    for (let row_num = 0; row_num < 0x100 / step; row_num++) {
        const row = $('<tr/>').append(`<th>${get_prefix(row_num)}</th>`).appendTo(rows);

        for (let i = 0; i < step; i++) {
            row.append(create_op(table_data[row_num * step + i]));
        }
    }

    return rows;
}

function cycle_timing(min: number, max: number, mode=cycle_mode): string {
    switch (mode) {
        case "t": return min !== max ? `${min}t-${max}t` : `${min}t`;
        case "m": return min !== max ? `${min / 4}m-${max / 4}m` : `${min / 4}m`;
        case "both": // &#8203; is a 0 width space.
        default: return cycle_timing(min, max, 't') + "&#8203;/&#8203;" + cycle_timing(min, max, 'm');
    }
}

function op_timing(op: Opcode) {
    return cycle_timing(op.TCyclesNoBranch, op.TCyclesBranch);
}

function redrawTables(width: number) {
    let new_unprefixed = loadCachedTable('unprefixed', width);
    let new_cbprefixed = loadCachedTable('cbprefixed', width);

    if (new_unprefixed && new_cbprefixed) {
        $('input[name="search-box"]').trigger('keyup');
        $('table.opcode').hide();
        new_unprefixed.show();
        new_cbprefixed.show();
        return;
    }

    if (!new_unprefixed) new_unprefixed = loadTable('unprefixed', width, tables.Unprefixed);
    if (!new_cbprefixed) new_cbprefixed = loadTable('cbprefixed', width, tables.CBPrefixed);

    $('table.opcode').hide();
    $('body').append(new_unprefixed).append(new_cbprefixed);
    $('input[name="search-box"]').trigger('keyup');
}

function loadTable(id: string, width: number, table: Opcode[]): JQuery<HTMLElement> {
    return $('<table/>')
        .attr('id', `${id}-${width}-${cycle_mode}`)
        .addClass('opcode')
        .append(`<caption>${id}:</caption>`)
        .append(
            get_top_header(width),
            get_rows(width, table).children()
        ).on("click", "td.opcode:not(.hidden)", table, (e) => {
            enableFloatingBox($(e.currentTarget), e.data);
       });
}

function loadCachedTable(id: string, width: number): JQuery<HTMLElement> | null {
    const loaded_table = $(`#${id}-${width}-${cycle_mode}`);
    if (loaded_table.length > 0) return loaded_table;
    else return null;
}

function generateAdvancedTiming(cell: Opcode) {
    const table = $('<table/>')
        .append("<caption><strong>Timing</strong></caption>")
        .append($('<tr>')
            .append(cell.TimingNoBranch ? `<th>without branch (${cycle_timing(cell.TCyclesNoBranch, cell.TCyclesNoBranch)})</th>` : "")
            .append(cell.TimingBranch ? `<th>with branch (${cycle_timing(cell.TCyclesBranch, cell.TCyclesBranch)})</th>` : ""));
        
    if (cell.TimingNoBranch && cell.TimingBranch) {
        for (let i = 0; i < Math.max(cell.TimingNoBranch.length, cell.TimingBranch.length) * 2; i++) {
            if (i % 2 == 0) {
                table.append($("<tr/>")
                    .append($('<td/>').append(cell.TimingNoBranch[i / 2] && cell.TimingNoBranch[i / 2].Type))
                    .append($('<td/>').append(cell.TimingNoBranch[i / 2] && cell.TimingBranch[i / 2].Type)));
            } else {
                const index = (i - 1) / 2;
                table.append($("<tr/>")
                    .append($('<td/>').append(cell.TimingNoBranch[index] && cell.TimingNoBranch[index].Comment))
                    .append($('<td/>').append(cell.TimingBranch[index] && cell.TimingBranch[index].Comment)));
            }
        }
    } else {
        let points = cell.TimingNoBranch || cell.TimingBranch;
        if (points) {
            for (let point of points) {
                table.append(`<tr><td>${point.Type}</td></tr>`).append(`<tr><td>${point.Comment}</td></tr>`);
            }
        }
    }

    return table;
}

function getFlagText(flag: string) {
    switch(flag) {
        case "-": return "unmodified";
        case "0": return "unset";
        case "1": return "set";
        default: return "dependent";
    }
}

function generateAdvancedFlags(flags: Flags) {
    return $('<table class="flag-table"/>')
        .append("<caption><strong>Flags</strong></caption>")
        .append(`<tr><th>Zero</th><td>${getFlagText(flags.Z)}</td>`)
        .append(`<tr><th>Negative</th><td>${getFlagText(flags.N)}</td>`)
        .append(`<tr><th>Half&nbsp;Carry</th><td>${getFlagText(flags.H)}</td>`)
        .append(`<tr><th>Carry</th><td>${getFlagText(flags.C)}</td>`);
}

function enableFloatingBox(target: JQuery<any>, table: Opcode[]) {
    // kind of a hack, calculate the 2-dim index of the cell.
    const x = target.index() - 1;
    const width = target.siblings().length;
    const y = target.parent().index() - 1;

    const index = y * width + x;
    const cell = table[index];

    if (cell.Name === "UNUSED") return;

    $('#floating-box').html(`<h3 class="name">${cell.Name} - 0x${paddedOpcode(index)}</h3>`).append($('<div class="data-column"/>')
            .append(`<strong>Length:</strong> ${cell.Length} ` + (cell.Length === 1 ? "byte" : "bytes"))
            .append(generateAdvancedFlags(cell.Flags))
            .append("<br>")
            .append(`<strong>Group:</strong> ${cell.Group}`)
        )
        .append($('<div class="timing-column"/>').append(generateAdvancedTiming(cell)));
    
    $('#floating-box-container').show();
}

$(document).ready(() => {
    
    function tableParamUpdate() {
        const width = <number>$('select[name="table_width"]').find(':selected').val();
        cycle_mode = <string>$('select[name="cycle_mode"]').find(':selected').val();
        redrawTables(width);
    }

    $('#floating-box').click(e => e.stopPropagation());
  
    $('select[name="table_width"], select[name="cycle_mode"').change(tableParamUpdate).trigger('change');

    $('input[name="search-box"]').keyup(e => {
        if (!tables) return;
        for (let i: number = 0; i < 0x100; i++) {
            const width = <number>$('select[name="table_width"]').find(':selected').val();
            const searchString = (<HTMLSelectElement>e.target).value;

            let unprefixedNode = $(`#unprefixed-${width}-${cycle_mode}`).children()[Math.floor((i / width) + 1)].children[(i % width) + 1];
            let CBPrefixedNode = $(`#cbprefixed-${width}-${cycle_mode}`).children()[Math.floor((i / width) + 1)].children[(i % width) + 1];


            if (runOpcodeSearch(searchString, tables.Unprefixed[i], i)) unprefixedNode.classList.remove('hidden');
            else unprefixedNode.classList.add('hidden');

            if (runOpcodeSearch(searchString, tables.CBPrefixed[i], i)) CBPrefixedNode.classList.remove('hidden');
            else CBPrefixedNode.classList.add('hidden');
        }
    }).trigger('keyup');
})
