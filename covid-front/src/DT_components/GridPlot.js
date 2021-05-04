import React, { useState, useEffect } from "react";
import { Box, Flex, Text } from "@chakra-ui/core";
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from "recharts";
import axios from "axios";
import "../Pages/Rt/Rt.css"

export const GridPlot = ({ area }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active) {
      // console.log( " >>>>> ", active, payload, label)
      return (
        <Box
          background="white"
          boxShadow="0px 0px 5px rgba(1,1,1,0.3)"
          px={3}
          py={3}
          borderRadius={10}
          lineHeight={0.6}
          opacity={0.9}
          fontFamily="Baloo Da 2"
        >
          <h2>
            D<sub>t</sub>: {payload[0].value.toFixed(2)}
            {/* {payload['DT'].toFixed(2)} */}
            {/* {payload[2].value.toFixed(2)} */}
          </h2>
          <br />
          <Text color="green.800" fontWeight="bold">{label}</Text>
        </Box>
      );
    }

    return null;
  };

  const processData = (plot_data) => {
    // console.log("processing", plot_data)
    if (plot_data === "None") {
      return null;
    }

    let processedData = [];
    for (let i = plot_data.length - 1; i >= 0; i--) {
      // console.log(i, plot_data[i])
      var date = plot_data[i]['Date']
      date = date.split("-")
      date = new Date(date[0], date[1] - 1, date[2])
      date = date.toLocaleDateString("en-BD", {
        month: "long",
        day: "numeric",
        year: "numeric"
      });
      // console.log(date)
      const dataElement = {
        // DATE: new Date(plot_data[i].Date).toLocaleDateString("en-BD", {
        //   month: "long",
        //   day: "numeric",
        // }),
        DATE: date,
        DT: plot_data[i].doubling_time,
      };
      processedData.push(dataElement);
    }
    // console.log("processed")
    return processedData;
  };

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/dt_value/" + area)
      .then((response) => {
        // console.log(area, ' ===> ', response.data.length, response.data);
        var dt = processData(response.data)
        // console.log(dt)
        // domain=[
        //   Math.floor(Math.min.apply(Math, dt.map(function(o) { return o.doubling_time; }))/100)*100,
        //   Math.ceil(Math.max.apply(Math, dt.map(function(o) { return o.doubling_time; }))/100)*100
        // ]

        //   setData(
        //     processData(
        //       // response.data.filter((word) => word.district === area)
        //       response.data
        //     )
        //   );
        //   setLoading(false);
        // })
        setData(dt);
      })
      // .catch((error) => {
      //   setData(null);
      //   setLoading(false);
      // });
  }, []);

  return (
    <>
      {/* {loading ? (
        <Flex direction="column" align="center" justify="center"></Flex>
      ) :  */}
      { data === null ? (
        <Flex
          direction="column"
          align="center"
          justify="center"
          color="red.500"
        ></Flex>
      ) : 
      (
        <>
          <Box
            className="disable-scrollbars graph-container"
            style={{
              overflowX: "scroll",
              backgroundColor: "#fafafa85",
              padding: "22px",
              paddingLeft: "0px",
              borderRadius: "10px",
              margin: "10px",
            }}
          >
            <h4 style={{ textAlign: "center" }}>{area}</h4>
            <ComposedChart
              width={350}
              height={200}
              data={data}
              margin={{
                top: 20,
                right: 20,
                bottom: 20,
                left: 20,
              }}
            >
              <XAxis
                dataKey="DATE"
                allowDataOverflow={true}
                type="category"
                tickMargin={10}
              />
              <YAxis
                dataKey="DT"
                allowDataOverflow={true}
                // domain={[0, 2000]}
                domain={[
                  Math.floor(Math.min.apply(Math, data.map(function(o) { return o.DT; }))/100)*100,
                  Math.ceil(Math.max.apply(Math, data.map(function(o) { return o.DT; }))/100)*100
                ]}
                orientation="left"
                axisLine={false}
                tickMargin={10}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="DT"
                stroke="#8080ff"
                strokeWidth={3}
                dot={{
                  stroke: "#8080ff",
                  strokeWidth: 3,
                  width: 10,
                  height: 10,
                }}
              />
            </ComposedChart>
          </Box>
        </>
       )} 
    </>
  );
}
