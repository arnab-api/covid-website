import React, { useState, useEffect, useContext } from 'react';
import styles from './mapPage.module.css';
import { ThemeProvider, Spinner, Flex, SimpleGrid, Box } from "@chakra-ui/core";
import { MapChart_comparison } from '../../Components/Charts/MapChart_comparison';
import { TableMap } from '../../Components/Design components/Table/TableMap'

import axios from "axios";

export const MapPage = ({
    setPageName
}) => {

    setPageName("COVID-19 in Bangladesh")

    const [riskmap_present, setRiskMap_present] = useState({})
    const [riskmap_past, setRiskMap_past] = useState({})
    const [riskmap_future, setRiskMap_future] = useState({})
    const [loading, setLoading] = useState(true);

    useEffect( () => {
        axios.get("/api/heat_map")
             .then((response) => {
                console.log(" heat_map >>> ", response.data);
                setRiskMap_present(response.data);
                axios.get("/api/past_heat_map")
                     .then((response) => {
                        console.log(" past_heat_map >>> ", response.data)
                        setRiskMap_past(response.data);
                        axios.get("/api/future_heat_map")
                             .then((response) => {
                                console.log(" future_heat_map >>> ", response.data)
                                setRiskMap_future(response.data)
                                setLoading(false)
                        }).catch((error) => {
                            setRiskMap_future({})
                            setLoading(false)
                        });
                    }).catch((error) => {
                        setRiskMap_past({})
                        setLoading(false)
                    });
                }).catch((error) => {
                    setRiskMap_present({})
                    setLoading(false)
                });
    }, []);

    return (
        <ThemeProvider>
        <section>
            {
                loading ? (
                    <Flex direction="column" align="center" justify="center" height="100vh">
                        <Spinner size="xl" color="green.300" />
                    </Flex>) : (
                    <div>
                        <SimpleGrid columns={3} spacing={1}>
                            <div className={styles.mapContainer}>
                                <MapChart_comparison heatmap={riskmap_past.heat_map} heatmap__time={riskmap_past.date}/>
                                {/* Past */}
                            </div>
                            <div className={styles.mapContainer}>
                                <MapChart_comparison heatmap={riskmap_present.heat_map} heatmap__time={riskmap_present.date}/>
                                {/* Present */}
                            </div>
                            <div className={styles.mapContainer}>
                                <MapChart_comparison heatmap={riskmap_future.heat_map} heatmap__time={riskmap_future.date}/>
                                {/* Future */}
                            </div>
                        </SimpleGrid>
                        <TableMap past={riskmap_past.date} present={riskmap_present.date} future={riskmap_future.date}/>
                    </div>
                )
            }
        </section>
        </ThemeProvider>
    )
}