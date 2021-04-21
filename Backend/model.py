import numpy as np
import pandas as pd
from datetime import datetime
from sklearn.ensemble import ExtraTreesRegressor
from sklearn.neighbors import KNeighborsRegressor
from sklearn.ensemble import StackingRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline
from sklearn.linear_model import LogisticRegression
import pickle
import joblib


data = pd.read_csv("trainingData.csv")
#print(data.head())

data_22= data.drop(['Gold-T+14','Soybean-T-1','Soybean-T-3','Soybean-T-5','Soybean-T-14','Soybean-T-21'],axis=1)
X= data_22.drop(['Gold-T+22','Date'],1)
y= data_22['Gold-T+22']

et = ExtraTreesRegressor(n_estimators=100, random_state=0)
knn = KNeighborsRegressor()

estimators = [('et', et),('svr', make_pipeline(StandardScaler(),knn))]
clf = StackingRegressor(estimators=estimators)
final_model=clf.fit(X, y)
joblib.dump(final_model, "model.pkl")
#pickle.dump(final_model, open(filename, 'wb'))

