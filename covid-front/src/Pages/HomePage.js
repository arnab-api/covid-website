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

export const HomePage = ({
    area, setArea,
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
    dist_cum_rt_Data, dist_cum_rt_Options,

    updateSucceptiblePopulationData,
    updateCaseEstimationData,
    updateRareImpactData,
    updateCharts, updateCharts__For,
    updateDist_cum_rt_Data,
    setPageName
}) => {

    setPageName("COVID-19 in Bangladesh")

    const [districtData, setDistrictData] = useContext(DistrictDataContext)

    const checkArea = () => {
        // console.log('<',area,">")
        return area == ""
    }
    
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
                    }
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
                </div>
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
                    }
                    {/* <ObservableImpact></ObservableImpact> */}
                </div>
            </div>
            <Table/>
        </div>
        <div>
            
        </div>
        </section>
    )
}