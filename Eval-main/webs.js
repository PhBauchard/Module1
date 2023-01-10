//
// (c) Philippe Bauchard NOV2022
// 

var http=require('http');
var fs = require('fs');
var fssync = require('fs');
main();



// ///////////////////////////////////
function getfile(fichier) {
// ///////////////////////////////////
return fssync.readFileSync(fichier);
}

// ///////////////////////////////////
function main() {
// ///////////////////////////////////


// /////////////////////////////////////////////////////
// DEMARRAGE DU SERVEUR HTTP ET GESTION DES REQUETES
// /////////////////////////////////////////////////////

var server=http.createServer(
        function(request,response) {
	resp=response;
        // maps file extentionextension to MIME types
        const map = {
            '.ico': 'image/x-icon',
            '.html': 'text/html',
            '.js': 'text/javascript',
            '.json': 'application/json',
            '.css': 'text/css',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.wav': 'audio/wav',
            '.mp3': 'audio/mpeg',
            '.svg': 'image/svg+xml',
            '.pdf': 'application/pdf',
            '.doc': 'application/msword'
        };

// //////////////////////////////////////////
// gestion des requÃªtes HTTP sur le serveur
// //////////////////////////////////////////
        	ip = request.connection.remoteAddress;
        	if (ip.indexOf(":ffff:") >-1) ip= ip.substr(ip.indexOf(":ffff:")+6);

                requrl=request.url;
                l=requrl.length;
                if (requrl.substr(l-1,1)=="?") requrl=requrl.substr(0,l-1);
		if (requrl=="/") requrl="/index.html";
                path = "/home/pi/Eval-main"+ requrl;

       		fs.readFile(path, function(err, data){
                	if(err){
                        	response.statusCode = 404;
                        	response.end('Not found');
        	                }
                	else {
				response.statusCode = 200;
				ext = requrl.substr(requrl.indexOf("."));
	                        response.setHeader('Content-type', map[ext] || 'text/plain' );
        	                response.end(data);

                	 } // else

		 }); //readfile
       	} //  function(request,response)
); // var server=http.createServer(


port="8088";
server.listen(port);

var ip = require("ip");
ipaddr2=ip.address();

console.log("NodeJS Webs server started. Webs Web Server reachable at "+ipaddr2+":"+port+". ");

}


