# A Makefile to generate a ConTeXt file, paper.tex from paper.md
#paper.tex: paper.md
PANDOC  :=  pandoc -t context --filter=context-float-refs.js
#
#test:
#    mocha test/test-filter.js
#
#clean:
#    rm test/paper.tex
#
# An example Makefile to compile a context file, paper.tex

paper.tex: test/paper.md
	$(PANDOC) test/paper.md   -o test/paper.tex

test:
	mocha test/test.js

clean:
	rm test/paper.tex
