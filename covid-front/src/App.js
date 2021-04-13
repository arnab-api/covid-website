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

    const [succeptiblePopulationData, setSucceptiblePopulationData] = useState({})
    const [succeptiblePopulationOptions, setSucceptiblePopulationOptions] = useState({})

    const [observableImpactData, setObservableImpactData] = useState({})
    const [observableImpactOptioins, setObservableImpactOptioins] = useState({})

    const [rareImpactData, setRareImpactData] = useState({})
    const [rareImpactOptions, setRareImpactOptions] = useState({})

    const [plotlyData, setPlotlyData] = useState({})
    const [plotlyLayout, setPlotlyLayout] = useState({})

    // ###################################### Succeptible Population ######################################
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

    const updateCharts = () => {
      getSucceptiblePopulation()
    }

    const updateCharts__For = (geo) => {
      getSucceptiblePopulation__For(geo)
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
              succeptiblePopulationData = {succeptiblePopulationData} setSucceptiblePopulationData = {setSucceptiblePopulationData}
              succeptiblePopulationOptions = {succeptiblePopulationOptions} setSucceptiblePopulationOptions = {setSucceptiblePopulationOptions}
              observableImpactData = {observableImpactData} setObservableImpactData = {setObservableImpactData}
              observableImpactOptioins = {observableImpactOptioins} setObservableImpactOptioins = {observableImpactOptioins}
              rareImpactData = {rareImpactData} setRareImpactData = {setRareImpactData}
              rareImpactOptions = {rareImpactOptions} setRareImpactOptions = {setRareImpactOptions}
              plotlyData = {plotlyData} setPlotlyData = {setPlotlyData}
              plotlyLayout = {plotlyLayout} setPlotlyLayout = {setPlotlyLayout}

              updateSucceptiblePopulationData = {updateSucceptiblePopulationData}
              updateCharts = {updateCharts} updateCharts__For = {updateCharts__For}
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
