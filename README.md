# A pandoc filter to add figure references when going from markdown to ConTeXt

This filter can be used to generate figure references, if you follow
certain conventions.

[![Build Status](https://travis-ci.org/activimetrics/pandoc-context-filters.svg?branch=master)](https://travis-ci.org/activimetrics/pandoc-context-filters)


# Prerequisites

First run npm install

then run npm test

hopefully that works and does something useful

# Usage

In your context file, you could do:

```tex
%% how to translate markdown in this doc
\usemodule[filter]

\defineexternalfilter
  [markdown]
    [filtercommand={pandoc -t context --filter=node_modules/pandoc-context-filters/context-float-refs.js   \externalfilterinputfile\space -o \externalfilteroutputfile},
      directory=output]

...

\starttext
\processmarkdownfile{report.md}
\stoptext

```

Then in `report.md`, you need to follow a fairly simple
convention. Just make sure to put the figure label in curly braces at
the very end of the figure caption text.  Like so:


```markdown
If figures are your thing, you can see all the way down.
[Figure](#fig:ecdf.nb.am) shows morning CDF, and
[Figure](#fig:ecdf.nb.pm) shows the evening CDF.

This figure call has a curly-braced figure reference done properly.

![Cumulative density function of measured travel times, Northbound, 6 AM{#fig:ecdf.nb.am}](ks_hr_ecdf_n007.pdf)

So does this one.

![Cumulative density function of measured travel times, Northbound, 6 PM{#fig:ecdf.nb.pm}](ks_hr_ecdf_n019.pdf)



---------------------------------------------------
  Source    N   Mean   Std Dev   Median   Min   Max
-------- ---- ------ --------- -------- ----- -----
      bt  485  219.5     42.05    214.9 139.5 500.8

     sst 2880  221.6     29.03    217.4 155.3 484.7
---------------------------------------------------

Table: Summary statistics for all PM Peak (3-7pm) estimates on SB Beach{#tab:sb-pm-stats}

Notice the same idea with tables.  `"#tab:sb-pm-stats` is the way to
define the reference, and how to refer to it later.  For example,
[Table](#tab:sb-pm-stats) indicates a lot of similarity between the
afternoon estimates, but [Table](#tab:sb-am-stats) shows a marked
deviation in the morning period.


---------------------------------------------------
  Source    N   Mean   Std Dev   Median   Min   Max
-------- ---- ------ --------- -------- ----- -----
      bt  186  188.2     33.93    184.8 123.5   412

     sst 1447  199.4     18.33    199.3   149 319.2
---------------------------------------------------

Table: Summary statistics for AM Peak (7-9am) estimates on SB Beach{#tab:sb-am-stats}

```
