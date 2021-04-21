from mftool import Mftool
import pandas as pd
obj= Mftool()


symbol = ['120828','119598','125497','118758','118759','135808','135811','119277','118564','120069','100967','119133','123654','147587','147591','145819','147481','138311','147704']
#print(symbol)

scheme_name=[]
nav=[]
for key in symbol:
  data = obj.get_scheme_quote(key)
  if(data is not None):
    scheme_name.append(data['scheme_name'])
    nav.append(data['nav'])

data_tuples = list(zip(scheme_name,nav))

df=pd.DataFrame(data_tuples, columns=['Scheme','NAV'])
df=df.sort_values('NAV',ascending=False)
print(df.head().values.tolist())