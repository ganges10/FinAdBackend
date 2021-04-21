import numpy as np
import pandas as pd
from datetime import datetime
from yahoofinancials import YahooFinancials
import pickle
import joblib



end_date= datetime.strftime(datetime.today(),'%Y-%m-%d')
start_date = "2020-01-02"
date_range = pd.bdate_range(start=start_date,end=end_date)
values = pd.DataFrame({ 'Date': date_range})
values['Date']= pd.to_datetime(values['Date'])

#print(values.head())

symbol =['GC=F', 'SI=F', 'CL=F', '^GSPC', '^RUT', 'ZN=F', 'ZT=F', 'PL=F', 'HG=F', 'DX=F', '^VIX', 'EEM', 'EURUSD=X', '^N100','^IXIC']
names = ['Gold', 'Silver', 'Crude Oil', 'S&P500', 'Russel 2000 Index', '10 Yr US T-Note futures', '2 Yr US T-Note Futures', 'Platinum', 'Copper', 'Dollar Index', 'Volatility Index','MSCI EM ETF', 'Euro USD', 'Euronext100', 'Nasdaq']


#Preparing Date Range
end_date= datetime.strftime(datetime.today(),'%Y-%m-%d')
start_date = "2020-01-02"
date_range = pd.bdate_range(start=start_date,end=end_date)
values = pd.DataFrame({ 'Date': date_range})
values['Date']= pd.to_datetime(values['Date'])


for i in range(len(symbol)):
    yahoo_data = YahooFinancials(symbol[i])
    yahoo_data = yahoo_data.get_historical_price_data(start_date, end_date, "daily")
    df = pd.DataFrame(yahoo_data[symbol[i]]['prices'])[['formatted_date','adjclose']]
    df.columns = ['Date_temp',names[i]]
    df['Date_temp']= pd.to_datetime(df['Date_temp'])
    values = values.merge(df,how='left',left_on='Date',right_on='Date_temp')
    values = values.drop(labels='Date_temp',axis=1)

values = values.fillna(method="ffill",axis=0)
values = values.fillna(method="bfill",axis=0)

Gold = values['Gold'].values.tolist()

cols=values.columns.drop('Date')
values[cols] = values[cols].apply(pd.to_numeric,errors='coerce').round(decimals=1)
imp = ['Gold','Silver', 'Crude Oil', 'S&P500','MSCI EM ETF']

change_days = [1,3,5,14,21]
data = pd.DataFrame(data=values['Date'])
for i in change_days:
    x= values[cols].pct_change(periods=i).add_suffix("-T-"+str(i))
    data=pd.concat(objs=(data,x),axis=1)
    x=[]
    
# Calculating Long term Historical Returns
change_days = [60,90,180,250]
for i in change_days:
    x= values[imp].pct_change(periods=i).add_suffix("-T-"+str(i))
    data=pd.concat(objs=(data,x),axis=1)
    x=[]

#Calculating Moving averages for smoothing
moving_avg = pd.DataFrame(values['Date'],columns=['Date'])
moving_avg['Date']=pd.to_datetime(moving_avg['Date'],format='%Y-%b-%d')
moving_avg['Gold/15SMA'] = (values['Gold']/(values['Gold'].rolling(window=15).mean()))-1
moving_avg['Gold/30SMA'] = (values['Gold']/(values['Gold'].rolling(window=30).mean()))-1
moving_avg['Gold/60SMA'] = (values['Gold']/(values['Gold'].rolling(window=60).mean()))-1
moving_avg['Gold/90SMA'] = (values['Gold']/(values['Gold'].rolling(window=90).mean()))-1
moving_avg['Gold/180SMA'] = (values['Gold']/(values['Gold'].rolling(window=180).mean()))-1
moving_avg['Gold/90EMA'] = (values['Gold']/(values['Gold'].ewm(span=90,adjust=True,ignore_na=True).mean()))-1
moving_avg['Gold/180EMA'] = (values['Gold']/(values['Gold'].ewm(span=180,adjust=True,ignore_na=True).mean()))-1
moving_avg = moving_avg.dropna(axis=0)

#Merging Moving Average values to the feature space
data['Date']=pd.to_datetime(data['Date'],format='%Y-%b-%d')
data = pd.merge(left=data,right=moving_avg,how='left',on='Date')
data = data[data['Gold-T-250'].notna()]
data['Date']=data['Date'].map(datetime.toordinal)
prediction_data = data.copy()
#print(prediction_data.shape)

loaded_model = joblib.load("model.pkl")
result = loaded_model.predict(prediction_data.values.tolist())
predicted_value = []
for i in range(len(result)-21,len(result)):
    predicted_value.append((Gold[i]*(1+result[i])).round(decimals =1))

print(*predicted_value)


