export interface OpcodeTable {
    Unprefixed: Opcode[];
    CBPrefixed: Opcode[];
}

export interface Opcode {
    TimingBranch: TimingPoint[] | null;
    TimingNoBranch: TimingPoint[] | null;
    TCyclesNoBranch: number;
    TCyclesBranch: number;
    Group: string;
    Flags: Flags;
    Length: number;
    Name: string;

}

export interface TimingPoint {
    Type: string;
    Comment: string;
}

export interface Flags {
    Z: Flag;
    N: Flag;
    H: Flag;
    C: Flag;
}

export type Flag = "Z" | "N" | "H" | "C" | "-" | "1" | "0";