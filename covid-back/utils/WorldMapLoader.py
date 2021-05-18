import pandas as pd
import datetime
import math
from operator import itemgetter


class WorldMapLoader:

    # DATA_PATH = "Data/CSV_18_03/"
    DATA_PATH = "/u/erdos/students/mjonyh/CSV/"

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
    def loadCountryRtFor(day):
        owid_day = WorldMapLoader.owid[WorldMapLoader.owid['date'] == day][['date','location', 'reproduction_rate']]
        country_rt = {}
        for index, row in owid_day.iterrows():
            country_rt[row['location']] = {
                'value': row['reproduction_rate'],
                'date': day
            }
        return country_rt

    @staticmethod
    def get_heat_map(day):
        heat_map = []

        print("loading world heat map >>> ", day)
        country_rt = WorldMapLoader.loadCountryRtFor(day)
        for index, row in WorldMapLoader.world_df.iterrows():
            # rt, rt_date = WorldMapLoader.getRtValue(row['name'], day)
            # print(row['name']," >>>>>>>>>>>> OK", rt, rt_date)
            country = row['name']
            value = row[day]
            if(math.isnan(value)):
                value = -1
            
            obj = {
                    'name': country,
                    'value': value
                }
            rt = {
                    'value': -1, #rt,
                    'date': "tobeupdated" #rt_date 
                }
            if(country in country_rt):
                rt_val = country_rt[country]['value']
                if(math.isnan(rt_val) == False):
                    rt = country_rt[country]
            
            obj['rt'] = rt

            heat_map.append(obj)
            # print(row['name']," >>> OK", rt, rt_date)
        print("heat map loaded")
        return sorted(heat_map, key=itemgetter("value"), reverse=True)
        # return heat_map

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

    risk_map_arr = []
    @staticmethod
    def getWorldRiskMap__Array(limit = 107):
        if(len(WorldMapLoader.risk_map_arr) != 0):
            print("World Risk << ARRAY >> data already loaded and cached >> returning")
            return WorldMapLoader.risk_map_arr
        
        risk_map_arr  =[]
        key_list = list(WorldMapLoader.world_df.keys())
        counter = 0
        while(counter < limit):
            day = key_list[-(counter+1)]
            risk_map = WorldMapLoader.getWorldRisk__for(day)
            risk_map_arr.append(risk_map)

            counter += 1

        WorldMapLoader.risk_map_arr = risk_map_arr[::-1]
        return WorldMapLoader.risk_map_arr
