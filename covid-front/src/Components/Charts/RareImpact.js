import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Line, defaults } from 'react-chartjs-2'
import { merge } from 'lodash';
import 'chartjs-plugin-annotation';


// merge(defaults, {
//     global: {
//         responsive: false
//     }
// }
// );

export const RareImpact = ( {
    chartData, chartOptions,
}) => {
    
    chartOptions['responsive'] = true;

    return (
        <>
            <div class="box">
                <div class="container" 
                    style={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        width: "90%",
                        height: "90%",
                    }}>
                    <Line data={chartData} options={chartOptions}/>
                </div>
                {/* <button onClick={refreshChartData}>Refresh</button> */}
            </div>
        </>
    )
}