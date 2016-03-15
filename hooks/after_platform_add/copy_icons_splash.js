#!/usr/bin/env node

//
// This hook copies various resource files from our version control system directories into the appropriate platform specific location
//


// configure all the files to copy.  Key of object is the source file, value is the destination location.  It's fine to put all platforms' icons and splash screen files here, even if we don't build for all platforms on each developer's box.
var fs = require('fs');
var path = require('path');
//no need to configure below
var rootdir = process.argv[2];


var file =  '../icon_mapping/images_mapping.json';

fs.readFile(path.resolve(__dirname,file), 'utf8', function (err, data) {
	  if (err) {
	    console.log('Error: ' + err);
	    return;
	  }

	  data = JSON.parse(data);
	  
	  for(var attributename in data){
		    //console.log(attributename+" - "+ data[attributename]);
		    var key = attributename;
		    var srcfile = path.join(rootdir, attributename);
		    var keys = Object.keys(data[attributename]);
		    for( var i = 0,length = keys.length; i < length; i++ ) {
		    	var destfile = path.join(rootdir, data[attributename][ keys[ i ] ]);
			    //console.log("copying "+srcfile+" to "+destfile);
			    var destdir = path.dirname(destfile);
			    console.log('source : '+ srcfile);
			    console.log('destdir : ' + destdir);
			    if (fs.existsSync(srcfile) && fs.existsSync(destdir)) {
			        fs.createReadStream(srcfile).pipe(fs.createWriteStream(destfile));
			    } 
			 }
	  }
});
