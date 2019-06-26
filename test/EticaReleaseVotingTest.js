var EticaReleaseVotingTest = artifacts.require("./EticaReleaseVotingTest.sol");

var solidityHelper =  require('./solidity-helper');
var miningHelper =  require('./mining-helper-fast');
var networkInterfaceHelper =  require('./network-interface-helper');
const truffleAssert = require('truffle-assertions');

// test suite
contract('EticaReleaseVotingTest', function(accounts){
  var EticaReleaseVotingTestInstance;
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

var EXPECTED_FIRST_DISEASE_HASH = '0xf6d8716087544b8fe1a306611913078dd677450d90295497e433503483ffea6e'; // FORMER 0xfca403d66ff4c1d6ea8f67e3a96689222557de5048b2ff6d9020d5a433f412aa

var EXPECTED_FIRST_PROPOSAL_PROPOSED_RELEASE_HASH = '0xa9b5a7156f9cd0076e0f093589e02d881392cc80806843b30a1bacf2efc810bb'; // FORMER 0x5f17034b05363de3cfffa94d9ae9c07534861c3cc1216e58a5c0f057607dbc00

  it("can make initial distribution of ETI :", async function () {
    console.log('------------------------------------- Starting INITIAL ETI DISTRIBUTION ---------------------------');

  // wait long enough so that miner_account has mined a block and thus has ETI available, we need a lot of ETI as all tests of this file assume enough ETI and don't deal with mining tests
  //await timeout(150000);
  return EticaReleaseVotingTest.deployed().then(function(instance){
  EticaReleaseVotingTestInstance = instance;
  return EticaReleaseVotingTestInstance.balanceOf(miner_account.address);
  }).then(function(receipt){
  console.log('asserting miner_account has at least 100 000 ETI', web3.utils.fromWei(receipt, "ether" ), 'ETI');
  assert(web3.utils.fromWei(receipt, "ether" ) >= 100000, 'miner_account should have at least 100 000 ETI before starting the tests !');
  }).then(async function(){



  // TRANSFERS FROM MINER ACCOUNT:
  await transferto(test_account);
  await transferto(test_account2);
  await transferto(test_account3);
  await transferto(test_account4);
  await transferto(test_account5);
  await transferto(test_account6);
  await transferto(test_account7);
  await transferto(test_account8);

  let OLD_BALANCE_ACCOUNT = await EticaReleaseVotingTestInstance.balanceOf(test_account.address);  
  let OLD_BALANCE_ACCOUNT_2 = await EticaReleaseVotingTestInstance.balanceOf(test_account2.address);
  let OLD_BALANCE_ACCOUNT_3 = await EticaReleaseVotingTestInstance.balanceOf(test_account3.address);
  let OLD_BALANCE_ACCOUNT_4 = await EticaReleaseVotingTestInstance.balanceOf(test_account4.address);
  let OLD_BALANCE_ACCOUNT_5 = await EticaReleaseVotingTestInstance.balanceOf(test_account5.address);
  let OLD_BALANCE_ACCOUNT_6 = await EticaReleaseVotingTestInstance.balanceOf(test_account6.address);
  let OLD_BALANCE_ACCOUNT_7 = await EticaReleaseVotingTestInstance.balanceOf(test_account7.address);
  let OLD_BALANCE_ACCOUNT_8 = await EticaReleaseVotingTestInstance.balanceOf(test_account8.address);


   // TRANSFERS FROM MINER ACCOUNT:
   await transferfromto(test_account, test_account2, '1000');
   await transferfromto(test_account, test_account3, '1000');
   await transferfromto(test_account, test_account4, '1000');
   await transferfromto(test_account, test_account5, '1000');
   await transferfromto(test_account, test_account6, '1000');
   await transferfromto(test_account, test_account7, '1000');




  let NEW_BALANCE_ACCOUNT = await EticaReleaseVotingTestInstance.balanceOf(test_account.address);
  let NEW_BALANCE_ACCOUNT_2 = await EticaReleaseVotingTestInstance.balanceOf(test_account2.address);
  let NEW_BALANCE_ACCOUNT_3 = await EticaReleaseVotingTestInstance.balanceOf(test_account3.address);
  let NEW_BALANCE_ACCOUNT_4 = await EticaReleaseVotingTestInstance.balanceOf(test_account4.address);
  let NEW_BALANCE_ACCOUNT_5 = await EticaReleaseVotingTestInstance.balanceOf(test_account5.address);
  let NEW_BALANCE_ACCOUNT_6 = await EticaReleaseVotingTestInstance.balanceOf(test_account6.address);
  let NEW_BALANCE_ACCOUNT_7 = await EticaReleaseVotingTestInstance.balanceOf(test_account7.address);
  let NEW_BALANCE_ACCOUNT_8 = await EticaReleaseVotingTestInstance.balanceOf(test_account8.address);



  assert.equal(web3.utils.fromWei(OLD_BALANCE_ACCOUNT, "ether" ) - web3.utils.fromWei(NEW_BALANCE_ACCOUNT, "ether" ),'6000');
  assert.equal(web3.utils.fromWei(NEW_BALANCE_ACCOUNT_2, "ether" ) - web3.utils.fromWei(OLD_BALANCE_ACCOUNT_2, "ether" ),'1000');
  assert.equal(web3.utils.fromWei(NEW_BALANCE_ACCOUNT_3, "ether" ) - web3.utils.fromWei(OLD_BALANCE_ACCOUNT_3, "ether" ),'1000');
  assert.equal(web3.utils.fromWei(NEW_BALANCE_ACCOUNT_4, "ether" ) - web3.utils.fromWei(OLD_BALANCE_ACCOUNT_4, "ether" ),'1000');
  assert.equal(web3.utils.fromWei(NEW_BALANCE_ACCOUNT_5, "ether" ) - web3.utils.fromWei(OLD_BALANCE_ACCOUNT_5, "ether" ),'1000');
  assert.equal(web3.utils.fromWei(NEW_BALANCE_ACCOUNT_6, "ether" ) - web3.utils.fromWei(OLD_BALANCE_ACCOUNT_6, "ether" ),'1000');
  assert.equal(web3.utils.fromWei(NEW_BALANCE_ACCOUNT_7, "ether" ) - web3.utils.fromWei(OLD_BALANCE_ACCOUNT_7, "ether" ),'1000');

  // 3 next tests should fail:
  await should_fail_transferfromto(test_account, test_account2, '10000000');
  await should_fail_transferfromto(test_account, test_account2, '0');
  await should_fail_transferfromto(test_account, test_account2, '-100');


  // begin the stake
await eticatobosom(test_account, '200');
await eticatobosom(test_account2, '2000');
await eticatobosom(test_account3, '2000');
await eticatobosom(test_account4, '2000');
await eticatobosom(test_account5, '2000');
await eticatobosom(test_account6, '2000');
await eticatobosom(test_account7, '2000');

// check significant figures:
await eticatobosom(test_account, '0.123');
await eticatobosom(test_account2, '0.981516165156161651');
await eticatobosom(test_account3, '0.300');
await eticatobosom(test_account4, '0.9151651651665');
await eticatobosom(test_account5, '0.565156161');
await eticatobosom(test_account6, '0.321');
await eticatobosom(test_account7, '0.1805');

// Next 3 stakes should fail
await should_fail_eticatobosom(test_account7,'0');
await should_fail_eticatobosom(test_account7,'-1000');
await should_fail_eticatobosom(test_account7,'10000'); // too much ETI (more than availble in user account)

let IPFS1 = randomipfs();
let IPFS2 = randomipfs();
let IPFS3 = randomipfs();
let IPFS4 = randomipfs();
let IPFS5 = randomipfs();
let IPFS6 = randomipfs();
let IPFS7 = randomipfs();
let IPFS8 = randomipfs();

await createdisease();
let indexfromhash = await EticaReleaseVotingTestInstance.diseasesbyIds(EXPECTED_FIRST_DISEASE_HASH);
let disease_name = 'Malaria';
//let diseasehash = web3.utils.sha256(web3.eth.abi.encodeParameter('string', disease_name));
console.log('m hash1 is', web3.utils.keccak256(web3.utils.fromAscii("Malaria")));
console.log('m hash3 is', web3.utils.sha3(web3.utils.fromAscii("Malaria")));

// Use keccak256 Hashing function (alias)
console.log('m hash2 is', web3.utils.keccak256('Malaria'))
let hashfromname = await EticaReleaseVotingTestInstance.getdiseasehashbyName('Malaria');
console.log('indexfromhash is', indexfromhash);
console.log('disease_name is', disease_name);
//console.log('diseasehash is', diseasehash);
console.log('hashfromname is ', hashfromname);

assert.equal(indexfromhash, '1', 'EXPECTED_FIRST_DISEASE_HASH hash should have an entry in diseasesbyIds with value of 1');
assert.equal(hashfromname, EXPECTED_FIRST_DISEASE_HASH, 'Malaria should have an entry in diseasesbyNames with value of EXPECTED_FIRST_DISEASE_HASH');
  

  console.log('------------------------------------- INITIAL ETI DISTRIBUTION DONE ---------------------------');

  })

  });


  async function printBalances(accounts) {
    // accounts.forEach(function(ac, i) {
       var balance_val = await (web3.eth.getBalance(accounts[0]));
       //console.log('acct 0 balance', web3.utils.fromWei(balance_val.toString() , 'ether') )
    // })
   }

   async function printEtiBalance(testaccount) {
       var balance_val = await EticaReleaseVotingTestInstance.balanceOf(testaccount.address);
       console.log('ETI the balance of ', testaccount.address, 'is',  web3.utils.fromWei(balance_val.toString() , 'ether') );
       return balance_val;
   }

   async function transferto(testaccount) {

    console.log('transfering 10000 ETI from miner_account to test_account', testaccount.address);
    let test_accountbalancebefore = await EticaReleaseVotingTestInstance.balanceOf(testaccount.address);
    let miner_accountbalancebefore = await EticaReleaseVotingTestInstance.balanceOf(miner_account.address);
    console.log('miner_account ETI balance before:', web3.utils.fromWei(miner_accountbalancebefore, "ether" ));
    console.log('test_account', testaccount.address,'ETI balance before:', web3.utils.fromWei(test_accountbalancebefore, "ether" ));
    return EticaReleaseVotingTestInstance.transfer(testaccount.address,  web3.utils.toWei('10000', 'ether'), {from: miner_account.address}).then(async function() {
      let test_accountbalanceafter = await EticaReleaseVotingTestInstance.balanceOf(testaccount.address);
      let miner_accountbalanceafter = await EticaReleaseVotingTestInstance.balanceOf(miner_account.address);
      console.log('miner_account ETI balance after:', web3.utils.fromWei(miner_accountbalanceafter, "ether" ));
      console.log('test_account', testaccount.address,'ETI balance after:', web3.utils.fromWei(test_accountbalanceafter, "ether" ));
     });

   }


   async function transferfromto(senderaccount, receiveraccount, amount) {

    console.log('transfering', amount,'ETI from senderaccount', senderaccount.address, 'to receiveraccount', receiveraccount.address);

    return EticaReleaseVotingTestInstance.transfer(receiveraccount.address,  web3.utils.toWei(amount, 'ether'), {from: senderaccount.address}).then(async function() {
 
    console.log('transfered', amount,'ETI from senderaccount', senderaccount.address, 'to receiveraccount', receiveraccount.address);

     });

   }

   async function eticatobosom(useraccount, amount){

    console.log('---> Staking Eticas for Bosoms. Stake amount is', amount, 'ETI. User is ', useraccount.address);
    return EticaReleaseVotingTestInstance.eticatobosoms(useraccount.address,  web3.utils.toWei(amount, 'ether'), {from: useraccount.address}).then(async function(receipt){
    console.log('---> The stake of Eticas for Bosoms worth', amount, 'ETI', 'was successfull');

      }).catch(async function(error){
        console.log('An error has occured !', error);
      })
   }


   async function should_fail_eticatobosom(useraccount, amount){

    console.log('---> Staking Eticas for Bosoms. Stake amount is', amount, 'ETI. User is ', useraccount.address);
    await truffleAssert.fails(EticaReleaseVotingTestInstance.eticatobosoms(useraccount.address,  web3.utils.toWei(amount, 'ether'), {from: useraccount.address}));
    console.log('---> As expected failed to make the stake worth', amount, 'ETI from user: ', useraccount.address);

   }

   // transfer that should fail:
   async function should_fail_transferfromto(senderaccount, receiveraccount, amount) {
     
    console.log('should fail transfering', amount,'ETI from senderaccount', senderaccount.address, 'to receiveraccount', receiveraccount.address);
    await truffleAssert.fails(EticaReleaseVotingTestInstance.transfer(receiveraccount.address,  web3.utils.toWei(amount, 'ether'), {from: senderaccount.address}));
    console.log('as expected failed to transfer', amount,'ETI from senderaccount', senderaccount.address, 'to receiveraccount', receiveraccount.address);

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


   function randomipfs() {
    var result           = 'Qm';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < 44; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }


 async function createproposal(){

  let test_accountbalancebefore = await EticaReleaseVotingTestInstance.balanceOf(test_account.address);
  //console.log('test_account ETI balance before:', web3.utils.fromWei(test_accountbalancebefore, "ether" ));

  let test_accountbosomsbefore = await EticaReleaseVotingTestInstance.bosoms(test_account.address);
  //console.log('test_account Bosoms before:', web3.utils.fromWei(test_accountbosomsbefore, "ether" ));

  return EticaReleaseVotingTestInstance.propose(EXPECTED_FIRST_DISEASE_HASH, "Proposal Crisper K32 for Malaria", "Using Crisper to treat Malaria", "QmWWQSuPMS6aXCbZKpEjPHPUZN2NjB3YrhJTHsV4X3vb2t", "QmT4AeWE9Q9EaoyLJiqaZuYQ8mJeq4ZBncjjFH9dQ9uDVA", "QmT9qk3CRYbFDWpDFYeAv8T8H1gnongwKhh5J68NLkLir6", {from: test_account.address}).then(async function(response){

    let first_proposal = await EticaReleaseVotingTestInstance.proposals(EXPECTED_FIRST_PROPOSAL_PROPOSED_RELEASE_HASH);
    let proposalsCounter = await EticaReleaseVotingTestInstance.proposalsCounter();
    //console.log('THE FIRST PROPOSAL IS:', first_proposal);

    let first_proposal_ipfs = await EticaReleaseVotingTestInstance.propsipfs(EXPECTED_FIRST_PROPOSAL_PROPOSED_RELEASE_HASH);
    //console.log('THE FIRST PROPOSAL IPFS IS:', first_proposal_ipfs);

    let first_proposal_data = await EticaReleaseVotingTestInstance.propsdatas(EXPECTED_FIRST_PROPOSAL_PROPOSED_RELEASE_HASH);
    //console.log('THE FIRST PROPOSAL DATA IS:', first_proposal_data);

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

    // check Proposal's DATA:
    assert.equal(first_proposal_data.status, '2', 'First proposal should exist with right status');
    assert.equal(first_proposal_data.istie, false, 'First proposal should exist with right istie');
    assert.equal(first_proposal_data.prestatus, '3', 'First proposal should exist with right prestatus');
    assert.equal(first_proposal_data.nbvoters, '1', 'First proposal should exist with right nbvoters');
    assert.equal(first_proposal_data.slashingratio.toNumber(), '100', 'First proposal should exist with right slashingratio');
    assert.equal(web3.utils.fromWei(first_proposal_data.forvotes.toString()), PROPOSAL_DEFAULT_VOTE, 'First proposal should exist with right forvotes');
    assert.equal(web3.utils.fromWei(first_proposal_data.againstvotes.toString()), '0', 'First proposal should exist with right againstvotes');
    assert.equal(web3.utils.fromWei(first_proposal_data.lastcuration_weight, "ether" ), PROPOSAL_DEFAULT_VOTE, 'First proposal should exist with right lastcuration_weight');
    assert.equal(web3.utils.fromWei(first_proposal_data.lasteditor_weight, "ether" ), PROPOSAL_DEFAULT_VOTE, 'First proposal should exist with right lasteditor_weight');

    // ------------ WARNING
    // NEED TO CHECK test_acount has 10 ETI less than before creating propoosal and CHECK if default vote has been registered
    // ------------ WARNING

    console.log('................................  CAN CREATE A PROPOSAL  ....................... ');
    console.log('------------------------------- END OF TEST with SUCCESS ----------------------------');
    });
 }


 async function createdisease(){

  let test_accountbalance_before_createdisease = await EticaReleaseVotingTestInstance.balanceOf(test_account.address);
  let contract_balance_before_createdisease = await EticaReleaseVotingTestInstance.balanceOf(EticaReleaseVotingTestInstance.address);
  //console.log('miner account balance after transfer is', web3.utils.fromWei(miner_accountbalanceafter_transfer, "ether" ));

let first_disease = await EticaReleaseVotingTestInstance.diseases(1);
let diseasesCounter = await EticaReleaseVotingTestInstance.diseasesCounter();
   
  return EticaReleaseVotingTestInstance.createdisease("Malaria", "Malaria is a disease that kills millions of people each year !", {from: test_account.address}).then(async function(receipt){
    let first_disease = await EticaReleaseVotingTestInstance.diseases(1);
    let diseasesCounter = await EticaReleaseVotingTestInstance.diseasesCounter();
    let test_accountbalance_after_createdisease = await EticaReleaseVotingTestInstance.balanceOf(test_account.address);
    let contract_balance_after_createdisease = await EticaReleaseVotingTestInstance.balanceOf(EticaReleaseVotingTestInstance.address);
console.log('THE FIRST DISEASE IS:', first_disease);
console.log('NAME OF THE FIRST DISEASE IS:', first_disease.name);
console.log('DESCRIPTION OF THE FIRST DISEASE IS:', first_disease.description);
console.log('NUMBER OF DISEASES IS:', diseasesCounter);

// check diseases mapping insertion:
assert.equal(first_disease.disease_hash, EXPECTED_FIRST_DISEASE_HASH, 'First disease should exists with right diseasehash');
assert.equal(first_disease.name, 'Malaria', 'First disease should exists with right name');
assert.equal(first_disease.description, 'Malaria is a disease that kills millions of people each year !', 'First disease should exists with right description');
assert.equal(diseasesCounter, 1, 'There should be exactly 1 disease at this point');

// check diseasesbyIds and diseasesbyNames mappings insertion:
let indexfromhash = await EticaReleaseVotingTestInstance.diseasesbyIds(EXPECTED_FIRST_DISEASE_HASH);
let hashfromname = await EticaReleaseVotingTestInstance.getdiseasehashbyName('Malaria');

assert.equal(indexfromhash, '1', 'EXPECTED_FIRST_DISEASE_HASH hash should have an entry in diseasesbyIds with value of 1');
assert.equal(hashfromname, EXPECTED_FIRST_DISEASE_HASH, 'Malaria should have an entry in diseasesbyNames with value of EXPECTED_FIRST_DISEASE_HASH');

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
 }





 });
