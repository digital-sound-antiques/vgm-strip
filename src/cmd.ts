import commandLineArgs from "command-line-args";
import commandLineUsage from "command-line-usage";
import fs from "fs";
import zlib from "zlib";
import { VGM } from "vgm-parser";
import stripVGM from "./index";

const optionDefinitions = [
  {
    name: "chip",
    alias: "c",
    typeLabel: "{underline chip}",
    description:
      "Specify the chip type to be removed from VGM stream. To remove multiple chips, just use this option repeatedly.",
    type: String,
    lazyMultiple: true
  },
  {
    name: "input",
    alias: "i",
    typeLabel: "{underline file}",
    defaultOption: true,
    description: "Input VGM file. Standard input will be used if not specified."
  },
  {
    name: "output",
    alias: "o",
    typeLabel: "{underline file}",
    description: "Output VGM file. Standard output will be used if not speicified.",
    type: String
  },
  {
    name: "version",
    alias: "v",
    description: "Show version.",
    type: Boolean
  },
  {
    name: "help",
    alias: "h",
    description: "Show this help.",
    type: Boolean
  }
];

const sections = [
  {
    header: "vgm-strip",
    content: "Strip VGM commands for the specified chip types."
  },
  {
    header: "SYNOPSIS",
    content: ["{bold vgm-strip} -c {underline chip} [<option>] <file>"]
  },
  {
    header: "OPTIONS",
    optionList: optionDefinitions
  },
  {
    header: "CHIPS",
    content: [
      "The following chip names are available for `-c {underline chip}` option.",
      "",
      `sn76489, gameGearStereo, ym2413, 
ym2612, ym2612.fm, ym2612.dac, 
ym2151, segaPcm, rf5c68, 
ym2203, ym2203.fm, ym2203.ssg,
ym2608, ym2608.fm, ym2608.ssg, ym2608.adpcm,
ym2610, ym3812, ym3526, y8950, ymf262, ymf278b,
ymf271, ymz280b, rf5c164, pwm, ay8910, gameBoyDmg,
nesApu, multiPcm, upd7759, okim6258, okim6295,
k051649, k054539, huc6280, c140, k053260, pokey,
qsound, scsp, wonderSwan, vsu, saa1099, es5503,
es5506, x1_010, c352, ga20`
    ]
  }
];

function toArrayBuffer(b: Buffer) {
  return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength);
}

function loadVgmOrVgz(input: string) {
  const buf = fs.readFileSync(input);
  try {
    return zlib.gunzipSync(buf);
  } catch (e) {
    return buf;
  }
}

function main(argv: string[]) {
  const options = commandLineArgs(optionDefinitions, { argv });

  if (options.version) {
    const json = require("../package.json");
    console.info(json.version);
    return;
  }
  if (options.help || !options.chip) {
    console.log(commandLineUsage(sections));
    return;
  }

  const chips = options.chip;

  if (process.platform === "win32") {
    if (options.input == null) {
      console.error("Please specify input file. Standard input can not be used on Windows.");
      return;
    }
    if (options.output == null) {
      console.error("Please specify output file. Standard output can not be used on Windows.");
      return;
    }
  }

  const input = options.input || "/dev/stdin";
  const output = options.output;

  const buf = loadVgmOrVgz(input);
  const vgm = VGM.parse(toArrayBuffer(buf));

  const res = Buffer.from(stripVGM(vgm, chips).build());
  if (output) {
    fs.writeFileSync(output, res);
  } else {
    process.stdout.write(res);
  }
}

main(process.argv);
