import React, { useState, useEffect, useContext } from 'react';
import styles from './mapPage.module.css';
import { ThemeProvider, Spinner, Flex, SimpleGrid, Box } from "@chakra-ui/core";
import { MapChart_comparison } from '../../Components/Charts/MapChart_comparison';
import { TableMap } from '../../Components/Design components/Table/TableMap'
import Slider from '@material-ui/core/Slider';
import axios from "axios";
import { withStyles, makeStyles } from '@material-ui/core/styles';

const PrettoSlider = withStyles({
    root: {
      color: '#006699',
      height: 8,
      width: '100%'
    },
    thumb: {
      height: 24,
      width: 24,
      backgroundColor: '#fff',
      border: '2px solid currentColor',
      marginTop: -8,
      marginLeft: -12,
      '&:focus, &:hover, &$active': {
        boxShadow: 'inherit',
      },
    },
    active: {},
    valueLabel: {
      left: 'calc(-50% + 4px)',
    },
    track: {
      height: 8,
      borderRadius: 4,
    },
    rail: {
      height: 8,
      borderRadius: 4,
    },
    mark: {
      backgroundColor: '#bfbfbf',
      height: 16,
      width: 1,
      marginTop: -3,
    },
    markActive: {
      opacity: 1,
      backgroundColor: 'currentColor',
    },
  })(Slider);

  const useStyles = makeStyles({
    mapContainer: {
      margin: 3,
      width: '65%',
      height: 550,
      display: 'flex',
      alignItems: "right",
      justifyContent: "right",
      background: '#fff'
    },
    chartContainer: {
        margin: 3,
        width: '49%',
        height: 320,
        display: 'flex',
        alignItems: "center",
        justifyContent: "center",
        background: '#fff'
    }
})


export const DifferentRiskMaps = ({
    setPageName
}) => {

    setPageName("COVID-19 in Bangladesh")

    const [tooltipContent, setTooltipContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [heatmap_date, setHeatMap_date] = useState("")

    const [riskmap_arr, setRiskMap] = useState([]);
    const [rt_riskmap_arr, setRtRiskMap] = useState([])
    const [tpr_riskmap_arr, setTPRRiskMap] = useState([])
    const [daily_riskmap_arr, setDailyRiskMap] = useState([])

    const [heatmap, setHeatMap] = useState([]);
    const [rt_heatmap, setRtHeatMap] = useState([]);
    const [tpr_heatmap, setTPRHeatMap] = useState([]);
    const [daily_heatmap, setDailyHeatMap] = useState([]);
    

    useEffect(() => {
        axios.get("/api/heat_map_array")
            .then((response) => {
                // console.log(" heat_map array >>> ", response.data, response.data.length);
                // setRiskMap_present(response.data);
                setRiskMap(response.data)
                setHeatMap(response.data[response.data.length-1].heat_map)
                setHeatMap_date(response.data[response.data.length-1].date)

                axios.get("/api/heat_map_array_rt")
                    .then((response) => {
                        // console.log("Rt heat_map array >>> ", response.data, response.data.length);
                        setRtRiskMap(response.data)
                        setRtHeatMap(response.data[response.data.length-1].heat_map)

                        axios.get("/api/heat_map_array_daily")
                            .then((response) => {
                                // console.log("Daily heat_map array >>> ", response.data, response.data.length);
                                setDailyRiskMap(response.data)
                                setDailyHeatMap(response.data[response.data.length-1].heat_map)

                                axios.get("/api/heat_map_array_tpr")
                                    .then((response) => {
                                        console.log("TPR heat_map array >>> ", response.data, response.data.length);
                                        setTPRRiskMap(response.data)
                                        setTPRHeatMap(response.data[response.data.length-1].heat_map)
        
                                        setLoading(false)    
                                    }).catch((error) => {
                                        setLoading(false)
                                    })
                            }).catch((error) => {
                                setLoading(false)
                            })
                    }).catch((error) => {
                        setLoading(false)
                    })
            }).catch((error) => {
                setLoading(false)
            });
    }, []);

    const getFormattedDate = (date) => {
        date = date.split("-");
        let date_present = new Date(date[0], date[1] - 1, date[2]);
        let days = 6;
        let date_past = new Date(date_present.getTime() - (days * 24 * 60 * 60 * 1000))
        let date_present_str = date_present.toLocaleDateString("en-BD", {
            month: "long",
            day: "numeric",
            year: "numeric"
        });
        let date_past_str = date_past.toLocaleDateString("en-BD", {
            month: "long",
            day: "numeric",
            year: "numeric"
        });
        return date_past_str + " - " + date_present_str
    }

    const handleSliderValueChage = (event, value) => {
        console.log("slider value >>> ", event, value, riskmap_arr.length-1)

        console.log(riskmap_arr[value+7].date, rt_riskmap_arr[value+7].date, daily_riskmap_arr[value+7].date)
        
        setHeatMap(riskmap_arr[value+7].heat_map)
        setRtHeatMap(rt_riskmap_arr[value+7].heat_map)
        setTPRHeatMap(tpr_riskmap_arr[value+7].heat_map)
        setDailyHeatMap(daily_riskmap_arr[value+7].heat_map)

        setHeatMap_date(riskmap_arr[value+7].date)
    }

    return (
        <ThemeProvider>
        <section>
            {
                loading ? (
                    <Flex direction="column" align="center" justify="center" height="100vh">
                        <Spinner size="xl" color="green.300" />
                    </Flex>) : (
                    <div>
                    {/* <Flex wrap="wrap" width="100%" height="30px" justify="center" align="center"> */}

                        {/* <br/> */}
                        <SimpleGrid columns={4} spacing={1} style={{width:"100%"}}>
                            <div className={styles.mapContainer} align="center" justify="center">
                                <MapChart_comparison heatmap={heatmap} isMethod={true} modelName={"Our Approach"}/>
                                {/* Our Approach */}
                            </div>
                            <div className={styles.mapContainer} align="center" justify="center">
                                <MapChart_comparison heatmap={tpr_heatmap} isMethod={true} modelName={"TPR"} bins={[3, 10, 20]}/>
                                {/* only TPR */}
                            </div>
                            <div className={styles.mapContainer} align="center" justify="center">
                                <MapChart_comparison heatmap={rt_heatmap} isMethod={true} modelName={"Rt"} bins={[.9, 1.1, 1.4]}/>
                                {/* only Infection Rate(Rt) */}
                            </div>
                            <div className={styles.mapContainer} align="center" justify="center">
                                <MapChart_comparison heatmap={daily_heatmap} isMethod={true} modelName={"Daily New Cases (per 100K)"} bins={[1, 10, 25, 75]}/>
                                {/* only Death Rate */}
                            </div>
                        </SimpleGrid>
                        <hr/>
                        <div style={{'text-align': 'center', fontSize: '14px', background: 'white', width:"100%"}}>
                            <strong> {getFormattedDate(heatmap_date)} </strong>
                        </div>
                        <hr/>
                        
                        <Flex wrap="wrap" width="100%" height="50px" justify="center" align="center" background="white">
                            <div style={{
                                    justify: 'center',
                                    align: 'center',
                                    width: '80%',
                                    // background: "white",
                                }}>
                                    <PrettoSlider 
                                        valueLabelDisplay="off" 
                                        aria-label="pretto slider" 
                                        aria-labelledby="discrete-slider"
                                        defaultValue={riskmap_arr.length-8}
                                        // getAriaValueText={sliderText}
                                        valueLabelFormat={value => ``}
                                        step={1}
                                        marks
                                        min={0}
                                        max={riskmap_arr.length-8}
                                        onChange={handleSliderValueChage}
                                    />
                            </div>
                        </Flex>
                    {/* </Flex> */}
                    </div>
                )
            }
        </section>
        </ThemeProvider>
    )
}