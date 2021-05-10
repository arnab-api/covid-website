import React, { useContext } from 'react';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { ThemeProvider, Spinner, Flex, SimpleGrid, Box, Text } from "@chakra-ui/core";
import { DistrictDataContext } from '../../../App';

const OptionBar = ({
    area,
    setArea,
    updateCharts,
    summaryInfo
}) => {

  const handleClick = () => {
    setArea("")
    updateCharts()
  }

  return (
    <Flex wrap="wrap" width="100%" justify="center" align="center" backgroundColor="#fff">
      <div style={{ 
        display: 'flex', 
        backgroundColor: '#fff', 
        padding: '1rem', 
        borderRadius: '5px', 
        width:"49%" }}>
        <h2 style={{ cursor: 'pointer', fontSize:"20px" }} onClick={handleClick}>Bangladesh </h2>
        {
          area && <h2 style={{ display: 'flex', alignItems: 'center', fontSize:"15px"}}> 
              <ArrowForwardIosIcon style={{fontSize:"20px"}}/> {area[0]+area.substr(1, area.length-1).toLowerCase()}
            </h2>
        }
      </div>
      <div style={{
        width:"49%",
        backgroundColor: '#fff', 
        padding: '1rem',
        textAlign: "right",
        fontSize: "10px",
      }}>
        <b>Confirmed Cases: {summaryInfo.confirmed}</b>
        <br/>
        <b>Deaths: {summaryInfo.deaths}</b>
        <br/>
        <i style={{fontSize:"10px"}}>* untill date {summaryInfo.date}</i>
      </div>
    </Flex>
  );
};

export default OptionBar;