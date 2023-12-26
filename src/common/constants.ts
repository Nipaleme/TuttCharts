import { AxisConfig, ScaleName } from "@mui/x-charts";
import { MakeOptional } from "@mui/x-charts/models/helpers";

export const comparisonsValues = [
  "egale",
  "werckmeisterIII",
  "zarlino",
  "quinte",
] as const;

export const selectValues = comparisonsValues.map((selector) => ({
  name: `${selector[0].toLocaleUpperCase()}${selector.slice(1)}`.replace('III', ' III'),
  selector: selector,
}));

export type TComparisonValues = (typeof comparisonsValues)[number];

// https://www.spirit-science.fr/doc_musique/Intonation.html#mozTocId47886
// https://fr.wikipedia.org/wiki/Cent_(musique)

export const quintecircle = [
  "do",
  "sol",
  "re",
  "la",
  "mi",
  "si",
  "fa#",
  "do#",
  "sol#",
  "re#", // mib
  "la#", // sib
  "fa",
];

export const noteIndex = [
  "do",
  "do#",
  "re",
  "re#",
  "mi",
  "fa",
  "fa#",
  "sol",
  "sol#",
  "la",
  "la#",
  "si",
];

export type TNoteIndex = (typeof noteIndex)[number];

export const equalCents = [
  0, //do
  100, //do#
  200, //re
  300, //re#
  400, //mi
  500, //fa
  600, //fa#
  700, //sol
  800, //sol#
  900, //la
  1000, //la#
  1100, //si
  1200, //do
];

export type TScaleType =
  | "linear"
  | "band"
  | "point"
  | "log"
  | "pow"
  | "sqrt"
  | "time"
  | "utc"
  | undefined;

//https://upload.wikimedia.org/wikipedia/commons/5/55/Gamme_de_Zarlino.png
const rapportsPentatoniqueWDiese = [
  1, //do
  25 / 24, //do#
  9 / 8, //re
  75 / 64, //re#
  5 / 4, //mi
  4 / 3, //fa
  45 / 32, //fa#
  3 / 2, //sol
  25 / 16, //sol#
  5 / 3, //la
  225 / 128, //la#
  15 / 8, //si
  2, //do
];
const rapportsPentatoniqueWBemol = [
  1, //do
  16 / 15, //reb
  9 / 8, //re
  6 / 5, //mib
  5 / 4, //mi
  4 / 3, //fa
  64 / 45, //solb
  3 / 2, //sol
  8 / 5, //lab
  5 / 3, //la
  9 / 5, //sib
  15 / 8, //si
  2, //do
];
export const rapportPentatoniqueDieseAndBemo = [
  1, //do
  25 / 24, //do#
  9 / 8, //re
  6 / 5, //mib
  5 / 4, //mi
  4 / 3, //fa
  45 / 32, //fa#
  3 / 2, //sol
  25 / 16, //sol#
  5 / 3, //la
  9 / 5, //sib
  15 / 8, //si
  2, //do
];

// https://www.assistancescolaire.com/eleve/1re/enseignement-scientifique/reviser-le-cours/1_sci_28
export const rapportsQuinteWDiese = [
  1, //do
  2187 / 2048, //do#
  9 / 8, //re
  19683 / 16384, //mib
  81 / 64, //mi
  4 / 3, //fa
  177147 / 131072, //fa#
  3 / 2, //sol
  6561 / 4096, //sol#
  27 / 16, //la
  59049 / 32768, //la#
  243 / 128, //si
  2, //do
];

// https://en.wikipedia.org/wiki/Werckmeister_temperament

export const rapportsWerckmeisterIII = [
  1, //do
  256 / 243, //do#
  (64 / 81) * Math.sqrt(2), //re
  32 / 27, //re#
  (256 / 243) * Math.pow(2, 1 / 4), //mi
  4 / 3, //fa
  1024 / 729, //fa#
  (8 / 9) * Math.pow(8, 1 / 4), //sol
  128 / 81, //sol#
  (1024 / 729) * Math.pow(2, 1 / 4), //la
  16 / 9, //la#
  (128 / 81) * Math.pow(2, 1 / 4), //si
  2, //do
];

export const yAxis: MakeOptional<AxisConfig<ScaleName, any>, "id">[] = [
  {
    id: "pitch",
    min: -100,
    max: 100,
  },
  {
    id: "tendance",
    scaleType: "linear" as TScaleType,
    min: -100,
    max: 100,
  },
  {
    id: "min",
    scaleType: "linear" as TScaleType,
    min: -100,
    max: 100,
  },
  {
    id: "max",
    scaleType: "linear" as TScaleType,
    min: -100,
    max: 100,
  },
  ...comparisonsValues.map((id) => ({
    id: id,
    scaleType: "linear" as TScaleType,
    min: -100,
    max: 100,
  })),
];

export const defaultLabels = [
  "re0",
  "re0#",
  "mi0",
  "fa0",
  "fa0#",
  "sol0",
  "sol0#",
  "la0",
  "la0#",
  "si0",
  "do1",
  "do1#",
  "re1",
  "re1#",
  "mi1",
  "fa1",
  "fa1#",
  "sol1",
  "sol1#",
  "la1",
  "la1#",
  "si1",
  "do2",
  "do2#",
  "re2",
  "re2#",
  "mi2",
  "fa2",
  "fa2#",
  "sol2",
  "sol2#",
  "la2",
  "la2#",
];

export const defaultPitchData = [
  -12.5, -8.59, 7.09, 38.0, -33.82, -11.36, -7.39, -1.77, 16.77, 4.69, -0.67,
  -11.55, -17.25, -13.37, -6.11, 18.94, -25.97, 3.69, 4.21, -2.39, -7.65, 2.78,
  23.34, -27.39, 20.78, 13.91, 10.04, -31.47, 4.48, 25.73, 13.91, 15.15, 0.11,
];
