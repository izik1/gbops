var op_tmpl_helpers = {
    timing: (min, max) => min !== max ? `${min}t-${max}t` : `${min}t`
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
