var BigNumber = require('bignumber.js');

var Ether     = new BigNumber(10e+17);

function tokenFormatter(config) {
  self = this;
  self.config = config;

  self.format = function(amount,key) {
    if (amount==undefined || amount == null || amount == '')
    {
      return  "0 "+self.config.allCoins[key].tokenShortName;
    }
    var ret = new BigNumber(amount.toString());
    var divisor = (new BigNumber(10)).toPower(self.config.allCoins[key].tokenDecimals);
    return ret.dividedBy(divisor) + " " + self.config.allCoins[key].tokenShortName;
  };
}

module.exports = tokenFormatter;
