import pandas as pd
import datetime
import math

class WorldMapLoader:

    DATA_PATH = "Data/CSV/"
    world_df = pd.read_csv(DATA_PATH + "world_risk_value.csv")

    world_risk = []
    @staticmethod
    def getWorldRisk():
        if(len(WorldMapLoader.world_risk) != 0):
            print("World Risk >> data already loaded and cached >> returning")
            return WorldMapLoader.world_risk
        
        print("World Risk >> data not loaded >> loading data")
        key_list = list(WorldMapLoader.world_df.keys())
        latest_day = key_list[-1]
        heat_map = []
        for index, row in WorldMapLoader.world_df.iterrows():
            value = row[latest_day]
            if(math.isnan(value)):
                value = -1
            heat_map.append(
                {
                    'name': row['name'],
                    'value': value
                }
            )
        WorldMapLoader.world_risk = {
            "date": latest_day,
            "heat_map": heat_map
        }
        return WorldMapLoader.world_risk