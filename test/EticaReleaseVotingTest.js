var EticaReleaseVotingTest = artifacts.require("./EticaReleaseVotingTest.sol");

var solidityHelper =  require('./solidity-helper');
var miningHelper =  require('./mining-helper-fast');
var networkInterfaceHelper =  require('./network-interface-helper');
const truffleAssert = require('truffle-assertions');
var abi = require('ethereumjs-abi');

console.log('------------------- WELCOME ON THE ETICA PROTOCOL ---------------');
console.log('---------------> DECENTRALISED RESEARCH INDUSTRY <------------------');
console.log('');

var PERIOD_CURATION_REWARD = 0; // initialize global variable PERIOD_CURATION_REWARD
var PERIOD_EDITOR_REWARD = 0; // initialize global variable PERIOD_EDITOR_REWARD
var DEFAULT_VOTING_TIME = 0; // initialize global variable DEFAULT_VOTING_TIME

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

var FIRST_DISEASE_NAME = "Malaria";
var FIRST_DISEASE_DESC = "Malaria is a disease that kills millions of people each year !";

var encoded = abi.rawEncode([ "string" ], [ FIRST_DISEASE_NAME ]);

var EXPECTED_FIRST_DISEASE_HASH = get_expected_keccak256_hash(FIRST_DISEASE_NAME); // should be '0xf6d8716087544b8fe1a306611913078dd677450d90295497e433503483ffea6e' for 'Malaria'
//console.log('EXPECTED_FIRST_DISEASE_HASH is ', EXPECTED_FIRST_DISEASE_HASH);

var TOTAL_DISEASES = 0; // var keep track of total number of diseases created in the protocol

  it("testing ETICA PROTOCOL:", async function () {
    console.log('------------------------------------- Starting TESTS OF ETICA PROTOCOL ---------------------------');

  // wait long enough so that miner_account has mined a block and thus has ETI available, we need a lot of ETI as all tests of this file assume enough ETI and don't deal with mining tests
  //await timeout(150000);
  return EticaReleaseVotingTest.deployed().then(function(instance){
  EticaReleaseVotingTestInstance = instance;
  return EticaReleaseVotingTestInstance.balanceOf(miner_account.address);
  }).then(function(receipt){
  console.log('asserting miner_account has at least 100 000 ETI', web3.utils.fromWei(receipt, "ether" ), 'ETI');
  assert(web3.utils.fromWei(receipt, "ether" ) >= 100000, 'miner_account should have at least 100 000 ETI before starting the tests !');
  }).then(async function(){

    DEFAULT_VOTING_TIME = await EticaReleaseVotingTestInstance.DEFAULT_VOTING_TIME(); 
    console.log('DEFAULT_VOTING_TIME IS ', DEFAULT_VOTING_TIME);

    PERIOD_CURATION_REWARD = await EticaReleaseVotingTestInstance.PERIOD_CURATION_REWARD();
    console.log('PERIOD_CURATION_REWARD IS ', PERIOD_CURATION_REWARD);

    PERIOD_EDITOR_REWARD = await EticaReleaseVotingTestInstance.PERIOD_EDITOR_REWARD();
    console.log('PERIOD_EDITOR_REWARD IS ', PERIOD_EDITOR_REWARD);

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

await createdisease(FIRST_DISEASE_NAME, FIRST_DISEASE_DESC);
let indexfromhash = await EticaReleaseVotingTestInstance.diseasesbyIds(EXPECTED_FIRST_DISEASE_HASH);
let hashfromname = await EticaReleaseVotingTestInstance.getdiseasehashbyName(EXPECTED_FIRST_DISEASE_HASH);

// Retrieve BLOCKEDETICAS:
let OLD_BLOCKED_ETI_TEST_ACCOUNT = await EticaReleaseVotingTestInstance.blockedeticas(test_account.address);
let OLD_BLOCKED_ETI_TEST_ACCOUNT_2 = await EticaReleaseVotingTestInstance.blockedeticas(test_account2.address);
let OLD_BLOCKED_ETI_TEST_ACCOUNT_3 = await EticaReleaseVotingTestInstance.blockedeticas(test_account3.address);
let OLD_BLOCKED_ETI_TEST_ACCOUNT_4 = await EticaReleaseVotingTestInstance.blockedeticas(test_account4.address);
let OLD_BLOCKED_ETI_TEST_ACCOUNT_5 = await EticaReleaseVotingTestInstance.blockedeticas(test_account5.address);
let OLD_BLOCKED_ETI_TEST_ACCOUNT_6 = await EticaReleaseVotingTestInstance.blockedeticas(test_account6.address);
let OLD_BLOCKED_ETI_TEST_ACCOUNT_7 = await EticaReleaseVotingTestInstance.blockedeticas(test_account7.address);

console.log("OLD_BLOCKED_ETI_TEST_ACCOUNT is ", OLD_BLOCKED_ETI_TEST_ACCOUNT);
console.log("OLD_BLOCKED_ETI_TEST_ACCOUNT_2 is ", OLD_BLOCKED_ETI_TEST_ACCOUNT_2);
console.log("OLD_BLOCKED_ETI_TEST_ACCOUNT_3 is ", OLD_BLOCKED_ETI_TEST_ACCOUNT_3);
console.log("OLD_BLOCKED_ETI_TEST_ACCOUNT_4 is ", OLD_BLOCKED_ETI_TEST_ACCOUNT_4);
console.log("OLD_BLOCKED_ETI_TEST_ACCOUNT_5 is ", OLD_BLOCKED_ETI_TEST_ACCOUNT_5);
console.log("OLD_BLOCKED_ETI_TEST_ACCOUNT_6 is ", OLD_BLOCKED_ETI_TEST_ACCOUNT_6);
console.log("OLD_BLOCKED_ETI_TEST_ACCOUNT_7 is ", OLD_BLOCKED_ETI_TEST_ACCOUNT_7);

assert.equal(web3.utils.fromWei(OLD_BLOCKED_ETI_TEST_ACCOUNT, "ether" ), 0);
assert.equal(web3.utils.fromWei(OLD_BLOCKED_ETI_TEST_ACCOUNT_2, "ether" ), 0);
assert.equal(web3.utils.fromWei(OLD_BLOCKED_ETI_TEST_ACCOUNT_3, "ether" ), 0);
assert.equal(web3.utils.fromWei(OLD_BLOCKED_ETI_TEST_ACCOUNT_4, "ether" ), 0);
assert.equal(web3.utils.fromWei(OLD_BLOCKED_ETI_TEST_ACCOUNT_5, "ether" ), 0);
assert.equal(web3.utils.fromWei(OLD_BLOCKED_ETI_TEST_ACCOUNT_6, "ether" ), 0);
assert.equal(web3.utils.fromWei(OLD_BLOCKED_ETI_TEST_ACCOUNT_7, "ether" ), 0);

await createproposal(test_account, EXPECTED_FIRST_DISEASE_HASH, "Title 1 Malaria", "Description 1", IPFS1, "", "");
await createproposal(test_account2, EXPECTED_FIRST_DISEASE_HASH, "Title 2 Malaria", "Description 2", IPFS2, "", "");
await createproposal(test_account3, EXPECTED_FIRST_DISEASE_HASH, "Title 3 Malaria", "Description 3", IPFS3, "", "");
await createproposal(test_account4, EXPECTED_FIRST_DISEASE_HASH, "Title 4 Malaria", "Description 4", IPFS4, "", "");
await createproposal(test_account5, EXPECTED_FIRST_DISEASE_HASH, "Title 5 Malaria", "Description 5", IPFS5, "", "");
await createproposal(test_account5, EXPECTED_FIRST_DISEASE_HASH, "Title 6 Malaria", "Description 6", IPFS6, IPFS7, "");
await createproposal(test_account5, EXPECTED_FIRST_DISEASE_HASH, "Title 7 Malaria", "Description 7", IPFS7, "", IPFS8);

// should fail to duplicate a proposal whose raw_release_hash and disease_hash have already been stored into the system:
await should_fail_propose(test_account, EXPECTED_FIRST_DISEASE_HASH, "Title 8 Malaria", "Description 8", IPFS1, "", "");

let IPFS1_WITH_FIRTDISEASEHASH = get_expected_keccak256_hash_two(IPFS1, EXPECTED_FIRST_DISEASE_HASH);
let IPFS2_WITH_FIRTDISEASEHASH = get_expected_keccak256_hash_two(IPFS2, EXPECTED_FIRST_DISEASE_HASH);
let IPFS3_WITH_FIRTDISEASEHASH = get_expected_keccak256_hash_two(IPFS3, EXPECTED_FIRST_DISEASE_HASH);
let IPFS4_WITH_FIRTDISEASEHASH = get_expected_keccak256_hash_two(IPFS4, EXPECTED_FIRST_DISEASE_HASH);
let IPFS5_WITH_FIRTDISEASEHASH = get_expected_keccak256_hash_two(IPFS5, EXPECTED_FIRST_DISEASE_HASH);
let IPFS6_WITH_FIRTDISEASEHASH = get_expected_keccak256_hash_two(IPFS6, EXPECTED_FIRST_DISEASE_HASH);
let IPFS7_WITH_FIRTDISEASEHASH = get_expected_keccak256_hash_two(IPFS7, EXPECTED_FIRST_DISEASE_HASH);

await votebyhash(test_account2, IPFS1_WITH_FIRTDISEASEHASH, true, '50');
await votebyhash(test_account3, IPFS1_WITH_FIRTDISEASEHASH, true, '100');
await votebyhash(test_account4, IPFS1_WITH_FIRTDISEASEHASH, false, '50');
await votebyhash(test_account5, IPFS1_WITH_FIRTDISEASEHASH, true, '500');
await votebyhash(test_account6, IPFS1_WITH_FIRTDISEASEHASH, false, '350');
await votebyhash(test_account7, IPFS1_WITH_FIRTDISEASEHASH, false, '80');

//await should_fail_votebyhash(test_account2, IPFS2_WITH_FIRTDISEASEHASH, true, '5'); // should fail vote twice on same proposal
await votebyhash(test_account3, IPFS2_WITH_FIRTDISEASEHASH, false, '100');
await votebyhash(test_account4, IPFS2_WITH_FIRTDISEASEHASH, true, '500');
await votebyhash(test_account5, IPFS2_WITH_FIRTDISEASEHASH, false, '500');
await votebyhash(test_account6, IPFS2_WITH_FIRTDISEASEHASH, true, '35');
await votebyhash(test_account7, IPFS2_WITH_FIRTDISEASEHASH, false, '800');

await votebyhash(test_account2, IPFS3_WITH_FIRTDISEASEHASH, true, '5');
//await should_fail_votebyhash(test_account3, IPFS3_WITH_FIRTDISEASEHASH, false, '100');  // should fail vote twice on same proposal
await votebyhash(test_account4, IPFS3_WITH_FIRTDISEASEHASH, true, '490');
await votebyhash(test_account5, IPFS3_WITH_FIRTDISEASEHASH, false, '600');
await votebyhash(test_account6, IPFS3_WITH_FIRTDISEASEHASH, true, '35');
await votebyhash(test_account7, IPFS3_WITH_FIRTDISEASEHASH, true, '60');

await votebyhash(test_account2, IPFS4_WITH_FIRTDISEASEHASH, true, '5');
await votebyhash(test_account3, IPFS4_WITH_FIRTDISEASEHASH, true, '10');
//await should_fail_votebyhash(test_account4, IPFS4_WITH_FIRTDISEASEHASH, true, '50');  // should fail vote twice on same proposal
await votebyhash(test_account5, IPFS4_WITH_FIRTDISEASEHASH, true, '50');
await votebyhash(test_account6, IPFS4_WITH_FIRTDISEASEHASH, true, '35');
await votebyhash(test_account7, IPFS4_WITH_FIRTDISEASEHASH, true, '60');

// should fail to vote with incorrect amount for a proposal:
await should_fail_votebyhash(test_account7, IPFS4_WITH_FIRTDISEASEHASH, true, '500000');
await should_fail_votebyhash(test_account3, IPFS4_WITH_FIRTDISEASEHASH, true, '-500');


// CHECK GLOBAL VARIBALES

let _proposal1 = await EticaReleaseVotingTestInstance.propsdatas(IPFS1_WITH_FIRTDISEASEHASH);
assert.equal(_proposal1.nbvoters, '7', 'Proposal1 should have 7 nbvoters');

let _proposal2 = await EticaReleaseVotingTestInstance.propsdatas(IPFS2_WITH_FIRTDISEASEHASH);
assert.equal(_proposal2.nbvoters, '6', 'Proposal2 should have 6 nbvoters');

let _proposal3 = await EticaReleaseVotingTestInstance.propsdatas(IPFS3_WITH_FIRTDISEASEHASH);
assert.equal(_proposal3.nbvoters, '6', 'Proposal3 should have 6 nbvoters');

let _proposal4 = await EticaReleaseVotingTestInstance.propsdatas(IPFS4_WITH_FIRTDISEASEHASH);
assert.equal(_proposal4.nbvoters, '6', 'Proposal4 should have 6 nbvoters');

let _proposal5 = await EticaReleaseVotingTestInstance.propsdatas(IPFS5_WITH_FIRTDISEASEHASH);
assert.equal(_proposal5.nbvoters, '1', 'Proposal5 should have 1 nbvoters');

let _proposal6 = await EticaReleaseVotingTestInstance.propsdatas(IPFS6_WITH_FIRTDISEASEHASH);
assert.equal(_proposal6.nbvoters, '1', 'Proposal6 should have 1 nbvoters');

let _proposal7 = await EticaReleaseVotingTestInstance.propsdatas(IPFS7_WITH_FIRTDISEASEHASH);
assert.equal(_proposal7.nbvoters, '1', 'Proposal7 should have 1 nbvoters');

console.log('----------------->   PROPOSALS NBVOTERS CHECKED  <-----------------');


assert.equal(web3.utils.fromWei(_proposal1.forvotes.toString()), '660', 'Proposal1 should have 660 forvotes');
assert.equal(web3.utils.fromWei(_proposal1.againstvotes.toString()), '480', 'Proposal1 should have 480 against votes');

assert.equal(web3.utils.fromWei(_proposal2.forvotes.toString()), '545', 'Proposal2 should have 545 forvotes');
assert.equal(web3.utils.fromWei(_proposal2.againstvotes.toString()), '1400', 'Proposal1 should have 1400 against votes');

assert.equal(web3.utils.fromWei(_proposal3.forvotes.toString()), '600', 'Proposal3 should have 600 forvotes');
assert.equal(web3.utils.fromWei(_proposal3.againstvotes.toString()), '600', 'Proposal3 should have 500 against votes');

assert.equal(web3.utils.fromWei(_proposal4.forvotes.toString()), '170', 'Proposal4 should have 170 forvotes');
assert.equal(web3.utils.fromWei(_proposal4.againstvotes.toString()), '0', 'Proposal4 should have 0 against votes');

console.log('----------------->   PROPOSALS FORVOTES AND AGAINTSVOTES CHECKED  <-----------------');

assert.equal(_proposal1.prestatus, '1', 'Proposal1 prestatus should be Accepted');
assert.equal(_proposal2.prestatus, '0', 'Proposal2 prestatus should be Rejected');
assert.equal(_proposal3.prestatus, '0', 'Proposal3 prestatus should be Rejected');
assert.equal(_proposal4.prestatus, '1', 'Proposal4 prestatus should be Accepted');
assert.equal(_proposal5.prestatus, '3', 'Proposal5 prestatus should be SingleVoter');
assert.equal(_proposal6.prestatus, '3', 'Proposal6 prestatus should be SingleVoter');
assert.equal(_proposal7.prestatus, '3', 'Proposal7 prestatus should be SingleVoter');

console.log('----------------->   PROPOSALS PRESTATUS CHECKED  <-----------------');

assert.equal(_proposal1.status, '2', 'Proposal1 status should be Pending');
assert.equal(_proposal2.status, '2', 'Proposal2 status should be Pending');
assert.equal(_proposal3.status, '2', 'Proposal3 status should be Pending');
assert.equal(_proposal4.status, '2', 'Proposal4 status should be Pending');
assert.equal(_proposal5.status, '2', 'Proposal5 status should be Pending');
assert.equal(_proposal6.status, '2', 'Proposal6 status should be Pending');
assert.equal(_proposal7.status, '2', 'Proposal7 status should be Pending');

console.log('----------------->   PROPOSALS STATUS CHECKED  <-----------------');

assert.equal(web3.utils.fromWei(_proposal1.lastcuration_weight, "ether" ), '4620', 'Proposal1 should have a lastcuration_weight of 4620');
assert.equal(web3.utils.fromWei(_proposal2.lastcuration_weight, "ether" ), '8400', 'Proposal2 should have a lastcuration_weight of 8400');
assert.equal(web3.utils.fromWei(_proposal3.lastcuration_weight, "ether" ), '0', 'Proposal3 should have a lastcuration_weight of 0');
assert.equal(web3.utils.fromWei(_proposal4.lastcuration_weight, "ether" ), '1020', 'Proposal4 should have a lastcuration_weight of 1020');
assert.equal(web3.utils.fromWei(_proposal5.lastcuration_weight, "ether" ), '10', 'Proposal5 should have a lastcuration_weight of 10');
assert.equal(web3.utils.fromWei(_proposal6.lastcuration_weight, "ether" ), '10', 'Proposal6 should have a lastcuration_weight of 10');
assert.equal(web3.utils.fromWei(_proposal7.lastcuration_weight, "ether" ), '10', 'Proposal7 should have a lastcuration_weight of 10');

console.log('----------------->   PROPOSALS LASTCURATIONWEIGHT CHECKED  <-----------------');

assert.equal(web3.utils.fromWei(_proposal1.lasteditor_weight, "ether" ), '4620', 'Proposal1 should have a lasteditor_weight of 4620');
assert.equal(web3.utils.fromWei(_proposal2.lasteditor_weight, "ether" ), '0', 'Proposal2 should have a lasteditor_weight of 8400');
assert.equal(web3.utils.fromWei(_proposal3.lasteditor_weight, "ether" ), '0', 'Proposal3 should have a lasteditor_weight of 0');
assert.equal(web3.utils.fromWei(_proposal4.lasteditor_weight, "ether" ), '1020', 'Proposal4 should have a lasteditor_weight of 1020');
assert.equal(web3.utils.fromWei(_proposal5.lasteditor_weight, "ether" ), '10', 'Proposal5 should have a lasteditor_weight of 10');
assert.equal(web3.utils.fromWei(_proposal6.lasteditor_weight, "ether" ), '10', 'Proposal6 should have a lasteditor_weight of 10');
assert.equal(web3.utils.fromWei(_proposal7.lasteditor_weight, "ether" ), '10', 'Proposal7 should have a lasteditor_weight of 10');

console.log('----------------->   PROPOSALS LASTEDITORWEIGHT CHECKED  <-----------------');

assert.equal(_proposal1.slashingratio.toNumber(), 15, 'Proposal1 should have a slashingratio of 0.15');
assert.equal(_proposal2.slashingratio.toNumber(), 43, 'Proposal2 should have a slashingratio of 0.43');
assert.equal(_proposal3.slashingratio.toNumber(), 0, 'Proposal3 should have a slashingratio of 0');
assert.equal(_proposal4.slashingratio.toNumber(), 100, 'Proposal4 should have a slashingratio of 1');
assert.equal(_proposal5.slashingratio.toNumber(), 100, 'Proposal5 should have a slashingratio of 1');
assert.equal(_proposal6.slashingratio.toNumber(), 100, 'Proposal6 should have a slashingratio of 1');
assert.equal(_proposal7.slashingratio.toNumber(), 100, 'Proposal7 should have a slashingratio of 1');

console.log('----------------->   PROPOSALS SLASHINGRATIO CHECKED  <-----------------');


// Retrieve BLOCKEDETICAS:
let NEW_BLOCKED_ETI_TEST_ACCOUNT = await EticaReleaseVotingTestInstance.blockedeticas(test_account.address);
let NEW_BLOCKED_ETI_TEST_ACCOUNT_2 = await EticaReleaseVotingTestInstance.blockedeticas(test_account2.address);
let NEW_BLOCKED_ETI_TEST_ACCOUNT_3 = await EticaReleaseVotingTestInstance.blockedeticas(test_account3.address);
let NEW_BLOCKED_ETI_TEST_ACCOUNT_4 = await EticaReleaseVotingTestInstance.blockedeticas(test_account4.address);
let NEW_BLOCKED_ETI_TEST_ACCOUNT_5 = await EticaReleaseVotingTestInstance.blockedeticas(test_account5.address);
let NEW_BLOCKED_ETI_TEST_ACCOUNT_6 = await EticaReleaseVotingTestInstance.blockedeticas(test_account6.address);
let NEW_BLOCKED_ETI_TEST_ACCOUNT_7 = await EticaReleaseVotingTestInstance.blockedeticas(test_account7.address);

console.log("NEW_BLOCKED_ETI_TEST_ACCOUNT is ", web3.utils.fromWei(NEW_BLOCKED_ETI_TEST_ACCOUNT, "ether" ));
console.log("NEW_BLOCKED_ETI_TEST_ACCOUNT_2 is ", web3.utils.fromWei(NEW_BLOCKED_ETI_TEST_ACCOUNT_2, "ether" ));
console.log("NEW_BLOCKED_ETI_TEST_ACCOUNT_3 is ", web3.utils.fromWei(NEW_BLOCKED_ETI_TEST_ACCOUNT_3, "ether" ));
console.log("NEW_BLOCKED_ETI_TEST_ACCOUNT_4 is ", web3.utils.fromWei(NEW_BLOCKED_ETI_TEST_ACCOUNT_4, "ether" ));
console.log("NEW_BLOCKED_ETI_TEST_ACCOUNT_5 is ", web3.utils.fromWei(NEW_BLOCKED_ETI_TEST_ACCOUNT_5, "ether" ));
console.log("NEW_BLOCKED_ETI_TEST_ACCOUNT_6 is ", web3.utils.fromWei(NEW_BLOCKED_ETI_TEST_ACCOUNT_6, "ether" ));
console.log("NEW_BLOCKED_ETI_TEST_ACCOUNT_7 is ", web3.utils.fromWei(NEW_BLOCKED_ETI_TEST_ACCOUNT_7, "ether" ));

assert.equal(web3.utils.fromWei(NEW_BLOCKED_ETI_TEST_ACCOUNT, "ether" ), 10);
assert.equal(web3.utils.fromWei(NEW_BLOCKED_ETI_TEST_ACCOUNT_2, "ether" ), 70);
assert.equal(web3.utils.fromWei(NEW_BLOCKED_ETI_TEST_ACCOUNT_3, "ether" ), 220);
assert.equal(web3.utils.fromWei(NEW_BLOCKED_ETI_TEST_ACCOUNT_4, "ether" ), 1050);
assert.equal(web3.utils.fromWei(NEW_BLOCKED_ETI_TEST_ACCOUNT_5, "ether" ), 1680);
assert.equal(web3.utils.fromWei(NEW_BLOCKED_ETI_TEST_ACCOUNT_6, "ether" ), 455);
assert.equal(web3.utils.fromWei(NEW_BLOCKED_ETI_TEST_ACCOUNT_7, "ether" ), 1000);


// Retrieve General Information of Proposals:
let _general_proposal1 = await EticaReleaseVotingTestInstance.proposals(IPFS1_WITH_FIRTDISEASEHASH);
let _general_proposal2 = await EticaReleaseVotingTestInstance.proposals(IPFS2_WITH_FIRTDISEASEHASH);
let _general_proposal3 = await EticaReleaseVotingTestInstance.proposals(IPFS3_WITH_FIRTDISEASEHASH);
let _general_proposal4 = await EticaReleaseVotingTestInstance.proposals(IPFS4_WITH_FIRTDISEASEHASH);
let _general_proposal5 = await EticaReleaseVotingTestInstance.proposals(IPFS5_WITH_FIRTDISEASEHASH);
let _general_proposal6 = await EticaReleaseVotingTestInstance.proposals(IPFS6_WITH_FIRTDISEASEHASH);
let _general_proposal7 = await EticaReleaseVotingTestInstance.proposals(IPFS7_WITH_FIRTDISEASEHASH);

// assert all proposals are in same Period (not necessary for contract integrity but we assume they are for next steps of Tests)
console.log('_general_proposal1.period_id is', _general_proposal1.period_id.toString());
console.log('_general_proposal7.period_id is', _general_proposal7.period_id.toString());

assert(_general_proposal1.period_id.toString() == _general_proposal7.period_id.toString());


// assert Period's curation_sum and editor_sum values are OK
let _period1  = await EticaReleaseVotingTestInstance.periods(_general_proposal1.period_id);
assert.equal(web3.utils.fromWei(_period1.curation_sum, "ether" ), 14070); // Sum of proposals' curation_weight
assert.equal(web3.utils.fromWei(_period1.editor_sum, "ether" ), 5670); // Sum of proposals' editor_weight

// Should fail to clmpropbyhash too early: 
await should_fail_clmpropbyhash(test_account, IPFS1_WITH_FIRTDISEASEHASH);

// advance time so that clmpropbyhash becomes possible: 
await advanceminutes(DEFAULT_VOTING_TIME);

// Should fail to votebyhash too late:
await should_fail_votebyhash(test_account2, IPFS5_WITH_FIRTDISEASEHASH, true, '20');


OLD_BALANCE_ACCOUNT = await EticaReleaseVotingTestInstance.balanceOf(test_account.address);  
OLD_BALANCE_ACCOUNT_2 = await EticaReleaseVotingTestInstance.balanceOf(test_account2.address);
OLD_BALANCE_ACCOUNT_3 = await EticaReleaseVotingTestInstance.balanceOf(test_account3.address);
OLD_BALANCE_ACCOUNT_4 = await EticaReleaseVotingTestInstance.balanceOf(test_account4.address);
OLD_BALANCE_ACCOUNT_5 = await EticaReleaseVotingTestInstance.balanceOf(test_account5.address);
OLD_BALANCE_ACCOUNT_6 = await EticaReleaseVotingTestInstance.balanceOf(test_account6.address);
OLD_BALANCE_ACCOUNT_7 = await EticaReleaseVotingTestInstance.balanceOf(test_account7.address);
OLD_BALANCE_ACCOUNT_8 = await EticaReleaseVotingTestInstance.balanceOf(test_account8.address);

// should pass
await clmpropbyhash(test_account5, IPFS4_WITH_FIRTDISEASEHASH);
await clmpropbyhash(test_account6, IPFS4_WITH_FIRTDISEASEHASH);
await clmpropbyhash(test_account7, IPFS4_WITH_FIRTDISEASEHASH);

await clmpropbyhash(test_account5, IPFS5_WITH_FIRTDISEASEHASH);



MID_BALANCE_ACCOUNT = await EticaReleaseVotingTestInstance.balanceOf(test_account.address);  
MID_BALANCE_ACCOUNT_2 = await EticaReleaseVotingTestInstance.balanceOf(test_account2.address);
MID_BALANCE_ACCOUNT_3 = await EticaReleaseVotingTestInstance.balanceOf(test_account3.address);
MID_BALANCE_ACCOUNT_4 = await EticaReleaseVotingTestInstance.balanceOf(test_account4.address);
MID_BALANCE_ACCOUNT_5 = await EticaReleaseVotingTestInstance.balanceOf(test_account5.address);
MID_BALANCE_ACCOUNT_6 = await EticaReleaseVotingTestInstance.balanceOf(test_account6.address);
MID_BALANCE_ACCOUNT_7 = await EticaReleaseVotingTestInstance.balanceOf(test_account7.address);
MID_BALANCE_ACCOUNT_8 = await EticaReleaseVotingTestInstance.balanceOf(test_account8.address);


let _effective_reward_acc5 = web3.utils.fromWei(MID_BALANCE_ACCOUNT_5, "ether" ) - web3.utils.fromWei(OLD_BALANCE_ACCOUNT_5, "ether" );
console.log('_effective_acc5 new ETI as REWARD:', _effective_reward_acc5);
// acc5 should have gotten exactly the expected REWARD calculated by get_expected_reward() :
assert.equal( _effective_reward_acc5, 188.6335518176311); // 188.6335518176314 == _expected_reward_acc5_prop_4 + _expected_reward_acc5_prop_5

let _effective_reward_acc6 = web3.utils.fromWei(MID_BALANCE_ACCOUNT_6, "ether" ) - web3.utils.fromWei(OLD_BALANCE_ACCOUNT_6, "ether" );
console.log('_effective_acc6 new ETI as REWARD:', _effective_reward_acc6);
// acc5 should have gotten exactly the expected REWARD calculated by get_expected_reward() :
assert.equal( _effective_reward_acc6, 89.55223880597077); // 89.552238805970149253731343283582‬ == _expected_reward_acc6_prop_4

let _effective_reward_acc7 = web3.utils.fromWei(MID_BALANCE_ACCOUNT_7, "ether" ) - web3.utils.fromWei(OLD_BALANCE_ACCOUNT_7, "ether" );
console.log('_effective_acc7 new ETI as REWARD:', _effective_reward_acc7);
// acc5 should have gotten exactly the expected REWARD calculated by get_expected_reward() :
assert.equal( _effective_reward_acc7, 153.51812366737795); // 153,51812366737739872068230277186‬ == _expected_reward_acc7_prop_4

console.log('MID BALANCES CHECKED');



await clmpropbyhash(test_account, IPFS1_WITH_FIRTDISEASEHASH);
await clmpropbyhash(test_account2, IPFS1_WITH_FIRTDISEASEHASH);
await clmpropbyhash(test_account3, IPFS1_WITH_FIRTDISEASEHASH);
await clmpropbyhash(test_account4, IPFS1_WITH_FIRTDISEASEHASH);
await clmpropbyhash(test_account5, IPFS1_WITH_FIRTDISEASEHASH);
await clmpropbyhash(test_account6, IPFS1_WITH_FIRTDISEASEHASH);
await clmpropbyhash(test_account7, IPFS1_WITH_FIRTDISEASEHASH);

// next line should fail:
await should_fail_clmpropbyhash(test_account, IPFS2_WITH_FIRTDISEASEHASH);

await clmpropbyhash(test_account2, IPFS2_WITH_FIRTDISEASEHASH);
await clmpropbyhash(test_account3, IPFS2_WITH_FIRTDISEASEHASH);
await clmpropbyhash(test_account4, IPFS2_WITH_FIRTDISEASEHASH);
await clmpropbyhash(test_account5, IPFS2_WITH_FIRTDISEASEHASH);
await clmpropbyhash(test_account6, IPFS2_WITH_FIRTDISEASEHASH);
await clmpropbyhash(test_account7, IPFS2_WITH_FIRTDISEASEHASH);



await clmpropbyhash(test_account2, IPFS3_WITH_FIRTDISEASEHASH);
await clmpropbyhash(test_account3, IPFS3_WITH_FIRTDISEASEHASH);
await clmpropbyhash(test_account4, IPFS3_WITH_FIRTDISEASEHASH);
await clmpropbyhash(test_account5, IPFS3_WITH_FIRTDISEASEHASH);
await clmpropbyhash(test_account6, IPFS3_WITH_FIRTDISEASEHASH);
await clmpropbyhash(test_account7, IPFS3_WITH_FIRTDISEASEHASH);



await clmpropbyhash(test_account2, IPFS4_WITH_FIRTDISEASEHASH);
await clmpropbyhash(test_account3, IPFS4_WITH_FIRTDISEASEHASH);
let contract_balance_before_createdisease2 = await EticaReleaseVotingTestInstance.balanceOf(EticaReleaseVotingTestInstance.address);
console.log('conract balance 2 is', web3.utils.fromWei(contract_balance_before_createdisease2, "ether" ));
await clmpropbyhash(test_account4, IPFS4_WITH_FIRTDISEASEHASH);
// next 3 should fail:
await should_fail_clmpropbyhash(test_account5, IPFS4_WITH_FIRTDISEASEHASH);
await should_fail_clmpropbyhash(test_account6, IPFS4_WITH_FIRTDISEASEHASH);
await should_fail_clmpropbyhash(test_account7, IPFS4_WITH_FIRTDISEASEHASH);


// next 3 should fail:
await should_fail_clmpropbyhash(test_account2, IPFS5_WITH_FIRTDISEASEHASH);
await should_fail_clmpropbyhash(test_account3, IPFS5_WITH_FIRTDISEASEHASH);
await should_fail_clmpropbyhash(test_account4, IPFS5_WITH_FIRTDISEASEHASH);
// next must fail because already called before when calculating middle balances:
await should_fail_clmpropbyhash(test_account5, IPFS5_WITH_FIRTDISEASEHASH);
// next 2 should fail:
await should_fail_clmpropbyhash(test_account6, IPFS5_WITH_FIRTDISEASEHASH);
await should_fail_clmpropbyhash(test_account7, IPFS5_WITH_FIRTDISEASEHASH);




// next 3 should fail:
await should_fail_clmpropbyhash(test_account2, IPFS6_WITH_FIRTDISEASEHASH);
await should_fail_clmpropbyhash(test_account3, IPFS6_WITH_FIRTDISEASEHASH);
await should_fail_clmpropbyhash(test_account4, IPFS6_WITH_FIRTDISEASEHASH);

await clmpropbyhash(test_account5, IPFS6_WITH_FIRTDISEASEHASH);
// next 2 should fail:
await should_fail_clmpropbyhash(test_account6, IPFS6_WITH_FIRTDISEASEHASH);
await should_fail_clmpropbyhash(test_account7, IPFS6_WITH_FIRTDISEASEHASH);




// next 3 should fail:
await should_fail_clmpropbyhash(test_account2, IPFS7_WITH_FIRTDISEASEHASH);
await should_fail_clmpropbyhash(test_account3, IPFS7_WITH_FIRTDISEASEHASH);
await should_fail_clmpropbyhash(test_account4, IPFS7_WITH_FIRTDISEASEHASH);
// should pass:
await clmpropbyhash(test_account5, IPFS7_WITH_FIRTDISEASEHASH);
// next 2 should fail:
await should_fail_clmpropbyhash(test_account6, IPFS7_WITH_FIRTDISEASEHASH);
await should_fail_clmpropbyhash(test_account7, IPFS7_WITH_FIRTDISEASEHASH);

let IPFS_IDONTEXIST_DISEASEHASH = randomipfs();

// next 3 should fail:
await should_fail_clmpropbyhash(test_account4, IPFS2_WITH_FIRTDISEASEHASH);
await should_fail_clmpropbyhash(test_account5, IPFS7_WITH_FIRTDISEASEHASH);
await should_fail_clmpropbyhash(test_account5, IPFS_IDONTEXIST_DISEASEHASH);


NEW_BALANCE_ACCOUNT = await EticaReleaseVotingTestInstance.balanceOf(test_account.address);  
NEW_BALANCE_ACCOUNT_2 = await EticaReleaseVotingTestInstance.balanceOf(test_account2.address);
NEW_BALANCE_ACCOUNT_3 = await EticaReleaseVotingTestInstance.balanceOf(test_account3.address);
NEW_BALANCE_ACCOUNT_4 = await EticaReleaseVotingTestInstance.balanceOf(test_account4.address);
NEW_BALANCE_ACCOUNT_5 = await EticaReleaseVotingTestInstance.balanceOf(test_account5.address);
NEW_BALANCE_ACCOUNT_6 = await EticaReleaseVotingTestInstance.balanceOf(test_account6.address);
NEW_BALANCE_ACCOUNT_7 = await EticaReleaseVotingTestInstance.balanceOf(test_account7.address);
NEW_BALANCE_ACCOUNT_8 = await EticaReleaseVotingTestInstance.balanceOf(test_account8.address);


// ACCOUNT 1:
let _expected_reward_acc1_prop_1 = await get_expected_reward(test_account, IPFS1_WITH_FIRTDISEASEHASH);
let _expected_total_reward_acc1 =  _expected_reward_acc1_prop_1;
console.log('_expected_reward_acc1_prop1 is', _expected_reward_acc1_prop_1);
console.log('_expected_total_reward_acc1 is', _expected_total_reward_acc1);

let _effective_reward_acc1 = web3.utils.fromWei(NEW_BALANCE_ACCOUNT, "ether" ) - web3.utils.fromWei(MID_BALANCE_ACCOUNT, "ether" );
console.log('_effective_acc1 new ETI as REWARD:', _effective_reward_acc1);
// acc5 should have gotten exactly the expected REWARD calculated by get_expected_reward() :
assert.equal( _effective_reward_acc1, _expected_total_reward_acc1); // 188.6335518176314 == _expected_reward_acc5_prop_4 + _expected_reward_acc5_prop_5


// --------------- ACCOUNT 2 -------------------  //

let _expected_reward_acc2_prop_1 = await get_expected_reward(test_account2, IPFS1_WITH_FIRTDISEASEHASH);

let _expected_reward_acc2_prop_2 = await get_expected_reward(test_account2, IPFS2_WITH_FIRTDISEASEHASH);

let _expected_reward_acc2_prop_3 = await get_expected_reward(test_account2, IPFS3_WITH_FIRTDISEASEHASH);

let _expected_reward_acc2_prop_4 = await get_expected_reward(test_account2, IPFS4_WITH_FIRTDISEASEHASH);

let _expected_reward_acc2_prop_5 = await get_expected_reward(test_account2, IPFS5_WITH_FIRTDISEASEHASH);

let _expected_reward_acc2_prop_6 = await get_expected_reward(test_account2, IPFS6_WITH_FIRTDISEASEHASH);

let _expected_reward_acc2_prop_7 = await get_expected_reward(test_account2, IPFS7_WITH_FIRTDISEASEHASH);


let _expected_total_reward_acc2 =  _expected_reward_acc2_prop_1 + _expected_reward_acc2_prop_2 + _expected_reward_acc2_prop_3 + _expected_reward_acc2_prop_4 + _expected_reward_acc2_prop_5 + _expected_reward_acc2_prop_6 + _expected_reward_acc2_prop_7;
// console.log('_expected_total_reward_acc2 is', _expected_total_reward_acc2);
// ---> because of significant figure issues we remove last 2 figures:
_expected_total_reward_acc2 = _expected_total_reward_acc2.toString();
_expected_total_reward_acc2 = _expected_total_reward_acc2.substring(0, _expected_total_reward_acc2.length - 2);


let _effective_reward_acc2 = web3.utils.fromWei(NEW_BALANCE_ACCOUNT_2, "ether" ) - web3.utils.fromWei(MID_BALANCE_ACCOUNT_2, "ether" );
//console.log('_effective_acc2 new ETI as REWARD:', _effective_reward_acc2);
// ---> because of significant figure issues we remove last 2 figures:
_effective_reward_acc2 = _effective_reward_acc2.toString();
_effective_reward_acc2 = _effective_reward_acc2.substring(0, _effective_reward_acc2.length - 2);

// acc5 should have gotten exactly the expected REWARD calculated by get_expected_reward() :
assert.equal( _effective_reward_acc2, _expected_total_reward_acc2); // 188.6335518176314 == _expected_reward_acc5_prop_4 + _expected_reward_acc5_prop_5

// --------------- ACCOUNT 2 -------------------  //


// --------------- ACCOUNT 3 -------------------  //

let _expected_reward_acc3_prop_1 = await get_expected_reward(test_account3, IPFS1_WITH_FIRTDISEASEHASH);

let _expected_reward_acc3_prop_2 = await get_expected_reward(test_account3, IPFS2_WITH_FIRTDISEASEHASH);

let _expected_reward_acc3_prop_3 = await get_expected_reward(test_account3, IPFS3_WITH_FIRTDISEASEHASH);

let _expected_reward_acc3_prop_4 = await get_expected_reward(test_account3, IPFS4_WITH_FIRTDISEASEHASH);

let _expected_reward_acc3_prop_5 = await get_expected_reward(test_account3, IPFS5_WITH_FIRTDISEASEHASH);

let _expected_reward_acc3_prop_6 = await get_expected_reward(test_account3, IPFS6_WITH_FIRTDISEASEHASH);

let _expected_reward_acc3_prop_7 = await get_expected_reward(test_account3, IPFS7_WITH_FIRTDISEASEHASH);


let _expected_total_reward_acc3 =  _expected_reward_acc3_prop_1 + _expected_reward_acc3_prop_2 + _expected_reward_acc3_prop_3 + _expected_reward_acc3_prop_4 + _expected_reward_acc3_prop_5 + _expected_reward_acc3_prop_6 + _expected_reward_acc3_prop_7;
// console.log('_expected_total_reward_acc3 is', _expected_total_reward_acc3);
// ---> because of significant figure issues we remove last 2 figures:
_expected_total_reward_acc3 = _expected_total_reward_acc3.toString();
_expected_total_reward_acc3 = _expected_total_reward_acc3.substring(0, _expected_total_reward_acc3.length - 2);


let _effective_reward_acc3 = web3.utils.fromWei(NEW_BALANCE_ACCOUNT_3, "ether" ) - web3.utils.fromWei(MID_BALANCE_ACCOUNT_3, "ether" );
//console.log('_effective_acc3 new ETI as REWARD:', _effective_reward_acc3);
// ---> because of significant figure issues we remove last 2 figures:
_effective_reward_acc3 = _effective_reward_acc3.toString();
_effective_reward_acc3 = _effective_reward_acc3.substring(0, _effective_reward_acc3.length - 3);

// acc3 should have gotten exactly the expected REWARD calculated by get_expected_reward() :
assert.equal( _effective_reward_acc3, _expected_total_reward_acc3); // 188.6335518176314 == _expected_reward_acc5_prop_4 + _expected_reward_acc5_prop_5

// --------------- ACCOUNT 3 -------------------  //

// --------------- ACCOUNT 4 -------------------  //

let _expected_reward_acc4_prop_1 = await get_expected_reward(test_account4, IPFS1_WITH_FIRTDISEASEHASH);

let _expected_reward_acc4_prop_2 = await get_expected_reward(test_account4, IPFS2_WITH_FIRTDISEASEHASH);

let _expected_reward_acc4_prop_3 = await get_expected_reward(test_account4, IPFS3_WITH_FIRTDISEASEHASH);

let _expected_reward_acc4_prop_4 = await get_expected_reward(test_account4, IPFS4_WITH_FIRTDISEASEHASH);

let _expected_reward_acc4_prop_5 = await get_expected_reward(test_account4, IPFS5_WITH_FIRTDISEASEHASH);

let _expected_reward_acc4_prop_6 = await get_expected_reward(test_account4, IPFS6_WITH_FIRTDISEASEHASH);

let _expected_reward_acc4_prop_7 = await get_expected_reward(test_account4, IPFS7_WITH_FIRTDISEASEHASH);


let _expected_total_reward_acc4 =  _expected_reward_acc4_prop_1 + _expected_reward_acc4_prop_2 + _expected_reward_acc4_prop_3 + _expected_reward_acc4_prop_4 + _expected_reward_acc4_prop_5 + _expected_reward_acc4_prop_6 + _expected_reward_acc4_prop_7;
// console.log('_expected_total_reward_acc3 is', _expected_total_reward_acc3);
// ---> because of significant figure issues we remove last 2 figures:
_expected_total_reward_acc4 = _expected_total_reward_acc4.toString();
_expected_total_reward_acc4 = _expected_total_reward_acc4.substring(0, _expected_total_reward_acc4.length - 3);


let _effective_reward_acc4 = web3.utils.fromWei(NEW_BALANCE_ACCOUNT_4, "ether" ) - web3.utils.fromWei(MID_BALANCE_ACCOUNT_4, "ether" );
//console.log('_effective_acc4 new ETI as REWARD:', _effective_reward_acc4);
// ---> because of significant figure issues we remove last 2 figures:
_effective_reward_acc4 = _effective_reward_acc4.toString();
_effective_reward_acc4 = _effective_reward_acc4.substring(0, _effective_reward_acc4.length - 2);

// acc4 should have gotten exactly the expected REWARD calculated by get_expected_reward() :
assert.equal( _effective_reward_acc4, _expected_total_reward_acc4); // 188.6335518176314 == _expected_reward_acc5_prop_4 + _expected_reward_acc5_prop_5

// --------------- ACCOUNT 4 -------------------  //


// --------------- ACCOUNT 5 -------------------  //

let _expected_reward_acc5_prop_1 = await get_expected_reward(test_account5, IPFS1_WITH_FIRTDISEASEHASH);

let _expected_reward_acc5_prop_2 = await get_expected_reward(test_account5, IPFS2_WITH_FIRTDISEASEHASH);

let _expected_reward_acc5_prop_3 = await get_expected_reward(test_account5, IPFS3_WITH_FIRTDISEASEHASH);

//let _expected_reward_acc5_prop_4 = await get_expected_reward(test_account5, IPFS4_WITH_FIRTDISEASEHASH); Already done

//let _expected_reward_acc5_prop_5 = await get_expected_reward(test_account5, IPFS5_WITH_FIRTDISEASEHASH); Already done

let _expected_reward_acc5_prop_6 = await get_expected_reward(test_account5, IPFS6_WITH_FIRTDISEASEHASH);

let _expected_reward_acc5_prop_7 = await get_expected_reward(test_account5, IPFS7_WITH_FIRTDISEASEHASH);


let _expected_total_reward_acc5 =  _expected_reward_acc5_prop_1 + _expected_reward_acc5_prop_2 + _expected_reward_acc5_prop_3 + _expected_reward_acc5_prop_6 + _expected_reward_acc5_prop_7;
// console.log('_expected_total_reward_acc5 is', _expected_total_reward_acc5);
// ---> because of significant figure issues we remove last 2 figures:
_expected_total_reward_acc5 = _expected_total_reward_acc5.toString();
_expected_total_reward_acc5 = _expected_total_reward_acc5.substring(0, _expected_total_reward_acc5.length - 2);


_effective_reward_acc5 = web3.utils.fromWei(NEW_BALANCE_ACCOUNT_5, "ether" ) - web3.utils.fromWei(MID_BALANCE_ACCOUNT_5, "ether" );
//console.log('_effective_acc5 new ETI as REWARD:', _effective_reward_acc5);
// ---> because of significant figure issues we remove last 2 figures:
_effective_reward_acc5 = _effective_reward_acc5.toString();
_effective_reward_acc5 = _effective_reward_acc5.substring(0, _effective_reward_acc5.length - 2);

// acc4 should have gotten exactly the expected REWARD calculated by get_expected_reward() :
assert.equal( _effective_reward_acc5, _expected_total_reward_acc5); // 188.6335518176314 == _expected_reward_acc5_prop_4 + _expected_reward_acc5_prop_5

// --------------- ACCOUNT 5 -------------------  //

// --------------- ACCOUNT 6 -------------------  //

let _expected_reward_acc6_prop_1 = await get_expected_reward(test_account6, IPFS1_WITH_FIRTDISEASEHASH);

let _expected_reward_acc6_prop_2 = await get_expected_reward(test_account6, IPFS2_WITH_FIRTDISEASEHASH);

let _expected_reward_acc6_prop_3 = await get_expected_reward(test_account6, IPFS3_WITH_FIRTDISEASEHASH);

//let _expected_reward_acc5_prop_4 = await get_expected_reward(test_account5, IPFS4_WITH_FIRTDISEASEHASH); Already done

let _expected_reward_acc6_prop_5 = await get_expected_reward(test_account6, IPFS5_WITH_FIRTDISEASEHASH);

let _expected_reward_acc6_prop_6 = await get_expected_reward(test_account6, IPFS6_WITH_FIRTDISEASEHASH);

let _expected_reward_acc6_prop_7 = await get_expected_reward(test_account6, IPFS7_WITH_FIRTDISEASEHASH);


let _expected_total_reward_acc6 =  _expected_reward_acc6_prop_1 + _expected_reward_acc6_prop_2 + _expected_reward_acc6_prop_3 + _expected_reward_acc6_prop_5 + _expected_reward_acc6_prop_6 + _expected_reward_acc6_prop_7;
// console.log('_expected_total_reward_acc6 is', _expected_total_reward_acc6);
// ---> because of significant figure issues we remove last 2 figures:
_expected_total_reward_acc6 = _expected_total_reward_acc6.toString();
_expected_total_reward_acc6 = _expected_total_reward_acc6.substring(0, _expected_total_reward_acc6.length - 2);


_effective_reward_acc6 = web3.utils.fromWei(NEW_BALANCE_ACCOUNT_6, "ether" ) - web3.utils.fromWei(MID_BALANCE_ACCOUNT_6, "ether" );
//console.log('_effective_acc6 new ETI as REWARD:', _effective_reward_acc6);
// ---> because of significant figure issues we remove last 2 figures:
_effective_reward_acc6 = _effective_reward_acc6.toString();
_effective_reward_acc6 = _effective_reward_acc6.substring(0, _effective_reward_acc6.length - 2);

// acc6 should have gotten exactly the expected REWARD calculated by get_expected_reward() :
assert.equal( _effective_reward_acc6, _expected_total_reward_acc6); // 188.6335518176314 == _expected_reward_acc5_prop_4 + _expected_reward_acc5_prop_5

// --------------- ACCOUNT 6 -------------------  //


// --------------- ACCOUNT 7 -------------------  //

let _expected_reward_acc7_prop_1 = await get_expected_reward(test_account7, IPFS1_WITH_FIRTDISEASEHASH);

let _expected_reward_acc7_prop_2 = await get_expected_reward(test_account7, IPFS2_WITH_FIRTDISEASEHASH);

let _expected_reward_acc7_prop_3 = await get_expected_reward(test_account7, IPFS3_WITH_FIRTDISEASEHASH);

//let _expected_reward_acc7_prop_4 = await get_expected_reward(test_account7, IPFS4_WITH_FIRTDISEASEHASH); Already done

let _expected_reward_acc7_prop_5 = await get_expected_reward(test_account7, IPFS5_WITH_FIRTDISEASEHASH);

let _expected_reward_acc7_prop_6 = await get_expected_reward(test_account7, IPFS6_WITH_FIRTDISEASEHASH);

let _expected_reward_acc7_prop_7 = await get_expected_reward(test_account7, IPFS7_WITH_FIRTDISEASEHASH);


let _expected_total_reward_acc7 =  _expected_reward_acc7_prop_1 + _expected_reward_acc7_prop_2 + _expected_reward_acc7_prop_3 + _expected_reward_acc7_prop_5 + _expected_reward_acc7_prop_6 + _expected_reward_acc7_prop_7;
// console.log('_expected_total_reward_acc7 is', _expected_total_reward_acc7);
// ---> because of significant figure issues we remove last 2 figures:
_expected_total_reward_acc7 = _expected_total_reward_acc7.toString();
_expected_total_reward_acc7 = _expected_total_reward_acc7.substring(0, _expected_total_reward_acc7.length - 1);


_effective_reward_acc7 = web3.utils.fromWei(NEW_BALANCE_ACCOUNT_7, "ether" ) - web3.utils.fromWei(MID_BALANCE_ACCOUNT_7, "ether" );
//console.log('_effective_acc7 new ETI as REWARD:', _effective_reward_acc7);
// ---> because of significant figure issues we remove last 2 figures:
_effective_reward_acc7 = _effective_reward_acc7.toString();
_effective_reward_acc7 = _effective_reward_acc7.substring(0, _effective_reward_acc7.length - 2);

// acc6 should have gotten exactly the expected REWARD calculated by get_expected_reward() :
assert.equal( _effective_reward_acc7, _expected_total_reward_acc7); // 188.6335518176314 == _expected_reward_acc5_prop_4 + _expected_reward_acc5_prop_5

// --------------- ACCOUNT 7 -------------------  //


/*
assert.equal(web3.utils.fromWei(NEW_BALANCE_ACCOUNT, "ether" ) - web3.utils.fromWei(MID_BALANCE_ACCOUNT, "ether" ),'6000');
assert.equal(web3.utils.fromWei(NEW_BALANCE_ACCOUNT_2, "ether" ) - web3.utils.fromWei(MID_BALANCE_ACCOUNT_2, "ether" ),'1000');
assert.equal(web3.utils.fromWei(NEW_BALANCE_ACCOUNT_3, "ether" ) - web3.utils.fromWei(MID_BALANCE_ACCOUNT_3, "ether" ),'1000');
assert.equal(web3.utils.fromWei(NEW_BALANCE_ACCOUNT_4, "ether" ) - web3.utils.fromWei(MID_BALANCE_ACCOUNT_4, "ether" ),'1000');
assert.equal(web3.utils.fromWei(NEW_BALANCE_ACCOUNT_5, "ether" ) - web3.utils.fromWei(MID_BALANCE_ACCOUNT_5, "ether" ),'1000');
assert.equal(web3.utils.fromWei(NEW_BALANCE_ACCOUNT_6, "ether" ) - web3.utils.fromWei(MID_BALANCE_ACCOUNT_6, "ether" ),'1000');
assert.equal(web3.utils.fromWei(NEW_BALANCE_ACCOUNT_7, "ether" ) - web3.utils.fromWei(MID_BALANCE_ACCOUNT_7, "ether" ),'1000');*/



  console.log('------------------------------------- ETICA PROTOCOL SUCCESSFULLY PASSED THE TESTS ---------------------------');

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

     // propose should fail:
     async function should_fail_propose(_from_account, _diseasehash, _title, _description, _raw_release_hash, _old_release_hash, _grandparent_hash) {
     
      console.log('should fail to propose proposal with same raw_release_hash and diseasehash (', _raw_release_hash,' - ', _diseasehash, ')combination');
      await truffleAssert.fails(EticaReleaseVotingTestInstance.propose(_diseasehash, _title, _description, _raw_release_hash, _old_release_hash, _grandparent_hash, {from: _from_account.address}));
      console.log('as expected failed to propose proposal with same raw_release_hash and diseasehash (', _raw_release_hash,' - ', _diseasehash, ')combination');
  
    }

         // propose should fail:
         async function should_fail_votebyhash(_from_account, _proposed_release_hash, _choice, _amount) {
     
          console.log('should fail this votebyhash');
          await truffleAssert.fails(EticaReleaseVotingTestInstance.votebyhash(_proposed_release_hash, _choice, web3.utils.toWei(_amount, 'ether'), {from: _from_account.address}));
          console.log('as expected failed to make this votebyhash');
      
        }

        async function should_fail_clmpropbyhash(_from_account, _proposalhash) {

          console.log('should fail to clmpropbyhash');
        await truffleAssert.fails(EticaReleaseVotingTestInstance.clmpropbyhash(_proposalhash, {from: _from_account.address}));
        console.log('as expected failed to clmpropbyhash');

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

   async function get_expected_reward(_from_account, _rawrelease){

    // curation reward:
    let _vote = await EticaReleaseVotingTestInstance.votes(_rawrelease, _from_account.address);
    //console.log('_vote is', _vote);
    
    let _proposal = await EticaReleaseVotingTestInstance.proposals(_rawrelease);
    let _proposaldatas = await EticaReleaseVotingTestInstance.propsdatas(_rawrelease);
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

    let _period = await EticaReleaseVotingTestInstance.periods(_proposal.period_id);
    //console.log('period is', _period);
    let _expected_curation_reward_num = web3.utils.fromWei(_vote.amount, "ether" ) * _proposaldatas.nbvoters.toNumber();
    let _expected_curation_reward_ratio = _expected_curation_reward_num / _period.curation_sum;
    let _expected_curation_reward = _expected_curation_reward_ratio * PERIOD_CURATION_REWARD;

    let _expected_editor_reward = 0; // initialtiaze var


    if(_vote.is_editor && _proposaldatas.status == 1){
    let _expected_editor_reward_ratio = web3.utils.fromWei(_proposaldatas.lasteditor_weight, "ether" ) / _period.editor_sum;
    //console.log('_expected_editor_reward_ratio is', _expected_editor_reward_ratio);
    _expected_editor_reward = _expected_editor_reward_ratio * PERIOD_EDITOR_REWARD;
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


 async function createproposal(_from_account, _diseasehash, _title, _description, _raw_release_hash, _old_release_hash, _grandparent_hash){

  console.log('................................  START CREATION OF NEW PROPOSAL', _title,' ....................... ');

  let oldproposalsCounter = await EticaReleaseVotingTestInstance.proposalsCounter();

  let _from_accountbalancebefore = await EticaReleaseVotingTestInstance.balanceOf(_from_account.address);
  //console.log('_from_account ETI balance before:', web3.utils.fromWei(_from_accountbalancebefore, "ether" ));

  let _from_accountbosomsbefore = await EticaReleaseVotingTestInstance.bosoms(_from_account.address);
  //console.log('_from_account Bosoms before:', web3.utils.fromWei(_from_accountbosomsbefore, "ether" ));

  return EticaReleaseVotingTestInstance.propose(_diseasehash, _title, _description, _raw_release_hash, _old_release_hash, _grandparent_hash, {from: _from_account.address}).then(async function(response){

    let first_proposal = await EticaReleaseVotingTestInstance.proposals(get_expected_keccak256_hash_two(_raw_release_hash, _diseasehash));
    let proposalsCounter = await EticaReleaseVotingTestInstance.proposalsCounter();
    //console.log('THE FIRST PROPOSAL IS:', first_proposal);

    let first_proposal_ipfs = await EticaReleaseVotingTestInstance.propsipfs(get_expected_keccak256_hash_two(_raw_release_hash, _diseasehash));
    //console.log('THE FIRST PROPOSAL IPFS IS:', first_proposal_ipfs);

    let first_proposal_data = await EticaReleaseVotingTestInstance.propsdatas(get_expected_keccak256_hash_two(_raw_release_hash, _diseasehash));
    //console.log('THE FIRST PROPOSAL DATA IS:', first_proposal_data);

    // check Proposal's general information:
    assert.equal(first_proposal.disease_id, EXPECTED_FIRST_DISEASE_HASH, 'First proposal should exist with right disease_id');
    assert(first_proposal.period_id >= 1);
    assert.equal(first_proposal.title, _title, 'First proposal should exist with right name');
    assert.equal(first_proposal.description, _description, 'First proposal should exist with right description');
    assert.equal(proposalsCounter, web3.utils.toBN(oldproposalsCounter).add(web3.utils.toBN('1')).toString(), 'There should be exactly 1 more proposal at this point');

    // check Proposal's IPFS:
    assert.equal(first_proposal_ipfs.raw_release_hash, _raw_release_hash, 'First proposal should exist with right raw_release_hash');
    assert.equal(first_proposal_ipfs.old_release_hash, _old_release_hash, 'First proposal should exist with right old_release_hash');
    assert.equal(first_proposal_ipfs.grandparent_hash, _grandparent_hash, 'First proposal should exist with right grandparent_hash');

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

    console.log('................................  CREATED NEW  PROPOSAL', _title,' WITH SUCCESS ....................... ');
    });
 }


 async function createdisease(_diseasename, _diseasedescription){

  console.log('................................  START CREATION OF NEW DISEASE', _diseasename,' ....................... ');

  // calculate expected hash of disease:
  let _expectedhash = get_expected_keccak256_hash(_diseasename);

  let test_accountbalance_before_createdisease = await EticaReleaseVotingTestInstance.balanceOf(test_account.address);
  let contract_balance_before_createdisease = await EticaReleaseVotingTestInstance.balanceOf(EticaReleaseVotingTestInstance.address);
  //console.log('miner account balance after transfer is', web3.utils.fromWei(miner_accountbalanceafter_transfer, "ether" ));
   
  return EticaReleaseVotingTestInstance.createdisease(_diseasename, _diseasedescription, {from: test_account.address}).then(async function(receipt){
   // check diseasesbyIds and diseasesbyNames mappings insertion:
let hashfromname = await EticaReleaseVotingTestInstance.getdiseasehashbyName(_diseasename);
let indexfromhash = await EticaReleaseVotingTestInstance.diseasesbyIds(_expectedhash);

assert.equal(indexfromhash, TOTAL_DISEASES + 1, '_expectedhash should have an entry in diseasesbyIds with value of total number of diseases created in the protocol');
assert.equal(hashfromname, _expectedhash, 'Disease should have an entry in diseasesbyNames with value of _expectedhash');
   
   
    let new_disease = await EticaReleaseVotingTestInstance.diseases(indexfromhash);
    let diseasesCounter = await EticaReleaseVotingTestInstance.diseasesCounter();
    let test_accountbalance_after_createdisease = await EticaReleaseVotingTestInstance.balanceOf(test_account.address);
    let contract_balance_after_createdisease = await EticaReleaseVotingTestInstance.balanceOf(EticaReleaseVotingTestInstance.address);
//console.log('THE NEW DISEASE IS:', new_disease);
//console.log('NAME OF THE NEW DISEASE IS:', new_disease.name);
//console.log('DESCRIPTION OF THE NEW DISEASE IS:', new_disease.description);
//console.log('NUMBER OF DISEASES IS:', diseasesCounter);

// check diseases mapping insertion:
assert.equal(new_disease.disease_hash, _expectedhash, 'First disease should exists with right diseasehash');
assert.equal(new_disease.name, _diseasename, 'First disease should exists with right name');
assert.equal(new_disease.description, _diseasedescription, 'First disease should exists with right description');

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


 async function votebyhash(_from_account, _proposed_release_hash, _choice, _amount){
  return EticaReleaseVotingTestInstance.votebyhash(_proposed_release_hash, _choice, web3.utils.toWei(_amount, 'ether'), {from: _from_account.address}).then(async function(response){

  console.log('................................  VOTED ON PROPOSAL ', _proposed_release_hash,' THE CHOICE IS', _choice,' and  VOTE AMOUNT IS', _amount,' ....................... ');
  });
 }

 async function clmpropbyhash(_from_account, _proposed_release_hash){
  return EticaReleaseVotingTestInstance.clmpropbyhash(_proposed_release_hash, {from: _from_account.address}).then(async function(response){

  console.log('................................  CLAIMED PROPOSAL ', _proposed_release_hash,' WITH SUCCESS ....................... ');
  });
 }





 });
