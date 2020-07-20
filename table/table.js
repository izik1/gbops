'use strict';

var cycle_mode = null;

var width = null;

var tables = null;

var macOS = false;

function create_op(op) {
    return $("<td>/").append(op.Name != "UNUSED" && $("<pre/>").html(
        `${op.Name}\n` +
        `${op.Length} ${op_timing(op)}\n` +
        `${op.Flags.Z}&#8203;${op.Flags.N}&#8203;${op.Flags.H}&#8203;${op.Flags.C}`
    )).addClass("opcode").addClass(op.Group);
}


function get_top_header(width) {
    const row = $('<tr><th>--</th></tr>')
    for (let i = 0; i < width; i++) {
        row.append($('<th/>').html('+' + i.toString(16).toUpperCase()).addClass("header"));
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
        $('input[name="search_box"]').trigger('keyup');
        $('table.opcode').hide();
        new_unprefixed.show();
        new_cbprefixed.show();
        return;
    }

    if (!new_unprefixed) new_unprefixed = loadTable('unprefixed', tables.Unprefixed);
    if (!new_cbprefixed) new_cbprefixed = loadTable('cbprefixed', tables.CBPrefixed);

    $('table.opcode').hide();
    $('body').append(new_unprefixed).append(new_cbprefixed);
    $('input[name="search_box"]').trigger('keyup');
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

function parseIntFromPrefixedString(num) {
    let radix = 10;
    if (num.length > 2) {
        switch (num[1].toUpperCase()) {
            case "X": radix = 16;
            case "O": radix = 8;
            case "B": radix = 2;
        }
    }

    return parseInt(radix !== 10 ? num.substr(2) : num, radix);
}

class ParsedSearch {
    constructor(ty, val) {
        this.ty = ty;
        this.val = val;
    }

    push(val) {
        switch (this.ty) {
            case "keyword":
                this.val.right.push(val);
                break;
            case "block":
                this.val.push(val);
                break;
            case "operator":
                if (this.val.right !== null) throw new Error("operator::right !== null");
                this.val.right = val;
                break;
            default: throw new TypeError();
        }
    }

    pop() {
        switch (this.ty) {
            case "keyword": return this.val.right.pop();
            case "block": return this.val.pop();
            default: throw new TypeError();
        }
    }

    get length() {
        switch (this.ty) {
            case "keyword": return this.val.right.length;
            case "block": return this.val.length;
            default: throw new TypeError();
        }
    }

    exec(opcode, opcodeNumber) {
        switch (this.ty) {
            case "block":
                for (let node of this.val) {
                    if (!node.exec(opcode, opcodeNumber)) return false;
                }

                return true;
            case "keyword": {
                if (this.val.val === "and") {
                    return this.val.left.exec(opcode, opcodeNumber) && this.val.right.exec(opcode, opcodeNumber);
                }

                if (this.val.val === "or") {
                    return this.val.left.exec(opcode, opcodeNumber) || this.val.right.exec(opcode, opcodeNumber);
                }

                throw new Error("error made it past validation!!!");
            }

            case "operator": {
                const lhs = this.val.left.exec(opcode, opcodeNumber);
                const rhs = this.val.right.exec(opcode, opcodeNumber);
                switch (this.val.val) {
                    case "<": return lhs < rhs;
                    case "<=": return lhs <= rhs;
                    case "=": return this.val.right.ty == "str" ? lhs.includes(rhs) : lhs === rhs;
                    case ">=": return lhs >= rhs;
                    case ">": return lhs > rhs;
                }
            }

            case "number": return parseIntFromPrefixedString(this.val);
            case "str": return this.val;
            case "prop": {
                switch (this.val) {
                    case "number":
                    case "num":
                    case "opcode":
                    case "op":
                    case "#":
                        return opcodeNumber;
                    case "name": return opcode.Name !== "UNUSED" ? opcode.Name : "";
                    case "length":
                    case "len": return opcode.Name !== "UNUSED" ? opcode.Length : null;
                    default: throw new Error(`unregistered prop: ${this.val}`);
                }
            }

            default: throw new Error(`unexpected ty: "${this.ty}"`);
        }
    }
}

function parseOpcodeSearch(str) {
    let strRegex = /^"([^"]*)"/;
    let keywordRegex = /^(and|or)\b/;
    let operatorRegex = /^(<=|>=|=|<|>)/;
    let propRegex = /^\.((?:number|num|name|opcode|op|length|len)\b|#)/;
    let numberRegex = /^(0x[\da-f]{1,2}|0o[0-8]{1,3}|(?:0b[01]{1,8})|(?:[1-9]\d{0,2}|\d(?!\d)))\b/i;
    let result = {
        r: new ParsedSearch("block", []), next_op: null, push: function (val) {
            (this.next_op || this.r).push(val);
            this.next_op && this.r.push(this.next_op);
            this.next_op = null;
        }
    };

    let i = 0;

    function lexOpcodeSearch(offset) {
        let strMatches = strRegex.exec(str.substr(offset));
        if (strMatches) {
            result.push(new ParsedSearch("str", strMatches[1]));
            return strMatches[0].length;
        }

        let keywordMatches = keywordRegex.exec(str.substr(offset));
        if (keywordMatches) {
            result.r = new ParsedSearch("keyword", { val: keywordMatches[1], left: result.r, right: new ParsedSearch("block", []) })
            return keywordMatches[0].length;
        }

        let operatorMatches = operatorRegex.exec(str.substr(offset));
        if (operatorMatches) {
            if (result.r.length == 0 || result.next_op !== null) throw new Error();

            result.next_op = new ParsedSearch("operator", { val: operatorMatches[1], left: result.r.pop(), right: null });
            return operatorMatches[0].length;
        }

        let propMatches = propRegex.exec(str.substr(offset));
        if (propMatches) {
            result.push(new ParsedSearch("prop", propMatches[1]));
            return propMatches[0].length;
        }

        let numberMatches = numberRegex.exec(str.substr(offset));
        if (numberMatches) {
            result.push(new ParsedSearch("number", numberMatches[1]));
            return numberMatches[0].length;
        }

        if (str[offset] === " ") {
            return 1;
        }
    }

    while (i < str.length) {
        i += lexOpcodeSearch(i);
    }

    return result.r;
}

function runOpcodeSearch(str, opcode, opcodeNumber) {
    let parsed = parseOpcodeSearch(str);
    if (!validateOpcodeSearch(parsed)) {
        return true;
    }

    return parsed.exec(opcode, opcodeNumber);
}

function propSupportsCompare(prop, compare, rhs) {
    switch (prop.val) {
        case "name": return ['<', '<=', '=', '=>', '>'].indexOf(compare) > 0 && rhs.ty === "str";
        case "#":
        case "num":
        case "number":
        case "opcode":
        case "op":
        case "len":
        case "length":
            return ['<', '<=', '=', '=>', '>'].indexOf(compare) > 0 && rhs.ty === "number";
        default: throw new Error(`unexpected prop .${prop.val}`);
    }
}

function validateOpcodeSearch(parsed) {
    switch (parsed.ty) {
        case "keyword": return (validateOpcodeSearch(parsed.val.left) && validateOpcodeSearch(parsed.val.right))
        case "operator": return (parsed.val.left.ty === "prop" && propSupportsCompare(parsed.val.left, parsed.val.val, parsed.val.right));
        case "block": {
            for (let node of parsed.val) {
                if (!validateOpcodeSearch(node)) return false;
            }

            return true;
        }

        case "prop": return true; // happens in situations where a prop is still being typed like `.len=2 .name or .name="LD"`

        default: throw new Error(`unexpected ty in validation: ${parsed.ty}`);
    }
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

    $('input[name="search-box"]').on('keyup', e => {
        if (!tables) return;
        for (let i = 0; i < 0x100; i++) {
            let unprefixedNode = $($(`#unprefixed-${width}-${cycle_mode}`).children()[Math.floor((i / width) + 1)].children[(i % width) + 1]);
            let CBPrefixedNode = $($(`#cbprefixed-${width}-${cycle_mode}`).children()[Math.floor((i / width) + 1)].children[(i % width) + 1]);

            if (runOpcodeSearch(e.target.value, tables.Unprefixed[i], i)) unprefixedNode.removeClass('hidden');
            else unprefixedNode.addClass('hidden');

            if (runOpcodeSearch(e.target.value, tables.CBPrefixed[i], i)) CBPrefixedNode.removeClass('hidden');
            else CBPrefixedNode.addClass('hidden');
        }
    })

    // Don't use `getJson()` because it complains locally about the mimetype.
    $.ajax({
        dataType: "json",
        url: "dmgops.json",
        data: null,
        mimeType: "application/json",
        success: ops => {
            tables = ops;
            redrawTables();
        }
    })
})
