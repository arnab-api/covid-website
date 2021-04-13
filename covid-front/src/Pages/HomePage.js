import React, { useState, useEffect, useContext } from 'react';
import { RareImpact } from '../Components/Charts/RareImpact';
import { ObservableImpact } from '../Components/Charts/ObservableImpact';
import { SucceptiblePopulation } from '../Components/Charts/SucceptiblePopulation';
import { MapChart } from '../Components/Charts/MapChart';
import { PlotlyChart } from '../Components/Charts/PlotlyChart'

import styles from './homePage.module.css';
import Table from '../Components/Design components/Table/Table';
import OptionBar from '../Components/Design components/OptionBar/OptionBar';
import { DistrictDataContext } from '../App';

export const HomePage = ({
    area, setArea,
    succeptiblePopulationData, setSucceptiblePopulationData,
    succeptiblePopulationOptions, setSucceptiblePopulationOptions,
    observableImpactData, setObservableImpactData,
    observableImpactOptioins, setObservableImpactOptioins,
    rareImpactData, setRareImpactData,
    rareImpactOptions, setRareImpactOptions,
    plotlyData, setPlotlyData,
    plotlyLayout, setPlotlyLayout,

    updateSucceptiblePopulationData,
    updateCharts, updateCharts__For
}) => {
    const [districtData, setDistrictData] = useContext(DistrictDataContext)
    
    return (
        <section>
        <div className={styles.homePage}>
            <div className={styles.options}>
                <OptionBar
                    area = {area}
                    setArea = {setArea}  
                    updateCharts = {updateCharts}
                />
            </div>

            <div className={styles.mapContainer}>
                <MapChart 
                    setArea = {setArea}  
                    updateCharts__For = {updateCharts__For}
                />
            </div>

            <div className={styles.chartsContainer}>
                <div className={styles.chart}>
                        <SucceptiblePopulation 
                            chartData={succeptiblePopulationData} 
                            // setChartData={setSucceptiblePopulationData}
                            chartOptions={succeptiblePopulationOptions}
                            // setChartOptions={setSucceptiblePopulationOptions}
                            area = {area}
                            updateSucceptiblePopulationData = {updateSucceptiblePopulationData}
                        />    
                    {/* {
                        districtData.NAME_3 ? <PlotlyChart></PlotlyChart> : <SucceptiblePopulation 
                                                                                chartData={succeptiblePopulationData} 
                                                                                setChartData={setSucceptiblePopulationData}></SucceptiblePopulation>
                    } */}
                </div>
                <div className={styles.chart}>
                    {
                        districtData.NAME_3 ? <RareImpact></RareImpact> : <ObservableImpact></ObservableImpact>
                    }
                </div>
            </div>
            <Table/>
        </div>
        <div>
            
        </div>
        </section>
    )
}