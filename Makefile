#
# 'make depend' uses makedepend to automatically generate dependencies
#               (dependencies are added to end of Makefile)
# 'make'        build executable file 'mycc'
# 'make clean'  removes all .tex and executable files
#

# define the C compiler to use
##PANDOC  :=  pandoc -t context --filter=context-float-refs.js
PANDOC = pandoc

# define any compile-time flags
PANDOCFLAGS = -t context -f markdown --filter=./context-float-refs.js

# define the C source files
SRCS = test/paper.md ## test/partial.md test/traveltime.md test/traveltime_noR.md

# define the C object files
#
# This uses Suffix Replacement within a macro:
#   $(name:string1=string2)
#         For each word in 'name' replace 'string1' with 'string2'
# Below we are replacing the suffix .md of all words in the macro SRCS
# with the .tex suffix
#
OBJS  = $(SRCS:.md=.tex)
TESTS = $(SRCS:.md=.js)

REPORTER = dot
TIMEOUT = 5000

pretest:    $(OBJS)
	@echo  test cases $(OBJS) created

# this is a suffix replacement rule for building .tex's from .md's
# it uses automatic variables $<: the name of the prerequisite of
# the rule(a .md file) and $@: the name of the target of the rule (a .tex file)
# (see the gnu make manual section about automatic variables)
%.tex: %.md
	$(PANDOC) $(PANDOCFLAGS)  $<  -o $@


test:
	@NODE_ENV=test  ./node_modules/.bin/mocha \
	--reporter $(REPORTER) \
	--timeout 5000 \
	--growl \
	$(TESTS)

clean:
	$(RM) $(OBJS) *~

#
# The following part of the makefile is generic; it can be used to
# build any executable just by changing the definitions above and by
# deleting dependencies appended to the file from 'make depend'
#

.PHONY: pretest test clean
