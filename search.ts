import { Opcode } from "./opcode"

let strRegex = /^"([^"]*)"/;
let keywordRegex = /^(and|or)\b/;
let operatorRegex = /^(<=|>=|=|<|>)/;
let propRegex = /^\.((?:number|num|name|opcode|op|length|len|group)\b|#)/;
let numberRegex = /^(0x[\da-f]{1,2}|0o[0-8]{1,3}|(?:0b[01]{1,8})|(?:[1-9]\d{0,2}|\d(?!\d)))\b/i;

function parseIntFromPrefixedString(num: string) {
    let radix = 10;
    if (num.length > 2) {
        switch (num[1].toUpperCase()) {
            case "X": radix = 16; break;
            case "O": radix = 8; break;
            case "B": radix = 2; break;
        }
    }

    return parseInt(radix !== 10 ? num.substr(2) : num, radix);
}

class ParsedSearch {
    ty: string;
    val: any;
    prop_ty: any;
    supportedOperators: string[];
    constructor(ty: string, val: string | any[] | any) {
        this.ty = ty;
        this.val = val;

        if (this.ty === "prop") {
            this.prop_ty = null;
            if (["number", "num", "opcode", "op", "len", "length"].includes(this.val)) {
                this.prop_ty = "number";
            } else if (["name", "group"].includes(this.val)) {
                this.prop_ty = "str";
            }

            switch (this.prop_ty) {
                case "str": this.supportedOperators = ["="]; break;
                case "number": this.supportedOperators = ["<", "<=", "=", ">", ">="]; break;
                default: throw new Error(`Unexpected prop type '${this.prop_ty}'`);
            }
        }
    }

    push(val: any) {
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

    execOp(opcode: any, opcodeNumber: any, defaultRet: boolean) {
        this.ty === "prop" ? defaultRet : this.exec(opcode, opcodeNumber)
    }

    eval(opcode, opcodeNumber: any) {
        switch (this.ty) {
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
                    case "group": return opcode.Name !== "UNUSED" ? opcode.Group : "";
                    case "length":
                    case "len": return opcode.Name !== "UNUSED" ? opcode.Length : null;
                    default: throw new Error(`unregistered prop: ${this.val}`);
                }
            }

            default: throw new Error(`unexpected primitive type in search: ${this.ty}`)
        }
    }

    exec(opcode: Opcode, opcodeNumber: number, defaultTrue: boolean=false) {
        switch (this.ty) {
            case "block":
                for (let node of this.val) if (!node.exec(opcode, opcodeNumber, true)) return false;
                return true;

            case "keyword": {
                if (this.val.val === "and") {
                    return this.val.left.exec(opcode, opcodeNumber, true) && this.val.right.exec(opcode, opcodeNumber, true);
                }

                if (this.val.val === "or") {
                    return this.val.left.exec(opcode, opcodeNumber, true) || this.val.right.exec(opcode, opcodeNumber, true);
                }

                throw new Error("error made it past validation!!!");
            }

            case "operator": {
                const lhs = this.val.left.eval(opcode, opcodeNumber);
                const rhs = this.val.right.eval(opcode, opcodeNumber);
                switch (this.val.val) {
                    case "<": return lhs < rhs;
                    case "<=": return lhs <= rhs;
                    case "=": return this.val.right.ty === "str" ? lhs.toUpperCase().includes(rhs.toUpperCase()) : lhs === rhs;
                    case ">=": return lhs >= rhs;
                    case ">": return lhs > rhs;
                }
            }

            default:
                if (!defaultTrue) throw new Error(`unexpected ty: "${this.ty}"`);
                else return true;
        }
    }
}

    function lexOpcodeSearch(offset: number, str: string, result: ParsedSearch) {
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


function parseOpcodeSearch(str: string) {
    let result = {
        r: new ParsedSearch("block", []), next_op: null, push: function (val: any) {
            (this.next_op || this.r).push(val);
            this.next_op && this.r.push(this.next_op);
            this.next_op = null;
        }
    };

    let i = 0;


    while (i < str.length) {
        i += lexOpcodeSearch(i);
    }

    return result.r;
}

export function runOpcodeSearch(str: string, opcode: any, opcodeNumber: number) {
    let parsed = parseOpcodeSearch(str);
    if (!validateOpcodeSearch(parsed)) {
        return true;
    }

    return parsed.exec(opcode, opcodeNumber);
}

function validateOpcodeSearch(parsed: ParsedSearch) {
    switch (parsed.ty) {
        case "keyword": return (validateOpcodeSearch(parsed.val.left) && validateOpcodeSearch(parsed.val.right))
        case "operator": {
            const left = parsed.val.left;
            const right = parsed.val.right;
            const op = parsed.val.val;
            return left.ty === "prop" && left.supportedOperators.includes(op) && left.prop_ty === right.ty;
        }

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