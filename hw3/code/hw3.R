# load seatbelts time series data:

data1 <- UKDriverDeaths
data1 <- data.frame(data1)
View(data1)

data <- Seatbelts
data <- data.frame(data)
data$t <- data1$data1

View(data)


# write to csv:
write.csv(data, '/Users/laylamartin/Desktop/MSAN/Module4/Dataviz/ldmartin.github.io/hw3/data/seatbelts.csv',
          row.names=FALSE)




