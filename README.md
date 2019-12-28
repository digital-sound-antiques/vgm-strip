# vgm-strip

[![npm version](https://badge.fury.io/js/vgm-strip.svg)](https://badge.fury.io/js/vgm-strip)

vgm-strip is a small tools to remove specified chip commands from VGM file.

# Install
```
npm install -g vgm-strip
```

# Usage
## SYNOPSIS
```
  vgm-strip -c chip [<option>] <file> 
```
## OPTIONS
```
  -c, --chip chip     Specify the chip type to be removed from VGM stream. To remove multiple       
                      chips, just use this option repeatedly.                                       
  -i, --input file    Input VGM file. Standard input will be used if not specified.                 
  -o, --output file   Output VGM file. Standard output will be used if not speicified.              
  -v, --version       Show version.                                                                 
  -h, --help          Show this help.                                                               
```
## CHIPS

The following chip names are available for `-c chip` option.

```                                                                                
sn76489, gameGearStereo, ym2413,                                              
ym2612, ym2612.fm, ym2612.dac,                                                
ym2151, segaPcm, rf5c68,                                                      
ym2203, ym2203.fm, ym2203.ssg,                                                
ym2608, ym2608.fm, ym2608.ssg, ym2608.adpcm,                                  
ym2610, ym3812, ym3526, y8950, ymf262, ymf278b,                               
ymf271, ymz280b, rf5c164, pwm, ay8910, gameBoyDmg,                            
nesApu, multiPcm, upd7759, okim6258, okim6295,                                
k051649, k054539, huc6280, c140, k053260, pokey,                              
qsound, scsp, wonderSwan, vsu, saa1099, es5503,                               
es5506, x1_010, c352, ga20  
```

## Example
```sh
$ vgm-strip -c ym2413 input.vgm > output.vgm
$ vgm-strip -c ym2413 -c ay8910 input.vgm > output.vgm
$ cat foo.vgm | vgm-strip -c ym2612.dac -o output.vgm
```
