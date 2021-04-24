import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Bar, defaults } from 'react-chartjs-2'
import { merge } from 'lodash';
import { scaleQuantile } from 'd3-scale';
// import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import ReactTooltip from 'react-tooltip';
import {
    ComposableMap,
    Geographies,
    Geography,
    Marker,
    Annotation,
    Sphere,
    Graticule
} from "react-simple-maps"
// import Button from '@material-ui/core/Button';
// import CachedIcon from '@material-ui/icons/Cached';  // ******added******
// import { useBetween } from 'use-between';
import './MapChart.css'
import { WorldPageTable } from '../Tables/WorldPageTable'

import LinearGradient from './LinearGradient.js';
import { DistrictDataContext } from '../../App.js';




const geoUrl = "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json"

const geographyStyle = {
    default: {
        outline: 'none',
        strokeWidth: .5,
        stroke: '#000',
    },
    hover: {
        fill: '#80aaff',
        transition: 'all 250ms',
        outline: 'none',
        strokeWidth: .5,
        stroke: '#000',
    },
    pressed: {
        fill: '#4B0082',
        outline: 'none',
        strokeWidth: .5,
        stroke: '#000',
    }
};

// const BD_TOPO_JSON = require('../Data/bd_topo.json');
const BD_DIST_TOPO = require('../Data/bd_dist_topo_simple.json');
const WORLD_TOPO = require('../Data/world_110_topo.json');
// const BD_DIST = require('../Data/bd-districts.json');

const DEFAULT_COLOR = '#EEE';
// Red Variants
const COLOR_RANGE = [
    '#ffedea',
    '#ffcec5',
    '#ffad9f',
    '#ff8a75',
    '#ff5533',
    '#e2492d',
    '#be3d26',
    '#9a311f',
    '#782618'
];

const COLOR_BUCKET = [
    'rgb(84, 180, 95, .6)',   // trivial
    'rgb(236, 212, 36, .6)',
    'rgb(248, 140, 81, .6)',   // Accelerated spread
    'rgb(192, 26, 39, .6)',   // Tipping point
]
const COLOR_BUCKET_tooltip = [
    'rgb(84, 180, 95, 1)',   // trivial
    'rgb(236, 212, 36, 1)',
    'rgb(248, 140, 81, 1)',   // Accelerated spread
    'rgb(192, 26, 39, 1)',   // Tipping point
]
const bins = [1, 9, 24]



// const gradientData = {
//     fromColor: COLOR_RANGE[0],
//     toColor: COLOR_RANGE[COLOR_RANGE.length - 1],
//     min: 0,
//     max: 100
// };

export const WorldMap = ({
    heatmap,
    heatmap_date,
    rows
}) => {
    const [tooltipContent, setTooltipContent] = useState("");
    // const [heatmap, setHeatMap] = useState([]);
    // const [heatmap_date, setHeatMap_date] = useState("")
    const [projection_config, setProjectionConfig] = useState({
        scale: 40,
        center: [90.412518, 23.810332]
    });

    // console.log('<', tooltipContent, '>')

    const onMouseLeave = () => {
        // console.log("mouse leaving", '<', tooltipContent, '>')
        // setTooltipContent('');
    };


    // var enter_count = 0
    const onMouseEnter = (geo, current = { value: 'NA' }) => {
        // console.log(" >>> ", geo, current)
        return () => {
            ReactTooltip.rebuild()
            // setTooltipContent(` >> ${geo.properties.NAME}: ${current.value}`);
        };
    }

    const handleClick = geo => () => {
        console.log(geo);
    };

    const my_colorScale = (value, for_tooltip = false) => {
        // console.log("---> ", value)
        let bucket = COLOR_BUCKET;
        if(for_tooltip == true) bucket = COLOR_BUCKET_tooltip
        if(value == -1) return DEFAULT_COLOR;
        if(value < bins[0]) return bucket[0];
        if(value < bins[1]) return bucket[1];
        if(value < bins[2]) return bucket[2];
        return bucket[3];
    }

    const checkValue = (value) => {
        if(value == -1) return "N/A";
        return value.toFixed(2)
    }

    const getFormattedTooltip = (geo, current) => {
        let color_box = `<svg width="12" height="12">`
        color_box += `<rect width="20" height="20" style="fill:${my_colorScale(current.value, true)};stroke-width:3;stroke:rgb(0,0,0)"/>`
        let elem = `<strong style="color:white;">&nbsp;${geo.properties.NAME}</strong><br/>`
        elem += `Risk: ${checkValue(current.value)}<br/>`
        let rt = checkValue(current.rt.value)
        elem += `R<sub>t</sub>: ${rt} `
        if(rt !== 'N/A') elem += `(${current.rt.date})`
        return color_box + elem
    }

    // console.log(" >>>>>>>>>> inside worldmap >>>>>>>>>>>>> ", heatmap_date, heatmap)

    // useEffect(() => {
    //     ReactTooltip.rebuild();
    //     fetch('/api/world_risk').then(response => {
    //         if (response.ok) {
    //             return response.json()
    //         }
    //     }).then(data => {
    //         console.log(" >>> checking input", data)
    //         setHeatMap(data.heat_map)
    //         setHeatMap_date(data.date)
    //         // console.log("heat map", heatmap)
    //     })

    // }, [])

    return (
        <div>
            <ReactTooltip html={true}></ReactTooltip>
            <ComposableMap
                projectionConfig={{
                    scale: 160,
                    rotation: [-11, 0, 0],
                }}
                // projection="geoMercator"
                width={800}
                height={400}
                style={{ width: "70%", height: "60%" }}
            >
                {/* <ComposableMap
                projectionConfig={projection_config}
                projection="geoMercator"
                width={5}
                height={5}
                data-tip=""
            > */}
                <Sphere stroke="#E4E5E6" strokeWidth={0.5} />
                <Graticule stroke="#E4E5E6" strokeWidth={0.5} />
                <Geographies geography={WORLD_TOPO}>
                    {/* disableOptimization={true} */}
                    {({ geographies }) =>
                        geographies.map(geo => {
                            const current = heatmap.find(s => s.name === geo.properties.NAME);
                            return (
                                <Geography
                                    key={geo.rsmKey}
                                    // data-tip={geo.properties.NAME}
                                    // data-tip={current ? (`<strong>${geo.properties.NAME}</strong><br/>Risk: ${checkValue(current.value)}<br/>R<sub>t</sub>: ${checkValue(current.rt.value)} (${current.rt.date})`) : geo.properties.NAME}
                                    data-tip = {current ? getFormattedTooltip(geo, current) : geo.properties.NAME}
                                    geography={geo}
                                    style={geographyStyle}
                                    fill={current ? my_colorScale(current.value) : DEFAULT_COLOR}
                                    onMouseEnter={onMouseEnter(geo, current)}
                                    onMouseLeave={onMouseLeave}
                                    onClick={handleClick(geo)}
                                />
                            )
                        }
                        )}
                </Geographies>

            </ComposableMap>
            {/* <ul style={{ position: 'absolute', right: '5rem', top: '15rem', 'list-style': "none" }}>
                <li><span style={{ 'background-color': COLOR_BUCKET[0], 'color': COLOR_BUCKET[0] }}>__</span> <strong>Trivial</strong></li>
                <li><span style={{ 'background-color': COLOR_BUCKET[1], 'color': COLOR_BUCKET[1] }}>__</span> <strong>Community Spread</strong></li>
                <li><span style={{ 'background-color': COLOR_BUCKET[2], 'color': COLOR_BUCKET[2] }}>__</span> <strong>Accelerated Spread</strong></li>
                <li><span style={{ 'background-color': COLOR_BUCKET[3], 'color': COLOR_BUCKET[3] }}>__</span> <strong>Tipping Point</strong></li>
            </ul> */}
            <div>
                <svg width="50" height="12">
                <rect width="50" height="12" 
                    // style="fill:${my_colorScale(current.value, true)};stroke-width:3;stroke:rgb(0,0,0)"
                    style={{
                        fill: COLOR_BUCKET_tooltip[0],
                        strokeWidth:3,
                        stroke:"rgb(0,0,0)"
                    }}
                />
                </svg> <strong>Trivial</strong>
                &nbsp; &nbsp;

                <svg width="50" height="12">
                <rect width="50" height="12" 
                    // style="fill:${my_colorScale(current.value, true)};stroke-width:3;stroke:rgb(0,0,0)"
                    style={{
                        fill: COLOR_BUCKET_tooltip[1],
                        strokeWidth:3,
                        stroke:"rgb(0,0,0)"
                    }}
                />
                </svg> <strong>Community Spread</strong>
                &nbsp; &nbsp;

                <svg width="50" height="12">
                <rect width="50" height="12" 
                    // style="fill:${my_colorScale(current.value, true)};stroke-width:3;stroke:rgb(0,0,0)"
                    style={{
                        fill: COLOR_BUCKET_tooltip[2],
                        strokeWidth:3,
                        stroke:"rgb(0,0,0)"
                    }}
                />
                </svg> <strong>Accelerated Spread</strong>
                &nbsp; &nbsp;

                <svg width="50" height="12">
                <rect width="50" height="12" 
                    // style="fill:${my_colorScale(current.value, true)};stroke-width:3;stroke:rgb(0,0,0)"
                    style={{
                        fill: COLOR_BUCKET_tooltip[3],
                        strokeWidth:3,
                        stroke:"rgb(0,0,0)"
                    }}
                />
                </svg> <strong>Tipping Point</strong>
            </div>
            {/* <div style={{ 'text-align': 'center' }}>
                <strong> {heatmap_date} </strong>
            </div> */}
            
            <div style={{ position: 'absolute', right: '0rem', top: '8rem'}}>
                <WorldPageTable rows={rows}/>
            </div>
        </div>
    )
}

