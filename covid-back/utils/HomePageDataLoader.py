import pandas as pd
import json
import math

class HomePageDataLoader:

    @staticmethod
    def get_num(num):
        if(num < 1):
            return 0
        # return math.log10(num)   
        return int(num) 

    df_real = pd.read_csv('Data/Bangladesh_real.csv', encoding='UTF-8')
    df_sim = pd.read_csv('Data/Bangladesh_sim.csv', encoding='UTF-8')

    web_plot_1 = None
    @staticmethod
    def load_web_plot_1():
        if(HomePageDataLoader.web_plot_1 != None):
            print("data already loaed and cached >> returning")
            return HomePageDataLoader.web_plot_1

        print("data not loaded >> loading web plot 1")
        web_plot_1 = {
            'x_labels': [],
            'values': [],
            'annotations': []
        }
        active_real = []
        growth_real = []
        confirmed_real = []
        death_real = []

        active_cases = []
        hospitals_required = []
        deaths = []
        total_cases = []
        daily_cases = []

        df_sim = HomePageDataLoader.df_sim
        df_real = HomePageDataLoader.df_real
        for i in range(len(df_sim['date'])):
        # for i in range(5):
            # print(df_2['date'][i])
            web_plot_1['x_labels'].append(str(df_sim['date'][i]))
            active_cases.append(HomePageDataLoader.get_num(df_sim['active'][i]))
            hospitals_required.append(HomePageDataLoader.get_num(df_sim['active'][i]*16/100))
            deaths.append(HomePageDataLoader.get_num(df_sim['deaths'][i]))
            total_cases.append(HomePageDataLoader.get_num(df_sim['confirmed'][i]))
            diff = 0
            if(i > 0):
                diff = df_sim['confirmed'][i] - df_sim['confirmed'][i-1]
            daily_cases.append(HomePageDataLoader.get_num(diff))

            if(i < len(df_real['date'])):
                active_real.append(int(df_real['active'][i]))
                confirmed_real.append(int(df_real['confirmed'][i]))
                death_real.append(int(df_real['deaths'][i]))
                diff = 0
                if(i > 0):
                    diff = df_real['confirmed'][i] - df_real['confirmed'][i-1]
                # print(type(diff))
                growth_real.append(int(diff))
            else:
                active_real.append(None)
                confirmed_real.append(None)
                death_real.append(None)
                growth_real.append(None)
        
        web_plot_1['values'] = [
            { 'value': active_real, 'label': 'Active Real', 'color': "black", 'showLine': False },
            { 'value': confirmed_real, 'label': 'Confirmed Real', 'color': "#0000cc", 'showLine': False },
            { 'value': death_real, 'label': 'Death Real', 'color': "#cc0000", 'showLine': False },
            { 'value': growth_real, 'label': 'Growth Real', 'color': "#b300b3", 'showLine': False },

            { 'value': active_cases, 'label': 'Active Cases', 'color': "black", 'showLine': True },
            { 'value': hospitals_required, 'label': 'Hospitals Required', 'color': "green", 'showLine': True },
            { 'value': deaths, 'label': 'Deaths', 'color': "#cc0000", 'showLine': True },
            { 'value': total_cases, 'label': 'Total Cases', 'color': "#0000cc", 'showLine': True },
            { 'value': daily_cases, 'label': 'Daily Cases', 'color': "#b300b3", 'showLine': True },
        ]

        HomePageDataLoader.web_plot_1 = web_plot_1
        return HomePageDataLoader.web_plot_1