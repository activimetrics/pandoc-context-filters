/*global require __dirname describe it after */
var should = require('should')
var fs = require('fs')
var path    = require('path')
var rootdir = path.normalize(__dirname)


describe('handle references okay',function(){
    var content
    var file = rootdir + '/paper.tex'
    before('load tex output',function(done){
        fs.readFile(file,{'encoding':'utf8'}, function (err, data) {
            if (err) throw err;
            content=data
            return done()

        });
    })
    it('should create references to figures',function(done){

        var figure1 = /\\placefigure\[here]\[fig:ecdf.nb.am]/g;
        var figure2 = /\\placefigure\[here]\[fig:ecdf.nb.pm]/g;
        [figure1,figure2].forEach(function(re){
            var result=re.test(content)
            result.should.be.ok
            return result
        })
        return done()
    })
    it('should create references to tables',function(done){

        var table1 = /\\placetable\[here]\[tab:sb-pm-stats]/g;
        var table2 = /\\placetable\[here]\[tab:sb-am-stats]/g;
        [table1,table2].forEach(function(re){
            var result=re.test(content)
            result.should.be.ok
            return result
        })
        return done()
    })
})
