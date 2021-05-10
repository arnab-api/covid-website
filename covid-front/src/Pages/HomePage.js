import React, { useState, useEffect, useContext } from 'react';
import { RareImpact } from '../Components/Charts/RareImpact';
import { ObservableImpact } from '../Components/Charts/ObservableImpact';
import { SucceptiblePopulation } from '../Components/Charts/SucceptiblePopulation';
import { MapChart } from '../Components/Charts/MapChart';
import { PlotlyChart } from '../Components/Charts/PlotlyChart'
import { PlotlyChart__2 } from '../Components/Charts/PlotlyChart__2'
import { CaseEstimation } from '../Components/Charts/CaseEstimation';
import { District__cum_rt } from '../Components/Charts/District__cum_rt';

import styles from './homePage.module.css';
import Table from '../Components/Design components/Table/Table';
import OptionBar from '../Components/Design components/OptionBar/OptionBar';
import { DistrictDataContext } from '../App';
import { ThemeProvider, Spinner, Flex, SimpleGrid, Box, Text } from "@chakra-ui/core";

import Grid from '@material-ui/core/Grid';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';

import TableDistrictForcast from '../Components/Design components/Table/TableDistrictForcast';


// const useStyles = makeStyles((theme) => ({
//     root: {
//       flexGrow: 1,
//     },
//     paper: {
//       height: 500,
//       width: 100,
//     },
//     control: {
//       padding: theme.spacing(2),
//     },
//   }));

const useStyles = makeStyles({
    mapContainer: {
      margin: 3,
    //   width: '49%',
      height: 644,
      alignItems: "center",
      justifyContent: "center",
      background: '#fff'
    //   background: '#f2f2f2'
    },
    chartContainer: {
        margin: 3,
        // width: '49%',
        height: 320,
        display: 'flex',
        alignItems: "center",
        justifyContent: "center",
        background: '#fff'
    }
})

export const HomePage = ({
    area, setArea, summaryInfo,
    caseEstimationData, setCaseEstimationData,
    caseEstimationOptions, setCaseEstimationOptions,
    succeptiblePopulationData, setSucceptiblePopulationData,
    succeptiblePopulationOptions, setSucceptiblePopulationOptions,
    observableImpactData, setObservableImpactData,
    observableImpactOptioins, setObservableImpactOptioins,
    rareImpactData, setRareImpactData,
    rareImpactOptions, setRareImpactOptions,
    plotlyData, setPlotlyData,
    plotlyLayout, setPlotlyLayout,
    plotlyData__2, setPlotlyData__2,
    plotlyLayout__2, setPlotlyLayout__2,
    plotlyZoneRisk, setPlotlyZoneRisk,
    plotlyZoneRiskLayout, setPlotlyZoneRiskLayout,
    dist_cum_rt_Data, dist_cum_rt_Options,
    districtForcastTable, setDistrictForcastTable,

    updateSucceptiblePopulationData,
    updateCaseEstimationData,
    updateRareImpactData,
    updateCharts, updateCharts__For,
    updateDist_cum_rt_Data,
    setPageName
}) => {

    setPageName("COVID-19 in Bangladesh")

    const [districtData, setDistrictData] = useContext(DistrictDataContext)
    const classes = useStyles();


    const checkArea = () => {
        // console.log('<',area,">")
        return area == ""
    }
    
    return (
        <section>
            <div className={styles.options}>
                <OptionBar
                    area = {area}
                    setArea = {setArea}  
                    updateCharts = {updateCharts}
                    summaryInfo = {summaryInfo}
                />
            </div>

            <Flex wrap="wrap" width="100%" justify="center" align="center">
                    <Box className={classes.mapContainer} width="59.5%">
                        <MapChart 
                            setArea = {setArea}  
                            updateCharts__For = {updateCharts__For}
                        />
                    </Box>
                   
                    <Flex wrap="wrap" width="40%" justify="center" align="center">
                        <Box width='100%' className={classes.chartContainer}>
                            { 
                                checkArea() ? (
                                    <CaseEstimation
                                        chartData = {caseEstimationData}
                                        chartOptions = {caseEstimationOptions}
                                    />
                                ) : (
                                    <PlotlyChart
                                        data = {plotlyData}
                                        layout = {plotlyLayout}
                                    />
                                )
                            }
                            </Box>
                        <Box width='100%' className={classes.chartContainer}> 
                            {
                                checkArea() ? (
                                    <CaseEstimation
                                        chartData = {rareImpactData}
                                        chartOptions = {rareImpactOptions}
                                    />
                                ) : (
                                    <PlotlyChart
                                        data = {plotlyZoneRisk}
                                        layout = {plotlyZoneRiskLayout}
                                    />
                                )
                            }
                        </Box>
                    </Flex>
            </Flex>
            {
                checkArea() ? (
                    <Table/>
                ) : (
                    // <Table/>
                     <TableDistrictForcast area={area} tableData={districtForcastTable} setTableData = {setDistrictForcastTable}/>
                )
            }

        {/* <div className={styles.homePage}>
            <div className={styles.options}>
                <OptionBar
                    area = {area}
                    setArea = {setArea}  
                    updateCharts = {updateCharts}
                />
            </div> */}

            

            {/* <div className={styles.mapContainer}>
                <MapChart 
                    setArea = {setArea}  
                    updateCharts__For = {updateCharts__For}
                />
            </div> */}

            {/* <div className={styles.chartsContainer}>
                <div className={styles.chart}>
                    { 
                        checkArea() ? (
                            <CaseEstimation
                                chartData = {caseEstimationData}
                                chartOptions = {caseEstimationOptions}
                                area = {area}
                                updateCaseEstimationData = {updateCaseEstimationData}
                            />
                        ) : (
                            <PlotlyChart
                                data = {plotlyData}
                                layout = {plotlyLayout}
                            />
                        )
                    } */}
                        {/* <SucceptiblePopulation 
                            chartData={succeptiblePopulationData} 
                            // setChartData={setSucceptiblePopulationData}
                            chartOptions={succeptiblePopulationOptions}
                            // setChartOptions={setSucceptiblePopulationOptions}
                            area = {area}
                            updateSucceptiblePopulationData = {updateSucceptiblePopulationData}
                        />     */}
                    {/* {
                        districtData.NAME_3 ? <PlotlyChart></PlotlyChart> : <SucceptiblePopulation 
                                                                                chartData={succeptiblePopulationData} 
                                                                                setChartData={setSucceptiblePopulationData}></SucceptiblePopulation>
                    } */}
                {/* </div>
                <div className={styles.chart}>
                    {
                        checkArea() ? (
                            <RareImpact
                                chartData = {rareImpactData}
                                chartOptions = {rareImpactOptions}
                                area = {area}
                                updateRareImpactData = {updateRareImpactData} 
                            />
                        ) : (
                            <PlotlyChart__2
                                data = {plotlyData__2}
                                layout = {plotlyLayout__2}
                            />
                        )
                    } */}
                    {/* <ObservableImpact></ObservableImpact> */}
                {/* </div> */}
            {/* // </div> */}
            {/* // <Table/> */}
        {/* // </div> */}
        {/* // <div> */}
            
        {/* // </div> */}
        </section>
    )
}