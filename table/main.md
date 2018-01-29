## Short Format:
``<name/link> size min_time_t-max_time_t(min_time_m-max_time_m) `flags` `` **or**  
``<name/link> size time_t(time_m) `flags` ``
### Unprefixed Opcodes:

|#|0|1|2|3|4|5|6|7|8|9|A|B|C|D|E|F|
|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|
|0|[NOP](nm/NOP) 1 4t(1m) `----`|[LD BC,u16](nm/LDr16,u16) 3 12t(3m) `----`|[LD (BC),a](nm/LD(r16),a) 1 8t(2m) `----`|[INC BC](nm/INCr16) 1 8t(2m) `----`|[INC B](nm/INCr8) 1 4t(1m) `Z0H-`|[DEC B](nm/DECr8) 1 4t(1m) `Z1H-`|[LD B,u8](nm/LDr8u8) 2 8t(2m) `----`|[RLCA](nm/RLCA) 1 4t(1m) `000C`|[LD (u16),SP](nm/LD(u16),SP) 3 20t(5m) `----`|[ADD HL,BC](nm/ADDHL,r16) 1 8t(2m) `-0HC`|[LD A,(BC)](nm/LDA,(r16)) 1 8t(2m) `----`|[DEC BC](nm/DECr16) 1 8t(2m) `----`|[INC C](nm/INCr8) 1 4t(1m) `Z0H-`|[DEC C](nm/DECr8) 1 4t(1m) `Z1H-`|[LD C,u8](nm/LDr8u8) 2 8t(2m) `----`|[RRCA](nm/RRCA) 1 4t(1m) `000C`|
|1|[STOP](nm/STOP) 2 4t(1m) `----`|[LD DE,u16](nm/LDr16,u16) 3 12t(3m) `----`|[LD (DE),a](nm/LD(r16),a) 1 8t(2m) `----`|[INC DE](nm/INCr16) 1 8t(2m) `----`|[INC D](nm/INCr8) 1 4t(1m) `Z0H-`|[DEC D](nm/DECr8) 1 4t(1m) `Z1H-`|[LD D,u8](nm/LDr8u8) 2 8t(2m) `----`|[RLA](nm/RLA) 1 4t(1m) `000C`|[JR i8](nm/JRi8) 2 12t(3m) `----`|[ADD HL,DE](nm/ADDHL,r16) 1 8t(2m) `-0HC`|[LD A,(DE)](nm/LDA,(r16)) 1 8t(2m) `----`|[DEC DE](nm/DECr16) 1 8t(2m) `----`|[INC E](nm/INCr8) 1 4t(1m) `Z0H-`|[DEC E](nm/DECr8) 1 4t(1m) `Z1H-`|[LD E,u8](nm/LDr8u8) 2 8t(2m) `----`|[RRA](nm/RRA) 1 4t(1m) `000C`|
|2|[JR NZ,i8](nm/JRcn,i8) 2 8t-12t(2m-3m) `----`|[LD HL,u16](nm/LDr16,u16) 3 12t(3m) `----`|[LD (HL+),a](nm/LD(r16),a) 1 8t(2m) `----`|[INC HL](nm/INCr16) 1 8t(2m) `----`|[INC H](nm/INCr8) 1 4t(1m) `Z0H-`|[DEC H](nm/DECr8) 1 4t(1m) `Z1H-`|[LD H,u8](nm/LDr8u8) 2 8t(2m) `----`|[DAA](nm/DAA) 1 4t(1m) `Z-0C`|[JR Z,i8](nm/JRcn,i8) 2 12t(3m) `----`|[ADD HL,HL](nm/ADDHL,r16) 1 8t(2m) `-0HC`|[LD A,(HL+)](nm/LDA,(r16)) 1 8t(2m) `----`|[DEC HL](nm/DECr16) 1 8t(2m) `----`|[INC L](nm/INCr8) 1 4t(1m) `Z0H-`|[DEC L](nm/DECr8) 1 4t(1m) `Z1H-`|[LD L,u8](nm/LDr8u8) 2 8t(2m) `----`|[CPL](nm/CPL) 1 4t(1m) `-11-`|
|3|[JR NC,i8](nm/JRcn,i8) 2 8t-12t(2m-3m) `----`|[LD SP,u16](nm/LDr16,u16) 3 12t(3m) `----`|[LD (HL-),a](nm/LD(r16),a) 1 8t(2m) `----`|[INC SP](nm/INCr16) 1 8t(2m) `----`|[INC (HL)](nm/INCr8) 1 12t(3m) `Z0H-`|[DEC (HL)](nm/DECr8) 1 12t(3m) `Z1H-`|[LD (HL),u8](nm/LDr8u8) 2 12t(3m) `----`|[SCF](nm/SCF) 1 4t(1m) `-001`|[JR C,i8](nm/JRcn,i8) 2 12t(3m) `----`|[ADD HL,SP](nm/ADDHL,r16) 1 8t(2m) `-0HC`|[LD A,(HL-)](nm/LDA,(r16)) 1 8t(2m) `----`|[DEC SP](nm/DECr16) 1 8t(2m) `----`|[INC A](nm/INCr8) 1 4t(1m) `Z0H-`|[DEC A](nm/DECr8) 1 4t(1m) `Z1H-`|[LD A,u8](nm/LDr8u8) 2 8t(2m) `----`|[CCF](nm/CCF) 1 4t(1m) `-00C`|
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

### CB Prefixed Opcodes:
As a bit of clarification, all CB prefixed Opcodes take at least 8 t(2m)-cycles and are all two (2) bytes long. This includes the prefix. So, RLC B takes a _total_ of 8 t(2m)-cycles to execute. Additionally, CB prefixed Opcodes can _not_ have an interrupt occur between the prefix and the instruction.

|#|0|1|2|3|4|5|6|7|8|9|A|B|C|D|E|F|
|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|
|0|[RLC B](cb/RLCr8) 2 8t(2m) `Z00C`|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|
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