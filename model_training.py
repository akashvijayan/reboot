# %%



from sklearn.cluster import KMeans
import numpy as np
import pickle
import sys
# %%
import pandas as pd

# %%

import csv   
fields=[sys.argv[1],'10','8','7','6','5']
with open('new_data.csv', 'a') as f:
    writer = csv.writer(f)
    writer.writerow(fields)
df=pd.read_csv('new_data.csv')
df.tail(100)

# %%
x=df[['EC','CS','ME','EE','CH']]
x.head()

# %%
#creating a cluster
kmeans5 = KMeans(n_clusters=20)
kmeans5.fit(x)
filename ='finalized_model.sav'
pickle.dump(kmeans5, open(filename, 'wb'))
y_kmeans5=kmeans5.predict(x)
#print(y_kmeans5)
kmeans5.cluster_centers_
#pickle.dump(kmeans5, open(r"C:\Users\HP\Documents\programming\python\save.pkl", "wb"))
# %%
#finding the number of clusters
# Error =[]
# for i in range(1, 11):
#     kmeans = KMeans(n_clusters = i).fit(x)
#     kmeans.fit(x)
#     Error.append(kmeans.inertia_)
import matplotlib.pyplot as plt
# plt.plot(range(1, 11), Error)
# plt.title('Elbow method')
# plt.xlabel('No of clusters')
# plt.ylabel('Error')
# plt.show()

# %%
#2d plot
#plt.scatter(x.iloc[:,0], x.iloc[:,1], c=y_kmeans5, s=50, cmap='viridis')
#centers = kmeans5.cluster_centers_
#plt.scatter(centers[:, 0], centers[:, 1],c='black', s=200, alpha=0.5)

#%%
df_names=df[['Name']]
df_names
# %%
#ploting the clusters
from mpl_toolkits.mplot3d import Axes3D
import matplotlib.pyplot as plt
#fig = plt.figure(figsize=(20,10))
i=0
name=[]
#ax = fig.add_subplot(111, projection='3d')
#ax.scatter(x.iloc[:,0],x.iloc[:,1],x.iloc[:,2], c=y_kmeans5, s=50, cmap='viridis')
#centers = kmeans5.cluster_centers_
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


for i,j in zip(y_kmeans5,name):
    arr[(int(i))].append(j)
#print(arr)
#%%
#creating a hashtable
res = {} 
for key,value in zip(y_kmeans5,name): 
    res[value] = key 
res
# %%
for i in arr[res[sys.argv[1]]]:
    print(i)
rec={ 
groupMembers : arr
} 
sys.stdout.flush()
# %%