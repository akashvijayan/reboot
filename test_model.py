# %%
from sklearn.cluster import KMeans
import numpy as np
import requests
import sys

# %%
import pandas as pd

# %%
import pickle
df=pd.read_csv('new_data.csv')
df.head()

# %%
x=df[['EC','CS','ME','EE','CH']]
x.head()
df_names=df[['Name']]
# %%

kmeans = pickle.load(open("finalized_model.sav", "rb"))
y_axis=kmeans.predict(x)
y_axis
# %%
#ploting the clusters
from mpl_toolkits.mplot3d import Axes3D
import matplotlib.pyplot as plt
#fig = plt.figure(figsize=(20,10))
i=0
name=[]
#ax = fig.add_subplot(111, projection='3d')
#ax.scatter(x.iloc[:,0],x.iloc[:,1],x.iloc[:,2], c=y_axis, s=50, cmap='viridis')
#centers = kmeans.cluster_centers_
#ax.scatter(centers[:, 0], centers[:, 1], centers[:, 2],c='black', s=200,alpha=1)
df_list=df_names.values.tolist()
for X, y, z in zip(x.iloc[:,0],x.iloc[:,1],x.iloc[:,2]):
    label = df_list[i][0]
    name.append(label)
    #ax.text(X, y, z, label)
    i=i+1
#plt.show()
# %%
#assigning the team
arr=[]
for _ in range(20):
    arr.append([])


for i,j in zip(y_axis,name):
    arr[(int(i))].append(j)
#print(arr)
#%%
#creating a hashtable
res = {} 
for key,value in zip(y_axis,name): 
    res[value] = key 
res
# %%
for i in arr[res[sys.argv[1]]]:
    print(i)
sys.stdout.flush()
#%%