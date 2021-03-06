import React, { PureComponent } from "react";
import { Box } from "@chakra-ui/core";
import {
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
  ComposedChart,
  Bar,
  Line,
  Cell,
  Text,
} from "recharts";

export default function CombinedPlot(props) {
  const dataBar = props.data;

  console.log("inside combined plot >>> ", props)

  const CustomTooltip = ({ active, payload, label }) => {
    // console.log(payload);
    if (active) {
      // console.log(">>>>> ", active, payload);
      return (
        <Box
          // width="15rem"
          background="white"
          boxShadow="0px 0px 5px rgba(1,1,1,0.3)"
          px={3}
          py={3}
          borderRadius={10}
          lineHeight={0.6}
          opacity={0.9}
          fontFamily="Baloo Da 2"
        >
          <h3>
            {payload[0].payload.district === "total"
              ? "Whole Bangladesh"
              : payload[0].payload.district}
          </h3>
          <br/>
          <h4>Rt: {payload[0].payload.ML}</h4>
          <br/>
          <h5>
            High:{" "}{(payload[0].payload.Low_90 + payload[0].payload.High_90).toFixed(2)}
            &nbsp; &nbsp; 
            Low: {" "}{payload[0].payload.Low_90.toFixed(2)}
          </h5>
          <br/>
          <h5></h5>
        </Box>
      );
    }

    return null;
  };

  class CustomizedLabel extends PureComponent {
    render() {
      const { x, y, stroke } = this.props;

      return (
        <Text
          x={x + 3}
          y={y - 8}
          dy={-4}
          fill={stroke}
          fontSize={12}
          textAnchor="start"
          verticalAnchor="center"
          angle={-90}
        >
          {dataBar[this.props.index].district === "total"
            ? "Whole Bangladesh"
            : dataBar[this.props.index].district}
        </Text>
      );
    }
  }
  return (
    <ComposedChart
      width={props.width}
      height={250}
      data={dataBar}
      margin={{
        top: 20,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      {/* <XAxis dataKey="district" /> */}
      <CartesianGrid vertical={false} />
      <YAxis
        allowDataOverflow={true}
        orientation="left"
        axisLine={false}
        tickMargin={10}
        // domain={[0.4, 1.5]}
        domain={[
          Math.floor(Math.min.apply(Math, dataBar.map(function(o) { return o.Low_90; })) * 5)/5,
          Math.ceil(Math.max.apply(Math, dataBar.map(function(o) { return o.Low_90 + o.High_90; })) * 5)/5
        ]}
        type="number"
      />

      <Bar dataKey="Low_90" stackId="a" fill="#ffffff00" />
      <Bar dataKey="High_90" stackId="a" radius={[100, 100, 100, 100]}>
        {dataBar.map((entry, index) => (
          <Cell fill={entry.ML < 1 ? "#7fefa0" : "#ff8787"}></Cell>
        ))}
      </Bar>
      <Line
        type="monotone"
        dataKey="ML"
        stroke="#8884d800"
        label={<CustomizedLabel />}
        dot={{
          stroke: "#ffffff80",
          strokeWidth: 10,
          width: 25,
          height: 25,
        }}
      />
      <Tooltip content={<CustomTooltip />} />
      <ReferenceLine
        y={1}
        stroke="red"
        strokeWidth={1.0}
        label={{
          // value: "Rt=1",
          position: "left",
        }}
      />
    </ComposedChart>
  );
}
