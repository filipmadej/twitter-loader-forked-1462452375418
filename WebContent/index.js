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
	if (contentnode.value.length > 0){
		button.disabled = false;
	}else{
		button.disabled = true;
	}
}


function countTweets(){
	var countURL = document.getElementById('envTwitterUrl').innerHTML;
	countURL = countURL + '/api/v1/messages/count?q=' + encodeURIComponent(document.getElementById('tweetquery').value);
	console.log(countURL);
	xhrGet(countURL, function(count){
				console.log(count);
				if (count.search.result > 0){
					document.getElementById('numtweets').innerHTML = '<br/><a id="numtweets">' + count.search.result + '</a> tweets available...<br/><br/>';
					document.getElementById('numtweets').className = 'greenArea';
				}else{
					document.getElementById('numtweets').innerHTML = '<br/>No tweets available...<br/><br/>';
					document.getElementById('numtweets').className = 'redArea';					
				}
		}, function(err){
		console.error(err);
	});
}


function toggleLoadButton(contentnode){
	var button = document.getElementById('loadbutton');
	if (contentnode.value.length > 0){
		button.disabled = false;
	}else{
		button.disabled = true;
	}
}


function loadTweets(){
	// TODO
	document.getElementById('progress').innerHTML = '<br/>100% Done...<br/><br/>';
	document.getElementById('progress').className = 'greenArea';
}


function updateDatabaseInfo(){
	xhrGet(REST_DBENV, function(dbinfo){

				console.log(dbinfo);
				document.getElementById('envDbServiceName').innerHTML = dbinfo.name;
				document.getElementById('envDbName').innerHTML = dbinfo.db;
				document.getElementById('envDbHost').innerHTML = dbinfo.host;
				document.getElementById('envDbPort').innerHTML = dbinfo.port;
				document.getElementById('envDbUser').innerHTML = dbinfo.user;
				document.getElementById('envDbPwd').innerHTML = dbinfo.pwd;
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

function connectToDB(){
	con=null;
	try {
		con = DriverManager.getConnection(dbinfo.jdbcurl, dbinfo.user, dbinfo.pwd);
	} catch (SQLException e) {
		console.error(err);
	};

	return con;
}



function createTableList(){
	
}


updateDatabaseInfo();
updateTwitterInfo();
createTableList();

