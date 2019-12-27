'use strict';

import _tables from './dmgops.json'
import { Opcode, Flags, OpcodeTable, Flag } from "./opcode"

const tables: OpcodeTable = _tables;

type TableType = 'unprefixed' | 'cbprefixed'

import { fetchOpcodeSearch, runValidatedOpcodeSearch } from "./search";

type CycleMode = "t" | "m" | "both" | null;
var cycleMode: CycleMode = null;

function paddedOpcode(number: number) {
    return number.toString(16).toUpperCase().padStart(2, '0');
}

function tableName(type: TableType): string {
    switch(type) {
        case 'unprefixed': return 'Unprefixed';
        case 'cbprefixed': return '0xCB Prefixed';
    }
}

function createOp(op: Opcode, index: number, cell: HTMLTableDataCellElement) {
    cell.classList.add('opcode');
    cell.classList.add(...op.Group.split('/'));
    cell.dataset.index = index.toString();

    if (op.Name !== "UNUSED") {
        const pre = cell.appendChild(document.createElement('div')).appendChild(document.createElement('pre'));

        pre.textContent = `${op.Name}\n` +
            `${op.Length} ${cycleTiming(op.TCyclesNoBranch, op.TCyclesBranch)}\n` +
            `${op.Flags.Z}\u200b${op.Flags.N}\u200b${op.Flags.H}\u200b${op.Flags.C}`;
    }
}

function getTopHeader(row: HTMLTableRowElement, width: number) {
    row.insertCell().outerHTML = "<th>--</th>"
    for (let i = 0; i < width; i++) {
        row.insertCell().outerHTML = `<th>+${i.toString(16).toUpperCase()}</th>`
    }

    return row;
}

function getRows(tbody: HTMLTableSectionElement, tableWidth: number, tableData: Opcode[]) {
    for (let rowNum = 0; rowNum < 0x100 / tableWidth; rowNum++) {

        const row = tbody.insertRow();
        row.insertCell().outerHTML = `<th>${paddedOpcode(rowNum * tableWidth)}+</th>`

        for (let i = 0; i < tableWidth; i++) {
            const index = rowNum * tableWidth + i;
            createOp(tableData[index], index, row.insertCell());
        }
    }
}

function cycleTiming(min: number, max: number, mode: CycleMode = cycleMode): string {
    switch (mode) {
        case "t": return min !== max ? `${min}t-${max}t` : `${min}t`;
        case "m": return min !== max ? `${min / 4}m-${max / 4}m` : `${min / 4}m`;
        case "both": // \u200b is a 0 width space.
        default: return cycleTiming(min, max, 't') + "\u200b/\u200b" + cycleTiming(min, max, 'm');
    }
}

function hideTables() {
    document.querySelectorAll<HTMLTableElement>('table.opcode').forEach(table => {
        table.style.display = 'none'
    });

}

function redrawTables(width: number) {
    let newUnprefixed = document.getElementById(`unprefixed-${width}-${cycleMode}`);
    let newCBPrefixed = document.getElementById(`cbprefixed-${width}-${cycleMode}`);

    if (newUnprefixed && newCBPrefixed) {
        searchBoxKeyUp();

        hideTables();
        newUnprefixed.style.display = '';
        newCBPrefixed.style.display = '';
        return;
    }

    if (!newUnprefixed) newUnprefixed = loadTable('unprefixed', width, tables.Unprefixed);
    if (!newCBPrefixed) newCBPrefixed = loadTable('cbprefixed', width, tables.CBPrefixed);

    hideTables();

    document.body.appendChild(newUnprefixed);
    document.body.appendChild(newCBPrefixed);

    searchBoxKeyUp();
}

function tableOnClick(event: MouseEvent, table: Opcode[]) {
    for (let _element of event.composedPath()) {
        const element = <HTMLElement>_element;
        if (element.tagName == 'TD' && element.classList.contains('opcode')) {
            const index = parseInt(element.dataset.index as string);
            enableFloatingBox(index, table[index]);
            return;
        }
    }
}

function loadTable(id: TableType, width: number, opcodeTable: Opcode[]): HTMLTableElement {
    const table = <HTMLTableElement>document.createElement('table');

    table.id = `${id}-${width}-${cycleMode}`;
    table.classList.add('opcode');
    table.classList.add(`opcode-${width}`);
    table.createCaption().textContent = tableName(id) + ":";

    getTopHeader(table.createTHead().insertRow(), width);

    getRows(table.createTBody(), width, opcodeTable);
    table.addEventListener("click", ev => tableOnClick(ev, opcodeTable));

    return table;
}

function generateAdvancedTiming(cell: Opcode) {
    const table: HTMLTableElement = document.createElement('table');


    table.createCaption().appendChild(document.createElement('strong')).textContent = "Timing";
    const header = table.createTHead().insertRow();
    if (cell.TimingNoBranch) {
        header.insertCell().outerHTML = `<th>without branch (${cycleTiming(cell.TCyclesNoBranch, cell.TCyclesNoBranch)})</th>`;
    }

    if (cell.TimingBranch) {
        header.insertCell().outerHTML = `<th>with branch (${cycleTiming(cell.TCyclesBranch, cell.TCyclesBranch)})</th>`;
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

function getFlagText(flag: Flag) {
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
    if(searchString == "") return;

    const unprefixedTable = document.querySelector(`#unprefixed-${width}-${cycleMode} tbody`);
    const CBPrefixedTable = document.querySelector(`#cbprefixed-${width}-${cycleMode} tbody`);

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

function ready(fn: EventListener) {
    document.addEventListener('DOMContentLoaded', fn);
}

ready(() => {
    const tableWidthSelect = <HTMLSelectElement>document.getElementsByName('table_width').item(0);
    const cycleModeSelect = <HTMLSelectElement>document.getElementsByName('cycle_mode').item(0);

    function tableParamUpdate() {
        const width = parseInt(tableWidthSelect.selectedOptions[0].value);
        cycleMode = <CycleMode>(cycleModeSelect.selectedOptions[0].value);
        redrawTables(width);
    }

    const floatingBox = document.getElementById('floating-box');
    if (floatingBox !== null) floatingBox.onclick = e => e.stopPropagation();

    tableWidthSelect.onchange = tableParamUpdate;
    cycleModeSelect.onchange = tableParamUpdate;

    tableParamUpdate();

    const searchBox = <HTMLSelectElement>document.getElementsByName('search-box').item(0);

    searchBox.onkeyup = () => searchBoxKeyUp(searchBox);
    searchBoxKeyUp(searchBox);
})
