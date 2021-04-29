import React, { useState, useEffect } from 'react';
import { Line, defaults } from 'react-chartjs-2'
import { merge } from 'lodash';
import 'chartjs-plugin-annotation';


// merge(defaults, {
//     global: {
//         responsive: false
//     }
// }
// );

export const CaseEstimation = ({
    chartData, chartOptions, 
}) => {

    // console.log("inside case estimation module")
    // useEffect(() => {
    //     fetch('/api/caseEstimation').then(response => {
    //         if (response.ok) {
    //             return response.json()
    //         }
    //     }).then(data => {
    //         // console.log(data)
    //         // setTodo(data)
    //         // updateLineObject(data)
    //         console.log("calling case estimation from case estimation class")
    //         updateCaseEstimationData(data)
    //     })
    // }, [])
    chartOptions['responsive'] = true;

    return (
        <>
            <div class="container"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: "100%",
                    height: "100%",
                    // margin: "auto", width: "80vw"
                }}
            >
                <Line data={chartData} options={chartOptions}/>
            </div>
            {/* <button onClick={refreshChartData}>Refresh</button> */}
        </>
    )
}