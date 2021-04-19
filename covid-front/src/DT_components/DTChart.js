import React, { useState, useEffect } from "react";
import { Box, Flex, Text, Image, Heading } from "@chakra-ui/core";
import CombinedPlot from "./CombinedPlot";
import { GridPlot } from "./GridPlot";

// export default function RtChart(props) {
export const DTChart = ( {data, dateNow, dataPast, datePast} ) => {
  console.log(" <<< Inside DTChart >>> ", data, dataPast)
  const [width, setWidth] = useState(window.innerWidth * 0.8);
  // const [present, setPresent] = useState(new Date(data[0].Date));
  // const [past, setPast] = useState(new Date(dataPast[0].Date));

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth * 0.9);
    }
    window.addEventListener("resize", handleResize);
  });

  return (
    <Box width="100%"  bg= "white">
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        wrap="wrap"
        padding="0.1rem"
        bg="gray.200"
        color="white"
        // {...props}
        data = {data} dataPast = {dataPast}
      >
        {/* <Flex align="center" mr={5}>
          <Heading as="h1" size="md" letterSpacing={"-.1rem"}>
            <Image
              objectFit="fill"
              src="/pipilika.png"
              style={{
                height: "3rem",
                marginLeft: "1rem",
              }}
            />
          </Heading>
        </Flex>
        <Flex align="center" mr={5}>
          <Heading size="md" color="black">
            করোনা ভাইরাস R<sub>t</sub> সংখ্যা
          </Heading>
        </Flex> */}
      </Flex>
      <Box>
        <Flex direction="column" justify="center" align="center" mb={5}>
          <Text fontSize={"xl"} textAlign="center" fontFamily="Baloo Da 2">
            <h2>
              Doubling time (D<sub>t</sub>) values of {dateNow}
            </h2>
          </Text>
          <CombinedPlot width={width} data={data} />
          <br />
          <br />
          <br />
          <Text fontSize={"xl"} textAlign="center" fontFamily="Baloo Da 2">
            <h2>
            Doubling time (D<sub>t</sub>) values of {datePast}
            </h2>
          </Text>
          <CombinedPlot width={width} data={dataPast} />
          <br />
          <br />
          <br />

          <h2>
            District wise R<sub>t</sub> values
          </h2>

          <Flex wrap="wrap" width="100%" justify="center" align="center">
            {data.map((place) => (
              <GridPlot area={place.district} />
            ))}
          </Flex>

        </Flex>
      </Box>
    </Box>
  );
}
