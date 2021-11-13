from bs4 import BeautifulSoup
import requests
import pymongo
from selenium import webdriver
from selenium.webdriver.common.by import By
import time
import os
from dotenv import load_dotenv
load_dotenv()




def scrapp(pages):
        client = pymongo.MongoClient(os.getenv('DB_URI'))
        db = client.success_fr      
        mycol = db["dungeon"] 
        for i in range(1,pages+1):
                _compteur=i
                time.sleep(1)
                #driver.get("https://www.dofus.com/fr/mmorpg/communaute/annuaires/pages-persos/496700201-zirgoflex/succes/recherche?asd=y&acm=3&page="+str(i))
                driver.get("https://www.dofus.com/fr/mmorpg/communaute/annuaires/pages-persos/496700201-zirgoflex/succes/recherche?ast=&asd=y&acm=15#jt_list")

                #table = driver.find_element(By.XPATH, "/html/body/div[2]/div[2]/div/div/div/main/div[2]/div[5]/div/div/div[2]/div/div[1]/table/tbody")
                #table = driver.find_element(By.XPATH, "/html/body/div[2]/div[2]/div/div/div[1]/main/div[2]/div[5]/div/div/div[1]/div/div[1]/table/tbody")
                table = driver.find_element(By.XPATH, "/html/body/div[2]/div[2]/div/div/div/main/div[2]/div[5]/div/div/div[2]/div/div[1]/table/tbody")
                rows = table.find_elements(By.TAG_NAME, 'tr')

                for c in rows:
                        c.click()

                #table = driver.find_element(By.XPATH, "/html/body/div[2]/div[2]/div/div/div/main/div[2]/div[5]/div/div/div[2]/div/div[1]/table/tbody")
                #table = driver.find_element(By.XPATH, "/html/body/div[2]/div[2]/div/div/div[1]/main/div[2]/div[5]/div/div/div[1]/div/div[1]/table/tbody") ALL
                table = driver.find_element(By.XPATH, "/html/body/div[2]/div[2]/div/div/div/main/div[2]/div[5]/div/div/div[2]/div/div[1]/table/tbody")
                
                rows = table.find_elements(By.TAG_NAME, 'tr')


                _recompense_dic = {

                        "reward_name" : "",
                        "reward_quantity" : 0,
                        "reward_lvl" : 0,
                        "reward_url" : "",
                        "reward_type" : "Resource",
                }

                #ok
                _required_objective_dic = {
                        "objective_name" : "",
                        "img_url" : "https://static.ankama.com/dofus/ng/modules/mmorpg/community/directories/characters/success/illu_objective.jpg"
                }

                _success_dic = {

                        "lang" : "fr",
                        "sucess_name" : "Antichambre du Glourséleste", #ok
                        "img_url" : "",
                        "objective_desc": "Vaincre le Glourséleste dans son donjon.",#ok
                        "sucess_category": "donjon",
                        "sucess_range_lvl" : "Niveaux 151 à 190", #ok
                        "earned_points" : 0,
                        "required_objective_name" : {'objective_count': 0, 'objectives': []}, #ok
                        "rewards": {'rewards_count': 0, 'reward':[]},
                }
                pointer = 0
                text = []
                tab=[]
                url = []
                img = []
                array_success = []
                for row_tr in rows:
                        #img = row_tr.find_element(By.XPATH,'/html/body/div[2]/div[2]/div/div/div/main/div[2]/div[5]/div/div/div[2]/div/div[1]/table/tbody/tr[1]/td[1]/img')

                        text.append(row_tr.text)
                        img.append(row_tr.find_elements(By.TAG_NAME, 'td')[0].find_elements(By.TAG_NAME, 'img'))
                
                        

                        pointer+=1
                        if(len(text) == 2):
                                
                                #Pour chaque img dans les recompense : boucler et recupérer tt les img après l'index 2 puis recupérer les img

                                rewards_url = []

                                for image in img[1][2:]:
                                        rewards_url.append(image.get_attribute('src'))
                                        print(image.get_attribute('src'))

                                
                                sucess_name = ""
                                sucess_category = ""
                                sucess_sub_category = ""
                                sucess_reward = 0

                                _titre_length = len(text[0].split('\n')) 
                                _text = text[0].split('\n')
                                
                                if(_titre_length == 1):
                                        sucess_name = " ".join(_text[0].split(' ')[0:-2]).strip()
                                        sucess_category = _text[0].split(' ')[-2].strip()
                                        sucess_reward = int(_text[0].split(' ')[-1])
                                        print(sucess_name+"/",sucess_category+ "/",sucess_reward)
                                        
                                elif(_titre_length == 2):
                                        sucess_name = " ".join(_text[0].split(' ')[0:-1]).strip()
                                        sucess_category = _text[0].split(' ')[-1].strip()
                                        sucess_reward = int(_text[1].split(' ')[-1])
                                        sucess_sub_category = ' '.join(_text[1].split(' ')[0:-1]).strip()
                                        print(sucess_name+"/",sucess_category+ "/",sucess_sub_category+"/",sucess_reward)

                                else:
                                        print(' 0 or > 2')
                                array_recompense = []
                                array_objective = []

                                res=[]
                                tab=[]

                                tab.append(text[0])
                                res.append(text[1])
                                text=[]
                                img=[]


                                tr_mob = tab[0].split('\n')
                                tr_desc = res[0].split('Récompenses:')[0].strip()
                                
                                _desc = tr_desc.split('\n')
                                _res = res[0].split('Récompenses:')[1].strip()
                                _recompense = _res.split('\n')
                                _objectives = _desc[1::]

                                _success_dic['sucess_name'] = sucess_name
                                _success_dic['sucess_category'] = sucess_category
                                _success_dic['sucess_sub_category'] = sucess_sub_category
                                #_success_dic['img_url'] = img[0][0].get_attribute('src')
                                _success_dic['objective_desc'] = _desc[0].split('Objectif:')[1].strip()
                                _success_dic['earned_points'] = sucess_reward

                                for i in range(len(_objectives)):
                                        _ojective = _required_objective_dic["objective_name"] = _objectives[i]
                                        array_objective.append(_ojective )

                                #Les recompenses on toujours les mêmes index 0 1 2
                                for i in range(len(_recompense)):
                                        
                                        contientOrnement = False
                                        if(len(_recompense)%3!=0):
                                                contientOrnement = True

                                        if(len(_recompense) < 3 or contientOrnement):
                                                if(i%2==0):
                                                        contientOrnement = False
                                                _recompense_dic["reward_type"] = "Ornement"
                                                _recompense_dic["reward_name"] = _recompense[0]
                                                for image in img[1]:
                                                        _recompense_dic["reward_url"] = image.get_attribute('src')
                                                array_recompense.append(_recompense_dic)
                                        else:
                                                if(i%3==0):
                                                        _recompense_dic["reward_quantity"] = int(_recompense[i].split(' ')[1])
                                                elif(i%3==1):
                                                        _recompense_dic["reward_name"] = _recompense[i]
                                                elif(i%3==2):
                                                        _recompense_dic["reward_url"] = rewards_url[0]
                                                        rewards_url.remove(rewards_url[0])
                                                        _recompense_dic["reward_lvl"] = int(_recompense[i].split(' ')[1])
                                                        array_recompense.append(_recompense_dic)

                                                        _recompense_dic = {

                                                        "reward_name" : "",
                                                        "reward_quantity" : 0,
                                                        "reward_lvl" : 0,
                                                        "reward_url" : "",
                                                        "reward_type" : "Resource"
                                                }
                                
                                _success_dic['rewards']['rewards_count'] = len(array_recompense)
                                _success_dic['rewards']['reward'] = array_recompense
                                _success_dic['required_objective_name']['objective_count'] = len(array_objective)
                                _success_dic['required_objective_name']['objectives'] = array_objective

                        if(pointer % 2 == 0 and len(text) == 2):
                                
                                array_success.append(_success_dic)
                                #print(_success_dic['sucess_name'] + " : est inséré. ")
                                #print(_success_dic)
                                text=[]
                                img=[]


                                #ok
                                _required_objective_dic = {
                                        "objective_name" : "",
                                        "img_url" : "https://static.ankama.com/dofus/ng/modules/mmorpg/community/directories/characters/success/illu_objective.jpg"
                                }

                                _success_dic = {

                                        "lang" : "fr",
                                        "sucess_name" : "Antichambre du Glourséleste", #ok
                                        "img_url" : "",
                                        "objective_desc": "Vaincre le Glourséleste dans son donjon.",#ok
                                        "sucess_category": "donjon",
                                        "sucess_sub_category" : "Niveaux 151 à 190 || Spot", #ok
                                        "earned_points" : 0,
                                        "required_objective_name" : {'objective_count': 0, 'objectives': []}, #ok
                                        "rewards": {'rewards_count': 0, 'reward':[]},
                                }
                #mycol.insert_many(array_success)
                array_success = []
                print("Insertion compléte.")

                
                 

                
 
driver = webdriver.Chrome()

#driver.get("https://www.dofus.com/fr/mmorpg/communaute/annuaires/pages-persos/496700201-zirgoflex/succes/recherche?asd=y&acm=3&page=1")
driver.get("https://www.dofus.com/fr/mmorpg/communaute/annuaires/pages-persos/496700201-zirgoflex/succes/recherche?ast=&asd=y&acm=ALL&page=1")

time.sleep(2)
btn = driver.find_element(By.XPATH,"/html/body/div[3]/div[2]/div[1]/div[2]/button[3]")
btn.click()        
scrapp(1)
driver.close()
