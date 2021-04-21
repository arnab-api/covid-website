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
const bins = [1, 9, 24]



const gradientData = {
    fromColor: COLOR_RANGE[0],
    toColor: COLOR_RANGE[COLOR_RANGE.length - 1],
    min: 0,
    max: 100
};

export const WorldMap = ({
}) => {
    const [tooltipContent, setTooltipContent] = useState("HI");
    const [heatmap, setHeatMap] = useState([]);
    const [heatmap_date, setHeatMap_date] = useState("")
    const [districtData, setDistrictData] = useContext(DistrictDataContext);
    const [projection_config, setProjectionConfig] = useState({
        scale: 40,
        center: [90.412518, 23.810332] 
    });

    // console.log('<', tooltipContent, '>')

    const onMouseLeave = () => {
        console.log("mouse leaving", '<', tooltipContent, '>')
        setTooltipContent('');
    };


    // var enter_count = 0
    const onMouseEnter = (geo, current = { value: 'NA' }) => {
        // console.log(enter_count, "current >> ", current, geo.properties)
        // enter_count += 1
        // onMouseClick(geo, current)
        // console.log(enter_count, ">>> ", current)
        // console.log("====> ", colorScale(current.value), my_colorScale(current.value))
        // setTooltipContent(current.name)
        return () => {        
            setTooltipContent(`${geo.properties.NAME}`);
            ReactTooltip.rebuild();
        };
    }

    const handleClick = geo => () => {
        console.log(geo);
    };

    const my_colorScale = (value) => {
        // console.log("---> ", value)
        if (value == -1) return DEFAULT_COLOR;
        if (value < bins[0]) return COLOR_BUCKET[0];
        if (value < bins[1]) return COLOR_BUCKET[1];
        if (value < bins[2]) return COLOR_BUCKET[2];
        return COLOR_BUCKET[3];
    }

    useEffect(() => {
        fetch('/api/world_risk').then(response => {
            if (response.ok) {
                return response.json()
            }
        }).then(data => {
            console.log(" >>> checking input", data)
            setHeatMap(data.heat_map)
            setHeatMap_date(data.date)
            // console.log("heat map", heatmap)
        })
        ReactTooltip.rebuild();
    }, [])

    return (
        <div>
            <ReactTooltip>{tooltipContent}</ReactTooltip>
            <ComposableMap
                projectionConfig={{
                    scale: 160,
                    rotation: [-11, 0, 0],
                }}
                // projection="geoMercator"
                width={800}
                height={400}
                style={{ width: "80%", height: "60%" }}
            >
            {/* <ComposableMap
                projectionConfig={projection_config}
                projection="geoMercator"
                width={5}
                height={5}
                data-tip=""
            > */}
                {/* <Sphere stroke="#E4E5E6" strokeWidth={0.5} /> */}
                {/* <Graticule stroke="#E4E5E6" strokeWidth={0.5} /> */}
                <Geographies geography={WORLD_TOPO}>
                    {({ geographies }) =>
                        geographies.map(geo => {
                            const current = heatmap.find(s => s.name === geo.properties.NAME);
                            return (
                                <Geography
                                    key={geo.rsmKey}
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
            <ul style={{ position: 'absolute', right: '5rem', top: '10rem', 'list-style': "none" }}>
                <li><span style={{ 'background-color': COLOR_BUCKET[0], 'color': COLOR_BUCKET[0] }}>__</span> <strong>Trivial</strong></li>
                <li><span style={{ 'background-color': COLOR_BUCKET[1], 'color': COLOR_BUCKET[1] }}>__</span> <strong>Community Spread</strong></li>
                <li><span style={{ 'background-color': COLOR_BUCKET[2], 'color': COLOR_BUCKET[2] }}>__</span> <strong>Accelerated Spread</strong></li>
                <li><span style={{ 'background-color': COLOR_BUCKET[3], 'color': COLOR_BUCKET[3] }}>__</span> <strong>Tipping Point</strong></li>
            </ul>
        </div>
    )
}

