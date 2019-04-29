var EticaBosoms = artifacts.require("./EticaBosoms.sol");

// test suite
contract('EticaBosoms', function(accounts){
  var eticaBosomsInstance;
  var coinbaseuser = accounts[0];
  var eptestusersa = accounts[1];
  var eptestusersb = accounts[2];
  var eptestusersc = accounts[3];
  var eptestusersd = accounts[4];
  var eptestuserse = accounts[5];
  var eptestusersf = accounts[6];
  var eptestusersg = accounts[7];
  var eptestusersh = accounts[8];
  var eptestusersi = accounts[9];


  var oldbalancecoinbase = accounts[0];
  var oldbalancea = accounts[1];
  var oldbalanceb = accounts[2];
  var oldbalancec = accounts[3];
  var oldbalanced = accounts[4];
  var oldbalancee = accounts[5];
  var oldbalancef = accounts[6];
  var oldbalanceg = accounts[7];
  var oldbalanceh = accounts[8];
  var oldbalancei = accounts[9];

  var i;


  it("supply must equal initial supply", function() {
    return EticaBosoms.deployed().then(function(instance){
      eticaBosomsInstance = instance;
      return eticaBosomsInstance.totalSupply();
    }).then(function(receipt){
      // supply must equal initial supply
      console.log(receipt);
      assert.equal(receipt.toNumber(), "618033980.000000000000000000", "supply must equal 618033980.000000000000000000");
    })
  });


  it("each balance must be at 0 ETI", function() {
    for (i = 1; i < 10; i++) {
    return EticaBosoms.deployed().then(function(instance){
      eticaBosomsInstance = instance;
      return eticaBosomsInstance.balanceOf(accounts[i]);
    }).then(function(receipt){
      // supply must equal initial supply
      assert.equal(receipt.toNumber(), 0x0, "this account should not have any ETI! index of accounts is:" + i);
    })
    }
  });

});
