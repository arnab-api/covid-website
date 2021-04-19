import json
import random
import pandas as pd
import plotly.express as px
import plotly
import plotly.graph_objects as go
import numpy as np
from plotly.subplots import make_subplots
from datetime import datetime, timedelta, timezone

from .BD_MapLoader import BD_MapLoader

class DistrictDataLoader:

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
    this_week = datetime.today() - timedelta(days=1)
    last_week = pd.to_datetime(this_week) - timedelta(days=7)
    next_week = pd.to_datetime(this_week) + timedelta(days=7)
    this_week = this_week.strftime('%Y-%m-%d')
    last_week = last_week.strftime('%Y-%m-%d')
    next_week = next_week.strftime('%Y-%m-%d')
    risk_data = None

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
    def get_risk_data():
        if(DistrictDataLoader.risk_data == None):
            df_risk = pd.read_csv('Data/District/zone_risk_value.csv')
            df_risk = df_risk[['district', 
                                DistrictDataLoader.this_week, 
                                DistrictDataLoader.last_week, 
                                DistrictDataLoader.next_week]]
            risk_data = {}
            this_week = DistrictDataLoader.this_week
            last_week = DistrictDataLoader.last_week
            next_week = DistrictDataLoader.next_week
            for index, row in df_risk.iterrows():
                risk_data[row['district']] = {
                        this_week: row[this_week],
                        last_week: row[last_week],
                        next_week: row[next_week]
                    }
            DistrictDataLoader.risk_data = risk_data

        return DistrictDataLoader.risk_data
    
    @staticmethod
    def get_risk_for(day):
        dist_dict = dist_dict = BD_MapLoader.getDistrictData()
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
                    continue
                dist_name = DistrictDataLoader.get_CSV_districtname(dist)
                obj['value']= round(risk_data[dist_name][day], 2)
                heat_map.append(obj)
        return {
            'date': day,
            'heat_map': heat_map
        }
    
    @staticmethod
    def getRiskMap__present():
        return DistrictDataLoader.get_risk_for(DistrictDataLoader.this_week)

    @staticmethod
    def getRiskMap__past():
        return DistrictDataLoader.get_risk_for(DistrictDataLoader.last_week)
    
    @staticmethod
    def getRiskMap__future():
        return DistrictDataLoader.get_risk_for(DistrictDataLoader.next_week)
    

    @staticmethod
    def loadDistrictData__plot1(district_name):
        df_cases_real = pd.read_csv('Data/District/districts_real.csv')
        df_cases_sim = pd.read_csv('Data/District/districts_sim.csv')

        df_rt_real = pd.read_csv('Data/District/districts_real_rt_gr_dt.csv')
        df_rt_sim = pd.read_csv('Data/District/districts_sim_rt_gr_dt.csv')

        df_cases_real.date = pd.to_datetime(df_cases_real.date)
        df_cases_sim.days_sim = pd.to_datetime(df_cases_sim.days_sim)
        df_rt_real.date = pd.to_datetime(df_rt_real.date)
        df_rt_sim.date = pd.to_datetime(df_rt_sim.date)


        ### select district_name from Bangladesh map by clicking on the district

        df_district_real = df_cases_real[df_cases_real.district == district_name]
        df_district_sim = df_cases_sim[df_cases_sim.district == district_name]
        df_district_rt_real = df_rt_real[df_rt_real.district == district_name]
        df_district_rt_sim = df_rt_sim[df_rt_sim.district == district_name]

        return df_district_real, df_district_sim, df_district_rt_real, df_district_rt_sim

    
    @staticmethod
    def makePlot1__For(district_name):
        df_district_real, df_district_sim, df_district_rt_real, df_district_rt_sim = DistrictDataLoader.loadDistrictData__plot1(district_name)

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
        fig.update_layout(yaxis1=dict(type='log', color='#ff0000'))

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
        fig.update_layout(yaxis2=dict(color='#0000ff'))


        # Add figure title
        fig.update_layout(
            title_text="Cumulative Cases vs Rt >> {}".format(district_name)
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
    def getPlot1__For(district_name):
        print("getting plot 1 data for >> ", district_name)
        csv_name = DistrictDataLoader.get_CSV_districtname(district_name)
        print("{} found in csv file as {}".format(district_name, csv_name))
        return DistrictDataLoader.makePlot1__For(csv_name)


    @staticmethod
    def loadDistrictData__plot2(district_name):
        df_rt_real = pd.read_csv('Data/District/districts_real_rt_gr_dt.csv')
        df_rt_sim = pd.read_csv('Data/District/districts_sim_rt_gr_dt.csv')

        df_rt_real.date = pd.to_datetime(df_rt_real.date)
        df_rt_sim.date = pd.to_datetime(df_rt_sim.date)


        # ### select district_name from Bangladesh map by clicking on the district
        # district_name = 'Dhaka'

        df_district_rt_real = df_rt_real[df_rt_real.district == district_name]
        df_district_rt_sim = df_rt_sim[df_rt_sim.district == district_name]

        return df_district_rt_real, df_district_rt_sim

    
    @staticmethod
    def makePlot2__For(district_name):
        df_district_rt_real, df_district_rt_sim = DistrictDataLoader.loadDistrictData__plot2(district_name)
        fig = make_subplots(specs=[[{"secondary_y": True}]])

        # Add traces
        fig.add_trace(
            go.Scatter(
                x=df_district_rt_real['date'], 
                y=df_district_rt_real['growth_rate_ML'], 
                name="Growth Rate",
                mode='lines+markers',
                line_color='#ff0000'
            ),
            secondary_y=False,
        )
        fig.add_trace(
            go.Scatter(
                x=df_district_rt_sim['date'], 
                y=df_district_rt_sim['growth_rate_ML'], 
                name="Growth Rate SIM",
                mode='lines',
                line_color='#ff0000',
                showlegend=False
            ),
            secondary_y=False,
        )
        fig.update_layout(yaxis1=dict(type='log', color='#ff0000'))

        fig.add_trace(
            go.Scatter(
                x=df_district_rt_real['date'], 
                y=df_district_rt_real['doubling_time_ML'], 
                name="Doubling Time",
                mode='lines+markers',
                line_color='#0000ff',
            ),
            secondary_y=True,
        )
        fig.add_trace(
            go.Scatter(
                x=df_district_rt_sim['date'], 
                y=df_district_rt_sim['doubling_time_ML'], 
                name="Doubling Time SIM",
                mode='lines',
                line_color='#0000ff',
                showlegend=False
            ),
            secondary_y=True,
        )
        fig.update_layout(yaxis2=dict(color='#0000ff'))

        # Add figure title
        fig.update_layout( title_text="Growth Rare vs Doubling Time >> {}".format(district_name) )

        # Set x-axis title
        fig.update_xaxes(title_text="<b>Date</b>")

        # Set y-axes titles
        fig.update_yaxes(title_text="<b>Growth Rate</b>", title_font=dict(color='#ff0000'), secondary_y=False)
        fig.update_yaxes(title_text="<b>Doubling </b>", title_font=dict(color='#0000ff'), secondary_y=True)


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


    df_rt_real = pd.DataFrame()
    df_rt_sim = pd.DataFrame()
    @staticmethod
    def load_rt_files():
        if(DistrictDataLoader.df_rt_real.empty):
            DistrictDataLoader.df_rt_real = pd.read_csv('Data/District/districts_real_rt_gr_dt.csv')
            DistrictDataLoader.df_rt_sim = pd.read_csv('Data/District/districts_sim_rt_gr_dt.csv')

        return DistrictDataLoader.df_rt_real, DistrictDataLoader.df_rt_sim

    @staticmethod
    def get_latest_rt():
        df_rt_real, df_rt_sim = DistrictDataLoader.load_rt_files()

        df_latest = df_rt_real.sort_values(by=['date'], ascending= False)
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
                'Low_90': row['Low_90'],
                'High_90': row['High_90'],
                'district': row['district']
            })
        return rt_latest

    @staticmethod
    def get_rt_before_15():
        rt_latest = DistrictDataLoader.get_latest_rt()
        date_now = datetime.fromisoformat(rt_latest[0]['date'])
        date_15 = date_now - timedelta(days= 15)
        date_15 = date_15.strftime('%Y-%m-%d')

        df_rt_real, df_rt_sim = DistrictDataLoader.load_rt_files()
        df_15 = df_rt_real[df_rt_real['date'] <= date_15].sort_values(by=['date'], ascending= False)
        df_15 = df_15.drop_duplicates('district')

        rt_old = []
        for latest_rt in rt_latest:
            district = latest_rt['district']
            old_rt = df_15[df_15['district'] == district]
            old_rt_json = old_rt[['date','ML','Low_90','High_90', 'district']].to_json(orient="records")
            old_rt_json = json.loads(old_rt_json)
            old_rt_json = old_rt_json[0]
            rt_old.append(old_rt_json)

        return rt_old
    
    @staticmethod
    def get_rt_value():
        df_rt_real, df_rt_sim = DistrictDataLoader.load_rt_files()
        rt_real = []
        for index, row in df_rt_real.iterrows():
            rt_real.append({
                'date': row['date'],
                'ML': row['ML'],
                'Low_90': row['Low_90'],
                'High_90': row['High_90'],
                'district': row['district']
            })
        return rt_real
    
    rt_dict = {}
    @staticmethod
    def load_rt_dictionary():
        if (not DistrictDataLoader.rt_dict):
            print(".... loading rt dictionary")
            df_rt_real, df_rt_sim = DistrictDataLoader.load_rt_files()
            rt_real = {}
            df = df_rt_real.sort_values(by=['date'], ascending= False)
            for index, row in df.iterrows():
                district = row['district']
                if(district not in rt_real):
                    rt_real[district] = []
                rt_real[district].append({
                    'Date': row['date'],
                    'ML': row['ML'],
                    'Low_90': row['Low_90'],
                    'High_90': row['High_90'],
                    'district': row['district']
                })
            DistrictDataLoader.rt_dict = rt_real
        return DistrictDataLoader.rt_dict

    @staticmethod
    def get_rt_value__For(district):
        DistrictDataLoader.load_rt_dictionary()
        return DistrictDataLoader.rt_dict[district]

    
