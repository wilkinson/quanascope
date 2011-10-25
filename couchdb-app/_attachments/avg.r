#-  R source code

#-  avg.r ~~
#
#   This package may be really old, but I don't really care because I needed to
#   verify that my JavaScript is giving the correct answer. I couldn't get the
#   "rimage" package to install, so I went with "ReadImages" :-P
#
#                                                       ~~ (c) SRW, 24 Oct 2011

library(ReadImages)

demo <- function(filename) {
  x <- read.jpeg(filename)
  cat('---', filename, '---\n')
  cat('  Red:  ', mean(x[,, 1]) * 255, '\n')
  cat('  Green:', mean(x[,, 2]) * 255, '\n')
  cat('  Blue: ', mean(x[,, 3]) * 255, '\n')
}

setwd('/Users/sean/Desktop')

demo('CPCa#3.JPG')
demo('Frantz_5.JPG')
demo('PriorGBM_MIB.JPG')

#-  vim:set syntax=r:
