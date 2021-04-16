import json
import random
import pandas as pd
import plotly.express as px
import plotly
import plotly.graph_objects as go
import numpy as np
from plotly.subplots import make_subplots


class BD_MapLoader:
    bd_geo = None
    graphJson = None

    @staticmethod
    def loadBangladeshMap():
        with open("BD_geojson/bangladesh.geojson", 'r') as f:
            bd_geo = json.load(f)
        print(bd_geo.keys())
        return bd_geo

    @staticmethod
    def getInstance():
        if BD_MapLoader.bd_geo == None:
            print("Loading map for the first and last time")
            BD_MapLoader.bd_geo = BD_MapLoader.loadBangladeshMap()
        
        return BD_MapLoader.bd_geo

    @staticmethod
    def getMap_and_Mapdata():
        if BD_MapLoader.graphJson == None:
            print("Loading json data for the first and last time")
            BD_MapLoader.graphJson = BD_MapLoader.getRandom__Mapdata()
        
        return BD_MapLoader.graphJson

    @staticmethod
    def getRandom__Mapdata():
        bd_geo = BD_MapLoader.getInstance()
        df_bd = pd.DataFrame()

        for i, feature in enumerate(bd_geo["features"]):
            df_bd.loc[i, "id"]  = feature["id"]
            df_bd.loc[i, "NAME_3"] = feature["properties"]["NAME_3"]
            df_bd.loc[i, "color"] = random.random()/2

        fig = px.choropleth(
            df_bd,
            geojson=bd_geo,
            locations="id",
            color="color",
            # featureidkey="properties.hasc_2",
            color_continuous_scale="Viridis",
            range_color=(0, 1),
            labels={"NAME_3": "NAME_3"},
            projection="mercator"
        )
        fig.update_layout(margin={"r": 0, "t": 0, "l": 0, "b": 0})
        fig.update_geos(fitbounds="locations", visible=False)

        graphs = [fig]
        graphJSON = json.dumps(graphs, cls=plotly.utils.PlotlyJSONEncoder)
        # print(graphJSON)

        return graphJSON

    @staticmethod
    def testPlotly():

        df_cases_real = pd.read_csv('Data/District/districts_real.csv')
        df_cases_sim = pd.read_csv('Data/District/districts_sim.csv')

        df_rt_real = pd.read_csv('Data/District/districts_real_rt_gr_dt.csv')
        df_rt_sim = pd.read_csv('Data/District/districts_sim_rt_gr_dt.csv')

        df_cases_real.date = pd.to_datetime(df_cases_real.date)
        df_cases_sim.days_sim = pd.to_datetime(df_cases_sim.days_sim)
        df_rt_real.date = pd.to_datetime(df_rt_real.date)
        df_rt_sim.date = pd.to_datetime(df_rt_sim.date)


        ### select district_name from Bangladesh map by clicking on the district
        district_name = 'BARISHAL'

        df_district_real = df_cases_real[df_cases_real.district == district_name]
        df_district_sim = df_cases_sim[df_cases_sim.district == district_name]
        df_district_rt_real = df_rt_real[df_rt_real.district == district_name]
        df_district_rt_sim = df_rt_sim[df_rt_sim.district == district_name]

        # fig = go.Figure(data=go.Scatter(x=df_district_real['date'], 
        #                         y=df_district_real['confirmed'], 
        #                         mode='lines+markers', 
        #                         line_color='#ff0000'))
        # fig.update_yaxes(type="log")

        fig = make_subplots(specs=[[{"secondary_y": True}]])

        # Add traces
        fig.add_trace(
            go.Scatter(
                x=df_district_real['date'], 
                y=df_district_real['confirmed'], 
                name="Cumulative Cases",
                mode='lines+markers',
                line_color='#ff0000'
            ),
            secondary_y=False,
        )
        fig.add_trace(
            go.Scatter(
                x=df_district_sim['days_sim'], 
                y=df_district_sim['confirmed_sim'], 
                name="Cumulative Cases SIM",
                mode='lines',
                line_color='#ff0000',
                showlegend=False
            ),
            secondary_y=False,
        )
        fig.update_layout(yaxis1=dict(type='log'))

        fig.add_trace(
            go.Scatter(
                x=df_district_rt_real.date, 
                y=df_district_rt_real.ML, 
                name="Rt",
                mode='lines+markers',
                line_color='#0000ff'
            ),
            secondary_y=True,
        )

        fig.add_trace(
            go.Scatter(
                x=df_district_rt_sim.date, 
                y=df_district_rt_sim.High_90, 
                name="Rt_hi",
                mode='lines',
                line_color='#0000ff',
                showlegend = False
            ),
            secondary_y=True,
        )

        fig.add_trace(
            go.Scatter(
                x=df_district_rt_real.date, 
                y=df_district_rt_real.Low_90, 
                name="Rt_lo",
                mode='lines',
                line_color="rgba(0, 0, 255, .5)",
                fill='tonexty',
                fillcolor="rgba(0, 0, 255, .2)",
                showlegend=False
            ),
            secondary_y=True,
        )
        fig.update_traces(line_width=1)

        # Add figure title
        fig.update_layout(
            title_text="Cumulative Cases vs Rt"
        )

        # Set x-axis title
        fig.update_xaxes(title_text="<b>Date</b>")

        # Set y-axes titles
        fig.update_yaxes(title_text="<b>Cumulative Cases</b>", secondary_y=False)
        fig.update_yaxes(title_text="<b>Rt</b>", secondary_y=True)

        fig.update_layout(
            autosize=False,
            width=700,
            height=400,
        )

        fig.update_layout(legend=dict(
            orientation="h",
            yanchor="bottom",
            y=1.02,
            xanchor="right",
            x=1
        ))

        graphs = [fig]
        graphJSON = json.dumps(graphs, cls=plotly.utils.PlotlyJSONEncoder)

        return graphJSON


    @staticmethod
    def getRandomHeatMap():
        area_id = []
        with open("utils/bd_area_id.json", 'r') as f:
            area_id = json.load(f)

        heat_map = []
        for area in area_id:
            heat_map.append({
                'id': area,
                'state': area,
                'value': random.randint(1,100)
            })
        
        return heat_map

    @staticmethod
    def getDistrictData():
        with open("utils/bd_dist_id.json", 'r') as f:
            dist_dict = json.load(f)
            return dist_dict
    
    @staticmethod
    def getRandomHeatMap_dist():
        dist_dict = BD_MapLoader.getDistrictData()
        heat_map = []
        for dist in dist_dict:
            for _id in dist_dict[dist]:
                obj = {
                    'id': _id,
                    'dist': dist,
                    'value': random.randint(1,100)
                }
                if dist == 'Indian Chhitmahal in Bangladesh':
                    obj['value'] = 0
                heat_map.append(obj)
        return heat_map

    @staticmethod
    def getRiskData():
        dist_dict = BD_MapLoader.getDistrictData()
        with open("Data/dist_2_risk.json", 'r') as f:
            dist_2_risk = json.load(f)

        replace_name = {
            'BARISAL': 'BARISHAL',
            'CHITTAGONG': 'CHATTOGRAM',
            'COMILLA': 'CUMILLA',
            "COX'S BAZAR": 'COXS BAZAR',
            'NETROKONA': 'NETRAKONA',
            'JESSORE': 'JASHORE',
            'JHENAIDAHA': 'JHENAIDAH',
            'BOGRA': 'BOGURA',
            'CHAPAI': 'CHAPAINABABGANJ',
            'MAULVIBAZAR': 'MOULVIBAZAR'
        }
        
        heat_map = []
        for dist in dist_dict:
            for _id in dist_dict[dist]:
                obj = {
                    'id': _id,
                    'dist': dist,
                }
                if dist == 'Indian Chhitmahal in Bangladesh':
                    obj['value'] = 0
                    continue
                if dist in dist_2_risk:
                    obj['value']= round(dist_2_risk[dist], 2)
                else:
                    rep = replace_name[dist]
                    obj['value']= round(dist_2_risk[rep], 2)
                heat_map.append(obj)

        return heat_map