import pandas as pd
import datetime
import math
from operator import itemgetter
import plotly
import plotly.graph_objects as go
import numpy as np
from plotly.subplots import make_subplots
import json


class WorldMapLoader:

    # DATA_PATH = "Data/CSV_june_19/"
    DATA_PATH = "/u/erdos/students/mjonyh/CSV/"

    world_df = pd.read_csv(DATA_PATH + "world_risk_value.csv")
    owid = pd.read_csv(DATA_PATH + "world_owid.csv")
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
        # print("heat map loaded")
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
    # @staticmethod
    # def getWorldRiskMap__Array(limit = 107):
    #     if(len(WorldMapLoader.risk_map_arr) != 0):
    #         print("World Risk << ARRAY >> data already loaded and cached >> returning")
    #         return WorldMapLoader.risk_map_arr
        
    #     risk_map_arr = []
    #     key_list = list(WorldMapLoader.world_df.keys())
    #     counter = 0
    #     while(counter < limit):
    #         day = key_list[-(counter+1)]
    #         risk_map = WorldMapLoader.getWorldRisk__for(day)
    #         risk_map_arr.append(risk_map)

    #         counter += 1

    #     WorldMapLoader.risk_map_arr = risk_map_arr[::-1]
    #     return WorldMapLoader.risk_map_arr

    @staticmethod
    def loadWorldRiskMap__Array():
        if(len(WorldMapLoader.risk_map_arr) != 0):
            print("World Risk << ARRAY >> data already loaded and cached >> returning")
            return WorldMapLoader.risk_map_arr
        
        limit = 10
        risk_map_arr = []
        key_list = list(WorldMapLoader.world_df.keys())
        counter = 0
        while(counter < limit):
            day = key_list[-(counter+1)]
            if(day == "name"):
                break
            risk_map = WorldMapLoader.getWorldRisk__for(day)
            risk_map_arr.append(risk_map)

            counter += 1

        WorldMapLoader.risk_map_arr = risk_map_arr
        return WorldMapLoader.risk_map_arr

    
    @staticmethod
    def getWorldRiskMap__Array(limit = 107):
        risk_map_arr = WorldMapLoader.loadWorldRiskMap__Array()[:107]
        return risk_map_arr[::-1]


    @staticmethod
    def plotRisk(x_dates, risk_values, country):
        colors = ['#54b45f', '#ecd424', '#f88c51', '#c01a27']
        level_arr = [1, 9, 24, 1000]
        zone_label = ['Trivial', 'Community', 'Accelerated', 'Tipping']

        fig = make_subplots()

        for i in range(len(level_arr)):
            level = level_arr[i]
            prev_level = -1
            if(i > 0):
                prev_level = level_arr[i-1] 
            y_risk = [None]*len(x_dates)
            for j in range(len(risk_values)):
                risk = risk_values[j]
                risk = max(risk, 0)
                if(risk < level and risk >= prev_level):
                    y_risk[j] = risk

            fig.add_trace(
                go.Scatter(
                    x=x_dates, 
                    y=y_risk, 
                    name=zone_label[i],
                    mode='markers',
                    line_color=colors[i]
                ),
            )

        fig.update_layout(legend=dict(
            orientation="h",
            yanchor="bottom",
            y=-.15,
            xanchor="right",
            x=1
        ))
        fig.update_yaxes(title_text="<b>Risk Value</b>")
        fig.update_layout(
            title_text="Zone risk timeline >> {}".format(country),
            font=dict(
                size=12,
            )
        )

        fig.update_layout(
            margin=dict(l=10, r=10, t=25, b=10),
                # paper_bgcolor="LightSteelBlue",
        )
        return fig


    @staticmethod
    def getRiskPlot__For(country):
        date_arr = []
        risk_arr = []
        for obj in WorldMapLoader.risk_map_arr:
            date_arr.append(obj['date'])
            for cntry in obj['heat_map']:
                if(cntry['name'] == country):
                    risk_arr.append(cntry['value'])

        fig = WorldMapLoader.plotRisk(date_arr, risk_arr, country)
        graphs = [fig]
        graphJSON = json.dumps(graphs, cls=plotly.utils.PlotlyJSONEncoder)
        return graphJSON



    @staticmethod
    def plotRtDailyCasesPlot(date_arr, daily_cases_arr, rt_arr, country):
        fig = make_subplots(specs=[[{"secondary_y": True}]])

        cumulative_cases_color = '#ff8080'       
        fig.add_trace(
            go.Scatter(
                x=date_arr, 
                y=daily_cases_arr, 
                name="Daily Cases",
                mode='lines+markers',
                line_color=cumulative_cases_color
            ),
            secondary_y=False,
        )
        fig.update_layout(yaxis1=dict(color=cumulative_cases_color))

        rt_color = '#8080ff'
        fig.add_trace(
            go.Scatter(
                x=date_arr, 
                y=rt_arr, 
                name="Rt",
                mode='lines+markers',
                line_color=rt_color
            ),
            secondary_y=True,
        )
        fig.update_traces(line_width=1)
        fig.update_layout(yaxis2=dict(color=rt_color))

        fig.add_hline(
            y=1, 
            line_color="blue",
            secondary_y=True,
        )
        fig.add_annotation(
            x = 1,
            y=1,
            showarrow=False,
            text="<i>"+"R<sub>t</sub>=1"+"</i>",
            textangle=0,
            xref="paper",
            yref="y2",
            font=dict(
                # family="Courier New, monospace",
                size=12,
                color="rgba(0, 0, 255, 1)"
            ),
        )

        # fig.update_layout(legend=dict(
        #     orientation="h",
        #     yanchor="bottom",
        #     y=1.02,
        #     xanchor="right",
        #     x=1,
        #     font=dict(
        #         size=12,
        #     )
        # ))
        fig.update_layout(legend=dict(
            orientation="h",
            yanchor="bottom",
            y=-.15,
            xanchor="right",
            x=1
        ))

        # Add figure title
        fig.update_layout(
            title_text="Daily Cases vs Rt >> {}".format(country),
            font=dict(
                # family="Courier New, monospace",
                size=12,
                # color="RebeccaPurple"
            )
        )

        # Set x-axis title
        fig.update_xaxes(title_text="<b>Date</b>")

        # Set y-axes titles
        fig.update_yaxes(title_text="<b>Daily Cases</b>", secondary_y=False)
        fig.update_yaxes(title_text="<b>R<sub>t</sub></b>", secondary_y=True)
        fig.update_yaxes(range=[0, 3], secondary_y=True)

        fig.update_layout(
            margin=dict(l=10, r=10, t=25, b=10),
            # paper_bgcolor="LightSteelBlue",
        )

        return fig

    
    @staticmethod
    def getRtDailyCasesPlot__For(country):
        date_arr = []
        rt_arr = []
        daily_cases_arr = []

        owid_country = WorldMapLoader.owid[WorldMapLoader.owid['location'] == country]
        for index, row in owid_country.iterrows():
            date = row['date']
            rt = row['reproduction_rate']
            daily_cases = row['new_cases']
            
            date_arr.append(date)
            rt_arr.append(rt)
            daily_cases_arr.append(daily_cases)

        fig = WorldMapLoader.plotRtDailyCasesPlot(date_arr, daily_cases_arr, rt_arr, country)
        graphs = [fig]
        graphJSON = json.dumps(graphs, cls=plotly.utils.PlotlyJSONEncoder)
        return graphJSON
        