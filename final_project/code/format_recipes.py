# -*- coding: utf-8 -*-
"""
Created on Fri May  1 19:25:10 2015
@author: laylamartin
"""

from collections import Counter
import pandas as pd
import time
import json


############ PROTOTYPE FORMATTING FOR NETWORK #############

"""
{
    "nodes":
        [
            {"name": node_name, 
            "group": category
            }
            ...
            
            {"name": node_name, 
            "group": category
            }
        ],
    
    "links":
        [
            {"source": node1_idx, 
            "target": node2_idx,
            "value": weight
            },
            ...
            
            {"source": node1_idx, 
            "target": node2_idx,
            "value": weight
            }
        ]
}

"""


#################################################

def generate_recipe_df(subset=False):
    """
    Combine all recipes and generate a dataframe where column 1 is the country,
    column 2 is the id (unique number for each recipe), and column 3 is a list
    of ingredients found in that recipe.
    """
    f1 = open("data/scirep-cuisines-detail/allr_recipes.txt", "r")
    f2 = open("data/scirep-cuisines-detail/epic_recipes.txt", "r")
    f3 = open("data/scirep-cuisines-detail/menu_recipes.txt", "r")
    
    # Creating the first list of recipes, splitted on tabs and stripped of new line characters
    recipes = f1.readlines()
    recipes = [r.strip('\n').split('\t') for r in recipes]
    
    # adding on the data from the other two files, in the same format
    recipes2 = f2.readlines()
    for r in recipes2:
        recipes.append(r.strip('\n').split('\t'))
    
    recipes3 = f3.readlines()
    for r in recipes3:
        recipes.append(r.strip('\n').split('\t'))
        
    if subset is not False:
        num_entries = subset
        recipes = recipes[:num_entries]
        
    recipe_id = []
    country = []
    ingredients = []
    
    i = 0
    for recipe_lst in recipes:
        ing_lst = recipe_lst[1:]
        for ing in ing_lst:
            recipe_id.append(i)
            country.append(recipe_lst[0])
            ingredients.append(ing)  
        i += 1
        
    recipe_dict = {'recipe_id': recipe_id,
                   'country': country,
                   'ingredients': ingredients
                   }
                   
    recipe_df = pd.DataFrame(recipe_dict)
    return recipe_df


def generate_recipe_dict(subset=False):
    """
    Combine all recipes and generate a dictionary where column 1 is the country,
    column 2 is the id (unique number for each recipe), and column 3 is a list
    of ingredients found in that recipe.
    """
    f1 = open("data/scirep-cuisines-detail/allr_recipes.txt", "r")
    f2 = open("data/scirep-cuisines-detail/epic_recipes.txt", "r")
    f3 = open("data/scirep-cuisines-detail/menu_recipes.txt", "r")
    
    # Creating the first list of recipes, splitted on tabs and stripped of new line characters
    recipes = f1.readlines()
    recipes = [r.strip('\n').split('\t') for r in recipes]
    
    # adding on the data from the other two files, in the same format
    recipes2 = f2.readlines()
    for r in recipes2:
        recipes.append(r.strip('\n').split('\t'))
    
    recipes3 = f3.readlines()
    for r in recipes3:
        recipes.append(r.strip('\n').split('\t'))
        
    if subset is not False:
        num_entries = subset
        recipes = recipes[:num_entries]

    # combine all recipe files and generate recipe dataframe where column1 is 
    #  unique recipe ID and column2 is list of ingredients in the recipe
    recipe_dict = {}
    for i in range(len(recipes)):
        recipe_dict[i] = recipes[i][1:]
        
    return recipe_dict


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
        ingredient = recipe_df.ingredient[i]
        
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
    






def gen_full_network():
    """
    use full set of recipes to generate the network
    """
    
    start_time = time.time()
    
    recipe_df = generate_recipe_df()
    recipe_dict = generate_recipe_dict()
    
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
         
    sparse_network_dict = populate_sparse_network(recipe_dict, ing_dict)
    sparse_network_df = pd.DataFrame(sparse_network_dict)

    pro = transform_to_json(sparse_network_df, ing_dict)
    
    with open('full_network.json', 'w') as outfile:
        json.dump(pro, outfile)
        
    print ('runtime: %d seconds' % (time.time() - start_time))
    

def gen_subset_network():
    """
    use full set of recipes to generate the network
    """
    
    start_time = time.time()
    
    n_entries=20
    
    recipe_df = generate_recipe_df(subset=n_entries)
    recipe_dict = generate_recipe_dict(subset=n_entries)
    
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
         
    sparse_network_dict = populate_sparse_network(recipe_dict, ing_dict)
    sparse_network_df = pd.DataFrame(sparse_network_dict)

    pro = transform_to_json(sparse_network_df, ing_dict)
    
    with open('subset_network.json', 'w') as outfile:
        json.dump(pro, outfile)
        
    print ('runtime: %d seconds' % (time.time() - start_time))
    
    
gen_subset_network()
    
    
    
    


