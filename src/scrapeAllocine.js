var allocine = require('../lib/allocine-api');
var agendaGoogle = require('./agendaGoogle.js');

var alreadyFinished = false;

exports.scrapeAllocine = function (movie) {

	var name = movie['TITLE'];
	if(name.indexOf(":") != -1) {
		name = name.slice(0,name.indexOf(":")-1);
	}
	name = name.toLowerCase();
	var prodYear = movie['PRODUCTION_YEAR'];
	
	allocine.api('search', {q: name, filter: 'movie'}, function(error, results) {
		if(error) { console.log('Error : '+ error); return; }
		
		var myMovie;

		results.feed.movie.forEach(function(movieResult) {
			var movieTitle = new String(movieResult.title);
			movieTitle = movieTitle.toLowerCase();
			var movieOriginalTitle = new String(movieResult.originalTitle);
			movieOriginalTitle = movieOriginalTitle.toLowerCase();
			
			if((movieTitle == name.toLowerCase()) || (movieOriginalTitle == name.toLowerCase())) {
				if(movie['PRODUCTION_YEAR'] == prodYear) {
					myMovie = movieResult;
					var code = new String(myMovie.code);
					getRatingAndRuntime(movie,code);
				}
			}
		})
	});
}

function getRatingAndRuntime(movie,code) {
	allocine.api('movie', {code: code}, function(error, result) {
		if(error) { console.log('Error : '+ error); return; }
		
		movie['RATING'] = result.movie.statistics.userRating;
		var rating = parseFloat (movie['RATING']);
		if(rating >= 4) {
			getEndHour(movie,result.movie.runtime);
			agendaGoogle.createEvent(movie);
		}
	});
}

function getEndHour(movie,runtime) {
	runtime = runtime/60;
	
	var hour = parseInt(runtime/60);
	var minutes = runtime%60;

	var endDate = new Date(); 

	endDate.setFullYear(movie['DATE']['BEGIN'].getFullYear());
	endDate.setMonth(movie['DATE']['BEGIN'].getMonth());
	endDate.setDate(movie['DATE']['BEGIN'].getDate());
	endDate.setHours(movie['DATE']['BEGIN'].getHours() + hour);
	endDate.setMinutes(movie['DATE']['BEGIN'].getMinutes() + minutes);
	endDate.setSeconds(0);
	endDate.setMilliseconds(0);
	movie['DATE']['END'] = endDate;
}

/*function getRatingAndRuntime (url) {
	allocine.api('search', {q: 'Gladiator', filter: 'movie'}, function(error, results) {
		if(error) { console.log('Error : '+ error); return; }
		
		console.log('Success !');
		//console.log(results);
		//console.log(results.feed.movie);
		var myMovie;

		results.feed.movie.forEach(function(movie) {
			if((movie.Title == "Gladiator") || (movie.originalTitle == "Gladiator")) {
				if(movie.productionYear == "2000") {
					myMovie = movie;
				}
			}
		})
		//console.log(myMovie);

		allocine.api('movie', {code: myMovie.code}, function(error, result) {
			if(error) { console.log('Error : '+ error); return; }
			console.log('Success !');
			console.log("durée en seconde : " + result.movie.runtime);
			console.log("Note : " + result.movie.statistics.userRating);
		});

	});
}*/



