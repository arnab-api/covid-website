import React, { useState, useEffect, useContext } from 'react';
import styles from './mapPage.module.css';
import { ThemeProvider, Spinner, Flex, SimpleGrid, Box, Text } from "@chakra-ui/core";
import { MapChart_comparison } from '../../Components/Charts/MapChart_comparison';

import axios from "axios";
import { WorldMap } from '../../Components/Charts/WorldMap';

import { makeStyles } from '@material-ui/core/styles';
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


export const WorldMapPage = ({
}) => {

    const [riskmap, setRiskMap] = useState({})
    const [riskmap_present, setRiskMap_present] = useState({})
    const [riskmap_past, setRiskMap_past] = useState({})
    // const [riskmap_future, setRiskMap_future] = useState({})
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("/api/world_risk")
            .then((response) => {
                console.log(" heat_map >>> ", typeof(response.data));
                setRiskMap_present(response.data);
                setRiskMap(response.data)
                axios.get("/api/world_risk_past")
                    .then((response) => {
                        console.log(" past_heat_map >>> ", typeof(response.data))
                        setRiskMap_past(response.data);
                        setLoading(false)
                        // axios.get("/api/future_heat_map")
                        //     .then((response) => {
                        //         console.log(" future_heat_map >>> ", response.data)
                        //         setRiskMap_future(response.data)
                        //         setLoading(false)
                        //     }).catch((error) => {
                        //         setRiskMap_future({})
                        //         setLoading(false)
                        //     });
                    }).catch((error) => {
                        setRiskMap_past({})
                        setLoading(false)
                    });
            }).catch((error) => {
                setRiskMap_present({})
                setLoading(false)
            });
    }, []);

    const classes = useStyles();
    const [value, setValue] = React.useState(0);
  
    const handleChange = (event, newValue) => {
        console.log(" >>>> ", event, newValue)
        if(newValue == 1) setRiskMap(riskmap_past)
        else setRiskMap(riskmap_present)
        setValue(newValue);
    };

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

    return (
        <ThemeProvider>
            <section>
            {
                loading ? (
                    <Flex direction="column" align="center" justify="center" height="100vh">
                        <Spinner size="xl" color="green.300" />
                    </Flex>) : (
                    <div>
                        <Paper className={classes.root}>
                            <Tabs
                                value={value}
                                onChange={handleChange}
                                indicatorColor="primary"
                                textColor="primary"
                                centered
                            >
                                <Tab label= {<strong>{"Present (" + riskmap_present.date + ")"} </strong>} />
                                <Tab label= {<strong>{"Past (" + riskmap_past.date + ")"}</strong>} />
                            </Tabs>
                        </Paper>
                        <div style={{background: '#fff'}}>
                            <WorldMap heatmap={riskmap.heat_map} heatmap_date={riskmap.date}/>
                        </div>
                        <br/>
                        <br/>
                        <Text fontSize={"xl"} textAlign="center" fontFamily="Baloo Da 2">
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
                                            {/* ({country.rt.date}) */}
                                            {(checkValue(country.rt.value) !== 'N/A') ? 
                                                " (" + country.rt.date + ")"    
                                                : ""
                                            }
                                        </Typography>
                                    </CardContent>
                                </Card>
                                ))
                            }
                        </Flex>
                    </div>
                )
            }
            </section>
        </ThemeProvider>
    )
}
