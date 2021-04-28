import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bar, defaults } from 'react-chartjs-2'
import { merge } from 'lodash';
import { scaleQuantile } from 'd3-scale';
import Button from '@material-ui/core/Button';

import Plot from 'react-plotly.js';
// import createPlotlyComponent from 'react-plotly.js/factory';
// import Plotly from "plotly.js-basic-dist";
// const Plot = createPlotlyComponent(Plotly);


export const PlotlyChart = ( { data, layout} ) => {

    return (
        <Plot 
            data={data} 
            layout={layout} 
            useResizeHandler= {true}
            style= {{width: "100%", height: "100%"}}
        />
    )
}