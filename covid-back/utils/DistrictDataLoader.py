import json
import random
import pandas as pd
import plotly.express as px
import plotly
import plotly.graph_objects as go
import numpy as np
from plotly.subplots import make_subplots
from datetime import datetime, timedelta, timezone
import math
from operator import itemgetter


from .BD_MapLoader import BD_MapLoader

class DistrictDataLoader:

    # DATA_PATH = "Data/CSV_Jan_7_22/"
    # DATA_PATH = "Data/CSV_July_13/"
    DATA_PATH = "/u/erdos/students/mjonyh/CSV/"

    df_cases_real = pd.read_csv(DATA_PATH + 'districts_real.csv')
    df_cases_sim = pd.read_csv(DATA_PATH + 'districts_sim.csv')

    df_real = pd.read_csv(DATA_PATH + 'districts_real_rt_gr_dt.csv')
    df_sim = pd.read_csv(DATA_PATH + 'districts_sim_rt_gr_dt.csv')

    district_real = pd.read_csv(DATA_PATH + "districts_real.csv")
    district_real = district_real.sort_values(by=['date'], ascending= False)
    present = district_real['date'].iloc[0]
    present = datetime.fromisoformat(present)
    past = present - timedelta(days=7)
    future = present + timedelta(days=7)
    present = present.strftime('%Y-%m-%d')
    past = past.strftime('%Y-%m-%d')
    future = future.strftime('%Y-%m-%d')

    csv_districts = ['Nilphamari', 'Chandpur', 'BOGURA', 'Natore', 'Khulna', 'Patuakhali', 'Rangpur', 'Satkhira', 'CUMILLA', 'CHATTOGRAM', 'CHAPAINABABGANJ', 'Lalmonirhat', 'Gaibandha', 'Jhenaidah', 'Dhaka', 'Panchagarh', 'Thakurgaon', 'Habiganj', 'Khagrachhari', 'Sunamganj', 'Joypurhat', 'Kurigram', 'Tangail', 'Sirajganj', 'Rangamati', 'Lakshmipur', 'COXS BAZAR', 'Feni', 'Magura', 'Bagerhat', 'Narail', 'Moulvibazar', 'KISHOREGANJ', 'Noakhali', 'Pabna', 'Rajshahi', 'Sherpur', 'BARISHAL', 'Bandarban', 'Sylhet', 'Bhola', 'Gazipur', 'Naogaon', 'Narsingdi', 'Chuadanga', 'Netrakona', 'Faridpur', 'Manikganj', 'Jamalpur', 'Munshiganj', 'Kushtia', 'Shariatpur', 'Pirojpur', 'Madaripur', 'Gopalganj', 'Jhalokati', 'Dinajpur', 'Barguna', 'Brahmanbaria', 'Meherpur', 'Narayanganj', 'JASHORE', 'Rajbari', 'Mymensingh']
    replace_name_ = {
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
    # this_week = datetime.today() - timedelta(days=1)
    # last_week = pd.to_datetime(this_week) - timedelta(days=7)
    # next_week = pd.to_datetime(this_week) + timedelta(days=7)
    # this_week = this_week.strftime('%Y-%m-%d')
    # last_week = last_week.strftime('%Y-%m-%d')
    # next_week = next_week.strftime('%Y-%m-%d')
    

    @staticmethod
    def get_CSV_districtname(district_name):
        if(district_name in DistrictDataLoader.replace_name_):
            district_name = DistrictDataLoader.replace_name_[district_name]
        if district_name in DistrictDataLoader.csv_districts:
            return district_name
        district_name = district_name[0] + district_name[1:].lower()
        if district_name in DistrictDataLoader.csv_districts:
            return district_name

        return "District Not found"

    @staticmethod
    def get_Map_districtname(district_name):
        for key in DistrictDataLoader.replace_name_:
            if(DistrictDataLoader.replace_name_[key] == district_name):
                return key
        return district_name

    risk_data = None
    @staticmethod
    def get_risk_data():
        if(DistrictDataLoader.risk_data == None):
            df_risk = pd.read_csv(DistrictDataLoader.DATA_PATH + 'zone_risk_value.csv')

            keys = list(df_risk.keys())
            days = keys[1:]

            risk_data = {}
            for index, row in df_risk.iterrows():
                data_obj = {}
                for day in days:
                    value = row[day]
                    if(math.isnan(value)):
                        value = -1
                    data_obj[day] = value
                risk_data[row['district']] = data_obj

            DistrictDataLoader.risk_data = risk_data

        return DistrictDataLoader.risk_data

    risk_data_formulae = None
    @staticmethod
    def get_risk_data_formulae():
        if(DistrictDataLoader.risk_data_formulae == None):
            df_risk = pd.read_csv(DistrictDataLoader.DATA_PATH + 'zone_risk_value_formulae.csv')

            keys = list(df_risk.keys())
            days = keys[1:]

            risk_data = {}
            for index, row in df_risk.iterrows():
                data_obj = {}
                for day in days:
                    value = row[day]
                    if(math.isnan(value)):
                        value = -1
                    data_obj[day] = value
                risk_data[row['district']] = data_obj

            DistrictDataLoader.risk_data_formulae = risk_data

        return DistrictDataLoader.risk_data_formulae


    @staticmethod
    def loadConfirmedCases__for(district, day):
        print(district, day)
        df = DistrictDataLoader.district_real[DistrictDataLoader.district_real['district'] == district]
        # df = df[df['date'] == day]
        return int(df['confirmed'].iloc[0])
    
    @staticmethod
    def get_risk_for(day, formulae = False):
        dist_dict = BD_MapLoader.getDistrictData()
        if(formulae == True):
            risk_data = DistrictDataLoader.get_risk_data_formulae()
        else:
            risk_data = DistrictDataLoader.get_risk_data()
        heat_map = []
        for dist in dist_dict:
            for _id in dist_dict[dist]:
                obj = {
                    'id': _id,
                    'dist': dist,
                }
                if dist == 'Indian Chhitmahal in Bangladesh':
                    obj['value'] = 0
                else:
                    dist_name = DistrictDataLoader.get_CSV_districtname(dist)
                    obj['value']= round(risk_data[dist_name][day], 2)
                    if(day == DistrictDataLoader.present):
                        obj['confirmed'] = DistrictDataLoader.loadConfirmedCases__for(dist_name, day)
                heat_map.append(obj)

        heat_map = sorted(heat_map, key=itemgetter("value"), reverse=True)
        for i in range(len(heat_map)):
            heat_map[i]['rank'] = i+1
        return {
            'date': day,
            'heat_map': heat_map
        }

    bd_risk_arr = []
    @staticmethod
    def getRiskMap__Array():
        if(len(DistrictDataLoader.bd_risk_arr) == 0):
            print("Risk array not yet loaded >> loading data")
            day = datetime.fromisoformat(DistrictDataLoader.present)
            limit = 107
            bd_risk_arr = []
            while(limit > 0):
                day_iso = day.strftime('%Y-%m-%d')
                print("loading bd risk data for >> ", day_iso)
                bd_risk_arr.append(DistrictDataLoader.get_risk_for(day_iso))
                day = day - timedelta(days=1)
                limit -= 1
            DistrictDataLoader.bd_risk_arr = bd_risk_arr

        return DistrictDataLoader.bd_risk_arr[::-1]

    bd_risk_arr_formulae = []
    @staticmethod
    def getRiskMap_formulae__Array():
        if(len(DistrictDataLoader.bd_risk_arr_formulae) == 0):
            print("<FORMULAE> Risk array not yet loaded >> loading data")
            day = datetime.fromisoformat(DistrictDataLoader.present)
            limit = 107
            bd_risk_arr = []
            while(limit > 0):
                day_iso = day.strftime('%Y-%m-%d')
                print("<FORMULAE> loading bd risk data for >> ", day_iso)
                bd_risk_arr.append(DistrictDataLoader.get_risk_for(day_iso, formulae=True))
                day = day - timedelta(days=1)
                limit -= 1
            DistrictDataLoader.bd_risk_arr_formulae = bd_risk_arr

        return DistrictDataLoader.bd_risk_arr_formulae[::-1]

    rt_json = None
    @staticmethod
    def getRtMap__Array():
        if(DistrictDataLoader.rt_json != None):
            print("District-wise Rt data is already loaded -- returning cached value")
            return DistrictDataLoader.rt_json
        dist_2_id = BD_MapLoader.getDistrictData()
        # df_rt = DistrictDataLoader.df_real
        df_rt = pd.read_csv(DistrictDataLoader.DATA_PATH + "/districts_real_rt_gr_dt.csv")
        rt_date = {}
        print(df_rt.shape)
        for index, row in df_rt.iterrows():
            date = row['date']
            # print(" >>>>> ", date)
            if(date not in rt_date):
                rt_date[date] = []
            district = DistrictDataLoader.get_Map_districtname(row['district'].upper())
            ids = dist_2_id[district]
            for _id in ids:
                rt_date[date].append({
                    "dist" : district,
                    "id"   : _id,
                    "value": row["ML"]
                })
        
        # return rt_date
        rt_json = []
        for date in rt_date:
            rt_json.append({
                "date": date,
                "heat_map": rt_date[date]
            })

        
        DistrictDataLoader.rt_json = sorted(rt_json, key=itemgetter('date'), reverse=False)[-107:]
        return DistrictDataLoader.rt_json

    pop_dist = None
    @staticmethod
    def getPopulationDistribution():
        if(DistrictDataLoader.pop_dist != None):
            return DistrictDataLoader.pop_dist
        pop_mod = pd.read_csv("Data/district_population_modified.csv")
        pop_dist = {}

        for index, row in pop_mod.iterrows():
            dist = row['Name']
            pop = row["Population\nProjection (P)\n2016-03-15"]
            pop = int(pop.replace(",", ""))
            pop_dist[dist] = pop

        DistrictDataLoader.pop_dist = pop_dist
        return DistrictDataLoader.pop_dist

    daily_json = None
    @staticmethod
    def getDailyCasesMap__Array():
        if(DistrictDataLoader.daily_json != None):
            print("District-wise Confirmed data is already loaded -- returning cached value")
            return DistrictDataLoader.daily_json
        dist_2_id = BD_MapLoader.getDistrictData()

        df_confirmed = pd.read_csv(DistrictDataLoader.DATA_PATH + "districts_real.csv")
        df_confirmed['daily_cases'] = df_confirmed['confirmed'].diff()
        confirmed_date = {}

        pop_dist = DistrictDataLoader.getPopulationDistribution()

        for index, row in df_confirmed.iterrows():
            date = row['date']
            if(date not in confirmed_date):
                confirmed_date[date] = []
            pop = pop_dist[row['district']]
            district = DistrictDataLoader.get_Map_districtname(row['district'].upper())
            ids = dist_2_id[district]
            value = row["daily_cases"]
            if(math.isnan(value)):
                continue
            for _id in ids:
                confirmed_date[date].append({
                    "dist" : district,
                    "id"   : _id,
                    "value": round(int(max(row["daily_cases"], 0))*100*1000/pop, 2)
                })
        
        confirmed_json = []
        for date in confirmed_date:
            confirmed_json.append({
                "date": date,
                "heat_map": confirmed_date[date]
            })

        
        DistrictDataLoader.daily_json = sorted(confirmed_json, key=itemgetter('date'), reverse=False)[-107:]
        return DistrictDataLoader.daily_json


    @staticmethod
    def formatDate(date_time_str):
        date_time_obj = datetime.strptime(date_time_str, '%m/%d/%Y')
        return date_time_obj.strftime("%Y-%m-%d")

    tpr_json = None
    @staticmethod
    def getTPRMap__Array():
        if(DistrictDataLoader.tpr_json != None):
            print("District-wise Test positive rate heatmap is already loaded -- returning cached value")
            return DistrictDataLoader.tpr_json
        dist_2_id = BD_MapLoader.getDistrictData()
        df = pd.read_csv("Data/bd_daily_cases_2021-06-22.csv")

        tpr_date = {}

        dist_cases = {}
        dist_tests = {}


        for index, row in df.iterrows():
            date = DistrictDataLoader.formatDate(row["test_date"])
            if(date not in tpr_date):
                tpr_date[date] = []
            district = row['district']
            if(isinstance(district, str) == False):
                continue
            
            district = DistrictDataLoader.get_Map_districtname(district.upper())

            if(district not in dist_cases):
                dist_cases[district] = []
                dist_tests[district] = []

            total_tests = row['tests_combined']
            total_cases = row['cases_combined']

            dist_cases[district].append(total_cases)
            dist_tests[district].append(total_tests)

            sum_cases = sum(dist_cases[district][-7:])
            sum_tests = sum(dist_tests[district][-7:])

            ids = dist_2_id[district]
            cur_value = 0
            if(total_tests != 0):
                cur_value = round(total_cases*100/total_tests, 2)
            value = 0 
            if(sum_tests != 0):
                value = round(sum_cases*100/sum_tests, 2)
            for _id in ids:
                tpr_date[date].append({
                    "dist" : district,
                    "id"   : _id,
                    "value": value,
                    "cur_value": cur_value,
                    "daily_cases": total_cases,
                    "daily_tests": total_tests
                })

        max_date = DistrictDataLoader.getDailyCasesMap__Array()[-1]['date']
        tpr_json = []
        for date in tpr_date:
            if(date > max_date):
                break
            tpr_json.append({
                'date': date,
                'heat_map': tpr_date[date]
            })    
        
        DistrictDataLoader.tpr_json = sorted(tpr_json, key=itemgetter('date'), reverse=False)[-107:]
        return DistrictDataLoader.tpr_json
    
    @staticmethod
    def getRiskMap__present():
        return DistrictDataLoader.get_risk_for(DistrictDataLoader.present)

    @staticmethod
    def getRiskMap__past():
        return DistrictDataLoader.get_risk_for(DistrictDataLoader.past)
    
    @staticmethod
    def getRiskMap__future():
        return DistrictDataLoader.get_risk_for(DistrictDataLoader.future)
    

    @staticmethod
    def loadDistrictData__plot1(district_name):
        df_cases_real = pd.read_csv(DistrictDataLoader.DATA_PATH + 'districts_real.csv')
        df_cases_sim = pd.read_csv(DistrictDataLoader.DATA_PATH + 'districts_sim.csv')

        df_real = pd.read_csv(DistrictDataLoader.DATA_PATH + 'districts_real_rt_gr_dt.csv')
        df_sim = pd.read_csv(DistrictDataLoader.DATA_PATH + 'districts_sim_rt_gr_dt.csv')

        df_cases_real.date = pd.to_datetime(df_cases_real.date)
        df_cases_sim.days_sim = pd.to_datetime(df_cases_sim.days_sim)
        df_real.date = pd.to_datetime(df_real.date)
        df_sim.date = pd.to_datetime(df_sim.date)


        ### select district_name from Bangladesh map by clicking on the district

        df_district_real = df_cases_real[df_cases_real.district == district_name]
        df_district_sim = df_cases_sim[df_cases_sim.district == district_name]
        df_district_rt_real = df_real[df_real.district == district_name]
        df_district_rt_sim = df_sim[df_sim.district == district_name]

        df_district_real['daily cases'] = df_district_real['confirmed'].diff()
        df_district_sim['daily cases'] = df_district_sim['confirmed_sim'].diff()

        return df_district_real, df_district_sim, df_district_rt_real, df_district_rt_sim

    @staticmethod
    def loadDistrictData__plot2(district_name):
        df_real = pd.read_csv(DistrictDataLoader.DATA_PATH + 'districts_real_rt_gr_dt.csv')
        df_sim = pd.read_csv(DistrictDataLoader.DATA_PATH + 'districts_sim_rt_gr_dt.csv')

        df_real.date = pd.to_datetime(df_real.date)
        df_sim.date = pd.to_datetime(df_sim.date)


        # ### select district_name from Bangladesh map by clicking on the district
        # district_name = 'Dhaka'

        df_district_rt_real = df_real[df_real.district == district_name]
        df_district_rt_sim = df_sim[df_sim.district == district_name]

        return df_district_rt_real, df_district_rt_sim

    
    @staticmethod
    def makePlot1__For(district_name):
        df_district_real, df_district_sim, df_district_rt_real, df_district_rt_sim = DistrictDataLoader.loadDistrictData__plot1(district_name)

        fig = make_subplots(specs=[[{"secondary_y": True}]])
        cumulative_cases_color = '#ff8080'
        # Add traces
        fig.add_trace(
            go.Scatter(
                x=df_district_real['date'], 
                y=df_district_real['daily cases'], 
                name="Daily Cases",
                mode='lines+markers',
                line_color=cumulative_cases_color
            ),
            secondary_y=False,
        )
        fig.add_trace(
            go.Scatter(
                x=df_district_sim['days_sim'], 
                y=df_district_sim['daily cases'], 
                name="Daily Cases SIM",
                mode='lines',
                line_color=cumulative_cases_color,
                showlegend=False
            ),
            secondary_y=False,
        )
        # fig.update_layout(yaxis1=dict(type='log', color=cumulative_cases_color))
        fig.update_layout(yaxis1=dict(color=cumulative_cases_color))

        rt_color = '#8080ff'
        fig.add_trace(
            go.Scatter(
                x=df_district_rt_real.date, 
                y=df_district_rt_real.ML, 
                name="Rt",
                mode='lines+markers',
                line_color=rt_color
            ),
            secondary_y=True,
        )

        fig.add_trace(
            go.Scatter(
                x=df_district_rt_sim.date, 
                y=df_district_rt_sim.High_90, 
                name="Rt_hi",
                mode='lines',
                line_color=rt_color,
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
        fig.update_layout(yaxis2=dict(color=rt_color))


        # Add figure title
        fig.update_layout(
            title_text="Daily Cases vs Rt >> {}".format(district_name),
            font=dict(
                # family="Courier New, monospace",
                size=8,
                # color="RebeccaPurple"
            )
        )

        # Set x-axis title
        fig.update_xaxes(title_text="<b>Date</b>")

        # Set y-axes titles
        fig.update_yaxes(title_text="<b>Daily Cases</b>", secondary_y=False)
        fig.update_yaxes(title_text="<b>Rt</b>", secondary_y=True)
        fig.update_yaxes(range=[0, 3], secondary_y=True)

        fig.add_hline(
            y=1, 
            line_color="blue",
            secondary_y=True,
        )
        fig.add_annotation(
            x = 1.02,
            y=1,
            showarrow=False,
            text="<i>"+"Rt=1"+"</i>",
            textangle=0,
            xref="paper",
            yref="y2",
            font=dict(
                # family="Courier New, monospace",
                size=10,
                color="rgba(0, 0, 255, 1)"
            ),
        )

        # fig.update_layout(
        #     autosize=False,
        #     width=850,
        #     height=400,
        # )

        fig.update_layout(legend=dict(
            orientation="h",
            yanchor="bottom",
            y=1.02,
            xanchor="right",
            x=1,
            font=dict(
                size=10,
            )
        ))

        fig.update_layout(
            margin=dict(l=10, r=10, t=10, b=10),
            # paper_bgcolor="LightSteelBlue",
        )

        graphs = [fig]
        graphJSON = json.dumps(graphs, cls=plotly.utils.PlotlyJSONEncoder)

        return graphJSON

    @staticmethod
    def getPlot1__For(district_name):
        print("getting plot 1 data for >> ", district_name)
        csv_name = DistrictDataLoader.get_CSV_districtname(district_name)
        print("{} found in csv file as {}".format(district_name, csv_name))
        return DistrictDataLoader.makePlot1__For(csv_name)

    
    @staticmethod
    def makePlot2__For(district_name):
        df_district_rt_real, df_district_rt_sim = DistrictDataLoader.loadDistrictData__plot2(district_name)
        fig = make_subplots(specs=[[{"secondary_y": True}]])
        growth_rate_color = '#ff8080'

        # Add traces
        fig.add_trace(
            go.Scatter(
                x=df_district_rt_real['date'], 
                y=df_district_rt_real['growth_rate_ML'], 
                name="Growth Rate",
                mode='lines+markers',
                line_color=growth_rate_color
            ),
            secondary_y=False,
        )
        fig.add_trace(
            go.Scatter(
                x=df_district_rt_sim['date'], 
                y=df_district_rt_sim['growth_rate_ML'], 
                name="Growth Rate SIM",
                mode='lines',
                line_color=growth_rate_color,
                showlegend=False
            ),
            secondary_y=False,
        )
        fig.update_layout(yaxis1=dict(type='log', color=growth_rate_color))
        
        doubling_time_color = '#8080ff'
        fig.add_trace(
            go.Scatter(
                x=df_district_rt_real['date'], 
                y=df_district_rt_real['doubling_time_ML'], 
                name="Doubling Time",
                mode='lines+markers',
                line_color=doubling_time_color,
            ),
            secondary_y=True,
        )
        fig.add_trace(
            go.Scatter(
                x=df_district_rt_sim['date'], 
                y=df_district_rt_sim['doubling_time_ML'], 
                name="Doubling Time SIM",
                mode='lines',
                line_color=doubling_time_color,
                showlegend=False
            ),
            secondary_y=True,
        )
        fig.update_layout(yaxis2=dict(color=doubling_time_color))

        # Add figure title
        fig.update_layout( 
            title_text="Growth Rare vs Doubling Time >> {}".format(district_name),
            font=dict(
                # family="Courier New, monospace",
                size=8,
                # color="RebeccaPurple"
            )
        )

        # Set x-axis title
        fig.update_xaxes(title_text="<b>Date</b>")

        # Set y-axes titles
        fig.update_yaxes(title_text="<b>Growth Rate</b>", title_font=dict(color=growth_rate_color), secondary_y=False)
        fig.update_yaxes(title_text="<b>Doubling </b>", title_font=dict(color=doubling_time_color), secondary_y=True)


        # fig.update_layout(
        #     autosize=False,
        #     width=850,
        #     height=400,
        # )

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
    def getPlot2__For(district_name):
        print("getting plot 2 data for >> ", district_name)
        csv_name = DistrictDataLoader.get_CSV_districtname(district_name)
        print("{} found in csv file as {}".format(district_name, csv_name))
        return DistrictDataLoader.makePlot2__For(csv_name)


    @staticmethod
    def dateISO_2_UTC(date):
        date = datetime.fromisoformat(date)
        timestamp = date.replace(tzinfo=timezone.utc).timestamp()
        return timestamp


    df_real = pd.DataFrame()
    df_sim = pd.DataFrame()
    @staticmethod
    def load_rt_dt_gr_files():
        if(DistrictDataLoader.df_real.empty):
            DistrictDataLoader.df_real = pd.read_csv(DistrictDataLoader.DATA_PATH + 'districts_real_rt_gr_dt.csv')
            DistrictDataLoader.df_sim = pd.read_csv(DistrictDataLoader.DATA_PATH + 'districts_sim_rt_gr_dt.csv')

        return DistrictDataLoader.df_real, DistrictDataLoader.df_sim

    @staticmethod
    def get_latest_rt():
        df_real, df_sim = DistrictDataLoader.load_rt_dt_gr_files()

        df_latest = df_real.sort_values(by=['date'], ascending= False)
        df_latest = df_latest.drop_duplicates('district')
        df_latest = df_latest.sort_values(by=['ML'], ascending= False)
        rt_latest = []
        for index, row in df_latest.iterrows():
            date = row['date'].split("-")
            date_obj = {
                'year': date[0],
                'month': date[1],
                'day': date[2]
            }
            rt_latest.append({
                'date': row['date'],
                'ML': row['ML'],
                # 'Low_90': row['Low_90'],
                # 'High_90': row['High_90'] - row['Low_90'],
                'Low_90': row['ML']*.85,
                'High_90': row['ML']*1.15 - row['ML']*.85,
                'district': row['district']
            })
        return rt_latest
    
    @staticmethod
    def get_rt_value():
        df_real, df_sim = DistrictDataLoader.load_rt_dt_gr_files()
        rt_real = []
        for index, row in df_real.iterrows():
            rt_real.append({
                'date': row['date'],
                'ML': row['ML'],
                # 'Low_90': row['Low_90'],
                # 'High_90': row['High_90'],
                'Low_90': row['ML']*.85,
                'High_90': row['ML']*1.15,
                'district': row['district']
            })
        return rt_real
    
    rt_dict = {}
    @staticmethod
    def load_rt_dictionary():
        if (not DistrictDataLoader.rt_dict):
            print(".... loading rt dictionary")
            df_real, df_sim = DistrictDataLoader.load_rt_dt_gr_files()
            rt_real = {}
            df = df_real.sort_values(by=['date'], ascending= False)
            for index, row in df.iterrows():
                district = row['district']
                if(district not in rt_real):
                    rt_real[district] = []
                rt_real[district].append({
                    'Date': row['date'],
                    'ML': row['ML'],
                    # 'Low_90': row['Low_90'],
                    # 'High_90': row['High_90'],
                    'Low_90': row['ML']*.85,
                    'High_90': row['ML']*1.15,
                    'district': row['district']
                })
            DistrictDataLoader.rt_dict = rt_real
        return DistrictDataLoader.rt_dict

    @staticmethod
    def get_rt_value__For(district):
        DistrictDataLoader.load_rt_dictionary()
        return DistrictDataLoader.rt_dict[district][0::7]

    @staticmethod
    def get_rt_before_15():
        DistrictDataLoader.load_rt_dictionary()
        latest_rt = DistrictDataLoader.get_latest_rt()

        date_now = datetime.fromisoformat(latest_rt[0]['date'])
        date_15 = date_now - timedelta(days= 15)
        date_15 = date_15.strftime('%Y-%m-%d')

        rt_15 = []
        for rt_latest in latest_rt:
            district = rt_latest['district']
            found = False
            for rt_val in DistrictDataLoader.rt_dict[district]:
                if(rt_val['Date'] <= date_15):
                    rt_15.append({
                        'date': rt_val['Date'],
                        'district': rt_val['district'],
                        'ML': rt_val['ML'],
                        # 'Low_90': rt_val['Low_90'],
                        # 'High_90': rt_val['High_90'] - rt_val['Low_90']
                        'Low_90': rt_val['ML']*.85,
                        'High_90': rt_val['ML']*1.15 - rt_val['ML']*.85,
                    })
                    found = True
                    break
        return rt_15

    dt_dict = {}
    @staticmethod
    def load_dt_dictionary():
        if (not DistrictDataLoader.dt_dict):
            print(".... loading doubling dictionary")
            df_real, df_sim = DistrictDataLoader.load_rt_dt_gr_files()
            doubling_time = {}
            df = df_real.sort_values(by=['date'], ascending= False)
            for index, row in df.iterrows():
                district = row['district']
                if(district not in doubling_time):
                    doubling_time[district] = []
                value = row['doubling_time_ML']
                if(math.isnan(value)):
                    value = 0
                doubling_time[district].append({
                    'Date': row['date'],
                    'doubling_time': value,
                    'district': row['district']
                })

            DistrictDataLoader.dt_dict = doubling_time
        return DistrictDataLoader.dt_dict

    @staticmethod
    def get_dt_value__For(district):
        DistrictDataLoader.load_dt_dictionary()
        return DistrictDataLoader.dt_dict[district][0::7]
    
    @staticmethod
    def get_latest_dt():
        DistrictDataLoader.load_dt_dictionary()
        latest_dt = []
        for district in DistrictDataLoader.dt_dict:
            latest_dt.append(DistrictDataLoader.dt_dict[district][0])
        latest_dt = sorted(latest_dt, key=itemgetter('doubling_time'), reverse=True)
        return latest_dt

    @staticmethod
    def get_dt_before_15():
        DistrictDataLoader.load_dt_dictionary()
        latest_dt = DistrictDataLoader.get_latest_dt()

        date_now = datetime.fromisoformat(latest_dt[0]['Date'])
        date_15 = date_now - timedelta(days= 15)
        date_15 = date_15.strftime('%Y-%m-%d')

        dt_15 = []
        for dt_latest in latest_dt:
            district = dt_latest['district']
            found = False
            for dt_val in DistrictDataLoader.dt_dict[district]:
                if(dt_val['Date'] <= date_15):
                    dt_15.append(dt_val)
                    found = True
                    break
        return dt_15
    
    @staticmethod
    def getForcastTable__For(district_name):

        print(" >> loading forcast table for >> ", district_name)
        csv_name = DistrictDataLoader.get_CSV_districtname(district_name)
        print(" {} found in csv as {} ".format(district_name, csv_name))
        district_name = csv_name

        df_district_real, df_district_sim, df_district_rt_real, df_district_rt_sim = DistrictDataLoader.loadDistrictData__plot1(district_name)
        
        today = datetime.today()
        today_str = today.strftime("%Y-%m-%d")
        max_limit = today + timedelta(days=10)
        max_limit_str = max_limit.strftime("%Y-%m-%d")


        forcast_data = []


        day = today
        while(day < max_limit):
            day_str = day.strftime("%Y-%m-%d")
            # print(day_str)
            try:
                df_sim = df_district_sim[df_district_sim['days_sim'] == day_str]
                confirmed = df_sim['confirmed_sim'].iloc[0]
                confirmedDaily = int(df_sim['daily cases'].iloc[0])

                df_rt_sim = df_district_rt_sim[df_district_rt_sim['date'] == day_str]
                rt = df_rt_sim['ML'].iloc[0]
                dt = df_rt_sim['doubling_time_ML'].iloc[0]
            except:
                print("could not get data for {} --- index error >> returning data".format(day_str))
                break
            
            forcast_data.append({
                'day': day_str,
                'confirmed': int(confirmed),
                'confirmedDaily': int(confirmedDaily),
                'rt': round(rt, 2),
                'dt': round(dt, 2)
            })
            day += timedelta(days = 1)

        return forcast_data


    colors = ['#54b45f', '#ecd424', '#f88c51', '#c01a27']
    level_arr = [1, 9, 24, 1000]
    zone_label = ['Trivial', 'Community', 'Accelerated', 'Tipping']
    zone_risk_df = pd.read_csv(DATA_PATH + 'zone_risk_value.csv')

    
    @staticmethod
    def getZoneRisk__For(district_name):

        print("loading zone risk plot for >> ", district_name)
        district = DistrictDataLoader.get_CSV_districtname(district_name)
        print("{} found in csv as {}".format(district_name, district))


        df_dist = DistrictDataLoader.zone_risk_df[DistrictDataLoader.zone_risk_df['district'] == district]
        dates =  list(df_dist.keys())[1:]
        if(DistrictDataLoader.present in dates):
            dates = dates[0:dates.index(DistrictDataLoader.present)]

        x_dates = []
        risk_values = []
        for date in dates:
            # print(date, df_dist.iloc[0][date])
            x_dates.append(date)
            risk_values.append(df_dist.iloc[0][date])

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
            y=1,
            xanchor="right",
            x=1,
            font=dict(
                size=10,
            )
        ))
        fig.update_yaxes(title_text="<b>Risk Value</b>")
        fig.update_layout(
            title_text="Zone risk timeline >> {}".format(district),
            font=dict(
                size=8,
            )
        )

        fig.update_layout(
            margin=dict(l=10, r=10, t=25, b=10),
            # paper_bgcolor="LightSteelBlue",
        )

        graphs = [fig]
        graphJSON = json.dumps(graphs, cls=plotly.utils.PlotlyJSONEncoder)
        return graphJSON

