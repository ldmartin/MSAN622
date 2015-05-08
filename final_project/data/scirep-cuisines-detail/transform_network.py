# -*- coding: utf-8 -*-
"""
Created on Sun May  3 17:09:43 2015

@author: laylamartin
"""
from collections import Counter
import json
import os
import pandas as pd
import re


def get_filenames(rootDir):
    """
    Traverses rootDir and compiles list of all filenames in folder.
    :param: rootDir: extension of folder to traverse
    :returns: fliename_lst: list of filenames in rootDir
    """
    
    file_lst = os.listdir(rootDir)
    
    if rootDir[-1] == '/':
        file_lst_ext = [rootDir + filepath for filepath in file_lst]
    else:
        file_lst_ext = [rootDir + '/' + filepath for filepath in file_lst]
        
    file_lst_ext

    
    return file_lst_ext



def create_recipe_dic(recipe_df):
    """
    Description: creates dictionary where keys are unique compounds and values
        are lists of ingredients containing that compound.
    Param: ingr_comp: data frame with columns "ingredient_id" and "compound_id".
    Returns: compound_dic, explained above.
    """
    # create dictionary where keys are compounds and values are lists containing 
    # ingredients that compound is found in

    # initiate empty dictionary:
    recipe_dict = {}
    
    # iterate through compound_id and ingredient_id data frame to populate dictionary:
    for i in range(len(recipe_df)):
        
        recipe = recipe_df.recipe_id[i]
        ingredient = recipe_df.ingredients[i]
        
        # if compound_dic has the compound as a key already
        try:
            recipe_dict[recipe].append(ingredient)
        except:
            # otherwise, add compound to keys of compound_dic:
            recipe_dict[recipe] = [ingredient]
        
    return recipe_dict
    
    
def populate_sparse_network(recipe_dict, unique_ingredient_list):
    """
    Description: Builds the sparse representation of the flavor compound and
        ingredient network. Nodes are connected by a weight that represents
        the number of shared flavor compounds.
    Param: compound_dic: Dicitonary where keys are unique compounds and values
        are lists of all ingredients containing that compound.
    Param: unique_ingredient_list: List of unique ingredients.
    Returns: sparse_network_dic: dictionary with keys 'node1', 'node2', 'weight'.
        Values are lists of the same length corresponding to columns of the 
        sparse network matrix.
    """
    # develop sparse representation of network, from ingredients_dic:

    # initialize new dictionary to hold values "node1", "node2", and "weight"
    # these will be the three columns in the sparse represntation of the matrix
    # "node1" and "node2" correspond to two distinct ingredients
    # "weight" is the number of flavor compounds in common between ingredients 
    # in columns 1 and 2
    # (this will eventually be turned from a dictionary to a pandas dataframe)
    
    sparse_network_dic = {'node1': [],
                          'node2': [],
                          'weight': []
                          }
    
    for ingredient in unique_ingredient_list:
        
        node_1 = ingredient
        shared_connection_dic = Counter()
        
        for recipe in recipe_dict:
            
            ingredient_list = recipe_dict[recipe]
            
            if ingredient in ingredient_list:
                ingredient_list.remove(ingredient)
                shared_connection_dic.update( ingredient_list )
        
        # get list of keys of counter:
        # these are items that share compounds with node 1:
        for connection in shared_connection_dic:
            sparse_network_dic['node1'].append(node_1)
            sparse_network_dic['node2'].append(connection)
            sparse_network_dic['weight'].append( shared_connection_dic[connection] )
            
    return sparse_network_dic
    

def transform_to_json(sparse_network_df, ing_dict):
    """
    Transform a dataframe into json type to display as force directed network
    in D3.
    """
    pro = {"nodes":[],
           "links":[]
           }
    
    sorted_ingredients = ing_dict.keys()
    sorted_ingredients.sort()
      
    for ing in sorted_ingredients:
        ing_title = ing.replace("_", " ")
        entry = {"name": ing_title,
                 "group": 1
                 }
        pro["nodes"].append(entry)
           
    for i in range(len(sparse_network_df)):
        node1 = sparse_network_df.node1[i]
        node2 = sparse_network_df.node2[i]
        
        entry = {"source": ing_dict[node1],
                 "target": ing_dict[node2],
                 "value": sparse_network_df.weight[i] 
                }
        pro["links"].append(entry)

    return pro
    
    
    
def main():
    # get all csv files corresponding to countries:
    rootDir = '/Users/laylamartin/Desktop/MSAN/Module4/Dataviz/ldmartin.github.io/final_project/data/scirep-cuisines-detail/country_split_df'     
    file_paths = get_filenames(rootDir)
    
    for fp in file_paths:
        # get country name:
        country_name = re.search(r'([\s\w]+)\.csv$', fp).groups()[0]
        print "Building network for country:", country_name
        
        # read in country csv:
        recipe_df = pd.read_csv(fp)
        
        # get unique ingredient list:
        all_ingredients = []
        for i in range(len(recipe_df)):
            all_ingredients.append(recipe_df.ingredients[i])
        unique_ingredient_list = list(set(all_ingredients))
        unique_ingredient_list.sort()
        
        # turn ingredients list into dictionary:
        ing_dict = {}
        i = 0
        for ing in unique_ingredient_list:
            ing_dict[ing] = i
            i += 1
           
        recipe_dict = create_recipe_dic(recipe_df)
    
        sparse_network_dict = populate_sparse_network(recipe_dict, ing_dict)
        sparse_network_df = pd.DataFrame(sparse_network_dict)
        
        pro = transform_to_json(sparse_network_df, ing_dict)
    
        outfile_name = '/Users/laylamartin/Desktop/MSAN/Module4/Dataviz/ldmartin.github.io/final_project/data/scirep-cuisines-detail/country_split_network/' + country_name + '.json'       
        print "Writing network for", country_name, "to location", outfile_name       
        
        with open(outfile_name, 'w') as outfile:
            json.dump(pro, outfile)
    return
              
    
d = main()