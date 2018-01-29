[//]: # (Yes this is indeed a hack on markdown for a comment.)
[//]: # (Anyway, since future intent is for multiple tables of variable widths, the next couple hundred lines will be links so that they don't have to be typed in full multiple times since it would make the tables messy. Should also allow link changes in the future to be easier.)

[//]: # (0x)
[NOP]: nm/NOP
[LD BC,u16]: nm/LDr16,u16
[LD (BC),a]: nm/LD(r16),a
[INC BC]: nm/INCr16
[INC B]: nm/INCr8
[DEC B]: nm/DECr8
[LD B,u8]: nm/LDr8,u8
[RLCA]: nm/RLCA
[LD (u16),SP]: nm/LD(u16),SP
[ADD HL,BC]: nm/ADDHL,r16
[LD A,(BC)]: nm/LDA,(r16)
[DEC BC]: nm/DECr16
[INC C]: nm/INCr8
[DEC C]: nm/DECr8
[LD C,u8]: nm/LDr8,u8
[RRCA]: nm/RRCA

[//]: # (1x)
[STOP]: nm/STOP
[LD DE,u16]: nm/LDr16,u16
[LD (DE),a]: nm/LD(r16),a
[INC DE]: nm/INCr16
[INC D]: nm/INCr8
[DEC D]: nm/DECr8
[LD D,u8]: nm/LDr8,u8
[RLA]: nm/RLA
[JR i8]: nm/JRi8
[ADD HL,DE]: nm/ADDHL,r16
[LD A,(DE)]: nm/LDA,(r16)
[DEC DE]: nm/DECr16
[INC E]: nm/INCr8
[DEC E]: nm/DECr8
[LD E,u8]: nm/LDr8,u8
[RRA]: nm/RRA

[//]: # (2x)
[JR NZ,i8]: nm/JRi8
[LD HL,u16]: nm/LDr16,u16
[LD (HL+),a]: nm/LD(r16),a
[INC HL]: nm/INCr16
[INC H]: nm/INCr8
[DEC H]: nm/DECr8
[LD H,u8]: nm/LDr8,u8
[DAA]: nm/DAA
[JR Z,i8]: nm/JRi8
[ADD HL,HL]: nm/ADDHL,r16
[LD A,(HL+)]: nm/LDA,(r16)
[DEC HL]: nm/DECr16
[INC L]: nm/INCr8
[DEC L]: nm/DECr8
[LD L,u8]: nm/LDr8,u8
[CPL]: nm/CPL

[//]: # (3x)
[JR NC,i8]: nm/JRi8
[LD SP,u16]: nm/LDr16,u16
[LD (HL-),a]: nm/LD(r16),a
[INC SP]: nm/INCr16
[INC (HL)]: nm/INCr8
[DEC (HL)]: nm/DECr8
[LD (HL),u8]: nm/LDr8,u8
[SCF]: nm/SCF
[JR C,i8]: nm/JRi8
[ADD HL,SP]: nm/ADDHL,r16
[LD A,(HL-)]: nm/LDA,(r16)
[DEC SP]: nm/DECr16
[INC A]: nm/INCr8
[DEC A]: nm/DECr8
[LD A,u8]: nm/LDr8,u8
[CCF]: nm/CCF

[//]: # (4x)
[LD B,B]: nm/LDr8r8
[LD B,C]: nm/LDr8r8
[LD B,D]: nm/LDr8r8
[LD B,E]: nm/LDr8r8
[LD B,H]: nm/LDr8r8
[LD B,L]: nm/LDr8r8
[LD B,(HL)]: nm/LDr8r8
[LD B,A]: nm/LDr8r8
[LD C,B]: nm/LDr8r8
[LD C,C]: nm/LDr8r8
[LD C,D]: nm/LDr8r8
[LD C,E]: nm/LDr8r8
[LD C,H]: nm/LDr8r8
[LD C,L]: nm/LDr8r8
[LD C,(HL)]: nm/LDr8r8
[LD C,A]: nm/LDr8r8

[//]: # (5x)
[LD D,B]: nm/LDr8r8
[LD D,C]: nm/LDr8r8
[LD D,D]: nm/LDr8r8
[LD D,E]: nm/LDr8r8
[LD D,H]: nm/LDr8r8
[LD D,L]: nm/LDr8r8
[LD D,(HL)]: nm/LDr8r8
[LD D,A]: nm/LDr8r8
[LD E,B]: nm/LDr8r8
[LD E,C]: nm/LDr8r8
[LD E,D]: nm/LDr8r8
[LD E,E]: nm/LDr8r8
[LD E,H]: nm/LDr8r8
[LD E,L]: nm/LDr8r8
[LD E,(HL)]: nm/LDr8r8
[LD E,A]: nm/LDr8r8

[//]: # (6x)
[LD H,B]: nm/LDr8r8
[LD H,C]: nm/LDr8r8
[LD H,D]: nm/LDr8r8
[LD H,E]: nm/LDr8r8
[LD H,H]: nm/LDr8r8
[LD H,L]: nm/LDr8r8
[LD H,(HL)]: nm/LDr8r8
[LD H,A]: nm/LDr8r8
[LD L,B]: nm/LDr8r8
[LD L,C]: nm/LDr8r8
[LD L,D]: nm/LDr8r8
[LD L,E]: nm/LDr8r8
[LD L,H]: nm/LDr8r8
[LD L,L]: nm/LDr8r8
[LD L,(HL)]: nm/LDr8r8
[LD L,A]: nm/LDr8r8

[//]: # (7x)
[LD (HL),B]: nm/LDr8r8
[LD (HL),C]: nm/LDr8r8
[LD (HL),D]: nm/LDr8r8
[LD (HL),E]: nm/LDr8r8
[LD (HL),H]: nm/LDr8r8
[LD (HL),L]: nm/LDr8r8
[HALT]: nm/HALT
[LD (HL),A]: nm/LDr8r8
[LD A,B]: nm/LDr8r8
[LD A,C]: nm/LDr8r8
[LD A,D]: nm/LDr8r8
[LD A,E]: nm/LDr8r8
[LD A,H]: nm/LDr8r8
[LD A,L]: nm/LDr8r8
[LD A,(HL)]: nm/LDr8r8
[LD A,A]: nm/LDr8r8

## Short Format:
``<name/link> size min_time_t-max_time_t/min_time_m-max_time_m `flags` `` **or**  
``<name/link> size time_t/time_m `flags` ``
### Unprefixed Opcodes:

|xx|+0|+1|+2|+3|+4|+5|+6|+7|+8|+9|+A|+B|+C|+D|+E|+F|
|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|
|0x|[NOP] 1 4t/1m `----`|[LD BC,u16] 3 12t/3m `----`|[LD (BC),a] 1 8t/2m `----`|[INC BC] 1 8t/2m `----`|[INC B] 1 4t/1m `Z0H-`|[DEC B] 1 4t/1m `Z1H-`|[LD B,u8] 2 8t/2m `----`|[RLCA] 1 4t/1m `000C`|[LD (u16),SP] 3 20t/5m `----`|[ADD HL,BC] 1 8t/2m `-0HC`|[LD A,(BC)] 1 8t/2m `----`|[DEC BC] 1 8t/2m `----`|[INC C] 1 4t/1m `Z0H-`|[DEC C] 1 4t/1m `Z1H-`|[LD C,u8] 2 8t/2m `----`|[RRCA] 1 4t/1m `000C`|
|1x|[STOP] 2 4t/1m `----`|[LD DE,u16] 3 12t/3m `----`|[LD (DE),a] 1 8t/2m `----`|[INC DE] 1 8t/2m `----`|[INC D] 1 4t/1m `Z0H-`|[DEC D] 1 4t/1m `Z1H-`|[LD D,u8] 2 8t/2m `----`|[RLA] 1 4t/1m `000C`|[JR i8] 2 12t/3m `----`|[ADD HL,DE] 1 8t/2m `-0HC`|[LD A,(DE)] 1 8t/2m `----`|[DEC DE] 1 8t/2m `----`|[INC E] 1 4t/1m `Z0H-`|[DEC E] 1 4t/1m `Z1H-`|[LD E,u8] 2 8t/2m `----`|[RRA] 1 4t/1m `000C`|
|2x|[JR NZ,i8] 2 8t-12t/2m-3m `----`|[LD HL,u16] 3 12t/3m `----`|[LD (HL+),a] 1 8t/2m `----`|[INC HL] 1 8t/2m `----`|[INC H] 1 4t/1m `Z0H-`|[DEC H] 1 4t/1m `Z1H-`|[LD H,u8] 2 8t/2m `----`|[DAA] 1 4t/1m `Z-0C`|[JR Z,i8] 2 8t-12t/2m-3m `----`|[ADD HL,HL] 1 8t/2m `-0HC`|[LD A,(HL+)] 1 8t/2m `----`|[DEC HL] 1 8t/2m `----`|[INC L] 1 4t/1m `Z0H-`|[DEC L] 1 4t/1m `Z1H-`|[LD L,u8] 2 8t/2m `----`|[CPL] 1 4t/1m `-11-`|
|3x|[JR NC,i8] 2 8t-12t/2m-3m `----`|[LD SP,u16] 3 12t/3m `----`|[LD (HL-),a] 1 8t/2m `----`|[INC SP] 1 8t/2m `----`|[INC (HL)] 1 12t/3m `Z0H-`|[DEC (HL)] 1 12t/3m `Z1H-`|[LD (HL),u8] 2 12t/3m `----`|[SCF] 1 4t/1m `-001`|[JR C,i8] 2 8t-12t/2m-3m `----`|[ADD HL,SP] 1 8t/2m `-0HC`|[LD A,(HL-)] 1 8t/2m `----`|[DEC SP] 1 8t/2m `----`|[INC A] 1 4t/1m `Z0H-`|[DEC A] 1 4t/1m `Z1H-`|[LD A,u8] 2 8t/2m `----`|[CCF] 1 4t/1m `-00C`|
|4x|[LD B,B] 1 4t/1m `----`|[LD B,C] 1 4t/1m `----`|[LD B,D] 1 4t/1m `----`|[LD B,E] 1 4t/1m `----`|[LD B,H] 1 4t/1m `----`|[LD B,L] 1 4t/1m `----`|[LD B,(HL)] 1 8t/2m `----`|[LD B,A] 1 4t/1m `----`|[LD C,B] 1 4t/1m `----`|[LD C,C] 1 4t/1m `----`|[LD C,D] 1 4t/1m `----`|[LD C,E] 1 4t/1m `----`|[LD C,H] 1 4t/1m `----`|[LD C,L] 1 4t/1m `----`|[LD C,(HL)] 1 8t/2m `----`|[LD C,A] 1 4t/1m `----`|
|5x|[LD D,B] 1 4t/1m `----`|[LD D,C] 1 4t/1m `----`|[LD D,D] 1 4t/1m `----`|[LD D,E] 1 4t/1m `----`|[LD D,H] 1 4t/1m `----`|[LD D,L] 1 4t/1m `----`|[LD D,(HL)] 1 8t/2m `----`|[LD D,A] 1 4t/1m `----`|[LD E,B] 1 4t/1m `----`|[LD E,C] 1 4t/1m `----`|[LD E,D] 1 4t/1m `----`|[LD E,E] 1 4t/1m `----`|[LD E,H] 1 4t/1m `----`|[LD E,L] 1 4t/1m `----`|[LD E,(HL)] 1 8t/2m `----`|[LD E,A] 1 4t/1m `----`|
|6x|[LD H,B] 1 4t/1m `----`|[LD H,C] 1 4t/1m `----`|[LD H,D] 1 4t/1m `----`|[LD H,E] 1 4t/1m `----`|[LD H,H] 1 4t/1m `----`|[LD H,L] 1 4t/1m `----`|[LD H,(HL)] 1 8t/2m `----`|[LD H,A] 1 4t/1m `----`|[LD L,B] 1 4t/1m `----`|[LD L,C] 1 4t/1m `----`|[LD L,D] 1 4t/1m `----`|[LD L,E] 1 4t/1m `----`|[LD L,H] 1 4t/1m `----`|[LD L,L] 1 4t/1m `----`|[LD L,(HL)] 1 8t/2m `----`|[LD L,A] 1 4t/1m `----`|
|7x|[LD (HL),B] 1 4t/1m `----`|[LD (HL),C] 1 4t/1m `----`|[LD (HL),D] 1 4t/1m `----`|[LD (HL),E] 1 4t/1m `----`|[LD (HL),H] 1 4t/1m `----`|[LD (HL),L] 1 4t/1m `----`|[HALT] 1 4t/1m `----`|[LD (HL),A] 1 4t/1m `----`|[LD A,B] 1 4t/1m `----`|[LD A,C] 1 4t/1m `----`|[LD A,D] 1 4t/1m `----`|[LD A,E] 1 4t/1m `----`|[LD A,H] 1 4t/1m `----`|[LD A,L] 1 4t/1m `----`|[LD A,(HL)] 1 8t/2m `----`|[LD A,A] 1 4t/1m `----`|
|8|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|
|9|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|
|A|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|
|B|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|
|C|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|
|D|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|
|E|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|
|F|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|

### CB Prefixed Opcodes:
As a bit of clarification, all CB prefixed Opcodes take at least 8 t(2m)-cycles and are all two (2) bytes long. This includes the prefix. So, RLC B takes a _total_ of 8 t(2m)-cycles to execute. Additionally, CB prefixed Opcodes can _not_ have an interrupt occur between the prefix and the instruction.

|#|0|1|2|3|4|5|6|7|8|9|A|B|C|D|E|F|
|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|
|0|[RLC B](cb/RLCr8) 2 8t/2m `Z00C`|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|
|1|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|
|2|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|
|3|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|
|4|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|
|5|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|
|6|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|
|7|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|
|8|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|
|9|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|
|A|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|
|B|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|
|C|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|
|D|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|
|E|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|
|F|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|