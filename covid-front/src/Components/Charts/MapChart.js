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
import styled from 'styled-components';
import { ThemeProvider, Spinner, Flex, SimpleGrid, Box, Text } from "@chakra-ui/core";
import Plot from 'react-plotly.js';
import Tooltip__color_table from '../Tooltip/Tooltip__color_table'
import Slider from '@material-ui/core/Slider';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { BDPageTable } from '../Tables/BDPageTable'
import axios from "axios";
import { utcYears } from 'plotly.js-basic-dist';


const PrettoSlider = withStyles({
    root: {
      color: '#006699',
      height: 8,
      width: '100%'
    },
    thumb: {
      height: 24,
      width: 24,
      backgroundColor: '#fff',
      border: '2px solid currentColor',
      marginTop: -8,
      marginLeft: -12,
      '&:focus, &:hover, &$active': {
        boxShadow: 'inherit',
      },
    },
    active: {},
    valueLabel: {
      left: 'calc(-50% + 4px)',
    },
    track: {
      height: 8,
      borderRadius: 4,
    },
    rail: {
      height: 8,
      borderRadius: 4,
    },
    mark: {
      backgroundColor: '#bfbfbf',
      height: 16,
      width: 1,
      marginTop: -3,
    },
    markActive: {
      opacity: 1,
      backgroundColor: 'currentColor',
    },
  })(Slider);

  const useStyles = makeStyles({
    mapContainer: {
      margin: 3,
      width: '65%',
      height: 550,
      display: 'flex',
      alignItems: "right",
      justifyContent: "right",
      background: '#fff'
    },
    chartContainer: {
        margin: 3,
        width: '49%',
        height: 320,
        display: 'flex',
        alignItems: "center",
        justifyContent: "center",
        background: '#fff'
    }
})

export const ReactTooltipStyled = styled(ReactTooltip)`
  &.type-dark.place-top {
    background-color: black;
    padding: 0.3rem 1rem;

    &:after { 
      border-top-color: black;
    }
  }
`;

// const geoUrl = "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json"

const geographyStyle = {
    default: {
        outline: 'none',
        strokeWidth: .003,
        stroke: '#000',
    },
    hover: {
        fill: '#80aaff',
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

// const BD_TOPO_JSON = require('../Data/bd_topo.json');
const BD_DIST_TOPO = require('../Data/bd_dist_topo_simple.json');
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
const COLOR_BUCKET_tooltip = [
    'rgb(84, 180, 95, 1)',   // trivial
    'rgb(236, 212, 36, 1)',
    'rgb(248, 140, 81, 1)',   // Accelerated spread
    'rgb(192, 26, 39, 1)',   // Tipping point
]
const bins = [1, 9, 24]



const gradientData = {
    fromColor: COLOR_RANGE[0],
    toColor: COLOR_RANGE[COLOR_RANGE.length - 1],
    min: 0,
    max: 100
};


// {
//     "id": "54",
//     "division_id": "7",
//     "name": "Sylhet",
//     "bn_name": "সিলেট",
//     "lat": "24.8897956",
//     "long": "91.8697894"
//   }

export const MapChart = ({
    setArea,
    updateCharts__For
}) => {
    // console.log(BD_DIST)
    const classes = useStyles()

    const [tooltipContent, setTooltipContent] = useState('');
    const [riskmap_arr, setRiskMap] = useState([]);
    const [heatmap, setHeatMap] = useState([]);
    const [heatmap_date, setHeatMap_date] = useState("")
    const [districtData, setDistrictData] = useContext(DistrictDataContext);
    const [loading, setLoading] = useState(true);
    const [increasing, setIncreasing] = useState(0)
    const [decreasing, setDecreasing] = useState(0)

    const [distDistribution, setDistDistribution] = useState([0, 0, 0, 0])

    function createTableEntry(name, risk) {
        return { 
            'name': name, 
            'risk': risk
          };
      }

    const [tablerows, setTableRows] = useState([
        createTableEntry('India', 324171354/3287263),
        createTableEntry('China', 1403500365/9596961),
      ]);
      const [tablerows__pastweek, setTableRows__pastweek] = useState([
        createTableEntry('India', 324171354/3287263),
        createTableEntry('China', 1403500365/9596961),
      ]);

    const onMouseLeave = () => {
        // console.log("mouse leaving")
        setTooltipContent('');
    };

    const getFormattedTooltip = (geo, current) => {
        let color_box = `<svg width="12" height="12">`
        color_box += `<rect width="20" height="20" style="fill:${my_colorScale(current.value, true)};stroke-width:3;stroke:rgb(0,0,0)"/>`
        let rank = `<strong>&nbsp;${current.rank}.</strong>`
        let elem = `<strong style="color:white;">&nbsp;${current.dist}</strong><br/>`
        elem += `Risk: ${current.value}<br/>`
        // let rt = checkValue(current.rt.value)
        // elem += `R<sub>t</sub>: ${rt}<br/>`
        // elem += `Confirmed cases: ${current.confirmed}`
        return color_box + rank + elem
    }

    // var enter_count = 0
    const onMouseEnter = (geo, current = { value: 'NA' }) => {
        // console.log(enter_count, "current >> ", current, geo.properties)
        // enter_count += 1
        // onMouseClick(geo, current)
        // console.log(enter_count, current)
        // console.log("====> ", colorScale(current.value), my_colorScale(current.value))
        return () => {
            // setTooltipContent(`<strong>${current.dist}</strong><br/> Confirmed cases: ${current.confirmed}<br/>Risk: ${current.value}`);
            setTooltipContent(getFormattedTooltip(geo, current))
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

    // const getHeatMapData = () => {
    //     setDistrictData({}); //****** added *******/
    //     console.log("refreshing heat map data")
    //     fetch('/api/heat_map').then(response => {
    //         if (response.ok) {
    //             return response.json()
    //         }
    //     }).then(data => {
    //         // console.log(data)
    //         setHeatMap(data)
    //     })
    // }

    const colorScale = scaleQuantile()
        .domain(heatmap.map(d => d.value))
        .range(COLOR_RANGE);

    const my_colorScale = (value, for_tooltip = false) => {
        // console.log("---> ", value)
        let bucket = COLOR_BUCKET;
        if (for_tooltip == true) bucket = COLOR_BUCKET_tooltip
        if (value < bins[0]) return bucket[0];
        if (value < bins[1]) return bucket[1];
        if (value < bins[2]) return bucket[2];
        return bucket[3];
    }

    // useEffect(() => {
    //     fetch('/api/heat_map_array').then(response => {
    //         if (response.ok) {
    //             return response.json()
    //         }
    //     }).then(data => {
    //         console.log(" >>> checking input", data.length)
    //         setRiskMap(data)
    //         setHeatMap(data[data.length-1].heat_map)
    //         setHeatMap_date(data[data.length-1].date)

    //         updateTableRows(data[data.length-1])
    //         updateTableRows__pastweek(data[data.length-8])
    //         // console.log("heat map", heatmap)
    //     })

    // }, [])

    useEffect(() => {
        axios.get("/api/heat_map_array")
            .then((response) => {
                console.log(" heat_map array >>> ", response.data, response.data.length);
                // setRiskMap_present(response.data);
                setRiskMap(response.data)
                setHeatMap(response.data[response.data.length-1].heat_map)
                setHeatMap_date(response.data[response.data.length-1].date)

                updateTableRows(response.data[response.data.length-1])
                updateTableRows__pastweek(response.data[response.data.length-8])

                updateIncreasingAndDecreasing(response.data[response.data.length-1], response.data[response.data.length-8])
                updateDistrictDistribution(response.data[response.data.length-1])
                
                setLoading(false)
            }).catch((error) => {
                setLoading(false)
            });
    }, []);

    const handleSliderValueChage = (event, value) => {
        console.log("slider value >>> ", event, value, riskmap_arr.length-1)
        
        setHeatMap(riskmap_arr[value+7].heat_map)
        setHeatMap_date(riskmap_arr[value+7].date)

        updateTableRows(riskmap_arr[value+7])
        updateTableRows__pastweek(riskmap_arr[value])

        updateIncreasingAndDecreasing(riskmap_arr[value+7], riskmap_arr[value])
        updateDistrictDistribution(riskmap_arr[value+7])
    }

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

    const updateTableRows = (cur_risk_map) => {
        let row_data = []
        let track = {}
        let skip = 0
        for(let i = 0; i < cur_risk_map.heat_map.length; i++){
            if(track[cur_risk_map.heat_map[i].dist] == undefined){
                row_data.push({
                    "rank": (i+1) - skip,
                    "name": cur_risk_map.heat_map[i].dist,
                    "risk": cur_risk_map.heat_map[i].value
                })
                track[cur_risk_map.heat_map[i].dist] = true;
            }
            else skip++;
        }
        setTableRows(row_data)
    }

    const updateTableRows__pastweek = (cur_risk_map) => {
        let row_data = []
        let track = {}
        let skip = 0
        for(let i = 0; i < cur_risk_map.heat_map.length; i++){
            if(track[cur_risk_map.heat_map[i].dist] == undefined){
                row_data.push({
                    "rank": (i+1) - skip,
                    "name": cur_risk_map.heat_map[i].dist,
                    "risk": cur_risk_map.heat_map[i].value
                })
                track[cur_risk_map.heat_map[i].dist] = true;
            }
            else skip++;
        }
        setTableRows__pastweek(row_data)
    }

    const queryTable = (table_info, dist_name) => {
        for(let i = 0; i < table_info.length; i++){
            if(table_info[i].name == dist_name) return table_info[i];
        }
        return null;
    }

    const updateIncreasingAndDecreasing = (tablerows, tablerows__pastweek) => {
        // console.log("<<<<<>>>>> Increasing and Deceasing called", tablerows, tablerows__pastweek);

        let track = [];
        let inc = 0;
        let dec = 0;
        for(let i = 0; i < tablerows.heat_map.length; i++){
            // console.log("<<<>>>", tablerows.heat_map[i]);
            let it_dist = tablerows.heat_map[i].dist;
            let it_risk = tablerows.heat_map[i].value;
            if(track.includes(it_dist)) continue
            for(let j = 0; j < tablerows__pastweek.heat_map.length; j++){
                let jt_dist = tablerows__pastweek.heat_map[j].dist;
                let jt_risk = tablerows__pastweek.heat_map[j].value;
                if(it_dist == jt_dist){
                    // console.log(it_dist,  it_risk, " <><><> ", jt_dist, jt_risk, " :: ", inc, dec)
                    if(it_risk > jt_risk) inc++;
                    else if(it_risk < jt_risk) dec++;

                    track.push(it_dist)
                    break;
                }
            }
        }
        setIncreasing(inc);
        setDecreasing(dec);
    }

    const updateDistrictDistribution = (tablerows) => {
        let distribution = [0, 0, 0, 0]
        let track = [];
        for(let i = 0; i < tablerows.heat_map.length; i++){
            // console.log("<<<>>>", tablerows.heat_map[i]);
            let it_dist = tablerows.heat_map[i].dist;
            let it_risk = tablerows.heat_map[i].value;
            if(track.includes(it_dist)) continue;
            for(let b = bins.length-1; b >=0; b--){
                if(it_risk >= bins[b]){
                    distribution[b+1] += 1;
                    track.push(it_dist);
                    break;
                }
            }
            if(track.includes(it_dist) == false){
                distribution[0]++;
                track.push(it_dist);
            }
        }
        console.log(distribution, bins)
        setDistDistribution(distribution)
    }

    const [projection_config, setProjectionConfig] = useState({
        scale: 36,
        center: [90.412518, 23.810332]
    });

    const findCentroid = (geo) => {
        // console.log(geo)
        // let xy_arr = geo.geometry.coordinates
        // console.log(geo.properties.DIST_NAME)
        if(geo.geometry != null){
            let xy_arr = geo.geometry.coordinates;
            let x=0, y=0, num_point=0; 
            
            for(let i = 0; i<xy_arr.length; i++){
                for(let j = 0; j<xy_arr[i].length; j++){
                    if(Array.isArray(xy_arr[i][j][0])){
                        for(let k = 0; k<xy_arr[i][j].length; k++){
                            num_point++;
                            x += xy_arr[i][j][k][0];
                            y += xy_arr[i][j][k][1];
                        }
                    }
                    else{
                        num_point++;
                        x += xy_arr[i][j][0];
                        y += xy_arr[i][j][1];
                    }
                }
            }
            x/=num_point;
            y/=num_point;

            // console.log(xy_arr, x, y, num_point)

            return {
                'x': x,
                'y': y
            }
        }
        else{
            // console.log("This district does not have co-ordinate information");
            return null;
        }
    }

    const riskCompare = (cur_risk, past_risk) => {
        if(cur_risk == past_risk) return "equal";
        if(cur_risk > past_risk) return "up";
        if(cur_risk < past_risk) return "down"; // green down
      }

    return (
        <ThemeProvider>
        <section>
        {
            loading ? (
                <Flex direction="column" align="center" justify="center" height="100vh">
                    <Spinner size="xl" color="green.300" />
                </Flex>) : (
                <>

                    <div style={{ 'text-align': 'center', fontSize: "15px", fontWeight: 'bold'}}>
                        <strong> {getFormattedDate(heatmap_date)} </strong> &nbsp;
                        (<span style={{color: 'red', fontSize: "17px"}}>&#9650;</span>{increasing}, &nbsp;
                        <span style={{color: 'green', fontSize: "17px"}}>&#9660;</span>{decreasing})
                    </div>
 
                    
                    <Flex wrap="wrap" justify="center" align="center" width="100%">
                        <BDPageTable 
                                rows = {tablerows}
                                rows__pastweek = {tablerows__pastweek}
                            />
                        <div flex='1' className={classes.mapContainer}>

                            <ReactTooltip html={true}>{tooltipContent}</ReactTooltip>
                            <ComposableMap
                                projectionConfig={{
                                    scale: 36,
                                    center: [90.412518, 23.810332]
                                }}
                                projection="geoMercator"
                                width={3.0}
                                height={4.2}
                                data-tip=""
                                style={{ 
                                    width: "100%", 
                                    height: "100%" 
                                }}
                            >

                                {/* {
                                    BD_DIST.districts.map(dist => (
                                        <Marker coordinates={[dist.long, dist.lat]} fill="#000">
                                            <text class="unselectable" y=".0" x=".0" fontSize={.06} font-weight={900} textAnchor="middle">
                                                {dist.name.substring(0, 3).toUpperCase()}
                                            </text>
                                        </Marker>
                                    ))
                                } */}

                                <Geographies geography={BD_DIST_TOPO}>
                                    {({ geographies }) =>
                                        geographies.map(geo => {
                                            
                                            let centroid = findCentroid(geo)
                                            let present_data = queryTable(tablerows, geo.properties.DIST_NAME)
                                            let past_data = queryTable(tablerows__pastweek, geo.properties.DIST_NAME)
                                            let cmp = riskCompare(present_data.risk, past_data.risk)
                                            let color = "black";
                                            if(cmp == "up") color="red";
                                            else if(cmp=="down") color="green";
                                            // console.log(">>>> ", geo.properties.DIST_NAME, centroid, present_data, past_data, cmp)

                                            const current = heatmap.find(s => s.id === geo.id);
                                            return (
                                                <>
                                                    {
                                                        centroid != null ? (
                                                            <>
                                                            <Marker coordinates={[centroid.x, centroid.y]} fill="black">
                                                                <text class="unselectable" y="-.01" x="-.02" fontSize={.05} font-weight={1000} textAnchor="middle">
                                                                    {geo.properties.DIST_NAME.substring(0, 3).toUpperCase()}
                                                                </text>
                                                            </Marker>
                                                            <Marker coordinates={[centroid.x, centroid.y]} fill={color}>
                                                                <text class="unselectable" y=".06" x="-.02" fontSize={.085} font-weight={1000} textAnchor="middle">
                                                                    {
                                                                        cmp=='equal' ? ( 
                                                                            <>
                                                                            </>
                                                                        ):(
                                                                            cmp=='up' ? (
                                                                            <>
                                                                                &#9650;
                                                                            </>
                                                                            ) : (
                                                                            <>
                                                                                &#9660;
                                                                            </>
                                                                            )
                                                                        )
                                                                    }
                                                                </text>
                                                            </Marker>
                                                            </>
                                                        ):(<></>)
                                                    }
                                                    <Geography
                                                        key={geo.rsmKey}
                                                        geography={geo}
                                                        style={geographyStyle}
                                                        // fill={current ? colorScale(current.value) : DEFAULT_COLOR}
                                                        fill={current ? my_colorScale(current.value) : DEFAULT_COLOR}
                                                        // fill= {DEFAULT_COLOR}
                                                        onMouseEnter={onMouseEnter(geo, current)}
                                                        onMouseLeave={onMouseLeave}
                                                        onClick={handleClick(geo)}
                                                    />
                                                </>
                                            )
                                        }
                                        )}
                                </Geographies>

                            </ComposableMap>
                        </div>
                    </Flex>
                    {/* <div><LinearGradient data={gradientData} /></div> */}
                    {/* <ul style={{position:'absolute',right:'1rem',top:'1rem', 'list-style': "none"}}>
                        <li><span style={{'background-color': COLOR_BUCKET[0], 'color': COLOR_BUCKET[0]}}>__</span> <strong>Trivial</strong></li>
                        <li><span style={{'background-color': COLOR_BUCKET[1], 'color': COLOR_BUCKET[1]}}>__</span> <strong>Community Spread</strong></li>
                        <li><span style={{'background-color': COLOR_BUCKET[2], 'color': COLOR_BUCKET[2]}}>__</span> <strong>Accelerated Spread</strong></li>
                        <li><span style={{'background-color': COLOR_BUCKET[3], 'color': COLOR_BUCKET[3]}}>__</span> <strong>Tipping Point</strong></li>
                    </ul>  */}
                    
                    {/* <Tooltip content="Yee-haw!" direction="right">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-question-circle" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                            <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>
                        </svg>
                    </Tooltip> */}
                    <Flex wrap="wrap" width="100%" justify="center" align="center" fontSize="11px">
                        {/* <div style={{
                            width: '80%',
                            fontSize: '10px',
                            align: 'center',
                            justify: 'center'
                        }}> */}
                            <Tooltip__color_table content="" direction="top">
                                <svg width="40" height="10">
                                    <rect width="40" height="10"
                                        style={{
                                            fill: COLOR_BUCKET_tooltip[0],
                                            strokeWidth: 3,
                                            stroke: "rgb(0,0,0)"
                                        }}
                                    />
                                </svg> 
                            
                                <strong class="unselectable">&nbsp;Trivial&nbsp;({distDistribution[0]})</strong>
                            
                            &nbsp; &nbsp; &nbsp;

                                <svg width="40" height="10">
                                    <rect width="40" height="10"
                                        style={{
                                            fill: COLOR_BUCKET_tooltip[1],
                                            strokeWidth: 3,
                                            stroke: "rgb(0,0,0)"
                                        }}
                                    />
                                </svg> <strong class="unselectable">&nbsp;Community Spread&nbsp;({distDistribution[1]})</strong>
                            
                            &nbsp; &nbsp; &nbsp;

                                <svg width="40" height="10">
                                    <rect width="40" height="10"
                                        style={{
                                            fill: COLOR_BUCKET_tooltip[2],
                                            strokeWidth: 3,
                                            stroke: "rgb(0,0,0)"
                                        }}
                                    />
                                </svg> <strong class="unselectable">&nbsp;Accelerated Spread&nbsp;({distDistribution[2]})</strong>
                            
                            &nbsp; &nbsp; &nbsp;

                                <svg width="40" height="10">
                                    <rect width="40" height="10"
                                        style={{
                                            fill: COLOR_BUCKET_tooltip[3],
                                            strokeWidth: 3,
                                            stroke: "rgb(0,0,0)"
                                        }}
                                    />
                                </svg> <strong class="unselectable">&nbsp;Tipping Point&nbsp;({distDistribution[3]})</strong>
                            </Tooltip__color_table>

                            {/* &nbsp; &nbsp;  
                            <Tooltip content="" direction="top">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-question-circle" viewBox="0 0 16 16">
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                    <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>
                                </svg>
                            </Tooltip> */}
                        {/* </div> */}
                    </Flex>
                    <Flex wrap="wrap" width="100%" justify="center" align="center">
                        <div style={{
                                align: 'center',
                                width: '80%',
                                justify: 'center'
                            }}>
                                <PrettoSlider 
                                    valueLabelDisplay="off" 
                                    aria-label="pretto slider" 
                                    aria-labelledby="discrete-slider"
                                    defaultValue={riskmap_arr.length-8}
                                    // getAriaValueText={sliderText}
                                    valueLabelFormat={value => ``}
                                    step={1}
                                    marks
                                    min={0}
                                    max={riskmap_arr.length-8}
                                    onChange={handleSliderValueChage}
                                />
                        </div>
                    </Flex>
                    {/* <br /> */}
                    {/* <br /> */}
                    {/* <Flex wrap="wrap" width="80%" justify="center" align="center"> */}
                    
                    {/* </Flex> */}

                    {/* <Button 
                    variant="outlined"
                    startIcon={<CachedIcon/>} 
                    onClick={getHeatMapData} 
                    style={{position:'absolute',right:'1rem',top:'1rem'}}
                    >
                        Refresh
                    </Button> */}

                    {/* </div> */}
                </>
            )
        }
        </section>
        </ThemeProvider>
    )
}

