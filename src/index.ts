import {
  VGM,
  parseVGMCommand,
  VGMEndCommand,
  VGMDataStream,
  VGMWriteDataCommand,
  VGMWrite2ACommand,
  VGMDataBlockCommand,
  VGMSeekPCMCommand
} from "vgm-parser";

export default function stripVGM(input: VGM, delChips: Array<string>): VGM {
  let index = 0;
  const data = new Uint8Array(input.data);
  const ds = new VGMDataStream();
  let cmd = parseVGMCommand(data, index);

  while (!(cmd instanceof VGMEndCommand)) {
    if (input.offsets.data + index === input.offsets.loop) {
      ds.markLoopPoint();
    }
    if (cmd instanceof VGMWriteDataCommand) {
      if (cmd.chip === "ym2612") {
        if (delChips.indexOf("ym2612") < 0) {
          if (cmd.addr === 0x2b || delChips.indexOf("ym2612.fm") < 0) {
            ds.push(cmd);
          }
        }
      } else if (cmd.chip === "ym2203") {
        if (delChips.indexOf("ym2608") < 0) {
          if (0 <= cmd.addr && cmd.addr <= 0xf && delChips.indexOf("ym2203.ssg") < 0) {
            ds.push(cmd);
          } else if (0x20 <= cmd.addr && delChips.indexOf("ym2203.fm") < 0) {
            ds.push(cmd);
          }
        }
      } else if (cmd.chip === "ym2608") {
        if (delChips.indexOf("ym2608") < 0) {
          if (cmd.port === 1 && 0 <= cmd.addr && cmd.addr <= 0x1f && delChips.indexOf("ym2608.adpcm") < 0) {
            ds.push(cmd);
          } else if (cmd.port === 0 && 0 <= cmd.addr && cmd.addr <= 0xf && delChips.indexOf("ym2608.ssg") < 0) {
            ds.push(cmd);
          } else if (0x20 <= cmd.addr && delChips.indexOf("ym2608.fm") < 0) {
            ds.push(cmd);
          }
        }
      } else if (delChips.indexOf(cmd.chip) < 0) {
        ds.push(cmd);
      }
    } else if (cmd instanceof VGMWrite2ACommand) {
      if (delChips.indexOf("ym2612") < 0 && delChips.indexOf("ym2612.dac") < 0) {
        ds.push(cmd);
      }
    } else if (cmd instanceof VGMSeekPCMCommand) {
      if (delChips.indexOf("ym2612") < 0 && delChips.indexOf("ym2612.dac") < 0) {
        ds.push(cmd);
      }
    } else if (cmd instanceof VGMDataBlockCommand) {
      if (cmd.chip === "ym2612") {
        if (delChips.indexOf("ym2612") < 0 && delChips.indexOf("ym2612.dac") < 0) {
          ds.push(cmd);
        }
      } else if (cmd.chip === "ym2608") {
        if (delChips.indexOf("ym2608") < 0 && delChips.indexOf("ym2608.adpcm") < 0) {
          ds.push(cmd);
        }
      } else if (delChips.indexOf(cmd.chip) < 0) {
        ds.push(cmd);
      }
    } else {
      ds.push(cmd);
    }
    index += cmd.size;
    cmd = parseVGMCommand(data, index);
  }

  ds.push(cmd);

  const res = input.clone();
  for (const chip of delChips) {
    (res.chips as any)[chip] = undefined;
  }
  res.setDataStream(ds);
  return res;
}
