import React, { useState, useEffect, useContext } from 'react';
import styles from './worldPage.module.css';
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

    }
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

export const WorldMapPage = ({
    setPageName
}) => {

    setPageName("COVID-19 crisis");

    const [riskmap, setRiskMap] = useState({})
    const [riskmap_present, setRiskMap_present] = useState({})
    const [riskmap_arr, setRiskMap_Array] = useState([])
    // const [riskmap_future, setRiskMap_future] = useState({})
    const [loading, setLoading] = useState(true);

    function createTableEntry(name, risk) {
        return { 
            'name': name, 
            'risk': risk
          };
      }
      
      const [tablerows, setTableRows] = useState([
        createTableEntry('India', 324171354/3287263),
        createTableEntry('China', 1403500365/9596961),
        // createTableEntry('Italy', 'IT', 60483973, 301340),
        // createTableEntry('United States', 'US', 327167434, 9833520),
        // createTableEntry('Canada', 'CA', 37602103, 9984670),
        // createTableEntry('Australia', 'AU', 25475400, 7692024),
        // createTableEntry('Germany', 'DE', 83019200, 357578),
        // createTableEntry('Ireland', 'IE', 4857000, 70273),
        // createTableEntry('Mexico', 'MX', 126577691, 1972550),
        // createTableEntry('Japan', 'JP', 126317000, 377973),
        // createTableEntry('France', 'FR', 67022000, 640679),
        // createTableEntry('United Kingdom', 'GB', 67545757, 242495),
        // createTableEntry('Russia', 'RU', 146793744, 17098246),
        // createTableEntry('Nigeria', 'NG', 200962417, 923768),
        // createTableEntry('Brazil', 'BR', 210147125, 8515767),
      ]);

    
    const updateTableRows = (cur_risk_map) => {
        let row_data = []
        for(let i = 0; i < cur_risk_map.heat_map.length; i++){
            row_data.push({
                "rank": (i+1),
                "name": cur_risk_map.heat_map[i].name,
                "risk": cur_risk_map.heat_map[i].value
            })
        }
        setTableRows(row_data)
    }

    useEffect(() => {
        axios.get("/api/world_risk_arr")
            .then((response) => {
                console.log(" heat_map array >>> ", response.data, response.data.length);
                // setRiskMap_present(response.data);
                setRiskMap_Array(response.data)
                setRiskMap(response.data[response.data.length-1])
                updateTableRows(response.data[response.data.length-1])
                setLoading(false)
            }).catch((error) => {
                setRiskMap_present({})
                setLoading(false)
            });
    }, []);

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
        console.log("slider value >>> ", event, value)
        setRiskMap(riskmap_arr[value])
        updateTableRows(riskmap_arr[value])
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
                        {/* <div className={styles.mapContainer}>
                            <WorldMap heatmap={riskmap.heat_map} heatmap_date={riskmap.date}/>
                        </div>
                        <div className={styles.chartsContainer}>
                            <WorldPageTable/>
                        </div> */}
                        <div style={{background: '#fff'}}>
                            <WorldMap 
                                heatmap={riskmap.heat_map} 
                                heatmap_date={riskmap.date}
                                rows={tablerows}
                            />
                        </div>
                        
                        <div style={{background: '#fff'}}>
                            <br/>
                            <br/>
                            <Flex wrap="wrap" width="100%" justify="center" align="center">
                                {/* <div className={classes.slider_root}>
                                    <Slider 
                                        defaultValue={riskmap_arr.length-1}
                                        getAriaValueText={sliderText}
                                        aria-labelledby="discrete-slider"
                                        valueLabelDisplay="on"
                                        valueLabelFormat={value => ``}
                                        step={1}
                                        marks
                                        min={0}
                                        max={riskmap_arr.length-1}
                                        onChange={handleSliderValueChage}
                                    />
                                </div> */}
                                <PrettoSlider 
                                    valueLabelDisplay="on" 
                                    aria-label="pretto slider" 
                                    aria-labelledby="discrete-slider"
                                    defaultValue={riskmap_arr.length-1}
                                    getAriaValueText={sliderText}
                                    valueLabelFormat={value => ``}
                                    step={1}
                                    marks
                                    min={0}
                                    max={riskmap_arr.length-1}
                                    onChange={handleSliderValueChage}
                                />
                            </Flex>
                            <div style={{ 'text-align': 'center' }}>
                                <strong> {riskmap.date} </strong>
                            </div>
                        </div>

                        <br/>
                        <br/>
                        {/* <Text fontSize={"xl"} textAlign="center" fontFamily="Baloo Da 2">
                            <h2>
                                Countries sorted in the descending ordrer of risk value (calculated for the data avalible on {riskmap.date})
                            </h2>
                            <hr/>
                        </Text>
                        <br/>
                        <Flex wrap="wrap" width="100%" justify="center" align="center">
                            {
                                riskmap.heat_map.map((country, index) => (
                                <Card className={classes.country_root}>
                                    <CardContent className={classes.content}>
                                        <Typography gutterBottom variant="h6" component="h2">
                                            <strong>{(index+1) + ". "+ country.name} &nbsp;</strong>
                                            <svg width="15" height="15">
                                                <rect width="20" height="20" style={{
                                                    fill: my_colorScale(country.value, true),
                                                    strokeWidth:1,
                                                    stroke: 'rgb(0,0,0)'
                                                }}/>
                                            </svg>
                                        </Typography> 
                                        <Typography gutterBottom variant="body2" component="h2">
                                            Risk Value: {checkValue(country.value)} <br/>
                                            R<sub>t</sub>: {checkValue(country.rt.value)}
                                            
                                            {(checkValue(country.rt.value) !== 'N/A') ? 
                                                " (" + country.rt.date + ")"    
                                                : ""
                                            }
                                        </Typography>
                                    </CardContent>
                                </Card>
                                ))
                            }
                        </Flex> */}
                    </div>
                )
            }
            </section>
        </ThemeProvider>
    )
}
