import React, { useState, useEffect, useContext } from 'react';
import styles from './mapPage.module.css';
import { ThemeProvider, Spinner, Flex, SimpleGrid, Box } from "@chakra-ui/core";
import { MapChart_comparison } from '../../Components/Charts/MapChart_comparison';

import axios from "axios";
import { WorldMap } from '../../Components/Charts/WorldMap';


export const WorldMapPage = ({
}) => {

    // const [riskmap_present, setRiskMap_present] = useState({})
    // const [riskmap_past, setRiskMap_past] = useState({})
    // const [riskmap_future, setRiskMap_future] = useState({})
    // const [loading, setLoading] = useState(true);

    // useEffect(() => {
    //     axios.get("/api/heat_map")
    //         .then((response) => {
    //             console.log(" heat_map >>> ", response.data);
    //             setRiskMap_present(response.data);
    //             axios.get("/api/past_heat_map")
    //                 .then((response) => {
    //                     console.log(" past_heat_map >>> ", response.data)
    //                     setRiskMap_past(response.data);
    //                     axios.get("/api/future_heat_map")
    //                         .then((response) => {
    //                             console.log(" future_heat_map >>> ", response.data)
    //                             setRiskMap_future(response.data)
    //                             setLoading(false)
    //                         }).catch((error) => {
    //                             setRiskMap_future({})
    //                             setLoading(false)
    //                         });
    //                 }).catch((error) => {
    //                     setRiskMap_past({})
    //                     setLoading(false)
    //                 });
    //         }).catch((error) => {
    //             setRiskMap_present({})
    //             setLoading(false)
    //         });
    // }, []);

    return (
        <ThemeProvider>
            <section>
                <div style={{
                        background: '#fff'
                    }}>
                    <WorldMap />
                </div>
                <br/>
                {/* <br/> */}
                <div style={{
                        background: '#fff'
                }}>
                    <WorldMap />
                </div>
            </section>
        </ThemeProvider>
    )
}