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




