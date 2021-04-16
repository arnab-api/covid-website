import React, { createContext, useState, useEffect } from 'react';
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";

// library imports
import Plotly from "plotly.js-basic-dist";
import createPlotlyComponent from 'react-plotly.js/factory';
// import Plot from 'react-plotly.js';
import { Helmet } from 'react-helmet'

// custom component imports
import TopBar from './Components/Design components/topBar/topBar';
import Footer from './Components/Design components/footer/footer';
import { HomePage } from './Pages/HomePage';
import AboutPage from './Pages/AboutPage/AboutPage';

// style imports
import './App.css';

export const DistrictDataContext = createContext();
const TITLE = 'COVID-19 in Bangladesh'


// const Plotly = window.Plotly;
const Plot = createPlotlyComponent(Plotly);

function App() {
  const [districtData, setDistrictData] = useState({});
  const [dist_2_id, setDist2ID]  = useState({})
  
  useEffect(() => {
      fetch('/api/dist_2_id').then(response => {
          if (response.ok) {
              return response.json()
          }
      }).then(data => {
        setDist2ID(data)
        console.log(dist_2_id)
      })

  }, [])

  // const [districtData, setDistrictData] = useContext(DistrictDataContext)
    const [area, setArea] = useState("")

   

    const [observableImpactData, setObservableImpactData] = useState({})
    const [observableImpactOptioins, setObservableImpactOptioins] = useState({})

    // ###################################### Succeptible Population ######################################
    const [succeptiblePopulationData, setSucceptiblePopulationData] = useState({})
    const [succeptiblePopulationOptions, setSucceptiblePopulationOptions] = useState({})
    
    const updateSucceptiblePopulationData = (json_data) => {
        console.log("checking <SucceptiblePopulation> values", json_data)

        var datasets = []
        for (var i = 0; i < json_data['data'].length; i++) {
            var data_obj = {
                'legend': json_data['data'][i]['label'],
                'data': json_data['data'][i]['value'],
                'label': json_data['data'][i]['label'],
                'type': 'bar',
                'lineTension': 0,
                'borderWidth': 1,
                'backgroundColor': json_data['data'][i]['color'],
                'borderColor': json_data['data'][i]['color'],
                'pointBackgroundColor': json_data['data'][i]['color'],
                'pointRadius': 2,
                'fill': false,
                'fillOpacity': .3,
                'spanGaps': true
            }
            datasets.push(data_obj)
        }

        // console.log(json_data['labels'])
        var chartData = {
            'labels': json_data['labels'],
            'datasets': datasets,
            // 'lineAtIndex': [1,2,3,4]
        }
        var options = {
            scales: {
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: json_data['x_axis']
                    }
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: json_data['y_axis']
                    }
                }]
            },
            legend: {
                display: true,
                position: 'top',
                // labels: {
                //   fontColor: "#000080",
                // }
            }
        }

        setSucceptiblePopulationData(chartData)
        setSucceptiblePopulationOptions(options)
    }

    // For Bangladesh
    const getSucceptiblePopulation = () => {
        console.log("refreshing chart data for Bangladesh")
        fetch('/api/succeptible_population').then(response => {
            if (response.ok) {
                return response.json()
            }
        }).then(data => {
            updateSucceptiblePopulationData(data)
        })
    }

    // For a particular district
    const getSucceptiblePopulation__For = (geo) => {
        console.log("refreshing chart data for ", geo)
        fetch('/api/succeptible_population/'+geo.DIST_NAME).then(response => {
            if (response.ok) {
                return response.json()
            }
        }).then(data => {
            updateSucceptiblePopulationData(data)
        })
    }
    // ###################################### Succeptible Population ######################################

    // ###################################### Estimated Cases ######################################
    const [caseEstimationData, setCaseEstimationData] = useState({})
    const [caseEstimationOptions, setCaseEstimationOptions] = useState({})

    const updateCaseEstimationData = (caseEstimation) => {
      console.log("checking <caseEstimation> values", caseEstimation)

      var data = caseEstimation['values']
      var annotations = caseEstimation['annotations']
      var label = caseEstimation['x_labels']

      var datasets = []
      for (var i = 0; i < data.length; i++) {
          var data_obj = {
              'legend': data[i]['label'],
              'data': data[i]['value'],
              'label': data[i]['label'],
              'type': 'line',
              'lineTension': 0,
              'borderWidth': 1,
              'backgroundColor': data[i]['color'],
              'borderColor': data[i]['color'],
              // 'pointColor': data[i]['color'],
              // 'fillColor': data[i]['color'],
              // 'fill': true,
              'pointBackgroundColor': data[i]['color'],
              // 'pointRadius': 2,
              'fill': false,
              'fillOpacity': .3,
              'spanGaps': true,
              // 'showLine': data[i]['showLine']
          }
          if (data[i]['showLine']){
              data_obj['showLine'] = true
              data_obj['pointRadius'] = 0
          }
          else{
              data_obj['showLine'] = false
              data_obj['pointRadius'] = 2
          }
          // if (data[i]['label'] == 'R_t0') data_obj['fill'] = '+1'
          if(data[i]['label'] == 'Hospitals Required') data_obj['borderWidth'] = 2

          // console.log(data[i]['label'], data_obj['fill'])

          datasets.push(data_obj)
      }

      var chartData = {
          'labels': label,
          'datasets': datasets,
          // 'lineAtIndex': [1,2,3,4]
      }

      var annotation_formatted = []
      for (var i = 0; i < annotations.length; i++) {
          annotation_formatted.push(
              {
                  type: "line",
                  connectNullData: true,
                  mode: "vertical",
                  scaleID: "x-axis-0",
                  value: annotations[i]['value'],
                  borderColor: annotations[i]['color'],
                  borderWidth: 2,
                  label: {
                      content: annotations[i]['text'],
                      enabled: true,
                      position: "top"
                  }
              }
          )
      }

      var chartOptions = {
          annotation: {
              annotations: annotation_formatted
          },
          scales: {
              xAxes: [{
                  ticks: {
                      userCallback: function (item, index) {
                        //   console.log(" >>>> ", item, index)
                          var date = item.split("-")
                        //   console.log(date)
                          if(date[2] == "01"){
                              return date[0] + "-" + date[1]
                          }
                        //   if (!(index % 20)) return item;
                          return null;
                      },
                      autoSkip: false,
                      // color: 'rgba(0, 0, 0, 1)'
                  },
                  display: true
              }],
              yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Number of Cases',
                },
                type: 'logarithmic',
                ticks: {
                    userCallback: function (value, index) {
                        if (value === 10000000) return "10M";
                        if (value === 1000000) return "1M";
                        if (value === 100000) return "100K";
                        if (value === 10000) return "10K";
                        if (value === 1000) return "1K";
                        if (value === 100) return "100";
                        if (value === 10) return "10";
                        if (value === 1) return "1";
                        return null;
                    },
                    autoSkip: false,
                    // color: 'rgba(0, 0, 0, 1)'
                },
                display: true
            }],
          },
          legend: {
            //   display: true,
            //   position: 'bottom',
              // labels: {
              //   fontColor: "#000080",
              // }
                labels: {
                    filter: function(item, chart) {
                        // Logic to remove a particular legend item goes here
                        return !item.text.includes('Real');
                    }
                }
          },
          maintainAspectRatio: false
      }

      setCaseEstimationData(chartData)
      setCaseEstimationOptions(chartOptions)
  }

      // For Bangladesh
    const getEstimatedCases = () => {
        console.log("refreshing estimation data for Bangladesh")
        fetch('/api/caseEstimation').then(response => {
            if (response.ok) {
                return response.json()
            }
        }).then(data => {
            updateCaseEstimationData(data)
        })
    }

    // For a particular district
    const getEstimatedCases__For = (geo) => {
        console.log("refreshing estimation data for ", geo)
        fetch('/api/caseEstimation/'+geo.DIST_NAME).then(response => {
            if (response.ok) {
                return response.json()
            }
        }).then(data => {
            updateCaseEstimationData(data)
        })
    }
    // ###################################### Estimated Cases ######################################

    // ###################################### rare impact ##########################################
    const [rareImpactData, setRareImpactData] = useState({})
    const [rareImpactOptions, setRareImpactOptions] = useState({})

    const updateRareImpactData = (rareImpact) => {
        console.log("checking <RareImpact> values", rareImpact)

        var data = rareImpact['values']
        var annotations = rareImpact['annotations']
        var label = rareImpact['x_labels']

        var datasets = []
        for (var i = 0; i < data.length; i++) {
            var data_obj = {
                'legend': data[i]['label'],
                'data': data[i]['value'],
                'label': data[i]['label'],
                'type': 'line',
                'lineTension': 0,
                'borderWidth': 1,
                'backgroundColor': data[i]['color'],
                'borderColor': data[i]['color'],
                // 'pointColor': data[i]['color'],
                // 'fillColor': data[i]['color'],
                // 'fill': true,
                'pointBackgroundColor': data[i]['color'],
                'pointRadius': 2,
                'fill': false,
                'fillOpacity': .3,
                'spanGaps': true
            }
            if (data[i]['label'] == 'R_t Low' || data[i]['label'] == 'R_t High'){
                data_obj['pointRadius'] = 0
            }
            if (data[i]['label'] == 'R_t Low') data_obj['fill'] = '+1'
            // if(data[i]['label'] == 'R_t1') data_obj['fill'] = true

            // console.log(data[i]['label'], data_obj['fill'])

            datasets.push(data_obj)
        }

        var chartData = {
            'labels': label,
            'datasets': datasets,
            // 'lineAtIndex': [1,2,3,4]
        }

        var annotation_formatted = []
        for (var i = 0; i < annotations.length; i++) {
            annotation_formatted.push(
                {
                    type: "line",
                    connectNullData: true,
                    mode: "vertical",
                    scaleID: "x-axis-0",
                    value: annotations[i]['value'],
                    borderColor: annotations[i]['color'],
                    borderWidth: 3,
                    label: {
                        content: annotations[i]['text'],
                        enabled: true,
                        position: "top"
                    }
                }
            )
        }

        var chartOptions = {
            tooltips :{
                callbacks: {
                    title: function(tooltipItem, data) {
                        // console.log(tooltipItem, data)
                    },
                    label: function(tooltipItem, data) {
                        // console.log(tooltipItem, data)
                        // console.log(">>>>", tooltipItem['datasetIndex'])
                        var legend = data['datasets'][tooltipItem['datasetIndex']]['legend']
                        return legend + ": " + parseFloat(tooltipItem['value']).toFixed(2)
                    },
                    afterLabel: function(tooltipItem, data) {
                        // console.log(tooltipItem, data)
                    }
                }
            },
            annotation: {
                annotations: annotation_formatted
            },
            scales: {
                xAxes: [{
                    ticks: {
                        userCallback: function (item, index) {
                            //   console.log(" >>>> ", item, index)
                            var date = item.split("-")
                            //   console.log(date)
                            if(date[2] == "01"){
                                return date[0] + "-" + date[1]
                            }
                            return null;
                        },
                        autoSkip: false,
                        // color: 'rgba(0, 0, 0, 1)'
                    },
                    display: true
                }],
            },
            legend: {
                labels: {
                    filter: function(item, chart) {
                        // Logic to remove a particular legend item goes here
                        return  !item.text.includes('Low') && 
                                !item.text.includes('High');
                    }
                }
            },
            maintainAspectRatio: false
        }

        setRareImpactData(chartData)
        setRareImpactOptions(chartOptions)
    }

          // For Bangladesh
        const getRareImpact = () => {
            console.log("refreshing estimation data for Bangladesh")
            fetch('/api/rareimpact').then(response => {
                if (response.ok) {
                    return response.json()
                }
            }).then(data => {
                updateRareImpactData(data)
            })
        }
    
        // For a particular district
        const getRareImpact__For = (geo) => {
            console.log("refreshing estimation data for ", geo)
            fetch('/api/rareimpact/'+geo.DIST_NAME).then(response => {
                if (response.ok) {
                    return response.json()
                }
            }).then(data => {
                updateRareImpactData(data)
            })
        }
    // ###################################### rare impact ##########################################
    

// ###################################### District Cum Rt impact ##########################################
const [plotlyData, setPlotlyData] = useState({})
const [plotlyLayout, setPlotlyLayout] = useState({})

const getDistrictChart1__For = (geo) => {
    console.log("refreshing estimation data for ", geo)
    fetch('/api/dist_plot_1/'+geo.DIST_NAME).then(response => {
        if (response.ok) {
            return response.json()
        }
    }).then(data => {
        setPlotlyData(data[0].data)
        setPlotlyLayout(data[0].layout)
    })
}
// ###################################### District Cum Rt impact ##########################################

// ###################################### District Cum Rt impact ##########################################
const [plotlyData__2, setPlotlyData__2] = useState({})
const [plotlyLayout__2, setPlotlyLayout__2] = useState({})

const getDistrictChart2__For = (geo) => {
    console.log("refreshing estimation data for ", geo)
    fetch('/api/dist_plot_2/'+geo.DIST_NAME).then(response => {
        if (response.ok) {
            return response.json()
        }
    }).then(data => {
        setPlotlyData__2(data[0].data)
        setPlotlyLayout__2(data[0].layout)
    })
}
// ###################################### District Cum Rt impact ##########################################


    const updateCharts = () => {
      getEstimatedCases()
      getRareImpact()
      // getSucceptiblePopulation()
    }

    const updateCharts__For = (geo) => {
    //   getEstimatedCases__For(geo)
    //   getRareImpact__For(geo)
    //   getSucceptiblePopulation__For(geo)
        getDistrictChart1__For(geo)
        getDistrictChart2__For(geo)
    }

  return (
    <DistrictDataContext.Provider value={[districtData, setDistrictData]}>
      <Helmet>
          <title>{ TITLE }</title>
      </Helmet>
      <Router>
        <TopBar 
          dist_2_id={dist_2_id}
          area = {area}
          setArea = {setArea}  
          updateCharts = {updateCharts} updateCharts__For = {updateCharts__For}
        />
        <Switch>
          <Route exact path='/'>
            <HomePage 
              dist_2_id={dist_2_id}
              area = {area} setArea = {setArea}
              caseEstimationData = {caseEstimationData} setCaseEstimationData = {setCaseEstimationData}
              caseEstimationOptions = {caseEstimationOptions} setCaseEstimationOptions = {setCaseEstimationOptions}
              succeptiblePopulationData = {succeptiblePopulationData} setSucceptiblePopulationData = {setSucceptiblePopulationData}
              succeptiblePopulationOptions = {succeptiblePopulationOptions} setSucceptiblePopulationOptions = {setSucceptiblePopulationOptions}
              observableImpactData = {observableImpactData} setObservableImpactData = {setObservableImpactData}
              observableImpactOptioins = {observableImpactOptioins} setObservableImpactOptioins = {observableImpactOptioins}
              rareImpactData = {rareImpactData} setRareImpactData = {setRareImpactData}
              rareImpactOptions = {rareImpactOptions} setRareImpactOptions = {setRareImpactOptions}
              plotlyData = {plotlyData} setPlotlyData = {setPlotlyData}
              plotlyLayout = {plotlyLayout} setPlotlyLayout = {setPlotlyLayout}
              plotlyData__2 = {plotlyData__2} setPlotlyData__2 = {setPlotlyData__2}
              plotlyLayout__2 = {plotlyLayout__2} setPlotlyLayout__2 = {setPlotlyLayout__2}
            //   dist_cum_rt_Data = {dist_cum_rt_Data} dist_cum_rt_Options = {dist_cum_rt_Options}

              updateSucceptiblePopulationData = {updateSucceptiblePopulationData}
              updateCaseEstimationData = {updateCaseEstimationData}
              updateRareImpactData = {updateRareImpactData}
              updateCharts = {updateCharts} updateCharts__For = {updateCharts__For}
            //   updateDist_cum_rt_Data = {updateDist_cum_rt_Data}
            />
          </Route>
          <Route path='/home'>
            <HomePage />
          </Route>
          <Route path='/about'>
            <AboutPage></AboutPage>
          </Route>
        </Switch>
      </Router>
      <Footer/>
    </DistrictDataContext.Provider>
  );
}

export default App;
