import json
import random
import pandas as pd
import plotly.express as px
import plotly
import plotly.graph_objects as go
import numpy as np
from plotly.subplots import make_subplots

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

    def getPlot2__For(district_name):
        print("getting plot 2 data for >> ", district_name)
        csv_name = DistrictDataLoader.get_CSV_districtname(district_name)
        print("{} found in csv file as {}".format(district_name, csv_name))
        return DistrictDataLoader.makePlot2__For(csv_name)