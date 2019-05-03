var EticaToken = artifacts.require("./EticaToken.sol");

// test suite
contract('EticaToken', function(accounts){
  var EticaTokenInstance;
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


  it("supply must equal initial supply 100 ETI", function() {
    return EticaToken.deployed().then(function(instance){
      EticaTokenInstance = instance;
      return EticaTokenInstance.totalSupply();
    }).then(function(receipt){
      // supply must equal initial supply
      console.log(receipt.toString());
      assert.equal(web3.utils.fromWei(receipt, "ether" ), "618033980", "supply must equal 618033980.000000000000000000");
    })
  });

  it("contract balance must equal  to 100 ETI", function() {
    return EticaToken.deployed().then(function(instance){
      EticaTokenInstance = instance;
      return EticaTokenInstance.balanceOf(EticaTokenInstance.address);
    }).then(function(contractbalance){
      // Contract balance should be equal to 100 ETI:
      assert.equal(web3.utils.fromWei(contractbalance, "ether" ), "100", "contract balance should equal 100 ETI");
      console.log('checked contract balance success -> contract balance is: ', web3.utils.fromWei(contractbalance, "ether" ), 'ETI');
    })
  });

  // NO PREMINE! NO FOUNDER TOKEN ISSUANCE! ETICA WILL BE FULLY DECENTRALISED
    it("all balances must be at 0 ETI", function() {
      for (i = 0; i < 10; i++) {
      return EticaToken.deployed().then(function(instance){
        EticaTokenInstance = instance;
        return EticaTokenInstance.balanceOf(accounts[i]);
      }).then(function(receipt){
        // supply must equal initial supply
        assert.equal(web3.utils.fromWei(receipt, "ether" ), 0x0, "this account should not have any ETI! index of accounts is:" + i);
      })
      }
    });




});
