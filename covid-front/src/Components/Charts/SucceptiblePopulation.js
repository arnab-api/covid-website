import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bar, defaults } from 'react-chartjs-2'
import { merge } from 'lodash';

merge(defaults, {
    global: {
        responsive: false
    }
}
);

export const SucceptiblePopulation = ( {chartData, chartOptions, area, updateSucceptiblePopulationData} ) => {
    // Chart.defaults.global.responsive = false;

    const refreshChartData = () => {
        console.log("refreshing chart data")
        fetch('/api/succeptible_population').then(response => {
            if (response.ok) {
                return response.json()
            }
        }).then(data => {
            // updateData(data)
            updateSucceptiblePopulationData(data)
        })
    }

    useEffect(() => {
        fetch('/api/succeptible_population').then(response => {
            if (response.ok) {
                return response.json()
            }
        }).then(data => {
            // updateData(data)
            updateSucceptiblePopulationData(data)
        })
    }, [])

    return (
        <>
            <div className="box">
                <h2>
                    Succeptible Population: {area} 
                </h2>
                <div className="container" style={{ display: 'flex', alignItems: 'center' }}>
                    <Bar data={chartData} options={chartOptions} width={600} height={300} />
                </div>
                {/* <button onClick={refreshChartData}>Refresh</button> */}
            </div>
        </>
    )
}