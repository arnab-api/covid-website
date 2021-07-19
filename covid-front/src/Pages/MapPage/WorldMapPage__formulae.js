import React, { useState, useEffect, useContext } from 'react';
import styles from './mapPage.module.css';
import { ThemeProvider, Spinner, Flex, SimpleGrid, Box, Text } from "@chakra-ui/core";
import { MapChart_comparison } from '../../Components/Charts/MapChart_comparison';

import axios from "axios";
import { WorldMap } from '../../Components/Charts/WorldMap';

// import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography'
import Slider from '@material-ui/core/Slider';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { WorldPageTable } from '../../Components/Tables/WorldPageTable'
import { PlotlyChart } from '../../Components/Charts/PlotlyChart';
import { WorldMap_comparison } from '../../Components/Charts/WorldMap_comparison';

// tab styles
const useStyles = makeStyles({
    root: {
      flexGrow: 1,
      backgroundColor: '#f2f2f2'
    },
    country_root: {
        margin: 2,
        width: '20%',
        display: 'flex'
    },
    content: {
        height: 150
    },
    slider_root: {
        width: '80%',
        margin: 10,

    },
    mapContainer: {
        // margin: 3,
        width: '69%',
        display: 'flex',
        alignItems: "center",
        justifyContent: "center",
        // background: '#fff',
        background: '#f2f2f2'
      },
  });

const COLOR_BUCKET = [
    'rgb(84, 180, 95, .6)',   // trivial
    'rgb(236, 212, 36, .6)',
    'rgb(248, 140, 81, .6)',   // Accelerated spread
    'rgb(192, 26, 39, .6)',   // Tipping point
]
const COLOR_BUCKET_tooltip = [
    'rgb(84, 180, 95, 1)',   // trivial
    'rgb(236, 212, 36, 1)',
    'rgb(248, 140, 81, 1)',   // Accelerated spread
    'rgb(192, 26, 39, 1)',   // Tipping point
]
const bins = [1, 9, 24]
const DEFAULT_COLOR = '#EEE';

const PrettoSlider = withStyles({
    root: {
      color: '#006699',
      height: 8,
      width: '80%'
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

export const WorldMapPage__formulae = ({
    setPageName
}) => {

    setPageName("COVID-19 crisis");

    const [loading, setLoading] = useState(true);
    const [heatmap_date, setHeatMap_date] = useState("")

    const [riskmap_arr, setRiskMap] = useState([]);
    const [riskmap_arr_formulae, setRiskMap_formulae] = useState([])

    const [heatmap, setHeatMap] = useState([]);
    const [heatmap_formulae, setHeatMap_formulae] = useState([]);


    const [daily_risk_plot, setDailyRiskPlot] = useState({})
    const [daily_risk_plot_formulae, setDailyRiskPlot_formulae] = useState({})

    const [daily_rt_cases_plot, setRtCasesPlot] = useState({})


    useEffect(() => {
        axios.get("/api/world_risk_arr")
            .then((response) => {
                console.log(" heat_map array >>> ", response.data, response.data.length);
                // setRiskMap_present(response.data);
                setRiskMap(response.data)
                setHeatMap(response.data[response.data.length-1].heat_map)
                setHeatMap_date(response.data[response.data.length-1].date)

                axios.get("/api/world_risk_arr_formulae")
                    .then((response) => {
                        console.log(" heat_map array >>> ", response.data, response.data.length);
                        // setRiskMap_present(response.data);
                        setRiskMap_formulae(response.data)
                        setHeatMap_formulae(response.data[response.data.length-1].heat_map)                    

                        axios.get("/api/country_risk_plot/Bangladesh")
                            .then((response) => {
                                setDailyRiskPlot(response.data)
                                // console.log("plotly response", response.data[0])
                                // console.log("plotly data >>>> ", response.data[0].data)
                                // console.log("plotly layout >>>> ", response.data[0].layout)
                                axios.get("/api/country_rt_cases_plot/Bangladesh")
                                    .then((response) => {
                                        setRtCasesPlot(response.data)
                                        // console.log("plotly response", response.data[0])
                                        // console.log("plotly data >>>> ", response.data[0].data)
                                        // console.log("plotly layout >>>> ", response.data[0].layout)
                                        axios.get("/api/country_risk_plot_formulae/Bangladesh")
                                        .then((response) => {
                                            setDailyRiskPlot_formulae(response.data)
                                            // console.log("plotly response", response.data[0])
                                            // console.log("plotly data >>>> ", response.data[0].data)
                                            // console.log("plotly layout >>>> ", response.data[0].layout)
                                            setLoading(false)
                                        }).catch((error) => {
                                            setLoading(false)
                                        });
                                    }).catch((error) => {
                                        setLoading(false)
                                    });
                            }).catch((error) => {
                                setLoading(false)
                            });
                    }).catch((error) => {
                        setLoading(false)
                    });
            }).catch((error) => {
                setLoading(false)
            });
    }, []);

    const updateRiskTimeline__For = (country, formulae=false) => {
        let url = "/api/country_risk_plot/";
        if(formulae == true) url = "/api/country_risk_plot_formulae/"
        axios.get(url+country)
            .then((response) => {
                if(formulae == false) setDailyRiskPlot(response.data);
                else setDailyRiskPlot_formulae(response.data);
                // console.log(country, " >> plotly response", response.data[0])
                // console.log(country, " >> plotly data >>>> ", response.data[0].data)
                // console.log(country, " >> plotly layout >>>> ", response.data[0].layout)
            }).catch((error) => {
                console.log("could not load risk timeline for >> ", country)
            });
    }

    const updateRtCasesTimeline__For = (country) => {
        axios.get("/api/country_rt_cases_plot/"+country)
            .then((response) => {
                setRtCasesPlot(response.data)
                // console.log(country, " >> plotly response", response.data[0])
                // console.log(country, " >> plotly data >>>> ", response.data[0].data)
                // console.log(country, " >> plotly layout >>>> ", response.data[0].layout)
            }).catch((error) => {
                console.log("could not load rt and cases timeline for >> ", country)
            });
    }


    const updatePlots__For = (country) => {
        updateRiskTimeline__For(country)
        updateRtCasesTimeline__For(country)
    }

    const updatePlots_formulae__For = (country) => {
        updateRiskTimeline__For(country, true)
        updateRtCasesTimeline__For(country)
    }

    const classes = useStyles(); 
    const [value, setValue] = React.useState(0);
  
    // const handleChange = (event, newValue) => {
    //     console.log(" >>>> ", event, newValue)
    //     if(newValue == 1) setRiskMap(riskmap_past)
    //     else setRiskMap(riskmap_present)
    //     setValue(newValue);
    // };

    const my_colorScale = (value, for_tooltip = false) => {
        // console.log("---> ", value)
        let bucket = COLOR_BUCKET;
        if(for_tooltip == true) bucket = COLOR_BUCKET_tooltip
        if(value == -1) return DEFAULT_COLOR;
        if(value < bins[0]) return bucket[0];
        if(value < bins[1]) return bucket[1];
        if(value < bins[2]) return bucket[2];
        return bucket[3];
    }

    const checkValue = (value) => {
        if(value == -1) return "N/A";
        return value.toFixed(2)
    }

    const [seekValue, setSeekValue] = useState("seek value!!!")
    const sliderText = (value) => {
        return `slider value: ${value}`
    }

    const sliderToolTipValue = (value) => {
        return `slider value: ${value}`
    }

    const handleSliderValueChage = (event, value) => {
        console.log("slider value >>> ", event, value, riskmap_arr.length-1)

        console.log(riskmap_arr[value+7].date)
        
        setHeatMap(riskmap_arr[value+7].heat_map)
        setHeatMap_formulae(riskmap_arr_formulae[value+7].heat_map)

        setHeatMap_date(riskmap_arr[value+7].date)
    }

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

    return (
        <ThemeProvider>
        <section>
            {
                loading ? (
                    <Flex direction="column" align="center" justify="center" height="100vh">
                        <Spinner size="xl" color="green.300" />
                    </Flex>) : (
                    <div>
                        <SimpleGrid columns={2} spacing={1} style={{width:"100%"}}>
                            <div className={styles.worldMapContainer}>
                                <WorldMap_comparison
                                    heatmap={heatmap} 
                                    isMethod = {true}
                                    modelName = "Our Approach"
                                    updatePlots__For = {updatePlots__For}
                                />
                            </div>
                            <div className={styles.worldMapContainer}>
                                <WorldMap_comparison 
                                    heatmap={heatmap_formulae} 
                                    isMethod = {true}
                                    modelName = "New Approach"
                                    updatePlots__For = {updatePlots_formulae__For}
                                    bins={[Math.exp(3), Math.exp(5), Math.exp(7)]}
                                />
                            </div>
                        </SimpleGrid>
                        <hr/>
                        <div style={{'text-align': 'center', fontSize: '14px', background: 'white', width:"100%"}}>
                            <strong> {getFormattedDate(heatmap_date)} </strong>
                        </div>
                        <hr/>
                        
                        <Flex wrap="wrap" width="100%" height="50px" justify="center" align="center" background="white">
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
                        </Flex>
                    
                        <hr/>
                        <div style={{
                            background: "white"
                        }}>
                            <br/>
                            <SimpleGrid columns={2} spacing={1} style={{width:"100%"}}>
                                <Box width='100%'> 
                                    {
        
                                        <PlotlyChart
                                            data = {daily_risk_plot[0].data}
                                            layout = {daily_risk_plot[0].layout}
                                        />
                                    }
                                </Box>
                                <Box width='100%'> 
                                    {
        
                                        <PlotlyChart
                                            data = {daily_risk_plot_formulae[0].data}
                                            layout = {daily_risk_plot_formulae[0].layout}
                                        />
                                    }
                                </Box>
                            </SimpleGrid>

                            <hr/>
                            <br/>

                            {/*<SimpleGrid columns={2} spacing={1} style={{width:"100%"}}>
                                <Box width='100%'> 
                                    {
                                        <PlotlyChart
                                            data = {daily_rt_cases_plot[0].data}
                                            layout = {daily_rt_cases_plot[0].layout}
                                        />
                                    }
                                </Box>
                                <Box width='100%'> 
                                    {
                                        <PlotlyChart
                                            data = {daily_rt_cases_plot[0].data}
                                            layout = {daily_rt_cases_plot[0].layout}
                                        />
                                    }
                                </Box>
                            </SimpleGrid> */}
                        </div>
                    </div>
                )
            }
        </section>
        </ThemeProvider>
    )
}
