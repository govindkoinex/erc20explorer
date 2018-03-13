var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next) {

	var searchString = req.body.search.trim().toLowerCase();

	var coinkey = req.body.coinkey;

	var config = req.app.get('config');
	//console.log("searchString"+searchString);
	if(searchString.length == 66 || (searchString.length == 64 && searchString.substr(0,2) != '0x'))
	{
		if(searchString.length == 64 && searchString.substr(0,2) != '0x')
			searchString = '0x' + searchString;
		res.redirect('event/'+coinkey+'/TxHash/'+ searchString);
	}
	else if(searchString.length == 42 || (searchString.length == 40 && searchString.substr(0,2) != '0x'))
	{
		if(searchString.length == 40 && searchString.substr(0,2) != '0x')
			searchString = '0x' + searchString;
		res.redirect('account/'+coinkey+'/'+ searchString);
	}
	else{
		return next({ message: "Error: Invalid search string!",coinkey:coinkey,config:config  });
	}
  
});

module.exports = router;
