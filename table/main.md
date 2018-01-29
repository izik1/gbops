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
|4|[LD B,B](nm/LDr8r8) 1 4t(1m) `----`|[LD B,C](nm/LDr8r8) 1 4t(1m) `----`|[LD B,D](nm/LDr8r8) 1 4t(1m) `----`|[LD B,E](nm/LDr8r8) 1 4t(1m) `----`|[LD B,H](nm/LDr8r8) 1 4t(1m) `----`|[LD B,L](nm/LDr8r8) 1 4t(1m) `----`|[LD B,(HL)](nm/LDr8r8) 1 8t(2m) `----`|[LD B,A](nm/LDr8r8) 1 4t(1m) `----`|[LD C,B](nm/LDr8r8) 1 4t(1m) `----`|[LD C,C](nm/LDr8r8) 1 4t(1m) `----`|[LD C,D](nm/LDr8r8) 1 4t(1m) `----`|[LD C,E](nm/LDr8r8) 1 4t(1m) `----`|[LD C,H](nm/LDr8r8) 1 4t(1m) `----`|[LD C,L](nm/LDr8r8) 1 4t(1m) `----`|[LD C,(HL)](nm/LDr8r8) 1 8t(2m) `----`|[LD C,A](nm/LDr8r8) 1 4t(1m) `----`|
|5|[LD D,B](nm/LDr8r8) 1 4t(1m) `----`|[LD D,C](nm/LDr8r8) 1 4t(1m) `----`|[LD D,D](nm/LDr8r8) 1 4t(1m) `----`|[LD D,E](nm/LDr8r8) 1 4t(1m) `----`|[LD D,H](nm/LDr8r8) 1 4t(1m) `----`|[LD D,L](nm/LDr8r8) 1 4t(1m) `----`|[LD D,(HL)](nm/LDr8r8) 1 8t(2m) `----`|[LD D,A](nm/LDr8r8) 1 4t(1m) `----`|[LD E,B](nm/LDr8r8) 1 4t(1m) `----`|[LD E,C](nm/LDr8r8) 1 4t(1m) `----`|[LD E,D](nm/LDr8r8) 1 4t(1m) `----`|[LD E,E](nm/LDr8r8) 1 4t(1m) `----`|[LD E,H](nm/LDr8r8) 1 4t(1m) `----`|[LD E,L](nm/LDr8r8) 1 4t(1m) `----`|[LD E,(HL)](nm/LDr8r8) 1 8t(2m) `----`|[LD E,A](nm/LDr8r8) 1 4t(1m) `----`|
|6|[LD H,B](nm/LDr8r8) 1 4t(1m) `----`|[LD H,C](nm/LDr8r8) 1 4t(1m) `----`|[LD H,D](nm/LDr8r8) 1 4t(1m) `----`|[LD H,E](nm/LDr8r8) 1 4t(1m) `----`|[LD H,H](nm/LDr8r8) 1 4t(1m) `----`|[LD H,L](nm/LDr8r8) 1 4t(1m) `----`|[LD H,(HL)](nm/LDr8r8) 1 8t(2m) `----`|[LD H,A](nm/LDr8r8) 1 4t(1m) `----`|[LD L,B](nm/LDr8r8) 1 4t(1m) `----`|[LD L,C](nm/LDr8r8) 1 4t(1m) `----`|[LD L,D](nm/LDr8r8) 1 4t(1m) `----`|[LD L,E](nm/LDr8r8) 1 4t(1m) `----`|[LD L,H](nm/LDr8r8) 1 4t(1m) `----`|[LD L,L](nm/LDr8r8) 1 4t(1m) `----`|[LD L,(HL)](nm/LDr8r8) 1 8t(2m) `----`|[LD L,A](nm/LDr8r8) 1 4t(1m) `----`|
|7|[LD (HL),B](nm/LDr8r8) 1 4t(1m) `----`|[LD (HL),C](nm/LDr8r8) 1 4t(1m) `----`|[LD (HL),D](nm/LDr8r8) 1 4t(1m) `----`|[LD (HL),E](nm/LDr8r8) 1 4t(1m) `----`|[LD (HL),H](nm/LDr8r8) 1 4t(1m) `----`|[LD (HL),L](nm/LDr8r8) 1 4t(1m) `----`|[HALT](nm/HALT) 1 4t(1m) `----`|[LD (HL),A](nm/LDr8r8) 1 4t(1m) `----`|[LD A,B](nm/LDr8r8) 1 4t(1m) `----`|[LD A,C](nm/LDr8r8) 1 4t(1m) `----`|[LD A,D](nm/LDr8r8) 1 4t(1m) `----`|[LD A,E](nm/LDr8r8) 1 4t(1m) `----`|[LD A,H](nm/LDr8r8) 1 4t(1m) `----`|[LD A,L](nm/LDr8r8) 1 4t(1m) `----`|[LD A,(HL)](nm/LDr8r8) 1 8t(2m) `----`|[LD A,A](nm/LDr8r8) 1 4t(1m) `----`|
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