var EticaReleaseProtocolTestUpdateCost = artifacts.require("./EticaReleaseProtocolTestUpdateCost.sol");

var solidityHelper =  require('./solidity-helper');
var miningHelper =  require('./mining-helper-fast');
var networkInterfaceHelper =  require('./network-interface-helper');
const truffleAssert = require('truffle-assertions');
var abi = require('ethereumjs-abi');

console.log('------------------- WELCOME ON THE ETICA PROTOCOL ---------------');
console.log('---------------> NEUTRAL PROTOCOL FOR DECENTRALISED RESEARCH <------------------');
console.log('');


// This series of tests aims to test the functions that will update protocol costs
// The ProtocolTest contract has been initialised with an initial supply so that accounts don't have to mine
// 

var PERIOD_CURATION_REWARD_RATIO = 0; // initialize global variable PERIOD_CURATION_REWARD_RATIO
var PERIOD_EDITOR_REWARD_RATIO = 0; // initialize global variable PERIOD_EDITOR_REWARD_RATIO
var DEFAULT_VOTING_TIME = 0; // initialize global variable DEFAULT_VOTING_TIME
var DEFAULT_REVEALING_TIME = 0;
var REWARD_INTERVAL = 0; // initialize global variable REWARD_INTERVAL

var ETH_PRICE_USD = 198.54;

// test suite
contract('EticaReleaseProtocolTestUpdateCost', function(accounts){
  var EticaReleaseProtocolTestUpdateCostInstance;
  var i;

  // ENTER USER ACCOUNTS KEYS, FOR EXEMPLE YOU CAN TAKE THE ONE FROM GANACHE
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

var test_account6= {
  'address': '0x6E68F1EA1a10F8a0093DA68495c118940eF1dC8C',
  'privateKey': '60718bce44b71e60b464e025111726ba0111efff2b42e33660d1f9deeb7d256c'
}

var test_account7= {
  'address': '0x9668546C66D99d8a951E4d94fF778521849190e5',
  'privateKey': 'c6ce9a8d42662ce7d8b726c4616b1c40b2d8c9a06506862a9e14b7ed76be1de2'
}

var test_account8= {
  'address': '0xd13cCB6eA16e2cBE56F95745681Cc667828ecd4E',
  'privateKey': 'e9007cf61c36436cacd8540f903596aadc67e33cd6437f24211694cae24a018d'
}

 var miner_account= {
    'address': '0x5FBd856f7f0c79723100FF6e1450cC1464D3fffC',
    'privateKey': '16b271fdb3eb17a065d4227a3087fa140ba0f88d0d66e7eaa778e3e5c0c6838c'
}

var PROPOSAL_DEFAULT_VOTE = 10; // 10 ETI default vote for proposal submissions

var FIRST_DISEASE_NAME = "Malaria";
var SECOND_DISEASE_NAME = "Ebola";
var FIRST_DISEASE_DESC = "Malaria is a disease that kills millions of people each year !";

var encoded = abi.rawEncode([ "string" ], [ FIRST_DISEASE_NAME ]);

var EXPECTED_FIRST_DISEASE_HASH = get_expected_keccak256_hash(FIRST_DISEASE_NAME); // should be '0xf6d8716087544b8fe1a306611913078dd677450d90295497e433503483ffea6e' for 'Malaria'
//console.log('EXPECTED_FIRST_DISEASE_HASH is ', EXPECTED_FIRST_DISEASE_HASH);

var TOTAL_DISEASES = 0; // var keep track of total number of diseases created in the protocol

var GASPRICE = 0;

  it("testing ETICA PROTOCOL UPDATECOST:", async function () {
    console.log('------------------------------------- Starting TESTS OF ETICA PROTOCOL DYNAMICS ---------------------------');

    return EticaReleaseProtocolTestUpdateCost.deployed().then(function(instance){
      EticaReleaseProtocolTestUpdateCostInstance = instance;
      return EticaReleaseProtocolTestUpdateCostInstance.balanceOf(miner_account.address);
      }).then(function(receipt){
      console.log('asserting miner_account has at least 100 000 ETI', web3.utils.fromWei(receipt, "ether" ), 'ETI');
      assert(web3.utils.fromWei(receipt, "ether" ) >= 100000, 'miner_account should have at least 100 000 ETI before starting the tests !');
      }).then(async function(){


    DEFAULT_VOTING_TIME = await EticaReleaseProtocolTestUpdateCostInstance.DEFAULT_VOTING_TIME(); 
    console.log('DEFAULT_VOTING_TIME IS ', DEFAULT_VOTING_TIME);

    DEFAULT_REVEALING_TIME = await EticaReleaseProtocolTestUpdateCostInstance.DEFAULT_REVEALING_TIME(); 
    console.log('DEFAULT_REVEALING_TIME IS ', DEFAULT_REVEALING_TIME);

    PERIOD_CURATION_REWARD_RATIO = await EticaReleaseProtocolTestUpdateCostInstance.PERIOD_CURATION_REWARD_RATIO();
    console.log('PERIOD_CURATION_REWARD_RATIO IS ', PERIOD_CURATION_REWARD_RATIO);

    PERIOD_EDITOR_REWARD_RATIO = await EticaReleaseProtocolTestUpdateCostInstance.PERIOD_EDITOR_REWARD_RATIO();
    console.log('PERIOD_EDITOR_REWARD_RATIO IS ', PERIOD_EDITOR_REWARD_RATIO);

    REWARD_INTERVAL = await EticaReleaseProtocolTestUpdateCostInstance.REWARD_INTERVAL();
    console.log('REWARD_INTERVAL IS ', REWARD_INTERVAL);

    GASPRICE = Number(await web3.eth.getGasPrice()).toString();
    console.log('GAS PRICE IS ', GASPRICE, 'WEI');
    console.log('GAS PRICE IS ', web3.utils.fromWei(GASPRICE, "ether" ), 'ETH');
    


// TRANSFERS FROM MINER ACCOUNT:
await transferto(test_account);
await transferto(test_account2);
await transferto(test_account3);
await transferto(test_account4);
await transferto(test_account5);
await transferto(test_account6);
await transferto(test_account7);
await transferto(test_account8);

 // TRANSFERS FROM MINER ACCOUNT:
 await transferfromto(test_account, test_account2, '1000');
 await transferfromto(test_account, test_account3, '1000');
 await transferfromto(test_account, test_account4, '1000');
 await transferfromto(test_account, test_account5, '1000');
 await transferfromto(test_account, test_account6, '1000');
 await transferfromto(test_account, test_account7, '1000');
 await transferfromto(test_account, test_account8, '100');


// begin the stake
await eticatobosom(test_account, '200');
await eticatobosom(test_account2, '2000');
await eticatobosom(test_account3, '2000');
await eticatobosom(test_account4, '2000');
await eticatobosom(test_account5, '2000');
await eticatobosom(test_account6, '2000');
await eticatobosom(test_account7, '2000');
await eticatobosom(test_account8, '80');

// check significant figures:
await eticatobosom(test_account, '0.123');
await eticatobosom(test_account2, '0.981516165156161651');
await eticatobosom(test_account3, '0.300');
await eticatobosom(test_account4, '0.9151651651665');
await eticatobosom(test_account5, '0.565156161');
await eticatobosom(test_account6, '0.321');
await eticatobosom(test_account7, '0.1805');
await eticatobosom(test_account8, '3.1805');




    await createdisease(FIRST_DISEASE_NAME);

    let PROPOSAL_DEFAULT_VOTE = await EticaReleaseProtocolTestUpdateCostInstance.PROPOSAL_DEFAULT_VOTE(); 
    console.log('PROPOSAL_DEFAULT_VOTE ', web3.utils.fromWei(PROPOSAL_DEFAULT_VOTE, "ether" ));
    
    let DISEASE_CREATION_AMOUNT = await EticaReleaseProtocolTestUpdateCostInstance.DISEASE_CREATION_AMOUNT(); 
    console.log('OLD DISEASE_CREATION_AMOUNT IS ', web3.utils.fromWei(DISEASE_CREATION_AMOUNT, "ether" )); 
    
    let SUPPPLY = await EticaReleaseProtocolTestUpdateCostInstance.totalSupply(); 
    console.log('OLD SUPPLY IS ', web3.utils.fromWei(SUPPPLY, "ether" ));

    let PERIODS_COUNTER = await EticaReleaseProtocolTestUpdateCostInstance.periodsCounter();
      console.log('PERIODS_COUNTER IS ', PERIODS_COUNTER.toString());
      assert.equal(PERIODS_COUNTER, '467', 'Next tests assume 467 Periods have been created. Please launch the test again, will be more lucky nex time !');
    
      await should_fail_to_updatecost(test_account3, PERIODS_COUNTER.toString());
    
      PROPOSAL_DEFAULT_VOTE = await EticaReleaseProtocolTestUpdateCostInstance.PROPOSAL_DEFAULT_VOTE(); 
      console.log('NEW PROPOSAL_DEFAULT_VOTE IS ', web3.utils.fromWei(PROPOSAL_DEFAULT_VOTE, "ether" ));
      
      DISEASE_CREATION_AMOUNT = await EticaReleaseProtocolTestUpdateCostInstance.DISEASE_CREATION_AMOUNT(); 
      console.log('NEW DISEASE_CREATION_AMOUNT IS ', web3.utils.fromWei(DISEASE_CREATION_AMOUNT, "ether" )); 
      
      SUPPPLY = await EticaReleaseProtocolTestUpdateCostInstance.totalSupply(); 
      console.log('NEW SUPPLY IS ', web3.utils.fromWei(SUPPPLY, "ether" ));


      console.log('<--------------------------- ENTERING NEXT PERIOD: 468  ---------------------------------- >');

      // advance time so that we enter next period: 
      await advanceseconds(REWARD_INTERVAL);
      
      let IPFS1T = randomipfs();
      let IPFS2T = randomipfs();
      
      let IPFS1T_WITH_FIRTDISEASEHASH = get_expected_keccak256_hash_two(IPFS1T, EXPECTED_FIRST_DISEASE_HASH);
      let IPFS2T_WITH_FIRTDISEASEHASH = get_expected_keccak256_hash_two(IPFS2T, EXPECTED_FIRST_DISEASE_HASH);
      
      PERIODS_COUNTER = await EticaReleaseProtocolTestUpdateCostInstance.periodsCounter();
      console.log('PERIODS_COUNTER BEFORE PERIOD 468 IS ', PERIODS_COUNTER.toString());
      assert.equal(PERIODS_COUNTER, '467', 'Next tests assume 467 Periods have been created. Please launch the test again, will be more lucky nex time !');
      
      // after this creaproposal() should be in period 468:
      await createproposal(test_account, EXPECTED_FIRST_DISEASE_HASH, "Title 1 Malaria", "Description 1", IPFS1T, "Use this field as the community created standards","0",false);
     
      
      PROPOSAL_DEFAULT_VOTE = await EticaReleaseProtocolTestUpdateCostInstance.PROPOSAL_DEFAULT_VOTE(); 
      console.log('PROPOSAL_DEFAULT_VOTE ', web3.utils.fromWei(PROPOSAL_DEFAULT_VOTE, "ether" ));
      
      DISEASE_CREATION_AMOUNT = await EticaReleaseProtocolTestUpdateCostInstance.DISEASE_CREATION_AMOUNT(); 
      console.log('OLD DISEASE_CREATION_AMOUNT IS ', web3.utils.fromWei(DISEASE_CREATION_AMOUNT, "ether" )); 
      
      SUPPPLY = await EticaReleaseProtocolTestUpdateCostInstance.totalSupply(); 
      console.log('OLD SUPPLY IS ', web3.utils.fromWei(SUPPPLY, "ether" ));
      
        await updatecost(test_account3, PERIODS_COUNTER.toString());
        // should fail update cost twice in same period:
        await should_fail_to_updatecost(test_account3, PERIODS_COUNTER.toString());
      
        PROPOSAL_DEFAULT_VOTE = await EticaReleaseProtocolTestUpdateCostInstance.PROPOSAL_DEFAULT_VOTE(); 
        console.log('NEW PROPOSAL_DEFAULT_VOTE IS ', web3.utils.fromWei(PROPOSAL_DEFAULT_VOTE, "ether" ));
        
        DISEASE_CREATION_AMOUNT = await EticaReleaseProtocolTestUpdateCostInstance.DISEASE_CREATION_AMOUNT(); 
        console.log('NEW DISEASE_CREATION_AMOUNT IS ', web3.utils.fromWei(DISEASE_CREATION_AMOUNT, "ether" )); 
        
        SUPPPLY = await EticaReleaseProtocolTestUpdateCostInstance.totalSupply(); 
        console.log('NEW SUPPLY IS ', web3.utils.fromWei(SUPPPLY, "ether" ));


      // advance time to enter revealing Period:
      await advanceseconds(DEFAULT_VOTING_TIME);  


      console.log('<--------------------------- ENTERING NEXT PERIOD: 469  ---------------------------------- >');

// advance time so that we enter next period: 
await advanceseconds(REWARD_INTERVAL);

let IPFS1U = randomipfs();

let IPFS1U_WITH_FIRTDISEASEHASH = get_expected_keccak256_hash_two(IPFS1T, EXPECTED_FIRST_DISEASE_HASH);

PERIODS_COUNTER = await EticaReleaseProtocolTestUpdateCostInstance.periodsCounter();
console.log('PERIODS_COUNTER BEFORE PERIOD 469 IS ', PERIODS_COUNTER.toString());
assert.equal(PERIODS_COUNTER, '468', 'Next tests assume 468 Periods have been created. Please launch the test again, will be more lucky nex time !');

// after this creaproposal() should be in period 469:
await createproposal(test_account, EXPECTED_FIRST_DISEASE_HASH, "Title 1 Malaria", "Description 1", IPFS1U, "Use this field as the community created standards","0",false);

PROPOSAL_DEFAULT_VOTE = await EticaReleaseProtocolTestUpdateCostInstance.PROPOSAL_DEFAULT_VOTE(); 
console.log('PROPOSAL_DEFAULT_VOTE ', web3.utils.fromWei(PROPOSAL_DEFAULT_VOTE, "ether" ));

DISEASE_CREATION_AMOUNT = await EticaReleaseProtocolTestUpdateCostInstance.DISEASE_CREATION_AMOUNT(); 
console.log('OLD DISEASE_CREATION_AMOUNT IS ', web3.utils.fromWei(DISEASE_CREATION_AMOUNT, "ether" )); 

SUPPPLY = await EticaReleaseProtocolTestUpdateCostInstance.totalSupply(); 
console.log('OLD SUPPLY IS ', web3.utils.fromWei(SUPPPLY, "ether" ));

PERIODS_COUNTER = await EticaReleaseProtocolTestUpdateCostInstance.periodsCounter();
console.log('PERIODS_COUNTER BEFORE PERIOD 469 IS ', PERIODS_COUNTER.toString());
assert.equal(PERIODS_COUNTER, '469', 'Next tests assume 469 Periods have been created. Please launch the test again, will be more lucky nex time !');

  await should_fail_to_updatecost(test_account3, PERIODS_COUNTER.toString());

  PROPOSAL_DEFAULT_VOTE = await EticaReleaseProtocolTestUpdateCostInstance.PROPOSAL_DEFAULT_VOTE(); 
  console.log('NEW PROPOSAL_DEFAULT_VOTE IS ', web3.utils.fromWei(PROPOSAL_DEFAULT_VOTE, "ether" ));
  
  DISEASE_CREATION_AMOUNT = await EticaReleaseProtocolTestUpdateCostInstance.DISEASE_CREATION_AMOUNT(); 
  console.log('NEW DISEASE_CREATION_AMOUNT IS ', web3.utils.fromWei(DISEASE_CREATION_AMOUNT, "ether" )); 
  
  SUPPPLY = await EticaReleaseProtocolTestUpdateCostInstance.totalSupply(); 
  console.log('NEW SUPPLY IS ', web3.utils.fromWei(SUPPPLY, "ether" ));


  console.log('------------------------------------- ETICA PROTOCOL SUCCESSFULLY PASSED THE TESTS OF UPDATECOST ---------------------------');
  console.log('------------------------------------- ETICA PROTOCOL SHOWING GAS COST ---------------------------');
  await getcost_createdisease(SECOND_DISEASE_NAME);
  let IPFS1 = randomipfs();
  let IPFS2 = randomipfs();

  let IPFS1_WITH_FIRTDISEASEHASH = get_expected_keccak256_hash_two(IPFS1, EXPECTED_FIRST_DISEASE_HASH);
  let IPFS2_WITH_FIRTDISEASEHASH = get_expected_keccak256_hash_two(IPFS2, EXPECTED_FIRST_DISEASE_HASH);

  await getcost_createproposal(test_account, EXPECTED_FIRST_DISEASE_HASH, "Title 1 Malaria", "Description 1", IPFS1, "Use this field as the community created standards","0");
 await getcost_createproposal(test_account2, EXPECTED_FIRST_DISEASE_HASH, "Title 2 Malaria", "Description 2", IPFS2, "Use this field as the community created standards","0");

 await createproposal(test_account, EXPECTED_FIRST_DISEASE_HASH, "Title 1 Malaria", "Description 1", IPFS1, "Use this field as the community created standards","0",false);
 await createproposal(test_account2, EXPECTED_FIRST_DISEASE_HASH, "Title 2 Malaria", "Description 2", IPFS2, "Use this field as the community created standards","0",false);

await getcost_commitvote(test_account3, IPFS1_WITH_FIRTDISEASEHASH, true, '5', "random123");
await getcost_commitvote(test_account4, IPFS2_WITH_FIRTDISEASEHASH, false, '5', "random123");

await commitvote(test_account3, IPFS1_WITH_FIRTDISEASEHASH, true, '15', "random123");
await commitvote(test_account4, IPFS2_WITH_FIRTDISEASEHASH, false, '5', "random123");

// advance time to enter revealing Period:
await advanceseconds(DEFAULT_VOTING_TIME);

await getcost_revealvote(test_account3, IPFS1_WITH_FIRTDISEASEHASH, true, "random123");
await getcost_revealvote(test_account4, IPFS2_WITH_FIRTDISEASEHASH, false, "random123");

await revealvote(test_account3, IPFS1_WITH_FIRTDISEASEHASH, true, "random123");
await revealvote(test_account4, IPFS2_WITH_FIRTDISEASEHASH, false, "random123");

// advance time to enter claimable Period:
let REVEALING_TIME_ADD_1 = Number(DEFAULT_VOTING_TIME) + 1;
await advanceseconds(REVEALING_TIME_ADD_1);
await getcost_clmpropbyhash(test_account, IPFS1_WITH_FIRTDISEASEHASH);
await getcost_clmpropbyhash(test_account2, IPFS2_WITH_FIRTDISEASEHASH);
await getcost_clmpropbyhash(test_account3, IPFS1_WITH_FIRTDISEASEHASH);
await getcost_clmpropbyhash(test_account4, IPFS2_WITH_FIRTDISEASEHASH);
await clmpropbyhash(test_account3, IPFS1_WITH_FIRTDISEASEHASH);
await clmpropbyhash(test_account4, IPFS2_WITH_FIRTDISEASEHASH);
await clmpropbyhash(test_account, IPFS1_WITH_FIRTDISEASEHASH);
await clmpropbyhash(test_account2, IPFS2_WITH_FIRTDISEASEHASH);

  console.log('------------------------------------- ETICA PROTOCOL SHOWING GAS COST DONE ---------------------------');


  })

  });


  async function updatecost(useraccount, _periodcounter){

    console.log('---> UPDATING COSTS', _periodcounter);
    return EticaReleaseProtocolTestUpdateCostInstance.updatecost({from: useraccount.address}).then(async function(receipt){
    console.log('---> The cost update of DISEASE AND PROPOSAL AMOUNT CREATION was successfull', _periodcounter);

      }).catch(async function(error){
        console.log('An error has occured !', error);
      })
   }

 
  async function should_fail_to_updatecost(useraccount, _periodcounter){

    console.log('---> Should fail to updatecost within Period', _periodcounter);
    await truffleAssert.fails(EticaReleaseProtocolTestUpdateCostInstance.updatecost({from: useraccount.address}));
    console.log('---> As expected failed updatecost within Period', _periodcounter);
   
  } 

  async function printBalances(accounts) {
    // accounts.forEach(function(ac, i) {
       var balance_val = await (web3.eth.getBalance(accounts[0]));
       //console.log('acct 0 balance', web3.utils.fromWei(balance_val.toString() , 'ether') )
    // })
   }

   async function printEtiBalance(testaccount) {
       var balance_val = await EticaReleaseProtocolTestUpdateCostInstance.balanceOf(testaccount.address);
       console.log('ETI the balance of ', testaccount.address, 'is',  web3.utils.fromWei(balance_val.toString() , 'ether') );
       return balance_val;
   }

   async function transferto(testaccount) {

    console.log('transfering 10000 ETI from miner_account to test_account', testaccount.address);
    let test_accountbalancebefore = await EticaReleaseProtocolTestUpdateCostInstance.balanceOf(testaccount.address);
    let miner_accountbalancebefore = await EticaReleaseProtocolTestUpdateCostInstance.balanceOf(miner_account.address);
    console.log('miner_account ETI balance before:', web3.utils.fromWei(miner_accountbalancebefore, "ether" ));
    console.log('test_account', testaccount.address,'ETI balance before:', web3.utils.fromWei(test_accountbalancebefore, "ether" ));
    return EticaReleaseProtocolTestUpdateCostInstance.transfer(testaccount.address,  web3.utils.toWei('10000', 'ether'), {from: miner_account.address}).then(async function() {
      let test_accountbalanceafter = await EticaReleaseProtocolTestUpdateCostInstance.balanceOf(testaccount.address);
      let miner_accountbalanceafter = await EticaReleaseProtocolTestUpdateCostInstance.balanceOf(miner_account.address);
      console.log('miner_account ETI balance after:', web3.utils.fromWei(miner_accountbalanceafter, "ether" ));
      console.log('test_account', testaccount.address,'ETI balance after:', web3.utils.fromWei(test_accountbalanceafter, "ether" ));
     });

   }


   async function transferfromto(senderaccount, receiveraccount, amount) {

    console.log('transfering', amount,'ETI from senderaccount', senderaccount.address, 'to receiveraccount', receiveraccount.address);

    return EticaReleaseProtocolTestUpdateCostInstance.transfer(receiveraccount.address,  web3.utils.toWei(amount, 'ether'), {from: senderaccount.address}).then(async function() {
 
    console.log('transfered', amount,'ETI from senderaccount', senderaccount.address, 'to receiveraccount', receiveraccount.address);

     });

   }

   async function eticatobosom(useraccount, amount){

    console.log('---> Staking Eticas for Bosoms. Stake amount is', amount, 'ETI. User is ', useraccount.address);
    return EticaReleaseProtocolTestUpdateCostInstance.eticatobosoms(useraccount.address,  web3.utils.toWei(amount, 'ether'), {from: useraccount.address}).then(async function(receipt){
    console.log('---> The stake of Eticas for Bosoms worth', amount, 'ETI', 'was successfull');

      }).catch(async function(error){
        console.log('An error has occured !', error);
      })
   }


   async function stakescsldt(useraccount, endTime, min_limit, maxidx){

    console.log('---> Consolidating stakes. New endTime is', endTime, '.');
    return EticaReleaseProtocolTestUpdateCostInstance.stakescsldt(useraccount.address,  endTime, min_limit, maxidx, {from: useraccount.address}).then(async function(receipt){
    console.log('---> The consolidation of', endTime, ' endTime', 'was successfull');

      }).catch(async function(error){
        console.log('An error has occured !', error);
      })
   }

   async function should_fail_to_stakescsldt(useraccount, endTime, min_limit, maxidx){

    console.log('---> Should fail to consolidate with out of range params:  --> endTime:', endTime, '--> min_limit is:: ', min_limit, '--> maxidx is:', maxidx);
    await truffleAssert.fails(EticaReleaseProtocolTestUpdateCostInstance.stakescsldt(useraccount.address,  endTime, min_limit, maxidx, {from: useraccount.address}));
    console.log('---> As expected failed to consolidate with out of range params: --> endTime:', endTime, '--> min_limit is:: ', min_limit, '--> maxidx is:', maxidx);
   
  }

   async function getstake(_from_account, _idx){

    let _thestake = await EticaReleaseProtocolTestUpdateCostInstance.stakes(_from_account.address,_idx);
    return _thestake;

   }


   async function should_fail_eticatobosom(useraccount, amount){

    console.log('---> Staking Eticas for Bosoms. Stake amount is', amount, 'ETI. User is ', useraccount.address);
    await truffleAssert.fails(EticaReleaseProtocolTestUpdateCostInstance.eticatobosoms(useraccount.address,  web3.utils.toWei(amount, 'ether'), {from: useraccount.address}));
    console.log('---> As expected failed to make the stake worth', amount, 'ETI from user: ', useraccount.address);

   }

   // transfer that should fail:
   async function should_fail_transferfromto(senderaccount, receiveraccount, amount) {
     
    console.log('should fail transfering', amount,'ETI from senderaccount', senderaccount.address, 'to receiveraccount', receiveraccount.address);
    await truffleAssert.fails(EticaReleaseProtocolTestUpdateCostInstance.transfer(receiveraccount.address,  web3.utils.toWei(amount, 'ether'), {from: senderaccount.address}));
    console.log('as expected failed to transfer', amount,'ETI from senderaccount', senderaccount.address, 'to receiveraccount', receiveraccount.address);

  }

     // propose should fail:
     async function should_fail_propose(_from_account, _diseasehash, _title, _description, _raw_release_hash, _related_hash, _other_related_hash, _firstfield, _secondfield, _thirdfield) {
     
      console.log('should fail to propose proposal with same raw_release_hash and diseasehash (', _raw_release_hash,' - ', _diseasehash, ')combination');
      await truffleAssert.fails(EticaReleaseProtocolTestUpdateCostInstance.propose(_diseasehash, _title, _description, _raw_release_hash, _related_hash, _other_related_hash, _firstfield, _secondfield, _thirdfield, {from: _from_account.address}));
      console.log('as expected failed to propose proposal with same raw_release_hash and diseasehash (', _raw_release_hash,' - ', _diseasehash, ')combination');
  
    }

         // propose should fail:
         async function should_fail_revealvote(_from_account, _proposed_release_hash, _choice, _vary) {
     
          console.log('should fail this revealvote');
          await truffleAssert.fails(EticaReleaseProtocolTestUpdateCostInstance.revealvote(_proposed_release_hash, _choice, _vary, {from: _from_account.address}));
          console.log('as expected failed to make this revealvote');
      
        }

        async function should_fail_clmpropbyhash(_from_account, _proposalhash) {

          console.log('should fail to clmpropbyhash');
        await truffleAssert.fails(EticaReleaseProtocolTestUpdateCostInstance.clmpropbyhash(_proposalhash, {from: _from_account.address}));
        console.log('as expected failed to clmpropbyhash');

        }

   async function advanceminutes(duration) {

    let id = Date.now();
     let numberlblocks = duration * 4; // 4 is because 60 / 15 == 4

     // console.log('numberlblocks is', numberlblocks);
     console.log('---------------  SLEEPING FOR ABOUT ', duration.toString(), ' SECONDS (press ctrl + c if it takes too long)  ------------');

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

   async function advanceseconds(duration) {

    let id = Date.now();
     let numberlblocks = duration / 15; // 1 block every 15 seconds

     // console.log('numberlblocks is', numberlblocks);
     console.log('---------------  SLEEPING FOR ABOUT ', duration.toString(), ' SECONDS (press ctrl + c if it takes too long)  ------------');

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


   function randomipfs() {
    var result           = 'Qm';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < 44; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

 // get expected hash as it will be calculated by solidity in contract code:
 function get_expected_keccak256_hash(_data) {
  var encoded = abi.rawEncode([ "string" ], [ _data ]);
  var result_hash = web3.utils.keccak256(encoded);
  //console.log('get_expected_hash() result is ', result_hash);

  return web3.utils.keccak256(encoded); // example: should be '0xf6d8716087544b8fe1a306611913078dd677450d90295497e433503483ffea6e' for 'Malaria'

 }

  // get expected hash as it will be calculated by solidity in contract code:
  // example: should return 0xa9b5a7156f9cd0076e0f093589e02d881392cc80806843b30a1bacf2efc810bb for couple {QmWWQSuPMS6aXCbZKpEjPHPUZN2NjB3YrhJTHsV4X3vb2t, 0xf6d8716087544b8fe1a306611913078dd677450d90295497e433503483ffea6e}
  function get_expected_keccak256_hash_two(_rawrelease, _diseasehash) {
    var encoded = abi.rawEncode([ "string", "bytes32" ], [ _rawrelease, _diseasehash ]);
    var result_hash = web3.utils.keccak256(encoded);
    //console.log('get_expected_hash_two() result is ', result_hash);
  
    return web3.utils.keccak256(encoded); // example: should be '0xf6d8716087544b8fe1a306611913078dd677450d90295497e433503483ffea6e' for 'Malaria'
  
   }

     // get expected hash as it will be calculated by solidity in contract code:
  // example: should return 0xa9b5a7156f9cd0076e0f093589e02d881392cc80806843b30a1bacf2efc810bb for couple {QmWWQSuPMS6aXCbZKpEjPHPUZN2NjB3YrhJTHsV4X3vb2t, 0xf6d8716087544b8fe1a306611913078dd677450d90295497e433503483ffea6e}
  function get_expected_votehash(_proposed_release_hash, _approved, _msgsender, _vary) {
    var encoded = abi.rawEncode([ "bytes32", "bool", "address", "string"], [ _proposed_release_hash, _approved, _msgsender, _vary ]);
    var result_hash = web3.utils.keccak256(encoded);
    console.log('get_expected_votehash() result is ', result_hash);
  
    return web3.utils.keccak256(encoded); // example: should be '0xf6d8716087544b8fe1a306611913078dd677450d90295497e433503483ffea6e' for 'Malaria'
  
   }

   async function get_expected_reward(_from_account, _rawrelease){

    // curation reward:
    let _vote = await EticaReleaseProtocolTestUpdateCostInstance.votes(_rawrelease, _from_account.address);
    //console.log('_vote is', _vote);
    
    let _proposal = await EticaReleaseProtocolTestUpdateCostInstance.proposals(_rawrelease);
    let _proposaldatas = await EticaReleaseProtocolTestUpdateCostInstance.propsdatas(_rawrelease);
    //console.log('proposal is', _proposal);
    
    // only slash and reward if prop is not tie:
    if (!_proposaldatas.istie) {

      // Reminder: ProposalStatus = { Rejected, Accepted, Pending, Singlevoter };
      let voterChoice = 0; // ProposalStatus.Rjected

      if(_vote.approve){
        voterChoice = 1; // ProposalStatus.Accepted;
      }

      // reward only if vote right
      if(voterChoice == _proposaldatas.status) {  

    let _period = await EticaReleaseProtocolTestUpdateCostInstance.periods(_proposal.period_id);
    //console.log('period is', _period);

    let _expected_curation_reward = 0;
    let _expected_curation_reward_num = web3.utils.fromWei(_vote.amount, "ether" );
    let _expected_curation_reward_ratio = _expected_curation_reward_num / _period.curation_sum;

    if(!_vote.is_editor){
      _expected_curation_reward = _expected_curation_reward_ratio * _period.reward_for_curation;
    }

    let _expected_editor_reward = 0; // initialtiaze var


    if(_vote.is_editor && _proposaldatas.status == 1){
    let _expected_editor_reward_ratio = web3.utils.fromWei(_proposaldatas.lasteditor_weight, "ether" ) / _period.editor_sum;
    //console.log('_expected_editor_reward_ratio is', _expected_editor_reward_ratio);
    _expected_editor_reward = _expected_editor_reward_ratio * _period.reward_for_editor;
    }
    
    

    let _expected_reward = _expected_curation_reward + _expected_editor_reward;

    //console.log('_expected_curation_reward_ratio is', _expected_curation_reward_ratio);
    //console.log('_expected_curation_reward is', _expected_curation_reward);
    //console.log('_expected_editor_reward is', _expected_editor_reward);
    //console.log('_expected reward is', _expected_reward);
    
    return _expected_reward;

  } else {
    //no reward
    return 0;
  }
  

} else{
  //no reward
  return 0;
}


   }


   async function createproposal(_from_account, _diseasehash, _title, _description, _raw_release_hash, _freefield, _chunkid, _ischunk_right){

    console.log('................................  START CREATION OF NEW PROPOSAL', _title,' ....................... ');
  
    let oldproposalsCounter = await EticaReleaseProtocolTestUpdateCostInstance.proposalsCounter();
  
    let _from_accountbalancebefore = await EticaReleaseProtocolTestUpdateCostInstance.balanceOf(_from_account.address);
    //console.log('_from_account ETI balance before:', web3.utils.fromWei(_from_accountbalancebefore, "ether" ));
  
    let _from_accountbosomsbefore = await EticaReleaseProtocolTestUpdateCostInstance.bosoms(_from_account.address);
    //console.log('_from_account Bosoms before:', web3.utils.fromWei(_from_accountbosomsbefore, "ether" ));
  
    return EticaReleaseProtocolTestUpdateCostInstance.propose(_diseasehash, _title, _description, _raw_release_hash, _freefield, _chunkid, {from: _from_account.address}).then(async function(response){
  
      let first_proposal = await EticaReleaseProtocolTestUpdateCostInstance.proposals(get_expected_keccak256_hash_two(_raw_release_hash, _diseasehash));
      let proposalsCounter = await EticaReleaseProtocolTestUpdateCostInstance.proposalsCounter();
      //console.log('THE FIRST PROPOSAL IS:', first_proposal);
  
      //console.log('THE FIRST PROPOSAL IPFS IS:', first_proposal_ipfs);
  
      let first_proposal_data = await EticaReleaseProtocolTestUpdateCostInstance.propsdatas(get_expected_keccak256_hash_two(_raw_release_hash, _diseasehash));
      //console.log('THE FIRST PROPOSAL DATA IS:', first_proposal_data);
  
      // check Proposal's general information:
      assert.equal(first_proposal.disease_id, EXPECTED_FIRST_DISEASE_HASH, 'First proposal should exist with right disease_id');
      assert(first_proposal.period_id >= 1);
      assert.equal(first_proposal.title, _title, 'First proposal should exist with right name');
      assert.equal(first_proposal.description, _description, 'First proposal should exist with right description');
      assert.equal(first_proposal.raw_release_hash, _raw_release_hash, 'First proposal should exist with right raw_release_hash');
      assert.equal(first_proposal.freefield, _freefield, 'First proposal should exist with right free_field');
      if(_ischunk_right){
        assert.equal(first_proposal.chunk_id, _chunkid, 'First proposal should exist with right chunkid');
        console.log('chunk was right and proposal was succesfully added to chunk');
      }
      else {
        assert.equal(first_proposal.chunk_id, 0, 'First proposal should exist with right chunid');
        console.log('chunk was wrong and proposal was not added to chunk');
      }
      assert.equal(proposalsCounter, web3.utils.toBN(oldproposalsCounter).add(web3.utils.toBN('1')).toString(), 'There should be exactly 1 more proposal at this point');
  
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
  
      // ------------ WARNING
      // NEED TO CHECK test_acount has 10 ETI less than before creating propoosal and CHECK if default vote has been registered
      // ------------ WARNING
  
      console.log('................................  CREATED NEW  PROPOSAL', _title,' WITH SUCCESS ....................... ');
      });
   }


 async function getcost_createproposal(_from_account, _diseasehash, _title, _description, _raw_release_hash, _freefield, _chunkid){

  console.log('................................  ESTIMATING COST CREATION OF NEW PROPOSAL', _title,' ....................... ');

  let oldproposalsCounter = await EticaReleaseProtocolTestUpdateCostInstance.proposalsCounter();

  let _from_accountbalancebefore = await EticaReleaseProtocolTestUpdateCostInstance.balanceOf(_from_account.address);
  //console.log('_from_account ETI balance before:', web3.utils.fromWei(_from_accountbalancebefore, "ether" ));

  let _from_accountbosomsbefore = await EticaReleaseProtocolTestUpdateCostInstance.bosoms(_from_account.address);
  //console.log('_from_account Bosoms before:', web3.utils.fromWei(_from_accountbosomsbefore, "ether" ));

  return EticaReleaseProtocolTestUpdateCostInstance.propose.estimateGas(_diseasehash, _title, _description, _raw_release_hash, _freefield, _chunkid, {from: _from_account.address}).then(async function(response){

    let gas = Number(response);
    let gasprice = Number(gas * GASPRICE).toString();
    let ethprice = web3.utils.fromWei(gasprice, 'ether');
    let usdprice = ethprice * ETH_PRICE_USD;
    console.log("gas estimation of creation of proposal = " + gas + " units");
    console.log("gas cost estimation of creation proposal = " + (gas * GASPRICE) + " wei");
    console.log("eth cost estimation of creation proposal = " + ethprice + " ether");
    console.log("usd cost estimation of creation proposal = " + usdprice + " USD");

    console.log('................................  ESTIMATED COST CREATION NEW  PROPOSAL', _title,' WITH SUCCESS ....................... ');
    });
 }


 async function createdisease(_diseasename){

  console.log('................................  START CREATION OF NEW DISEASE', _diseasename,' ....................... ');

  // calculate expected hash of disease:
  let _expectedhash = get_expected_keccak256_hash(_diseasename);

  let test_accountbalance_before_createdisease = await EticaReleaseProtocolTestUpdateCostInstance.balanceOf(test_account.address);
  let contract_balance_before_createdisease = await EticaReleaseProtocolTestUpdateCostInstance.balanceOf(EticaReleaseProtocolTestUpdateCostInstance.address);
  //console.log('miner account balance after transfer is', web3.utils.fromWei(miner_accountbalanceafter_transfer, "ether" ));
   
  return EticaReleaseProtocolTestUpdateCostInstance.createdisease(_diseasename, {from: test_account.address}).then(async function(receipt){
   // check diseasesbyIds and diseasesbyNames mappings insertion:
let hashfromname = await EticaReleaseProtocolTestUpdateCostInstance.getdiseasehashbyName(_diseasename);
let indexfromhash = await EticaReleaseProtocolTestUpdateCostInstance.diseasesbyIds(_expectedhash);

assert.equal(indexfromhash, TOTAL_DISEASES + 1, '_expectedhash should have an entry in diseasesbyIds with value of total number of diseases created in the protocol');
assert.equal(hashfromname, _expectedhash, 'Disease should have an entry in diseasesbyNames with value of _expectedhash');
   
   
    let new_disease = await EticaReleaseProtocolTestUpdateCostInstance.diseases(indexfromhash);
    let diseasesCounter = await EticaReleaseProtocolTestUpdateCostInstance.diseasesCounter();
    let test_accountbalance_after_createdisease = await EticaReleaseProtocolTestUpdateCostInstance.balanceOf(test_account.address);
    let contract_balance_after_createdisease = await EticaReleaseProtocolTestUpdateCostInstance.balanceOf(EticaReleaseProtocolTestUpdateCostInstance.address);
//console.log('THE NEW DISEASE IS:', new_disease);
//console.log('NAME OF THE NEW DISEASE IS:', new_disease.name);
//console.log('NUMBER OF DISEASES IS:', diseasesCounter);

// check diseases mapping insertion:
assert.equal(new_disease.disease_hash, _expectedhash, 'First disease should exists with right diseasehash');
assert.equal(new_disease.name, _diseasename, 'First disease should exists with right name');

// test_account should have paid 100 ETI to contract
   // test_account should have 100 ETI less
     assert.equal(web3.utils.fromWei(test_accountbalance_before_createdisease, "ether" ) - web3.utils.fromWei(test_accountbalance_after_createdisease, "ether" ), 100);
     //console.log('test_account balance after Disease Creation is', web3.utils.fromWei(test_accountbalance_after_createdisease, "ether" ));

   // contract should have 100 ETI more
      assert.equal(web3.utils.fromWei(contract_balance_after_createdisease, "ether" ) - web3.utils.fromWei(contract_balance_before_createdisease, "ether" ), 100);
      //console.log('contract balance after Disease Creation is', web3.utils.fromWei(contract_balance_after_createdisease, "ether" ));

      TOTAL_DISEASES = TOTAL_DISEASES + 1;

console.log('................................  CREATED NEW DISEASE', _diseasename,' WITH SUCCESS ....................... ');
})
 }

 async function getcost_createdisease(_diseasename){

  console.log('................................  ESTIMATING GAS COST CREATION OF NEW DISEASE', _diseasename,' ....................... ');

  // calculate expected hash of disease:
  let _expectedhash = get_expected_keccak256_hash(_diseasename);

  let test_accountbalance_before_createdisease = await EticaReleaseProtocolTestUpdateCostInstance.balanceOf(test_account.address);
  let contract_balance_before_createdisease = await EticaReleaseProtocolTestUpdateCostInstance.balanceOf(EticaReleaseProtocolTestUpdateCostInstance.address);
  //console.log('miner account balance after transfer is', web3.utils.fromWei(miner_accountbalanceafter_transfer, "ether" ));
   
  return EticaReleaseProtocolTestUpdateCostInstance.createdisease.estimateGas(_diseasename, {from: test_account.address}).then(async function(receipt){
    let gas = Number(receipt);
    let gasprice = Number(gas * GASPRICE).toString();
    let ethprice = web3.utils.fromWei(gasprice, 'ether');
    let usdprice = ethprice * ETH_PRICE_USD;
    console.log("gas estimation of creation of disease = " + gas + " units");
    console.log("gas cost estimation of creation disease = " + (gas * GASPRICE) + " wei");
    console.log("eth cost estimation of creation disease = " + ethprice + " ether");
    console.log("usd cost estimation of creation disease = " + usdprice + " USD");


})
 }


 async function commitvote(_from_account, _proposed_release_hash, _choice, _amount, _vary){
  let expected_votehash = get_expected_votehash(_proposed_release_hash, _choice, _from_account.address, _vary);
  let _oldcommit = await EticaReleaseProtocolTestUpdateCostInstance.commits(_from_account.address, expected_votehash);
  console.log('expected_votehash is', expected_votehash);
  return EticaReleaseProtocolTestUpdateCostInstance.commitvote(web3.utils.toWei(_amount, 'ether'), expected_votehash, {from: _from_account.address}).then(async function(response){
  let _newcommit = await EticaReleaseProtocolTestUpdateCostInstance.commits(_from_account.address, expected_votehash);
  let _amountbninwei = web3.utils.toBN(web3.utils.toWei(_amount, 'ether'));
  console.log('new commit amount', web3.utils.fromWei(_newcommit.amount, "ether"));
  console.log('old commit amount', web3.utils.fromWei(_oldcommit.amount, "ether"));
  console.log('_amount', _amount);
  let _expected_sum = web3.utils.toBN(_oldcommit.amount).add(_amountbninwei);
  _expected_sum = web3.utils.fromWei(_expected_sum, "ether");
  console.log('expected_sum', _expected_sum);
  assert.equal(web3.utils.fromWei(_newcommit.amount, "ether"), _expected_sum, 'New commit amount should equal oldcommit + _amount');
  console.log('................................  VOTED ON PROPOSAL ', _proposed_release_hash,' THE CHOICE IS', _choice,' and  VOTE AMOUNT IS', _amount,' ....................... ');
  });
 }

 async function getcost_commitvote(_from_account, _proposed_release_hash, _choice, _amount, _vary){
  let expected_votehash = get_expected_votehash(_proposed_release_hash, _choice, _from_account.address, _vary);
  let _oldcommit = await EticaReleaseProtocolTestUpdateCostInstance.commits(_from_account.address, expected_votehash);
  console.log('expected_votehash is', expected_votehash);
  return EticaReleaseProtocolTestUpdateCostInstance.commitvote.estimateGas(web3.utils.toWei(_amount, 'ether'), expected_votehash, {from: _from_account.address}).then(async function(response){
    let gas = Number(response);
    let gasprice = Number(gas * GASPRICE).toString();
    let ethprice = web3.utils.fromWei(gasprice, 'ether');
    let usdprice = ethprice * ETH_PRICE_USD;
    console.log("gas estimation of commitvote = " + gas + " units");
    console.log("gas cost estimation of commitvote = " + (gas * GASPRICE) + " wei");
    console.log("eth cost estimation of commitvote = " + ethprice + " ether");
    console.log("usd cost estimation of commitvote = " + usdprice + " USD");
    console.log('................................  ESTIMATED COST COMMIT VOTE ON PROPOSAL ', _proposed_release_hash,' THE CHOICE IS', _choice,' and  VOTE AMOUNT IS', _amount,' ....................... ');
  });
 }

// vote commit should fail:
async function should_fail_commitvote(_from_account, _proposed_release_hash, _choice, _amount, _vary) {
console.log('should fail this commitvote');
let expected_votehash = get_expected_votehash(_proposed_release_hash, _choice, _from_account.address, _vary);
console.log('expected_votehash is', expected_votehash);
await truffleAssert.fails(EticaReleaseProtocolTestUpdateCostInstance.commitvote(web3.utils.toWei(_amount, 'ether'), expected_votehash, {from: _from_account.address}));
console.log('as expected failed to make this commitvote');
        }

 async function revealvote(_from_account, _proposed_release_hash, _choice, _vary){
  return EticaReleaseProtocolTestUpdateCostInstance.revealvote(_proposed_release_hash, _choice, _vary, {from: _from_account.address}).then(async function(response){
 let expected_votehash = get_expected_votehash(_proposed_release_hash, _choice, _from_account.address, _vary);
  let _newcommit = await EticaReleaseProtocolTestUpdateCostInstance.commits(_from_account.address, expected_votehash);
  assert.equal(_newcommit.amount, 0, 'New commit amount should be 0 after revealvote');
  console.log('................................  REVEALED ON PROPOSAL ', _proposed_release_hash,' THE CHOICE IS',' ....................... ');
  });
 }

 async function getcost_revealvote(_from_account, _proposed_release_hash, _choice, _vary){
  return EticaReleaseProtocolTestUpdateCostInstance.revealvote.estimateGas(_proposed_release_hash, _choice, _vary, {from: _from_account.address}).then(async function(response){
    let gas = Number(response);
    let gasprice = Number(gas * GASPRICE).toString();
    let ethprice = web3.utils.fromWei(gasprice, 'ether');
    let usdprice = ethprice * ETH_PRICE_USD;
    console.log("gas estimation of commitvote = " + gas + " units");
    console.log("gas cost estimation of revealvote = " + (gas * GASPRICE) + " wei");
    console.log("eth cost estimation of revealvote = " + ethprice + " ether");
    console.log("usd cost estimation of revealvote = " + usdprice + " USD");
  console.log('................................  REVEALED ON PROPOSAL ', _proposed_release_hash,' THE CHOICE IS', _choice,' ....................... ');
  });
 }

 async function clmpropbyhash(_from_account, _proposed_release_hash){
  return EticaReleaseProtocolTestUpdateCostInstance.clmpropbyhash(_proposed_release_hash, {from: _from_account.address}).then(async function(response){

  console.log('................................  CLAIMED PROPOSAL ', _proposed_release_hash,' WITH SUCCESS ....................... ');
  });
 }

 async function getcost_clmpropbyhash(_from_account, _proposed_release_hash){
  return EticaReleaseProtocolTestUpdateCostInstance.clmpropbyhash.estimateGas(_proposed_release_hash, {from: _from_account.address}).then(async function(response){

    let gas = Number(response);
    let gasprice = Number(gas * GASPRICE).toString();
    let ethprice = web3.utils.fromWei(gasprice, 'ether');
    let usdprice = ethprice * ETH_PRICE_USD;
    console.log("gas estimation of clmpropbyhash = " + gas + " units");
    console.log("gas cost estimation of clmpropbyhash = " + (gas * GASPRICE) + " wei");
    console.log("eth cost estimation of clmpropbyhash = " + ethprice + " ether");
    console.log("usd cost estimation of clmpropbyhash = " + usdprice + " USD");

  console.log('................................  ESTIMATED CLAIM OF PROPOSAL COST', _proposed_release_hash,' WITH SUCCESS ....................... ');
  });
 }


 async function stakeclmidx(_from_account, _index){
  let _from_accountbalancebefore = await EticaReleaseProtocolTestUpdateCostInstance.balanceOf(_from_account.address);
  let _from_accountstakebefore = await EticaReleaseProtocolTestUpdateCostInstance.stakes(_from_account.address, _index);
  return EticaReleaseProtocolTestUpdateCostInstance.stakeclmidx(_index, {from: _from_account.address}).then(async function(resp){
    assert(true);
    let _from_accountbalanceafter = await EticaReleaseProtocolTestUpdateCostInstance.balanceOf(_from_account.address);
    let _from_accountstakeafter = await EticaReleaseProtocolTestUpdateCostInstance.stakes(_from_account.address,1);
    let stakenoldbalance = web3.utils.toBN(_from_accountbalancebefore).add(web3.utils.toBN(_from_accountstakebefore.amount)).toString();
    //console.log('------test_account ETI balance after:', web3.utils.fromWei(test_accountbalanceafter, "ether" ));
    //console.log('------stakenoldbalance is:::', web3.utils.fromWei(stakenoldbalance, "ether"));
    //console.log('test_account Stake after:', test_accountstakeafter);

    assert.equal( web3.utils.fromWei(_from_accountbalanceafter, "ether"), web3.utils.fromWei(stakenoldbalance, "ether"), '_from_account should have increased by the stake\'s ETI amount!');

    console.log('........................... Claimed the STAKE with success ! ....................... ');

  });

 }

 async function should_fail_stakeclmidx(_index, _from_account){
  console.log('should fail this stakeclmidx()'); 
  await truffleAssert.fails(EticaReleaseProtocolTestUpdateCostInstance.stakeclmidx(_index, {from: _from_account.address}));
  console.log('as expected failed to make this stakeclmidx()');
 }


 async function stakesnap(_from_account, _index, _snapamount){
  let _nbstakes_before_from_account = await EticaReleaseProtocolTestUpdateCostInstance.stakesCounters(_from_account.address);
  //console.log('_nbstakes_before_from_account.toString() is', _nbstakes_before_from_account.toString());
  let _from_accountstakebefore = await EticaReleaseProtocolTestUpdateCostInstance.stakes(_from_account.address, _index);
  //console.log('_from_accountstakebefore is', _from_accountstakebefore);
  //console.log('_from_accountstakebefore amount is', web3.utils.fromWei(_from_accountstakebefore.amount, "ether"));
  
  return EticaReleaseProtocolTestUpdateCostInstance.stakesnap(_index, web3.utils.toWei(_snapamount, 'ether'), {from: _from_account.address}).then(async function(resp){
    assert(true);
    let _nbstakes_after_from_account = await EticaReleaseProtocolTestUpdateCostInstance.stakesCounters(_from_account.address);
    //console.log('_nbstakes_after_from_account.toString() is', _nbstakes_after_from_account.toString());
    let _from_accountstakeafter = await EticaReleaseProtocolTestUpdateCostInstance.stakes(_from_account.address, _index);
    let _newstake = await EticaReleaseProtocolTestUpdateCostInstance.stakes(_from_account.address, _nbstakes_after_from_account.toNumber());
    //console.log('new stake is', _newstake);
    //console.log('new stake amount is', web3.utils.fromWei(_newstake.amount, "ether"));

    assert.equal(_nbstakes_after_from_account.toString(), _nbstakes_before_from_account.add(web3.utils.toBN('1')).toString(), '_from_account should have 1 more stake');
    assert.equal( web3.utils.fromWei(_from_accountstakeafter.amount, "ether"), _snapamount, 'the stake amount should have been updated to snapamount value!');
    //console.log('_from_accountstakeafter.amount is', web3.utils.fromWei(_from_accountstakeafter.amount, "ether"));
    assert.equal(_newstake.amount.toString(),_from_accountstakebefore.amount.sub(web3.utils.toBN(web3.utils.toWei(_snapamount, 'ether'))).toString() );
    
    console.log('........................... Snapped the STAKE with success ! ....................... ');

  });

 }


 async function should_fail_stakesnap(_from_account, _index, _snapamount){
  console.log('should fail this stakesnap()'); 
  await truffleAssert.fails(EticaReleaseProtocolTestUpdateCostInstance.stakesnap(_index, web3.utils.toWei(_snapamount, 'ether'), {from: _from_account.address}));
  console.log('as expected failed to make this stakesnap()');
 }

 });