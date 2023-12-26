import * as React from "react";
import { BarChart, BarPlot } from "@mui/x-charts/BarChart";
import { LinePlot } from "@mui/x-charts/LineChart";
import { AllSeriesType, AxisConfig, ScaleName } from "@mui/x-charts/models";
import { ChartsXAxis } from "@mui/x-charts/ChartsXAxis";
import { ChartsYAxis } from "@mui/x-charts/ChartsYAxis";
import { ChartsTooltip } from "@mui/x-charts/ChartsTooltip";
import { useCallback, useMemo, useState } from "react";
import {
  Box,
  Button,
  Grid,
  List,
  ListItem,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from "@mui/material";
import { ChartsLegend } from "@mui/x-charts/ChartsLegend";
import FormGroup from "@mui/material/FormGroup";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import {
  calcTemperament,
  linearRegression,
  note2index,
  rapport2cent,
} from "./common/functions";
import {
  TComparisonValues,
  comparisonsValues,
  defaultLabels,
  defaultPitchData,
  equalCents,
  quintecircle,
  rapportPentatoniqueDieseAndBemo,
  rapportsQuinteWDiese,
  rapportsWerckmeisterIII,
  selectValues,
  yAxis,
} from "./common/constants";
import { CustomCheckBox } from "./common/components";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUpload";
import { MakeOptional } from "@mui/x-charts/models/helpers";
import { ResponsiveChartContainer } from "@mui/x-charts/ResponsiveChartContainer";

console.log("rapport quinte", rapport2cent(3 / 2) * 12);

const parseText = async (
  fileData: FileList,
  setData: React.Dispatch<
    React.SetStateAction<{
      labels: string[];
      pitchs: number[];
    }>
  >
) => {
  let labels = [] as string[];
  let pitchs = [] as number[];
  let modulo = null as number | null;
  const text = (await fileData[0].text()).split("\n").map((line, lineIndex) =>
    line
      .replaceAll("\r", "")
      .replaceAll("�", "e")
      .split(" ")
      .filter((char) => char.length !== 0)
      .forEach((val, idx) => {
        if (idx === 2) {
          if (modulo === null) {
            modulo = note2index(val);
          }
          const octaveValue = Math.floor((lineIndex + modulo) / 7);
          if (val.includes("#") || val.includes("b")) {
            labels.push(
              val
                .replace("#", `${octaveValue}#`)
                .replace("b", `${octaveValue}b`)
            );
          } else {
            labels.push(`${val}${octaveValue}`);
          }
        }
        if (idx === 4) {
          pitchs.push(Number(val));
        }
      })
  );
  setData({ labels: labels, pitchs: pitchs });
  console.log({ labels: labels, pitchs: pitchs });
};

export default function Combining() {
  const [select, setSelect] = useState<TComparisonValues>("egale");
  const [showLine, setShowline] =
    useState<TComparisonValues>("werckmeisterIII");
  const [data, setData] = useState({
    labels: defaultLabels,
    pitchs: defaultPitchData,
  });

  const handleChange = (event: SelectChangeEvent) => {
    setSelect(event.target.value as TComparisonValues);
  };

  const temperamentEgal = useMemo(
    () =>
      data.labels.map((val) => {
        const note = val.replace(/[0-9]/g, "");
        const index = note2index(note);
        return equalCents[index];
      }),
    [data.labels]
  );

  const temperaments = useMemo(
    () =>
      ({
        egale: new Array(data.labels.length).fill(0),
        zarlino: calcTemperament(
          data.labels,
          rapportPentatoniqueDieseAndBemo,
          temperamentEgal
        ),
        quinte: calcTemperament(
          data.labels,
          rapportsQuinteWDiese,
          temperamentEgal
        ),
        werckmeisterIII: calcTemperament(
          data.labels,
          rapportsWerckmeisterIII,
          temperamentEgal
        ),
      } as Record<TComparisonValues, number[]>),
    [data.labels]
  );

  const dataCompare = useMemo(
    () =>
      data.pitchs.map((val, i) => {
        return val - temperaments[select][i];
      }),
    [select, data.pitchs]
  );

  const lineCompare = useMemo(() => {
    const { a, b } = linearRegression(dataCompare);
    return new Array(dataCompare.length)
      .fill(0)
      .map((val, index) => Number(a) * index + Number(b));
  }, [dataCompare]);

  const minLin = useMemo(
    () => new Array(dataCompare.length).fill(Number(Math.min(...dataCompare))),
    [dataCompare]
  );
  const maxLin = useMemo(
    () => new Array(dataCompare.length).fill(Number(Math.max(...dataCompare))),
    [dataCompare]
  );

  const series = useMemo(
    () =>
      [
        {
          type: "bar",
          stack: "",
          yAxisKey: "pitch",
          label: "pitch",
          data: dataCompare,
        },
        {
          type: "line",
          yAxisKey: "tendance",
          label: "tendance",
          color: "red",
          data: lineCompare,
        },
        {
          type: "line",
          yAxisKey: "egale",
          label: "egale",
          color: "grey",
          data: temperaments.egale,
        },
        {
          type: "line",
          yAxisKey: "zarlino",
          label: "zarlino",
          color: "blue",
          data: temperaments.zarlino,
        },
        {
          type: "line",
          yAxisKey: "quinte",
          label: "quinte",
          color: "green",
          data: temperaments.quinte,
        },
        {
          type: "line",
          yAxisKey: "werckmeisterIII",
          label: "werckmeisterIII",
          color: "orange",
          data: temperaments.werckmeisterIII,
        },
        {
          type: "line",
          yAxisKey: "min",
          label: "min",
          color: "gray",
          data: minLin,
        },
        {
          type: "line",
          yAxisKey: "max",
          label: "max",
          color: "gray",
          data: maxLin,
        },
      ].filter((val) => {
        const yAxisKey = val.yAxisKey as
          | TComparisonValues
          | "min"
          | "max"
          | "tendance"
          | "pitch";
        if (
          select !== "egale" &&
          comparisonsValues.includes(val.yAxisKey as TComparisonValues)
        )
          return false;
        if (showLine !== "egale" && yAxisKey === "egale") return false;
        if (showLine !== "zarlino" && yAxisKey === "zarlino") return false;
        if (showLine !== "quinte" && yAxisKey === "quinte") return false;
        if (showLine !== "werckmeisterIII" && yAxisKey === "werckmeisterIII")
          return false;
        return true;
      }) as AllSeriesType[],
    [dataCompare, select, showLine]
  );

  const circleQuinte = useMemo(
    () =>
      quintecircle.map((key, idx) => {
        const index = data.labels.reduce<null | number>((prev, label, idx) => {
          if (prev !== null) return prev;
          if (key.includes("#")) {
            const newKey = key.replace("#", "");
            if (label.includes("#") && label.includes(newKey)) return idx;
          } else if (key.includes("b")) {
            const newKey = key.replace("b", "");
            if (label.includes("b") && label.includes(newKey)) return idx;
          } else {
            if (label.includes(key)) return idx;
          }
          return prev;
        }, null);
        if (index === null) return { id: idx, value: 100, label: "ERROR" };
        const array = temperaments[select];
        const intervalValue = array[index] + array[index + 7] + 700;
        const valueToColor = (value: number) => {
          if (value < 710 && value > 690) return "#02b2ae";
          if (value > 650 && value < 690) return "#2f97ff";
          if (value <= 650) return "#04008c";
          if (value > 710 && value < 730) return "#60009b";
          if (value >= 730) return "#b810d8";

          return "red";
        };
        return {
          id: idx,
          value: intervalValue,
          label: key,
          color: valueToColor(intervalValue),
        };
      }),
    [select, data.labels]
  );

  console.log(
    circleQuinte.reduce((prev, { value }) => prev + Number(value), 0)
  );

  const handleImportClick = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", ".out");
    input.setAttribute("multiple", "false");
    input.addEventListener(
      "change",
      (el) => {
        const { target } = el;
        const inputEl = target as HTMLInputElement;
        if (
          inputEl.files === null ||
          inputEl.files.length === 0 ||
          inputEl.files[0].size === 0
        )
          return;
        const fileData = inputEl.files;
        parseText(fileData, setData).catch(console.error);
      },
      false
    );
    input.click(); // opening dialog
  }, []);

  const xAxis: MakeOptional<AxisConfig, "id">[] = useMemo(
    () => [
      {
        id: "notes",
        data: data.labels,
        scaleType: "band",
      },
    ],
    [data.labels]
  );

  return (
    <Box
      component="div"
      sx={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Grid container direction={"row"} spacing={2} sx={{ height: "100%" }}>
        <Grid item xs={8} sx={{ height: "100vh" }}>
          <List sx={{ height: "100vh" }}>
            <ListItem sx={{ paddingBottom: "50px" }}>
              <Grid container wrap="wrap" spacing={2}>
                <Grid item>
                  <List>
                    <ListItem>
                      <Typography color="#02b2ae">
                        Tempérament d'analyse
                      </Typography>
                    </ListItem>
                    <ListItem>
                      <Select
                        sx={{ minWidth: 200, maxHeight: 50 }}
                        value={select}
                        onChange={handleChange}
                        label="Mode"
                        variant="standard"
                      >
                        {selectValues.map(({ name, selector }) => (
                          <MenuItem value={selector} key={selector}>
                            {name}
                          </MenuItem>
                        ))}
                      </Select>
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs>
                  <PieChart
                    series={[
                      {
                        arcLabel: (item) => `${Math.round(item.value)}`,
                        data: circleQuinte,
                        highlightScope: {
                          faded: "global",
                          highlighted: "item",
                        },
                        faded: {
                          innerRadius: 30,
                          additionalRadius: -10,
                          color: "gray",
                        },
                      },
                    ]}
                    sx={{
                      [`& .${pieArcLabelClasses.root}`]: {
                        fill: "white",
                        fontWeight: "normal",
                      },
                      minWidth: 600,
                    }}
                    width={undefined}
                    height={300}
                  />
                </Grid>
              </Grid>
            </ListItem>
            <ListItem sx={{height: "50vh"}}>
              <Grid container spacing={2}>
                <Grid item sx={{ maxWidth: 300 }}>
                  <Button
                    size="small"
                    onClick={handleImportClick}
                    variant="outlined"
                  >
                    <FileUploadOutlinedIcon
                      fontSize="small"
                      sx={{ marginRight: "6px" }}
                    />
                    Import pitch.out
                  </Button>
                  <FormGroup>
                    <CustomCheckBox
                      disabled={select !== "egale"}
                      checked={showLine === "egale"}
                      onChange={() => {
                        setShowline("egale");
                      }}
                      color="default"
                      label="Egale"
                    />
                    <CustomCheckBox
                      disabled={select !== "egale"}
                      checked={showLine === "quinte"}
                      onChange={() => {
                        setShowline("quinte");
                      }}
                      color="success"
                      label="Quinte"
                    />
                    <CustomCheckBox
                      disabled={select !== "egale"}
                      checked={showLine === "werckmeisterIII"}
                      onChange={() => {
                        setShowline("werckmeisterIII");
                      }}
                      color="warning"
                      label="Werckmeister III"
                    />
                    <CustomCheckBox
                      disabled={select !== "egale"}
                      checked={showLine === "zarlino"}
                      onChange={() => {
                        setShowline("zarlino");
                      }}
                      color="primary"
                      label="Zarlino"
                    />
                  </FormGroup>
                </Grid>
                <Grid item xs>
                  <Paper sx={{ height: "50vh" }}>
                    <ResponsiveChartContainer
                      sx={{ minHeight: 300 }}
                      series={series}
                      // width={800}
                      // height={400}
                      xAxis={xAxis}
                      yAxis={yAxis}
                    >
                      <BarPlot />
                      <LinePlot />
                      <ChartsLegend />
                      <ChartsTooltip trigger="axis" />
                      <ChartsXAxis
                        label="Notes"
                        position="bottom"
                        axisId="notes"
                      />
                      <ChartsYAxis
                        label="Justesse"
                        position="left"
                        axisId="pitch"
                      />
                    </ResponsiveChartContainer>
                  </Paper>
                </Grid>
              </Grid>
            </ListItem>
          </List>
        </Grid>
        <Grid item xs={4}>
          <BarChart
            sx={{
              minWidth: 400,
              maxHeight: Math.min(window.screen.height - window.screenTop, 900),
            }}
            series={[
              {
                data: data.pitchs,
                label: "pitch",
              },
            ]}
            yAxis={[
              {
                data: data.labels,
                scaleType: "band",
              } as Omit<AxisConfig, "id">,
            ]}
            xAxis={[{ min: -100, max: 100 }]}
            layout="horizontal"
          />
        </Grid>
      </Grid>
    </Box>
  );
}
