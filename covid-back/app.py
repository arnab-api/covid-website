from flask import Flask, jsonify
# from flask import render_template
from datetime import time
import random
import os
import json
import pandas as pd
import plotly.express as px
import plotly
import plotly.express as px
import plotly
from datetime import date, timedelta

from utils.BD_MapLoader import BD_MapLoader

app = Flask(__name__)
 
def dir_last_updated(folder):
    return str(max(os.path.getmtime(os.path.join(root_path, f))
                   for root_path, dirs, files in os.walk(folder)
                   for f in files))


def getRandom__RareImpactData():
    labels = []
    for i in range(300):
        labels.append(str(i))
    mobility_drop = []
    daily_case = []
    test_pos = []
    R_t0 = []
    R_t1 = []

    mobility_drop.append(random.uniform(-1,8))
    daily_case.append(random.uniform(-1, 8))
    test_pos.append(random.uniform(-1, 8))
    R_t0.append(random.uniform(-1, 8))
    R_t1.append(random.uniform(max(-1, R_t0[0] - .3), min(8, R_t0[0] + .3)))

    null_arr = []
    for i in range(1, len(labels)):
        if(i in null_arr):
            mobility_drop.append(None)
            daily_case.append(None)
            R_t0.append(None)
            R_t1.append(None)
            test_pos.append(None)
            continue

        if((i-1) not in null_arr):
            mobility_drop.append(random.uniform(max(-1, mobility_drop[i-1] - .3), min(8, mobility_drop[i-1] + .3)))
            daily_case.append(random.uniform(max(-1, daily_case[i-1] - .3), min(8, daily_case[i-1] + .3)))
            test_pos.append(random.uniform(max(-1, test_pos[i-1] - .3), min(8, test_pos[i-1] + .3)))
            R_t0.append(random.uniform(max(-1, R_t0[i-1] - .3), min(8, R_t0[i-1] + .3)))
            R_t1.append(random.uniform(max(-1, R_t1[i-1] - .3), min(8, R_t1[i-1] + .3)))
        else:
            mobility_drop.append(1)
            daily_case.append(2)
            R_t0.append(3)
            R_t1.append(4)
            test_pos.append(5)

    values = [
        {
            'value': mobility_drop, 'label': 'Drops in mobility', 'color': "rgba(0,0,0)"
        },
        {
            'value': daily_case, 'label': 'Daily Cases', 'color': "rgba(29, 10, 240)"
        },
        {
            'value': test_pos, 'label': 'Test positive rate', 'color': "rgba(58, 156, 9)"
        },
        {
            'value': R_t0, 'label': 'R_t_1', 'color': "rgba(235, 9, 28, .5)"
        },
        {
            'value': R_t1, 'label': 'R_t_2', 'color': "rgba(235, 9, 28, .5)"
        },
    ]

    annotations = [
        {
            'text': 'L1', 'color': 'red', 'value': '50'
        },
        {
            'text': 'L2', 'color': 'blue', 'value': '100'
        },
        {
            'text': 'L3', 'color': 'green', 'value': '200'
        }
    ]

    return {
        'values': values,
        'annotations': annotations,
        'x_labels': labels
    }

def loadRareImpactData():
    with open('Data/web_plot_2.json', 'r') as f:
        rareimpact = json.load(f)
    return rareimpact

def getRandom__CaseEstimationData():
    labels = []
    for i in range(100):
        labels.append(str(i))
    confirmed_cases_est = []
    confirmed_cases_real = []

    daily_cases_est = []
    daily_cases_real = []

    recovered_cases_est = []
    recovered_cases_real = []

    death_cases_est = []
    death_cases_real = []

    active_cases_est = []
    active_cases_real = []

    confirmed_cases_est.append(random.uniform(-1,8))
    confirmed_cases_real.append(random.uniform(max(-1, confirmed_cases_est[0] - .1), min(8, confirmed_cases_est[0] + .1)))
    
    daily_cases_est.append(random.uniform(-1,8))
    daily_cases_real.append(random.uniform(max(-1, daily_cases_est[0] - .1), min(8, daily_cases_est[0] + .1)))

    death_cases_est.append(random.uniform(-1,8))
    death_cases_real.append(random.uniform(max(-1, death_cases_est[0] - .1), min(8, death_cases_est[0] + .1)))

    # confirmed_cases_est.append(random.uniform(-1,8))
    # confirmed_cases_real.append(random.uniform(max(-1, confirmed_cases_est[0] - .1), min(8, confirmed_cases_est[0] + .1)))

    # confirmed_cases_est.append(random.uniform(-1,8))
    # confirmed_cases_real.append(random.uniform(max(-1, confirmed_cases_est[0] - .1), min(8, confirmed_cases_est[0] + .1)))

    null_arr = []
    for i in range(1, len(labels)):
        if(i in null_arr):
            confirmed_cases_est.append(None)
            confirmed_cases_real.append(None)

            continue

        if((i-1) not in null_arr):
            confirmed_cases_est.append(random.uniform(max(-1, confirmed_cases_est[i-1] - .3), min(8, confirmed_cases_est[i-1] + .3)))
            confirmed_cases_real.append(random.uniform(max(-1, confirmed_cases_est[i] - .1), min(8, confirmed_cases_est[i] + .1)))

            daily_cases_est.append(random.uniform(max(-1, daily_cases_est[i-1] - .3), min(8, daily_cases_est[i-1] + .3)))
            daily_cases_real.append(random.uniform(max(-1, daily_cases_est[i] - .1), min(8, daily_cases_est[i] + .1)))

            death_cases_est.append(random.uniform(max(-1, death_cases_est[i-1] - .3), min(8, death_cases_est[i-1] + .3)))
            death_cases_real.append(random.uniform(max(-1, death_cases_est[i] - .1), min(8, death_cases_est[i] + .1)))

        else:
            confirmed_cases_est.append(1)
            confirmed_cases_real.append(2)

    values = [
        {
            'value': confirmed_cases_est, 'label': 'Estimated cases', 'color': "blue", 'showLine': True
        },
        {
            'value': confirmed_cases_real, 'label': 'Real confirmed Cases', 'color': "red", 'showLine': False
        },
        {
            'value': daily_cases_est, 'label': 'Estimated daily confirmed cases', 'color': "rgb(153, 204, 255)", 'showLine': True
        },
        {
            'value': daily_cases_real, 'label': 'Real daily confirmed Cases', 'color': "rgb(204, 0, 255)", 'showLine': False
        },
        {
            'value': death_cases_est, 'label': 'Estimated death cases', 'color': "rgb(102, 102, 51)", 'showLine': True
        },
        {
            'value': death_cases_real, 'label': 'Real death cases', 'color': "rgb(102, 255, 102)", 'showLine': False
        },
    ]

    annotations = [
        # {
        #     'text': 'L1', 'color': 'red', 'value': '50'
        # },
        # {
        #     'text': 'L2', 'color': 'blue', 'value': '100'
        # },
        # {
        #     'text': 'L3', 'color': 'green', 'value': '200'
        # }
    ]

    return {
        'values': values,
        'annotations': annotations,
        'x_labels': labels
    }


def loadCaseEstimationData():
    with open('Data/web_plot_1.json', 'r') as f:
        caseEstimation = json.load(f)
    return caseEstimation


def getRandom__ObservableImpactData():
    # point_arr = [{
    #     'x': 5, 'y': 5
    # }]
    point_arr = []
    for i in range(300):
        point_arr.append({
            'x': random.uniform(0, 3000), 
            'y': random.uniform(0, 25)
        })
    
    regression_line = {'px': random.uniform(0,5), 'py': random.uniform(0,5), 'slope': random.uniform(.003, .007)}

    return {
        'x_axis': 'Total positive rate (in %)',
        'y_axis': 'Daily Cases',
        'point_arr': point_arr,
        'regression_line': regression_line, 
    }

def getRandom__BarChart():
    labels = ['1-10', '11-20', '21-30', '31-40', '41-50', '51-60', '60+']
    population = []
    succeptible_population = []
    for i in range(len(labels)):
        population.append(random.uniform(5,35))
        succeptible_population.append(random.uniform(4, population[i]))

    data = [
        {
            'value': population, 'label': 'Population', 'color': "blue"
        },
        {
            'value': succeptible_population, 'label': 'Susceptible population', 'color': "orange"
        }
    ]

    return {
        'area'  : 'Bangladesh',
        'labels': labels,
        'data': data,
        'y_axis': "Population (in million)",
        'x_axis': "Age group"
    }


def getRandom__ForcastData():
    # start_date = date(2008, 8, 15)   # start date
    # end_date = date(2008, 9, 15)   # end date

    end_date = date.today()
    start_date = end_date - timedelta(days=16)
    delta = end_date - start_date       # as timedelta
    forcast_data = []

    for i in range(delta.days + 1):
        day = start_date + timedelta(days=i)
        forcast_data.append({
            'date': day.isoformat(),
            'confirmedCases': random.randint(20000, 30000), 
            'recoveredCases': random.randint(15000, 20000), 
            'deaths': random.randint(2000, 5000), 
            'Rt': random.uniform(.7, .99), 
            'DT': random.uniform(80, 100)
        })
    
    forcast_data.reverse()
    return forcast_data

@app.route("/api/rareimpact")
def getRareImpactData():
    # rareImpact = getRandom__RareImpactData()
    rareImpact = loadRareImpactData()
    return rareImpact

@app.route("/api/rareimpact/<district_name>")
def getRareImpactData__For(district_name):
    print("getting estimation data for {}".format(district_name))
    rareImpact = getRandom__RareImpactData()
    return rareImpact

@app.route("/api/caseEstimation")
def getCaseEstimationData():
    # caseEstimation = getRandom__CaseEstimationData()
    caseEstimation = loadCaseEstimationData()
    return caseEstimation

@app.route("/api/caseEstimation/<district_name>")
def getCaseEstimationData__For(district_name):
    print("getting estimation data for {}".format(district_name))
    caseEstimation = getRandom__CaseEstimationData()
    return caseEstimation

@app.route("/api/observableimpact")
def getObservableImpactData():
    observableImpact = getRandom__ObservableImpactData()
    return observableImpact

@app.route("/api/succeptible_population")
def getSucceptiblePopulationData():
    succeptible_population = getRandom__BarChart()
    return succeptible_population

@app.route("/api/succeptible_population/<district_name>")
def getSucceptiblePopulationData__For(district_name):
    print("getting data for {}".format(district_name))
    succeptible_population = getRandom__BarChart()
    succeptible_population['area'] = district_name
    return succeptible_population

@app.route("/api/map_data")
def getMapData():
    # mapdata = BD_MapLoader.getMap_and_Mapdata()
    mapdata = BD_MapLoader.testPlotly()
    # mapdata = BD_MapLoader.simpleChoroPleth()
    # mapdata = BD_MapLoader.getInstance()
    return mapdata

@app.route("/api/heat_map")
def getheatmap():
    # mapdata = BD_MapLoader.getRandomHeatMap()
    mapdata = BD_MapLoader.getRiskData()
    return jsonify(mapdata)

@app.route("/api/heat_map_dist")
def getheatmap_dist():
    mapdata = BD_MapLoader.getRandomHeatMap_dist()
    return jsonify(mapdata)

@app.route("/api/dist_2_id")
def get_dist():
    mapdata = BD_MapLoader.getDistrictData()
    return jsonify(mapdata)


@app.route("/api/rt_forcast_table")
def getForcastTable():
    return jsonify(getRandom__ForcastData())

if __name__ == "__main__":
    app.run(
                host=os.getenv('IP', '0.0.0.0'), 
                port=int(os.getenv('PORT', 5000)), 
                debug=True
            )