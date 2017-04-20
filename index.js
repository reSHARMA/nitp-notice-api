var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();
var cors = require('cors'); 
app.use(cors());
app.get('/', function(req, res){
    var d= { };
    c = 1;
    url = 'http://www.nitp.ac.in/php/notice.php?table=registrar';
    request(url, function(error, response, html){
        if(!error){
 	 var $ = cheerio.load(html);
 	  $('#noticepanel').filter(function(){
		var data = $(this);
		data.children().children().each(function(i,elm){
			if(elm.name == 'li'){
var head=$(elm).find('a')['0'].children[0].data;
var link=$(elm).find('a')['0'].children[0].parent.attribs.href;
link ="http://www.nitp.ac.in/php"+link.split("").slice(1).join("");
var temp = {'head': head ,'link':link};
//temp = JSON.parse(temp);
console.log(temp);
//d = JSON.parse(d);
d[c] = temp;
c++;
console.log(d);
			}
		});
	});
        }
res.setHeader('Content-Type', 'application/json');
res.send(JSON.stringify(d)); 
})
})
var port = process.env.PORT || 3000;
app.listen(port)
console.log('listening on port '+port);
exports = module.exports = app;
