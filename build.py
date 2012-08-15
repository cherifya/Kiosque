#!/usr/bin/env python
# -*- coding: utf-8 -*-
from time import gmtime, strftime
import os
import shutil

prefix = 'tmp'
dest_folder = 'static'
dest_prefix = '/Kiosque'

#remove tmp folder if it exists
if os.path.exists(prefix):
	print "deleting existing 'tmp' folder...",
	shutil.rmtree(prefix)
	print "OK"

#run build command
build_cmd = "sc-build --build=v1 --languages=en -r kiosque"
print build_cmd+"..."
os.system(build_cmd)
print "build OK"

f = file(prefix+'/build/static/kiosque/en/v1/index.html','r')

text = f.read()
f.close()

print "replacing logo...",
text = text.replace('/static/sproutcore/foundation/en/v1/images/favicon.ico', '/static/kiosque/en/v1/images/favicon.png')
print "OK"

#print "replacing title by Tubesmix...",
#text = text.replace('Zic Tube', 'Tubesmix')
#print "OK"

print "saving file...",
o = file(prefix+'/build/static/kiosque/en/v1/index.html','w')
o.write(text)
o.close()
print "OK"

"""
f = file(prefix+'/build/static/kiosque/en/1b1/index.html','r')

text = f.read()
f.close()

print "adding manifest attribute...",
text = text.replace('<html>', '<html manifest="kiosque.manifest">')
print "OK"

print "replacing logo...",
text = text.replace('/static/sproutcore/foundation/en/1b1/images/sproutcore-logo.png', 'images/favicon.png')
print "OK"

print "replacing startup image...",
text = text.replace('/static/sproutcore/foundation/en/1b1/images/sproutcore-startup.png', 'images/startup.png')
print "OK"

print "replacing Prefix...",
text = text.replace('/static/', dest_prefix+'/static/')
print "OK"

print "saving file...",
o = file(prefix+'/build/static/kiosque/en/1b1/index.html','w')
o.write(text)
o.close()
print "OK"

print "adding timestamp to cache manifest...",
cache = file(prefix+'/build/static/kiosque/en/1b1/kiosque.manifest','a')
date = strftime("# %d %b %Y %H:%M:%S", gmtime())
print >> cache, date
cache.close()
print "OK"
"""

if os.path.exists(dest_folder):
	print "deleting existing 'static' folder...",
	shutil.rmtree(dest_folder)
	print "OK"

print "copying 'static' folder to "+dest_folder+"...",
shutil.copytree(prefix+'/build/static', dest_folder)
print "OK"
