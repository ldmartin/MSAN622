
# manipulation to create geospacial data:
r <- read.csv("~/Desktop/MSAN/Module4/Dataviz/ldmartin.github.io/final_project/data/scirep-cuisines-detail/recipes.csv")
View(r)

levels(r$country)
r$country <- as.character(r$country)

r$country[r$country == 'African'] <- 'africa'

########################################################################
# subest data by continent:
by_continent <- r[(r$country=="African" | r$country=='American' | r$country=="asian" | 
                    r$country=="Asian" | r$country=="Central_SouthAmerican" | 
                    r$country=="East-African" | r$country=="Eastern-Europe" |
                    r$country=="EasternEuropean_Russian" | r$country=="North-African" |
                    r$country=="South-African" |  r$country=="South-America" |
                    r$country=="West-African"),]
View(by_continent)

change_names <- function(df, exist_lst, replace_lst){
  for (i in 1:length(replace_lst)){
    old <- exist_lst[i]
    new <- replace_lst[i]
    df$country[df$country==old] <- new
  }
  return(df)
}

exist_lst <- c("African", "American", "asian", "Asian", "Central_SouthAmerican",
              "East-African", "Eastern-Europe", "EasternEuropean_Russian",
               "North-African", "South-African","South-America", "West-African")
replace_lst <- c("Africa", "North America", "Asia", "Asia", "South America",
                "Africa", "Europe", "Europe", "Africa", "Africa", "South America",
                 "Africa")
length(exist_lst)
length(replace_lst)

by_continent <- change_names(by_continent, exist_lst, replace_lst)
by_continent$country <- as.factor(by_continent$country)
levels(by_continent$country)
View(by_continent)
length(df$country[df$country=="Asia"])

write.csv(by_continent, "~/Desktop/MSAN/Module4/Dataviz/ldmartin.github.io/final_project/data/scirep-cuisines-detail/by_continent.csv")

##############################################################

###########################################################

# subset by country:
by_country <- r[(r$country=="American" | r$country=='Austria' | r$country=="Belgium" | 
                     r$country=="Canada" | r$country=="China" | 
                     r$country=="France" | r$country=="French" | r$country=="Germany" |
                     r$country=="German" | r$country=="Greek" |r$country=="India" |
                     r$country=="Iran" |  r$country=="Irish" |  r$country=="Israel" |
                     r$country=="Italy" |  r$country=="Japan" |  r$country=="Korea" |
                     r$country=="Malaysia" |  r$country=="Mexican" |  r$country=="Mexico" |
                     r$country=="Netherlands" |  r$country=="Spain" |  r$country=="Thai" |
                     r$country=="Thailand" |  r$country=="UK-and-Ireland" |  r$country=="Vietnam" |
                     r$country=="Vietnamese" |  r$country=="Philippines")  ,]
exist_lst <- c("American", "French", "German", "Greek", "Irish", "Mexican", "Thai",
               "UK-and-Ireland", "Vietnamese")
replace_lst <- c("United States", "France", "Germany", "Greece", "Ireland", "Mexico", 
                 "Thailand", "United Kingdom", "Vietnam"
)

by_country <- r[(r$country=="American" | r$country=='Austria' | r$country=="Belgium" | 
                   r$country=="Canada" | r$country=="China" | 
                   r$country=="France" | r$country=="Germany" |
                   r$country=="German" | r$country=="Greek" |r$country=="India" |
                   r$country=="Iran" |  r$country=="Irish" |  r$country=="Israel" |
                   r$country=="Italy" |  r$country=="Japan" |  r$country=="Korea" |
                   r$country=="Malaysia" |  r$country=="Mexico" |
                   r$country=="Netherlands" |  r$country=="Spain" |  r$country=="Thai" |
                   r$country=="Thailand" |  r$country=="UK-and-Ireland" |  r$country=="Vietnam" |
                   r$country=="Philippines")  ,]
exist_lst <- c("American", "German", "Greek", "Irish", "Thai",
               "UK-and-Ireland")
replace_lst <- c("United States", "Germany", "Greece", "Ireland", 
                 "Thailand", "United Kingdom")
by_country <- change_names(by_country, exist_lst, replace_lst)
by_country$country <- as.factor(by_country$country)
levels(by_country$country)

change_names <- function(df, exist_lst, replace_lst){
  for (i in 1:length(replace_lst)){
    old <- exist_lst[i]
    new <- replace_lst[i]
    df$country[df$country==old] <- new
  }
  return(df)
}


by_country <- change_names(by_country, exist_lst, replace_lst)
View(by_country)
by_country$country <- as.factor(by_country$country)
levels(by_country$country)

write.csv(by_country, "~/Desktop/MSAN/Module4/Dataviz/ldmartin.github.io/final_project/data/scirep-cuisines-detail/by_country.csv")
###########################################################

# subset recipes by country to visualize network:

# start with by_country:
#levels(by_country$country)
split_by_country <- function(df){
  countries <- levels(by_country$country)
  for (i in 1:length(countries)){
    country <- countries[i]
    print(country)
    subset <- df[df$country == country,]
    #print(nrow(subset))
    fp <- paste("~/Desktop/MSAN/Module4/Dataviz/ldmartin.github.io/final_project/data/scirep-cuisines-detail/country_splits/", country, ".csv", sep='')
    write.csv(subset, fp)
  }
}

split_by_country(by_country)

########################################






