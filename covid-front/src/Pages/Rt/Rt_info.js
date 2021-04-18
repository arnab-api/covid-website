import React, { useEffect, useState } from "react";
import "./Rt.css";
import { ThemeProvider, Spinner, Flex, Icon, Text } from "@chakra-ui/core";
import { RtChart } from '../../Rt_components/RtChart'

import axios from "axios";

export const Rt_info = () => {
  const [data, setData] = useState({});
  const [dataPast, setDataPast] = useState(null);
  const [dateNow, setDateNow] = useState("")
  const [datePast, setDatePast] = useState("")
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/latest_rt_value")
      .then((response) => {
        // console.log(" <<<< RT >>>> ", response.data)
        var dateNow = new Date(response.data[response.data.length-1]['Date']).toLocaleDateString("en-BD", {
          month: "long",
          day: "numeric",
          year: "numeric"
        });
        // console.log(" <<<< DateNow >>>>", dateNow)
        setDateNow(dateNow);
        setData(response.data.reverse());
        axios
          .get("/api/before_15_rt")
          .then((response) => {
            var datePast = new Date(response.data[response.data.length-1]['Date']).toLocaleDateString("en-BD", {
              month: "long",
              day: "numeric",
              year: "numeric"
            });
            setDatePast(datePast);
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
            Could not load data
          </Text>
        </Flex>
      ) : (
        <RtChart 
          data={data} dateNow={dateNow} 
          dataPast={dataPast} datePast={datePast}
        />
      )}
    </ThemeProvider>
  );
}

