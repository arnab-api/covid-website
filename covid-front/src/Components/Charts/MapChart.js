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
    Annotation
} from "react-simple-maps"
import Button from '@material-ui/core/Button';
import CachedIcon from '@material-ui/icons/Cached';  // ******added******
import { useBetween } from 'use-between';
import './MapChart.css'

import LinearGradient from './LinearGradient.js';
import { DistrictDataContext } from '../../App.js';




const geoUrl = "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json"

const geographyStyle = {
    default: {
        outline: 'none',
        strokeWidth: .003,
        stroke: '#000',
    },
    hover: {
        fill: '#ff99ff',
        transition: 'all 250ms',
        outline: 'none',
        strokeWidth: .003,
        stroke: '#000',
    },
    pressed: {
        fill: '#4B0082',
        outline: 'none',
        strokeWidth: .003,
        stroke: '#000',
    }
};

const BD_TOPO_JSON = require('../Data/bd_topo.json');
const BD_DIST_TOPO = require('../Data/bd_dist_topo.json');
const BD_DIST = require('../Data/bd-districts.json');

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

// green to red
// const COLOR_RANGE = [
//     '#07fd69',
//     '#54f24a',
//     '#74e625',
//     '#8ada00',
//     '#9cce00',
//     '#abc100',
//     '#b9b300',
//     '#c4a500',
//     '#ce9600',
//     '#d78600',
//     '#de7600',
//     '#e36300',
//     '#e74f00',
//     '#e93600',
//     '#e90a0a'
// ]
// https://colordesigner.io/gradient-generator
// https://www.w3schools.com/colors/colors_picker.asp

// const COLOR_BUCKET = [
//     '#54b45f',   // trivial
//     // '#ecd424',   // Community spread
//     '#f88c51',   // Accelerated spread
//     '#c01a27',   // Tipping point
// ]

const COLOR_BUCKET = [
    'rgb(84, 180, 95, .6)',   // trivial
    'rgb(236, 212, 36, .6)',
    'rgb(248, 140, 81, .6)',   // Accelerated spread
    'rgb(192, 26, 39, .6)',   // Tipping point
]
const bins = [1, 9, 24]



const gradientData = {
    fromColor: COLOR_RANGE[0],
    toColor: COLOR_RANGE[COLOR_RANGE.length - 1],
    min: 0,
    max: 100
};

const PROJECTION_CONFIG = {
    scale: 40,
    center: [90.412518, 23.810332] // always in [East Latitude, North Longitude]
};

// {
//     "id": "54",
//     "division_id": "7",
//     "name": "Sylhet",
//     "bn_name": "সিলেট",
//     "lat": "24.8897956",
//     "long": "91.8697894"
//   }

export const MapChart = ( {
            setArea,
            updateCharts__For
    }) => {

    // console.log(BD_DIST)

    const [tooltipContent, setTooltipContent] = useState('');
    const [heatmap, setHeatMap] = useState([]);
    const [districtData, setDistrictData] = useContext(DistrictDataContext);
    const [projection_config, setProjectionConfig] = useState({
        scale: 40,
        center: [90.412518, 23.810332] 
    });

    const onMouseLeave = () => {
        // console.log("mouse leaving")
        setTooltipContent('');
    };


    // var enter_count = 0
    const onMouseEnter = (geo, current = { value: 'NA' }) => {
        // console.log(enter_count, "current >> ", current, geo.properties)
        // enter_count += 1
        // onMouseClick(geo, current)
        // console.log(current)
        // console.log("====> ", colorScale(current.value), my_colorScale(current.value))
        return () => {
            setTooltipContent(`${current.dist}: ${current.value}`);
        };
    }

    const handleClick = geo => () => {
        setDistrictData(geo.properties)
        console.log(geo);
        setArea(geo.properties.DIST_NAME)
        updateCharts__For(geo.properties.DIST_NAME)
        // setProjectionConfig({
        //     scale: 70,
        //     center: [91.8697894, 24.8897956] 
        // })
    };

    const getHeatMapData = () => {
        setDistrictData({}); //****** added *******/
        console.log("refreshing heat map data")
        fetch('/api/heat_map').then(response => {
            if (response.ok) {
                return response.json()
            }
        }).then(data => {
            // console.log(data)
            setHeatMap(data)
        })
    }

    const colorScale = scaleQuantile()
        .domain(heatmap.map(d => d.value))
        .range(COLOR_RANGE);

    const my_colorScale = (value) => {
        // console.log("---> ", value)
        if(value < bins[0]) return COLOR_BUCKET[0];
        if(value < bins[1]) return COLOR_BUCKET[1];
        if(value < bins[2]) return COLOR_BUCKET[2];
        return COLOR_BUCKET[3];
    }

    useEffect(() => {
        fetch('/api/heat_map').then(response => {
            if (response.ok) {
                return response.json()
            }
        }).then(data => {
            // console.log(" >>> checking input", data)
            setHeatMap(data)
            // console.log("heat map", heatmap)
        })

    }, [])

    return (
        <div>
            <ReactTooltip>{tooltipContent}</ReactTooltip>
            <ComposableMap
                projectionConfig={projection_config}
                projection="geoMercator"
                width={5}
                height={3}
                data-tip=""
            >

                {
                    BD_DIST.districts.map( dist => (
                        <Marker coordinates={[dist.long, dist.lat]} fill="#000">
                            <text class="unselectable" y=".03" x=".01" fontSize={.06} font-weight={900} textAnchor="middle">
                                {dist.name.substring(0,3).toUpperCase()}
                            </text>
                        </Marker>
                    ))
                }
                <Geographies geography={BD_DIST_TOPO}>
                    {({ geographies }) =>
                        geographies.map(geo => {
                            const current = heatmap.find(s => s.id === geo.id);
                            return (
                                <Geography
                                    key={geo.rsmKey}
                                    geography={geo}
                                    style={geographyStyle}
                                    // fill={current ? colorScale(current.value) : DEFAULT_COLOR}
                                    fill= {current ? my_colorScale(current.value) : DEFAULT_COLOR}
                                    // fill= {DEFAULT_COLOR}
                                    onMouseEnter={onMouseEnter(geo, current)}
                                    onMouseLeave={onMouseLeave}
                                    onClick={handleClick(geo)}
                                />
                            )
                        }
                        )}
                </Geographies>

            </ComposableMap>
            {/* <div><LinearGradient data={gradientData} /></div> */}
            <ul style={{position:'absolute',right:'1rem',top:'1rem', 'list-style': "none"}}>
                <li><span style={{'background-color': COLOR_BUCKET[0], 'color': COLOR_BUCKET[0]}}>__</span> <strong>Trivial</strong></li>
                <li><span style={{'background-color': COLOR_BUCKET[1], 'color': COLOR_BUCKET[1]}}>__</span> <strong>Community Spread</strong></li>
                <li><span style={{'background-color': COLOR_BUCKET[2], 'color': COLOR_BUCKET[2]}}>__</span> <strong>Accelerated Spread</strong></li>
                <li><span style={{'background-color': COLOR_BUCKET[3], 'color': COLOR_BUCKET[3]}}>__</span> <strong>Tipping Point</strong></li>
            </ul> 
            
            {/* <Button 
            variant="outlined"
             startIcon={<CachedIcon/>} 
             onClick={getHeatMapData} 
             style={{position:'absolute',right:'1rem',top:'1rem'}}
             >
                Refresh
            </Button> */}
            
            {/* </div> */}
        </div>
    )
}

