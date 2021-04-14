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

export const CaseEstimation = ({chartData, chartOptions, area, updateCaseEstimationData}) => {
    
    useEffect(() => {
        fetch('/api/caseEstimation').then(response => {
            if (response.ok) {
                return response.json()
            }
        }).then(data => {
            // console.log(data)
            // setTodo(data)
            // updateLineObject(data)
            updateCaseEstimationData(data)
        })
    }, [])

    return (
        <>
            <div class="box">
                <h2>
                    Estimation of the cases: {area}
                </h2>
                <div class="container" style={{ display: 'flex', alignItems: 'center' }}>
                    <Line data={chartData} options={chartOptions} width={600} height={300} />
                </div>
                {/* <button onClick={refreshChartData}>Refresh</button> */}
            </div>
        </>
    )
}