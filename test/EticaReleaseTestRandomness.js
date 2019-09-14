var EticaRelease = artifacts.require("./EticaRelease.sol");

var solidityHelper =  require('./solidity-helper');
var miningHelper =  require('./mining-helper-fast');
var networkInterfaceHelper =  require('./network-interface-helper');
const truffleAssert = require('truffle-assertions');
var abi = require('ethereumjs-abi');

console.log('------------------- WELCOME ON THE ETICA PROTOCOL ---------------');
console.log('--------------->  NEUTRAL PROTOCOL FOR DECENTRALISED RESEARCH <------------------');

// test suite
contract('EticaRelease', function(accounts){
  var EticaReleaseInstance;
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
     'address': '0xBa2bD26950957368558dF231f13C3F767b904EC3',
     'privateKey': 'a04ea152108d978903f48b00feb753c4108ed3d39c4602d3f3e5b158129fba82'
 }

 var test_account2= {
    'address': '0xf7EE6506fE651505B68EE5E9aA42f17E63126156',
    'privateKey': '3f1f4741a79d1ee425819b304bdcddd189186dd183427218299d4e4325bf0411'
}

var test_account3= {
  'address': '0x3D39e128cbA9E431cE0eF2E783E81864fc2e0C34',
  'privateKey': '44d964eeec131409b26385c2eef1d63f7dfd703967b7af98b567b2d46a151579'
}

var test_account4= {
  'address': '0xD79e20A9DEfD15E8502697B55074a822Bf29192c',
  'privateKey': '26add5648161ce7488712f7e79c80f08358eb169867140200d050d2cff70763d'
}

var test_account5= {
  'address': '0xefd3FE5f37b38CC07F156f507eE1519b03317A9B',
  'privateKey': '24dd10d581b3876ec2922f56c3aa2eee6ba865322d87ad30354544237c6d0062'
}

 var miner_account= {
    'address': '0x5FBd856f7f0c79723100FF6e1450cC1464D3fffC',
    'privateKey': '16b271fdb3eb17a065d4227a3087fa140ba0f88d0d66e7eaa778e3e5c0c6838c'
}

var PROPOSAL_DEFAULT_VOTE = 10;

var EXPECTED_FIRST_DISEASE_HASH = '0xf6d8716087544b8fe1a306611913078dd677450d90295497e433503483ffea6e'; // FORMER 0xfca403d66ff4c1d6ea8f67e3a96689222557de5048b2ff6d9020d5a433f412aa

var EXPECTED_FIRST_PROPOSAL_PROPOSED_RELEASE_HASH = '0xa9b5a7156f9cd0076e0f093589e02d881392cc80806843b30a1bacf2efc810bb'; // FORMER 0x5f17034b05363de3cfffa94d9ae9c07534861c3cc1216e58a5c0f057607dbc00


    it("can be minted", async function () {


      await printBalances(accounts)

  //canoe

  //7.3426930413956622283065143620738574142638959639431768834166324387693517887725e+76)

      var tokenContract = await EticaRelease.deployed();

      //console.log('contract')

      //console.log(tokenContract.address)
      var from_address = '0x2B63dB710e35b0C4261b1Aa4fAe441276bfeb971';

      var challenge_number = '0x513d3339b587b62e4ea2b9d2762113a245f9fdad264d37bcc6829ce66bd4d456';


    //  challenge_number = '0x513d3339b587b62e4ea2b9d2762113a245f9fdad264d37bcc6829ce66bd4d456';

      challenge_number = '0x085078f6e3066836445e800334b4186d99567065512edfe78fa7a4f611d51c3d'

       var solution_number = 1185888746
      var solution_digest = '0x000016d56489592359ce8e8b61ec335aeb7b7dd5695da22e25ab2039e02c8976'

      //var from_address = '0x2B63dB710e35b0C4261b1Aa4fAe441276bfeb971';

      var targetString = await tokenContract.getMiningTarget.call({from: from_address});
      var target = web3.utils.toBN(targetString);

      //console.log('target',target)

      var msg_sender = accounts[0]
  //  var challengeDigestBytes32 = solidityHelper.stringToSolidityBytes32(challenge_digest)
  //   const phraseDigesttest   = web3.utils.sha3(web3.utils.toHex(challenge_number), {encoding:"hex"});
    const phraseDigest = web3.utils.soliditySha3(challenge_number, from_address, solution_number )

  //  var challengeDigestBytes32 = solidityHelper.stringToSolidityBytes32(phraseDigest)
    //console.log('phraseDigest', phraseDigest);  // 0x0007e4c9ad0890ee34f6d98852d24ce6e9cc6ecfad8f2bd39b7c87b05e8e050b
    //console.log(solution_digest);
    //console.log(solution_number)


    var checkDigest = await tokenContract.getMintDigest.call(solution_number,phraseDigest,challenge_number, {from: from_address});

    //console.log('checkDigest',checkDigest)

    //console.log('target',target)

    //console.log('challenge_number',challenge_number)

    //var checkSuccess = await tokenContract.checkMintSolution.call(solution_number,phraseDigest,challenge_number, target );
    //  console.log('checkSuccess',checkSuccess)

  //  var mint_tokens = await tokenContract.mint.call(solution_number,phraseDigest, {from: from_address});

    // console.log("token mint: " + mint_tokens);


  //  assert.equal(true, mint_tokens ); //initialized

  });


  it("can be mined", async function () {


    await printBalances(accounts)


    var tokenContract = await EticaRelease.deployed();

    //console.log('contract')

    //console.log(tokenContract.address)

   // ganache account 10 (index 9):
    var test_account= {
       'address': '0xBa2bD26950957368558dF231f13C3F767b904EC3',
       'privateKey': 'a04ea152108d978903f48b00feb753c4108ed3d39c4602d3f3e5b158129fba82'
   }

   var miner_account= {
      'address': '0x5FBd856f7f0c79723100FF6e1450cC1464D3fffC',
      'privateKey': '16b271fdb3eb17a065d4227a3087fa140ba0f88d0d66e7eaa778e3e5c0c6838c'
  }

  //  var msg_sender = accounts[0]


        networkInterfaceHelper.init(web3,tokenContract,miner_account,accounts);
        miningHelper.init(web3,tokenContract,miner_account,networkInterfaceHelper);


  });


  it("can get stakes length", async function () {
    return EticaRelease.deployed().then(function(instance){
      EticaReleaseInstance = instance;
      return EticaReleaseInstance.stakescount(test_account.address);
    }).then(async function(response){
      //console.log('!!!!!!!!!! test_acount NUMBER OF STAKES !!!!!!!!!!!!!');
      //console.log('!!!!!!!!!! test_acount NUMBER OF STAKES !!!!!!!!!!!!!');
      //console.log('!!!!!!!!!! test_acount NUMBER OF STAKES !!!!!!!!!!!!!');
      //console.log('!!!!!!!!!! test_acount NUMBER OF STAKES !!!!!!!!!!!!!');
    //console.log('test_acount NUMBER OF STAKES IS', response);
    let stakesl = await EticaReleaseInstance.stakescount(test_account.address);
    //console.log('RESPONSE IS::::', stakesl);
    //console.log('!!!!!!!!!! test_acount NUMBER OF STAKES !!!!!!!!!!!!!');
    //console.log('!!!!!!!!!! test_acount NUMBER OF STAKES !!!!!!!!!!!!!');
    //console.log('!!!!!!!!!! test_acount NUMBER OF STAKES !!!!!!!!!!!!!');
    //console.log('!!!!!!!!!! test_acount NUMBER OF STAKES !!!!!!!!!!!!!');
    })





  });


  it("can make initial distribution of ETI :", async function () {
    console.log('------------------------------------- Starting INITIAL ETI DISTRIBUTION ---------------------------');
    console.log('........................................  CAN MAKE INITIAL ETI DISTRIBUTION ? .......................');
    function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// wait long enough so that miner_account has mined a block and thus has ETI available
await timeout(30000);
return EticaRelease.deployed().then(function(instance){
  EticaReleaseInstance = instance;
  return EticaReleaseInstance.balanceOf(miner_account.address);
}).then(function(receipt){
console.log('asserting test_account balance');
assert(web3.utils.fromWei(receipt, "ether" ) > 0x0, 'miner_account should have mined ETI after 30000 ms! Please relaunch the test, you will be more lucky next time !');
}).then(async function(){
  console.log('transfering 10 ETI from miner_account to test_account');
  let test_accountbalancebefore = await EticaReleaseInstance.balanceOf(test_account.address);
  let miner_accountbalancebefore = await EticaReleaseInstance.balanceOf(miner_account.address);
  //console.log('miner_account ETI balance before:', web3.utils.fromWei(miner_accountbalancebefore, "ether" ));
  //console.log('test_account ETI balance before:', web3.utils.fromWei(test_accountbalancebefore, "ether" ));
  return EticaReleaseInstance.transfer(test_account.address,  web3.utils.toBN(10000000000000000000), {from: miner_account.address});

}).then(async function(){
  // consoling result of ETI transfer from miner_account to test_account
  let test_accountbalanceafter = await EticaReleaseInstance.balanceOf(test_account.address);
  let miner_accountbalanceafter = await EticaReleaseInstance.balanceOf(miner_account.address);
  //console.log('miner_account ETI balance after:', web3.utils.fromWei(miner_accountbalanceafter, "ether" ));
  //console.log('test_account ETI balance after:', web3.utils.fromWei(test_accountbalanceafter, "ether" ));
}).then(async function(){
  console.log('transfering 8 ETI from miner_account to test_account2');
  let miner_accountbalancebefore = await EticaReleaseInstance.balanceOf(miner_account.address);
  let test_account2balancebefore = await EticaReleaseInstance.balanceOf(test_account2.address);
  //console.log('miner_account ETI balance before:', web3.utils.fromWei(miner_accountbalancebefore, "ether" ));
  //console.log('test_account2 ETI balance before:', web3.utils.fromWei(test_account2balancebefore, "ether" ));
  return EticaReleaseInstance.transfer(test_account2.address,  web3.utils.toBN(8000000000000000000), {from: miner_account.address});

}).then(async function(){
  let miner_accountbalanceafter = await EticaReleaseInstance.balanceOf(miner_account.address);
  let test_account2balanceafter = await EticaReleaseInstance.balanceOf(test_account2.address);
  //console.log('miner_account ETI balance after:', web3.utils.fromWei(miner_accountbalanceafter, "ether" ));
  //console.log('test_account2 ETI balance after:', web3.utils.fromWei(test_account2balanceafter, "ether" ));
  console.log('...................................  TESTS CAN START, ACCOUNTS HAVE BEEN GIVEN ETI FOR TESTING  ....................... ');
  console.log('---------------------------------------- END OF INITIAL ETI DISTRIBUTION with SUCCESS ----------------------------------------------');
})

  });

// test eticatobosom
  it("can stake eticas for bosoms :", async function () {
    console.log('------------------------------------- Starting test ---------------------------');
    console.log('................................  CAN STAKE ETI for BOSOMS ? .......................');
    let test_accountbalancebefore = await EticaReleaseInstance.balanceOf(test_account.address);
    let test_accountbosomsbefore = await EticaReleaseInstance.bosomsOf(test_account.address);
    //console.log('test_account ETI balance before:', web3.utils.fromWei(test_accountbalancebefore, "ether" ));
    //console.log('test_account Bosoms balance before:', web3.utils.fromWei(test_accountbosomsbefore, "ether" ));
   // try staking 10 ETI:
      return EticaReleaseInstance.eticatobosoms(test_account.address,  web3.utils.toBN(10000000000000000000), {from: test_account.address}).then(async function(receipt){
    let test_accountbalanceafter = await EticaReleaseInstance.balanceOf(test_account.address);
    let test_accountbosomsafter = await EticaReleaseInstance.bosomsOf(test_account.address);
    //console.log('test_account ETI balance after:', web3.utils.fromWei(test_accountbalanceafter, "ether" ));
    //console.log('test_account Bosoms balance after:', web3.utils.fromWei(test_accountbosomsafter, "ether" ));
    assert.equal(web3.utils.fromWei(test_accountbosomsafter, "ether" ), "10", 'test_account should have 10 Bosoms!');
    assert.equal(web3.utils.fromWei(test_accountbalancebefore, "ether" ) - web3.utils.fromWei(test_accountbalanceafter, "ether" ), "10", 'test_account should have 10 Eticas less!');

    return EticaReleaseInstance.eticatobosoms(test_account2.address,  web3.utils.toBN(6000000000000000000), {from: test_account2.address}).then(async function(receipt){

    console.log('.................................  CAN STAKE ETI for BOSOMS  ....................... ');
    console.log('---------------------------------- END OF TEST with SUCCESS ----------------------------');
    })
    })

  });

  // Should fail try to stake more eticas than available in wallet
    it("cannot OVER stake eticas for bosoms :", async function () {
      console.log('------------------------------------ Starting test ---------------------------');
      console.log('................................  OVERSTAKING IS NOT POSSIBLE ? .......................');
      let test_accountbalancebefore = await EticaReleaseInstance.balanceOf(test_account.address);
      let test_accountbosomsbefore = await EticaReleaseInstance.bosomsOf(test_account.address);
      //console.log('test_account ETI balance before:', web3.utils.fromWei(test_accountbalancebefore, "ether" ));
      //console.log('test_account Bosoms balance before:', web3.utils.fromWei(test_accountbosomsbefore, "ether" ));
      let stakeamount = 300000;
      let overstake = web3.utils.toWei(stakeamount.toString(), 'ether');
     // try staking 300000 ETI:
        return EticaReleaseInstance.eticatobosoms(test_account.address,  web3.utils.toBN(overstake), {from: test_account.address}).then(assert.fail)
        .catch(async function(error){
          assert(true);
          let test_accountbalanceafter = await EticaReleaseInstance.balanceOf(test_account.address);
          let test_accountbosomsafter = await EticaReleaseInstance.bosomsOf(test_account.address);
          //console.log('test_account ETI balance after:', web3.utils.fromWei(test_accountbalanceafter, "ether" ));
          //console.log('test_account Bosoms balance after:', web3.utils.fromWei(test_accountbosomsafter, "ether" ));
          assert.equal(web3.utils.fromWei(test_accountbosomsafter, "ether" ), web3.utils.fromWei(test_accountbosomsbefore, "ether" ), 'test_account should not have more Bosoms!');
          assert.equal(web3.utils.fromWei(test_accountbalancebefore, "ether" ) - web3.utils.fromWei(test_accountbalanceafter, "ether" ), "0", 'test_account should not have less Eticas!');
          //console.log('Over Staking has been tested successfully');
          console.log('.................................  OVERSTAKING IS NOT POSSIBLE  ....................... ');
          console.log('----------------------------------- END OF TEST with SUCCESS ----------------------------');
        })

    });

  /*
    // test Period creation and issuance (need to make NewPeriod() function public for this test)
      it("can create new Period and issue Period Reward's ETI:", async function () {
        console.log('------------------------------------ Starting test ---------------------------');
        console.log('................................  CAN CREATE A PERIOD ? .......................');
        let supply_before = await EticaReleaseInstance.totalSupply();
        let contractbalancebefore = await EticaReleaseInstance.balanceOf(EticaReleaseInstance.address);
        //console.log('SUPPLY ETI before Period creation:', web3.utils.fromWei(supply_before, "ether" ));
        //console.log('CONTRACT ETI balance before Period creation:', web3.utils.fromWei(contractbalancebefore, "ether" ));
        let first_period = await EticaReleaseInstance.periods(1);
        let periodsCounter = await EticaReleaseInstance.periodsCounter();
       //console.log('(should be empty as no period exists yet) FIRST PERIOD IS:', first_period);
       //console.log('(should be 0 as no period exists yet)NUMBER OF PERIODS IS:', periodsCounter);
       // try create new period:
          return EticaReleaseInstance.newPeriod().then(async function(receipt){
            let supply_after = await EticaReleaseInstance.totalSupply();
            let contractbalanceafter = await EticaReleaseInstance.balanceOf(EticaReleaseInstance.address);
            //console.log('SUPPLY ETI after Period creation:', web3.utils.fromWei(supply_after, "ether" ));
            //console.log('CONTRACT ETI balance after Period creation:', web3.utils.fromWei(contractbalanceafter, "ether" ));
            let first_period = await EticaReleaseInstance.periods(1);
            let periodsCounter = await EticaReleaseInstance.periodsCounter();
        //console.log('THE FIRST PERIOD IS:', first_period);
        //console.log('INTERVAL OF THE FIRST PERIOD IS:', first_period.interval.toNumber());
        //console.log('NUMBER OF PERIODS IS:', periodsCounter);
        assert.equal(first_period.id.toNumber(), 1, 'First period should exists');
        assert.equal(periodsCounter, 1, 'First period should exists');
        assert.equal(first_period.total_voters.toNumber(), 0, 'First period nb voters should be 0');
        console.log('................................  CAN CREATE A PERIOD  ....................... ');
        console.log('------------------------------- END OF TEST with SUCCESS ----------------------------');
        })
      });

      */


      it("can get stakes length", async function () {
        return EticaRelease.deployed().then(function(instance){
          EticaReleaseInstance = instance;
          return EticaReleaseInstance.stakescount(test_account.address);
        }).then(async function(response){
          //console.log('!!!!!!!!!! test_acount NUMBER OF STAKES !!!!!!!!!!!!!');
          //console.log('!!!!!!!!!! test_acount NUMBER OF STAKES !!!!!!!!!!!!!');
          //console.log('!!!!!!!!!! test_acount NUMBER OF STAKES !!!!!!!!!!!!!');
          //console.log('!!!!!!!!!! test_acount NUMBER OF STAKES !!!!!!!!!!!!!');
        //console.log('test_acount NUMBER OF STAKES IS', response);
        let stakesl = await EticaReleaseInstance.stakescount(test_account.address);
        //console.log('RESPONSE IS::::', stakesl);
        //console.log('!!!!!!!!!! test_acount NUMBER OF STAKES !!!!!!!!!!!!!');
        //console.log('!!!!!!!!!! test_acount NUMBER OF STAKES !!!!!!!!!!!!!');
        //console.log('!!!!!!!!!! test_acount NUMBER OF STAKES !!!!!!!!!!!!!');
        //console.log('!!!!!!!!!! test_acount NUMBER OF STAKES !!!!!!!!!!!!!');
        })





      });


    /*
      // test Period multiple issuance should fail (need to make NewPeriod() function public for this test)
        it("cannot create 2 Periods with same Interval :", async function () {
          console.log('------------------------------- Starting test ---------------------------');
          console.log('.......................... Cannot CREATE 2 PERIODS with same Interval ? ..................... ');
          let supply_before = await EticaReleaseInstance.totalSupply();
          let contractbalancebefore = await EticaReleaseInstance.balanceOf(EticaReleaseInstance.address);
          //console.log('SUPPLY ETI before Period creation:', web3.utils.fromWei(supply_before, "ether" ));
          //console.log('CONTRACT ETI balance before Period creation:', web3.utils.fromWei(contractbalancebefore, "ether" ));
          let first_period = await EticaReleaseInstance.periods(1);
          let periodsCounter = await EticaReleaseInstance.periodsCounter();
         //console.log('FIRST PERIOD IS:', first_period);
         //console.log('NUMBER OF PERIODS IS:', periodsCounter);
         // try create new period:
            return EticaReleaseInstance.newPeriod().then(assert.fail)
            .catch(async function(error){
              assert(true);
              let supply_after = await EticaReleaseInstance.totalSupply();
              let contractbalanceafter = await EticaReleaseInstance.balanceOf(EticaReleaseInstance.address);
              //console.log('SUPPLY ETI after Period creation:', web3.utils.fromWei(supply_after, "ether" ));
              //console.log('CONTRACT ETI balance after Period creation:', web3.utils.fromWei(contractbalanceafter, "ether" ));
              let first_period = await EticaReleaseInstance.periods(1);
              let periodsCounter = await EticaReleaseInstance.periodsCounter();
          //console.log('THE FIRST PERIOD IS:', first_period);
          //console.log('INTERVAL OF THE FIRST PERIOD IS:', first_period.interval.toNumber());
          //console.log('NUMBER OF PERIODS IS:', periodsCounter);
          assert.equal(periodsCounter, 1, 'Only First period should exist, no other period should have been created for same interval');
          console.log('........................... CREATING 2 PERIODS WITH SAME INTERVAL IS NOT POSSIBLE ....................... ');
          console.log('------------------------------- END OF TEST with SUCCESS ---------------------------');
            })

        });

      */  

        // test Stake claiming too soon should fail
          it("cannot claim stake too early :", async function () {
            console.log('------------------------------- Starting test ---------------------------');
            console.log('.......................... Cannot CLAIM STAKE TOO EARLY ? ..................... ');
            let test_accountbalancebefore = await EticaReleaseInstance.balanceOf(test_account.address);
            let test_accountstakebefore = await EticaReleaseInstance.stakes(test_account.address, 1);
            //console.log('test_account ETI balance before:', web3.utils.fromWei(test_accountbalancebefore, "ether" ));
            //console.log('test_account Stake before:', test_accountstakebefore);
            //console.log('test_account Stake amount before:', web3.utils.fromWei(test_accountstakebefore.amount, "ether" ));

           // try create new period:
              return EticaReleaseInstance.stakeclmidx(1, {from: test_account.address}).then(assert.fail)
              .catch(async function(error){
                assert(true);
                let test_accountbalanceafter = await EticaReleaseInstance.balanceOf(test_account.address);
                let test_accountstakeafter = await EticaReleaseInstance.stakes(test_account.address,1);
                //console.log('test_account ETI balance after:', web3.utils.fromWei(test_accountbalanceafter, "ether" ));
                //console.log('test_account Stake after:', test_accountstakeafter);
                assert.equal(web3.utils.fromWei(test_accountbalancebefore, "ether" ) - web3.utils.fromWei(test_accountbalanceafter, "ether" ), "0", 'test_account should not have more Eticas!');
                console.log('........................... Too early STAKING is not possible ....................... ');
                console.log('------------------------------- END OF TEST with SUCCESS ---------------------------');
              });

          });

          // test Stake claiming too soon should fail
            it("cannot claim stake too early 2 (just before stake end):", async function () {
              console.log('------------------------------- Starting test ---------------------------');
              console.log('.......................... Cannot CLAIM STAKE TOO EARLY 2 (just before stake end) ?  ..................... ');
              let test_accountbalancebefore = await EticaReleaseInstance.balanceOf(test_account.address);
              let test_accountstakebefore = await EticaReleaseInstance.stakes(test_account.address, 1);
              //console.log('test_account ETI balance before:', web3.utils.fromWei(test_accountbalancebefore, "ether" ));
              //console.log('test_account Stake before:', test_accountstakebefore);
              //console.log('test_account Stake amount before:', web3.utils.fromWei(test_accountstakebefore.amount, "ether" ));


              //console.log('stake starting block is:', test_accountstakebefore.startTime.toString());
              //console.log('stake ending block is:', test_accountstakebefore.endTime.toString());

              console.log('------------- BEGIN BLOCKS ADVANCEMENT --------------');
              let blocknb_before = await web3.eth.getBlock("latest");
              console.log('LastBlock\'s NUMBER IS:', blocknb_before.number);
              console.log('LastBlock\'s TIMESTAMP IS:', blocknb_before.timestamp);
              console.log('------------- ADVANCING BLOCKS --------------');
              await advanceminutes(3);
              console.log('------------- ADVANCING BLOCKS --------------');
              let blocknb_after = await web3.eth.getBlock("latest");
              console.log('LastBlock\'s NUMBER IS NOW:', blocknb_after.number);
              console.log('LastBlock\'s TIMESTAMP IS NOW:', blocknb_after.timestamp);
              console.log('------------- BLOCKS ADVANCED --------------');

             // try create new period:
                return EticaReleaseInstance.stakeclmidx(1, {from: test_account.address}).then(assert.fail)
                .catch(async function(error){
                  assert(true);
                  let test_accountbalanceafter = await EticaReleaseInstance.balanceOf(test_account.address);
                  let test_accountstakeafter = await EticaReleaseInstance.stakes(test_account.address,1);
                  //console.log('test_account ETI balance after:', web3.utils.fromWei(test_accountbalanceafter, "ether" ));
                  //console.log('test_account Stake after:', test_accountstakeafter);
                  assert.equal(web3.utils.fromWei(test_accountbalanceafter, "ether" ) - web3.utils.fromWei(test_accountbalancebefore, "ether" ), "0", 'test_account should not have more Eticas!');
                  console.log('........................... Too early STAKING is not possible even just before End of Stake ....................... ');
                  console.log('------------------------------- END OF TEST with SUCCESS ---------------------------');
                });

            });



                      // test Stake claiming should work if stake end has been reached and user has not made any vote or action that could have blocked eticas:
                      it("can claim stake after stake end ", async function () {
                        console.log('------------------------------- Starting test ---------------------------');
                        console.log('.......................... Can claim STAKE after THE STAKE END ? (when user has not made any vote or action that could have blocked eticas) ..................... ');
                        let test_accountbalancebefore = await EticaReleaseInstance.balanceOf(test_account.address);
                        let test_accountstakebefore = await EticaReleaseInstance.stakes(test_account.address, 1);
                        //console.log('test_account ETI balance before:', web3.utils.fromWei(test_accountbalancebefore, "ether" ));
                        //console.log('test_account Stake before:', test_accountstakebefore);
                        //console.log('test_account Stake amount before:', web3.utils.fromWei(test_accountstakebefore.amount, "ether" ));
          
                        console.log('------------- BEGIN BLOCKS ADVANCEMENT --------------');
                        let blocknb_before = await web3.eth.getBlock("latest");
                        console.log('LastBlock\'s NUMBER IS:', blocknb_before.number);
                        console.log('LastBlock\'s TIMESTAMP IS:', blocknb_before.timestamp);
                        console.log('------------- ADVANCING BLOCKS --------------');
                        await advanceminutes(1);
                        console.log('------------- ADVANCING BLOCKS --------------');
                        let blocknb_after = await web3.eth.getBlock("latest");
                        console.log('LastBlock\'s NUMBER IS NOW:', blocknb_after.number);
                        console.log('LastBlock\'s TIMESTAMP IS NOW:', blocknb_after.timestamp);
                        console.log('------------- BLOCKS ADVANCED --------------');
          
                       // try create to claim a stake after it has ended:
                          return EticaReleaseInstance.stakeclmidx(1, {from: test_account.address}).then(async function(resp){
                            assert(true);
                            let test_accountbalanceafter = await EticaReleaseInstance.balanceOf(test_account.address);
                            let test_accountstakeafter = await EticaReleaseInstance.stakes(test_account.address,1);
                            let stakenoldbalance = web3.utils.toBN(test_accountbalancebefore).add(web3.utils.toBN(test_accountstakebefore.amount)).toString();
                            //console.log('------test_account ETI balance after:', web3.utils.fromWei(test_accountbalanceafter, "ether" ));
                            //console.log('------stakenoldbalance is:::', web3.utils.fromWei(stakenoldbalance, "ether"));
                            //console.log('test_account Stake after:', test_accountstakeafter);
          
                            assert.equal( web3.utils.fromWei(test_accountbalanceafter, "ether"), web3.utils.fromWei(stakenoldbalance, "ether"), 'test_account should have increased by the stake\'s ETI amount!');
          
                            console.log('........................... Can claim STAKE after THE STAKE END (when user has not made any vote or action that could have blocked eticas) ....................... ');
                            console.log('------------------------------- END OF TEST with SUCCESS ---------------------------');
                          });
          
                      });


            it("can get stakes length", async function () {
              return EticaRelease.deployed().then(function(instance){
                EticaReleaseInstance = instance;
                return EticaReleaseInstance.stakescount(test_account.address);
              }).then(async function(response){
                //console.log('!!!!!!!!!! test_acount NUMBER OF STAKES AFTER CLAIM STAKE !!!!!!!!!!!!!');
                //console.log('!!!!!!!!!! test_acount NUMBER OF STAKES AFTER CLAIM STAKE !!!!!!!!!!!!!');
                //console.log('!!!!!!!!!! test_acount NUMBER OF STAKES AFTER CLAIM STAKE !!!!!!!!!!!!!');
                //console.log('!!!!!!!!!! test_acount NUMBER OF STAKES AFTER CLAIM STAKE !!!!!!!!!!!!!');
              //console.log('test_acount NUMBER OF STAKES IS', response);
              let stakesl = await EticaReleaseInstance.stakescount(test_account.address);
              //console.log('RESPONSE IS::::', stakesl);
              //console.log('!!!!!!!!!! test_acount NUMBER OF STAKES AFTER CLAIM STAKE !!!!!!!!!!!!!');
              //console.log('!!!!!!!!!! test_acount NUMBER OF STAKES AFTER CLAIM STAKE !!!!!!!!!!!!!');
              //console.log('!!!!!!!!!! test_acount NUMBER OF STAKES AFTER CLAIM STAKE !!!!!!!!!!!!!');
              //console.log('!!!!!!!!!! test_acount NUMBER OF STAKES AFTER CLAIM STAKE !!!!!!!!!!!!!');
              })





            });





            // test Disease creation without enough ETI should fail
              it("cannot create a new disease if account has not enough ETI:", async function () {
                console.log('------------------------------- Starting test ---------------------------');
                console.log('.......................... Cannot CREATE A NEW DISEASE IF ACCOUNT HAS NOT ENOUGH ETI ?  ..................... ');
                let test_accountbalancebefore = await EticaReleaseInstance.balanceOf(test_account.address);
                let first_disease = await EticaReleaseInstance.diseases(1);
                let diseasesCounter = await EticaReleaseInstance.diseasesCounter();
                //console.log('test_account ETI balance before:', web3.utils.fromWei(test_accountbalancebefore, "ether" ));
                //console.log('(should be empty as no disease exists yet) FIRST DISEASE IS:', first_disease);
                //console.log('(should be 0 as no disease exists yet) NUMBER OF DISEASES IS:', diseasesCounter);
                assert.equal(diseasesCounter, "0", 'THERE SHOULD NOT BE ANY DISEASE YET');


               // try create new disease:
                  return EticaReleaseInstance.createdisease("Malaria", {from: test_account.address}).then(assert.fail)
                  .catch(async function(error){
                    assert(true);
                    let test_accountbalanceafter = await EticaReleaseInstance.balanceOf(test_account.address);
                    let first_disease = await EticaReleaseInstance.diseases(1);
                    let diseasesCounter = await EticaReleaseInstance.diseasesCounter();
                    //console.log('test_account ETI balance before:', web3.utils.fromWei(test_accountbalanceafter, "ether" ));
                    //console.log('(should be empty as no disease exists yet) FIRST DISEASE IS:', first_disease);
                    //console.log('(should be 0 as no disease exists yet) NUMBER OF DISEASES IS:', diseasesCounter);
                    assert.equal(diseasesCounter, "0", 'THERE SHOULD NOT BE ANY DISEASE YET');
                    console.log('........................... Cannot CREATE A NEW DISEASE IF ACCOUNT HAS NOT ENOUGH ETI ....................... ');
                    console.log('------------------------------- END OF TEST with SUCCESS ---------------------------');
                  });

              });



            // test Diseases creation
              it("can create new Disease", async function () {
                console.log('------------------------------------ Starting test ---------------------------');
                console.log('................................  CAN CREATE A DISEASE ? .......................');
                let miner_accountbalancebefore = await EticaReleaseInstance.balanceOf(miner_account.address);
                //console.log('miner account balance before is', web3.utils.fromWei(miner_accountbalancebefore, "ether" ));
                let diseasesCreationAmount = await EticaReleaseInstance.DISEASE_CREATION_AMOUNT();
                //console.log('DISEASES CREATION AMOUNT IS:', diseasesCreationAmount);


                console.log('------------------------------------- WAITING FOR MINER_ACCOUNT TO MINE MORE ETI ---------------------------');
                function timeout(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }

            // wait long enough so that miner_account has mined enough blocks and thus has enough ETI available (more than DISEASE_CREATION_AMOUNT)
            await timeout(80000);

            let miner_balance = await EticaReleaseInstance.balanceOf(miner_account.address);
            //console.log('asserting miner_account balance(', web3.utils.fromWei(miner_balance, "ether" ),'ETI) is greater than DISEASE_CREATION_AMOUNT');
            assert(web3.utils.fromWei(miner_balance, "ether" ) > 100, 'miner_account should have mined more than 100 ETI after 80000 ms! Please relaunch the test, you will be more lucky next time !');

            return EticaReleaseInstance.transfer(test_account.address,  web3.utils.toWei('100', 'ether'), {from: miner_account.address}).then(async function(response){

              let miner_accountbalanceafter_transfer = await EticaReleaseInstance.balanceOf(miner_account.address);
              let test_accountbalance_before_createdisease = await EticaReleaseInstance.balanceOf(test_account.address);
              let contract_balance_before_createdisease = await EticaReleaseInstance.balanceOf(EticaReleaseInstance.address);
              //console.log('miner account balance after transfer is', web3.utils.fromWei(miner_accountbalanceafter_transfer, "ether" ));

            let first_disease = await EticaReleaseInstance.diseases(1);
            let diseasesCounter = await EticaReleaseInstance.diseasesCounter();
           //console.log('(should be empty as no disease exists yet) FIRST DISEASE IS:', first_disease);
           //console.log('(should be 0 as no disease exists yet) NUMBER OF DISEASES IS:', diseasesCounter);
           //console.log('NUMBER OF DISEASES IS:', diseasesCounter);
           //console.log('test_account balance before Disease Creation is', web3.utils.fromWei(test_accountbalance_before_createdisease, "ether" ));
           //console.log('contract balance before Disease Creation is', web3.utils.fromWei(contract_balance_before_createdisease, "ether" ));
           // try create new disease:
              return EticaReleaseInstance.createdisease("Malaria", {from: test_account.address}).then(async function(receipt){
                let first_disease = await EticaReleaseInstance.diseases(1);
                let diseasesCounter = await EticaReleaseInstance.diseasesCounter();
                let test_accountbalance_after_createdisease = await EticaReleaseInstance.balanceOf(test_account.address);
                let contract_balance_after_createdisease = await EticaReleaseInstance.balanceOf(EticaReleaseInstance.address);
            //console.log('THE FIRST DISEASE IS:', first_disease);
            //console.log('NAME OF THE FIRST DISEASE IS:', first_disease.name);
            //console.log('NUMBER OF DISEASES IS:', diseasesCounter);

            // check diseases mapping insertion:
            assert.equal(first_disease.disease_hash, EXPECTED_FIRST_DISEASE_HASH, 'First disease should exists with right diseasehash');
            assert.equal(first_disease.name, 'Malaria', 'First disease should exists with right name');
            assert.equal(diseasesCounter, 1, 'There should be exactly 1 disease at this point');

            // check diseasesbyIds and diseasesbyNames mappings insertion:
            let indexfromhash = await EticaReleaseInstance.diseasesbyIds(EXPECTED_FIRST_DISEASE_HASH);
            let hashfromname = await EticaReleaseInstance.getdiseasehashbyName('Malaria');

            assert.equal(indexfromhash, '1', 'first proposal disease hash should have an entry in diseasesbyIds with value of 1');
            assert.equal(hashfromname, EXPECTED_FIRST_DISEASE_HASH, 'Malaria should have an entry in diseasesbyNames with value of EXPECTED_FIRST_DISEASE_HASH');

            // test_account should have paid 100 ETI to contract
               // test_account should have 100 ETI less
                 assert.equal(web3.utils.fromWei(test_accountbalance_before_createdisease, "ether" ) - web3.utils.fromWei(test_accountbalance_after_createdisease, "ether" ), 100);
                 //console.log('test_account balance after Disease Creation is', web3.utils.fromWei(test_accountbalance_after_createdisease, "ether" ));

               // contract should have 100 ETI more
                  assert.equal(web3.utils.fromWei(contract_balance_after_createdisease, "ether" ) - web3.utils.fromWei(contract_balance_before_createdisease, "ether" ), 100);
                  //console.log('contract balance after Disease Creation is', web3.utils.fromWei(contract_balance_after_createdisease, "ether" ));


            console.log('................................  CAN CREATE A DISEASE  ....................... ');
            console.log('------------------------------- END OF TEST with SUCCESS ----------------------------');
            })

            })

                });


                // test_account will need more ETI to keep going with tests
                  it("Get more ETI and stake them for bosoms:", async function () {
                    console.log('------------------------------------- Starting task ---------------------------');
                    console.log('................................  CAN GET MORE ETI AND STAKE THEM for more BOSOMS ? .......................');
                    let test_accountbalancebefore = await EticaReleaseInstance.balanceOf(test_account.address);
                    let test_accountbosomsbefore = await EticaReleaseInstance.bosomsOf(test_account.address);
                    //console.log('test_account ETI balance before transfer:', web3.utils.fromWei(test_accountbalancebefore, "ether" ));
                    //console.log('test_account Bosoms balance before transfer:', web3.utils.fromWei(test_accountbosomsbefore, "ether" ));

                    console.log('transfering 10 ETI from miner_account to test_account');
                    let miner_accountbalancebefore = await EticaReleaseInstance.balanceOf(miner_account.address);
                    //console.log('miner_account ETI balance before:', web3.utils.fromWei(miner_accountbalancebefore, "ether" ));
                    return EticaReleaseInstance.transfer(test_account.address,  web3.utils.toBN(10000000000000000000), {from: miner_account.address}).then(async function(receipt){

                      let test_accountbalancebefore_newstaking = await EticaReleaseInstance.balanceOf(test_account.address);
                      let test_accountbosomsbefore_newstaking = await EticaReleaseInstance.bosomsOf(test_account.address);
                      //console.log('test_account ETI balance before new staking:', web3.utils.fromWei(test_accountbalancebefore_newstaking, "ether" ));
                      //console.log('test_account Bosoms balance before new staking:', web3.utils.fromWei(test_accountbosomsbefore_newstaking, "ether" ));

                      assert.equal(web3.utils.fromWei(test_accountbosomsbefore, "ether" ), web3.utils.fromWei(test_accountbosomsbefore_newstaking, "ether" ), 'test_account should have same amount of Bosoms!');
                      assert.equal(web3.utils.fromWei(test_accountbalancebefore_newstaking, "ether" ) - web3.utils.fromWei(test_accountbalancebefore, "ether" ), "10", 'test_account should have 10 Eticas more!');

                    // try staking 10 ETI more (test_account has already staked 10 ETI thus it should have 20 Bosoms after this stake):
                      return EticaReleaseInstance.eticatobosoms(test_account.address,  web3.utils.toBN(10000000000000000000), {from: test_account.address}).then(async function(receipt){
                    let test_accountbalanceafter = await EticaReleaseInstance.balanceOf(test_account.address);
                    let test_accountbosomsafter = await EticaReleaseInstance.bosomsOf(test_account.address);
                    //console.log('test_account ETI balance after new staking:', web3.utils.fromWei(test_accountbalanceafter, "ether" ));
                    //console.log('test_account Bosoms balance after new staking:', web3.utils.fromWei(test_accountbosomsafter, "ether" ));
                    assert.equal(web3.utils.fromWei(test_accountbosomsafter, "ether" ), "20", 'test_account should have 20 Bosoms!');
                    assert.equal(web3.utils.fromWei(test_accountbalancebefore_newstaking, "ether" ) - web3.utils.fromWei(test_accountbalanceafter, "ether" ), "10", 'test_account should have 10 Eticas less!');

                    return EticaReleaseInstance.eticatobosoms(test_account2.address,  web3.utils.toBN(2000000000000000000), {from: test_account2.address}).then(async function(receipt){

                      return EticaReleaseInstance.eticatobosoms(miner_account.address,  web3.utils.toBN(2000000000000000000), {from: miner_account.address}).then(async function(receipt){

                        console.log('.....................   CAN GET MORE ETI AND STAKE THEM for more BOSOMS  ....................... ');
                        console.log('---------------------------------- END OF TASK with SUCCESS ----------------------------');
                        })


                    })
                    })
                    })

                  });


                // test Proposals creation
                  it("can create new Proposal", async function () {
                    console.log('------------------------------------ Starting test ---------------------------');
                    console.log('................................  CAN CREATE A PROPOSAL ? .......................');

                    let idofstruct = await EticaReleaseInstance.diseasesbyIds(EXPECTED_FIRST_DISEASE_HASH);
                    //console.log('idofstruct id: ', idofstruct);

                    let test_accountbalancebefore = await EticaReleaseInstance.balanceOf(test_account.address);
                    //console.log('test_account ETI balance before:', web3.utils.fromWei(test_accountbalancebefore, "ether" ));

                    let test_accountbosomsbefore = await EticaReleaseInstance.bosoms(test_account.address);
                    //console.log('test_account Bosoms before:', web3.utils.fromWei(test_accountbosomsbefore, "ether" ));


                    return EticaReleaseInstance.propose(EXPECTED_FIRST_DISEASE_HASH, "Proposal Crisper K32 for Malaria", "Using Crisper to treat Malaria", "QmWWQSuPMS6aXCbZKpEjPHPUZN2NjB3YrhJTHsV4X3vb2t", "QmT4AeWE9Q9EaoyLJiqaZuYQ8mJeq4ZBncjjFH9dQ9uDVA", "QmT9qk3CRYbFDWpDFYeAv8T8H1gnongwKhh5J68NLkLir6","Targets:[one_target_here,another_target_here]","Compounds:[one_compound_here, another_compound_here]","Use this field as the community created standards", {from: test_account.address}).then(async function(response){

                    let first_proposal = await EticaReleaseInstance.proposals(EXPECTED_FIRST_PROPOSAL_PROPOSED_RELEASE_HASH);
                    let proposalsCounter = await EticaReleaseInstance.proposalsCounter();
                    //console.log('THE FIRST PROPOSAL IS:', first_proposal);

                    let first_proposal_ipfs = await EticaReleaseInstance.propsipfs(EXPECTED_FIRST_PROPOSAL_PROPOSED_RELEASE_HASH);
                    //console.log('THE FIRST PROPOSAL IPFS IS:', first_proposal_ipfs);

                    let first_proposal_data = await EticaReleaseInstance.propsdatas(EXPECTED_FIRST_PROPOSAL_PROPOSED_RELEASE_HASH);
                    //console.log('THE FIRST PROPOSAL DATA IS:', first_proposal_data);

                    let first_proposal_freefields = await EticaReleaseInstance.propsfreefields(EXPECTED_FIRST_PROPOSAL_PROPOSED_RELEASE_HASH);
                    //console.log('THE FIRST PROPOSAL FREEFIELDS IS:', first_proposal_freefields);

                    // check Proposal's general information:
                    assert.equal(first_proposal.disease_id, EXPECTED_FIRST_DISEASE_HASH, 'First proposal should exist with right disease_id');
                    assert(first_proposal.period_id >= 1);
                    assert.equal(first_proposal.title, 'Proposal Crisper K32 for Malaria', 'First proposal should exist with right name');
                    assert.equal(first_proposal.description, 'Using Crisper to treat Malaria', 'First proposal should exist with right description');
                    assert.equal(proposalsCounter, 1, 'There should be exactly 1 proposal at this point');

                    // check Proposal's IPFS:
                    assert.equal(first_proposal_ipfs.raw_release_hash, 'QmWWQSuPMS6aXCbZKpEjPHPUZN2NjB3YrhJTHsV4X3vb2t', 'First proposal should exist with right raw_release_hash');
                    assert.equal(first_proposal_ipfs.old_release_hash, 'QmT4AeWE9Q9EaoyLJiqaZuYQ8mJeq4ZBncjjFH9dQ9uDVA', 'First proposal should exist with right old_release_hash');
                    assert.equal(first_proposal_ipfs.grandparent_hash, 'QmT9qk3CRYbFDWpDFYeAv8T8H1gnongwKhh5J68NLkLir6', 'First proposal should exist with right grandparent_hash');

                    // check Proposal's FREEFIELDS:
                    assert.equal(first_proposal_freefields.firstfield, 'Targets:[one_target_here,another_target_here]', 'First proposal should exist with right firstfield');
                    assert.equal(first_proposal_freefields.secondfield, 'Compounds:[one_compound_here, another_compound_here]', 'First proposal should exist with right secondfield');
                    assert.equal(first_proposal_freefields.thirdfield, 'Use this field as the community created standards', 'First proposal should exist with right thirdfield');

                    // check Proposal's DATA:
                    assert.equal(first_proposal_data.status, '2', 'First proposal should exist with right status');
                    assert.equal(first_proposal_data.istie, true, 'First proposal should exist with right istie');
                    assert.equal(first_proposal_data.prestatus, '3', 'First proposal should exist with right prestatus');
                    assert.equal(first_proposal_data.nbvoters, '0', 'First proposal should exist with right nbvoters');
                    assert.equal(first_proposal_data.slashingratio.toNumber(), '0', 'First proposal should exist with right slashingratio');
                    assert.equal(web3.utils.fromWei(first_proposal_data.forvotes.toString()), '0', 'First proposal should exist with right forvotes');
                    assert.equal(web3.utils.fromWei(first_proposal_data.againstvotes.toString()), '0', 'First proposal should exist with right againstvotes');
                    assert.equal(web3.utils.fromWei(first_proposal_data.lastcuration_weight, "ether" ), '0', 'First proposal should exist with right lastcuration_weight');
                    assert.equal(web3.utils.fromWei(first_proposal_data.lasteditor_weight, "ether" ), '0', 'First proposal should exist with right lasteditor_weight');

                    let first_period = await EticaReleaseInstance.periods(first_proposal.period_id);
                    assert.equal(first_period.total_voters.toNumber(), 0, 'First period should have 0 voter');
                    assert.equal(first_period.forprops.toNumber(), 0, 'First period should have 0 forprops');
                    assert.equal(first_period.againstprops.toNumber(), 0, 'First period should have 0 againstprops');

                    // ------------ WARNING
                    // NEED TO CHECK test_acount has 10 ETI less than before creating propoosal and CHECK if default vote has been registered
                    // ------------ WARNING

                    console.log('................................  CAN CREATE A PROPOSAL  ....................... ');
                    console.log('------------------------------- END OF TEST with SUCCESS ----------------------------');
                    });



                    });


                    // test Proposals creation
                      it("cannot create twice same Proposal with same {raw_release_hash, disease_hash} combination", async function () {
                        console.log('------------------------------------ Starting test ---------------------------');
                        console.log('................................  CANNOT CREATE TWICE A PROPOSAL WITH SAME {raw_release_hash, disease_hash} ? .......................');

                        let idofstruct = await EticaReleaseInstance.diseasesbyIds(EXPECTED_FIRST_DISEASE_HASH);
                        //console.log('id of disease: ', idofstruct);

                        let test_accountbalancebefore = await EticaReleaseInstance.balanceOf(test_account.address);
                        //console.log('test_account ETI balance before:', web3.utils.fromWei(test_accountbalancebefore, "ether" ));

                        let test_accountbosomsbefore = await EticaReleaseInstance.bosoms(test_account.address);
                        //console.log('test_account Bosoms before:', web3.utils.fromWei(test_accountbosomsbefore, "ether" ));

                        assert(web3.utils.fromWei(test_accountbosomsbefore, "ether" ) >= PROPOSAL_DEFAULT_VOTE, 'test_account should have enough Bosoms before CALLING PROPOSE FUNCTION (because propose function should fail but not for this reason)');


                        return EticaReleaseInstance.propose(EXPECTED_FIRST_DISEASE_HASH, "Proposal Crisper K32 for Malaria 2", "Using Crisper to treat Malaria 2", "QmWWQSuPMS6aXCbZKpEjPHPUZN2NjB3YrhJTHsV4X3vb2t", "QmT4AeWE9Q9EaoyLJiqaZuYQ8mJeq4ZBncjjFH9dQ9uDVA", "QmT9qk3CRYbFDWpDFYeAv8T8H1gnongwKhh5J68NLkLir6","Targets:[one_target_here,another_target_here]","Compounds:[one_compound_here, another_compound_here]","Use this field as the community created standards", {from: test_account.address}).then(assert.fail)
                        .catch(async function(error){

                        // ---> Assert the previous existing Proposal with same {raw_release_hash, disease_hash} thus same _proposed_release_hash (EXPECTED_FIRST_PROPOSAL_PROPOSED_RELEASE_HASH) has not changed
                        let first_proposal = await EticaReleaseInstance.proposals(EXPECTED_FIRST_PROPOSAL_PROPOSED_RELEASE_HASH);
                        let proposalsCounter = await EticaReleaseInstance.proposalsCounter();
                        //console.log('THE FIRST PROPOSAL IS:', first_proposal);

                        let first_proposal_ipfs = await EticaReleaseInstance.propsipfs(EXPECTED_FIRST_PROPOSAL_PROPOSED_RELEASE_HASH);
                        //console.log('THE FIRST PROPOSAL IPFS IS:', first_proposal_ipfs);

                        let first_proposal_data = await EticaReleaseInstance.propsdatas(EXPECTED_FIRST_PROPOSAL_PROPOSED_RELEASE_HASH);
                        //console.log('THE FIRST PROPOSAL DATA IS:', first_proposal_data);

                        // check Proposal's general information:
                        assert.equal(first_proposal.disease_id, EXPECTED_FIRST_DISEASE_HASH, 'First proposal should have kept the same disease_id');
                        assert.equal(first_proposal.title, 'Proposal Crisper K32 for Malaria', 'First proposal should have kept the same name');
                        assert.equal(first_proposal.description, 'Using Crisper to treat Malaria', 'First proposal should have kept the same description');
                        assert.equal(proposalsCounter, 1, 'There should be exactly 1 proposal at this point');

                        // check Proposal's IPFS:
                        assert.equal(first_proposal_ipfs.raw_release_hash, 'QmWWQSuPMS6aXCbZKpEjPHPUZN2NjB3YrhJTHsV4X3vb2t', 'First proposal should have kept the same raw_release_hash');
                        assert.equal(first_proposal_ipfs.old_release_hash, 'QmT4AeWE9Q9EaoyLJiqaZuYQ8mJeq4ZBncjjFH9dQ9uDVA', 'First proposal should have kept the same old_release_hash');
                        assert.equal(first_proposal_ipfs.grandparent_hash, 'QmT9qk3CRYbFDWpDFYeAv8T8H1gnongwKhh5J68NLkLir6', 'First proposal should have kept the same grandparent_hash');

                        // check Proposal's DATA:
                        assert.equal(first_proposal_data.status, '2', 'First proposal should have kept the same status');
                        assert.equal(first_proposal_data.istie, true, 'First proposal should have kept the same istie');
                        assert.equal(first_proposal_data.prestatus, '3', 'First proposal should have kept the same prestatus');
                        assert.equal(first_proposal_data.nbvoters, '0', 'First proposal should have kept the same nbvoters');
                        assert.equal(first_proposal_data.slashingratio.toNumber(), '0', 'First proposal should have kept the same slashingratio');
                        assert.equal(web3.utils.fromWei(first_proposal_data.forvotes.toString()), '0', 'First proposal should have kept the same forvotes');
                        assert.equal(web3.utils.fromWei(first_proposal_data.againstvotes.toString()), '0', 'First proposal should have kept the same againstvotes');
                        assert.equal(web3.utils.fromWei(first_proposal_data.lastcuration_weight, "ether" ), '0', 'First proposal should have kept the same lastcuration_weight');
                        assert.equal(web3.utils.fromWei(first_proposal_data.lasteditor_weight, "ether" ), '0', 'First proposal should have kept the same lasteditor_weight');
                        // ---> Assert the previous existing Proposal with same {raw_release_hash, disease_hash} thus same _proposed_release_hash (EXPECTED_FIRST_PROPOSAL_PROPOSED_RELEASE_HASH) has not changed

                        // ------------ WARNING
                        // NEED TO CHECK test_acount has 10 ETI less than before creating propoosal and CHECK if default vote has been registered
                        // ------------ WARNING

                        console.log('......................  CANNOT CREATE TWICE A PROPOSAL WITH SAME {raw_release_hash, disease_hash}  ....................... ');
                        console.log('------------------------------- END OF TEST with SUCCESS ----------------------------');
                        });



                        });




                    // test Proposals commit
                      it("can commit for Proposal", async function () {
                        console.log('------------------------------------ Starting test ---------------------------');
                        console.log('................................  CAN COMMIT FOR A PROPOSAL ? .......................');

                        let idofstruct = await EticaReleaseInstance.diseasesbyIds(EXPECTED_FIRST_DISEASE_HASH);
                        //console.log('idofstruct id: ', idofstruct);

                        let first_proposal = await EticaReleaseInstance.proposals(EXPECTED_FIRST_PROPOSAL_PROPOSED_RELEASE_HASH);
                        let proposalsCounter = await EticaReleaseInstance.proposalsCounter();
                        //console.log('THE FIRST PROPOSAL IS:', first_proposal);

                        let first_proposal_data = await EticaReleaseInstance.propsdatas(first_proposal.proposed_release_hash);
                        //console.log('THE FIRST PROPOSAL DATA IS:', first_proposal_data);

                        let first_proposal_test_account_2_commit_before = await EticaReleaseInstance.commits(test_account2.address, first_proposal.proposed_release_hash);
                        //console.log('THE commit for FIRST PROPOSAL of testaccount2 BEFORE commitvote IS:', first_proposal_test_account_2_commit_before);

                        let test_account_2_balancebefore = await EticaReleaseInstance.balanceOf(test_account2.address);
                        //console.log('test_account ETI balance before revealvote IS:', web3.utils.fromWei(test_account_2_balancebefore, "ether" ));

                        let test_account_2_bosomsbefore = await EticaReleaseInstance.bosoms(test_account2.address);
                        //console.log('test_account2 Bosoms before revealvote IS:', web3.utils.fromWei(test_account_2_bosomsbefore, "ether" ));

                        let expected_votehash = get_expected_votehash(first_proposal.proposed_release_hash, true, test_account2.address, "random123");
                        assert(web3.utils.fromWei(test_account_2_bosomsbefore, "ether" ) >= 3, 'test_account2 should have enough Bosoms before CALLING commitvote FUNCTION');

                        return EticaReleaseInstance.commitvote(web3.utils.toWei('3', 'ether'), expected_votehash, {from: test_account2.address}).then(async function(response){

                          let first_proposal_data_after = await EticaReleaseInstance.propsdatas(first_proposal.proposed_release_hash);
                          //console.log('THE FIRST PROPOSAL DATA AFTER revealvote IS:', first_proposal_data_after);

                          let first_proposal_test_account_2_commit_after = await EticaReleaseInstance.commits(test_account2.address, expected_votehash);
                          //console.log('THE FIRST PROPOSAL VOTE AFTER revealvote IS:', first_proposal_vote_after);

                          assert.equal(web3.utils.fromWei(first_proposal_test_account_2_commit_after.amount, "ether" ), "3", 'test_account2 should have been able to commit for 3 Bosoms!');

                          let test_account_2_bosomsafter = await EticaReleaseInstance.bosoms(test_account2.address);

                          assert.equal(web3.utils.fromWei(test_account_2_bosomsbefore.toString(), "ether" ) - web3.utils.fromWei(test_account_2_bosomsafter.toString(), "ether" ), "3", 'test_account2 should have 3 Bosoms less!');

                          let first_period = await EticaReleaseInstance.periods(first_proposal.period_id);
                          //assert.equal(first_period.total_voters.toNumber(), 2, 'First period should have 2 voters');


                        // ------------ WARNING
                        // NEED TO CHECK test_acount has 10 ETI less than before creating propoosal and CHECK if default vote has been registered
                        // ------------ WARNING

                        console.log('................................  CAN COMMIT FOR A PROPOSAL  ....................... ');
                        console.log('------------------------------- END OF TEST with SUCCESS ----------------------------');
                        });



                        });


                                            // test Proposals commit
                      it("can strengthen commit for Proposal", async function () {
                        console.log('------------------------------------ Starting test ---------------------------');
                        console.log('................................  CAN STRENGTHEN COMMIT FOR A PROPOSAL ? .......................');

                        let idofstruct = await EticaReleaseInstance.diseasesbyIds(EXPECTED_FIRST_DISEASE_HASH);
                        //console.log('idofstruct id: ', idofstruct);

                        let first_proposal = await EticaReleaseInstance.proposals(EXPECTED_FIRST_PROPOSAL_PROPOSED_RELEASE_HASH);
                        let proposalsCounter = await EticaReleaseInstance.proposalsCounter();
                        //console.log('THE FIRST PROPOSAL IS:', first_proposal);

                        let first_proposal_data = await EticaReleaseInstance.propsdatas(first_proposal.proposed_release_hash);
                        //console.log('THE FIRST PROPOSAL DATA IS:', first_proposal_data);

                        let first_proposal_test_account_2_commit_before = await EticaReleaseInstance.commits(test_account2.address, first_proposal.proposed_release_hash);
                        //console.log('THE commit for FIRST PROPOSAL of testaccount2 BEFORE commitvote IS:', first_proposal_test_account_2_commit_before);

                        let test_account_2_balancebefore = await EticaReleaseInstance.balanceOf(test_account2.address);
                        //console.log('test_account ETI balance before revealvote IS:', web3.utils.fromWei(test_account_2_balancebefore, "ether" ));

                        let test_account_2_bosomsbefore = await EticaReleaseInstance.bosoms(test_account2.address);
                        //console.log('test_account2 Bosoms before revealvote IS:', web3.utils.fromWei(test_account_2_bosomsbefore, "ether" ));

                        let expected_votehash = get_expected_votehash(first_proposal.proposed_release_hash, true, test_account2.address, "random123");
                        assert(web3.utils.fromWei(test_account_2_bosomsbefore, "ether" ) >= 1, 'test_account2 should have enough Bosoms before CALLING commitvote FUNCTION');

                        return EticaReleaseInstance.commitvote(web3.utils.toWei('1', 'ether'), expected_votehash, {from: test_account2.address}).then(async function(response){

                          let first_proposal_data_after = await EticaReleaseInstance.propsdatas(first_proposal.proposed_release_hash);
                          //console.log('THE FIRST PROPOSAL DATA AFTER revealvote IS:', first_proposal_data_after);

                          let first_proposal_test_account_2_commit_after = await EticaReleaseInstance.commits(test_account2.address, expected_votehash);
                          //console.log('THE FIRST PROPOSAL VOTE AFTER revealvote IS:', first_proposal_vote_after);

                          assert.equal(web3.utils.fromWei(first_proposal_test_account_2_commit_after.amount, "ether" ), "4", 'test_account2 should have been able to commit for 1 Bosoms!');

                          let test_account_2_bosomsafter = await EticaReleaseInstance.bosoms(test_account2.address);

                          assert.equal(web3.utils.fromWei(test_account_2_bosomsbefore.toString(), "ether" ) - web3.utils.fromWei(test_account_2_bosomsafter.toString(), "ether" ), "1", 'test_account2 should have 1 Bosoms less!');

                          let first_period = await EticaReleaseInstance.periods(first_proposal.period_id);
                          //assert.equal(first_period.total_voters.toNumber(), 2, 'First period should have 2 voters');


                        // ------------ WARNING
                        // NEED TO CHECK test_acount has 10 ETI less than before creating propoosal and CHECK if default vote has been registered
                        // ------------ WARNING

                        console.log('................................  CAN STRENGTHEN COMMIT FOR A PROPOSAL  ....................... ');
                        console.log('------------------------------- END OF TEST with SUCCESS ----------------------------');
                        });



                        });


                      // test_account3 will need ETI to keep going with tests
               it("Get more ETI and stake them for bosoms:", async function () {
                console.log('------------------------------------- Starting task ---------------------------');
                console.log('................................  CAN GET MORE ETI AND STAKE THEM for more BOSOMS ? .......................');
                let test_account_3_balancebefore = await EticaReleaseInstance.balanceOf(test_account3.address);
                let test_account_3_bosomsbefore = await EticaReleaseInstance.bosomsOf(test_account3.address);
                //console.log('test_account ETI balance before transfer:', web3.utils.fromWei(test_account_3_balancebefore, "ether" ));
                //console.log('test_account Bosoms balance before transfer:', web3.utils.fromWei(test_account_3_bosomsbefore, "ether" ));

                console.log('transfering 5 ETI from miner_account to test_account3');
                let miner_accountbalancebefore = await EticaReleaseInstance.balanceOf(miner_account.address);
                console.log('miner_account ETI balance before:', web3.utils.fromWei(miner_accountbalancebefore, "ether" ));
                assert(web3.utils.fromWei(miner_accountbalancebefore, "ether" ) >= 5, 'miner_account should have enough ETI before CALLING TRANSFER FUNCTION but unfortunatly it has not mined enough ETI, please try to relanch tests you will be more lucky next time!');
                return EticaReleaseInstance.transfer(test_account3.address,  web3.utils.toBN(5000000000000000000), {from: miner_account.address}).then(async function(receipt){

                  let test_account_3_balancebefore_newstaking = await EticaReleaseInstance.balanceOf(test_account3.address);
                  let test_account_3_bosomsbefore_newstaking = await EticaReleaseInstance.bosomsOf(test_account3.address);
                  //console.log('test_account ETI balance before new staking:', web3.utils.fromWei(test_account_3_balancebefore_newstaking, "ether" ));
                  //console.log('test_account Bosoms balance before new staking:', web3.utils.fromWei(test_account_3_bosomsbefore_newstaking, "ether" ));

                  assert.equal(web3.utils.fromWei(test_account_3_bosomsbefore, "ether" ), web3.utils.fromWei(test_account_3_bosomsbefore_newstaking, "ether" ), 'test_account3 should have same amount of Bosoms!');
                  assert.equal(web3.utils.fromWei(test_account_3_balancebefore_newstaking, "ether" ) - web3.utils.fromWei(test_account_3_balancebefore, "ether" ), "5", 'test_account3 should have 5 Eticas more!');

                // try staking 5 ETI:
                  return EticaReleaseInstance.eticatobosoms(test_account3.address,  web3.utils.toBN(5000000000000000000), {from: test_account3.address}).then(async function(receipt){
                let test_account_3_balanceafter = await EticaReleaseInstance.balanceOf(test_account3.address);
                let test_account_3_bosomsafter = await EticaReleaseInstance.bosomsOf(test_account3.address);
                //console.log('test_account ETI balance after new staking:', web3.utils.fromWei(test_accountbalanceafter, "ether" ));
                //console.log('test_account Bosoms balance after new staking:', web3.utils.fromWei(test_account_3_bosomsafter, "ether" ));
                assert.equal(web3.utils.fromWei(test_account_3_bosomsafter, "ether" ), "5", 'test_account3 should have 5 Bosoms!');
                assert.equal(web3.utils.fromWei(test_account_3_balancebefore_newstaking, "ether" ) - web3.utils.fromWei(test_account_3_balanceafter, "ether" ), "5", 'test_account3 should have 5 Eticas less!');

                console.log('.....................   CAN GET MORE ETI AND STAKE THEM for more BOSOMS  ....................... ');
                console.log('---------------------------------- END OF TASK with SUCCESS ----------------------------');
                
                })
                })

              });

                             // test_account4 will need ETI to keep going with tests
                             it("Get more ETI and stake them for bosoms:", async function () {
                              console.log('------------------------------------- Starting task ---------------------------');
                              console.log('................................  CAN GET MORE ETI AND STAKE THEM for more BOSOMS ? .......................');
                              let test_account_4_balancebefore = await EticaReleaseInstance.balanceOf(test_account4.address);
                              let test_account_4_bosomsbefore = await EticaReleaseInstance.bosomsOf(test_account4.address);
                              //console.log('test_account ETI balance before transfer:', web3.utils.fromWei(test_account_4_balancebefore, "ether" ));
                              //console.log('test_account Bosoms balance before transfer:', web3.utils.fromWei(test_account_4_bosomsbefore, "ether" ));
              
                              console.log('transfering 5 ETI from miner_account to test_account4');
                              let miner_accountbalancebefore = await EticaReleaseInstance.balanceOf(miner_account.address);
                              console.log('miner_account ETI balance before:', web3.utils.fromWei(miner_accountbalancebefore, "ether" ));
                              assert(web3.utils.fromWei(miner_accountbalancebefore, "ether" ) >= 5, 'miner_account should have enough ETI before CALLING TRANSFER FUNCTION but unfortunatly it has not mined enough ETI, please try to relanch tests you will be more lucky next time!');
                              return EticaReleaseInstance.transfer(test_account4.address,  web3.utils.toBN(5000000000000000000), {from: miner_account.address}).then(async function(receipt){
              
                                let test_account_4_balancebefore_newstaking = await EticaReleaseInstance.balanceOf(test_account4.address);
                                let test_account_4_bosomsbefore_newstaking = await EticaReleaseInstance.bosomsOf(test_account4.address);
                                //console.log('test_account ETI balance before new staking:', web3.utils.fromWei(test_account_4_balancebefore_newstaking, "ether" ));
                                //console.log('test_account Bosoms balance before new staking:', web3.utils.fromWei(test_account_4_bosomsbefore_newstaking, "ether" ));
              
                                assert.equal(web3.utils.fromWei(test_account_4_bosomsbefore, "ether" ), web3.utils.fromWei(test_account_4_bosomsbefore_newstaking, "ether" ), 'test_account4 should have same amount of Bosoms!');
                                assert.equal(web3.utils.fromWei(test_account_4_balancebefore_newstaking, "ether" ) - web3.utils.fromWei(test_account_4_balancebefore, "ether" ), "5", 'test_account4 should have 5 Eticas more!');
              
                              // try staking 5 ETI:
                                return EticaReleaseInstance.eticatobosoms(test_account4.address,  web3.utils.toBN(5000000000000000000), {from: test_account4.address}).then(async function(receipt){
                              let test_account_4_balanceafter = await EticaReleaseInstance.balanceOf(test_account4.address);
                              let test_account_4_bosomsafter = await EticaReleaseInstance.bosomsOf(test_account4.address);
                              //console.log('test_account ETI balance after new staking:', web3.utils.fromWei(test_accountbalanceafter, "ether" ));
                              //console.log('test_account Bosoms balance after new staking:', web3.utils.fromWei(test_account_4_bosomsafter, "ether" ));
                              assert.equal(web3.utils.fromWei(test_account_4_bosomsafter, "ether" ), "5", 'test_account4 should have 5 Bosoms!');
                              assert.equal(web3.utils.fromWei(test_account_4_balancebefore_newstaking, "ether" ) - web3.utils.fromWei(test_account_4_balanceafter, "ether" ), "5", 'test_account4 should have 5 Eticas less!');
              
                              console.log('.....................   CAN GET MORE ETI AND STAKE THEM for more BOSOMS  ....................... ');
                              console.log('---------------------------------- END OF TASK with SUCCESS ----------------------------');
                              
                              })
                              })
              
                            });

                             // test_account5 will need ETI to keep going with tests
                             it("Get more ETI and stake them for bosoms:", async function () {
                              console.log('------------------------------------- Starting task ---------------------------');
                              console.log('................................  CAN GET MORE ETI AND STAKE THEM for more BOSOMS ? .......................');
                              let test_account_5_balancebefore = await EticaReleaseInstance.balanceOf(test_account5.address);
                              let test_account_5_bosomsbefore = await EticaReleaseInstance.bosomsOf(test_account5.address);
                              //console.log('test_account ETI balance before transfer:', web3.utils.fromWei(test_account_5_balancebefore, "ether" ));
                              //console.log('test_account Bosoms balance before transfer:', web3.utils.fromWei(test_account_5_bosomsbefore, "ether" ));
              
                              console.log('transfering 4 ETI from miner_account to test_account5');
                              let miner_accountbalancebefore = await EticaReleaseInstance.balanceOf(miner_account.address);
                              console.log('miner_account ETI balance before:', web3.utils.fromWei(miner_accountbalancebefore, "ether" ));
                              assert(web3.utils.fromWei(miner_accountbalancebefore, "ether" ) >= 4, 'miner_account should have enough ETI before CALLING TRANSFER FUNCTION but unfortunatly it has not mined enough ETI, please try to relanch tests you will be more lucky next time!');
                              return EticaReleaseInstance.transfer(test_account5.address,  web3.utils.toBN(4000000000000000000), {from: miner_account.address}).then(async function(receipt){
              
                                let test_account_5_balancebefore_newstaking = await EticaReleaseInstance.balanceOf(test_account5.address);
                                let test_account_5_bosomsbefore_newstaking = await EticaReleaseInstance.bosomsOf(test_account5.address);
                                //console.log('test_account ETI balance before new staking:', web3.utils.fromWei(test_account_5_balancebefore_newstaking, "ether" ));
                                //console.log('test_account Bosoms balance before new staking:', web3.utils.fromWei(test_account_5_bosomsbefore_newstaking, "ether" ));
              
                                assert.equal(web3.utils.fromWei(test_account_5_bosomsbefore, "ether" ), web3.utils.fromWei(test_account_5_bosomsbefore_newstaking, "ether" ), 'test_account5 should have same amount of Bosoms!');
                                assert.equal(web3.utils.fromWei(test_account_5_balancebefore_newstaking, "ether" ) - web3.utils.fromWei(test_account_5_balancebefore, "ether" ), "4", 'test_account5 should have 4 Eticas more!');
              
                              // try staking 3 ETI:
                                return EticaReleaseInstance.eticatobosoms(test_account5.address,  web3.utils.toBN(4000000000000000000), {from: test_account5.address}).then(async function(receipt){
                              let test_account_5_balanceafter = await EticaReleaseInstance.balanceOf(test_account5.address);
                              let test_account_5_bosomsafter = await EticaReleaseInstance.bosomsOf(test_account5.address);
                              //console.log('test_account ETI balance after new staking:', web3.utils.fromWei(test_accountbalanceafter, "ether" ));
                              //console.log('test_account Bosoms balance after new staking:', web3.utils.fromWei(test_account_5_bosomsafter, "ether" ));
                              assert.equal(web3.utils.fromWei(test_account_5_bosomsafter, "ether" ), "4", 'test_account5 should have 4 Bosoms!');
                              assert.equal(web3.utils.fromWei(test_account_5_balancebefore_newstaking, "ether" ) - web3.utils.fromWei(test_account_5_balanceafter, "ether" ), "4", 'test_account should have 4 Eticas less!');
              
                              console.log('.....................   CAN GET MORE ETI AND STAKE THEM for more BOSOMS  ....................... ');
                              console.log('---------------------------------- END OF TASK with SUCCESS ----------------------------');
                              
                              })
                              })
              
                            });         


                                          // test Proposals commit
                      it("can commit against Proposal", async function () {
                        console.log('------------------------------------ Starting test ---------------------------');
                        console.log('................................  CAN COMMIT AGAINST A PROPOSAL ? .......................');

                        let idofstruct = await EticaReleaseInstance.diseasesbyIds(EXPECTED_FIRST_DISEASE_HASH);
                        //console.log('idofstruct id: ', idofstruct);

                        let first_proposal = await EticaReleaseInstance.proposals(EXPECTED_FIRST_PROPOSAL_PROPOSED_RELEASE_HASH);
                        let proposalsCounter = await EticaReleaseInstance.proposalsCounter();
                        //console.log('THE FIRST PROPOSAL IS:', first_proposal);

                        let first_proposal_data = await EticaReleaseInstance.propsdatas(first_proposal.proposed_release_hash);
                        //console.log('THE FIRST PROPOSAL DATA IS:', first_proposal_data);

                        let first_proposal_test_account_5_commit_before = await EticaReleaseInstance.commits(test_account5.address, first_proposal.proposed_release_hash);
                        //console.log('THE commit for FIRST PROPOSAL of testaccount2 BEFORE commitvote IS:', first_proposal_test_account_5_commit_before);

                        let test_account_5_balancebefore = await EticaReleaseInstance.balanceOf(test_account5.address);
                        //console.log('test_account ETI balance before revealvote IS:', web3.utils.fromWei(test_account_5_balancebefore, "ether" ));

                        let test_account_5_bosomsbefore = await EticaReleaseInstance.bosoms(test_account5.address);
                        //console.log('test_account5 Bosoms before revealvote IS:', web3.utils.fromWei(test_account_5_bosomsbefore, "ether" ));

                        let expected_votehash = get_expected_votehash(first_proposal.proposed_release_hash, false, test_account5.address, "random123");

                        return EticaReleaseInstance.commitvote(web3.utils.toWei('4', 'ether'), expected_votehash, {from: test_account5.address}).then(async function(response){

                          let first_proposal_data_after = await EticaReleaseInstance.propsdatas(first_proposal.proposed_release_hash);
                          //console.log('THE FIRST PROPOSAL DATA AFTER revealvote IS:', first_proposal_data_after);

                          let first_proposal_test_account_5_commit_after = await EticaReleaseInstance.commits(test_account5.address, expected_votehash);
                          //console.log('THE FIRST PROPOSAL VOTE AFTER revealvote IS:', first_proposal_vote_after);

                          assert.equal(web3.utils.fromWei(first_proposal_test_account_5_commit_after.amount, "ether" ), "4", 'test_account5 should have been able to commit for 4 Bosoms!');

                          let test_account_5_bosomsafter = await EticaReleaseInstance.bosoms(test_account5.address);

                          assert.equal(web3.utils.fromWei(test_account_5_bosomsbefore.toString(), "ether" ) - web3.utils.fromWei(test_account_5_bosomsafter.toString(), "ether" ), "4", 'test_account5 should have 4 Bosom less!');

                          let first_period = await EticaReleaseInstance.periods(first_proposal.period_id);
                          //assert.equal(first_period.total_voters.toNumber(), 2, 'First period should have 2 voters');


                        // ------------ WARNING
                        // NEED TO CHECK test_acount has 10 ETI less than before creating propoosal and CHECK if default vote has been registered
                        // ------------ WARNING

                        console.log('................................  CAN COMMIT AGAINST A PROPOSAL  ....................... ');
                        console.log('------------------------------- END OF TEST with SUCCESS ----------------------------');
                        });



                        });

                                  // test too late voting should fail
          it("cannot reveal too soon:", async function () {
            console.log('------------------------------- Starting test ---------------------------');
            console.log('.......................... Cannot REVEALVOTE TOO SOON ? ..................... ');

            let test_account_2_balancebefore = await EticaReleaseInstance.balanceOf(test_account2.address);
            let test_account_2_stakebefore = await EticaReleaseInstance.stakes(test_account2.address, 1);
            //console.log('test_account3 ETI balance before:', web3.utils.fromWei(test_account_3_balancebefore, "ether" ));
            //console.log('test_account3 Stake before:', test_account_3_stakebefore);
            //console.log('test_account3 Stake amount before:', web3.utils.fromWei(test_account_3_stakebefore.amount, "ether" ));

            let test_account_2_bosomsbefore = await EticaReleaseInstance.bosoms(test_account2.address);
            //console.log('test_account3 Bosoms before:', web3.utils.fromWei(test_account_3_bosomsbefore, "ether" ));

            let first_proposal = await EticaReleaseInstance.proposals(EXPECTED_FIRST_PROPOSAL_PROPOSED_RELEASE_HASH);
                        let proposalsCounter = await EticaReleaseInstance.proposalsCounter();
                        //console.log('THE FIRST PROPOSAL IS:', first_proposal);

            //assert(web3.utils.fromWei(test_account_2_bosomsbefore, "ether" ) >= 3, 'test_account2 should have enough Bosoms before CALLING revealvote FUNCTION (because revealvote function should fail but not for this reason)');

            let lstblock = await web3.eth.getBlock("latest");
            //console.log('last block s timestamp is', lstblock.timestamp);
            let first_proposal_data_after = await EticaReleaseInstance.propsdatas(first_proposal.proposed_release_hash);
            //console.log('THE FIRST PROPOSAL ENDTIME IS:', first_proposal_data_after.endtime.toString());

            // vote should still be wothin time limits as we don't want the vote to fail for this reason:
            assert(lstblock.timestamp <= first_proposal_data_after.endtime + 60, 'Block timestamp should be lower than revealing time end before testing REVEALVOTE TOO SOON');

           // try to VOTE for proposal, should fail:
           return EticaReleaseInstance.revealvote(first_proposal.proposed_release_hash, true, web3.utils.toWei('4', 'ether'), "random123", {from: test_account2.address}).then(assert.fail)
              .catch(async function(error){
                assert(true);
                let test_account_2_balanceafter = await EticaReleaseInstance.balanceOf(test_account2.address);
                let test_account_2_stakeafter = await EticaReleaseInstance.stakes(test_account2.address,1);
                let test_account_2_bosomsafter = await EticaReleaseInstance.bosoms(test_account2.address);
                let first_proposal_vote_after = await EticaReleaseInstance.votes(first_proposal.proposed_release_hash, test_account2.address);
                //console.log('test_account3 ETI balance after:', web3.utils.fromWei(test_account_3_balanceafter, "ether" ));
                //console.log('test_account3 Stake after:', test_account_3_stakeafter);
                //console.log('test_account3 Vote is:', first_proposal_vote_after);
                assert.equal(web3.utils.fromWei(test_account_2_bosomsbefore, "ether" ) - web3.utils.fromWei(test_account_2_bosomsafter, "ether" ), "0", 'test_account2 should not have less Bosoms!');
                assert.equal(web3.utils.fromWei(first_proposal_vote_after.amount, "ether" ), "0", 'test_account2 should not have been able to revealvote too soon. So the vote amount should not have changed !');

                console.log('........................... REVEALINGVOTE TOO SOON is not possible ....................... ');
                console.log('------------------------------- END OF TEST with SUCCESS ---------------------------');
              });

          });

                              // test Proposals commit
                              it("can still commit for Proposal", async function () {
                                console.log('------------------------------------ Starting test ---------------------------');
                                console.log('................................  CAN STILL COMMIT FOR A PROPOSAL ? .......................');
                                // advance time just before revealing period:
                                await advanceminutes(2);
                                let idofstruct = await EticaReleaseInstance.diseasesbyIds(EXPECTED_FIRST_DISEASE_HASH);
                                //console.log('idofstruct id: ', idofstruct);
        
                                let first_proposal = await EticaReleaseInstance.proposals(EXPECTED_FIRST_PROPOSAL_PROPOSED_RELEASE_HASH);
                                let proposalsCounter = await EticaReleaseInstance.proposalsCounter();
                                //console.log('THE FIRST PROPOSAL IS:', first_proposal);
        
                                let first_proposal_data = await EticaReleaseInstance.propsdatas(first_proposal.proposed_release_hash);
                                //console.log('THE FIRST PROPOSAL DATA IS:', first_proposal_data);
        
                                let first_proposal_test_account_4_commit_before = await EticaReleaseInstance.commits(test_account4.address, first_proposal.proposed_release_hash);
                                //console.log('THE commit for FIRST PROPOSAL of testaccount2 BEFORE commitvote IS:', first_proposal_test_account_4_commit_before);
        
                                let test_account_4_balancebefore = await EticaReleaseInstance.balanceOf(test_account4.address);
                                //console.log('test_account ETI balance before revealvote IS:', web3.utils.fromWei(test_account_4_balancebefore, "ether" ));
        
                                let test_account_4_bosomsbefore = await EticaReleaseInstance.bosoms(test_account4.address);
                                //console.log('test_account4 Bosoms before revealvote IS:', web3.utils.fromWei(test_account_4_bosomsbefore, "ether" ));
        
                                let expected_votehash = get_expected_votehash(first_proposal.proposed_release_hash, true, test_account4.address, "random123");
        
                                return EticaReleaseInstance.commitvote(web3.utils.toWei('3', 'ether'), expected_votehash, {from: test_account4.address}).then(async function(response){
        
                                  let first_proposal_data_after = await EticaReleaseInstance.propsdatas(first_proposal.proposed_release_hash);
                                  //console.log('THE FIRST PROPOSAL DATA AFTER revealvote IS:', first_proposal_data_after);
        
                                  let first_proposal_test_account_4_commit_after = await EticaReleaseInstance.commits(test_account4.address, expected_votehash);
                                  //console.log('THE FIRST PROPOSAL VOTE AFTER revealvote IS:', first_proposal_vote_after);
        
                                  assert.equal(web3.utils.fromWei(first_proposal_test_account_4_commit_after.amount, "ether" ), "3", 'test_account4 should have been able to commit for 3 Bosoms!');
        
                                  let test_account_4_bosomsafter = await EticaReleaseInstance.bosoms(test_account4.address);
        
                                  assert.equal(web3.utils.fromWei(test_account_4_bosomsbefore.toString(), "ether" ) - web3.utils.fromWei(test_account_4_bosomsafter.toString(), "ether" ), "3", 'test_account4 should have 3 Bosoms less!');
        
                                  let first_period = await EticaReleaseInstance.periods(first_proposal.period_id);
                                  //assert.equal(first_period.total_voters.toNumber(), 2, 'First period should have 2 voters');
        
        
                                // ------------ WARNING
                                // NEED TO CHECK test_acount has 10 ETI less than before creating propoosal and CHECK if default vote has been registered
                                // ------------ WARNING
        
                                console.log('................................  CAN STILL COMMIT FOR A PROPOSAL  ....................... ');
                                console.log('------------------------------- END OF TEST with SUCCESS ----------------------------');
                                });
        
        
        
                                });


                                           // test Proposals commit
                              it("can still commit for Proposal", async function () {
                                console.log('------------------------------------ Starting test ---------------------------');
                                console.log('................................  CAN STILL COMMIT FOR A PROPOSAL ? .......................');
                                let idofstruct = await EticaReleaseInstance.diseasesbyIds(EXPECTED_FIRST_DISEASE_HASH);
                                //console.log('idofstruct id: ', idofstruct);
        
                                let first_proposal = await EticaReleaseInstance.proposals(EXPECTED_FIRST_PROPOSAL_PROPOSED_RELEASE_HASH);
                                let proposalsCounter = await EticaReleaseInstance.proposalsCounter();
                                //console.log('THE FIRST PROPOSAL IS:', first_proposal);
        
                                let first_proposal_data = await EticaReleaseInstance.propsdatas(first_proposal.proposed_release_hash);
                                //console.log('THE FIRST PROPOSAL DATA IS:', first_proposal_data);
        
                                let first_proposal_test_account_3_commit_before = await EticaReleaseInstance.commits(test_account3.address, first_proposal.proposed_release_hash);
                                //console.log('THE commit for FIRST PROPOSAL of testaccount2 BEFORE commitvote IS:', first_proposal_test_account_3_commit_before);
        
                                let test_account_3_balancebefore = await EticaReleaseInstance.balanceOf(test_account3.address);
                                //console.log('test_account ETI balance before revealvote IS:', web3.utils.fromWei(test_account_3_balancebefore, "ether" ));
        
                                let test_account_3_bosomsbefore = await EticaReleaseInstance.bosoms(test_account3.address);
                                //console.log('test_account3 Bosoms before revealvote IS:', web3.utils.fromWei(test_account_3_bosomsbefore, "ether" ));
        
                                let expected_votehash = get_expected_votehash(first_proposal.proposed_release_hash, true, test_account3.address, "random123");
        
                                return EticaReleaseInstance.commitvote(web3.utils.toWei('1', 'ether'), expected_votehash, {from: test_account3.address}).then(async function(response){
        
                                  let first_proposal_data_after = await EticaReleaseInstance.propsdatas(first_proposal.proposed_release_hash);
                                  //console.log('THE FIRST PROPOSAL DATA AFTER revealvote IS:', first_proposal_data_after);
        
                                  let first_proposal_test_account_3_commit_after = await EticaReleaseInstance.commits(test_account3.address, expected_votehash);
                                  //console.log('THE FIRST PROPOSAL VOTE AFTER revealvote IS:', first_proposal_vote_after);
        
                                  assert.equal(web3.utils.fromWei(first_proposal_test_account_3_commit_after.amount, "ether" ), "1", 'test_account3 should have been able to commit for 1 Bosom!');
        
                                  let test_account_3_bosomsafter = await EticaReleaseInstance.bosoms(test_account3.address);
        
                                  assert.equal(web3.utils.fromWei(test_account_3_bosomsbefore.toString(), "ether" ) - web3.utils.fromWei(test_account_3_bosomsafter.toString(), "ether" ), "1", 'test_account3 should have 1 Bosoms less!');
        
                                  let first_period = await EticaReleaseInstance.periods(first_proposal.period_id);
                                  //assert.equal(first_period.total_voters.toNumber(), 2, 'First period should have 2 voters');
        
        
                                // ------------ WARNING
                                // NEED TO CHECK test_acount has 10 ETI less than before creating propoosal and CHECK if default vote has been registered
                                // ------------ WARNING
        
                                console.log('................................  CAN STILL COMMIT FOR A PROPOSAL  ....................... ');
                                console.log('------------------------------- END OF TEST with SUCCESS ----------------------------');
                                });
        
        
        
                                });                   

// next function will advance time to after voting period to revelaing period:
                                            // test Proposals commit
                    it("cannot commit too late", async function () {
                      console.log('------------------------------------ Starting test ---------------------------');
                      console.log('................................  CANNOT COMMIT TO LATE ? .......................');

                      await advanceminutes(1);

                      let idofstruct = await EticaReleaseInstance.diseasesbyIds(EXPECTED_FIRST_DISEASE_HASH);
                      //console.log('idofstruct id: ', idofstruct);

                      let first_proposal = await EticaReleaseInstance.proposals(EXPECTED_FIRST_PROPOSAL_PROPOSED_RELEASE_HASH);
                      let proposalsCounter = await EticaReleaseInstance.proposalsCounter();
                      //console.log('THE FIRST PROPOSAL IS:', first_proposal);

                      let first_proposal_data = await EticaReleaseInstance.propsdatas(first_proposal.proposed_release_hash);
                      //console.log('THE FIRST PROPOSAL DATA IS:', first_proposal_data);


                      let miner_account_balancebefore = await EticaReleaseInstance.balanceOf(miner_account.address);
                      //console.log('miner_account ETI balance before revealvote IS:', web3.utils.fromWei(miner_account_balancebefore, "ether" ));

                      let miner_account_bosomsbefore = await EticaReleaseInstance.bosoms(miner_account.address);
                      console.log('miner_account Bosoms before commitvote IS:', web3.utils.fromWei(miner_account_bosomsbefore, "ether" ));

                      let expected_votehash = get_expected_votehash(first_proposal.proposed_release_hash, true, miner_account.address, "random123");

                      let first_proposal_miner_account_commit_before = await EticaReleaseInstance.commits(miner_account.address, expected_votehash);
                      console.log('THE commit.amount for FIRST PROPOSAL of testaccount3 BEFORE commitvote IS:', web3.utils.fromWei(first_proposal_miner_account_commit_before.amount, "ether" ));
                      
                      assert(web3.utils.fromWei(miner_account_bosomsbefore, "ether" ) >= 2, 'miner_account should have enough Bosoms before CALLING commitvote FUNCTION (because commitvote function should fail but not for this reason)');

                      return EticaReleaseInstance.commitvote(web3.utils.toWei('2', 'ether'), expected_votehash, {from: miner_account.address}).then(async function(resp){

                      // the revealvote() should not work as the related commit was done too late:
                      return EticaReleaseInstance.revealvote(first_proposal.proposed_release_hash, true, web3.utils.toWei('2', 'ether'), "random123", {from: miner_account.address}).then(assert.fail)
                      .catch(async function(error){
                        assert(true);

                          let first_proposal_data_after = await EticaReleaseInstance.propsdatas(first_proposal.proposed_release_hash);
                          //console.log('THE FIRST PROPOSAL DATA AFTER revealvote IS:', first_proposal_data_after);

                          let first_proposal_vote_after = await EticaReleaseInstance.votes(first_proposal.proposed_release_hash, miner_account.address);
                          //console.log('THE FIRST PROPOSAL VOTE AFTER revealvote IS:', first_proposal_vote_after);

                          assert.equal(web3.utils.fromWei(first_proposal_vote_after.amount, "ether" ), "0", 'miner_account should not have been able to revealvote!');

                          /*let miner_account_bosomsafter = await EticaReleaseInstance.bosoms(miner_account.address);

                          assert.equal(web3.utils.fromWei(miner_account_bosomsbefore.toString(), "ether" ) - web3.utils.fromWei(miner_account_bosomsafter.toString(), "ether" ), "1", 'miner_account should have 1 Bosom less!');*/

                          let first_period = await EticaReleaseInstance.periods(first_proposal.period_id);
                          assert.equal(first_period.total_voters.toNumber(), 0, 'First period should not have any vote at this stage');


                        // ------------ WARNING
                        // NEED TO CHECK test_acount has 10 ETI less than before creating propoosal and CHECK if default vote has been registered
                        // ------------ WARNING

                        console.log('................................  CANNOT COMMIT TO LATE  ....................... ');
                        console.log('------------------------------- END OF TEST with SUCCESS ----------------------------');
                        });

                      });

                      });


                                  // test Proposals vote again just before testing cannot vote after endvote. This test is used as a way to make sure we are only testing endvote on next test
it("can revealvote against Proposal", async function () {
  console.log('------------------------------------ Starting test ---------------------------');
  console.log('................................  CAN REVEALVOTE AGAINST A PROPOSAL ? .......................');

  let idofstruct = await EticaReleaseInstance.diseasesbyIds(EXPECTED_FIRST_DISEASE_HASH);
  //console.log('idofstruct id: ', idofstruct);

  let first_proposal = await EticaReleaseInstance.proposals(EXPECTED_FIRST_PROPOSAL_PROPOSED_RELEASE_HASH);
  let proposalsCounter = await EticaReleaseInstance.proposalsCounter();
  //console.log('THE FIRST PROPOSAL IS:', first_proposal);

  let first_proposal_data = await EticaReleaseInstance.propsdatas(first_proposal.proposed_release_hash);
  console.log('THE FIRST PROPOSAL DATA IS:', first_proposal_data);
  console.log('old slashingratio before against vote revealing is', first_proposal_data.slashingratio.toString());

  let first_proposal_vote_before = await EticaReleaseInstance.votes(first_proposal.proposed_release_hash, test_account.address);
  //console.log('THE FIRST PROPOSAL VOTE BEFORE revealvote IS:', first_proposal_vote_before);

  let test_account_5_balancebefore = await EticaReleaseInstance.balanceOf(test_account5.address);
  //console.log('test_account ETI balance before revealvote IS:', web3.utils.fromWei(test_account_5_balancebefore, "ether" ));

  let test_account_5_bosomsbefore = await EticaReleaseInstance.bosoms(test_account5.address);
  //console.log('test_account Bosoms before revealvote IS:', web3.utils.fromWei(test_account_5_bosomsbefore, "ether" ));

  let lstblock = await web3.eth.getBlock("latest");
  console.log('last block s timestamp is', lstblock.timestamp);
  let first_proposal_data_after = await EticaReleaseInstance.propsdatas(first_proposal.proposed_release_hash);
  console.log('THE FIRST PROPOSAL ENDTIME IS:', first_proposal_data_after.endtime.toString());

  // vote should pass as endvote has not been reached yet
  assert(lstblock.timestamp <= first_proposal_data_after.endtime + 60, 'Block timestamp should be lower than first proposal end OF REVEALING votes before testing CAN STILL REVEALVOTE against');
  assert(lstblock.timestamp > first_proposal_data_after.endtime, 'Block timestamp should be higher than first proposal end of VOTE COMMITTING OF before testing CAN REVEALVOTE against');

  return EticaReleaseInstance.revealvote(first_proposal.proposed_release_hash, false, web3.utils.toWei('4', 'ether'), "random123", {from: test_account5.address}).then(async function(response){

    let first_proposal_data_after = await EticaReleaseInstance.propsdatas(first_proposal.proposed_release_hash);
    console.log('THE FIRST PROPOSAL DATA AFTER revealvote IS:', first_proposal_data_after);
    console.log('new slashingratio after against vote revealing is', first_proposal_data_after.slashingratio.toString());
    assert.equal('10000', first_proposal_data_after.slashingratio.toString(), 'the proposal slashingratio should be 10000 after 0 for vote and 1 against vote of 4 Bosoms');

    let first_proposal_vote_after = await EticaReleaseInstance.votes(first_proposal.proposed_release_hash, test_account5.address);
    //console.log('THE FIRST PROPOSAL VOTE AFTER revealvote IS:', first_proposal_vote_after);

    assert.equal(web3.utils.fromWei(first_proposal_vote_after.amount, "ether" ), "4", 'test_account5 should have been able to revealvote for 4 Bosoms!');

    let test_account_5_bosomsafter = await EticaReleaseInstance.bosoms(test_account5.address);

    // revealing votes should not impact bosoms balance (instead commitvote() does):
    assert.equal(web3.utils.fromWei(test_account_5_bosomsbefore.toString(), "ether" ) - web3.utils.fromWei(test_account_5_bosomsafter.toString(), "ether" ), "0", 'test_account5 should have same amount of Bosoms!');

    let first_period = await EticaReleaseInstance.periods(first_proposal.period_id);
    assert.equal(first_period.total_voters.toNumber(), 1, 'First period should have 1 voters');
    assert.equal(first_period.forprops.toNumber(), 0, 'First period should have 0 forprops');
    assert.equal(first_period.againstprops.toNumber(), 1, 'First period should have 1 againstprops');



  console.log('................................  CAN REVEALVOTE AGAINST A PROPOSAL  ....................... ');
  console.log('---------------------------------- END OF TEST with SUCCESS ----------------------------');
  });



  });


                                            // test Proposals vote
                      it("can revealvote for Proposal", async function () {
                        console.log('------------------------------------ Starting test ---------------------------');
                        console.log('................................  CAN reveal VOTE FOR A PROPOSAL ? .......................');

                        let idofstruct = await EticaReleaseInstance.diseasesbyIds(EXPECTED_FIRST_DISEASE_HASH);
                        //console.log('idofstruct id: ', idofstruct);

                        let first_proposal = await EticaReleaseInstance.proposals(EXPECTED_FIRST_PROPOSAL_PROPOSED_RELEASE_HASH);
                        let proposalsCounter = await EticaReleaseInstance.proposalsCounter();
                        //console.log('THE FIRST PROPOSAL IS:', first_proposal);

                        let first_proposal_data = await EticaReleaseInstance.propsdatas(first_proposal.proposed_release_hash);
                        console.log('THE FIRST PROPOSAL DATA IS:', first_proposal_data);
                        console.log('old slashingratio is', first_proposal_data.slashingratio.toString());
                        

                        let first_proposal_vote_before = await EticaReleaseInstance.votes(first_proposal.proposed_release_hash, test_account.address);
                        console.log('THE FIRST PROPOSAL VOTE BEFORE revealvote IS:', first_proposal_vote_before);
                        

                        let test_account_2_balancebefore = await EticaReleaseInstance.balanceOf(test_account2.address);
                        //console.log('test_account ETI balance before revealvote IS:', web3.utils.fromWei(test_account_2_balancebefore, "ether" ));

                        let test_account_2_bosomsbefore = await EticaReleaseInstance.bosoms(test_account2.address);
                        //console.log('test_account Bosoms before revealvote IS:', web3.utils.fromWei(test_account_2_bosomsbefore, "ether" ));

                        return EticaReleaseInstance.revealvote(first_proposal.proposed_release_hash, true, web3.utils.toWei('4', 'ether'), "random123", {from: test_account2.address}).then(async function(response){

                          let first_proposal_data_after = await EticaReleaseInstance.propsdatas(first_proposal.proposed_release_hash);
                          console.log('THE FIRST PROPOSAL DATA AFTER revealvote IS:', first_proposal_data_after);
                          console.log('new slashingratio is', first_proposal_data_after.slashingratio.toString());
                          assert.equal('0', first_proposal_data_after.slashingratio.toString(), 'the proposal slashingratio should be 0 after 1 for vote of 4 Bosoms and 1 against vote of 4 Bosoms');

                          let first_proposal_vote_after = await EticaReleaseInstance.votes(first_proposal.proposed_release_hash, test_account2.address);
                          //console.log('THE FIRST PROPOSAL VOTE AFTER revealvote IS:', first_proposal_vote_after);

                          assert.equal(web3.utils.fromWei(first_proposal_vote_after.amount, "ether" ), "4", 'test_account2 should have been able to vote for 4 Bosoms!');

                          /*let test_account_2_bosomsafter = await EticaReleaseInstance.bosoms(test_account2.address);

                          assert.equal(web3.utils.fromWei(test_account_2_bosomsbefore.toString(), "ether" ) - web3.utils.fromWei(test_account_2_bosomsafter.toString(), "ether" ), "1", 'test_account2 should have 1 Bosom less!');*/

                          let first_period = await EticaReleaseInstance.periods(first_proposal.period_id);
                          assert.equal(first_period.total_voters.toNumber(), 2, 'First period should have 2 voters');
                          assert.equal(first_period.forprops.toNumber(), 0, 'First period should have 0 forprops');
                          assert.equal(first_period.againstprops.toNumber(), 1, 'First period should have 1 againstprops');
                  


                        // ------------ WARNING
                        // NEED TO CHECK test_acount has 10 ETI less than before creating propoosal and CHECK if default vote has been registered
                        // ------------ WARNING

                        console.log('................................  CAN VOTE FOR A PROPOSAL  ....................... ');
                        console.log('------------------------------- END OF TEST with SUCCESS ----------------------------');
                        });



                        });


          // test too late voting should fail
          it("cannot reveal vote twice on same Proposal :", async function () {
            console.log('------------------------------- Starting test ---------------------------');
            console.log('.......................... Cannot VOTE TWICE FOR SAME PROPOSAL ? ..................... ');

            let test_account_2_balancebefore = await EticaReleaseInstance.balanceOf(test_account2.address);
            let test_account_2_stakebefore = await EticaReleaseInstance.stakes(test_account2.address, 1);
            //console.log('test_account3 ETI balance before:', web3.utils.fromWei(test_account_3_balancebefore, "ether" ));
            //console.log('test_account3 Stake before:', test_account_3_stakebefore);
            //console.log('test_account3 Stake amount before:', web3.utils.fromWei(test_account_3_stakebefore.amount, "ether" ));

            let test_account_2_bosomsbefore = await EticaReleaseInstance.bosoms(test_account2.address);
            //console.log('test_account3 Bosoms before:', web3.utils.fromWei(test_account_3_bosomsbefore, "ether" ));

            let first_proposal = await EticaReleaseInstance.proposals(EXPECTED_FIRST_PROPOSAL_PROPOSED_RELEASE_HASH);
                        let proposalsCounter = await EticaReleaseInstance.proposalsCounter();
                        //console.log('THE FIRST PROPOSAL IS:', first_proposal);


            let lstblock = await web3.eth.getBlock("latest");
            //console.log('last block s timestamp is', lstblock.timestamp);
            let first_proposal_data_after = await EticaReleaseInstance.propsdatas(first_proposal.proposed_release_hash);
            //console.log('THE FIRST PROPOSAL ENDTIME IS:', first_proposal_data_after.endtime.toString());

            // vote should still be wothin time limits as we don't want the vote to fail for this reason:
            assert(lstblock.timestamp <= first_proposal_data_after.endtime + 60, 'Block timestamp should be lower than revealing time end before testing CANNOT REVEAL VOTE TWICE ON SAME PROPOSAL');
            assert(lstblock.timestamp >= first_proposal_data_after.endtime, 'Block timestamp should be higher than first proposal endvote before testing CANNOT REVEAL VOTE TWICE ON SAME PROPOSAL');

           // try to VOTE for proposal, should fail:
           return EticaReleaseInstance.revealvote(first_proposal.proposed_release_hash, true, web3.utils.toWei('4', 'ether'), "random123", {from: test_account2.address}).then(assert.fail)
              .catch(async function(error){
                assert(true);
                let test_account_2_balanceafter = await EticaReleaseInstance.balanceOf(test_account2.address);
                let test_account_2_stakeafter = await EticaReleaseInstance.stakes(test_account2.address,1);
                let test_account_2_bosomsafter = await EticaReleaseInstance.bosoms(test_account2.address);
                let first_proposal_vote_after = await EticaReleaseInstance.votes(first_proposal.proposed_release_hash, test_account2.address);
                //console.log('test_account3 ETI balance after:', web3.utils.fromWei(test_account_3_balanceafter, "ether" ));
                //console.log('test_account3 Stake after:', test_account_3_stakeafter);
                //console.log('test_account3 Vote is:', first_proposal_vote_after);
                assert.equal(web3.utils.fromWei(test_account_2_bosomsbefore, "ether" ) - web3.utils.fromWei(test_account_2_bosomsafter, "ether" ), "0", 'test_account2 should not have less Bosoms!');
                assert.equal(web3.utils.fromWei(first_proposal_vote_after.amount, "ether" ), "4", 'test_account2 should not have been able to revealvote twice for same proposal. So the vote amount should not have changed !');

                console.log('........................... VOTING TWICE ON SAME PROPOSAL is not possible ....................... ');
                console.log('------------------------------- END OF TEST with SUCCESS ---------------------------');
              });

          });
          
                                                      // test Proposals vote
                      it("can revealvote for Proposal", async function () {
                        console.log('------------------------------------ Starting test ---------------------------');
                        console.log('................................  CAN reveal VOTE FOR A PROPOSAL ? .......................');

                        let idofstruct = await EticaReleaseInstance.diseasesbyIds(EXPECTED_FIRST_DISEASE_HASH);
                        //console.log('idofstruct id: ', idofstruct);

                        let first_proposal = await EticaReleaseInstance.proposals(EXPECTED_FIRST_PROPOSAL_PROPOSED_RELEASE_HASH);
                        let proposalsCounter = await EticaReleaseInstance.proposalsCounter();
                        //console.log('THE FIRST PROPOSAL IS:', first_proposal);

                        let first_proposal_data = await EticaReleaseInstance.propsdatas(first_proposal.proposed_release_hash);
                        console.log('THE FIRST PROPOSAL DATA IS:', first_proposal_data);
                        console.log('old slashingratio is', first_proposal_data.slashingratio.toString());

                        let first_proposal_vote_before = await EticaReleaseInstance.votes(first_proposal.proposed_release_hash, test_account4.address);
                        console.log('THE FIRST PROPOSAL VOTE BEFORE revealvote IS:', first_proposal_vote_before);
                        

                        let test_account_4_balancebefore = await EticaReleaseInstance.balanceOf(test_account4.address);
                        //console.log('test_account4 ETI balance before revealvote IS:', web3.utils.fromWei(test_account_4_balancebefore, "ether" ));

                        let test_account_4_bosomsbefore = await EticaReleaseInstance.bosoms(test_account4.address);
                        //console.log('test_account Bosoms before revealvote IS:', web3.utils.fromWei(test_account_2_bosomsbefore, "ether" ));

                        return EticaReleaseInstance.revealvote(first_proposal.proposed_release_hash, true, web3.utils.toWei('3', 'ether'), "random123", {from: test_account4.address}).then(async function(response){

                          let first_proposal_data_after = await EticaReleaseInstance.propsdatas(first_proposal.proposed_release_hash);
                          console.log('THE FIRST PROPOSAL DATA AFTER revealvote IS:', first_proposal_data_after);
                          console.log('new slashingratio is', first_proposal_data_after.slashingratio.toString());
                          assert.equal(first_proposal_data_after.slashingratio.toString(), '2728', 'the proposal slashingratio should be 4000 after 2 for votes of 7 Bosoms and 1 against vote of 4 Bosoms');

                          let first_proposal_vote_after = await EticaReleaseInstance.votes(first_proposal.proposed_release_hash, test_account4.address);
                          //console.log('THE FIRST PROPOSAL VOTE AFTER revealvote IS:', first_proposal_vote_after);

                          assert.equal(web3.utils.fromWei(first_proposal_vote_after.amount, "ether" ), "3", 'test_account4 should have been able to vote for 3 Bosoms!');

                          /*let test_account_2_bosomsafter = await EticaReleaseInstance.bosoms(test_account2.address);

                          assert.equal(web3.utils.fromWei(test_account_2_bosomsbefore.toString(), "ether" ) - web3.utils.fromWei(test_account_2_bosomsafter.toString(), "ether" ), "1", 'test_account2 should have 1 Bosom less!');*/

                          let first_period = await EticaReleaseInstance.periods(first_proposal.period_id);
                          assert.equal(first_period.total_voters.toNumber(), 3, 'First period should have 3 voters');
                          assert.equal(first_period.forprops.toNumber(), 1, 'First period should have 1 forprops');
                          assert.equal(first_period.againstprops.toNumber(), 0, 'First period should have 0 againstprops');
                      


                        // ------------ WARNING
                        // NEED TO CHECK test_acount has 10 ETI less than before creating propoosal and CHECK if default vote has been registered
                        // ------------ WARNING

                        console.log('................................  CAN REVEALVOTE FOR A PROPOSAL  ....................... ');
                        console.log('------------------------------- END OF TEST with SUCCESS ----------------------------');
                        });



                        });
          


          // test too late voting should fail
          it("cannot revealvote too late :", async function () {
            console.log('------------------------------- Starting test ---------------------------');
            console.log('.......................... Cannot REVEALVOTE TOO LATE ? ..................... ');
            await advanceminutes(2);
            let test_account_3_balancebefore = await EticaReleaseInstance.balanceOf(test_account3.address);
            let test_account_3_stakebefore = await EticaReleaseInstance.stakes(test_account3.address, 1);
            //console.log('test_account3 ETI balance before:', web3.utils.fromWei(test_account_3_balancebefore, "ether" ));
            //console.log('test_account3 Stake before:', test_account_3_stakebefore);
            //console.log('test_account3 Stake amount before:', web3.utils.fromWei(test_account_3_stakebefore.amount, "ether" ));

            let test_account_3_bosomsbefore = await EticaReleaseInstance.bosoms(test_account3.address);
            //console.log('test_account3 Bosoms before:', web3.utils.fromWei(test_account_3_bosomsbefore, "ether" ));

            let first_proposal = await EticaReleaseInstance.proposals(EXPECTED_FIRST_PROPOSAL_PROPOSED_RELEASE_HASH);
                        let proposalsCounter = await EticaReleaseInstance.proposalsCounter();
                        //console.log('THE FIRST PROPOSAL IS:', first_proposal);

            //assert(web3.utils.fromWei(test_account_3_bosomsbefore, "ether" ) >= 1, 'test_account3 should have enough Bosoms before CALLING revealvote FUNCTION (because revealvote function should fail but not for this reason)');

            let lstblock = await web3.eth.getBlock("latest");
            //console.log('last block s timestamp is', lstblock.timestamp);
            let first_proposal_data_after = await EticaReleaseInstance.propsdatas(first_proposal.proposed_release_hash);
            //console.log('THE FIRST PROPOSAL ENDTIME IS:', first_proposal_data_after.endtime.toString());

            // revealvote should fail as revealing period has already been passed:
            console.log('lstblock.timestamp is', lstblock.timestamp);
            console.log('first_proposal_data_after.endtime is', first_proposal_data_after.endtime.toString());
            assert(lstblock.timestamp > first_proposal_data_after.endtime.toNumber() + 60, 'Block timestamp should be higher than first proposal end OF revealvoting before testing CANNOT REVEALVOTE TOO LATE');

           // try to VOTE for proposal, should be too late:
           return EticaReleaseInstance.revealvote(first_proposal.proposed_release_hash, true, web3.utils.toWei('1', 'ether'), "random123", {from: test_account3.address}).then(assert.fail)
              .catch(async function(error){
                assert(true);
                let test_account_3_balanceafter = await EticaReleaseInstance.balanceOf(test_account3.address);
                let test_account_3_stakeafter = await EticaReleaseInstance.stakes(test_account3.address,1);
                let test_account_3_bosomsafter = await EticaReleaseInstance.bosoms(test_account3.address);
                let first_proposal_vote_after = await EticaReleaseInstance.votes(first_proposal.proposed_release_hash, test_account3.address);
                //console.log('test_account3 ETI balance after:', web3.utils.fromWei(test_account_3_balanceafter, "ether" ));
                //console.log('test_account3 Stake after:', test_account_3_stakeafter);
                //console.log('test_account3 Vote is:', first_proposal_vote_after);
                assert.equal(web3.utils.fromWei(test_account_3_bosomsbefore, "ether" ) - web3.utils.fromWei(test_account_3_bosomsafter, "ether" ), "0", 'test_account3 should not have less Bosoms!');
                assert.equal(first_proposal_vote_after.amount, "0", 'test_account3 should not have been able to vote too late!');

                console.log('........................... Too late REVEALVOTING is not possible ....................... ');
                console.log('------------------------------- END OF TEST with SUCCESS ---------------------------');
              });

          });




          // test Stake claiming too soon should fail
          it("cannot claim stake after stake end (when user has not called clmpropbyhash function yet)", async function () {
            console.log('------------------------------- Starting test ---------------------------');
            console.log('.......................... Cannot claim STAKE after THE STAKE END ? (when user has not called redeem function yet) ..................... ');
            let test_accountbalancebefore = await EticaReleaseInstance.balanceOf(test_account.address);
            let test_accountstakebefore = await EticaReleaseInstance.stakes(test_account.address, 1);
            //console.log('test_account ETI balance before:', web3.utils.fromWei(test_accountbalancebefore, "ether" ));
            //console.log('test_account Stake before:', test_accountstakebefore);
            //console.log('test_account Stake amount before:', web3.utils.fromWei(test_accountstakebefore.amount, "ether" ));

            console.log('------------- BEGIN BLOCKS ADVANCEMENT --------------');
            let blocknb_before = await web3.eth.getBlock("latest");
            console.log('LastBlock\'s NUMBER IS:', blocknb_before.number);
            console.log('LastBlock\'s TIMESTAMP IS:', blocknb_before.timestamp);
            console.log('------------- ADVANCING BLOCKS --------------');
            await advanceminutes(1);
            console.log('------------- ADVANCING BLOCKS --------------');
            let blocknb_after = await web3.eth.getBlock("latest");
            console.log('LastBlock\'s NUMBER IS NOW:', blocknb_after.number);
            console.log('LastBlock\'s TIMESTAMP IS NOW:', blocknb_after.timestamp);
            console.log('------------- BLOCKS ADVANCED --------------');

           // try create to claim a stake after it has ended:
              return EticaReleaseInstance.stakeclmidx(1, {from: test_account.address}).then(assert.fail)
              .catch(async function(error){
                assert(true);
                let test_accountbalanceafter = await EticaReleaseInstance.balanceOf(test_account.address);
                let test_accountstakeafter = await EticaReleaseInstance.stakes(test_account.address,1);
                let stakenoldbalance = web3.utils.toBN(test_accountbalancebefore).add(web3.utils.toBN(test_accountstakebefore.amount)).toString();
                //console.log('------test_account ETI balance after:', web3.utils.fromWei(test_accountbalanceafter, "ether" ));
                //console.log('------stakenoldbalance is:::', web3.utils.fromWei(stakenoldbalance, "ether"));
                //console.log('test_account Stake after:', test_accountstakeafter);

                assert.equal(web3.utils.fromWei(test_accountbalanceafter, "ether" ) - web3.utils.fromWei(test_accountbalancebefore, "ether" ), "0", 'test_account should not have more Eticas!');

                console.log('........................... Cannot claim STAKE after THE STAKE END (when user has not called redeem function yet) ....................... ');
                console.log('------------------------------- END OF TEST with SUCCESS ---------------------------');
              });

          });





                              // test Proposals vote claims
                              it("can claim a right vote for a Proposal", async function () {
                                console.log('------------------------------------ Starting test ---------------------------');
                                console.log('................................  CAN CLAIM A RIGHT VOTE FOR A PROPOSAL ? .......................');
        
                                
        
                                let first_proposal = await EticaReleaseInstance.proposals(EXPECTED_FIRST_PROPOSAL_PROPOSED_RELEASE_HASH);
                                let proposalsCounter = await EticaReleaseInstance.proposalsCounter();
                                //console.log('THE FIRST PROPOSAL IS:', first_proposal);
        
                                let first_proposal_data = await EticaReleaseInstance.propsdatas(first_proposal.proposed_release_hash);
                                //console.log('THE FIRST PROPOSAL DATA IS:', first_proposal_data);
        
                                let first_proposal_vote_before = await EticaReleaseInstance.votes(first_proposal.proposed_release_hash, test_account.address);
                                //console.log('THE FIRST PROPOSAL VOTE BEFORE revealvote IS:', first_proposal_vote_before);
        
                                let test_account_2_balancebefore = await EticaReleaseInstance.balanceOf(test_account2.address);
                                console.log('test_account ETI balance before revealvote IS:', web3.utils.fromWei(test_account_2_balancebefore, "ether" ));
        
                                let test_account_2_bosomsbefore = await EticaReleaseInstance.bosoms(test_account2.address);
                                //console.log('test_account Bosoms before revealvote IS:', web3.utils.fromWei(test_account_2_bosomsbefore, "ether" ));

                                await advanceminutes(6);
        
                                return EticaReleaseInstance.clmpropbyhash(first_proposal.proposed_release_hash, {from: test_account2.address}).then(async function(response){
        
                                  let first_proposal_data_after = await EticaReleaseInstance.propsdatas(first_proposal.proposed_release_hash);
                                  //console.log('THE FIRST PROPOSAL DATA AFTER revealvote IS:', first_proposal_data_after);
        
                                  let first_proposal_vote_after = await EticaReleaseInstance.votes(first_proposal.proposed_release_hash, test_account2.address);
                                  //console.log('THE FIRST PROPOSAL VOTE AFTER revealvote IS:', first_proposal_vote_after);
        

                                  let test_account_2_balanceafter = await EticaReleaseInstance.balanceOf(test_account2.address);
                                  console.log('test_account ETI balance after revealvote IS:', web3.utils.fromWei(test_account_2_balanceafter, "ether" ));
                                  console.log('test_account ETI balance before revealvote WAS:', web3.utils.fromWei(test_account_2_balancebefore, "ether" ));

                                 // assert(web3.utils.fromWei(test_account_2_balanceafter.toString() - test_account_2_balancebefore.toString(), "ether" ) > 0, 'test_account5 should have more ETI!');
        
        
                                // ------------ WARNING
                                // NEED TO CHECK test_acount has 10 ETI less than before creating propoosal and CHECK if default vote has been registered
                                // ------------ WARNING
        
                                console.log('................................  CAN CLAIM A RIGHT VOTE FOR A PROPOSAL  ....................... ');
                                console.log('------------------------------- END OF TEST with SUCCESS ----------------------------');
                                });
        
        
        
                                });
                              
                                
                                                            // test Proposals vote claims
                              it("can claim a right vote for a Proposal as proposer", async function () {
                                console.log('------------------------------------ Starting test ---------------------------');
                                console.log('....................  CAN CLAIM A RIGHT VOTE FOR A PROPOSAL AS PROPOSER ? .......................');
        
                                
        
                                let first_proposal = await EticaReleaseInstance.proposals(EXPECTED_FIRST_PROPOSAL_PROPOSED_RELEASE_HASH);
                                let proposalsCounter = await EticaReleaseInstance.proposalsCounter();
                                //console.log('THE FIRST PROPOSAL IS:', first_proposal);
        
                                let first_proposal_data = await EticaReleaseInstance.propsdatas(first_proposal.proposed_release_hash);
                                //console.log('THE FIRST PROPOSAL DATA IS:', first_proposal_data);
        
                                let first_proposal_vote_before = await EticaReleaseInstance.votes(first_proposal.proposed_release_hash, test_account.address);
                                //console.log('THE FIRST PROPOSAL VOTE BEFORE revealvote IS:', first_proposal_vote_before);
        
                                let test_account_balancebefore = await EticaReleaseInstance.balanceOf(test_account.address);
                                console.log('test_account ETI balance before revealvote IS:', web3.utils.fromWei(test_account_balancebefore, "ether" ));
        
                                let test_account_bosomsbefore = await EticaReleaseInstance.bosoms(test_account.address);
                                //console.log('test_account Bosoms before revealvote IS:', web3.utils.fromWei(test_account_bosomsbefore, "ether" ));

        
                                return EticaReleaseInstance.clmpropbyhash(first_proposal.proposed_release_hash, {from: test_account.address}).then(async function(response){
        
                                  let first_proposal_data_after = await EticaReleaseInstance.propsdatas(first_proposal.proposed_release_hash);
                                  //console.log('THE FIRST PROPOSAL DATA AFTER revealvote IS:', first_proposal_data_after);
        
                                  let first_proposal_vote_after = await EticaReleaseInstance.votes(first_proposal.proposed_release_hash, test_account.address);
                                  //console.log('THE FIRST PROPOSAL VOTE AFTER revealvote IS:', first_proposal_vote_after);
        

                                  let test_account_balanceafter = await EticaReleaseInstance.balanceOf(test_account.address);
                                  console.log('test_account ETI balance after revealvote IS:', web3.utils.fromWei(test_account_balanceafter, "ether" ));
                                  console.log('test_account ETI balance before revealvote WAS:', web3.utils.fromWei(test_account_balancebefore, "ether" ));

                                 // assert(web3.utils.fromWei(test_account_balanceafter.toString() - test_account_balancebefore.toString(), "ether" ) > 0, 'test_account5 should have more ETI!');
        
        
                                // ------------ WARNING
                                // NEED TO CHECK test_acount has 10 ETI less than before creating propoosal and CHECK if default vote has been registered
                                // ------------ WARNING
        
                                console.log('.....................  CAN CLAIM A RIGHT VOTE FOR A PROPOSAL AS PROPOSER  ....................... ');
                                console.log('------------------------------- END OF TEST with SUCCESS ----------------------------');
                                });
        
        
        
                                });  


                              // test Proposals vote claims
                              it("can claim a wrong vote for a Proposal", async function () {
                                console.log('------------------------------------ Starting test ---------------------------');
                                console.log('................................  CAN CLAIM A WRONG VOTE FOR A PROPOSAL ? .......................');
        
                                
        
                                let first_proposal = await EticaReleaseInstance.proposals(EXPECTED_FIRST_PROPOSAL_PROPOSED_RELEASE_HASH);
                                let proposalsCounter = await EticaReleaseInstance.proposalsCounter();
                                //console.log('THE FIRST PROPOSAL IS:', first_proposal);
        
                                let first_proposal_data = await EticaReleaseInstance.propsdatas(first_proposal.proposed_release_hash);
                                //console.log('THE FIRST PROPOSAL DATA IS:', first_proposal_data);
        
                                let first_proposal_vote_before = await EticaReleaseInstance.votes(first_proposal.proposed_release_hash, test_account.address);
                                //console.log('THE FIRST PROPOSAL VOTE BEFORE revealvote IS:', first_proposal_vote_before);
        
                                let test_account_5_balancebefore = await EticaReleaseInstance.balanceOf(test_account5.address);
                                console.log('test_account ETI balance before revealvote IS:', web3.utils.fromWei(test_account_5_balancebefore, "ether" ));
        
                                let test_account_5_bosomsbefore = await EticaReleaseInstance.bosoms(test_account5.address);
                                //console.log('test_account Bosoms before revealvote IS:', web3.utils.fromWei(test_account_5_bosomsbefore, "ether" ));

                                let test_account5stakebefore = await EticaReleaseInstance.stakes(test_account5.address,1);
                                console.log('test_account5 first stake BEFORE CLMPROPBYHASH WAS:', test_account5stakebefore);
                                 console.log('stake amount is', test_account5stakebefore.amount.toString());
                                 console.log('stake startTime is', test_account5stakebefore.startTime.toString());
                                 console.log('stake endTime is', test_account5stakebefore.endTime.toString());

                                await advanceminutes(6);
        
                                return EticaReleaseInstance.clmpropbyhash(first_proposal.proposed_release_hash, {from: test_account5.address}).then(async function(response){
        
                                  let first_proposal_data_after = await EticaReleaseInstance.propsdatas(first_proposal.proposed_release_hash);
                                  //console.log('THE FIRST PROPOSAL DATA AFTER revealvote IS:', first_proposal_data_after);
        
                                  let first_proposal_vote_after = await EticaReleaseInstance.votes(first_proposal.proposed_release_hash, test_account5.address);
                                  //console.log('THE FIRST PROPOSAL VOTE AFTER revealvote IS:', first_proposal_vote_after);
        

                                  let test_account_5_balanceafter = await EticaReleaseInstance.balanceOf(test_account5.address);
                                  console.log('test_account ETI balance after revealvote IS:', web3.utils.fromWei(test_account_5_balanceafter, "ether" ));
                                  console.log('test_account ETI balance before revealvote WAS:', web3.utils.fromWei(test_account_5_balancebefore, "ether" ));

                                 // assert(web3.utils.fromWei(test_account_5_balanceafter.toString() - test_account_5_balancebefore.toString(), "ether" ) > 0, 'test_account5 should have more ETI!');

                                 let test_account5stakeafter = await EticaReleaseInstance.stakes(test_account5.address,1);
                                 console.log('test_account5 stake AFTER CLMPROPBYHASH IS:', test_account5stakeafter);
                                 console.log('stake amount is', test_account5stakeafter.amount.toString());
                                 console.log('stake startTime is', test_account5stakebefore.startTime.toString());
                                 console.log('stake endTime is', test_account5stakeafter.endTime.toString());
        
        
                                // ------------ WARNING
                                // NEED TO CHECK test_acount has 10 ETI less than before creating propoosal and CHECK if default vote has been registered
                                // ------------ WARNING
        
                                console.log('..........................  CAN CLAIM A WRONG VOTE FOR A PROPOSAL  ....................... ');
                                console.log('------------------------------- END OF TEST with SUCCESS ----------------------------');
                                });
        
        
        
                                });


            // test Stake claiming too soon should fail
            it("can claim stake after stake end. (when user called redeem function (clmpropbyhash))", async function () {
              console.log('------------------------------- Starting test ---------------------------');
              console.log('.......................... Can claim STAKE after THE STAKE END  ? (when user called redeem function (clmpropbyhash)) ..................... ');
              let test_account2balancebefore = await EticaReleaseInstance.balanceOf(test_account2.address);
              let test_account2stakebefore = await EticaReleaseInstance.stakes(test_account2.address, 1);
              //console.log('test_account2 ETI balance before:', web3.utils.fromWei(test_account2balancebefore, "ether" ));
              //console.log('test_account2 Stake before:', test_account2stakebefore);
              //console.log('test_account2 Stake amount before:', web3.utils.fromWei(test_account2stakebefore.amount, "ether" ));

              console.log('------------- BEGIN BLOCKS ADVANCEMENT --------------');
              let blocknb_before = await web3.eth.getBlock("latest");
              console.log('LastBlock\'s NUMBER IS:', blocknb_before.number);
              console.log('LastBlock\'s TIMESTAMP IS:', blocknb_before.timestamp);
              console.log('------------- ADVANCING BLOCKS --------------');
              await advanceminutes(1);
              console.log('------------- ADVANCING BLOCKS --------------');
              let blocknb_after = await web3.eth.getBlock("latest");
              console.log('LastBlock\'s NUMBER IS NOW:', blocknb_after.number);
              console.log('LastBlock\'s TIMESTAMP IS NOW:', blocknb_after.timestamp);
              console.log('------------- BLOCKS ADVANCED --------------');

             // try create to claim a stake after it has ended:
                return EticaReleaseInstance.stakeclmidx(1, {from: test_account2.address}).then(async function(resp){
                  assert(true);
                  let test_account2balanceafter = await EticaReleaseInstance.balanceOf(test_account2.address);
                  let test_account2stakeafter = await EticaReleaseInstance.stakes(test_account2.address,1);
                  let stakenoldbalance = web3.utils.toBN(test_account2balancebefore).add(web3.utils.toBN(test_account2stakebefore.amount)).toString();
                  //console.log('------test_account2 ETI balance after:', web3.utils.fromWei(test_account2balanceafter, "ether" ));
                  //console.log('------stakenoldbalance is:::', web3.utils.fromWei(stakenoldbalance, "ether"));
                  //console.log('test_account2 Stake after:', test_account2stakeafter);

                  assert.equal( web3.utils.fromWei(test_account2balanceafter, "ether"), web3.utils.fromWei(stakenoldbalance, "ether"), 'test_account2 should have increased by the stake\'s ETI amount!');

                  console.log('........................... Can claim STAKE after THE STAKE END (when user called redeem function (clmpropbyhash)) ....................... ');
                  console.log('------------------------------- END OF TEST with SUCCESS ---------------------------');
                });

            });


  async function printBalances(accounts) {
    // accounts.forEach(function(ac, i) {
       var balance_val = await (web3.eth.getBalance(accounts[0]));
       //console.log('acct 0 balance', web3.utils.fromWei(balance_val.toString() , 'ether') )
    // })
   }

   async function advanceseconds(duration) {

   let numberlblocks = uint(duration / 15);

   console.log('numberlblocks is', numberlblocks);

     for(var i=0;i<numberlbocks;i+=1){


/*  await web3.currentProvider.send({
     jsonrpc: '2.0',
     method: 'evm_increaseTime',
     params: [15], // each blocks ads 30 seconds
     id: id,
   }, err1 => {
     if (err1) return
   })*/

   await web3.currentProvider.send({
       jsonrpc: '2.0',
       method: 'evm_mine',
       id: id+1,
     }, (err2, res) => {
       return
     })


     }

   }

   async function advanceminutes(duration) {

    let id = Date.now();
     let numberlblocks = duration * 4; // 4 is because 60 / 15 == 4

     console.log('numberlblocks is', numberlblocks);

       for(var i=0;i<numberlblocks;i+=1){


    await web3.currentProvider.send({
       jsonrpc: '2.0',
       method: 'evm_increaseTime',
       params: [15], // each blocks ads 30 seconds
       id: id,
     }, err1 => {
       if (err1) return
     })

     await web3.currentProvider.send({
         jsonrpc: '2.0',
         method: 'evm_mine',
         id: i+1,
       }, (err2, res) => {
         return
       })


       }

   }

   async function advanceblocks(numberlbocks) {
     let numberlblocks = uint(numberlbocks * 60 / 15);
     console.log('numberlblocks2 is', numberlblocks);
     for(var i=0;i<numberlblocks;i+=1){
    await web3.currentProvider.send(
      {jsonrpc: "2.0", method: "evm_mine", id: i},
    (err2, res) => {

  return
});
     }
   }

   function get_expected_votehash(_proposed_release_hash, _approved, _msgsender, _vary) {
    var encoded = abi.rawEncode([ "bytes32", "bool", "address", "string"], [ _proposed_release_hash, _approved, _msgsender, _vary ]);
    var result_hash = web3.utils.keccak256(encoded);
    console.log('get_expected_votehash() result is ', result_hash);
  
    return web3.utils.keccak256(encoded); // example: should be '0xf6d8716087544b8fe1a306611913078dd677450d90295497e433503483ffea6e' for 'Malaria'
  
   }
   

 });
