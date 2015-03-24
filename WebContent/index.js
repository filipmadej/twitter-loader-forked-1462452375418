// index.js

var REST_DBENV = 'api/dbinfo';
var REST_TWITTERENV = 'api/twitterinfo';
var KEY_ENTER = 13;

function countTweets(){
	// TOD
}


function toggleCountTips(contentnode){
	var button = document.getElementById('countbutton');
	if (contentnode.toString().length() > 0){
		button.style.display = '';
	}else{
		button.style.display = 'none';
	}
}

function toggleDatabaseInfo(){
	var dbnode = document.getElementById('dbinfo');
	dbnode.style.display = dbnode.style.display == 'none' ? '' : 'none';
	var twitter = document.getElementById('twitterinfo');
	twitter.style.display = 'none';
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

function toggleTwitterInfo(){
	var twitter = document.getElementById('twitterinfo');
	twitter.style.display = twitter.style.display == 'none' ? '' : 'none';
	var dbnode = document.getElementById('dbinfo');
	dbnode.style.display = 'none';
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

