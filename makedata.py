from random import random
line = ''
for i in range(150):
	if random() > 0.5:
		line += 'true,'
	else:
		line += 'false,'
print line
line = ''
for i in range(150):
	line += '%7.5f,' % (random() - 0.5)
print line
