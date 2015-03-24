// index.js

var REST_DBENV = 'api/dbinfo';
var REST_TWITTERENV = 'api/twitterinfo';
var KEY_ENTER = 13;

function countTweets(){
	// TOD
}


function toggleCountTips(contentNode){
	var tips = document.getElementById('counttips');
	var button = document.getElementById('countbutton');
	if (contentnode.toString().length() > 0){
		tips.style.display = 'none';
		button.style.display = '';
	}else{
		tips.style.display = '';
		button.style.display = 'none';
	}
}

function toggleDatabaseInfo(){
	var node = document.getElementById('dbserviceinfo');
	node.style.display = node.style.display == 'none' ? '' : 'none';
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
	var node = document.getElementById('twitterinfo');
	node.style.display = node.style.display == 'none' ? '' : 'none';
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

