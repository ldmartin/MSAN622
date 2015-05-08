# -*- coding: utf-8 -*-
"""
Created on Sun May  3 18:19:21 2015

@author: laylamartin
"""

from collections import Counter
import numpy as np
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
    


def get_most_popular(df, num_recipes, n=5):
    """
    generates a list of the most popular ingredient pairings for each country
    :param: df: recipe dataframe in sparse matrix format
    :param: n: number of "most popular" pairs to return
    :return: most_pop_df: 
    """
    
    df.sort(columns="weight", ascending=False, inplace=True)
    
    most_pop_df = df.head(n)
    
    # strip underscores form ingredient names:
    most_pop_df['node1'] = most_pop_df['node1'].str.replace('_', ' ')
    most_pop_df['node2'] = most_pop_df['node2'].str.replace('_', ' ')
    
    # append ingredient pair column:
    most_pop_df['ingredients'] = most_pop_df.node1 + ' & ' + most_pop_df.node2

    # append percent of recipes the pair of ingredients appears in:
    percent_recipes = np.round(most_pop_df.weight/float(num_recipes)*100) 
    most_pop_df['percent_recipes'] = percent_recipes
    
    return most_pop_df










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
        
        # count number of recipes:
        recipe_ids = set(recipe_df.recipe_id)
        num_recipes = len(recipe_ids)
#        print num_recipes
    
        sparse_network_dict = populate_sparse_network(recipe_dict, ing_dict)
        sparse_network_df = pd.DataFrame(sparse_network_dict)
        
        most_popular = get_most_popular(sparse_network_df, num_recipes, n=10)
#        print most_popular
        
        outfile_name = '/Users/laylamartin/Desktop/MSAN/Module4/Dataviz/ldmartin.github.io/final_project/data/scirep-cuisines-detail/country_popular_pairs/' + country_name + '_popular.csv'       
        print "Writing network for", country_name, "to location", outfile_name
        
        most_popular.to_csv(outfile_name, index=False)
        
    return
    

    
    
main()