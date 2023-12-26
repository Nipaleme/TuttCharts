import { TComparisonValues, TNoteIndex, noteIndex } from "./constants";

export const note2index = (note: TNoteIndex) =>
  noteIndex.findIndex((val) => val === note);

export const rapport2cent = (rapport: number) =>
  (1200 * Math.log10(rapport)) / Math.log10(2);

export function linearRegression(values: number[]): { a: number; b: number } {
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;
  const n = values.length;

  for (let i = 0; i < n; i += 1) {
    sumX += i;
    sumY += values[i];
    sumXY += i * values[i];
    sumXX += i * i;
  }

  const a = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const aera = new Array(n)
    .fill(0)
    .reduce((prev, _, currIndex) => prev + (currIndex + 1) * a, 0);
  const b = (sumY - aera) / n;

  return { a, b };
}

export const calcTemperament = (labels: string[], rapportArray: number[], temperamentEgal: number[]) => labels.map((val, i) => {
    const note = val.replace(/[0-9]/g, "");
    const index = note2index(note);
    const rapport = rapportArray[index];
    const cent = rapport2cent(rapport);
    const centCompare2Equal = cent - temperamentEgal[i];
    return centCompare2Equal;
  });

  export const arraySelected = (select: TComparisonValues) => {
    switch(select) {
        case 'egale':
            return 
    }
    
  }