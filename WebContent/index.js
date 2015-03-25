// index.js

var REST_DBENV = 'api/dbinfo';
var REST_TWITTERENV = 'api/twitterinfo';
var KEY_ENTER = 13;


function toggleDatabaseInfo(){
	var dbnode = document.getElementById('dbinfo');
	dbnode.style.display = dbnode.style.display == 'none' ? '' : 'none';
	var twitter = document.getElementById('twitterinfo');
	twitter.style.display = 'none';
}


function toggleTwitterInfo(){
	var twitter = document.getElementById('twitterinfo');
	twitter.style.display = twitter.style.display == 'none' ? '' : 'none';
	var dbnode = document.getElementById('dbinfo');
	dbnode.style.display = 'none';
}

function toggleCountButton(contentnode){
	var button = document.getElementById('countbutton');
	if (contentnode.value != ''){
		button.disabled = false;
	}else{
		button.disabled = true;
	}
}


function countTweets(){
	var countURL = document.getElementById('envTwitterUrl').innerHTML;
	countURL = countURL + '/api/v1/messages/count?';
	countURL = countURL + document.getElementById('twitterquery').toString();
	xhrGet(encodeURI(countURL), function(count){
				console.log(count);
				if (count.search.result > 0){
					document.getElementById('numtweets').innerHTML = '' + count.search.result + ' tweets available...';
					document.getElementById('numtweets').className = 'greenArea';
				}else{
					document.getElementById('numtweets').innerHTML = 'No tweets available...';
					document.getElementById('numtweets').className = 'redArea';					
				}
				
	}, function(err){
		console.error(err);
	});
}


function toggleLoadButton(contentnode){
	var button = document.getElementById('loadbutton');
	if (contentnode.value != ''){
		button.disabled = false;
	}else{
		button.disabled = true;
	}
}


function loadTweets(){
	// TODO
	document.getElementById('progress').innerHTML = '100% Done...';
	document.getElementById('progress').className = 'greenArea';
}


function updateDatabaseInfo(){
	xhrGet(REST_DBENV, function(dbinfo){

				console.log(dbinfo);
				document.getElementById('envDbServiceName').innerHTML = dbinfo.name;
				document.getElementById('envDbName').innerHTML = dbinfo.db;
				document.getElementById('envDbHost').innerHTML = dbinfo.host;
				document.getElementById('envDbPort').innerHTML = dbinfo.port;
				document.getElementById('envDbUrl').innerHTML = dbinfo.jdbcurl;


	}, function(err){
		console.error(err);
	});
}


function updateTwitterInfo(){
	xhrGet(REST_TWITTERENV, function(twitterinfo){

				console.log(twitterinfo);
				document.getElementById('envTwitterServiceName').innerHTML = twitterinfo.name;
				document.getElementById('envTwitterHost').innerHTML = twitterinfo.host;
				document.getElementById('envTwitterPort').innerHTML = twitterinfo.port;
				document.getElementById('envTwitterUrl').innerHTML = twitterinfo.url;


	}, function(err){
		console.error(err);
	});
}
updateDatabaseInfo();
updateTwitterInfo();

