import pandas as pd
import numpy as np
import time
import datetime

busData = pd.read_csv('./Chicago_Traffic_Tracker_-_Historical_Congestion_Estimates_by_Segment_-_2011-2018.csv')
segmentData = pd.read_csv('./Chicago_Traffic_Tracker_-_Congestion_Estimates_by_Segments.csv')

finalData = pd.merge(busData, segmentData, on='SEGMENTID')

# cleanup col headers
finalData.columns = finalData.columns.str.strip()
# remove nothing doto
removedNoBus = finalData[finalData['BUS COUNT']>0]
# remove more bad doto
removedBadTime = removedNoBus[removedNoBus['TIME'].str.contains('11:50:32 PM') == False]
# add timestamp
removedBadTime['TIMESTAMP'] = removedBadTime.apply(lambda row: time.mktime(datetime.datetime.strptime(row['TIME'], "%m/%d/%Y %I:%M:%S %p").timetuple()), axis=1)

# Taking a smaller subset of data
dataFragment = sortedByDate.tail(60000)

# add start time per row
timeStampMax = dataFragment.TIMESTAMP.max()
timeStampMin = dataFragment.TIMESTAMP.min()
timeStampMax
timeStampMin

maxAnimationTime = 100000
def timeStampInterp(row):
    return np.interp(row['TIMESTAMP'], [timeStampMin, timeStampMax], [0,maxAnimationTime])

dataFragment['INT_TIMESTAMP'] = dataFragment.apply(lambda row: timeStampInterp(row), axis=1)

# add endtime per row by speed and dist
speedMin = dataFragment.CURRENT_SPEED.min()
speedMax = dataFragment.CURRENT_SPEED.max()

scalingFactor = 15000
def endTimeStampInterp(row):
    theSpeed = row['SPEED']
    if theSpeed == 0:
        theSpeed = 1
    return row['INT_TIMESTAMP'] + scalingFactor * (row['LENGTH'] / theSpeed)

dataFragment['END_TIMESTAMP'] = dataFragment.apply(lambda row: endTimeStampInterp(row), axis=1)

# write output to json
import json
finalArray = []
for index, row in dataFragment.iterrows():
    x = {
        'timestamp': row['TIMESTAMP'],
        'date': row['TIME'],
        'speed': row['SPEED'],
        'segmentID': row['SEGMENTID'],
        'segments': [
            [row['START_LONGITUDE'], row['START_LATITUDE'], row['INT_TIMESTAMP']],
            [row['END_LONGITUDE'], row['END_LATITUDE'], row['END_TIMESTAMP']]
        ]
    }
    finalArray.append(x)
print('writing to json...')
with open('busAnimData.json', 'w') as outfile:
    json.dump(finalArray, outfile)
