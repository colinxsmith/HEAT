#!/usr/bin/env python
# pipe to | sed "s/, \]/]/"
from random import random
line = ",{name: 'Vodafone Group',hold: ["
for i in range(150):
	if random() > 0.5:
		line += 'true,'
	else:
		line += 'false,'
print line + ' ],'
line = 'performance: ['
for i in range(150):
	line += '%7.5f,' % (random() - 0.5)
print line + ' ]}'
