var EticaToken = artifacts.require("./EticaToken.sol");

var solidityHelper =  require('./solidity-helper');
var miningHelper =  require('./mining-helper');
var networkInterfaceHelper =  require('./network-interface-helper');

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

  var test_account= {
      'address': '0x087964cd8b33ea47c01fbe48b70113ce93481e01',
      'privateKey': 'dca672104f895219692175d87b04483d31f53af8caad1d7348d269b35e21c3df'
  }




    it("can be minted", async function () {


      await printBalances(accounts)

  //canoe

  //7.3426930413956622283065143620738574142638959639431768834166324387693517887725e+76)

      var tokenContract = await EticaToken.deployed();

      console.log('contract')

      console.log(tokenContract.address)


      var challenge_number = await tokenContract.getChallengeNumber.call( );


    //  challenge_number = '0x513d3339b587b62e4ea2b9d2762113a245f9fdad264d37bcc6829ce66bd4d456';

      challenge_number = '0x085078f6e3066836445e800334b4186d99567065512edfe78fa7a4f611d51c3d'

       var solution_number = 1185888746
      var solution_digest = '0x000016d56489592359ce8e8b61ec335aeb7b7dd5695da22e25ab2039e02c8976'

      var from_address = '0x2B63dB710e35b0C4261b1Aa4fAe441276bfeb971';

      var targetString = await tokenContract.getMiningTarget.call({from: from_address});
      var target = web3.utils.toBN(targetString);

      console.log('target',target)

      var msg_sender = accounts[0]
  //  var challengeDigestBytes32 = solidityHelper.stringToSolidityBytes32(challenge_digest)
  //   const phraseDigesttest   = web3.utils.sha3(web3.utils.toHex(challenge_number), {encoding:"hex"});
    const phraseDigest = web3.utils.soliditySha3(challenge_number, from_address, solution_number )

  //  var challengeDigestBytes32 = solidityHelper.stringToSolidityBytes32(phraseDigest)
    console.log('phraseDigest', phraseDigest);  // 0x0007e4c9ad0890ee34f6d98852d24ce6e9cc6ecfad8f2bd39b7c87b05e8e050b
    console.log(solution_digest);
    console.log(solution_number)


    var checkDigest = await tokenContract.getMintDigest.call(solution_number,phraseDigest,challenge_number, {from: from_address});

    console.log('checkDigest',checkDigest)

    console.log('target',target)

    console.log('challenge_number',challenge_number)

    //var checkSuccess = await tokenContract.checkMintSolution.call(solution_number,phraseDigest,challenge_number, target );
    //  console.log('checkSuccess',checkSuccess)

  //  var mint_tokens = await tokenContract.mint.call(solution_number,phraseDigest, {from: from_address});

    // console.log("token mint: " + mint_tokens);


  //  assert.equal(true, mint_tokens ); //initialized

  });


  it("can be mined", async function () {


    await printBalances(accounts)


    var tokenContract = await EticaToken.deployed();

    console.log('contract')

    console.log(tokenContract.address)

    var test_account= {
        'address': '0x087964cd8b33ea47c01fbe48b70113ce93481e01',
        'privateKey': 'dca672104f895219692175d87b04483d31f53af8caad1d7348d269b35e21c3df'
    }


  //  var msg_sender = accounts[0]


        networkInterfaceHelper.init(web3,tokenContract,test_account);
        miningHelper.init(web3,tokenContract,test_account,networkInterfaceHelper);


  });


  async function printBalances(accounts) {
    // accounts.forEach(function(ac, i) {
       var balance_val = await (web3.eth.getBalance(accounts[0]));
       console.log('acct 0 balance', web3.utils.fromWei(balance_val.toString() , 'ether') )
    // })
   }
 });
