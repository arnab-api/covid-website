import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Line, defaults } from 'react-chartjs-2'
import { merge } from 'lodash';
import 'chartjs-plugin-annotation';


merge(defaults, {
    global: {
        responsive: false
    }
}
);

export const District__cum_rt = ( {
    chartData, chartOptions,
    area,
    updateDist_cum_rt_Data 
}) => {

    console.log(">>> District cumulative cases and rt >> ", chartData, chartOptions)

    // const refreshChartData = () => {
    //     console.log("refreshing chart data")
    //     fetch('/api/rareimpact').then(response => {
    //         if (response.ok) {
    //             return response.json()
    //         }
    //     }).then(data => {
    //         // console.log(data)
    //         // setTodo(data)
    //         updateRareImpactData(data)
    //     })
    // }

    // useEffect(() => {
    //     fetch('/api/rareimpact').then(response => {
    //         if (response.ok) {
    //             return response.json()
    //         }
    //     }).then(data => {
    //         // console.log(data)
    //         // setTodo(data)
    //         updateRareImpactData(data)
    //     })
    // }, [])

    return (
        <>
            <div class="box">
                <h2>
                    District Cumulative Cases Vs Rt: {area}
                </h2>
                <div class="container" style={{ display: 'flex', alignItems: 'center' }}>
                    <Line data={chartData} options={chartOptions} width={600} height={300} />
                </div>
                {/* <button onClick={refreshChartData}>Refresh</button> */}
            </div>
        </>
    )
}