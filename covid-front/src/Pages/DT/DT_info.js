import React, { useEffect, useState } from "react";
import "./Rt.css";
import { ThemeProvider, Spinner, Flex, Icon, Text } from "@chakra-ui/core";
import { DTChart } from '../../DT_components/DTChart'

import axios from "axios";

export const DT_info = ({setPageName}) => {

  setPageName("COVID-19 in Bangladesh")

  const [data, setData] = useState({});
  const [dataPast, setDataPast] = useState(null);
  const [dateNow, setDateNow] = useState("")
  const [datePast, setDatePast] = useState("")
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/latest_dt_value")
      .then((response) => {
        console.log(response.data)
        var date = response.data[response.data.length-1]['Date']
        date = date.split("-")
        date = new Date(date[0], date[1]-1, date[2])
        date = date.toLocaleDateString("en-BD", {
          month: "long",
          day: "numeric",
          year: "numeric"
        });
        // var dateNow = new Date(dateNow)
        // console.log(" <<<< DateNow >>>>", dateNow)
        setDateNow(date);
        setData(response.data.reverse());
        axios
          .get("/api/before_15_dt")
          .then((response) => {
            var date = response.data[response.data.length-1]['Date']
            date = date.split("-")
            date = new Date(date[0], date[1]-1, date[2])
            date = date.toLocaleDateString("en-BD", {
              month: "long",
              day: "numeric",
              year: "numeric"
            });
            setDatePast(date);
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
        <DTChart 
          data={data} dateNow={dateNow} 
          dataPast={dataPast} datePast={datePast}
        />
      )}
    </ThemeProvider>
  );
}

