css: 
	stylus -u nib stylus/select2.styl -o ./

install:
	npm install nib stylus -g

.PHONY: css