import React, { useEffect, useState } from "react";
import "./Rt.css";
import { ThemeProvider, Spinner, Flex, Icon, Text } from "@chakra-ui/core";
import { RtChart } from '../../Rt_components/RtChart'

import axios from "axios";

export const Rt_info = () => {
  const [data, setData] = useState({});
  const [dataPast, setDataPast] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/latest_rt_value")
      .then((response) => {
        console.log(" <<<< RT >>>> ", response.data)
        // setData(response.data)
        setData(response.data.reverse());
        // console.log(data)
        axios
          .get("/api/before_15_rt")
          .then((response) => {
            setDataPast(response.data.reverse());
            setLoading(false);
          })
          .catch((error) => {
            setDataPast(null);
            setLoading(false);
          });
      })
      .catch((error) => {
        setData(null);
        setLoading(false);
      });
  }, []);

  return (
    <ThemeProvider>
      {loading ? (
        <Flex direction="column" align="center" justify="center" height="100vh">
          <Spinner size="xl" color="green.300" />
        </Flex>
      ) : data === null ? (
        <Flex
          direction="column"
          align="center"
          justify="center"
          height="100vh"
          color="red.500"
        >
          <Icon name="warning" size="32px" color="red.500" />
          <Text fontSize="xl" fontFamily="Baloo Da 2">
            ডাটা পাওয়া যায়নি
          </Text>
        </Flex>
      ) : (
        <RtChart data={data} dataPast={dataPast} />
      )}
    </ThemeProvider>
  );
}

