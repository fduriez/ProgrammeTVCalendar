var progFile = require('./ScrapeProgTV.js');

var express = require('express');
var app     = express();

app.use(express.static(__dirname + '/views'));

app.listen('8080');
console.log('Magic happens on port 8080');
exports = module.exports = app;

var date = new Date();
var year;
var month;
var day;

getActualDay(date);

for(var diffDate = 0; diffDate < 6; diffDate++) {
	var myDate = new Date();
	myDate.setDate(date.getDate() + diffDate);
	getActualDay(myDate);
	url = 'http://www.programme-tv.net/programme/programme-tnt/' + year + '-' + month + '-' + day + '/cinema/#Grandes+cha%C3%AEnes';
	var myUrl = new String();
	myUrl = url;
	progFile.filmSoir(myUrl,myDate);
}

function getActualDay(date) {
	
	year = date.getFullYear();
	
	//date.setMonth(3);
	month = date.getMonth() + 1;
	if(month < 10) {
		month = "0" + month;
	}

	//date.setDate(9);

	day = date.getDate();
	if(day < 10) {
		day = "0" + day;
	}

	console.log(date); 
}