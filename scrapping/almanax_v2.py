from bs4 import BeautifulSoup
import requests
import pymongo
import time
import sys
import random
import math
import os
from dotenv import load_dotenv

load_dotenv()


#Date, #OffrandeDemandé, #TypeBonus->data-bonus, #DescriptionBonus->td[2],   
client = pymongo.MongoClient(os.getenv('DB_URI'))
db = client.almanax
mycol = db["almanax_v1"]

month_translate = {
    "01" : "Javian",
    "02" : "Flovor",
    "03" : "Martalo",
    "04" : "Aperirel",
    "05" : "Maisial",
    "06" : "Juinssidor",
    "07" : "Joullier",
    "08" : "Fraouctor",
    "09" : "Septange",
    "10" : "Octolliard",
    "11" : "Novamaire",
    "12" : "Descendre",
}

month_dict = { "Javian": ["Janvier","January","Javian"],
                "Flovor": ["Février","February","Flovor"],
                "Martalo": ["Mars","March","Martalo"],
                "Aperirel": ["Avril","April","Aperirel"],
                "Maisial": ["Mai","May","Maisial"],
                "Juinssidor" : ["Juin","June","Juinssidor"],
                "Joullier": ["Juillet","July","Joullier"],
                "Fraouctor": ["Août","August","Fraouctor"],
                "Septange": ["Septembre","September","Septange"],
                "Octolliard": ["Octobre","October","Octolliard"],
                "Novamaire": ["Novembre","November","Novamaire"],
                "Descendre": ["Decembre","December","Descendre"],
                }

day_dict = {
    "01" : 31,
    "02" : 29,
    "03" : 31,
    "04" : 30,
    "05" : 31,
    "06" : 30,
    "07" : 31,
    "08" : 31,
    "09" : 30,
    "10" : 31,
    "11" : 30,
    "12" : 31,
    
}


def parseLangUrl(_l,_month,_day):
    if(_month=="02" and _day == "16"):
        return "http://www.krosmoz.com/"+_l+"/almanax/" +"02-16-karnaval-fous"
    return "http://www.krosmoz.com/"+_l+"/almanax/"+_month+"-"+_day


def scrapp(_month,_day):
    _lang = ['fr','en']
    for _d in range(1):
        _almadic = {
                "day": _day,
                "month_number": _month,
                "month_name" : month_translate[_month],
                "event_title" : [], #OK
                "event_desc" : [], #OK
                "event_url": "", #OK
                "pnj_name": [], #OK
                "pnj_desc": [], #OK
                "pnj_url": "", #OK
                "effect_name": [], #OK
                "effect_desc": [], #OK
                "dofus_bonus_type": [], #OK
                "dofus_bonus_desc": [], #OK
                "dofus_quest_name" : [], #OK
                "dofus_offrande": [], #OK
                "dofus_offrande_url": "", #OK
                "touch_bonus_type": [], #OK
                "touch_bonus_desc": [], #OK
                "touch_quest_name": [], #OK
                "touch_offrande": [], #OK
                "touch_offrande_url": "", #OK
            }
        for _l in _lang:

            almanax = requests.get(parseLangUrl(_l,_month,_day));
            #almanax = requests.get("http://www.krosmoz.com/"+_l+"/almanax/" +"02-16-karnaval-fous");
            soup = BeautifulSoup(almanax.text, 'html.parser')

            if(soup.find("div",{"id":'almanax_event_image'}) == None):
                _event_url = ''
                _event_title = ''
                _event_desc = ''
            
            else:
                _event_url = soup.find("div",{"id":'almanax_event_image'}).findChild('img')['src'] 
                _event_title = soup.find("div",{"id":'almanax_event_desc'}).findChild('span').text
                _title = "\n"+soup.find("div",{"id":'almanax_event_desc'}).findChild('span').text+"\n"
                _almadic["event_desc"].append(soup.find("div",{"id":'almanax_event_desc'}).text.split(_title)[1].strip())
                _almadic["event_url"] = _event_url
                _almadic["event_title"].append(_event_title)


            
            _almadic["pnj_url"] = soup.find("div",{"id":'almanax_boss'}).findChild('img')['src']
            _almadic["pnj_name"].append(soup.find("div",{"id":'almanax_boss'}).findChild('span').text)
            
            #Dans certains cas la description est oublié sur le site
            if(len(soup.find("div",{"id":'almanax_boss_desc'}).text.strip()) > 0):
    
               _almadic["pnj_desc"].append(soup.find("div",{"id":'almanax_boss_desc'}).text.strip().split('\n')[1].strip())

            _almadic["effect_name"].append(soup.find("div",{"id":'almanax_meryde_effect'}).findChild('h3').text.strip())
            _almadic["effect_desc"].append(soup.find("div",{"id":'almanax_meryde_effect'}).findChild('p').text.strip())

            if(len(soup.find("div",{"id":'almanax_meryde_effect'}).findChild('div',{"class":"mid"}).text.strip().split('\n')) > 6):

                _almadic["dofus_bonus_type"].append(soup.find("div",{"id":'almanax_meryde_effect'}).findChild('div',{"class":"mid"}).text.strip().split('\n')[0].strip())
                _almadic["dofus_bonus_desc"].append(soup.find("div",{"id":'almanax_meryde_effect'}).findChild('div',{"class":"mid"}).text.strip().split('\n')[1].strip())
                _almadic["dofus_quest_name"].append(soup.find("div",{"id":'almanax_meryde_effect'}).findChild('div',{"class":"mid"}).text.strip().split('\n')[2].strip())
                _almadic["dofus_offrande"].append(soup.find("div",{"id":'almanax_meryde_effect'}).findChild('div',{"class":"mid"}).text.strip().split('\n')[6].strip())
                _almadic["dofus_offrande_url"] = soup.find("div",{"id":'almanax_meryde_effect'}).findChild('div',{"class":"mid"}).findChild('img')['src']
            
            if(len(soup.findAll("div",{"id":'achievement_dofus'})[1].text.strip().split('\n')) > 9 ):
                _almadic["touch_bonus_type"].append(soup.findAll("div",{"id":'achievement_dofus'})[1].text.strip().split('\n')[3].strip())
                _almadic["touch_bonus_desc"].append(soup.findAll("div",{"id":'achievement_dofus'})[1].text.strip().split('\n')[4].strip())
                _almadic["touch_quest_name"].append(soup.findAll("div",{"id":'achievement_dofus'})[1].text.strip().split('\n')[5].strip())
                _almadic["touch_offrande"].append(soup.findAll("div",{"id":'achievement_dofus'})[1].text.strip().split('\n')[9].strip())
                _almadic["touch_offrande_url"] = soup.findAll("div",{"id":'achievement_dofus'})[1].findChild('img')['src']



        x = mycol.insert_one(_almadic)
        print(x,_month+"-"+_day)
        #print(_almadic)
        

_init = False
for month in day_dict:
    for i in range(1,day_dict[month]+1):
        if(_init):
            scrapp(month,str(i).zfill(2))
            time.sleep(random.randint(1,7))
        else:
            if((month +"-"+ str(i).zfill(2))== sys.argv[1]):
                _init=True
"""

scrapp("04","03")

"""

