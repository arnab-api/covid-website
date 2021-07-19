import React, { useState, useEffect, useContext } from 'react';
import { scaleQuantile } from 'd3-scale';
import ReactTooltip from 'react-tooltip';
import {
    ComposableMap,
    Geographies,
    Geography,
    Marker,
    Sphere,
    Graticule
} from "react-simple-maps"
import './MapChart.css'

// import { DistrictDataContext } from '../../App.js';

// const geoUrl = "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json"

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

// const BD_DIST_TOPO = require('../Data/bd_dist_topo_simple.json');
// const BD_DIST = require('../Data/bd-districts.json');
const WORLD_TOPO = require('../Data/world_110_topo.json');

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

// const bins = [1, 9, 24]



// const gradientData = {
//     fromColor: COLOR_RANGE[0],
//     toColor: COLOR_RANGE[COLOR_RANGE.length - 1],
//     min: 0,
//     max: 100
// };

export const WorldMap_comparison = ( {
        heatmap,
        heatmap__time,
        isMethod,
        modelName,
        updatePlots__For,
        bins = [1, 9, 24]
    }) => {

    // console.log(BD_DIST)

    const [tooltipContent, setTooltipContent] = useState('');
    const [projection_config, setProjectionConfig] = useState({
        scale: 40,
        center: [90.412518, 23.810332] 
    });

    const getFormattedDate = (date) => {
        date = date.split("-");
        let date_present = new Date(date[0], date[1] - 1, date[2]);
        let days = 6;
        let date_past = new Date(date_present.getTime() - (days * 24 * 60 * 60 * 1000))
        let date_present_str = date_present.toLocaleDateString("en-BD", {
            month: "long",
            day: "numeric",
            year: "numeric"
        });
        let date_past_str = date_past.toLocaleDateString("en-BD", {
            month: "long",
            day: "numeric",
            year: "numeric"
        });
        return date_past_str + " - " + date_present_str
    }

    const onMouseLeave = () => {
        // console.log("mouse leaving")
        setTooltipContent('');
    };

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


    // var enter_count = 0
    const onMouseEnter = (geo, current = { value: 'NA' }) => {
        return () => {
            // setTooltipContent(`<strong>${current.dist}</strong><br/>Risk: ${current.value}`);
            setTooltipContent(getFormattedTooltip(geo, current))
        };
    }

    const handleClick = geo => () => {
        console.log(geo);
        updatePlots__For(geo.properties.NAME)
    };


    const my_colorScale = (value, for_tooltip = false) => {
        // console.log("---> ", value, bins)

        let bucket = COLOR_BUCKET;
        if(for_tooltip == true) bucket = COLOR_BUCKET_tooltip
        if(value == -1) return DEFAULT_COLOR;
        if(value < bins[0]) return bucket[0];
        if(value < bins[1]) return bucket[1];
        if(value < bins[2]) return bucket[2];
        return bucket[3];
    }

    return (
        <div>
            {
                isMethod ? (
                    <div style={{'text-align': 'center', fontSize: '12px'}}>
                        <strong> {modelName} </strong>
                    </div>
                ) : (
                    <div style={{'text-align': 'center', fontSize: '12px'}}>
                        <strong> {getFormattedDate(heatmap__time)} </strong>
                    </div>
                )
            }
            <ReactTooltip html={true}>{tooltipContent}</ReactTooltip>
            {/* <ComposableMap
                projectionConfig={projection_config}
                projection="geoMercator"
                width={5}
                height={5}
                style={{
                    width: "auto",
                    height: "110%"
                }}
                data-tip=""
            > */}
                <ComposableMap
                    projectionConfig={{
                        scale: 120,
                        rotation: [-45, 0, 0],
                    }}
                    projection="geoMercator"
                    width={800}
                    height={500}
                    data-tip=""
                    style={{ 
                        height: "100%",
                        width: "100%",  
                    }}
                >
                <Sphere stroke="#E4E5E6" strokeWidth={0.5} />
                <Graticule stroke="#E4E5E6" strokeWidth={0.5} />
                <Geographies geography={WORLD_TOPO}>
                    {({ geographies }) =>
                        geographies.map(geo => {
                            const current = heatmap.find(s => s.name === geo.properties.NAME);
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
        </div>
    )
}

