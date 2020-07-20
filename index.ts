'use strict';

import _tables from './dmgops.json'
import { Opcode, Flags, OpcodeTable } from "./opcode"

const tables: OpcodeTable = _tables;

type TableType = 'unprefixed' | 'cbprefixed'

import { fetchOpcodeSearch, runValidatedOpcodeSearch } from "./search";

var cycle_mode: CycleMode = null;

function paddedOpcode(number: number) {
    return number.toString(16).toUpperCase().padStart(2, '0');
}

function create_op(op: Opcode, index: number, cell: HTMLTableDataCellElement) {
    cell.classList.add('opcode');
    cell.classList.add(op.Group);
    cell.dataset.index = index.toString();

    if (op.Name !== "UNUSED") {
        const pre = cell.appendChild(document.createElement('div')).appendChild(document.createElement('pre'));

        pre.innerHTML = `${op.Name}\n` +
            `${op.Length} ${op_timing(op)}\n` +
            `${op.Flags.Z}&#8203;${op.Flags.N}&#8203;${op.Flags.H}&#8203;${op.Flags.C}`;
    }
}

function get_top_header(row: HTMLTableRowElement, width: number) {
    row.insertCell().outerHTML = "<th>--</th>"
    for (let i = 0; i < width; i++) {
        row.insertCell().outerHTML = `<th>+${i.toString(16).toUpperCase()}</th>`
    }

    return row;
}

function get_rows(tbody: HTMLTableSectionElement, table_width: number, table_data: Opcode[]) {
    const get_prefix = (row: number) => paddedOpcode(row * table_width) + '+';
    for (let row_num = 0; row_num < 0x100 / table_width; row_num++) {

        const _row = tbody.insertRow();
        _row.insertCell().outerHTML = `<th>${get_prefix(row_num)}</th>`

        for (let i = 0; i < table_width; i++) {
            const index = row_num * table_width + i;
            create_op(table_data[index], index, _row.insertCell());
        }
    }
}

type CycleMode = "t" | "m" | "both" | null;

function cycle_timing(min: number, max: number, mode: CycleMode = cycle_mode): string {
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

function hideTables() {
    document.querySelectorAll<HTMLTableElement>('table.opcode').forEach(table => {
        table.style.display = 'none'
    });

}

function redrawTables(width: number) {
    let new_unprefixed = loadCachedTable('unprefixed', width);
    let new_cbprefixed = loadCachedTable('cbprefixed', width);

    if (new_unprefixed && new_cbprefixed) {
        searchBoxKeyUp();

        hideTables();
        new_unprefixed.style.display = '';
        new_cbprefixed.style.display = '';
        return;
    }

    if (!new_unprefixed) new_unprefixed = loadTable('unprefixed', width, tables.Unprefixed);
    if (!new_cbprefixed) new_cbprefixed = loadTable('cbprefixed', width, tables.CBPrefixed);

    hideTables();

    document.body.appendChild(new_unprefixed);
    document.body.appendChild(new_cbprefixed);

    searchBoxKeyUp();
}

function tableOnClick(event: MouseEvent, table: Opcode[]) {
    if (event.target === null || event.currentTarget === null) return;
    const target = <HTMLElement>event.target;
    if (!target.matches("td.opcode:not(.hidden), td.opcode:not(.hidden) *")) return false;
    for (let _element of event.composedPath()) {
        const element = <HTMLElement>_element;
        if (element.tagName == 'TD' && element.classList.contains('opcode')) {
            const index = parseInt(element.dataset.index as string);
            enableFloatingBox(index, table[index]);
            return;
        }
    }
}

function loadTable(id: TableType, width: number, table: Opcode[]): HTMLTableElement {
    const _table = <HTMLTableElement>document.createElement('table');

    _table.id = `${id}-${width}-${cycle_mode}`;
    _table.classList.add('opcode');
    _table.createCaption().textContent = id + ":";

    get_top_header(_table.createTHead().insertRow(), width);

    get_rows(_table.createTBody(), width, table);
    _table.addEventListener("click", (ev) => tableOnClick(ev, table));

    return _table;
}

function loadCachedTable(id: TableType, width: number): HTMLElement | null {
    return document.getElementById(`${id}-${width}-${cycle_mode}`)
}

function generateAdvancedTiming(cell: Opcode) {
    const table: HTMLTableElement = document.createElement('table');


    table.createCaption().appendChild(document.createElement('strong')).textContent = "Timing";
    const header = table.createTHead().insertRow();
    if (cell.TimingNoBranch) {
        header.insertCell().outerHTML = `<th>without branch (${cycle_timing(cell.TCyclesNoBranch, cell.TCyclesNoBranch)})</th>`;
    }

    if (cell.TimingBranch) {
        header.insertCell().outerHTML = `<th>with branch (${cycle_timing(cell.TCyclesBranch, cell.TCyclesBranch)})</th>`;
    }

    const tbody = table.createTBody();

    if (cell.TimingNoBranch && cell.TimingBranch) {
        for (let i = 0; i < Math.max(cell.TimingNoBranch.length, cell.TimingBranch.length) * 2; i++) {
            const row = tbody.insertRow();

            if (i % 2 == 0) {
                const timingNoBranch = cell.TimingNoBranch[i / 2];
                const timingBranch = cell.TimingBranch[i / 2];

                row.insertCell().textContent = timingNoBranch ? timingNoBranch.Type : null;
                row.insertCell().textContent = timingBranch ? timingBranch.Type : null;
            } else {
                const timingNoBranch = cell.TimingNoBranch[(i - 1) / 2];
                const timingBranch = cell.TimingBranch[(i - 1) / 2];

                row.insertCell().textContent = timingNoBranch ? timingNoBranch.Comment : null;
                row.insertCell().textContent = timingBranch ? timingBranch.Comment : null;
            }
        }
    } else {
        let points = cell.TimingNoBranch || cell.TimingBranch;
        if (points) {
            for (let point of points) {
                const row = tbody.insertRow();
                row.insertCell().textContent = point.Type;
                row.insertCell().textContent = point.Comment;
            }
        }
    }

    return table;
}

function getFlagText(flag: string) {
    switch (flag) {
        case "-": return "unmodified";
        case "0": return "unset";
        case "1": return "set";
        default: return "dependent";
    }
}

function generateAdvancedFlags(flags: Flags) {
    const table = <HTMLTableElement>document.createElement('table');
    table.classList.add('flag-table');
    table.createCaption().appendChild(document.createElement('strong')).textContent = "Flags";
    const body = table.createTBody();

    body.innerHTML = `<tr><th>Zero</th><td>${getFlagText(flags.Z)}</td>` +
        `<tr><th>Negative</th><td>${getFlagText(flags.N)}</td>` +
        `<tr><th>Half&nbsp;Carry</th><td>${getFlagText(flags.H)}</td>` +
        `<tr><th>Carry</th><td>${getFlagText(flags.C)}</td>`;

    return table;
}

function enableFloatingBox(index: number, cell: Opcode) {

    if (cell.Name === "UNUSED") return;

    const floatingBox = document.getElementById('floating-box');

    if (floatingBox === null) return;

    floatingBox.innerHTML = "";

    const fragment = document.createDocumentFragment();

    const nameHeader = fragment.appendChild(document.createElement('h3'));
    nameHeader.classList.add('name');
    nameHeader.textContent = `${cell.Name} - 0x${paddedOpcode(index)}`;

    const dataColumn = fragment.appendChild(document.createElement('div'));
    dataColumn.classList.add('data-column');
    dataColumn.appendChild(document.createElement('strong')).textContent = 'Length: ';
    dataColumn.appendChild(document.createTextNode(cell.Length.toString() + ' ' + (cell.Length === 1 ? "byte" : "bytes")));
    dataColumn.appendChild(generateAdvancedFlags(cell.Flags));
    dataColumn.appendChild(document.createElement('strong')).textContent = 'Group: ';
    dataColumn.appendChild(document.createTextNode(cell.Group));

    const timingColumn = fragment.appendChild(document.createElement('div'));
    timingColumn.classList.add('timing-column');
    timingColumn.appendChild(generateAdvancedTiming(cell));

    floatingBox.appendChild(fragment);

    const floatingBoxContainer = document.getElementById('floating-box-container');
    if (floatingBoxContainer !== null) floatingBoxContainer.style.display = '';
}

function searchBoxKeyUp(searchBox: HTMLSelectElement | null = null) {
    const searchString = (searchBox !== null ? searchBox : <HTMLSelectElement>document.getElementsByName('search-box').item(0)).value;
    const width = parseInt((<HTMLSelectElement>document.getElementsByName('table_width').item(0)).selectedOptions[0].value);

    if (!tables) return;

    const unprefixedTable = document.querySelector(`#unprefixed-${width}-${cycle_mode} tbody`);
    const CBPrefixedTable = document.querySelector(`#cbprefixed-${width}-${cycle_mode} tbody`);

    if (unprefixedTable === null || CBPrefixedTable === null) return;

    const search = fetchOpcodeSearch(searchString);

    for (let i: number = 0; i < 0x100; i++) {
        const unprefixedNode = unprefixedTable.children[Math.floor((i / width))].children[(i % width) + 1];
        const CBPrefixedNode = CBPrefixedTable.children[Math.floor((i / width))].children[(i % width) + 1];


        if (runValidatedOpcodeSearch(search, tables.Unprefixed[i], i)) unprefixedNode.classList.remove('hidden');
        else unprefixedNode.classList.add('hidden');

        if (runValidatedOpcodeSearch(search, tables.CBPrefixed[i], i)) CBPrefixedNode.classList.remove('hidden');
        else CBPrefixedNode.classList.add('hidden');
    }
}

function ready(fn) {
    document.addEventListener('DOMContentLoaded', fn);
}

ready(() => {
    const tableWidth = <HTMLSelectElement>document.getElementsByName('table_width').item(0);
    const cycleMode = <HTMLSelectElement>document.getElementsByName('cycle_mode').item(0);

    function tableParamUpdate() {
        const width = parseInt(tableWidth.selectedOptions[0].value);
        cycle_mode = <CycleMode>(cycleMode.selectedOptions[0].value);
        redrawTables(width);
    }

    const floatingBox = document.getElementById('floating-box');
    if (floatingBox !== null) floatingBox.onclick = e => e.stopPropagation();

    tableWidth.onchange = tableParamUpdate;
    cycleMode.onchange = tableParamUpdate;

    tableParamUpdate();

    const searchBox = <HTMLSelectElement>document.getElementsByName('search-box').item(0);

    searchBox.onkeyup = () => searchBoxKeyUp(searchBox);
    searchBoxKeyUp(searchBox);
})
