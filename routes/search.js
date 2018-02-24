var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next) {
	var searchString = req.body.search.trim().toLowerCase();
	var coinkey = req.body.coinkey;
	var config = req.app.get('config');
  if (searchString.length > 22 && searchString.substr(0,2) != '0x')
    searchString = '0x' + searchString;

	if (searchString.length === 2) {
		console.log("govind6");
		return next({ message: "Error: Invalid search string!",coinkey:req.params.coinkey,config:config  });
	} else {
		res.redirect('account/'+coinkey+'/'+ searchString);
	}
});

module.exports = router;
