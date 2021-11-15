from bs4 import BeautifulSoup
import requests
import pymongo
from selenium import webdriver
from selenium.webdriver.common.by import By
import time
import os
import unidecode

alphabet = {
        'â' : 'a',
        'ê' : 'e',
        'é' : 'e',
        'è' : 'e',
        'î' : 'i',
        'ô' : 'o',
        'û' : 'u',
        'Î' : 'I',
        'É' : 'E',
}

nums = {
        '0' : 0,
        '1' : 1,
        '2' : 2,
        '3' : 3,
        '4' : 4,
        '5' : 5,
        '6' : 6,
        '7' : 7,
        '8' : 8,
        '9' : 9
}






def scrapp(pages):
        client = pymongo.MongoClient(env.PROC)
        db = client.success_en      
        mycol = db["dungeon"] 
        for page in range(pages,89+1):
                _compteur=page
                time.sleep(1)
                #driver.get("https://www.dofus.com/fr/mmorpg/communaute/annuaires/pages-persos/496700201-zirgoflex/succes/recherche?ast=&asd=y&acm=ALL&page="+str(page))
                #driver.get("https://www.dofus.com/fr/mmorpg/communaute/annuaires/pages-persos/496700201-zirgoflex/succes/recherche?ast=&asd=y&acm=ALL&page="+str(page))
                driver.get("https://www.dofus.com/en/mmorpg/community/directories/character-pages/496700201-zirgoflex/achievements/search?ast=&asd=y&acm=ALL&page="+str(page))

                table = driver.find_element(By.TAG_NAME, 'tbody')
                rows = table.find_elements(By.TAG_NAME, 'tr')

                for c in rows:
                        c.click()

                table = driver.find_element(By.TAG_NAME, 'tbody')                
                rows = table.find_elements(By.TAG_NAME, 'tr')


                _recompense_dic = {

                        "reward_name" : "",
                        "reward_quantity" : 1,
                        "reward_lvl" : 0,
                        "reward_url" : "",
                        "reward_type" : "",
                }
                _required_objective_dic = {
                        "objective_name" : "",
                        "img_url" : "https://static.ankama.com/dofus/ng/modules/mmorpg/community/directories/characters/success/illu_objective.jpg"
                }
                _success_dic = {

                        "lang" : "en-US",
                        "sucess_name" : "",
                        "img_url" : "",
                        "objective_desc": "",
                        "sucess_category": "",
                        "sucess_sub_category" : "",
                        "sucess_range_lvl" : 0, 
                        "earned_points" : 0,
                        "required_objective_name" : {'objective_count': 0, 'objectives': []},
                        "rewards": {'rewards_count': 0, 'reward':[]},
                }

                pointer = 0
                text = []
                tab=[]
                url = []
                img = []
                array_success = {}

                for row_tr in rows:
                        #img = row_tr.find_element(By.XPATH,'/html/body/div[2]/div[2]/div/div/div/main/div[2]/div[5]/div/div/div[2]/div/div[1]/table/tbody/tr[1]/td[1]/img')

                        text.append(row_tr.text)
                        img.append(row_tr.find_elements(By.TAG_NAME, 'td')[0].find_elements(By.TAG_NAME, 'img'))
        
                        pointer+=1
                        if(len(text) == 2):
                                
                                #Pour chaque img dans les recompense : boucler et recupérer tt les img après l'index 2 puis recupérer les img
                                
                                rewards_url = []
                                
                                
                                for image in img[1]:
                                        if( image.get_attribute('src') != 'https://static.ankama.com/dofus/ng/modules/mmorpg/community/directories/characters/success/illu_objective.jpg'):

                                                rewards_url.append(image.get_attribute('src'))
                                               
                                
                                
                                
                                sucess_name = ""
                                sucess_category = ""
                                sucess_sub_category = ""
                                sucess_reward = 0

                                _titre_length = len(text[0].split('\n')) 
                                _text = text[0].split('\n')
                                p=0
                                # Bypass pas accompli
                                # if(len(_text[1]) > 1 and _text[1].split(' ')[-1] == 'Non'):
                                #         _text[1] = ' '.join(_text[1].split(' ')[0:-1])

                                # elif(len(_text[1]) > 1 and _text[1].split(' ')[-1] == 'cours'):
                                #         _text[1] = ' '.join(_text[1].split(' ')[0:-2])

                                if(_titre_length == 1):
                                        sucess_name = " ".join(_text[0].split(' ')[0:-2]).strip()
                                        sucess_category = _text[0].split(' ')[-2].strip()
                                        sucess_reward = int(_text[0].split(' ')[-1])
                                        #print(sucess_name+"/",sucess_category+ "/",sucess_reward)
                                        
                                elif(_titre_length == 2):
                                        sucess_name = " ".join(_text[0].split(' ')[0:-1]).strip()
                                        sucess_category = _text[0].split(' ')[-1].strip()
                                        sucess_reward = int(_text[1].split(' ')[-1])
                                        sucess_sub_category = ' '.join(_text[1].split(' ')[0:-1]).strip()
                                        #print(sucess_name+"/",sucess_category+ "/",sucess_sub_category+"/",sucess_reward)

                                else:
                                        print(' 0 or > 2')
                                array_recompense = []
                                array_objective = []

                                res=[]
                                tab=[]

                                tab.append(text[0])
                                res.append(text[1])
                        
                                tr_mob = tab[0].split('\n')
                                tr_desc = res[0].split('Rewards:')[0].strip()
                                # FR-fr tr_desc = res[0].split('Récompenses:')[0].strip()
                                
                                _desc = tr_desc.split('\n')
                                _res = res[0].split('Rewards:')[1].strip()
                                # FR-fr _res = res[0].split('Récompenses:')[1].strip()

                                _recompense = _res.split('\n')
                                _objectives = _desc[1::]
                                
                                

                                _success_dic['sucess_name'] = sucess_name
                                _success_dic['sucess_category'] = parseAccent(sucess_category)
                                _success_dic['sucess_sub_category'] = sucess_sub_category
                                _success_dic['img_url'] = img[0][0].get_attribute('src')
                                _success_dic['objective_desc'] = _desc[0].split('Objective:')[1].strip()
                                # FR-fr _success_dic['objective_desc'] = _desc[0].split('Objectif:')[1].strip()
                                _success_dic['earned_points'] = sucess_reward

                                for i in range(len(_objectives)):
                                        _ojective = _required_objective_dic["objective_name"] = _objectives[i]
                                        array_objective.append(_ojective )

                                _success_dic['required_objective_name']['objectives'] = array_objective
    
                                
                                _pointer_r = 0

                                if(len(_recompense) > 0):
                                        while True:
                                                
                                                if( len(_recompense) > 0 and _recompense[0] != '' and len(_recompense)  == 1) :
                                                        _temp = _recompense[0].split(' ')
                                                if(len(_recompense) == 0 or _recompense[0] == ''):
                                                    
                                                        break
                                                
                                                #print(_recompense)
                                                _recompense_dic = {
                                                        "reward_name" : "",
                                                        "reward_quantity" : 1,
                                                        "reward_lvl" : 0,
                                                        "reward_url" : "",
                                                        "reward_type" : "Resource"

                                                                }
                                                for image in img[1]:
                                                        _recompense_dic["reward_url"] = image.get_attribute('src')

                                                if(_recompense[0][-1] in nums and len(_recompense) > 2):
                                                       

                                                        _recompense_dic["reward_name"] = _recompense[1]
                                                        _recompense_dic["reward_quantity"] = int(_recompense[0].split(' ')[1])
                                                        _recompense_dic["reward_url"] = rewards_url[0]
                                                        _recompense_dic["reward_lvl"] = int(_recompense[2].split(' ')[1])    
                                                        _recompense_dic["reward_type"] = "Ressource"   
                                        
                                                        rewards_url.remove(rewards_url[0])

                                                        array_recompense.append(_recompense_dic)
                                                        for i in range(3):
                                                                _recompense.remove(_recompense[0])
                                                else:
                                                       
                                                        
                                                        for w in _recompense[0]:
                                                                if('Dofus' in w):

                                                                        _recompense_dic["reward_type"] = "Dofus"

                                                                else:
                                                                        _recompense_dic["reward_type"] = "Ornament"   
        
                                                        _recompense_dic["reward_name"] = _recompense[0]
                                                        _recompense_dic["reward_quantity"] = 1
                                                       
                                                        _recompense_dic["reward_url"] = rewards_url[0]
                                                        _recompense_dic["reward_lvl"] = 0
                                                        array_recompense.append(_recompense_dic)
                                                        
                                                        
                                                        _recompense.remove(_recompense[0])
                                                       
                                                        
                                                        rewards_url.remove(rewards_url[0])

                                                
                                        _success_dic['rewards']['rewards_count'] = len(array_recompense)
                                        _success_dic['rewards']['reward'] = array_recompense
                                        _success_dic['required_objective_name']['objective_count'] = len(array_objective)
                                        
                                        
                                                        
                        
                        if(pointer % 2 == 0 and len(text) == 2):

                                if(_success_dic['sucess_category'] not in array_success.keys()):
                                        array_success[_success_dic['sucess_category']] = []


                                array_success[_success_dic['sucess_category']].append(_success_dic)
                                
                        
                                text=[]
                                img=[]


                                #ok
                                _required_objective_dic = {
                                        "objective_name" : "",
                                        "img_url" : "https://static.ankama.com/dofus/ng/modules/mmorpg/community/directories/characters/success/illu_objective.jpg"
                                }

                                _success_dic = {

                                        "lang" : "en-US",
                                        "sucess_name" : "", 
                                        "img_url" : "",
                                        "objective_desc": "",
                                        "sucess_category": "",
                                        "sucess_sub_category" : "", 
                                        "earned_points" : 0,
                                        "required_objective_name" : {'objective_count': 0, 'objectives': [] },
                                        "rewards": {'rewards_count': 0, 'reward':[]},
                                }

                for x in array_success.keys():
                        mycol = db[x]
                        x = mycol.insert_many(array_success[x])
                        print(x)
                        print("Insertion complète. page:"+ str(x),flush=True)

                array_success = {}
                print("Insertion complète. page:"+ str(page),flush=True)

                
def parseAccent(word):
        res = ''
        for l in word:
                if l in alphabet:
                        res += alphabet[l]
                else:
                        res+=l
        return res                

                
 
driver = webdriver.Chrome()

#driver.get("https://www.dofus.com/fr/mmorpg/communaute/annuaires/pages-persos/496700201-zirgoflex/succes/recherche?asd=y&acm=3&page=1")
driver.get("https://www.dofus.com/fr/mmorpg/communaute/annuaires/pages-persos/496700201-zirgoflex/succes/recherche?ast=&asd=y&acm=ALL&page=14")
#driver.maximize_window()
time.sleep(2)
btn = driver.find_element(By.XPATH,"/html/body/div[3]/div[2]/div[1]/div[2]/button[3]")
btn.click()        
scrapp(14)
driver.close()
