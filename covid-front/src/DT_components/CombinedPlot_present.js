import React, { PureComponent } from "react";
import { Box } from "@chakra-ui/core";
import {
  YAxis,
  XAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
  ComposedChart,
  Bar,
  Line,
  Cell,
  Text,
  BarChart
} from "recharts";

export default function CombinedPlot_prsent(props) {
  const dataBar = props.data;
  const dataPast = props.dataPast

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
          <h5>
            Doubling Time: {" "}{payload[0].payload.doubling_time.toFixed(2)}
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
          x={x + 10}
          y={y - 2}
          dy={-4}
          fill={'#000'}
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
        domain={[
          Math.floor(dataBar[0].doubling_time/100)*100,
          Math.ceil(Math.max.apply(Math, dataBar.map(function(o) { return o.doubling_time; }))/100)*100
        ]}
        type="number"
      />

      {/* <Bar dataKey="Low_90" stackId="a" fill="#ffffff00" /> */}
      <Bar  dataKey="doubling_time" stackId="a" 
            // radius={[100, 100, 100, 100]} 
            label={<CustomizedLabel />}
            >
        {dataBar.map((entry, index) => {
          // console.log('>>>>>>>>>> combined plot present >> ', entry, index, entry.doubling_time, dataPast[index].doubling_time)
          let color = "#ff8787"
          if(entry.doubling_time > dataPast[index].doubling_time) color = "#7fefa0"
          return <Cell fill={color}></Cell>
        })}
      </Bar>
      <Tooltip content={<CustomTooltip />} />
    </ComposedChart>
    
    // <BarChart 
    //         width={props.width/3}
    //         height={800}
    //         data={dataBar}
    //         layout="vertical" barCategoryGap={.3}
    //         margin={{ top: 0, right: 50, left: 0, bottom: 0 }}>
    //   <XAxis type="number" />
    //    <YAxis type="category" width={150} padding={{ left: 20 }} dataKey="district" hide/>
            
    //    <Bar 
    //        dataKey="doubling_time" 
    //        fill="#99bbff"
    //        label={<CustomizedLabel />}
    //        />
    //     <Tooltip content={<CustomTooltip />} />
    //   </BarChart>
  );
}
