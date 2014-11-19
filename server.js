var http = require('http');	
var server = http.createServer(handler);
 
 //handle http requests
function handler(request, response) {	
	//if options, allow for cross domain requests (been causing issues in this exercise)
	if(request.method == 'OPTIONS'){
		// add needed headers
		var headers = {};
		headers["Access-Control-Allow-Origin"] = "*";
		headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
		headers["Access-Control-Allow-Credentials"] = true;
		headers["Access-Control-Max-Age"] = '86400'; // 24 hours
		headers["Access-Control-Allow-Headers"] = "X-Requested-With, Access-Control-Allow-Origin, X-HTTP-Method-Override, Content-Type, Authorization, Accept";
		// respond to the request
		response.writeHead(200, headers);
		response.end();
	}else if(request.method == 'POST'){
		//copy the data into body
		var body = '';
		request.on('data', function (data){
			body += data;			
			//too much POST data, kill the connection
			if(body.length > 1e6)
				request.connection.destroy();
			//write body to json file
			//console.log(body);
			var fs = require('fs');
			fs.writeFile('contacts.json', body, function(err, fd) {
				if (err) throw err;
					console.log("The file was saved!");
				//read back from the file
				fs.readFile('contacts.json', function (err, data) {
				if (err) throw err;
					result = data;
					response.end(result);
				});	
			});
		});
	};
}
 
server.listen(8124);
console.log('Server running at http://127.0.0.1:8124/');