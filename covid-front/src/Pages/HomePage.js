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

export const HomePage = () => {
    const [districtData, setDistrictData] = useContext(DistrictDataContext)
    const [area, setArea] = useState("")

    const [succeptiblePopulationData, setSucceptiblePopulationData] = useState({})
    const [succeptiblePopulationOptions, setSucceptiblePopulationOptions] = useState({})

    const [observableImpactData, setObservableImpactData] = useState({})
    const [observableImpactOptioins, setObservableImpactOptioins] = useState({})

    const [rareImpactData, setRareImpactData] = useState({})
    const [rareImpactOptions, setRareImpactOptions] = useState({})

    const [plotlyData, setPlotlyData] = useState({})
    const [plotlyLayout, setPlotlyLayout] = useState({})

    // ###################################### Succeptible Population ######################################
    const updateSucceptiblePopulationData = (json_data) => {
        console.log("checking <SucceptiblePopulation> values", json_data)

        var datasets = []
        for (var i = 0; i < json_data['data'].length; i++) {
            var data_obj = {
                'legend': json_data['data'][i]['label'],
                'data': json_data['data'][i]['value'],
                'label': json_data['data'][i]['label'],
                'type': 'bar',
                'lineTension': 0,
                'borderWidth': 1,
                'backgroundColor': json_data['data'][i]['color'],
                'borderColor': json_data['data'][i]['color'],
                'pointBackgroundColor': json_data['data'][i]['color'],
                'pointRadius': 2,
                'fill': false,
                'fillOpacity': .3,
                'spanGaps': true
            }
            datasets.push(data_obj)
        }

        // console.log(json_data['labels'])
        var chartData = {
            'labels': json_data['labels'],
            'datasets': datasets,
            // 'lineAtIndex': [1,2,3,4]
        }
        var options = {
            scales: {
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: json_data['x_axis']
                    }
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: json_data['y_axis']
                    }
                }]
            },
            legend: {
                display: true,
                position: 'top',
                // labels: {
                //   fontColor: "#000080",
                // }
            }
        }

        setSucceptiblePopulationData(chartData)
        setSucceptiblePopulationOptions(options)
    }

    // For Bangladesh
    const getSucceptiblePopulation = () => {
        console.log("refreshing chart data for Bangladesh")
        fetch('/api/succeptible_population').then(response => {
            if (response.ok) {
                return response.json()
            }
        }).then(data => {
            updateSucceptiblePopulationData(data)
        })
    }

    // For a particular district
    const getSucceptiblePopulation__For = (geo) => {
        console.log("refreshing chart data for ", geo)
        fetch('/api/succeptible_population/'+geo.NAME_3).then(response => {
            if (response.ok) {
                return response.json()
            }
        }).then(data => {
            updateSucceptiblePopulationData(data)
        })
    }
    // ###################################### Succeptible Population ######################################

    return (
        <section>
        <div className={styles.homePage}>
            <div className={styles.options}>
                <OptionBar
                    setArea = {setArea}  
                    getSucceptiblePopulation = {getSucceptiblePopulation}
                />
            </div>

            <div className={styles.mapContainer}>
                <MapChart 
                    setArea = {setArea}  
                    getSucceptiblePopulation__For = {getSucceptiblePopulation__For}
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