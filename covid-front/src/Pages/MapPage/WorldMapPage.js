import React, { useState, useEffect, useContext } from 'react';
import styles from './mapPage.module.css';
import { ThemeProvider, Spinner, Flex, SimpleGrid, Box } from "@chakra-ui/core";
import { MapChart_comparison } from '../../Components/Charts/MapChart_comparison';

import axios from "axios";
import { WorldMap } from '../../Components/Charts/WorldMap';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const useStyles = makeStyles({
    root: {
      flexGrow: 1,
      backgroundColor: 'rgb(204, 255, 255)'
    },
  });

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
                console.log(" heat_map >>> ", response.data);
                setRiskMap_present(response.data);
                setRiskMap(response.data)
                axios.get("/api/world_risk_past")
                    .then((response) => {
                        console.log(" past_heat_map >>> ", response.data)
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
                        {/* <br/>
                        <div style={{background: '#fff'}}>
                            <WorldMap heatmap={riskmap_past.heat_map} heatmap_date={riskmap_past.date}/>
                        </div> */}
                    </div>
                )
            }
            </section>
        </ThemeProvider>
    )
}
