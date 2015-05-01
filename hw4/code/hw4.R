library(ggplot2)
?movies

data <- movies
View(data)

columns <- c('title', 'year', 'length', 'rating', 'votes')

action <- data[data$Action == 1,]
View(action)
action <- subset(action, select=columns)

doc <- data[data$Documentary == 1,]
View(doc)
doc <- subset(doc, select=columns)

write.csv(action, '/Users/laylamartin/Desktop/MSAN/Module4/Dataviz/ldmartin.github.io/hw4/data/action.csv')
write.csv(doc, '/Users/laylamartin/Desktop/MSAN/Module4/Dataviz/ldmartin.github.io/hw4/data/doc.csv')


comp <- data[complete.cases(data),]
View(comp)

budget <- subset(comp, select = c(columns, "budget"))
View(budget)

budget$bins <- ''
m <- min(budget$budget)
ma <- max(budget$budget)


assign_bins <- function(df, min, max){
  bin_size <- 10000000
  i <- min
  j <- 1
  while(i <= max){
    low_int <- i
    high_int <- low_int + bin_size
    low_str <- as.character(10*low_int/bin_size)
    high_str <- as.character(10*high_int/bin_size)
    print(low_str)
    print(class(low_str))
    bin_str <- paste(low_str, '-', high_str, sep='')
    df$bins[df$budget >= low_int & df$budget < high_int] <- bin_str
    #print(j) 
    i <- high_int
    j <- j + 1
  }
  return(df) 
}

budget <- assign_bins(budget, m, ma)
View(budget)
budget$budget <- NULL
names(budget)[length(budget)] <- "budget class"

write.csv(budget, '/Users/laylamartin/Desktop/MSAN/Module4/Dataviz/ldmartin.github.io/hw4/data/budget_binned.csv')

data2 <- data
data2$genre <- ''
data2$Short <- NULL
data2$genre[(data2$Action==1 & data2$Documentary==0 & data2$Comedy==0 & data2$Animation==0 & data2$Romance==0 & data2$Drama==0)]<- "action"          
data2$genre[(data2$Action==0 & data2$Documentary==1 & data2$Comedy==0 & data2$Animation==0 & data2$Romance==0 & data2$Drama==0)]<- "documentary"          
data2$genre[(data2$Action==0 & data2$Documentary==0 & data2$Comedy==1 & data2$Animation==0 & data2$Romance==0 & data2$Drama==0)]<- "comedy"          
data2$genre[(data2$Action==0 & data2$Documentary==0 & data2$Comedy==0 & data2$Animation==1 & data2$Romance==0 & data2$Drama==0)]<- "animation"          
data2$genre[(data2$Action==0 & data2$Documentary==0 & data2$Comedy==0 & data2$Animation==0 & data2$Romance==1 & data2$Drama==0)]<- "romance"          
data2$genre[(data2$Action==0 & data2$Documentary==0 & data2$Comedy==0 & data2$Animation==0 & data2$Romance==0 & data2$Drama==1)]<- "drama"          

data_genre <- subset(data2, select=c(columns, 'budget', 'genre'))
data_genre <- data_genre[complete.cases(data_genre),]
data_genre$genre <- as.factor(data_genre$genre)
levels(data_genre$genre)
View(data_genre)
data_genre$year <- as.numeric(as.character(data_genre$year))

write.csv(data_genre, '/Users/laylamartin/Desktop/MSAN/Module4/Dataviz/ldmartin.github.io/hw4/data/by_genre.csv')



#TODO:
# create data frame with column 1: genre and column 2: average budget
# output to csv: '/Users/laylamartin/Desktop/MSAN/Module4/Dataviz/ldmartin.github.io/hw4/data/genre_avg_budget.csv'

aggdata <-aggregate(data_genre, by=list(data_genre$genre), 
                    FUN=mean, na.rm=TRUE)
View(aggdata)
mean_budget_bygenre <- subset(aggdata, select=c(Group.1, budget))
names(mean_budget_bygenre)[1] <- "genre"
View(mean_budget_bygenre)

write.csv(mean_budget_bygenre, '/Users/laylamartin/Desktop/MSAN/Module4/Dataviz/ldmartin.github.io/hw4/data/mean_budget_bygenre.csv')



