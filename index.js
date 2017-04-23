var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var jsonfile = require('jsonfile');
var app = express();
var cors = require('cors');
var file = './data.json';
var old;
app.use(cors());

function fetch_from_nitp() {
    console.log("fetching data from nitp.ac.in...");
   
    var d= { };


    c = 1;
    url = 'http://www.nitp.ac.in/php/notice.php?table=registrar';
    request(url, function(error, response, html) {

        if (!error) {
            var $ = cheerio.load(html);
            var j1,j2;
            $('#noticepanel').filter(function() {
                var data = $(this);
                
                data.children().children().each(function(i, elm) {
                    if (elm.name == 'li') {
                        var head = $(elm).find('a')['0'].children[0].data;
                        var link = $(elm).find('a')['0'].children[0].parent.attribs.href;
                        link = "http://www.nitp.ac.in/php" + link.split("").slice(1).join("");
                        var temp = {
                            'head': head,
                            'link': link
                        };
                        d[c] = temp;
                        c++;
                        j1 = JSON.stringify(d);
                        
                        }
                    });
                });
            
            fs.readFile(file, 'utf8', function(err, data) {
                if (err) {
                    return console.log(err);
                }
                j2 = data;
                     
            if (JSON.stringify(j1) !== j2 && j2!= undefined) {
                console.log("new data found , uploading ...");
                write_data(JSON.stringify(j1));
            } else console.log("no new data");
      
               
            });
            }
    });

}

function write_data(obj) {
    fs.writeFile(file, obj, function(err) {
        if (err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    });
}
var minutes = 2,
    the_interval = minutes * 60 * 1000;
setInterval(function() {
    fetch_from_nitp();
}, the_interval);

app.get('/', function(req, res) {
   // fetch_from_nitp();
    res.setHeader('Content-Type', 'application/json');
    jsonfile.readFile(file, function(err, obj) {
        console.log("error_read deploy " + err);
        res.send(obj);
    })

});
var port = process.env.PORT || 3000;
app.listen(port)
console.log('listening on port '+port);

exports = module.exports = app;
