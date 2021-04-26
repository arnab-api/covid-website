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
    DATA_PATH = "Data/CSV/"


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
                    'value': random.randint(1,30)
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