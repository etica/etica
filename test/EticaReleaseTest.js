var EticaRelease = artifacts.require("./EticaRelease.sol");

var solidityHelper =  require('./solidity-helper');
var miningHelper =  require('./mining-helper-fast');
var networkInterfaceHelper =  require('./network-interface-helper');

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

 var miner_account= {
    'address': '0x5FBd856f7f0c79723100FF6e1450cC1464D3fffC',
    'privateKey': '16b271fdb3eb17a065d4227a3087fa140ba0f88d0d66e7eaa778e3e5c0c6838c'
}

var PROPOSAL_CREATION_AMOUNT = 10;



    it("can be minted", async function () {


      await printBalances(accounts)

  //canoe

  //7.3426930413956622283065143620738574142638959639431768834166324387693517887725e+76)

      var tokenContract = await EticaRelease.deployed();

      console.log('contract')

      console.log(tokenContract.address)
      var from_address = '0x2B63dB710e35b0C4261b1Aa4fAe441276bfeb971';

      var challenge_number = '0x513d3339b587b62e4ea2b9d2762113a245f9fdad264d37bcc6829ce66bd4d456';


    //  challenge_number = '0x513d3339b587b62e4ea2b9d2762113a245f9fdad264d37bcc6829ce66bd4d456';

      challenge_number = '0x085078f6e3066836445e800334b4186d99567065512edfe78fa7a4f611d51c3d'

       var solution_number = 1185888746
      var solution_digest = '0x000016d56489592359ce8e8b61ec335aeb7b7dd5695da22e25ab2039e02c8976'

      //var from_address = '0x2B63dB710e35b0C4261b1Aa4fAe441276bfeb971';

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


    var tokenContract = await EticaRelease.deployed();

    console.log('contract')

    console.log(tokenContract.address)

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
      console.log('!!!!!!!!!! test_acount NUMBER OF STAKES !!!!!!!!!!!!!');
      console.log('!!!!!!!!!! test_acount NUMBER OF STAKES !!!!!!!!!!!!!');
      console.log('!!!!!!!!!! test_acount NUMBER OF STAKES !!!!!!!!!!!!!');
      console.log('!!!!!!!!!! test_acount NUMBER OF STAKES !!!!!!!!!!!!!');
    console.log('test_acount NUMBER OF STAKES IS', response);
    let stakesl = await EticaReleaseInstance.stakescount(test_account.address);
    console.log('RESPONSE IS::::', stakesl);
    console.log('!!!!!!!!!! test_acount NUMBER OF STAKES !!!!!!!!!!!!!');
    console.log('!!!!!!!!!! test_acount NUMBER OF STAKES !!!!!!!!!!!!!');
    console.log('!!!!!!!!!! test_acount NUMBER OF STAKES !!!!!!!!!!!!!');
    console.log('!!!!!!!!!! test_acount NUMBER OF STAKES !!!!!!!!!!!!!');
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
  console.log('miner_account ETI balance before:', web3.utils.fromWei(miner_accountbalancebefore, "ether" ));
  console.log('test_account ETI balance before:', web3.utils.fromWei(test_accountbalancebefore, "ether" ));
  return EticaReleaseInstance.transfer(test_account.address,  web3.utils.toBN(10000000000000000000), {from: miner_account.address});

}).then(async function(){
  // consoling result of ETI transfer from miner_account to test_account
  let test_accountbalanceafter = await EticaReleaseInstance.balanceOf(test_account.address);
  let miner_accountbalanceafter = await EticaReleaseInstance.balanceOf(miner_account.address);
  console.log('miner_account ETI balance after:', web3.utils.fromWei(miner_accountbalanceafter, "ether" ));
  console.log('test_account ETI balance after:', web3.utils.fromWei(test_accountbalanceafter, "ether" ));
}).then(async function(){
  console.log('transfering 1 ETI from miner_account to eptestusersa');
  let miner_accountbalancebefore = await EticaReleaseInstance.balanceOf(miner_account.address);
  let eptestusersabalancebefore = await EticaReleaseInstance.balanceOf(eptestusersa);
  console.log('miner_account ETI balance before:', web3.utils.fromWei(miner_accountbalancebefore, "ether" ));
  console.log('eptestusersa ETI balance before:', web3.utils.fromWei(eptestusersabalancebefore, "ether" ));
  return EticaReleaseInstance.transfer(eptestusersa,  web3.utils.toBN(1000000000000000000), {from: miner_account.address});

}).then(async function(){
  let miner_accountbalanceafter = await EticaReleaseInstance.balanceOf(miner_account.address);
  let eptestusersabalanceafter = await EticaReleaseInstance.balanceOf(eptestusersa);
  console.log('miner_account ETI balance after:', web3.utils.fromWei(miner_accountbalanceafter, "ether" ));
  console.log('eptestusersa ETI balance after:', web3.utils.fromWei(eptestusersabalanceafter, "ether" ));
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
    console.log('test_account ETI balance before:', web3.utils.fromWei(test_accountbalancebefore, "ether" ));
    console.log('test_account Bosoms balance before:', web3.utils.fromWei(test_accountbosomsbefore, "ether" ));
   // try staking 2 ETI:
      return EticaReleaseInstance.eticatobosoms(test_account.address,  web3.utils.toBN(2000000000000000000), {from: test_account.address}).then(async function(receipt){
    let test_accountbalanceafter = await EticaReleaseInstance.balanceOf(test_account.address);
    let test_accountbosomsafter = await EticaReleaseInstance.bosomsOf(test_account.address);
    console.log('test_account ETI balance after:', web3.utils.fromWei(test_accountbalanceafter, "ether" ));
    console.log('test_account Bosoms balance after:', web3.utils.fromWei(test_accountbosomsafter, "ether" ));
    assert.equal(web3.utils.fromWei(test_accountbosomsafter, "ether" ), "2", 'test_account should have 2 Bosoms!');
    assert.equal(web3.utils.fromWei(test_accountbalancebefore, "ether" ) - web3.utils.fromWei(test_accountbalanceafter, "ether" ), "2", 'test_account should have 2 Eticas less!');
    console.log('.................................  CAN STAKE ETI for BOSOMS  ....................... ');
    console.log('---------------------------------- END OF TEST with SUCCESS ----------------------------');
    })

  });

  // Should fail try to stake more eticas than available in wallet
    it("cannot OVER stake eticas for bosoms :", async function () {
      console.log('------------------------------------ Starting test ---------------------------');
      console.log('................................  OVERSTAKING IS NOT POSSIBLE ? .......................');
      let test_accountbalancebefore = await EticaReleaseInstance.balanceOf(test_account.address);
      let test_accountbosomsbefore = await EticaReleaseInstance.bosomsOf(test_account.address);
      console.log('test_account ETI balance before:', web3.utils.fromWei(test_accountbalancebefore, "ether" ));
      console.log('test_account Bosoms balance before:', web3.utils.fromWei(test_accountbosomsbefore, "ether" ));
      let stakeamount = 300000;
      let overstake = web3.utils.toWei(stakeamount.toString(), 'ether');
     // try staking 300000 ETI:
        return EticaReleaseInstance.eticatobosoms(test_account.address,  web3.utils.toBN(overstake), {from: test_account.address}).then(assert.fail)
        .catch(async function(error){
          assert(true);
          let test_accountbalanceafter = await EticaReleaseInstance.balanceOf(test_account.address);
          let test_accountbosomsafter = await EticaReleaseInstance.bosomsOf(test_account.address);
          console.log('test_account ETI balance after:', web3.utils.fromWei(test_accountbalanceafter, "ether" ));
          console.log('test_account Bosoms balance after:', web3.utils.fromWei(test_accountbosomsafter, "ether" ));
          assert.equal(web3.utils.fromWei(test_accountbosomsafter, "ether" ), web3.utils.fromWei(test_accountbosomsbefore, "ether" ), 'test_account should not have more Bosoms!');
          assert.equal(web3.utils.fromWei(test_accountbalancebefore, "ether" ) - web3.utils.fromWei(test_accountbalanceafter, "ether" ), "0", 'test_account should not have less Eticas!');
          console.log('Over Staking has been tested successfully');
          console.log('.................................  OVERSTAKING IS NOT POSSIBLE  ....................... ');
          console.log('----------------------------------- END OF TEST with SUCCESS ----------------------------');
        })

    });

    // test Period creation and issuance
      it("can create new Period and issue Period Reward's ETI:", async function () {
        console.log('------------------------------------ Starting test ---------------------------');
        console.log('................................  CAN CREATE A PERIOD ? .......................');
        let supply_before = await EticaReleaseInstance.totalSupply();
        let contractbalancebefore = await EticaReleaseInstance.balanceOf(EticaReleaseInstance.address);
        console.log('SUPPLY ETI before Period creation:', web3.utils.fromWei(supply_before, "ether" ));
        console.log('CONTRACT ETI balance before Period creation:', web3.utils.fromWei(contractbalancebefore, "ether" ));
        let first_period = await EticaReleaseInstance.periods(1);
        let periodsCounter = await EticaReleaseInstance.periodsCounter();
       console.log('(should be empty as no period exists yet) FIRST PERIOD IS:', first_period);
       console.log('(should be 0 as no period exists yet)NUMBER OF PERIODS IS:', periodsCounter);
       // try create new period:
          return EticaReleaseInstance.newPeriod().then(async function(receipt){
            let supply_after = await EticaReleaseInstance.totalSupply();
            let contractbalanceafter = await EticaReleaseInstance.balanceOf(EticaReleaseInstance.address);
            console.log('SUPPLY ETI after Period creation:', web3.utils.fromWei(supply_after, "ether" ));
            console.log('CONTRACT ETI balance after Period creation:', web3.utils.fromWei(contractbalanceafter, "ether" ));
            let first_period = await EticaReleaseInstance.periods(1);
            let periodsCounter = await EticaReleaseInstance.periodsCounter();
        console.log('THE FIRST PERIOD IS:', first_period);
        console.log('INTERVAL OF THE FIRST PERIOD IS:', first_period.interval.toNumber());
        console.log('NUMBER OF PERIODS IS:', periodsCounter);
        assert.equal(first_period.id.toNumber(), 1, 'First period should exists');
        assert.equal(periodsCounter, 1, 'First period should exists');
        console.log('................................  CAN CREATE A PERIOD  ....................... ');
        console.log('------------------------------- END OF TEST with SUCCESS ----------------------------');
        })
      });


      it("can get stakes length", async function () {
        return EticaRelease.deployed().then(function(instance){
          EticaReleaseInstance = instance;
          return EticaReleaseInstance.stakescount(test_account.address);
        }).then(async function(response){
          console.log('!!!!!!!!!! test_acount NUMBER OF STAKES !!!!!!!!!!!!!');
          console.log('!!!!!!!!!! test_acount NUMBER OF STAKES !!!!!!!!!!!!!');
          console.log('!!!!!!!!!! test_acount NUMBER OF STAKES !!!!!!!!!!!!!');
          console.log('!!!!!!!!!! test_acount NUMBER OF STAKES !!!!!!!!!!!!!');
        console.log('test_acount NUMBER OF STAKES IS', response);
        let stakesl = await EticaReleaseInstance.stakescount(test_account.address);
        console.log('RESPONSE IS::::', stakesl);
        console.log('!!!!!!!!!! test_acount NUMBER OF STAKES !!!!!!!!!!!!!');
        console.log('!!!!!!!!!! test_acount NUMBER OF STAKES !!!!!!!!!!!!!');
        console.log('!!!!!!!!!! test_acount NUMBER OF STAKES !!!!!!!!!!!!!');
        console.log('!!!!!!!!!! test_acount NUMBER OF STAKES !!!!!!!!!!!!!');
        })





      });



      // test Period multiple issuance should fail
        it("cannot create 2 Periods with same Interval :", async function () {
          console.log('------------------------------- Starting test ---------------------------');
          console.log('.......................... Cannot CREATE 2 PERIODS with same Interval ? ..................... ');
          let supply_before = await EticaReleaseInstance.totalSupply();
          let contractbalancebefore = await EticaReleaseInstance.balanceOf(EticaReleaseInstance.address);
          console.log('SUPPLY ETI before Period creation:', web3.utils.fromWei(supply_before, "ether" ));
          console.log('CONTRACT ETI balance before Period creation:', web3.utils.fromWei(contractbalancebefore, "ether" ));
          let first_period = await EticaReleaseInstance.periods(1);
          let periodsCounter = await EticaReleaseInstance.periodsCounter();
         console.log('FIRST PERIOD IS:', first_period);
         console.log('NUMBER OF PERIODS IS:', periodsCounter);
         // try create new period:
            return EticaReleaseInstance.newPeriod().then(assert.fail)
            .catch(async function(error){
              assert(true);
              let supply_after = await EticaReleaseInstance.totalSupply();
              let contractbalanceafter = await EticaReleaseInstance.balanceOf(EticaReleaseInstance.address);
              console.log('SUPPLY ETI after Period creation:', web3.utils.fromWei(supply_after, "ether" ));
              console.log('CONTRACT ETI balance after Period creation:', web3.utils.fromWei(contractbalanceafter, "ether" ));
              let first_period = await EticaReleaseInstance.periods(1);
              let periodsCounter = await EticaReleaseInstance.periodsCounter();
          console.log('THE FIRST PERIOD IS:', first_period);
          console.log('INTERVAL OF THE FIRST PERIOD IS:', first_period.interval.toNumber());
          console.log('NUMBER OF PERIODS IS:', periodsCounter);
          assert.equal(periodsCounter, 1, 'Only First period should exist, no other period should have been created for same interval');
          console.log('........................... CREATING 2 PERIODS WITH SAME INTERVAL IS NOT POSSIBLE ....................... ');
          console.log('------------------------------- END OF TEST with SUCCESS ---------------------------');
            })

        });

        // test Stake claiming too soon should fail
          it("cannot claim stake too early :", async function () {
            console.log('------------------------------- Starting test ---------------------------');
            console.log('.......................... Cannot CLAIM STAKE TOO EARLY ? ..................... ');
            let test_accountbalancebefore = await EticaReleaseInstance.balanceOf(test_account.address);
            let test_accountstakebefore = await EticaReleaseInstance.stakes(test_account.address, 1);
            console.log('test_account ETI balance before:', web3.utils.fromWei(test_accountbalancebefore, "ether" ));
            console.log('test_account Stake before:', test_accountstakebefore);
            console.log('test_account Stake amount before:', web3.utils.fromWei(test_accountstakebefore.amount, "ether" ));

           // try create new period:
              return EticaReleaseInstance.stakeclmidx(1, {from: test_account.address}).then(assert.fail)
              .catch(async function(error){
                assert(true);
                let test_accountbalanceafter = await EticaReleaseInstance.balanceOf(test_account.address);
                let test_accountstakeafter = await EticaReleaseInstance.stakes(test_account.address,1);
                console.log('test_account ETI balance after:', web3.utils.fromWei(test_accountbalanceafter, "ether" ));
                console.log('test_account Stake after:', test_accountstakeafter);
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
              console.log('test_account ETI balance before:', web3.utils.fromWei(test_accountbalancebefore, "ether" ));
              console.log('test_account Stake before:', test_accountstakebefore);
              console.log('test_account Stake amount before:', web3.utils.fromWei(test_accountstakebefore.amount, "ether" ));


              console.log('stake starting block is:', test_accountstakebefore.startBlock.toString());
              console.log('stake ending block is:', test_accountstakebefore.endBlock.toString());

              console.log('------------- BEGIN BLOCKS ADVANCEMENT --------------');
              let blocknb_before = await web3.eth.getBlock("latest");
              console.log('LastBlock\'s NUMBER IS:', blocknb_before.number);
              console.log('------------- ADVANCING BLOCKS --------------');
              await advanceblocks(154);
              console.log('------------- ADVANCING BLOCKS --------------');
              let blocknb_after = await web3.eth.getBlock("latest");
              console.log('LastBlock\'s NUMBER IS NOW:', blocknb_after.number);
              console.log('------------- BLOCKS ADVANCED --------------');

             // try create new period:
                return EticaReleaseInstance.stakeclmidx(1, {from: test_account.address}).then(assert.fail)
                .catch(async function(error){
                  assert(true);
                  let test_accountbalanceafter = await EticaReleaseInstance.balanceOf(test_account.address);
                  let test_accountstakeafter = await EticaReleaseInstance.stakes(test_account.address,1);
                  console.log('test_account ETI balance after:', web3.utils.fromWei(test_accountbalanceafter, "ether" ));
                  console.log('test_account Stake after:', test_accountstakeafter);
                  assert.equal(web3.utils.fromWei(test_accountbalanceafter, "ether" ) - web3.utils.fromWei(test_accountbalancebefore, "ether" ), "0", 'test_account should not have more Eticas!');
                  console.log('........................... Too early STAKING is not possible even just before End of Stake ....................... ');
                  console.log('------------------------------- END OF TEST with SUCCESS ---------------------------');
                });

            });


          // test Stake claiming too soon should fail
            it("can claim stake after stake end", async function () {
              console.log('------------------------------- Starting test ---------------------------');
              console.log('.......................... Can claim STAKE after THE STAKE END ? ..................... ');
              let test_accountbalancebefore = await EticaReleaseInstance.balanceOf(test_account.address);
              let test_accountstakebefore = await EticaReleaseInstance.stakes(test_account.address, 1);
              console.log('test_account ETI balance before:', web3.utils.fromWei(test_accountbalancebefore, "ether" ));
              console.log('test_account Stake before:', test_accountstakebefore);
              console.log('test_account Stake amount before:', web3.utils.fromWei(test_accountstakebefore.amount, "ether" ));

              console.log('------------- BEGIN BLOCKS ADVANCEMENT --------------');
              let blocknb_before = await web3.eth.getBlock("latest");
              console.log('LastBlock\'s NUMBER IS:', blocknb_before.number);
              console.log('------------- ADVANCING BLOCKS --------------');
              await advanceblocks(30);
              console.log('------------- ADVANCING BLOCKS --------------');
              let blocknb_after = await web3.eth.getBlock("latest");
              console.log('LastBlock\'s NUMBER IS NOW:', blocknb_after.number);
              console.log('------------- BLOCKS ADVANCED --------------');

             // try create to claim a stake after it has ended:
                return EticaReleaseInstance.stakeclmidx(1, {from: test_account.address}).then(async function(resp){
                  assert(true);
                  let test_accountbalanceafter = await EticaReleaseInstance.balanceOf(test_account.address);
                  let test_accountstakeafter = await EticaReleaseInstance.stakes(test_account.address,1);
                  let stakenoldbalance = web3.utils.toBN(test_accountbalancebefore).add(web3.utils.toBN(test_accountstakebefore.amount)).toString();
                  console.log('------test_account ETI balance after:', web3.utils.fromWei(test_accountbalanceafter, "ether" ));
                  console.log('------stakenoldbalance is:::', web3.utils.fromWei(stakenoldbalance, "ether"));
                  console.log('test_account Stake after:', test_accountstakeafter);

                  assert.equal( web3.utils.fromWei(test_accountbalanceafter, "ether"), web3.utils.fromWei(stakenoldbalance, "ether"), 'test_account should have increased by the stake\'s ETI amount!');

                  console.log('........................... Can claim STAKE after THE STAKE END ....................... ');
                  console.log('------------------------------- END OF TEST with SUCCESS ---------------------------');
                });

            });


            it("can get stakes length", async function () {
              return EticaRelease.deployed().then(function(instance){
                EticaReleaseInstance = instance;
                return EticaReleaseInstance.stakescount(test_account.address);
              }).then(async function(response){
                console.log('!!!!!!!!!! test_acount NUMBER OF STAKES AFTER CLAIM STAKE !!!!!!!!!!!!!');
                console.log('!!!!!!!!!! test_acount NUMBER OF STAKES AFTER CLAIM STAKE !!!!!!!!!!!!!');
                console.log('!!!!!!!!!! test_acount NUMBER OF STAKES AFTER CLAIM STAKE !!!!!!!!!!!!!');
                console.log('!!!!!!!!!! test_acount NUMBER OF STAKES AFTER CLAIM STAKE !!!!!!!!!!!!!');
              console.log('test_acount NUMBER OF STAKES IS', response);
              let stakesl = await EticaReleaseInstance.stakescount(test_account.address);
              console.log('RESPONSE IS::::', stakesl);
              console.log('!!!!!!!!!! test_acount NUMBER OF STAKES AFTER CLAIM STAKE !!!!!!!!!!!!!');
              console.log('!!!!!!!!!! test_acount NUMBER OF STAKES AFTER CLAIM STAKE !!!!!!!!!!!!!');
              console.log('!!!!!!!!!! test_acount NUMBER OF STAKES AFTER CLAIM STAKE !!!!!!!!!!!!!');
              console.log('!!!!!!!!!! test_acount NUMBER OF STAKES AFTER CLAIM STAKE !!!!!!!!!!!!!');
              })





            });





            // test Disease creation without enough ETI should fail
              it("cannot create a new disease if account has not enough ETI:", async function () {
                console.log('------------------------------- Starting test ---------------------------');
                console.log('.......................... Cannot CREATE A NEW DISEASE IF ACCOUNT HAS ENOUGH ETI ?  ..................... ');
                let test_accountbalancebefore = await EticaReleaseInstance.balanceOf(test_account.address);
                let first_disease = await EticaReleaseInstance.diseases(1);
                let diseasesCounter = await EticaReleaseInstance.diseasesCounter();
                console.log('test_account ETI balance before:', web3.utils.fromWei(test_accountbalancebefore, "ether" ));
                console.log('(should be empty as no disease exists yet) FIRST DISEASE IS:', first_disease);
                console.log('(should be 0 as no disease exists yet) NUMBER OF DISEASES IS:', diseasesCounter);
                assert.equal(diseasesCounter, "0", 'THERE SHOULD NOT BE ANY DISEASE YET');


               // try create new disease:
                  return EticaReleaseInstance.createdisease("Malaria", "Malaria is a disease that kills millions of people each year !").then(assert.fail)
                  .catch(async function(error){
                    assert(true);
                    let test_accountbalanceafter = await EticaReleaseInstance.balanceOf(test_account.address);
                    let first_disease = await EticaReleaseInstance.diseases(1);
                    let diseasesCounter = await EticaReleaseInstance.diseasesCounter();
                    console.log('test_account ETI balance before:', web3.utils.fromWei(test_accountbalanceafter, "ether" ));
                    console.log('(should be empty as no disease exists yet) FIRST DISEASE IS:', first_disease);
                    console.log('(should be 0 as no disease exists yet) NUMBER OF DISEASES IS:', diseasesCounter);
                    assert.equal(diseasesCounter, "0", 'THERE SHOULD NOT BE ANY DISEASE YET');
                    console.log('........................... Cannot CREATE A NEW DISEASE IF ACCOUNT HAS ENOUGH ETI ....................... ');
                    console.log('------------------------------- END OF TEST with SUCCESS ---------------------------');
                  });

              });



            // test Diseases creation
              it("can create new Disease", async function () {
                console.log('------------------------------------ Starting test ---------------------------');
                console.log('................................  CAN CREATE A DISEASE ? .......................');
                let miner_accountbalancebefore = await EticaReleaseInstance.balanceOf(miner_account.address);
                console.log('miner account balance before is', web3.utils.fromWei(miner_accountbalancebefore, "ether" ));
                let diseasesCreationAmount = await EticaReleaseInstance.DISEASE_CREATION_AMOUNT();
                console.log('DISEASES CREATION AMOUNT IS:', diseasesCreationAmount);


                console.log('------------------------------------- WAITING FOR MINER_ACCOUNT TO MINE MORE ETI ---------------------------');
                function timeout(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }

            // wait long enough so that miner_account has mined enough blocks and thus has enough ETI available (more than DISEASE_CREATION_AMOUNT)
            await timeout(80000);

            let miner_balance = await EticaReleaseInstance.balanceOf(miner_account.address);
            console.log('asserting miner_account balance(', web3.utils.fromWei(miner_balance, "ether" ),'ETI) is greater than DISEASE_CREATION_AMOUNT');
            assert(web3.utils.fromWei(miner_balance, "ether" ) > 100, 'miner_account should have mined more than 100 ETI after 80000 ms! Please relaunch the test, you will be more lucky next time !');

            return EticaReleaseInstance.transfer(test_account.address,  web3.utils.toWei('100', 'ether'), {from: miner_account.address}).then(async function(response){

              let miner_accountbalanceafter_transfer = await EticaReleaseInstance.balanceOf(miner_account.address);
              let test_accountbalance_before_createdisease = await EticaReleaseInstance.balanceOf(test_account.address);
              let contract_balance_before_createdisease = await EticaReleaseInstance.balanceOf(EticaReleaseInstance.address);
              console.log('miner account balance after transfer is', web3.utils.fromWei(miner_accountbalanceafter_transfer, "ether" ));

            let first_disease = await EticaReleaseInstance.diseases(1);
            let diseasesCounter = await EticaReleaseInstance.diseasesCounter();
           console.log('(should be empty as no disease exists yet) FIRST DISEASE IS:', first_disease);
           console.log('(should be 0 as no disease exists yet) NUMBER OF DISEASES IS:', diseasesCounter);
           console.log('NUMBER OF DISEASES IS:', diseasesCounter);
           console.log('test_account balance before Disease Creation is', web3.utils.fromWei(test_accountbalance_before_createdisease, "ether" ));
           console.log('contract balance before Disease Creation is', web3.utils.fromWei(contract_balance_before_createdisease, "ether" ));
           // try create new disease:
              return EticaReleaseInstance.createdisease("Malaria", "Malaria is a disease that kills millions of people each year !", {from: test_account.address}).then(async function(receipt){
                let first_disease = await EticaReleaseInstance.diseases(1);
                let diseasesCounter = await EticaReleaseInstance.diseasesCounter();
                let test_accountbalance_after_createdisease = await EticaReleaseInstance.balanceOf(test_account.address);
                let contract_balance_after_createdisease = await EticaReleaseInstance.balanceOf(EticaReleaseInstance.address);
            console.log('THE FIRST DISEASE IS:', first_disease);
            console.log('NAME OF THE FIRST DISEASE IS:', first_disease.name);
            console.log('DESCRIPTION OF THE FIRST DISEASE IS:', first_disease.description);
            console.log('NUMBER OF DISEASES IS:', diseasesCounter);

            // check diseases mapping insertion:
            assert.equal(first_disease.disease_hash, '0xfca403d66ff4c1d6ea8f67e3a96689222557de5048b2ff6d9020d5a433f412aa', 'First disease should exists with right diseasehash');
            assert.equal(first_disease.name, 'Malaria', 'First disease should exists with right name');
            assert.equal(first_disease.description, 'Malaria is a disease that kills millions of people each year !', 'First disease should exists with right description');
            assert.equal(diseasesCounter, 1, 'There should be exactly 1 disease at this point');

            // check diseasesbyIds and diseasesbyNames mappings insertion:
            let indexfromhash = await EticaReleaseInstance.diseasesbyIds('0xfca403d66ff4c1d6ea8f67e3a96689222557de5048b2ff6d9020d5a433f412aa');
            let hashfromname = await EticaReleaseInstance.getdiseasehashbyName('Malaria');

            assert.equal(indexfromhash, '1', '0xfca403d66ff4c1d6ea8f67e3a96689222557de5048b2ff6d9020d5a433f412aa hash should have an entry in diseasesbyIds with value of 1');
            assert.equal(hashfromname, '0xfca403d66ff4c1d6ea8f67e3a96689222557de5048b2ff6d9020d5a433f412aa', 'Malaria should have an entry in diseasesbyNames with value of 0xfca403d66ff4c1d6ea8f67e3a96689222557de5048b2ff6d9020d5a433f412aa');

            // test_account should have paid 100 ETI to contract
               // test_account should have 100 ETI less
                 assert.equal(web3.utils.fromWei(test_accountbalance_before_createdisease, "ether" ) - web3.utils.fromWei(test_accountbalance_after_createdisease, "ether" ), 100);
                 console.log('test_account balance after Disease Creation is', web3.utils.fromWei(test_accountbalance_after_createdisease, "ether" ));

               // contract should have 100 ETI more
                  assert.equal(web3.utils.fromWei(contract_balance_after_createdisease, "ether" ) - web3.utils.fromWei(contract_balance_before_createdisease, "ether" ), 100);
                  console.log('contract balance after Disease Creation is', web3.utils.fromWei(contract_balance_after_createdisease, "ether" ));


            console.log('................................  CAN CREATE A DISEASE  ....................... ');
            console.log('------------------------------- END OF TEST with SUCCESS ----------------------------');
            })

            })

                });


                // test Proposals creation
                  it("can create new Proposal", async function () {
                    console.log('------------------------------------ Starting test ---------------------------');
                    console.log('................................  CAN CREATE A PROPOSAL ? .......................');

                    let idofstruct = await EticaReleaseInstance.diseasesbyIds('0xfca403d66ff4c1d6ea8f67e3a96689222557de5048b2ff6d9020d5a433f412aa');
                    console.log('idofstruct id: ', idofstruct);

                    return EticaReleaseInstance.propose("0xfca403d66ff4c1d6ea8f67e3a96689222557de5048b2ff6d9020d5a433f412aa", "Proposal Crisper K32 for Malaria", "Using Crisper to treat Malaria", "QmWWQSuPMS6aXCbZKpEjPHPUZN2NjB3YrhJTHsV4X3vb2t", "QmT4AeWE9Q9EaoyLJiqaZuYQ8mJeq4ZBncjjFH9dQ9uDVA", "QmT9qk3CRYbFDWpDFYeAv8T8H1gnongwKhh5J68NLkLir6", {from: test_account.address}).then(async function(response){

                    let first_proposal = await EticaReleaseInstance.proposals('0x5f17034b05363de3cfffa94d9ae9c07534861c3cc1216e58a5c0f057607dbc00');
                    let proposalsCounter = await EticaReleaseInstance.proposalsCounter();
                    console.log('THE FIRST PROPOSAL IS:', first_proposal);

                    let first_proposal_ipfs = await EticaReleaseInstance.propsipfs('0x5f17034b05363de3cfffa94d9ae9c07534861c3cc1216e58a5c0f057607dbc00');
                    console.log('THE FIRST PROPOSAL IPFS IS:', first_proposal_ipfs);

                    let first_proposal_data = await EticaReleaseInstance.propsdatas('0x5f17034b05363de3cfffa94d9ae9c07534861c3cc1216e58a5c0f057607dbc00');
                    console.log('THE FIRST PROPOSAL DATA IS:', first_proposal_data);

                    // check Proposal's general information:
                    assert.equal(first_proposal.disease_id, '0xfca403d66ff4c1d6ea8f67e3a96689222557de5048b2ff6d9020d5a433f412aa', 'First proposal should exist with right disease_id');
                    assert.equal(first_proposal.title, 'Proposal Crisper K32 for Malaria', 'First proposal should exist with right name');
                    assert.equal(first_proposal.description, 'Using Crisper to treat Malaria', 'First proposal should exist with right description');
                    assert.equal(proposalsCounter, 1, 'There should be exactly 1 proposal at this point');

                    // check Proposal's IPFS:
                    assert.equal(first_proposal_ipfs.raw_release_hash, 'QmWWQSuPMS6aXCbZKpEjPHPUZN2NjB3YrhJTHsV4X3vb2t', 'First proposal should exist with right raw_release_hash');
                    assert.equal(first_proposal_ipfs.old_release_hash, 'QmT4AeWE9Q9EaoyLJiqaZuYQ8mJeq4ZBncjjFH9dQ9uDVA', 'First proposal should exist with right old_release_hash');
                    assert.equal(first_proposal_ipfs.grandparent_hash, 'QmT9qk3CRYbFDWpDFYeAv8T8H1gnongwKhh5J68NLkLir6', 'First proposal should exist with right grandparent_hash');

                    // check Proposal's DATA:
                    assert.equal(first_proposal_data.status, '2', 'First proposal should exist with right status');
                    assert.equal(first_proposal_data.istie, false, 'First proposal should exist with right istie');
                    assert.equal(first_proposal_data.prestatus, '2', 'First proposal should exist with right prestatus');
                    assert.equal(first_proposal_data.nbvoters, '1', 'First proposal should exist with right nbvoters');
                    assert.equal(first_proposal_data.slashingratio, '0', 'First proposal should exist with right slashingratio');
                    assert.equal(web3.utils.fromWei(first_proposal_data.forvotes.toString()), PROPOSAL_CREATION_AMOUNT, 'First proposal should exist with right forvotes');
                    assert.equal(web3.utils.fromWei(first_proposal_data.againstvotes.toString()), '0', 'First proposal should exist with right againstvotes');
                    assert.equal(first_proposal_data.lastcuration_weight, '0', 'First proposal should exist with right lastcuration_weight');
                    assert.equal(first_proposal_data.lasteditor_weight, '0', 'First proposal should exist with right lasteditor_weight');

                    console.log('................................  CAN CREATE A PROPOSAL  ....................... ');
                    console.log('------------------------------- END OF TEST with SUCCESS ----------------------------');
                    });



                    });


  async function printBalances(accounts) {
    // accounts.forEach(function(ac, i) {
       var balance_val = await (web3.eth.getBalance(accounts[0]));
       console.log('acct 0 balance', web3.utils.fromWei(balance_val.toString() , 'ether') )
    // })
   }

   async function advanceblocks(numberlbocks) {
     for(var i=0;i<numberlbocks;i+=1){
    await web3.currentProvider.send(
      {jsonrpc: "2.0", method: "evm_mine", id: i},
    (err2, res) => {

  return
});
     }
   }
 });
