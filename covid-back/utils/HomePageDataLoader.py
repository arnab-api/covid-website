import pandas as pd
import numpy as np
import json
import math
import datetime
import copy

class HomePageDataLoader:

    # DATA_PATH = "Data/CSV_July_13/"
    DATA_PATH = "/u/erdos/students/mjonyh/CSV/"

    @staticmethod
    def get_num(num):
        if(num < 1):
            return 0
        # return math.log10(num)   
        return int(num) 

    df_real = pd.read_csv(DATA_PATH + 'Bangladesh_real.csv', encoding='UTF-8')
    df_sim = pd.read_csv(DATA_PATH + 'Bangladesh_sim.csv', encoding='UTF-8')
    df_rt_real = pd.read_csv(DATA_PATH + "rt_real.csv")
    df_rt_sim = pd.read_csv(DATA_PATH + 'rt_sim.csv')
    bd_dt_sim = pd.read_csv(DATA_PATH + "doublingtimes_sim.csv")
    df_owid = pd.read_csv(DATA_PATH + 'owid-covid-data.csv')
    df_owid = df_owid[df_owid['location']=='Bangladesh']
    df_owid['date'] = pd.to_datetime(df_owid['date'])
    df_mobility = pd.read_csv(DATA_PATH + 'google_mobility.csv')
    df_mobility = df_mobility[df_mobility['country_region_code']=='BD']
    df_mobility = df_mobility[['date','retail_and_recreation_percent_change_from_baseline','grocery_and_pharmacy_percent_change_from_baseline','parks_percent_change_from_baseline','transit_stations_percent_change_from_baseline','workplaces_percent_change_from_baseline']]
    df_mobility_mean = df_mobility[['retail_and_recreation_percent_change_from_baseline','grocery_and_pharmacy_percent_change_from_baseline','parks_percent_change_from_baseline','transit_stations_percent_change_from_baseline','workplaces_percent_change_from_baseline']]
    df_mobility['mean'] = df_mobility_mean.mean(axis=1)

    latest_summary = None
    @staticmethod
    def getLatestInfo():
        if(HomePageDataLoader.latest_summary == None):
            latest_summary = HomePageDataLoader.df_real.sort_values(by=['date'], ascending=False).iloc[0]
            HomePageDataLoader.latest_summary = json.loads(latest_summary.to_json())
        return HomePageDataLoader.latest_summary

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
        daily_death_real = []

        active_cases = []
        hospitals_required = []
        deaths = []
        total_cases = []
        daily_cases = []
        daily_death_est = []

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
            death_diff = 0
            if(i > 0):
                diff = df_sim['confirmed'][i] - df_sim['confirmed'][i-1]
                death_diff = df_sim['deaths'][i] - df_sim['deaths'][i-1] 
            daily_cases.append(HomePageDataLoader.get_num(diff))
            daily_death_est.append(HomePageDataLoader.get_num(death_diff))

            if(i < len(df_real['date'])):
                active_real.append(int(df_real['active'][i]))
                confirmed_real.append(int(df_real['confirmed'][i]))
                death_real.append(int(df_real['deaths'][i]))
                diff = 0
                death_diff = 0
                if(i > 0):
                    diff = df_real['confirmed'][i] - df_real['confirmed'][i-1]
                    death_diff = df_real['deaths'][i] - df_real['deaths'][i-1] 
                # print(type(diff))
                growth_real.append(int(diff))
                daily_death_real.append(HomePageDataLoader.get_num(death_diff))

            # else:
            #     active_real.append(None)
            #     confirmed_real.append(None)
            #     death_real.append(None)
            #     growth_real.append(None)
        
        web_plot_1['values'] = [
            { 'value': hospitals_required, 'label': 'Hospitalization Required', 'color': "green", 'showLine': True },


            { 'value': active_real, 'label': 'Active', 'color': "black", 'showLine': False },
            # { 'value': confirmed_real, 'label': 'Confirmed Real', 'color': "#8080ff", 'showLine': False },
            # { 'value': death_real, 'label': 'Death', 'color': "#ff6666", 'showLine': False },
            { 'value': daily_death_real, 'label': 'Death', 'color': "#ff6666", 'showLine': False },
            { 'value': growth_real, 'label': 'Daily Cases', 'color': "#b300b3", 'showLine': False },

            { 'value': active_cases, 'label': 'Active Estimated', 'color': "black", 'showLine': True },
            # { 'value': deaths, 'label': 'Deaths Estimated', 'color': "#ff8080", 'showLine': True },
            { 'value': daily_death_est, 'label': 'Deaths Estimated', 'color': "#ff8080", 'showLine': True },
            # { 'value': total_cases, 'label': 'Total Cases', 'color': "#8080ff", 'showLine': True },
            { 'value': daily_cases, 'label': 'Daily Cases Estimated', 'color': "#ff99ff", 'showLine': True },
        ]

        HomePageDataLoader.web_plot_1 = web_plot_1
        return HomePageDataLoader.web_plot_1

    @staticmethod
    def getFormattedDate(date):
        if(isinstance(date, str)):
            return date
        return date.strftime("%Y-%m-%d")



    web_plot_2 = None
    @staticmethod
    def load_web_plot_2():
        if(HomePageDataLoader.web_plot_2 != None):
            print("web plot 2 >> data already loaed and cached >> returning")
            return HomePageDataLoader.web_plot_2
        
        print("data not loaded >> loading web plot 2")

        # min_date = datetime.datetime(2020, 2, 15)
        # max_date = datetime.datetime(2021, 6, 1)
        # delta = max_date - min_date

        # date_arr = []
        # for i in range(delta.days + 1):
        #     day = min_date + datetime.timedelta(days=i)
        #     # date_arr.append(day.strftime("%Y-%m-%d"))
        #     date_arr.append(HomePageDataLoader.getFormattedDate(day))

        date_arr = list(HomePageDataLoader.df_mobility['date'])

        # sim_dates = list(HomePageDataLoader.df_rt_sim['Date'])
        # for date in sim_dates:
        #     if(date not in date_arr):
        #         date_arr.append(date)

        max_date = date_arr[-1]


        # print(date_arr[0:5])
        # print(date_arr.index('2020-02-17'))
        mobility_drop = []
        daily_cases = []
        daily_cases_sim = []
        test_positive = []
        rt_1 = []
        rt_2 = []
        rt_1_low_90 = []
        rt_1_high_90 = []

        for date in date_arr:
            mobility_drop.append(None)
            daily_cases.append(None)
            test_positive.append(None)
            daily_cases_sim.append(None)
            rt_1.append(None)
            rt_2.append(None)
            rt_1_low_90.append(None)
            rt_1_high_90.append(None)

        for index, row in HomePageDataLoader.df_mobility.iterrows():
            date = row['date']
            print(" >>> ", date)
            if(date == HomePageDataLoader.getFormattedDate(max_date)):
                break
            value = -row['mean']/10
            idx = date_arr.index(date)
            mobility_drop[idx] = value

            # print(date, value, idx)
            # limit -= 1
            # if(limit == 0):
            #     break
        print("mobility drop data populated")

        df_bd_real = HomePageDataLoader.df_real
        df_bd_sim = HomePageDataLoader.df_sim

        prev = None
        for index, row in df_bd_real.iterrows():
            date = row['date']
            if(date == HomePageDataLoader.getFormattedDate(max_date)):
                break
            value = row['confirmed']
            idx = date_arr.index(date)

            if(prev == None):
                diff = 0
            else:
                diff = value - prev
            daily_cases[idx] = diff/1000
            prev = value
        print("daily cases data populated")

        prev = None
        for index, row in df_bd_sim.iterrows():
            date = row['date']
            if(date == HomePageDataLoader.getFormattedDate(max_date)):
                # print("HI")
                break
            value = row['confirmed']
            idx = date_arr.index(date)

            if(prev == None):
                diff = 0
            else:
                diff = value - prev
            daily_cases_sim[idx] = diff/1000
            prev = value
        print("daily cases __SIM data populated")


        for index, row in HomePageDataLoader.df_owid.iterrows():
            date = HomePageDataLoader.getFormattedDate(row['date'])
            if(date == HomePageDataLoader.getFormattedDate(max_date)):
                break
            value = row['positive_rate']*10
            idx = date_arr.index(date)
            # test_positive[idx] = "--> {} -- {}".format(float(value), type(value))
            if(math.isnan(float(value))):
                continue
            test_positive[idx] = float(value)
        print("test positive data populated")

        for index, row in HomePageDataLoader.df_rt_real.iterrows():
            date = row['Date']
            if(date == HomePageDataLoader.getFormattedDate(max_date)):
                break
            value = row['ML']
            idx = date_arr.index(date)
            # test_positive[idx] = "--> {} -- {}".format(float(value), type(value))
            if(math.isnan(float(value))):
                continue
            rt_1[idx] = float(value)
        print("rt_1 data populated")

        for index, row in HomePageDataLoader.df_rt_sim.iterrows():
            date = row['Date']
            if(date == HomePageDataLoader.getFormattedDate(max_date)):
                break
            value = row['ML']
            idx = date_arr.index(date)
            # test_positive[idx] = "--> {} -- {}".format(float(value), type(value))
            if(math.isnan(float(value))):
                continue
            rt_2[idx] = float(value)
        print("rt_2 data populated")

        for index, row in HomePageDataLoader.df_rt_real.iterrows():
            date = row['Date']
            if(date == HomePageDataLoader.getFormattedDate(max_date)):
                break
            lo = row['Low_90']
            hi = row['High_90']
            idx = date_arr.index(date)
            rt_1_low_90[idx] = float(lo)
            rt_1_high_90[idx] = float(hi)
        print("rt_2 lo and hi data populated")

        web_plot_2 = {
            'x_labels': date_arr,
            'values': [
                { 'value': mobility_drop, 'label': 'Drops in Mobility (x10)', 'color': "black"},
                # { 'value': daily_cases, 'label': 'Daily Cases (x1K)', 'color': "#8080ff"},
                { 'value': test_positive, 'label': 'Test Positive Rate (x10 in %)', 'color': "green" },
                { 'value': rt_1, 'label': 'R_t', 'color': "#ff8080" },
                # { 'value': rt_2, 'label': 'R_t_2', 'color': "rgba(235, 9, 28, .5)" },
                { 'value': rt_1_low_90, 'label': 'R_t Low', 'color': "rgba(235, 9, 28, .35)" },
                { 'value': rt_1_high_90, 'label': 'R_t High', 'color': "rgba(235, 9, 28, .35)" },
            ],
            'annotations': []
        }

        HomePageDataLoader.web_plot_2 = web_plot_2
        return HomePageDataLoader.web_plot_2


    forcast_data = []
    def getForcastData():
        if(len(HomePageDataLoader.forcast_data) > 0):
            print("Forcast data >> already loaded and cached -- returning")
            return HomePageDataLoader.forcast_data

        # bd_df = pd.read_csv(DATA_PATH + "Bangladesh_sim.csv")
        # bd_rt = pd.read_csv(DATA_PATH + "rt_sim.csv")
        # bd_dt = pd.read_csv(DATA_PATH + "doublingtimes_sim.csv")
        bd_df = copy.deepcopy(HomePageDataLoader.df_sim)
        bd_rt = copy.deepcopy(HomePageDataLoader.df_rt_sim)
        bd_dt = copy.deepcopy(HomePageDataLoader.bd_dt_sim)

        today = datetime.datetime.today() - datetime.timedelta(days=1)
        today_str = today.strftime("%Y-%m-%d")
        max_limit = today + datetime.timedelta(days=10)
        max_limit_str = max_limit.strftime("%Y-%m-%d")

        bd_rt = bd_rt[bd_rt['Date'] >= today_str]
        bd_rt = bd_rt[bd_rt['Date'] <= max_limit_str]

        bd_dt = bd_dt[bd_dt['date'] >= today_str]
        bd_dt = bd_dt[bd_dt['date'] <= max_limit_str]

        bd_df = bd_df[bd_df['date'] >= today_str]
        bd_df = bd_df[bd_df['date'] <= max_limit_str]

        forcast_data = []

        day = today
        prev_confirmed = -1
        prev_recovered = -1
        prev_deaths = -1
        while(day <= max_limit):
            day_str = day.strftime("%Y-%m-%d")
            bd = bd_df[bd_df['date'] == day_str]
            confirmed = int(bd['confirmed'].iloc[0])
            recovered = int(bd['recovered'].iloc[0])
            deaths = int(bd['deaths'].iloc[0])
            rt = bd_rt[bd_rt['Date'] == day_str]['ML'].iloc[0]
            dt = bd_dt[bd_dt['date'] == day_str]['doublingtimes'].iloc[0]

            print(day, " >> ", confirmed, recovered, deaths, rt, dt)

            if(prev_deaths != -1):
                forcast_data.append({
                    'date': day_str,
                    'confirmedCases': confirmed, 
                    'confirmedDaily': confirmed - prev_confirmed,
                    'recoveredCases': recovered, 
                    'recoveredDaily': recovered - prev_recovered,
                    'deaths': deaths, 
                    'deathsDaily': deaths - prev_deaths,
                    'Rt': rt, 
                    'DT': dt
                })

            day += datetime.timedelta(days = 1)
            prev_confirmed = confirmed
            prev_recovered = recovered
            prev_deaths = deaths

        # forcast_data.reverse()
        HomePageDataLoader.forcast_data = forcast_data 
        return HomePageDataLoader.forcast_data