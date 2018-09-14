#!/usr/bin/env python
# pipe to | sed "s/, \]/]/"
keep=0
from random import random
line = ",{name: 'Vodafone Group',hold: ["
for i in range(150):
        keep+=1
	if random() > 0.5 or keep < 7:
		line += 'true,'
	else:
		line += 'false,'
        if keep == 20:keep = 0
print line + ' ],'
line = 'performance: ['
for i in range(150):
	line += '%7.5f,' % (random() - 0.5)
print line + ' ]}'
