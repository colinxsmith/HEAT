#!/usr/bin/env python
# pipe to | sed "s/, \]/]/"
from random import random
keep = 0
if random() > 0.5:
    state = 'true,'
else:
    state = 'false,'
line = ",{name: 'Vodafone Group',hold: ["
for i in range(150):
    keep += 1
    line += state
    if keep >= 15:
        if random() > 0.5:
            keep = 0
            if state is 'true,':
                state = 'false,'
            else:
                state = 'true,'
print line + ' ],'
line = 'performance: ['
for i in range(150):
	line += '%7.5f,' % (random() - 0.5)
print line + ' ]}'
