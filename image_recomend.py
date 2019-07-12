import os
from flask import request
import io
import base64
import numpy as np
import re


# image preproccessing 
from pyimagesearch.colordescriptor import ColorDescriptor
from pyimagesearch.searcher import Searcher
import argparse
import cv2

# Firebase 

class Images(object):

    def __init__(self):
        self.APP_ROOT = os.path.dirname(os.path.abspath(__file__))
        

    def Upload(self):
        target = os.path.join(self.APP_ROOT, 'static/images')
        print(target)

        if not os.path.isdir(target):
            os.mkdir(target)
        
        print(request.files.getlist("file"))

        for file in request.files.getlist("file"):
            print('come here')
            print(file)
            filename = file.filename
            print(filename)
            destination = "/".join([target, filename])
            print(destination)
            file.save(destination)

        return destination


    def predict(self,location):
        # initialize the image descriptor
        cd = ColorDescriptor((8, 12, 3))
        print(location)
        query = cv2.imread(location)
        features = cd.describe(query)


        searcher = Searcher("index.csv")
        results = searcher.search(features)

        final_res = []
        for (score, resultID) in results:
            final_res.append(resultID)
            print(score,resultID)

        return final_res[0]



