import pandas as pd
import datetime
import math
import math

class WorldMapLoader:

    DATA_PATH = "Data/CSV/"
    world_df = pd.read_csv(DATA_PATH + "world_risk_value.csv")
    owid = pd.read_csv(DATA_PATH + "owid-covid-data.csv")
    owid = owid.sort_values(by=['date'], ascending=False)

    @staticmethod
    def getRtValue(country, day):
        # print("getting data for >> ", country)
        ow_country = WorldMapLoader.owid[WorldMapLoader.owid['location'] == country]
        ow_country = ow_country[ow_country['date'] <= day]
        for index, row in ow_country.iterrows():
            rt = row['reproduction_rate']
            if(math.isnan(rt)):
                continue
            # print(" ---------------_> ", row['reproduction_rate'], row['date'])
            return row['reproduction_rate'], row['date']
        return -1, day

    @staticmethod
    def get_heat_map(day):
        heat_map = []
        print("loading world heat map >>> ", day)
        for index, row in WorldMapLoader.world_df.iterrows():
            rt, rt_date = WorldMapLoader.getRtValue(row['name'], day)
            # print(row['name']," >>>>>>>>>>>> OK", rt, rt_date)
            value = row[day]
            if(math.isnan(value)):
                value = -1
            heat_map.append(
                {
                    'name': row['name'],
                    'value': value,
                    'rt': {
                        'value': rt,
                        'date': rt_date 
                    }
                }
            )
            # print(row['name']," >>> OK", rt, rt_date)
        print("heat map loaded")
        return heat_map

    @staticmethod
    def getWorldRisk__for(day):
        heat_map = WorldMapLoader.get_heat_map(day)
        risk_map = {
            "date": day,
            "heat_map": heat_map
        }
        return risk_map


    world_risk = []
    @staticmethod
    def getWorldRisk():
        if(len(WorldMapLoader.world_risk) != 0):
            print("World Risk >> data already loaded and cached >> returning")
            return WorldMapLoader.world_risk
        
        print("World Risk >> data not loaded >> loading data")
        key_list = list(WorldMapLoader.world_df.keys())
        latest_day = key_list[-1]
        WorldMapLoader.world_risk = WorldMapLoader.getWorldRisk__for(latest_day)
        return WorldMapLoader.world_risk

    world_risk_past = []
    @staticmethod
    def getWorldRisk__past():
        if(len(WorldMapLoader.world_risk_past) != 0):
            print("World Risk PAST >> data already loaded and cached >> returning")
            return WorldMapLoader.world_risk_past
        
        print("World Risk >> data not loaded >> loading data")
        key_list = list(WorldMapLoader.world_df.keys())
        past_day = key_list[-8]
        WorldMapLoader.world_risk_past = WorldMapLoader.getWorldRisk__for(past_day)
        return WorldMapLoader.world_risk_past