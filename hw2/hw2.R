# Data Visualization Homework 2
?state.x77

# Load state data:
data(state)

# Load desired state statistics:
df <- data.frame(
  state.name,
  state.abb,
  state.x77,
  state.region,
  state.division,
  row.names = NULL
)
View(df)

# View dataset names:
names(df)

# Reassign dataset names to more user friendldy values:
names(df) <- c("name", "abbrev", "pop", "income", "illiteracy", "lifeExp", "murder", 
               "hsGrad", "frost", "area", "region", "division")

write.csv(df, 
          '/Users/laylamartin/Desktop/MSAN/Module4/Dataviz/ldmartin.github.io/hw2/stateData.csv',
          row.names=FALSE
          )

df2 <- subset(df, select=c('Life.Exp', 'Illiteracy', 'Murder', 'HS.Grad', 'state.region'))
names(df2)[1] <- "LifeExp"
names(df2)[length(df2)] <- "StateRegion"
names(df2)[length(df2)-1] <- "HS Grad"
View(df2)

write.csv(df2, 
          '/Users/laylamartin/Desktop/MSAN/Module4/Dataviz/ldmartin.github.io/hw2/data/stateData2.csv',
          row.names=FALSE
)

df3 <- subset(df, select=c('Illiteracy', 'Life.Exp', 'state.region'))
View(df3)
names(df3)[length(df3)] <- "StateRegion"
names(df3)[length(df3)-1] <- "Life Expectancy"


write.csv(df3, 
          '/Users/laylamartin/Desktop/MSAN/Module4/Dataviz/ldmartin.github.io/hw2/data/stateData3.csv',
          row.names=FALSE
)

df['region2'] <- df['state.region']
levels(df$region2) <- c( levels(df$region2), 'North' )
levels(df$region2)
View(df)
df$region2[(df$region2 == 'Northeast') | (df$region2 == 'North Central')] <- 'North'

df4 <- subset(df, select=c('Illiteracy', 'HS.Grad', 'region2'))
names(df4) <- c('Illiteracy', 'High School Grad', 'Region')
write.csv(df4, 
          '/Users/laylamartin/Desktop/MSAN/Module4/Dataviz/ldmartin.github.io/hw2/data/stateData4.csv',
          row.names=FALSE
)
levels(df4$Region)

df5 <- subset(df, select=c('Income', 'Illiteracy', 'HS.Grad', 'region2'))
names(df5) <- c('Per Capita Income', 'Percent Illiterate', 'Percent High School Graduate', 'Region')
write.csv(df5, 
          '/Users/laylamartin/Desktop/MSAN/Module4/Dataviz/ldmartin.github.io/hw2/data/stateData5.csv',
          row.names=FALSE
)

df5_2 <- df5
names(df5_2) <- c('PCI', 'Illiterate', 'HSGrad', 'Region')





