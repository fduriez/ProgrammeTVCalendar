var Allocine = require('./scrapeAllocine.js');

var request = require('request');
var cheerio = require('cheerio');

var href;

exports.filmSoir = function (url,date) {
    //console.log('****************** Début accès progamme TV **************************');
    request(url, function(error, response, html){

        // First we'll check to make sure no errors occurred when making the request
        if(!error){
            // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality

            var $ = cheerio.load(html);

            href = new Array();

            initHref($);

            console.log(url);

            $('div.block:nth-child(2) > div:nth-child(1)').filter(function(){
                var partTitle;
                var data = $(this);
                partTitle = data.text();
                //console.log(partTitle);
                
                //Verifie si Grandes Chaines contient des programmes
                if (partTitle.indexOf("Grandes chaînes") != -1) {
                    while(partTitle[0] == '\n' || partTitle[0] == ' ') {    
                        partTitle = partTitle.slice(1);
                    }
                    partTitle = partTitle.slice(partTitle.indexOf("Grandes chaînes"),15);
                    console.log(partTitle);
                    getMovies($,'div.block:nth-child(2)',date);

                    $('div.block:nth-child(3) > div:nth-child(1)').filter(function(){
                        data = $(this);
                        partTitle = data.text();
                        
                        //Verifie si Grandes Chaines TNT contient des programmes
                        if (partTitle.indexOf("TNT - Chaînes Gratuites") != -1) {
                            while(partTitle[0] == '\n' || partTitle[0] == ' ') {    
                                partTitle = partTitle.slice(1);
                            }
                            partTitle = partTitle.slice(partTitle.indexOf("TNT"),23);
                            console.log(partTitle);
                            getMovies($,'div.block:nth-child(3)',date);
                        }

                    })
                }
                //Verifie si Grandes Chaines TNT contient des programmes
                else if (partTitle.indexOf("TNT - Chaînes Gratuites") != -1) {
                    while(partTitle[0] == '\n' || partTitle[0] == ' ') {    
                        partTitle = partTitle.slice(1);
                    }
                    partTitle = partTitle.slice(partTitle.indexOf("TNT"),23);
                    console.log(partTitle);
                    getMovies($,'div.block:nth-child(2)',date);
                }
            })
        }
    })
}

function isChannelInMyList(channel) {
    if(channel == "TF1") return true;
    if(channel == "France 2") return true;
    if(channel == "France 3") return true;
    if(channel == "Arte") return true;
    if(channel == "M6") return true;
    if(channel == "France 5") return true;
    if(channel == "C8") return true;
    if(channel == "W9") return true;
    if(channel == "TMC") return true;
    if(channel == "NT1") return true;
    if(channel == "NRJ 12") return true;
    if(channel == "France 4") return true;
    if(channel == "France Ô") return true;
    if(channel == "HD1") return true;
    if(channel == "6ter") return true;
    return false
}

function getMovies(htmlPage, CSSselector,date) {
    htmlPage(CSSselector).filter(function() {

        var test = htmlPage(this);
        
        test = test.text();

        //Supprime l'en-tete
        test = test.slice(test.indexOf('Demain'));
        
        while (test.indexOf('Programme') != -1) {

            test = test.slice(test.indexOf('Programme') + 9);
            var channel = test.slice(0,test.indexOf('\n'));
            if(isChannelInMyList(channel)) {
                while   ((test.indexOf('Cinéma') != -1) && (((test.indexOf('Cinéma') < test.indexOf('Programme'))) && (test.indexOf('Programme') != -1) || (test.indexOf('Programme') == -1))) {
                
                    var hour = test.slice(test.indexOf('Cinéma')-10);
                    hour = hour.slice(0,hour.indexOf('\n'));

                    var minutes = hour.slice(3);
                    hour = hour .slice(0,2);

                    test = test.slice(test.indexOf('Cinéma') + 6);

                    var movieTitle;
                    while(test[0] == '\n' || test[0] == ' ') {    
                        test = test.slice(1);
                    }
                    movieTitle = test.slice(0,test.indexOf('\n'));

                    var duration = new Array();
                    duration['BEGIN'] = getBeginDate(date,hour,minutes);
                    duration['END'] = "";
                    
                    var movie = new Array();
                    movie['CHANNEL'] = channel;
                    movie['TITLE'] = movieTitle;
                    movie['DATE'] = duration;

                    getProductionYear(movie);                    
                }
            }
        }
    })
}

function getProductionYear(movie) {
    var url = 'http://www.programme-tv.net';
    var productionYear;
    href.forEach(function(element) {
        if(element['TITLE'] == movie['TITLE']) {
            url += element['url'];
        }
    })

    request(url, function(error, response, html){

        if(!error){

            var $ = cheerio.load(html);

            $('div.fs-4:nth-child(2)').filter(function(){
                
                var data = $(this);
                productionYear = data.text();
                productionYear = productionYear.slice(productionYear.indexOf("(")+1);
                productionYear = productionYear.slice(0,4);
                movie['PRODUCTION_YEAR'] = productionYear;
                if(movie['TITLE'].indexOf("(") != -1) {
                    movie['TITLE'] = movie['TITLE'].slice(0,movie['TITLE'].indexOf("(")-1);
                }
                Allocine.scrapeAllocine(movie);
            })
            
        }
    })
}

function getBeginDate(date,hours,minutes) {
    var beginDate = new Date();
    beginDate.setFullYear(date.getFullYear());
    beginDate.setMonth(date.getMonth());
    beginDate.setDate(date.getDate());
    beginDate.setHours(hours);
    beginDate.setMinutes(minutes);
    beginDate.setSeconds(0);
    beginDate.setMilliseconds(0);
    return beginDate;
}

function initHref(htmlPage) {

    htmlPage('.prog_name').filter(function(){
        var data = htmlPage(this);
        var url = data.attr('href');
        var title = data.text();
        var link = new Array();
        link['TITLE'] = title;
        link['url'] = url;
        href[href.length] = link;
    })
}
