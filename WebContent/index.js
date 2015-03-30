// index.js

var REST_DBENV = 'api/dbinfo';
var REST_TABLELIST = 'api/tablelist';
var REST_TWITTERENV = 'api/twitterinfo';
var REST_COUNT = 'api/twittercount';
var REST_LOAD = 'api/load';
var KEY_ENTER = 13;

var query = '';
var numtweets = 0;
var tablenames = [];
var tablename = '';
var colerr = '';


function toggleDatabaseInfo(){
	var dbnode = document.getElementById('dbinfo');
	dbnode.style.display = dbnode.style.display == 'none' ? '' : 'none';
}


function toggleTwitterInfo(){
	var twitter = document.getElementById('twitterinfo');
	twitter.style.display = twitter.style.display == 'none' ? '' : 'none';
}

function tweetqueryModified(contentnode){
	query = contentnode.value;
	document.getElementById('numtweets').innerHTML = '<br/>No tweets selected...<br/><br/>';
	document.getElementById('numtweets').className = 'redArea';
	toggleCountButton();	
}

function toggleCountButton(){
	var button = document.getElementById('countbutton');
	if (query.length > 0){
		button.disabled = false;
	}else{
		button.disabled = true;
	}
}


function countTweets(){
	document.getElementById('numtweets').innerHTML = '<br/>Please wait...<br/><br/>';
	document.getElementById('numtweets').className = 'greyArea';
	document.getElementById('tweetquery').disabled = true;
	document.getElementById('countbutton').disabled = true;
	
	var countURL = REST_COUNT + '?q=' + encodeURIComponent(document.getElementById('tweetquery').value);
	xhrGet(countURL, function(count){
		
				console.log(count);
				numtweets = count.search.results;
				if (numtweets > 0){
					document.getElementById('numtweets').innerHTML = '<br/>' + numtweets + ' tweets available...<br/><br/>';
					document.getElementById('numtweets').className = 'greenArea';
				}else{
					document.getElementById('numtweets').innerHTML = '<br/>No tweets available...<br/><br/>';
					document.getElementById('numtweets').className = 'redArea';
				}
				toggleLoadButton(document.getElementById('tablename'));
				
		}, function(err){
			document.getElementById('numtweets').innerHTML = '<br/>No tweets available...<br/><br/>';
			document.getElementById('numtweets').className = 'redArea';
			console.error(err);
	});

	document.getElementById('tweetquery').disabled = false;
	document.getElementById('countbutton').disabled = false;
}


function toggleColumns(contentnode){
	var columns = document.getElementById('columns');
	columns.style.display = columns.style.display == 'none' ? '' : 'none';
	contentnode.innerHTML = columns.style.display == 'none' ? '>' : 'v';
}


function selectTablename(tablelist){
	if(tablelist.selectedIndex >= 0){
		tablename=tablenames[tablelist.selectedIndex];
	}
	document.getElementById('tablename').value = tablename;
	toggleLoadButton(document.getElementById('tablename'));
}


function tablenameModified(contentnode){
	tablename=contentnode.value;
	document.getElementById('tables').selectedIndex = -1;
	toggleLoadButton();
}


function checkColumns(){
	var coltable=document.getElementById('columns').children[1];
	var colnames = [];
	var colidx = 0;
	var colmax=coltable.childElementCount;
	colerr='';
	while (colidx < colmax) {
		var colchecked = coltable.children[colidx].children[0].children[0].checked;
		if (colchecked == true) {
			var colname = coltable.children[colidx].children[1].children[0].value;
			if ( colname.length == 0 ) {
				if (colerr.length == 0) {
					colerr = 'A column is specified without a name...';
				}
			} else if (colnames.indexOf(colname)>= 0) {
				if (colerr.length == 0) {
					colerr = 'Two columns have the same name ' + colname + '...';
				}
			} else {
				colnames.push(colname);
			}
		}
		colidx = colidx + 1;		
	}
	if (colnames.length == 0) {
		if (colerr.length == 0) {
			colerr = 'No column is selected...';
		}
	}
	toggleLoadButton()
}


function getColumns(){
	var coltable=document.getElementById('columns').children[1];
	var colnames = '';
	var colidx = 0;
	var colmax=coltable.childElementCount;
	while (colidx < colmax) {
		var colchecked = coltable.children[colidx].children[0].children[0].checked;
		if (colchecked == true) {
			var colname = coltable.children[colidx].children[1].children[0].value;
			var coltype = coltable.children[colidx].children[2].children[0].value;
			var colloc = coltable.children[colidx].children[3].children[0].value;
			if (colnames.length > 0 ) {
				colnames = colnames + "|";
			}
			colnames = colnames + colname + "|" + coltype + "|" + colloc;
		}
		colidx = colidx + 1;
	}
	return colnames;
}


function toggleLoadButton(){
	var button = document.getElementById('loadbutton');
	var tableok = document.getElementById('tableok');
	if (tablename.length > 0){
		if (tablenames.indexOf(tablename) >= 0){
			button.disabled = true;
			tableok.innerHTML = '<br/>Existing table name is not allowed...<br/><br/>';
			tableok.className = 'redArea';
		} else if (colerr.length > 0){
			button.disabled = true;
			tableok.innerHTML = '<br/>'+colerr+'<br/><br/>';
			tableok.className = 'redArea';
		} else {
			tableok.innerHTML = '<br/>New table name indicated...<br/><br/>';
			tableok.className = 'greenArea';
			if (document.getElementById('numtweets').className == 'greenArea'){
				button.disabled = false;
			} else {
				button.disabled = true;				
			}			
		}
	}else{
		button.disabled = true;
		tableok.innerHTML = '<br/>No table name...<br/><br/>';
		tableok.className = 'redArea';
	}
}


function loadTweets(){
	var progressarea = document.getElementById('progress');
	var phase = progressarea.getElementsByTagName('p')[0];
	var progress = progressarea.getElementsByTagName('progress')[0];
	var columns = document.getElementById('columns');
	var togglecolumns = document.getElementById('togglecolumns');

	// deactivate all clickable form elements
	document.getElementById('tweetquery').disabled = true;
	document.getElementById('countbutton').disabled = true;
	document.getElementById('tablelist').disabled = true;
	document.getElementById('tablename').disabled = true;
	document.getElementById('loadbutton').disabled = true;
	columns.style.display = 'none';
	togglecolumns.innerHTML = '>';
	togglecolumns.disabled = true;
	
	// create the table and load the table
	phase.innerHTML = 'Creating the table...';
	progress.max = 1.0;
	progress.value = 0.0;
	progress.children[0].innerHTML=0;
	progress.children[1].innerHTML=1;
	progressarea.style.display = '';
	xhrPost(REST_LOAD, getColumns(), function(loadresult){

				console.log(loadresult);

	}, function(err){
		console.error(err);
	});
	
	// end of loading
	phase.innerHTML = 'Load completed successfully...';
	progress.max = numtweets;
	progress.value = numtweets;
	progress.children[0].innerHTML=numtweets;
	progress.children[1].innerHTML=numtweets;
	
	// activate the form for the next load
	progressarea.style.display = 'none';
	document.getElementById('tweetquery').disabled = false;
	document.getElementById('countbutton').disabled = false;
	document.getElementById('tablelist').disabled = false;
	document.getElementById('tablename').disabled = false;
	document.getElementById('loadbutton').disabled = true;
	togglecolumns.disabled = true;
	refreshTableList();
}


function updateDatabaseInfo(){
	xhrGet(REST_DBENV, function(dbinfo){

				console.log(dbinfo);
				document.getElementById('envDbServiceName').innerHTML = dbinfo.name;
				document.getElementById('envDbName').innerHTML = dbinfo.db;
				document.getElementById('envDbHost').innerHTML = dbinfo.host;
				document.getElementById('envDbPort').innerHTML = dbinfo.port;

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

	}, function(err){
		console.error(err);
	});
}


function refreshTableList(){
	xhrGet(REST_TABLELIST, function(tablelist){

				console.log(tablelist);
				var tidx = 0;
				var tmax = tablelist.count;
				tablenames = [];
				var content = '<p><br/>Existing tables:</p><select id="tables" name="Tables"  size="4" onchange="selectTablename(this)">\n';
				// copy table names up to the length of the HTML table
				while (tidx<tmax){
					tablenames.push(tablelist.body[tidx].name);
					content += '<option values="' + tablelist.body[tidx].name + '">' + tablelist.body[tidx].name + '</option>\n';
					tidx++;
				}
				content += '</select>';
				document.getElementById('tablelist').innerHTML = content;
				toggleLoadButton(document.getElementById('tablename'));
				
	}, function(err){
		console.error(err);
	});
}


updateDatabaseInfo();
updateTwitterInfo();
refreshTableList();
window.onresize = function(){ location.reload(); }
