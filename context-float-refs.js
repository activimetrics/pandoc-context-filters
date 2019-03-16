#!/usr/bin/env node

// Pandoc filter to convert all text to uppercase

var pandoc = require('pandoc-filter');
var _ = require('lodash')
var Str = pandoc.Str;

function collapse(arr) {
  return _.reduce(arr, function(s,v) {
    if ( v.t === "Space" ) return s + " "
    else if ( v.t === "Str" ) return s + v.c
    else throw new Error("Don't know how to handle "+arr+" : "+ s + ":"+v+" -- "+JSON.stringify(v))
  },"")
}

var fs = require('fs')
fs.writeFileSync('output.log','')

var sss = ""
function emit(s) {
  fs.appendFileSync('output.log',s+"\n")
}

function labelFromCaption(c) {
}

function handleTable(value){
    var caption = collapse(value[0]);
    // var target  = value[0].c[1][0]
    var meta = ""
    var place = "here"
    var label = ""
    var m;

    var tabmeta = ""
    if ( m = caption.match(/^(.*)\s*\{([^}]*)\}\s*(.*)$/) ) {
      tabmeta = m[2]
      caption = m[1]+m[3]
    } else if ( m = meta.match(/{(.*)(#)(fig:[^\s}]*)(.*)\}/) ) {
      tabmeta = meta
    }

    var classes = []
    _.each(tabmeta.split(/\s+/), function(it) {
      if ( m = it.match(/#(tab:.*)/) ) {
        label = m[1]
      } else if ( m=it.match(/place=(.*)/) ) {
        place = m[1]
      } else {
        classes.push(it)
      }
    })

    var aligns  = value[1]
    var widths  = value[2]
    var heads   = value[3]
    var rows    = value[4]
    var amap = {
      AlignLeft    : 'l',
      AlignRight   : 'r',
      AlignCenter  : 'c',
      AlignDefault : 'l'
    }
    var txt = ["\\placetable["+place+"]["+label+"]{"+caption+"}",
               "\\starttable[|",
               _.map(aligns, function(a,i) {
                 var cc = amap[a.t]
                 if ( widths[i] ) { cc+="p("+widths[i]+"\\textwidth)" }
                 return cc;
               }).join("|"),
               "|]"].join("")
    txt += "\\HL"+
      [_.map(heads,function(h) {
/*        return "\\NC "+_.map(h.c,function(hh) {
          return collapse(hh.c)
        }).join("")
*/
        return "\\NC "+_.map(h,function(hh) { return collapse(hh.c) }).join("")
      }).join("")].join("\n")+"\\NC\\AR\n\\HL"
    _.each(rows,function(r) {
      txt += _.map(r,function(cc) {
        return "\\NC "+_.map(cc,function(ccc) { return collapse(ccc.c) }).join("")
      }).join("\n")+"\n\\NC\\AR\n"
    });
    txt += "\\HL\n\\stoptable"
    return { t:'RawBlock',
             c:["context", txt] }
}

function handleFigure(value){
    // caption is now the second element of array
    // target is in third element of array
    // proof:
    // throw new Error("handling\n"+value[0].c.length+"\n"+JSON.stringify(value[0]['c'][0])+"\n"+JSON.stringify(value[0]['c'][1])+"\n"+JSON.stringify(value[0]['c'][2]))

    var caption = collapse(value[0].c[1])
    var target  = value[0].c[2][0]
    var meta    = collapse(value.slice(1))
    var place   = "here"
    var label   = ""
    var m;
    emit(["caption:"+caption,
          "target:"+target,
          "meta:"+meta,
          ""].join("\n"))
    var figmeta = ""
    if ( m = caption.match(/^(.*)\s*\{([^}]*)\}\s*(.*)$/) ) {
      figmeta = m[2]
      caption = m[1]+m[3]
    } else if ( m = meta.match(/{(.*)(#)(fig:[^\s}]*)(.*)\}/) ) {
      figmeta = meta
    }

    var classes = []
    _.each(figmeta.split(/\s+/), function(it) {
      if ( m = it.match(/#(fig:.*)/) ) {
        label = m[1]
      } else if ( m=it.match(/place=(.*)/) ) {
        place = m[1]
      } else {
        classes.push(it)
      }
    })

    if ( label === "" ) {
      // try setting the label by the stripped file name
      if ( m = target.match(/([^\/]*\/(.*)\.(.*))/) ) {
        label = "fig:"+m[2]
      }
    }
    return {t:'RawBlock',
            c:["context",
               ["\\placefigure",
                "[",
                place,
                "][",
                label,
                "]{",
                caption,
                "}{\\externalfigure[",
                target,
                "]}"].join("")]}
}

function action(type,value,format,meta) {
/*
  emit("type:"+JSON.stringify(type,null,'  ')+"\n")
  emit("type:"+JSON.stringify(value,null,'  ')+"\n")
  emit(JSON.stringify(format,null,'  ')+"\n")
  emit(JSON.stringify(meta,null,'  ')+"\n")
*/

  if (type === 'Para'
      && value.length > 0 && value[0].t === 'Image' ) {
      return handleFigure(value)
  } else if ( type === 'Table' ) {
      return handleTable(value)
  } else
    return null

}

pandoc.stdio(action);
//var json = JSON.parse(fs.readFileSync('/dev/stdin').toString())
//emit(JSON.stringify(json,null,'  '))
