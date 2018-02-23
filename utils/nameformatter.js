
function nameFormatter(config) {
  this.conf = config;

  this.format = function(address,key) {
    if (this.conf.allCoins[key].names[address]) {
      return address.substr(0, 10) + "... (" + this.conf.allCoins[key].names[address] + ")";
    } else {
      return address;
    }
  }
}
module.exports = nameFormatter;
