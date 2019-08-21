var EticaReleaseProtocolTestPhase2 = artifacts.require("./EticaReleaseProtocolTestPhase2.sol");

var solidityHelper =  require('./solidity-helper');
var miningHelper =  require('./mining-helper-fast');
var networkInterfaceHelper =  require('./network-interface-helper');
const truffleAssert = require('truffle-assertions');
var abi = require('ethereumjs-abi');

console.log('------------------- WELCOME ON THE ETICA PROTOCOL ---------------');
console.log('---------------> DECENTRALISED RESEARCH INDUSTRY <------------------');
console.log('');

var PERIOD_CURATION_REWARD_RATIO = 0; // initialize global variable PERIOD_CURATION_REWARD_RATIO
var PERIOD_EDITOR_REWARD_RATIO = 0; // initialize global variable PERIOD_EDITOR_REWARD_RATIO
var DEFAULT_VOTING_TIME = 0; // initialize global variable DEFAULT_VOTING_TIME
var DEFAULT_REVEALING_TIME = 0;
var REWARD_INTERVAL = 0; // initialize global variable REWARD_INTERVAL

// test suite
contract('EticaReleaseProtocolTestPhase2', function(accounts){
  var EticaReleaseProtocolTestPhase2Instance;
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

  it("testing ETICA PROTOCOL PHASE 2:", async function () {
    console.log('------------------------------------- Starting TESTS OF ETICA PROTOCOL PHASE 2 ---------------------------');

  // wait long enough so that miner_account has mined a block and thus has ETI available, we need a lot of ETI as all tests of this file assume enough ETI and don't deal with mining tests
  //await timeout(150000);
  return EticaReleaseProtocolTestPhase2.deployed().then(function(instance){
  EticaReleaseProtocolTestPhase2Instance = instance;
  return EticaReleaseProtocolTestPhase2Instance.balanceOf(miner_account.address);
  }).then(function(receipt){
  console.log('asserting miner_account has at least 100 000 ETI', web3.utils.fromWei(receipt, "ether" ), 'ETI');
  assert(web3.utils.fromWei(receipt, "ether" ) >= 100000, 'miner_account should have at least 100 000 ETI before starting the tests !');
  }).then(async function(){


    DEFAULT_VOTING_TIME = await EticaReleaseProtocolTestPhase2Instance.DEFAULT_VOTING_TIME(); 
    console.log('DEFAULT_VOTING_TIME IS ', DEFAULT_VOTING_TIME);

    DEFAULT_REVEALING_TIME = await EticaReleaseProtocolTestPhase2Instance.DEFAULT_REVEALING_TIME(); 
    console.log('DEFAULT_REVEALING_TIME IS ', DEFAULT_REVEALING_TIME);

    PERIOD_CURATION_REWARD_RATIO = await EticaReleaseProtocolTestPhase2Instance.PERIOD_CURATION_REWARD_RATIO();
    console.log('PERIOD_CURATION_REWARD_RATIO IS ', PERIOD_CURATION_REWARD_RATIO);

    PERIOD_EDITOR_REWARD_RATIO = await EticaReleaseProtocolTestPhase2Instance.PERIOD_EDITOR_REWARD_RATIO();
    console.log('PERIOD_EDITOR_REWARD_RATIO IS ', PERIOD_EDITOR_REWARD_RATIO);

    REWARD_INTERVAL = await EticaReleaseProtocolTestPhase2Instance.REWARD_INTERVAL();
    console.log('REWARD_INTERVAL IS ', REWARD_INTERVAL);

  // TRANSFERS FROM MINER ACCOUNT:
  await transferto(test_account);
  await transferto(test_account2);
  await transferto(test_account3);
  await transferto(test_account4);
  await transferto(test_account5);
  await transferto(test_account6);
  await transferto(test_account7);
  await transferto(test_account8);

  let OLD_BALANCE_ACCOUNT = await EticaReleaseProtocolTestPhase2Instance.balanceOf(test_account.address);  
  let OLD_BALANCE_ACCOUNT_2 = await EticaReleaseProtocolTestPhase2Instance.balanceOf(test_account2.address);
  let OLD_BALANCE_ACCOUNT_3 = await EticaReleaseProtocolTestPhase2Instance.balanceOf(test_account3.address);
  let OLD_BALANCE_ACCOUNT_4 = await EticaReleaseProtocolTestPhase2Instance.balanceOf(test_account4.address);
  let OLD_BALANCE_ACCOUNT_5 = await EticaReleaseProtocolTestPhase2Instance.balanceOf(test_account5.address);
  let OLD_BALANCE_ACCOUNT_6 = await EticaReleaseProtocolTestPhase2Instance.balanceOf(test_account6.address);
  let OLD_BALANCE_ACCOUNT_7 = await EticaReleaseProtocolTestPhase2Instance.balanceOf(test_account7.address);
  let OLD_BALANCE_ACCOUNT_8 = await EticaReleaseProtocolTestPhase2Instance.balanceOf(test_account8.address);


   // TRANSFERS FROM MINER ACCOUNT:
   await transferfromto(test_account, test_account2, '1000');
   await transferfromto(test_account, test_account3, '1000');
   await transferfromto(test_account, test_account4, '1000');
   await transferfromto(test_account, test_account5, '1000');
   await transferfromto(test_account, test_account6, '1000');
   await transferfromto(test_account, test_account7, '1000');




  let NEW_BALANCE_ACCOUNT = await EticaReleaseProtocolTestPhase2Instance.balanceOf(test_account.address);
  let NEW_BALANCE_ACCOUNT_2 = await EticaReleaseProtocolTestPhase2Instance.balanceOf(test_account2.address);
  let NEW_BALANCE_ACCOUNT_3 = await EticaReleaseProtocolTestPhase2Instance.balanceOf(test_account3.address);
  let NEW_BALANCE_ACCOUNT_4 = await EticaReleaseProtocolTestPhase2Instance.balanceOf(test_account4.address);
  let NEW_BALANCE_ACCOUNT_5 = await EticaReleaseProtocolTestPhase2Instance.balanceOf(test_account5.address);
  let NEW_BALANCE_ACCOUNT_6 = await EticaReleaseProtocolTestPhase2Instance.balanceOf(test_account6.address);
  let NEW_BALANCE_ACCOUNT_7 = await EticaReleaseProtocolTestPhase2Instance.balanceOf(test_account7.address);
  let NEW_BALANCE_ACCOUNT_8 = await EticaReleaseProtocolTestPhase2Instance.balanceOf(test_account8.address);



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
let indexfromhash = await EticaReleaseProtocolTestPhase2Instance.diseasesbyIds(EXPECTED_FIRST_DISEASE_HASH);
let hashfromname = await EticaReleaseProtocolTestPhase2Instance.getdiseasehashbyName(EXPECTED_FIRST_DISEASE_HASH);

// Retrieve BLOCKEDETICAS:
let OLD_BLOCKED_ETI_TEST_ACCOUNT = await EticaReleaseProtocolTestPhase2Instance.blockedeticas(test_account.address);
let OLD_BLOCKED_ETI_TEST_ACCOUNT_2 = await EticaReleaseProtocolTestPhase2Instance.blockedeticas(test_account2.address);
let OLD_BLOCKED_ETI_TEST_ACCOUNT_3 = await EticaReleaseProtocolTestPhase2Instance.blockedeticas(test_account3.address);
let OLD_BLOCKED_ETI_TEST_ACCOUNT_4 = await EticaReleaseProtocolTestPhase2Instance.blockedeticas(test_account4.address);
let OLD_BLOCKED_ETI_TEST_ACCOUNT_5 = await EticaReleaseProtocolTestPhase2Instance.blockedeticas(test_account5.address);
let OLD_BLOCKED_ETI_TEST_ACCOUNT_6 = await EticaReleaseProtocolTestPhase2Instance.blockedeticas(test_account6.address);
let OLD_BLOCKED_ETI_TEST_ACCOUNT_7 = await EticaReleaseProtocolTestPhase2Instance.blockedeticas(test_account7.address);

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

await createproposal(test_account, EXPECTED_FIRST_DISEASE_HASH, "Title 1 Malaria", "Description 1", IPFS1, "", "", "Targets:[one_target_here,another_target_here]","Compounds:[one_compound_here, another_compound_here]","Use this field as the community created standards");
await createproposal(test_account2, EXPECTED_FIRST_DISEASE_HASH, "Title 2 Malaria", "Description 2", IPFS2, "", "", "Targets:[one_target_here,another_target_here]","Compounds:[one_compound_here, another_compound_here]","Use this field as the community created standards");
await createproposal(test_account3, EXPECTED_FIRST_DISEASE_HASH, "Title 3 Malaria", "Description 3", IPFS3, "", "", "Targets:[one_target_here,another_target_here]","Compounds:[one_compound_here, another_compound_here]","Use this field as the community created standards");
await createproposal(test_account4, EXPECTED_FIRST_DISEASE_HASH, "Title 4 Malaria", "Description 4", IPFS4, "", "", "Targets:[one_target_here,another_target_here]","Compounds:[one_compound_here, another_compound_here]","Use this field as the community created standards");
await createproposal(test_account5, EXPECTED_FIRST_DISEASE_HASH, "Title 5 Malaria", "Description 5", IPFS5, "", "", "Targets:[one_target_here,another_target_here]","Compounds:[one_compound_here, another_compound_here]","Use this field as the community created standards");
await createproposal(test_account5, EXPECTED_FIRST_DISEASE_HASH, "Title 6 Malaria", "Description 6", IPFS6, IPFS7, "", "Targets:[one_target_here,another_target_here]","Compounds:[one_compound_here, another_compound_here]","Use this field as the community created standards");
await createproposal(test_account5, EXPECTED_FIRST_DISEASE_HASH, "Title 7 Malaria", "Description 7", IPFS7, "", IPFS8, "Targets:[one_target_here,another_target_here]","Compounds:[one_compound_here, another_compound_here]","Use this field as the community created standards");

// should fail to duplicate a proposal whose raw_release_hash and disease_hash have already been stored into the system:
await should_fail_propose(test_account, EXPECTED_FIRST_DISEASE_HASH, "Title 8 Malaria", "Description 8", IPFS1, "", "", "Targets:[one_target_here,another_target_here]","Compounds:[one_compound_here, another_compound_here]","Use this field as the community created standards");

let IPFS1_WITH_FIRTDISEASEHASH = get_expected_keccak256_hash_two(IPFS1, EXPECTED_FIRST_DISEASE_HASH);
let IPFS2_WITH_FIRTDISEASEHASH = get_expected_keccak256_hash_two(IPFS2, EXPECTED_FIRST_DISEASE_HASH);
let IPFS3_WITH_FIRTDISEASEHASH = get_expected_keccak256_hash_two(IPFS3, EXPECTED_FIRST_DISEASE_HASH);
let IPFS4_WITH_FIRTDISEASEHASH = get_expected_keccak256_hash_two(IPFS4, EXPECTED_FIRST_DISEASE_HASH);
let IPFS5_WITH_FIRTDISEASEHASH = get_expected_keccak256_hash_two(IPFS5, EXPECTED_FIRST_DISEASE_HASH);
let IPFS6_WITH_FIRTDISEASEHASH = get_expected_keccak256_hash_two(IPFS6, EXPECTED_FIRST_DISEASE_HASH);
let IPFS7_WITH_FIRTDISEASEHASH = get_expected_keccak256_hash_two(IPFS7, EXPECTED_FIRST_DISEASE_HASH);


// START COMMITING
await commitvote(test_account2, IPFS1_WITH_FIRTDISEASEHASH, true, '50', "random123");
await commitvote(test_account3, IPFS1_WITH_FIRTDISEASEHASH, true, '100', "random123");
await commitvote(test_account4, IPFS1_WITH_FIRTDISEASEHASH, false, '50', "random123");
await commitvote(test_account5, IPFS1_WITH_FIRTDISEASEHASH, true, '500', "random123");
await commitvote(test_account6, IPFS1_WITH_FIRTDISEASEHASH, false, '350', "random123");
await commitvote(test_account7, IPFS1_WITH_FIRTDISEASEHASH, false, '80', "random123");

//await should_fail_commitvote(test_account2, IPFS2_WITH_FIRTDISEASEHASH, true, '5'); // should fail vote twice on same proposal
await commitvote(test_account3, IPFS2_WITH_FIRTDISEASEHASH, false, '100', "random123");
await commitvote(test_account4, IPFS2_WITH_FIRTDISEASEHASH, true, '500', "random123");
await commitvote(test_account5, IPFS2_WITH_FIRTDISEASEHASH, false, '500', "random123");
await commitvote(test_account6, IPFS2_WITH_FIRTDISEASEHASH, true, '35', "random123");
await commitvote(test_account7, IPFS2_WITH_FIRTDISEASEHASH, false, '800', "random123");

await commitvote(test_account2, IPFS3_WITH_FIRTDISEASEHASH, true, '5', "random123");
//await should_fail_commitvote(test_account3, IPFS3_WITH_FIRTDISEASEHASH, false, '100');  // should fail vote twice on same proposal
await commitvote(test_account4, IPFS3_WITH_FIRTDISEASEHASH, true, '490', "random123");
await commitvote(test_account5, IPFS3_WITH_FIRTDISEASEHASH, false, '600', "random123");
await commitvote(test_account6, IPFS3_WITH_FIRTDISEASEHASH, true, '35', "random123");
await commitvote(test_account7, IPFS3_WITH_FIRTDISEASEHASH, true, '70', "random123");

await commitvote(test_account2, IPFS4_WITH_FIRTDISEASEHASH, true, '5', "random123");
await commitvote(test_account3, IPFS4_WITH_FIRTDISEASEHASH, true, '10', "random123");
//await should_fail_commitvote(test_account4, IPFS4_WITH_FIRTDISEASEHASH, true, '50');  // should fail vote twice on same proposal
await commitvote(test_account5, IPFS4_WITH_FIRTDISEASEHASH, true, '50', "random123");
await commitvote(test_account6, IPFS4_WITH_FIRTDISEASEHASH, true, '35', "random123");
await commitvote(test_account7, IPFS4_WITH_FIRTDISEASEHASH, true, '60', "random123");

// should fail to commitvote with incorrect amount for a proposal:
await should_fail_commitvote(test_account, IPFS4_WITH_FIRTDISEASEHASH, true, '500000', "random123");
await should_fail_commitvote(test_account, IPFS4_WITH_FIRTDISEASEHASH, true, '-500', "random123");
await should_fail_commitvote(test_account, IPFS4_WITH_FIRTDISEASEHASH, true, '0', "random123");

// should fail for users to commitvote twice on same Proposal:
/* to deal with it latter:
await should_fail_commitvote(test_account2, IPFS1_WITH_FIRTDISEASEHASH, true, '15', "random123");
await should_fail_commitvote(test_account3, IPFS1_WITH_FIRTDISEASEHASH, false, '25', "random123");
await should_fail_commitvote(test_account5, IPFS2_WITH_FIRTDISEASEHASH, true, '35', "random123");
await should_fail_commitvote(test_account6, IPFS3_WITH_FIRTDISEASEHASH, true, '50', "random123");
await should_fail_commitvote(test_account7, IPFS4_WITH_FIRTDISEASEHASH, true, '95', "random123");
*/
// END COMMITING

// ------- should fail revealing vote too early ------------ //
await should_fail_revealvote(test_account2, IPFS1_WITH_FIRTDISEASEHASH, true, '50', "random123");
await should_fail_revealvote(test_account3, IPFS1_WITH_FIRTDISEASEHASH, true, '100', "random123");
await should_fail_revealvote(test_account4, IPFS1_WITH_FIRTDISEASEHASH, false, '50', "random123");
await should_fail_revealvote(test_account5, IPFS1_WITH_FIRTDISEASEHASH, true, '500', "random123");
await should_fail_revealvote(test_account6, IPFS1_WITH_FIRTDISEASEHASH, false, '350', "random123");
await should_fail_revealvote(test_account7, IPFS1_WITH_FIRTDISEASEHASH, false, '80', "random123");

//await should_fail_revealvote(test_account2, IPFS2_WITH_FIRTDISEASEHASH, true, '5'); // should fail vote twice on same proposal
await should_fail_revealvote(test_account3, IPFS2_WITH_FIRTDISEASEHASH, false, '100', "random123");
await should_fail_revealvote(test_account4, IPFS2_WITH_FIRTDISEASEHASH, true, '500', "random123");
await should_fail_revealvote(test_account5, IPFS2_WITH_FIRTDISEASEHASH, false, '500', "random123");
await should_fail_revealvote(test_account6, IPFS2_WITH_FIRTDISEASEHASH, true, '35', "random123");
await should_fail_revealvote(test_account7, IPFS2_WITH_FIRTDISEASEHASH, false, '800', "random123");

await should_fail_revealvote(test_account2, IPFS3_WITH_FIRTDISEASEHASH, true, '5', "random123");
//await should_fail_revealvote(test_account3, IPFS3_WITH_FIRTDISEASEHASH, false, '100');  // should fail vote twice on same proposal
await should_fail_revealvote(test_account4, IPFS3_WITH_FIRTDISEASEHASH, true, '490', "random123");
await should_fail_revealvote(test_account5, IPFS3_WITH_FIRTDISEASEHASH, false, '600', "random123");
await should_fail_revealvote(test_account6, IPFS3_WITH_FIRTDISEASEHASH, true, '35', "random123");
await should_fail_revealvote(test_account7, IPFS3_WITH_FIRTDISEASEHASH, true, '60', "random123");

await should_fail_revealvote(test_account2, IPFS4_WITH_FIRTDISEASEHASH, true, '5', "random123");
await should_fail_revealvote(test_account3, IPFS4_WITH_FIRTDISEASEHASH, true, '10', "random123");
//await should_fail_revealvote(test_account4, IPFS4_WITH_FIRTDISEASEHASH, true, '50');  // should fail vote twice on same proposal
await should_fail_revealvote(test_account5, IPFS4_WITH_FIRTDISEASEHASH, true, '50', "random123");
await should_fail_revealvote(test_account6, IPFS4_WITH_FIRTDISEASEHASH, true, '35', "random123");
await should_fail_revealvote(test_account7, IPFS4_WITH_FIRTDISEASEHASH, true, '60', "random123");
// ------- should fail revealing vote too early ------------ //

// ------- advance time to enter revealing period: --------- //
console.log('DEFAULT_REVEALING_TIME is', DEFAULT_REVEALING_TIME.toNumber());
console.log('DEFAULT_VOTING_TIME is', DEFAULT_VOTING_TIME.toNumber());
await advanceseconds(DEFAULT_VOTING_TIME);

// Retrieve General Information of Proposals:
let _general_proposal1 = await EticaReleaseProtocolTestPhase2Instance.proposals(IPFS1_WITH_FIRTDISEASEHASH);
let _general_proposal2 = await EticaReleaseProtocolTestPhase2Instance.proposals(IPFS2_WITH_FIRTDISEASEHASH);
let _general_proposal3 = await EticaReleaseProtocolTestPhase2Instance.proposals(IPFS3_WITH_FIRTDISEASEHASH);
let _general_proposal4 = await EticaReleaseProtocolTestPhase2Instance.proposals(IPFS4_WITH_FIRTDISEASEHASH);
let _general_proposal5 = await EticaReleaseProtocolTestPhase2Instance.proposals(IPFS5_WITH_FIRTDISEASEHASH);
let _general_proposal6 = await EticaReleaseProtocolTestPhase2Instance.proposals(IPFS6_WITH_FIRTDISEASEHASH);
let _general_proposal7 = await EticaReleaseProtocolTestPhase2Instance.proposals(IPFS7_WITH_FIRTDISEASEHASH);

// get proposals data:
let _proposal1 = await EticaReleaseProtocolTestPhase2Instance.propsdatas(IPFS1_WITH_FIRTDISEASEHASH);
assert.equal(_proposal1.nbvoters, '0', 'Proposal1 should have 0 nbvoters');

let _proposal2 = await EticaReleaseProtocolTestPhase2Instance.propsdatas(IPFS2_WITH_FIRTDISEASEHASH);
assert.equal(_proposal2.nbvoters, '0', 'Proposal2 should have 0 nbvoters');

let _proposal3 = await EticaReleaseProtocolTestPhase2Instance.propsdatas(IPFS3_WITH_FIRTDISEASEHASH);
assert.equal(_proposal3.nbvoters, '0', 'Proposal3 should have 0 nbvoters');

let _proposal4 = await EticaReleaseProtocolTestPhase2Instance.propsdatas(IPFS4_WITH_FIRTDISEASEHASH);
assert.equal(_proposal4.nbvoters, '0', 'Proposal4 should have 0 nbvoters');

let _proposal5 = await EticaReleaseProtocolTestPhase2Instance.propsdatas(IPFS5_WITH_FIRTDISEASEHASH);
assert.equal(_proposal5.nbvoters, '0', 'Proposal5 should have 0 nbvoters');

let _proposal6 = await EticaReleaseProtocolTestPhase2Instance.propsdatas(IPFS6_WITH_FIRTDISEASEHASH);
assert.equal(_proposal6.nbvoters, '0', 'Proposal6 should have 0 nbvoters');

let _proposal7 = await EticaReleaseProtocolTestPhase2Instance.propsdatas(IPFS7_WITH_FIRTDISEASEHASH);
assert.equal(_proposal7.nbvoters, '0', 'Proposal7 should have 0 nbvoters');



// (to be added latter) make new commits that should be too late and thus revealvote() of these commits should fail:
await commitvote(test_account8, IPFS2_WITH_FIRTDISEASEHASH, true, '60', "random123");
await commitvote(test_account8, IPFS3_WITH_FIRTDISEASEHASH, true, '10', "random123");
await commitvote(test_account8, IPFS4_WITH_FIRTDISEASEHASH, false, '5', "random123");

// CHECKING PERIOD FORPROPS AGAINSTPROPS SYSTEM:
let first_period = await EticaReleaseProtocolTestPhase2Instance.periods(_general_proposal1.period_id);
assert.equal(first_period.total_voters.toNumber(), 0, 'First period should have 0 voter');
assert.equal(first_period.forprops.toNumber(), 0, 'First period should have 0 forprops');
assert.equal(first_period.againstprops.toNumber(), 0, 'First period should have 0 againstprops');

let proposal1_last_status = await EticaReleaseProtocolTestPhase2Instance.proplststatus(first_period.id, IPFS1_WITH_FIRTDISEASEHASH);
let proposal2_last_status = await EticaReleaseProtocolTestPhase2Instance.proplststatus(first_period.id, IPFS2_WITH_FIRTDISEASEHASH);
let proposal3_last_status = await EticaReleaseProtocolTestPhase2Instance.proplststatus(first_period.id, IPFS3_WITH_FIRTDISEASEHASH);
let proposal4_last_status = await EticaReleaseProtocolTestPhase2Instance.proplststatus(first_period.id, IPFS4_WITH_FIRTDISEASEHASH);
let proposal5_last_status = await EticaReleaseProtocolTestPhase2Instance.proplststatus(first_period.id, IPFS5_WITH_FIRTDISEASEHASH);
let proposal6_last_status = await EticaReleaseProtocolTestPhase2Instance.proplststatus(first_period.id, IPFS6_WITH_FIRTDISEASEHASH);
let proposal7_last_status = await EticaReleaseProtocolTestPhase2Instance.proplststatus(first_period.id, IPFS7_WITH_FIRTDISEASEHASH);
assert.equal(proposal1_last_status.toString(), 3, 'proposal1 last status should have been updated to Singlevoter (3)');
assert.equal(proposal2_last_status.toString(), 3, 'proposal2 last status should have been updated to Singlevoter (3)');
assert.equal(proposal3_last_status.toString(), 3, 'proposal3 last status should have been updated to Singlevoter (3)');
assert.equal(proposal4_last_status.toString(), 3, 'proposal4 last status should have been updated to Singlevoter (3)');
assert.equal(proposal5_last_status.toString(), 3, 'proposal5 last status should have been updated to Singlevoter (3)');
assert.equal(proposal6_last_status.toString(), 3, 'proposal6 last status should have been updated to Singlevoter (3)');
assert.equal(proposal7_last_status.toString(), 3, 'proposal7 last status should have been updated to Singlevoter (3)');
// CHECKING PERIOD FORPROPS AGAINSTPROPS SYSTEM DONE

// assert we are within revealing period of proposal1
let lstblock = await web3.eth.getBlock("latest");
assert(lstblock.timestamp > _proposal1.endtime.toNumber(), 'Block timestamp should be higher than proposal1 endTime before testing REVEALVOTE');
assert(lstblock.timestamp <= _proposal1.endtime.toNumber() + DEFAULT_REVEALING_TIME.toNumber(), 'Block timestamp should be lower or equal to _proposal1.endTime + DEFAULT_REVEALING_TIME before testing REVEALVOTE');
console.log('lstblock.timestamp is', lstblock.timestamp);
console.log('_proposal1.endtime.toNumber() is', _proposal1.endtime.toNumber());
console.log('DEFAULT_REVEALING_TIME is', DEFAULT_REVEALING_TIME.toNumber());

await revealvote(test_account2, IPFS1_WITH_FIRTDISEASEHASH, true, '50', "random123");
await revealvote(test_account3, IPFS1_WITH_FIRTDISEASEHASH, true, '100', "random123");
await revealvote(test_account4, IPFS1_WITH_FIRTDISEASEHASH, false, '50', "random123");
await revealvote(test_account5, IPFS1_WITH_FIRTDISEASEHASH, true, '500', "random123");
await revealvote(test_account6, IPFS1_WITH_FIRTDISEASEHASH, false, '350', "random123");
await revealvote(test_account7, IPFS1_WITH_FIRTDISEASEHASH, false, '80', "random123");

// CHECKING PERIOD FORPROPS AGAINSTPROPS SYSTEM:
first_period = await EticaReleaseProtocolTestPhase2Instance.periods(_general_proposal1.period_id);
assert.equal(first_period.total_voters.toNumber(), 6, 'First period should have 6 voters');
assert.equal(first_period.forprops.toNumber(), 1, 'First period should have 1 forprops');
assert.equal(first_period.againstprops.toNumber(), 0, 'First period should have 0 againstprops');

proposal1_last_status = await EticaReleaseProtocolTestPhase2Instance.proplststatus(first_period.id, IPFS1_WITH_FIRTDISEASEHASH);
assert.equal(proposal1_last_status.toString(), 1, 'proposal1 last status should have been updated to Accepted (1)');
// CHECKING PERIOD FORPROPS AGAINSTPROPS SYSTEM DONE



// assert we are within revealing period of proposal2
lstblock = await web3.eth.getBlock("latest");
assert(lstblock.timestamp > _proposal2.endtime.toNumber(), 'Block timestamp should be higher than proposal2 endTime before testing REVEALVOTE');
assert(lstblock.timestamp <= _proposal2.endtime.toNumber() + DEFAULT_REVEALING_TIME, 'Block timestamp should be lower or equal to _proposal2.endTime + DEFAULT_REVEALING_TIME before testing REVEALVOTE');
//await should_fail_revealvote(test_account2, IPFS2_WITH_FIRTDISEASEHASH, true, '5'); // should fail vote twice on same proposal
await revealvote(test_account3, IPFS2_WITH_FIRTDISEASEHASH, false, '100', "random123");
await revealvote(test_account4, IPFS2_WITH_FIRTDISEASEHASH, true, '500', "random123");
await revealvote(test_account5, IPFS2_WITH_FIRTDISEASEHASH, false, '500', "random123");
await revealvote(test_account6, IPFS2_WITH_FIRTDISEASEHASH, true, '35', "random123");
await revealvote(test_account7, IPFS2_WITH_FIRTDISEASEHASH, false, '800', "random123");

// CHECKING PERIOD FORPROPS AGAINSTPROPS SYSTEM:
first_period = await EticaReleaseProtocolTestPhase2Instance.periods(_general_proposal1.period_id);
assert.equal(first_period.total_voters.toNumber(), 11, 'First period should have 11 voters');
assert.equal(first_period.forprops.toNumber(), 1, 'First period should have 1 forprops');
assert.equal(first_period.againstprops.toNumber(), 1, 'First period should have 1 againstprops');

proposal2_last_status = await EticaReleaseProtocolTestPhase2Instance.proplststatus(first_period.id, IPFS2_WITH_FIRTDISEASEHASH);
assert.equal(proposal2_last_status.toString(), 0, 'proposal2 last status should have been updated to Rejected (0)');
// CHECKING PERIOD FORPROPS AGAINSTPROPS SYSTEM DONE




// assert we are within revealing period of proposal3
lstblock = await web3.eth.getBlock("latest");
assert(lstblock.timestamp > _proposal3.endtime.toNumber(), 'Block timestamp should be higher than proposal3 endTime before testing REVEALVOTE');
assert(lstblock.timestamp <= _proposal3.endtime.toNumber() + DEFAULT_REVEALING_TIME, 'Block timestamp should be lower or equal to _proposal3.endTime + DEFAULT_REVEALING_TIME before testing REVEALVOTE');
await revealvote(test_account2, IPFS3_WITH_FIRTDISEASEHASH, true, '5', "random123");
//await should_fail_revealvote(test_account3, IPFS3_WITH_FIRTDISEASEHASH, false, '100');  // should fail vote twice on same proposal
await revealvote(test_account4, IPFS3_WITH_FIRTDISEASEHASH, true, '490', "random123");
await revealvote(test_account5, IPFS3_WITH_FIRTDISEASEHASH, false, '600', "random123");
await revealvote(test_account6, IPFS3_WITH_FIRTDISEASEHASH, true, '35', "random123");
await revealvote(test_account7, IPFS3_WITH_FIRTDISEASEHASH, true, '70', "random123");

// CHECKING PERIOD FORPROPS AGAINSTPROPS SYSTEM:
first_period = await EticaReleaseProtocolTestPhase2Instance.periods(_general_proposal1.period_id);
assert.equal(first_period.total_voters.toNumber(), 16, 'First period should have 16 voters');
assert.equal(first_period.forprops.toNumber(), 1, 'First period should have 1 forprops');
assert.equal(first_period.againstprops.toNumber(), 2, 'First period should have 2 againstprops');

proposal3_last_status = await EticaReleaseProtocolTestPhase2Instance.proplststatus(first_period.id, IPFS3_WITH_FIRTDISEASEHASH);
assert.equal(proposal3_last_status.toString(), 0, 'proposal3 last status should have been updated to Rejected (0)');
// CHECKING PERIOD FORPROPS AGAINSTPROPS SYSTEM DONE


// assert we are within revealing period of proposal4
lstblock = await web3.eth.getBlock("latest");
assert(lstblock.timestamp > _proposal4.endtime.toNumber(), 'Block timestamp should be higher than proposal4 endTime before testing REVEALVOTE');
assert(lstblock.timestamp <= _proposal4.endtime.toNumber() + DEFAULT_REVEALING_TIME, 'Block timestamp should be lower or equal to _proposal4.endTime + DEFAULT_REVEALING_TIME before testing REVEALVOTE');
await revealvote(test_account2, IPFS4_WITH_FIRTDISEASEHASH, true, '5', "random123");
await revealvote(test_account3, IPFS4_WITH_FIRTDISEASEHASH, true, '10', "random123");
//await should_fail_revealvote(test_account4, IPFS4_WITH_FIRTDISEASEHASH, true, '50');  // should fail vote twice on same proposal
await revealvote(test_account5, IPFS4_WITH_FIRTDISEASEHASH, true, '50', "random123");
await revealvote(test_account6, IPFS4_WITH_FIRTDISEASEHASH, true, '35', "random123");
await revealvote(test_account7, IPFS4_WITH_FIRTDISEASEHASH, true, '60', "random123");

// CHECKING PERIOD FORPROPS AGAINSTPROPS SYSTEM:
first_period = await EticaReleaseProtocolTestPhase2Instance.periods(_general_proposal1.period_id);
assert.equal(first_period.total_voters.toNumber(), 21, 'First period should have 21 voters');
assert.equal(first_period.forprops.toNumber(), 2, 'First period should have 2 forprops');
assert.equal(first_period.againstprops.toNumber(), 2, 'First period should have 2 againstprops');

proposal4_last_status = await EticaReleaseProtocolTestPhase2Instance.proplststatus(first_period.id, IPFS4_WITH_FIRTDISEASEHASH);
assert.equal(proposal4_last_status.toString(), 1, 'proposal4 last status should have been updated to Accepted (1)');
// CHECKING PERIOD FORPROPS AGAINSTPROPS SYSTEM DONE



// assert we are within revealing period of proposal5
lstblock = await web3.eth.getBlock("latest");
assert(lstblock.timestamp > _proposal4.endtime.toNumber(), 'Block timestamp should be higher than proposal4 endTime before testing REVEALVOTE');
assert(lstblock.timestamp <= _proposal4.endtime.toNumber() + DEFAULT_REVEALING_TIME, 'Block timestamp should be lower or equal to _proposal4.endTime + DEFAULT_REVEALING_TIME before testing REVEALVOTE');
// should fail to vote with incorrect amount for a proposal:
await should_fail_revealvote(test_account7, IPFS4_WITH_FIRTDISEASEHASH, true, '500000', "random123");
await should_fail_revealvote(test_account3, IPFS4_WITH_FIRTDISEASEHASH, true, '-500', "random123");
await should_fail_revealvote(test_account3, IPFS4_WITH_FIRTDISEASEHASH, true, '0', "random123");


// assert we are within revealing period of proposal6
lstblock = await web3.eth.getBlock("latest");
assert(lstblock.timestamp > _proposal1.endtime.toNumber(), 'Block timestamp should be higher than proposal1 endTime before testing REVEALVOTE');
assert(lstblock.timestamp <= _proposal1.endtime.toNumber() + DEFAULT_REVEALING_TIME, 'Block timestamp should be lower or equal to _proposal1.endTime + DEFAULT_REVEALING_TIME before testing REVEALVOTE');

assert(lstblock.timestamp > _proposal2.endtime.toNumber(), 'Block timestamp should be higher than proposal2 endTime before testing REVEALVOTE');
assert(lstblock.timestamp <= _proposal2.endtime.toNumber() + DEFAULT_REVEALING_TIME, 'Block timestamp should be lower or equal to _proposal2.endTime + DEFAULT_REVEALING_TIME before testing REVEALVOTE');

assert(lstblock.timestamp > _proposal3.endtime.toNumber(), 'Block timestamp should be higher than proposal3 endTime before testing REVEALVOTE');
assert(lstblock.timestamp <= _proposal3.endtime.toNumber() + DEFAULT_REVEALING_TIME, 'Block timestamp should be lower or equal to _proposal3.endTime + DEFAULT_REVEALING_TIME before testing REVEALVOTE');

assert(lstblock.timestamp > _proposal4.endtime.toNumber(), 'Block timestamp should be higher than proposal4 endTime before testing REVEALVOTE');
assert(lstblock.timestamp <= _proposal4.endtime.toNumber() + DEFAULT_REVEALING_TIME, 'Block timestamp should be lower or equal to _proposal4.endTime + DEFAULT_REVEALING_TIME before testing REVEALVOTE');


// should fail for users to revealvote twice on same Proposal:
await should_fail_revealvote(test_account2, IPFS1_WITH_FIRTDISEASEHASH, true, '15', "random123");
await should_fail_revealvote(test_account3, IPFS1_WITH_FIRTDISEASEHASH, false, '25', "random123");
await should_fail_revealvote(test_account5, IPFS2_WITH_FIRTDISEASEHASH, true, '35', "random123");
await should_fail_revealvote(test_account6, IPFS3_WITH_FIRTDISEASEHASH, true, '50', "random123");
await should_fail_revealvote(test_account7, IPFS4_WITH_FIRTDISEASEHASH, true, '95', "random123");


// revealvote() of these commits should fail because the related commits were made too late:
await should_fail_revealvote(test_account8, IPFS2_WITH_FIRTDISEASEHASH, true, '60', "random123");
await should_fail_revealvote(test_account8, IPFS3_WITH_FIRTDISEASEHASH, true, '10', "random123");
await should_fail_revealvote(test_account8, IPFS4_WITH_FIRTDISEASEHASH, false, '5', "random123");


// CHECK PROPOSALSDATA

_proposal1 = await EticaReleaseProtocolTestPhase2Instance.propsdatas(IPFS1_WITH_FIRTDISEASEHASH);
assert.equal(_proposal1.nbvoters, '6', 'Proposal1 should have 6 nbvoters');

_proposal2 = await EticaReleaseProtocolTestPhase2Instance.propsdatas(IPFS2_WITH_FIRTDISEASEHASH);
assert.equal(_proposal2.nbvoters, '5', 'Proposal2 should have 5 nbvoters');

_proposal3 = await EticaReleaseProtocolTestPhase2Instance.propsdatas(IPFS3_WITH_FIRTDISEASEHASH);
assert.equal(_proposal3.nbvoters, '5', 'Proposal3 should have 5 nbvoters');

_proposal4 = await EticaReleaseProtocolTestPhase2Instance.propsdatas(IPFS4_WITH_FIRTDISEASEHASH);
assert.equal(_proposal4.nbvoters, '5', 'Proposal4 should have 5 nbvoters');

_proposal5 = await EticaReleaseProtocolTestPhase2Instance.propsdatas(IPFS5_WITH_FIRTDISEASEHASH);
assert.equal(_proposal5.nbvoters, '0', 'Proposal5 should have 0 nbvoters');

_proposal6 = await EticaReleaseProtocolTestPhase2Instance.propsdatas(IPFS6_WITH_FIRTDISEASEHASH);
assert.equal(_proposal6.nbvoters, '0', 'Proposal6 should have 0 nbvoters');

_proposal7 = await EticaReleaseProtocolTestPhase2Instance.propsdatas(IPFS7_WITH_FIRTDISEASEHASH);
assert.equal(_proposal7.nbvoters, '0', 'Proposal7 should have 0 nbvoters');

console.log('----------------->   PROPOSALS NBVOTERS CHECKED  <-----------------');


assert.equal(web3.utils.fromWei(_proposal1.forvotes.toString()), '650', 'Proposal1 should have 650 forvotes');
assert.equal(web3.utils.fromWei(_proposal1.againstvotes.toString()), '480', 'Proposal1 should have 480 against votes');

assert.equal(web3.utils.fromWei(_proposal2.forvotes.toString()), '535', 'Proposal2 should have 535 forvotes');
assert.equal(web3.utils.fromWei(_proposal2.againstvotes.toString()), '1400', 'Proposal1 should have 1400 against votes');

assert.equal(web3.utils.fromWei(_proposal3.forvotes.toString()), '600', 'Proposal3 should have 600 forvotes');
assert.equal(web3.utils.fromWei(_proposal3.againstvotes.toString()), '600', 'Proposal3 should have 600 against votes');

assert.equal(web3.utils.fromWei(_proposal4.forvotes.toString()), '160', 'Proposal4 should have 160 forvotes');
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

assert.equal(web3.utils.fromWei(_proposal1.lastcuration_weight, "ether" ), '650', 'Proposal1 should have a lastcuration_weight of 650');
assert.equal(web3.utils.fromWei(_proposal2.lastcuration_weight, "ether" ), '1400', 'Proposal2 should have a lastcuration_weight of 1400');
assert.equal(web3.utils.fromWei(_proposal3.lastcuration_weight, "ether" ), '0', 'Proposal3 should have a lastcuration_weight of 0');
assert.equal(web3.utils.fromWei(_proposal4.lastcuration_weight, "ether" ), '160', 'Proposal4 should have a lastcuration_weight of 160');
assert.equal(web3.utils.fromWei(_proposal5.lastcuration_weight, "ether" ), '0', 'Proposal5 should have a lastcuration_weight of 0');
assert.equal(web3.utils.fromWei(_proposal6.lastcuration_weight, "ether" ), '0', 'Proposal6 should have a lastcuration_weight of 0');
assert.equal(web3.utils.fromWei(_proposal7.lastcuration_weight, "ether" ), '0', 'Proposal7 should have a lastcuration_weight of 0');

console.log('----------------->   PROPOSALS LASTCURATIONWEIGHT CHECKED  <-----------------');

assert.equal(web3.utils.fromWei(_proposal1.lasteditor_weight, "ether" ), '650', 'Proposal1 should have a lasteditor_weight of 650');
assert.equal(web3.utils.fromWei(_proposal2.lasteditor_weight, "ether" ), '0', 'Proposal2 should have a lasteditor_weight of 0');
assert.equal(web3.utils.fromWei(_proposal3.lasteditor_weight, "ether" ), '0', 'Proposal3 should have a lasteditor_weight of 0');
assert.equal(web3.utils.fromWei(_proposal4.lasteditor_weight, "ether" ), '160', 'Proposal4 should have a lasteditor_weight of 160');
assert.equal(web3.utils.fromWei(_proposal5.lasteditor_weight, "ether" ), '0', 'Proposal5 should have a lasteditor_weight of 0');
assert.equal(web3.utils.fromWei(_proposal6.lasteditor_weight, "ether" ), '0', 'Proposal6 should have a lasteditor_weight of 0');
assert.equal(web3.utils.fromWei(_proposal7.lasteditor_weight, "ether" ), '0', 'Proposal7 should have a lasteditor_weight of 0');

console.log('----------------->   PROPOSALS LASTEDITORWEIGHT CHECKED  <-----------------');

assert.equal(_proposal1.slashingratio.toNumber(), 1505, 'Proposal1 should have a slashingratio of 0.1505');
assert.equal(_proposal2.slashingratio.toNumber(), 4471, 'Proposal2 should have a slashingratio of 0.4471');
assert.equal(_proposal3.slashingratio.toNumber(), 0, 'Proposal3 should have a slashingratio of 0');
assert.equal(_proposal4.slashingratio.toNumber(), 10000, 'Proposal4 should have a slashingratio of 1');
assert.equal(_proposal5.slashingratio.toNumber(), 0, 'Proposal5 should have a slashingratio of 0');
assert.equal(_proposal6.slashingratio.toNumber(), 0, 'Proposal6 should have a slashingratio of 0');
assert.equal(_proposal7.slashingratio.toNumber(), 0, 'Proposal7 should have a slashingratio of 0');

console.log('----------------->   PROPOSALS SLASHINGRATIO CHECKED  <-----------------');


// Retrieve BLOCKEDETICAS:
let NEW_BLOCKED_ETI_TEST_ACCOUNT = await EticaReleaseProtocolTestPhase2Instance.blockedeticas(test_account.address);
let NEW_BLOCKED_ETI_TEST_ACCOUNT_2 = await EticaReleaseProtocolTestPhase2Instance.blockedeticas(test_account2.address);
let NEW_BLOCKED_ETI_TEST_ACCOUNT_3 = await EticaReleaseProtocolTestPhase2Instance.blockedeticas(test_account3.address);
let NEW_BLOCKED_ETI_TEST_ACCOUNT_4 = await EticaReleaseProtocolTestPhase2Instance.blockedeticas(test_account4.address);
let NEW_BLOCKED_ETI_TEST_ACCOUNT_5 = await EticaReleaseProtocolTestPhase2Instance.blockedeticas(test_account5.address);
let NEW_BLOCKED_ETI_TEST_ACCOUNT_6 = await EticaReleaseProtocolTestPhase2Instance.blockedeticas(test_account6.address);
let NEW_BLOCKED_ETI_TEST_ACCOUNT_7 = await EticaReleaseProtocolTestPhase2Instance.blockedeticas(test_account7.address);

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
assert.equal(web3.utils.fromWei(NEW_BLOCKED_ETI_TEST_ACCOUNT_7, "ether" ), 1010);


// Retrieve General Information of Proposals:
_general_proposal1 = await EticaReleaseProtocolTestPhase2Instance.proposals(IPFS1_WITH_FIRTDISEASEHASH);
_general_proposal2 = await EticaReleaseProtocolTestPhase2Instance.proposals(IPFS2_WITH_FIRTDISEASEHASH);
_general_proposal3 = await EticaReleaseProtocolTestPhase2Instance.proposals(IPFS3_WITH_FIRTDISEASEHASH);
_general_proposal4 = await EticaReleaseProtocolTestPhase2Instance.proposals(IPFS4_WITH_FIRTDISEASEHASH);
_general_proposal5 = await EticaReleaseProtocolTestPhase2Instance.proposals(IPFS5_WITH_FIRTDISEASEHASH);
_general_proposal6 = await EticaReleaseProtocolTestPhase2Instance.proposals(IPFS6_WITH_FIRTDISEASEHASH);
_general_proposal7 = await EticaReleaseProtocolTestPhase2Instance.proposals(IPFS7_WITH_FIRTDISEASEHASH);

// assert all proposals are in same Period (not necessary for contract integrity but we assume they are for next steps of Tests)
console.log('_general_proposal1.period_id is', _general_proposal1.period_id.toString());
console.log('_general_proposal7.period_id is', _general_proposal7.period_id.toString());

assert(_general_proposal1.period_id.toString() == _general_proposal7.period_id.toString(), "Please relaunch the test, proposal1 and proposal7 need to be created in same Period. Will be more lucky next time !");


// assert Period's curation_sum and editor_sum values are OK
let _period1  = await EticaReleaseProtocolTestPhase2Instance.periods(_general_proposal1.period_id);
console.log('_period1 is:', _period1);
console.log('_period1.reward_curation is:', web3.utils.fromWei(_period1.reward_for_curation, "ether" ));
console.log('_period1.reward_editor is:', web3.utils.fromWei(_period1.reward_for_editor, "ether" ));
console.log('_period1.total_voters is:', _period1.total_voters);
assert.equal(web3.utils.fromWei(_period1.curation_sum, "ether" ), 2210); // Sum of proposals' curation_weight
assert.equal(web3.utils.fromWei(_period1.editor_sum, "ether" ), 810); // Sum of proposals' editor_weight
assert.equal(_period1.total_voters.toString(), "21"); // Period nb votes

// Should fail to clmpropbyhash too early: 
await should_fail_clmpropbyhash(test_account, IPFS1_WITH_FIRTDISEASEHASH);

// advance time so that clmpropbyhash becomes possible: 
await advanceseconds(DEFAULT_VOTING_TIME);

// Should fail to revealvote too late:
await should_fail_revealvote(test_account2, IPFS5_WITH_FIRTDISEASEHASH, true, '20');


OLD_BALANCE_ACCOUNT = await EticaReleaseProtocolTestPhase2Instance.balanceOf(test_account.address);  
OLD_BALANCE_ACCOUNT_2 = await EticaReleaseProtocolTestPhase2Instance.balanceOf(test_account2.address);
OLD_BALANCE_ACCOUNT_3 = await EticaReleaseProtocolTestPhase2Instance.balanceOf(test_account3.address);
OLD_BALANCE_ACCOUNT_4 = await EticaReleaseProtocolTestPhase2Instance.balanceOf(test_account4.address);
OLD_BALANCE_ACCOUNT_5 = await EticaReleaseProtocolTestPhase2Instance.balanceOf(test_account5.address);
OLD_BALANCE_ACCOUNT_6 = await EticaReleaseProtocolTestPhase2Instance.balanceOf(test_account6.address);
OLD_BALANCE_ACCOUNT_7 = await EticaReleaseProtocolTestPhase2Instance.balanceOf(test_account7.address);
OLD_BALANCE_ACCOUNT_8 = await EticaReleaseProtocolTestPhase2Instance.balanceOf(test_account8.address);

// should pass
await clmpropbyhash(test_account5, IPFS4_WITH_FIRTDISEASEHASH);
await clmpropbyhash(test_account6, IPFS4_WITH_FIRTDISEASEHASH);
await clmpropbyhash(test_account7, IPFS4_WITH_FIRTDISEASEHASH);

await clmpropbyhash(test_account5, IPFS5_WITH_FIRTDISEASEHASH);



MID_BALANCE_ACCOUNT = await EticaReleaseProtocolTestPhase2Instance.balanceOf(test_account.address);  
MID_BALANCE_ACCOUNT_2 = await EticaReleaseProtocolTestPhase2Instance.balanceOf(test_account2.address);
MID_BALANCE_ACCOUNT_3 = await EticaReleaseProtocolTestPhase2Instance.balanceOf(test_account3.address);
MID_BALANCE_ACCOUNT_4 = await EticaReleaseProtocolTestPhase2Instance.balanceOf(test_account4.address);
MID_BALANCE_ACCOUNT_5 = await EticaReleaseProtocolTestPhase2Instance.balanceOf(test_account5.address);
MID_BALANCE_ACCOUNT_6 = await EticaReleaseProtocolTestPhase2Instance.balanceOf(test_account6.address);
MID_BALANCE_ACCOUNT_7 = await EticaReleaseProtocolTestPhase2Instance.balanceOf(test_account7.address);
MID_BALANCE_ACCOUNT_8 = await EticaReleaseProtocolTestPhase2Instance.balanceOf(test_account8.address);


// ------------  ACCOUNT 5----------- //
let _expected_reward_acc5_prop_4 = await get_expected_reward(test_account5, IPFS4_WITH_FIRTDISEASEHASH);
let _expected_reward_acc5_prop_5 = await get_expected_reward(test_account5, IPFS5_WITH_FIRTDISEASEHASH);
let _expected_total_reward_acc5 =  _expected_reward_acc5_prop_4 + _expected_reward_acc5_prop_5;
console.log('_expected_reward_acc5_prop4 is', _expected_reward_acc5_prop_4);
console.log('_expected_reward_acc5_prop5 is', _expected_reward_acc5_prop_5);
console.log('_expected_total_reward_acc5 is', _expected_total_reward_acc5);
// ---> because of significant figure issues we remove last 2 figures:
_expected_total_reward_acc5 = Number.parseFloat(_expected_total_reward_acc5).toPrecision(9);

let _effective_reward_acc5 = web3.utils.fromWei(MID_BALANCE_ACCOUNT_5, "ether" ) - web3.utils.fromWei(OLD_BALANCE_ACCOUNT_5, "ether" );
console.log('_effective_acc5 new ETI as REWARD:', _effective_reward_acc5);
// ---> because of significant figure issues we remove last 2 figures:
_effective_reward_acc5 = Number.parseFloat(_effective_reward_acc5).toPrecision(9);

// acc5 should have gotten exactly the expected REWARD calculated by get_expected_reward() :
assert.equal( _effective_reward_acc5, _expected_total_reward_acc5); // 122.67718490502358 == _expected_reward_acc5_prop_4 + _expected_reward_acc5_prop_5

// ------------  ACCOUNT 5---------- //

// ------------  ACCOUNT 6----------- //
let _expected_reward_acc6_prop_4 = await get_expected_reward(test_account6, IPFS4_WITH_FIRTDISEASEHASH);
let _expected_total_reward_acc6 =  _expected_reward_acc6_prop_4;
console.log('_expected_reward_acc6_prop4 is', _expected_reward_acc6_prop_4);
console.log('_expected_total_reward_acc6 is', _expected_total_reward_acc6);
// ---> because of significant figure issues we remove last 2 figures:
_expected_total_reward_acc6 = _expected_total_reward_acc6.toString();
_expected_total_reward_acc6 = Number.parseFloat(_expected_total_reward_acc6).toPrecision(9);

let _effective_reward_acc6 = web3.utils.fromWei(MID_BALANCE_ACCOUNT_6, "ether" ) - web3.utils.fromWei(OLD_BALANCE_ACCOUNT_6, "ether" );
console.log('_effective_acc6 new ETI as REWARD:', _effective_reward_acc6);
// ---> because of significant figure issues we remove last 2 figures:
_effective_reward_acc6 = Number.parseFloat(_effective_reward_acc6).toPrecision(9);

// acc6 should have gotten exactly the expected REWARD calculated by get_expected_reward() :
assert.equal( _effective_reward_acc6, _expected_total_reward_acc6); // 62.94838356665059 == _expected_reward_acc6_prop_4
// ----------- ACCOUNT 6   -----------  //

// ----- ACCOUNT 7  ------------ //
let _expected_reward_acc7_prop_4 = await get_expected_reward(test_account7, IPFS4_WITH_FIRTDISEASEHASH);
let _expected_total_reward_acc7 =  _expected_reward_acc7_prop_4;
console.log('_expected_reward_acc7_prop4 is', _expected_reward_acc7_prop_4);
console.log('_expected_total_reward_acc7 is', _expected_total_reward_acc7);
// ---> because of significant figure issues we remove last 2 figures:
_expected_total_reward_acc7 = Number.parseFloat(_expected_total_reward_acc7).toPrecision(9);

let _effective_reward_acc7 = web3.utils.fromWei(MID_BALANCE_ACCOUNT_7, "ether" ) - web3.utils.fromWei(OLD_BALANCE_ACCOUNT_7, "ether" );
console.log('_effective_acc7 new ETI as REWARD:', _effective_reward_acc7);
// ---> because of significant figure issues we remove last 2 figures:
_effective_reward_acc7 = Number.parseFloat(_effective_reward_acc7).toPrecision(9);

// acc7 should have gotten exactly the expected REWARD calculated by get_expected_reward() :
assert.equal( _effective_reward_acc7, _expected_total_reward_acc7); // 113.906598834890 == _expected_reward_acc_7_prop_4

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


NEW_BALANCE_ACCOUNT = await EticaReleaseProtocolTestPhase2Instance.balanceOf(test_account.address);  
NEW_BALANCE_ACCOUNT_2 = await EticaReleaseProtocolTestPhase2Instance.balanceOf(test_account2.address);
NEW_BALANCE_ACCOUNT_3 = await EticaReleaseProtocolTestPhase2Instance.balanceOf(test_account3.address);
NEW_BALANCE_ACCOUNT_4 = await EticaReleaseProtocolTestPhase2Instance.balanceOf(test_account4.address);
NEW_BALANCE_ACCOUNT_5 = await EticaReleaseProtocolTestPhase2Instance.balanceOf(test_account5.address);
NEW_BALANCE_ACCOUNT_6 = await EticaReleaseProtocolTestPhase2Instance.balanceOf(test_account6.address);
NEW_BALANCE_ACCOUNT_7 = await EticaReleaseProtocolTestPhase2Instance.balanceOf(test_account7.address);
NEW_BALANCE_ACCOUNT_8 = await EticaReleaseProtocolTestPhase2Instance.balanceOf(test_account8.address);


// ACCOUNT 1:
let _expected_reward_acc1_prop_1 = await get_expected_reward(test_account, IPFS1_WITH_FIRTDISEASEHASH);
let _expected_total_reward_acc1 =  _expected_reward_acc1_prop_1;
_expected_total_reward_acc1 = Number.parseFloat(_expected_total_reward_acc1).toPrecision(9);
console.log('_expected_reward_acc1_prop1 is', _expected_reward_acc1_prop_1);
console.log('_expected_total_reward_acc1 is', _expected_total_reward_acc1);

let _effective_reward_acc1 = web3.utils.fromWei(NEW_BALANCE_ACCOUNT, "ether" ) - web3.utils.fromWei(MID_BALANCE_ACCOUNT, "ether" );
_effective_reward_acc1 = Number.parseFloat(_effective_reward_acc1).toPrecision(9);
console.log('_effective_acc1 new ETI as REWARD:', _effective_reward_acc1);
// acc5 should have gotten exactly the expected REWARD calculated by get_expected_reward() :
assert.equal( _effective_reward_acc1, _expected_total_reward_acc1); // 13767.044628187738 == _expected_reward_acc5_prop_4 + _expected_reward_acc5_prop_5


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
_expected_total_reward_acc2 = Number.parseFloat(_expected_total_reward_acc2).toPrecision(9);


let _effective_reward_acc2 = web3.utils.fromWei(NEW_BALANCE_ACCOUNT_2, "ether" ) - web3.utils.fromWei(MID_BALANCE_ACCOUNT_2, "ether" );
console.log('_effective_acc2 new ETI as REWARD:', _effective_reward_acc2);
// ---> because of significant figure issues we remove last 2 figures:
_effective_reward_acc2 = Number.parseFloat(_effective_reward_acc2).toPrecision(9);

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
 console.log('_expected_total_reward_acc3 is', _expected_total_reward_acc3);
// ---> because of significant figure issues we remove last 2 figures:
_expected_total_reward_acc3 = Number.parseFloat(_expected_total_reward_acc3).toPrecision(9);


let _effective_reward_acc3 = web3.utils.fromWei(NEW_BALANCE_ACCOUNT_3, "ether" ) - web3.utils.fromWei(MID_BALANCE_ACCOUNT_3, "ether" );
// ---> because of significant figure issues we remove last 2 figures:
_effective_reward_acc3 = Number.parseFloat(_effective_reward_acc3).toPrecision(9);
console.log('_effective_acc3 new ETI as REWARD precision 9:', _effective_reward_acc3);

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
_expected_total_reward_acc4 = Number.parseFloat(_expected_total_reward_acc4).toPrecision(9);


let _effective_reward_acc4 = web3.utils.fromWei(NEW_BALANCE_ACCOUNT_4, "ether" ) - web3.utils.fromWei(MID_BALANCE_ACCOUNT_4, "ether" );
console.log('_effective_acc4 new ETI as REWARD:', _effective_reward_acc4);
// ---> because of significant figure issues we remove last 2 figures:
_effective_reward_acc4 = Number.parseFloat(_effective_reward_acc4).toPrecision(9);

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


_expected_total_reward_acc5 =  _expected_reward_acc5_prop_1 + _expected_reward_acc5_prop_2 + _expected_reward_acc5_prop_3 + _expected_reward_acc5_prop_6 + _expected_reward_acc5_prop_7;
 console.log('_expected_total_reward_acc5 is', _expected_total_reward_acc5);
// ---> because of significant figure issues we remove last 2 figures:
_expected_total_reward_acc5 = Number.parseFloat(_expected_total_reward_acc5).toPrecision(9);


_effective_reward_acc5 = web3.utils.fromWei(NEW_BALANCE_ACCOUNT_5, "ether" ) - web3.utils.fromWei(MID_BALANCE_ACCOUNT_5, "ether" );
//console.log('_effective_acc5 new ETI as REWARD:', _effective_reward_acc5);
// ---> because of significant figure issues we remove last 2 figures:
_effective_reward_acc5 = Number.parseFloat(_effective_reward_acc5).toPrecision(9);

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


_expected_total_reward_acc6 =  _expected_reward_acc6_prop_1 + _expected_reward_acc6_prop_2 + _expected_reward_acc6_prop_3 + _expected_reward_acc6_prop_5 + _expected_reward_acc6_prop_6 + _expected_reward_acc6_prop_7;
 console.log('_expected_total_reward_acc6 is', _expected_total_reward_acc6);
// ---> because of significant figure issues we remove last 2 figures:
_expected_total_reward_acc6 = Number.parseFloat(_expected_total_reward_acc6).toPrecision(9);


_effective_reward_acc6 = web3.utils.fromWei(NEW_BALANCE_ACCOUNT_6, "ether" ) - web3.utils.fromWei(MID_BALANCE_ACCOUNT_6, "ether" );
//console.log('_effective_acc6 new ETI as REWARD:', _effective_reward_acc6);
// ---> because of significant figure issues we remove last 2 figures:
_effective_reward_acc6 = Number.parseFloat(_effective_reward_acc6).toPrecision(9);

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


_expected_total_reward_acc7 =  _expected_reward_acc7_prop_1 + _expected_reward_acc7_prop_2 + _expected_reward_acc7_prop_3 + _expected_reward_acc7_prop_5 + _expected_reward_acc7_prop_6 + _expected_reward_acc7_prop_7;
 console.log('_expected_total_reward_acc7 is', _expected_total_reward_acc7);
// ---> because of significant figure issues we remove last 2 figures:
_expected_total_reward_acc7 = Number.parseFloat(_expected_total_reward_acc7).toPrecision(9);


_effective_reward_acc7 = web3.utils.fromWei(NEW_BALANCE_ACCOUNT_7, "ether" ) - web3.utils.fromWei(MID_BALANCE_ACCOUNT_7, "ether" );
//console.log('_effective_acc7 new ETI as REWARD:', _effective_reward_acc7);
// ---> because of significant figure issues we remove last 2 figures:
_effective_reward_acc7 = Number.parseFloat(_effective_reward_acc7).toPrecision(9);

// acc6 should have gotten exactly the expected REWARD calculated by get_expected_reward() :
assert.equal( _effective_reward_acc7, _expected_total_reward_acc7); // 188.6335518176314 == _expected_reward_acc5_prop_4 + _expected_reward_acc5_prop_5

// --------------- ACCOUNT 7 -------------------  //


// RECHECKING PROPOSAL DATA AFTER CLAIMING
console.log('RECHECKING OF PROPOSALS DATA STARTED');
_proposal1 = await EticaReleaseProtocolTestPhase2Instance.propsdatas(IPFS1_WITH_FIRTDISEASEHASH);
assert.equal(_proposal1.nbvoters, '6', 'Proposal1 should have 6 nbvoters');

_proposal2 = await EticaReleaseProtocolTestPhase2Instance.propsdatas(IPFS2_WITH_FIRTDISEASEHASH);
assert.equal(_proposal2.nbvoters, '5', 'Proposal2 should have 5 nbvoters');

_proposal3 = await EticaReleaseProtocolTestPhase2Instance.propsdatas(IPFS3_WITH_FIRTDISEASEHASH);
assert.equal(_proposal3.nbvoters, '5', 'Proposal3 should have 5 nbvoters');

_proposal4 = await EticaReleaseProtocolTestPhase2Instance.propsdatas(IPFS4_WITH_FIRTDISEASEHASH);
assert.equal(_proposal4.nbvoters, '5', 'Proposal4 should have 5 nbvoters');

_proposal5 = await EticaReleaseProtocolTestPhase2Instance.propsdatas(IPFS5_WITH_FIRTDISEASEHASH);
assert.equal(_proposal5.nbvoters, '0', 'Proposal5 should have 0 nbvoters');

_proposal6 = await EticaReleaseProtocolTestPhase2Instance.propsdatas(IPFS6_WITH_FIRTDISEASEHASH);
assert.equal(_proposal6.nbvoters, '0', 'Proposal6 should have 0 nbvoters');

_proposal7 = await EticaReleaseProtocolTestPhase2Instance.propsdatas(IPFS7_WITH_FIRTDISEASEHASH);
assert.equal(_proposal7.nbvoters, '0', 'Proposal7 should have 0 nbvoters');

console.log('----------------->   PROPOSALS NBVOTERS CHECKED  <-----------------');


assert.equal(web3.utils.fromWei(_proposal1.forvotes.toString()), '650', 'Proposal1 should have 650 forvotes');
assert.equal(web3.utils.fromWei(_proposal1.againstvotes.toString()), '480', 'Proposal1 should have 480 against votes');

assert.equal(web3.utils.fromWei(_proposal2.forvotes.toString()), '535', 'Proposal2 should have 535 forvotes');
assert.equal(web3.utils.fromWei(_proposal2.againstvotes.toString()), '1400', 'Proposal1 should have 1400 against votes');

assert.equal(web3.utils.fromWei(_proposal3.forvotes.toString()), '600', 'Proposal3 should have 600 forvotes');
assert.equal(web3.utils.fromWei(_proposal3.againstvotes.toString()), '600', 'Proposal3 should have 500 against votes');

assert.equal(web3.utils.fromWei(_proposal4.forvotes.toString()), '160', 'Proposal4 should have 160 forvotes');
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

assert.equal(_proposal1.status, '1', 'Proposal1 status should be Accepted');
assert.equal(_proposal2.status, '0', 'Proposal2 status should be Rejected');
assert.equal(_proposal3.status, '0', 'Proposal3 status should be Rejected');
assert.equal(_proposal4.status, '1', 'Proposal4 status should be Accepted');
assert.equal(_proposal5.status, '0', 'Proposal5 status should be Rejected');
assert.equal(_proposal6.status, '0', 'Proposal6 status should be Rejected');
assert.equal(_proposal7.status, '0', 'Proposal7 status should be Rejected');

console.log('----------------->   PROPOSALS STATUS CHECKED  <-----------------');

assert.equal(web3.utils.fromWei(_proposal1.lastcuration_weight, "ether" ), '650', 'Proposal1 should have a lastcuration_weight of 650');
assert.equal(web3.utils.fromWei(_proposal2.lastcuration_weight, "ether" ), '1400', 'Proposal2 should have a lastcuration_weight of 1400');
assert.equal(web3.utils.fromWei(_proposal3.lastcuration_weight, "ether" ), '0', 'Proposal3 should have a lastcuration_weight of 0');
assert.equal(web3.utils.fromWei(_proposal4.lastcuration_weight, "ether" ), '160', 'Proposal4 should have a lastcuration_weight of 160');
assert.equal(web3.utils.fromWei(_proposal5.lastcuration_weight, "ether" ), '0', 'Proposal5 should have a lastcuration_weight of 0');
assert.equal(web3.utils.fromWei(_proposal6.lastcuration_weight, "ether" ), '0', 'Proposal6 should have a lastcuration_weight of 0');
assert.equal(web3.utils.fromWei(_proposal7.lastcuration_weight, "ether" ), '0', 'Proposal7 should have a lastcuration_weight of 0');

console.log('----------------->   PROPOSALS LASTCURATIONWEIGHT CHECKED  <-----------------');

assert.equal(web3.utils.fromWei(_proposal1.lasteditor_weight, "ether" ), '650', 'Proposal1 should have a lasteditor_weight of 650');
assert.equal(web3.utils.fromWei(_proposal2.lasteditor_weight, "ether" ), '0', 'Proposal2 should have a lasteditor_weight of 0');
assert.equal(web3.utils.fromWei(_proposal3.lasteditor_weight, "ether" ), '0', 'Proposal3 should have a lasteditor_weight of 0');
assert.equal(web3.utils.fromWei(_proposal4.lasteditor_weight, "ether" ), '160', 'Proposal4 should have a lasteditor_weight of 160');
assert.equal(web3.utils.fromWei(_proposal5.lasteditor_weight, "ether" ), '0', 'Proposal5 should have a lasteditor_weight of 0');
assert.equal(web3.utils.fromWei(_proposal6.lasteditor_weight, "ether" ), '0', 'Proposal6 should have a lasteditor_weight of 0');
assert.equal(web3.utils.fromWei(_proposal7.lasteditor_weight, "ether" ), '0', 'Proposal7 should have a lasteditor_weight of 0');

console.log('----------------->   PROPOSALS LASTEDITORWEIGHT CHECKED  <-----------------');

assert.equal(_proposal1.slashingratio.toNumber(), 1505, 'Proposal1 should have a slashingratio of 0.1505');
assert.equal(_proposal2.slashingratio.toNumber(), 4471, 'Proposal2 should have a slashingratio of 0.4471');
assert.equal(_proposal3.slashingratio.toNumber(), 0, 'Proposal3 should have a slashingratio of 0');
assert.equal(_proposal4.slashingratio.toNumber(), 10000, 'Proposal4 should have a slashingratio of 1');
assert.equal(_proposal5.slashingratio.toNumber(), 0, 'Proposal5 should have a slashingratio of 0');
assert.equal(_proposal6.slashingratio.toNumber(), 0, 'Proposal6 should have a slashingratio of 0');
assert.equal(_proposal7.slashingratio.toNumber(), 0, 'Proposal7 should have a slashingratio of 0');

console.log('----------------->   PROPOSALS SLASHINGRATIO CHECKED  <-----------------');

console.log('RECHECKING OF PROPOSALS DATA DONE WITH SUCCESS');
// RECHECKING PROPOSALDATA DONE

// RECHECKINKG PERIOD NB VOTERS
assert.equal(_period1.total_voters.toNumber(), 21, 'Period_1 should have 21 voters');
// RECHECKING PERIOD NB VOTERS

// TESTS GET ETICA BACK:
// Every account has made 2 stakes:
await stakeclmidx(test_account, 1);
await stakeclmidx(test_account, 1);


await should_fail_stakeclmidx(test_account2, 1); // test_account 2 should have been slashed for at least (4 minutes * 4 * 3 = 1266 seconds) and could not be able to claim this stake yet 
await stakeclmidx(test_account2, 2);

await stakeclmidx(test_account3, 1);
await stakeclmidx(test_account3, 1);


let _nbstakes_account4 = await EticaReleaseProtocolTestPhase2Instance.stakesCounters(test_account4.address);
console.log('_nbstakes_account4', _nbstakes_account4);
let acc4stake1 = await getstake(test_account4, 1);
let acc4stake2 = await getstake(test_account4, 2);
let acc4stake3 = await getstake(test_account4, 3);
let acc4stake4 = await getstake(test_account4, 4);
console.log('account4 stake 1 is', acc4stake1);
console.log('account4 stake 2 is', acc4stake2);
console.log('account4 stake 3 is', acc4stake3);
console.log('account4 stake 1 amount is', web3.utils.fromWei(acc4stake1.amount.toString()));
console.log('account4 stake 2 amount is', web3.utils.fromWei(acc4stake2.amount.toString()));
console.log('account4 stake 3 amount is', web3.utils.fromWei(acc4stake3.amount.toString()));
console.log('account4 stake 4 amount is', web3.utils.fromWei(acc4stake4.amount.toString()));
console.log('account4 stake 1 endTime is', acc4stake1.endTime.toString());
console.log('account4 stake 2 endTime is', acc4stake2.endTime.toString());
console.log('account4 stake 3 endTime is', acc4stake3.endTime.toString());
console.log('account4 stake 4 endTime is', acc4stake4.endTime.toString());
await should_fail_stakeclmidx(test_account4, 1); // test_account 4 should have been slashed (4 minutes * 4 * 3 = 1266 seconds) and could not be able to claim this stake yet
await stakeclmidx(test_account4, 4);

await stakeclmidx(test_account5, 1);
await stakeclmidx(test_account5, 1);

let _nbstakes_account6 = await EticaReleaseProtocolTestPhase2Instance.stakesCounters(test_account6.address);
console.log('_nbstakes_account6', _nbstakes_account4);
let acc6stake1 = await getstake(test_account6, 1);
let acc6stake2 = await getstake(test_account6, 2);
let acc6stake3 = await getstake(test_account6, 3);
let acc6stake4 = await getstake(test_account6, 4);
console.log('account6 stake 1 is', acc4stake1);
console.log('account6 stake 2 is', acc4stake2);
console.log('account6 stake 3 is', acc4stake3);
console.log('account6 stake 1 amount is', web3.utils.fromWei(acc6stake1.amount.toString()));
console.log('account6 stake 2 amount is', web3.utils.fromWei(acc6stake2.amount.toString()));
console.log('account6 stake 3 amount is', web3.utils.fromWei(acc6stake3.amount.toString()));
console.log('account6 stake 4 amount is', web3.utils.fromWei(acc6stake4.amount.toString()));
console.log('account6 stake 1 endTime is', acc6stake1.endTime.toString());
console.log('account6 stake 2 endTime is', acc6stake2.endTime.toString());
console.log('account6 stake 3 endTime is', acc6stake3.endTime.toString());
console.log('account6 stake 4 endTime is', acc6stake4.endTime.toString());
await should_fail_stakeclmidx(test_account6, 1); // test_account 6 should have been slashed for at least (4 minutes * 4 * 3 = 1266 seconds) and could not be able to claim this stake yet
await stakeclmidx(test_account6, 2);
await stakeclmidx(test_account6, 3);
await should_fail_stakeclmidx(test_account6, 4); // test_account 6 should have been slashed for at least (4 minutes * 4 * 3 = 1266 seconds) and could not be able to claim this stake yet

let _nbstakes_account7 = await EticaReleaseProtocolTestPhase2Instance.stakesCounters(test_account7.address);
console.log('_nbstakes_account7', _nbstakes_account7);
let acc7stake1 = await getstake(test_account7, 1);
let acc7stake2 = await getstake(test_account7, 2);
let acc7stake3 = await getstake(test_account7, 3);
console.log('account7 stake 1 is', acc7stake1);
console.log('account7 stake 2 is', acc7stake2);
console.log('account7 stake 3 is', acc7stake3);
console.log('account7 stake 1 amount is', web3.utils.fromWei(acc7stake1.amount.toString()));
console.log('account7 stake 2 amount is', web3.utils.fromWei(acc7stake2.amount.toString()));
console.log('account7 stake 3 amount is', web3.utils.fromWei(acc7stake3.amount.toString()));
console.log('account7 stake 1 endTime is', acc7stake1.endTime.toString());
console.log('account7 stake 2 endTime is', acc7stake2.endTime.toString());
console.log('account7 stake 3 endTime is', acc7stake3.endTime.toString());
await stakeclmidx(test_account7, 1);
await stakeclmidx(test_account7, 1);

// should fail to claim this stake as testaccount8has blocked eticas by commiting vote on proposal too late (after it's endvote).
// Thus was not able to revealvote of this proposal and thus could not unblocked those blocked eticas
await should_fail_stakeclmidx(test_account8, 1);
// should at least be able to unstake second stake as its amount is lower than the value of blocked eticas
await stakeclmidx(test_account8, 2);

// ------------ Stake Consolidation ------------- //

// ------------ Stake Snap ---------------------- //
// shoudl still fail to claim first stake:
await should_fail_stakeclmidx(test_account8, 1);
await should_fail_stakeclmidx(test_account8, 2);

// should fail to stakesnap with incorrect amount value:
await should_fail_stakesnap(test_account8, 1, '81');
await should_fail_stakesnap(test_account8, 1, '80');
await should_fail_stakesnap(test_account8, 1, '0');

// should be able to stakesnap with correct value:
await stakesnap(test_account8, 1, '75');

// should now be able to claim the stake 2 of 5 ETI because the stake of 80 ETI was snapped into 1 stake of 75 ETI and 1 stake of 5 ETI:
await stakeclmidx(test_account8, 2);


// ------------ Stake Snap ---------------------- //

  // ---------- FIRST ROW   --------------  //


  // begin the stakes of test.account
  await eticatobosom(test_account, '20');
  await eticatobosom(test_account, '12');
  await eticatobosom(test_account, '5');
  await eticatobosom(test_account, '8');
  await eticatobosom(test_account, '30');
  await eticatobosom(test_account, '10');
  await eticatobosom(test_account, '9');

  let _nbstakes_before_test_account = await EticaReleaseProtocolTestPhase2Instance.stakesCounters(test_account.address);
  console.log('_nbstakes_test_account before is', _nbstakes_before_test_account);
  assert.equal(_nbstakes_before_test_account, 7, 'test_account should have 7 stakes');

  let stake1 = await getstake(test_account, 1);
  console.log('stake1 amount is', web3.utils.fromWei(stake1.amount, "ether" ));
  console.log('stake1 startTime is', stake1.startTime.toString());
  console.log('stake1 endTime is', stake1.endTime.toString());

  let stake2 = await getstake(test_account, 2);
  //console.log('stake2 is', stake2);
  console.log('stake2 amount is', web3.utils.fromWei(stake2.amount, "ether" ));
  console.log('stake2 startTime is', stake2.startTime.toString());
  console.log('stake2 endTime is', stake2.endTime.toString());

  let stake3 = await getstake(test_account, 3);
  //console.log('stake3 is', stake3);
  console.log('stake3 amount is', web3.utils.fromWei(stake3.amount, "ether" ));
  console.log('stake3 startTime is', stake3.startTime.toString());
  console.log('stake3 endTime is', stake3.endTime.toString());

  let stake4 = await getstake(test_account, 4);
  //console.log('stake4 is', stake4);
  console.log('stake4 amount is', web3.utils.fromWei(stake4.amount, "ether" ));
  console.log('stake4 startTime is', stake4.startTime.toString());
  console.log('stake4 endTime is', stake4.endTime.toString());

  let stake5 = await getstake(test_account, 5);
  //console.log('stake5 is', stake5);
  console.log('stake5 amount is', web3.utils.fromWei(stake5.amount, "ether" ));
  console.log('stake5 startTime is', stake5.startTime.toString());
  console.log('stake5 endTime is', stake5.endTime.toString());

  let stake6 = await getstake(test_account, 6);
  //console.log('stake6 is', stake6);
  console.log('stake6 amount is', web3.utils.fromWei(stake6.amount, "ether" ));
  console.log('stake6 startTime is', stake6.startTime.toString());
  console.log('stake6 endTime is', stake6.endTime.toString());

  let stake7 = await getstake(test_account, 7);
  //console.log('stake7 is', stake7);
  console.log('stake7 amount is', web3.utils.fromWei(stake7.amount, "ether" ));
  console.log('stake7 startTime is', stake7.startTime.toString());
  console.log('stake7 endTime is', stake7.endTime.toString());


  let lastblock = await web3.eth.getBlock("latest");
  //console.log('lastest block is ', lastblock);
  console.log('lastblock.timestamp is ', lastblock.timestamp);
  let _new_endTime = lastblock.timestamp + 500;
  let _min_limit = lastblock.timestamp;

  await stakescsldt(test_account, _new_endTime, _min_limit, 7);
    /*
  Stakes expected new Order trhough the stakescsldt function process:

  First state: 1 | 2 | 3 | 4 | 5 | 6 | 7
  
  Second state: 7 | 2 | 3 | 4 | 5 | 6

  Third state: 7 | 6 | 3 | 4 | 5

  Fourth state: | 7 | 6 | 5 | 4

  Fith state: 5 | 6

  Sixth state: 6

  Result and expected state:  6 | NewConsolidatedStake

  */



  let _nbstakes_after_test_account = await EticaReleaseProtocolTestPhase2Instance.stakesCounters(test_account.address);
  console.log('_nbstakes_test_account after is', _nbstakes_after_test_account);
  assert.equal(_nbstakes_after_test_account, 2, 'test_account should have 2 stakes');


  let consolidatedstake1 = await getstake(test_account, 1);
  //console.log('consolidatedstake1 is', consolidatedstake1);
  console.log('consolidatedstake1 amount is', web3.utils.fromWei(consolidatedstake1.amount, "ether" ));
  console.log('consolidatedstake1 startTime is', consolidatedstake1.startTime.toString());
  console.log('consolidatedstake1 endTime is', consolidatedstake1.endTime.toString());
  assert.equal(web3.utils.fromWei(consolidatedstake1.amount, "ether" ), 10, 'test_account consolidatedstake1 amount should be 10 ETI');
  assert.equal(consolidatedstake1.endTime.toString(), stake6.endTime.toString(), 'test_account consolidatedstake1 endTime should equal stake6 endTime');
  assert.equal(consolidatedstake1.startTime.toString(), stake6.startTime.toString(), 'test_account consolidatedstake1 startTime should equal stake6 startTime');

  let consolidatedstake2 = await getstake(test_account, 2);
  //console.log('consolidatedstake2 is', consolidatedstake2);
  console.log('consolidatedstake2 amount is', web3.utils.fromWei(consolidatedstake2.amount, "ether" ));
  console.log('consolidatedstake2 startTime is', consolidatedstake2.startTime.toString());
  console.log('consolidatedstake2 endTime is', consolidatedstake2.endTime.toString());
  assert.equal(web3.utils.fromWei(consolidatedstake2.amount, "ether" ), 84, 'test_account consolidatedstake2 amount should be 84 ETI');
  assert.equal(consolidatedstake2.endTime.toNumber(), _new_endTime, 'test_account consolidatedstake2 endTime should equal _new_endTime');

  // --- ONLY 2 STAKES SHOULD REMAIN THE REST MUST HAVE BEEN DELETED ---- //
  let consolidatedstake3 = await getstake(test_account, 3);
  //console.log('consolidatedstake3 is', consolidatedstake3);
  console.log('consolidatedstake3 amount is', web3.utils.fromWei(consolidatedstake3.amount, "ether" ));
  console.log('consolidatedstake3 startTime is', consolidatedstake3.startTime.toString());
  console.log('consolidatedstake3 endTime is', consolidatedstake3.endTime.toString());
  assert.equal(web3.utils.fromWei(consolidatedstake3.amount, "ether" ), 0, 'test_account consolidatedstake3 amount should be 0 ETI');

  let consolidatedstake4 = await getstake(test_account, 4);
  //console.log('consolidatedstake4 is', consolidatedstake4);
  console.log('consolidatedstake4 amount is', web3.utils.fromWei(consolidatedstake4.amount, "ether" ));
  console.log('consolidatedstake4 startTime is', consolidatedstake4.startTime.toString());
  console.log('consolidatedstake4 endTime is', consolidatedstake4.endTime.toString());
  assert.equal(web3.utils.fromWei(consolidatedstake4.amount, "ether" ), 0, 'test_account consolidatedstake4 amount should be 0 ETI');

  let consolidatedstake5 = await getstake(test_account, 5);
  //console.log('consolidatedstake5 is', consolidatedstake5);
  console.log('consolidatedstake5 amount is', web3.utils.fromWei(consolidatedstake5.amount, "ether" ));
  console.log('consolidatedstake5 startTime is', consolidatedstake5.startTime.toString());
  console.log('consolidatedstake5 endTime is', consolidatedstake5.endTime.toString());
  assert.equal(web3.utils.fromWei(consolidatedstake5.amount, "ether" ), 0, 'test_account consolidatedstake5 amount should be 0 ETI');

  let consolidatedstake6 = await getstake(test_account, 6);
  //console.log('consolidatedstake6 is', consolidatedstake6);
  console.log('consolidatedstake6 amount is', web3.utils.fromWei(consolidatedstake6.amount, "ether" ));
  console.log('consolidatedstake6 startTime is', consolidatedstake6.startTime.toString());
  console.log('consolidatedstake6 endTime is', consolidatedstake6.endTime.toString());
  assert.equal(web3.utils.fromWei(consolidatedstake6.amount, "ether" ), 0, 'test_account consolidatedstake6 amount should be 0 ETI');

  let consolidatedstake7 = await getstake(test_account, 7);
  //console.log('consolidatedstake7 is', consolidatedstake7);
  console.log('consolidatedstake7 amount is', web3.utils.fromWei(consolidatedstake7.amount, "ether" ));
  console.log('consolidatedstake7 startTime is', consolidatedstake7.startTime.toString());
  console.log('consolidatedstake7 endTime is', consolidatedstake7.endTime.toString());
  assert.equal(web3.utils.fromWei(consolidatedstake7.amount, "ether" ), 0, 'test_account consolidatedstake7 amount should be 0 ETI');

  // --- ONLY 2 STAKES SHOULD REMAIN THE REST MUST HAVE BEEN DELETED ---- //

      // should fail to consolidate the stakes:
      await should_fail_to_stakescsldt(test_account, _new_endTime, _min_limit, 101); // never allow more than 100 for the loop
      await should_fail_to_stakescsldt(test_account, _new_endTime, _min_limit, 3); // test_account has only 2 stakes
      await should_fail_to_stakescsldt(test_account, _new_endTime, _min_limit, 4); // test_account has only 2 stakes
      await should_fail_to_stakescsldt(test_account, _new_endTime, _min_limit, 5); // test_account has only 2 stakes
      await should_fail_to_stakescsldt(test_account, _new_endTime, _min_limit, 6); // test_account has only 2 stakes
      await should_fail_to_stakescsldt(test_account, _new_endTime, _min_limit, 7); // test_account has only 2 stakes
      await should_fail_to_stakescsldt(test_account, _new_endTime, _min_limit, 8); // test_account has only 2 stakes
    
      // -------  should FAIL TO CONSOLIDATE WITH OUT OF RANGE PARAMS --- //

       // ---------- FIRST ROW   --------------  //

  // ---------- SECOND ROW   --------------  //

  // begin the stakes of test.account
  await eticatobosom(test_account3, '2');
  await eticatobosom(test_account3, '5');
  await eticatobosom(test_account3, '9');
  await eticatobosom(test_account3, '15');
  await eticatobosom(test_account3, '10');
  await eticatobosom(test_account3, '1');
  await eticatobosom(test_account3, '3.3');

  let _nbstakes_before_test_account3 = await EticaReleaseProtocolTestPhase2Instance.stakesCounters(test_account3.address);
  console.log('_nbstakes_test_account3 before is', _nbstakes_before_test_account3);
  assert.equal(_nbstakes_before_test_account3, 7, 'test_account should have 7 stakes');

  let stake1_acc3 = await getstake(test_account3, 1);
  console.log('stake1_acc3 amount is', web3.utils.fromWei(stake1_acc3.amount, "ether" ));
  console.log('stake1_acc3 startTime is', stake1_acc3.startTime.toString());
  console.log('stake1_acc3 endTime is', stake1_acc3.endTime.toString());

  let stake2_acc3 = await getstake(test_account3, 2);
  //console.log('stake2_acc3 is', stake2_acc3);
  console.log('stake2_acc3 amount is', web3.utils.fromWei(stake2_acc3.amount, "ether" ));
  console.log('stake2_acc3 startTime is', stake2_acc3.startTime.toString());
  console.log('stake2_acc3 endTime is', stake2_acc3.endTime.toString());

  let stake3_acc3 = await getstake(test_account3, 3);
  //console.log('stake3_acc3 is', stake3_acc3);
  console.log('stake3_acc3 amount is', web3.utils.fromWei(stake3_acc3.amount, "ether" ));
  console.log('stake3_acc3 startTime is', stake3_acc3.startTime.toString());
  console.log('stake3_acc3 endTime is', stake3_acc3.endTime.toString());

  let stake4_acc3 = await getstake(test_account3, 4);
  //console.log('stake4_acc3 is', stake4_acc3);
  console.log('stake4_acc3 amount is', web3.utils.fromWei(stake4_acc3.amount, "ether" ));
  console.log('stake4_acc3 startTime is', stake4_acc3.startTime.toString());
  console.log('stake4_acc3 endTime is', stake4_acc3.endTime.toString());

  let stake5_acc3 = await getstake(test_account3, 5);
  //console.log('stake5_acc3 is', stake5_acc3);
  console.log('stake5_acc3 amount is', web3.utils.fromWei(stake5_acc3.amount, "ether" ));
  console.log('stake5_acc3 startTime is', stake5_acc3.startTime.toString());
  console.log('stake5_acc3 endTime is', stake5_acc3.endTime.toString());

  let stake6_acc3 = await getstake(test_account3, 6);
  //console.log('stake6_acc3 is', stake6_acc3);
  console.log('stake6_acc3 amount is', web3.utils.fromWei(stake6_acc3.amount, "ether" ));
  console.log('stake6_acc3 startTime is', stake6_acc3.startTime.toString());
  console.log('stake6_acc3 endTime is', stake6_acc3.endTime.toString());

  let stake7_acc3 = await getstake(test_account3, 7);
  //console.log('stake7_acc3 is', stake7_acc3);
  console.log('stake7_acc3 amount is', web3.utils.fromWei(stake7_acc3.amount, "ether" ));
  console.log('stake7_acc3 startTime is', stake7_acc3.startTime.toString());
  console.log('stake7_acc3 endTime is', stake7_acc3.endTime.toString());


  lastblock = await web3.eth.getBlock("latest");
  //console.log('lastest block is ', lastblock);
  console.log('lastblock.timestamp is ', lastblock.timestamp);
  _new_endTime = lastblock.timestamp + 500;
  _min_limit = stake1_acc3.endTime; // all 7 Stakes should be concerned;

  await advanceminutes(20); // advances 20 seconds to pass at least one block so that NewConsolidatedStake has a endTime superior to 7 first stakes
  
  
  // consolidates the stakes:
  await stakescsldt(test_account3, _new_endTime, _min_limit, 2);
    /*
  Stakes expected new Order trhough the stakescsldt function process:

  First state: 1 | 2 | 3 | 4 | 5 | 6 | 7
  
  Second state: 7 | 2 | 3 | 4 | 5 | 6

  Third state: 7 | 6 | 3 | 4 | 5

  Result and expected state:  7 | 6 | 3 | 4 | 5 | NewConsolidatedStake

  */

  let _nbstakes_after_test_account3 = await EticaReleaseProtocolTestPhase2Instance.stakesCounters(test_account3.address);
  console.log('_nbstakes_test_account3 after is', _nbstakes_after_test_account3);
  assert.equal(_nbstakes_after_test_account3, 6, 'test_account3 should have 6 stakes');

  let consolidatedstake1_acc3 = await getstake(test_account3, 1);
  //console.log('consolidatedstake1_acc3 is', consolidatedstake1_acc3);
  console.log('consolidatedstake1_acc3 amount is', web3.utils.fromWei(consolidatedstake1_acc3.amount, "ether" ));
  console.log('consolidatedstake1_acc3 startTime is', consolidatedstake1_acc3.startTime.toString());
  console.log('consolidatedstake1_acc3 endTime is', consolidatedstake1_acc3.endTime.toString());
  assert.equal(web3.utils.fromWei(consolidatedstake1_acc3.amount, "ether" ), web3.utils.fromWei(stake7_acc3.amount, "ether" ), 'test_account3 consolidatedstake1_acc3 amount should equal stake7 amount');
  assert.equal(consolidatedstake1_acc3.endTime.toString(), stake7_acc3.endTime.toString(), 'test_account3 consolidatedstake1_acc3 endTime should equal stake7_acc3 endTime');
  assert.equal(consolidatedstake1_acc3.startTime.toString(), stake7_acc3.startTime.toString(), 'test_account3 consolidatedstake1_acc3 startTime should equal stake7_acc3 startTime');

  let consolidatedstake2_acc3 = await getstake(test_account3, 2);
  //console.log('consolidatedstake2_acc3 is', consolidatedstake2_acc3);
  console.log('consolidatedstake2_acc3 amount is', web3.utils.fromWei(consolidatedstake2_acc3.amount, "ether" ));
  console.log('consolidatedstake2_acc3 startTime is', consolidatedstake2_acc3.startTime.toString());
  console.log('consolidatedstake2_acc3 endTime is', consolidatedstake2_acc3.endTime.toString());
  assert.equal(web3.utils.fromWei(consolidatedstake2_acc3.amount, "ether" ), web3.utils.fromWei(stake6_acc3.amount, "ether" ), 'test_account3 consolidatedstake2_acc3 amount should equal stake6_acc3 amount');
  assert.equal(consolidatedstake2_acc3.endTime.toString(), stake6_acc3.endTime.toString(), 'test_account3 consolidatedstake2_acc3 endTime should equal _new_endTime');
  assert.equal(consolidatedstake2_acc3.startTime.toString(), stake6_acc3.startTime.toString(), 'test_account3 consolidatedstake2_acc3 startTime should equal stake6_acc3 startTime');


  let consolidatedstake3_acc3 = await getstake(test_account3, 3);
  //console.log('consolidatedstake3_acc3 is', consolidatedstake3_acc3);
  console.log('consolidatedstake3_acc3 amount is', web3.utils.fromWei(consolidatedstake3_acc3.amount, "ether" ));
  console.log('consolidatedstake3_acc3 startTime is', consolidatedstake3_acc3.startTime.toString());
  console.log('consolidatedstake3_acc3 endTime is', consolidatedstake3_acc3.endTime.toString());
  assert.equal(web3.utils.fromWei(consolidatedstake3_acc3.amount, "ether" ), web3.utils.fromWei(stake3_acc3.amount, "ether" ), 'test_account3 consolidatedstake3_acc3 amount should equal stake3 amount');
  assert.equal(consolidatedstake3_acc3.endTime.toString(), stake3_acc3.endTime.toString(), 'test_account3 consolidatedstake3_acc3 endTime should equal stake3_acc3 endTime');
  assert.equal(consolidatedstake3_acc3.startTime.toString(), stake3_acc3.startTime.toString(), 'test_account3 consolidatedstake3_acc3 startTime should equal stake3_acc3 startTime');

  let consolidatedstake4_acc3 = await getstake(test_account3, 4);
  //console.log('consolidatedstake4_acc3 is', consolidatedstake4_acc3);
  console.log('consolidatedstake4_acc3 amount is', web3.utils.fromWei(consolidatedstake4_acc3.amount, "ether" ));
  console.log('consolidatedstake4_acc3 startTime is', consolidatedstake4_acc3.startTime.toString());
  console.log('consolidatedstake4_acc3 endTime is', consolidatedstake4_acc3.endTime.toString());
  assert.equal(web3.utils.fromWei(consolidatedstake4_acc3.amount, "ether" ), web3.utils.fromWei(stake4_acc3.amount, "ether" ), 'test_account3 consolidatedstake4_acc3 amount should equal stake4 amount');
  assert.equal(consolidatedstake4_acc3.endTime.toString(), stake4_acc3.endTime.toString(), 'test_account3 consolidatedstake4_acc3 endTime should equal stake4_acc3 endTime');
  assert.equal(consolidatedstake4_acc3.startTime.toString(), stake4_acc3.startTime.toString(), 'test_account3 consolidatedstake4_acc3 startTime should equal stake4_acc3 startTime');

  let consolidatedstake5_acc3 = await getstake(test_account3, 5);
  //console.log('consolidatedstake5_acc3 is', consolidatedstake5_acc3);
  console.log('consolidatedstake5_acc3 amount is', web3.utils.fromWei(consolidatedstake5_acc3.amount, "ether" ));
  console.log('consolidatedstake5_acc3 startTime is', consolidatedstake5_acc3.startTime.toString());
  console.log('consolidatedstake5_acc3 endTime is', consolidatedstake5_acc3.endTime.toString());
  assert.equal(web3.utils.fromWei(consolidatedstake5_acc3.amount, "ether" ), web3.utils.fromWei(stake5_acc3.amount, "ether" ), 'test_account3 consolidatedstake5_acc3 amount should equal stake5 amount');
  assert.equal(consolidatedstake5_acc3.endTime.toString(), stake5_acc3.endTime.toString(), 'test_account3 consolidatedstake5_acc3 endTime should equal stake5_acc3 endTime');
  assert.equal(consolidatedstake5_acc3.startTime.toString(), stake5_acc3.startTime.toString(), 'test_account3 consolidatedstake5_acc3 startTime should equal stake5_acc3 startTime');

  // The Newly created and Consolidated Stake:
  let consolidatedstake6_acc3 = await getstake(test_account3, 6);
  //console.log('consolidatedstake6_acc3 is', consolidatedstake6_acc3);
  console.log('consolidatedstake6_acc3 amount is', web3.utils.fromWei(consolidatedstake6_acc3.amount, "ether" ));
  console.log('consolidatedstake6_acc3 startTime is', consolidatedstake6_acc3.startTime.toString());
  console.log('consolidatedstake6_acc3 endTime is', consolidatedstake6_acc3.endTime.toString());
  assert.equal(web3.utils.fromWei(consolidatedstake6_acc3.amount, "ether" ), 7, 'test_account3 consolidatedstake6_acc3 amount should be 7 ETI');
  assert.equal(consolidatedstake6_acc3.endTime.toNumber(), _new_endTime, 'test_account3 consolidatedstake6_acc3 endTime should equal _new_endTime');
  assert(consolidatedstake6_acc3.startTime.toNumber() >= lastblock.timestamp, 'test_account3 consolidatedstake6_acc3 starTime should be greater than or equal to latest block timestamp');


  // --- ONLY 6 STAKES SHOULD REMAIN THE REST MUST HAVE BEEN DELETED ---- //
  let consolidatedstake7_acc3 = await getstake(test_account3, 7);
  //console.log('consolidatedstake7_acc3 is', consolidatedstake7_acc3);
  console.log('consolidatedstake7_acc3 amount is', web3.utils.fromWei(consolidatedstake7_acc3.amount, "ether" ));
  console.log('consolidatedstake7_acc3 startTime is', consolidatedstake7_acc3.startTime.toString());
  console.log('consolidatedstake7_acc3 endTime is', consolidatedstake7_acc3.endTime.toString());
  assert.equal(web3.utils.fromWei(consolidatedstake7_acc3.amount, "ether" ), 0, 'test_account3 consolidatedstake7_acc3 amount should be 0 ETI');

  // --- ONLY 6 STAKES SHOULD REMAIN THE REST MUST HAVE BEEN DELETED ---- //

    // should fail to consolidate the stakes:
    await should_fail_to_stakescsldt(test_account3, _new_endTime, _min_limit, 101); // never allow more than 100 for the loop
    await should_fail_to_stakescsldt(test_account3, _new_endTime, _min_limit, 7); // test_account3 has only 6 stakes
    // should fail to consolidate the stakes


    lastblock = await web3.eth.getBlock("latest");
    //console.log('lastest block is ', lastblock);
    console.log('lastblock.timestamp is ', lastblock.timestamp);
  
    _min_limit = _new_endTime; // only NewConsolidatedStake and Stake9 should be concerned
    _new_endTime = lastblock.timestamp + 500;

  
    // creates the nineth stake:
    await eticatobosom(test_account3, '2');
    let stake9_acc3 = await getstake(test_account3, 7);
    //console.log('stake9_acc3 is', stake7_acc3);


    // should fail to consolidate the stakes:
    await should_fail_to_stakescsldt(test_account3, _new_endTime, _min_limit, 8); // test_account3 has only 7 stakes
    // should fail to consolidate the stakes
    

 // consolidates the stakes:
 await stakescsldt(test_account3, _new_endTime, _min_limit, 7);
  /*
  Stakes expected new Order trhough the stakescsldt function process:

  First state: 7 | 6 | 3 | 4 | 5 | NewConsolidatedStake | 9
  
  Second state: 7 | 6 | 3 | 4 | 5 | NewConsolidatedStake | 9

  Third state: 7 | 6 | 3 | 4 | 5 | NewConsolidatedStake | 9

  Fourth state : 7 | 6 | 3 | 4 | 5 | NewConsolidatedStake | 9

  Fifth state: 7 | 6 | 3 | 4 | 5 | NewConsolidatedStake | 9

  sixth state: 7 | 6 | 3 | 4 | 5 | 9

  sevnth state: 7 | 6 | 3 | 4 | 5

  Result and expected state:  7 | 6 | 3 | 4 | 5 | NewConsolidatedStake2

  */

 console.log('stake7_acc3 amount is', web3.utils.fromWei(stake7_acc3.amount, "ether" ));
 console.log('stake7_acc3 startTime is', stake7_acc3.startTime.toString());
 console.log('stake7_acc3 endTime is', stake7_acc3.endTime.toString());

 let _nbstakes_after_test_account3_2 = await EticaReleaseProtocolTestPhase2Instance.stakesCounters(test_account3.address);
 console.log('_nbstakes_test_account3_2 after is', _nbstakes_after_test_account3_2);
 assert.equal(_nbstakes_after_test_account3_2, 6, 'test_account3 should have 6 stakes');


 let consolidatedstake1_acc3_2 = await getstake(test_account3, 1);
 //console.log('consolidatedstake1_acc3_2 is', consolidatedstake1_acc3_2);
 console.log('consolidatedstake1_acc3_2 amount is', web3.utils.fromWei(consolidatedstake1_acc3_2.amount, "ether" ));
 console.log('consolidatedstake1_acc3_2 startTime is', consolidatedstake1_acc3_2.startTime.toString());
 console.log('consolidatedstake1_acc3_2 endTime is', consolidatedstake1_acc3_2.endTime.toString());
 assert.equal(web3.utils.fromWei(consolidatedstake1_acc3_2.amount, "ether" ), web3.utils.fromWei(stake7_acc3.amount, "ether" ), 'test_account3 consolidatedstake1_acc3_2 amount should equal stake7 amount');
 assert.equal(consolidatedstake1_acc3_2.endTime.toString(), stake7_acc3.endTime.toString(), 'test_account3 consolidatedstake1_acc3_2 endTime should equal stake7_acc3 endTime');
 assert.equal(consolidatedstake1_acc3_2.startTime.toString(), stake7_acc3.startTime.toString(), 'test_account3 consolidatedstake1_acc3_2 startTime should equal stake7_acc3 startTime');

 let consolidatedstake2_acc3_2 = await getstake(test_account3, 2);
 //console.log('consolidatedstake2_acc3_2 is', consolidatedstake2_acc3_2);
 console.log('consolidatedstake2_acc3_2 amount is', web3.utils.fromWei(consolidatedstake2_acc3_2.amount, "ether" ));
 console.log('consolidatedstake2_acc3_2 startTime is', consolidatedstake2_acc3_2.startTime.toString());
 console.log('consolidatedstake2_acc3_2 endTime is', consolidatedstake2_acc3_2.endTime.toString());
 assert.equal(web3.utils.fromWei(consolidatedstake2_acc3_2.amount, "ether" ), web3.utils.fromWei(stake6_acc3.amount, "ether" ), 'test_account3 consolidatedstake2_acc3_2 amount should equal stake6_acc3 amount');
 assert.equal(consolidatedstake2_acc3_2.endTime.toString(), stake6_acc3.endTime.toString(), 'test_account3 consolidatedstake2_acc3_2 endTime should equal _new_endTime');
 assert.equal(consolidatedstake2_acc3_2.startTime.toString(), stake6_acc3.startTime.toString(), 'test_account3 consolidatedstake2_acc3_2 startTime should equal stake6_acc3 startTime');


 let consolidatedstake3_acc3_2 = await getstake(test_account3, 3);
 //console.log('consolidatedstake3_acc3_2 is', consolidatedstake3_acc3_2);
 console.log('consolidatedstake3_acc3_2 amount is', web3.utils.fromWei(consolidatedstake3_acc3_2.amount, "ether" ));
 console.log('consolidatedstake3_acc3_2 startTime is', consolidatedstake3_acc3_2.startTime.toString());
 console.log('consolidatedstake3_acc3_2 endTime is', consolidatedstake3_acc3_2.endTime.toString());
 assert.equal(web3.utils.fromWei(consolidatedstake3_acc3_2.amount, "ether" ), web3.utils.fromWei(stake3_acc3.amount, "ether" ), 'test_account3 consolidatedstake3_acc3_2 amount should equal stake3 amount');
 assert.equal(consolidatedstake3_acc3_2.endTime.toString(), stake3_acc3.endTime.toString(), 'test_account3 consolidatedstake3_acc3_2 endTime should equal stake3_acc3 endTime');
 assert.equal(consolidatedstake3_acc3_2.startTime.toString(), stake3_acc3.startTime.toString(), 'test_account3 consolidatedstake3_acc3_2 startTime should equal stake3_acc3 startTime');

 let consolidatedstake4_acc3_2 = await getstake(test_account3, 4);
 //console.log('consolidatedstake4_acc3_2 is', consolidatedstake4_acc3_2);
 console.log('consolidatedstake4_acc3_2 amount is', web3.utils.fromWei(consolidatedstake4_acc3_2.amount, "ether" ));
 console.log('consolidatedstake4_acc3_2 startTime is', consolidatedstake4_acc3_2.startTime.toString());
 console.log('consolidatedstake4_acc3_2 endTime is', consolidatedstake4_acc3_2.endTime.toString());
 assert.equal(web3.utils.fromWei(consolidatedstake4_acc3_2.amount, "ether" ), web3.utils.fromWei(stake4_acc3.amount, "ether" ), 'test_account3 consolidatedstake4_acc3_2 amount should equal stake4 amount');
 assert.equal(consolidatedstake4_acc3_2.endTime.toString(), stake4_acc3.endTime.toString(), 'test_account3 consolidatedstake4_acc3_2 endTime should equal stake4_acc3 endTime');
 assert.equal(consolidatedstake4_acc3_2.startTime.toString(), stake4_acc3.startTime.toString(), 'test_account3 consolidatedstake4_acc3_2 startTime should equal stake4_acc3 startTime');

 let consolidatedstake5_acc3_2 = await getstake(test_account3, 5);
 //console.log('consolidatedstake5_acc3_2 is', consolidatedstake5_acc3_2);
 console.log('consolidatedstake5_acc3_2 amount is', web3.utils.fromWei(consolidatedstake5_acc3_2.amount, "ether" ));
 console.log('consolidatedstake5_acc3_2 startTime is', consolidatedstake5_acc3_2.startTime.toString());
 console.log('consolidatedstake5_acc3_2 endTime is', consolidatedstake5_acc3_2.endTime.toString());
 assert.equal(web3.utils.fromWei(consolidatedstake5_acc3_2.amount, "ether" ), web3.utils.fromWei(stake5_acc3.amount, "ether" ), 'test_account3 consolidatedstake5_acc3_2 amount should equal stake5 amount');
 assert.equal(consolidatedstake5_acc3_2.endTime.toString(), stake5_acc3.endTime.toString(), 'test_account3 consolidatedstake5_acc3_2 endTime should equal stake5_acc3 endTime');
 assert.equal(consolidatedstake5_acc3_2.startTime.toString(), stake5_acc3.startTime.toString(), 'test_account3 consolidatedstake5_acc3_2 startTime should equal stake5_acc3 startTime');


   // The Newly created and Consolidated Stake:
   let consolidatedstake6_acc3_2 = await getstake(test_account3, 6);
   //console.log('consolidatedstake6_acc3 is', consolidatedstake6_acc3);
   console.log('consolidatedstake6_acc3_2 amount is', web3.utils.fromWei(consolidatedstake6_acc3_2.amount, "ether" ));
   console.log('consolidatedstake6_acc3_2 startTime is', consolidatedstake6_acc3_2.startTime.toString());
   console.log('consolidatedstake6_acc3_2 endTime is', consolidatedstake6_acc3_2.endTime.toString());
   assert.equal(web3.utils.fromWei(consolidatedstake6_acc3_2.amount, "ether" ), 9, 'test_account3 consolidatedstake6_acc3_2 amount should be 9 ETI');
   assert.equal(consolidatedstake6_acc3_2.endTime.toNumber(), _new_endTime, 'test_account3 consolidatedstake6_acc3_2 endTime should equal _new_endTime');
   assert(consolidatedstake6_acc3_2.startTime.toNumber() >= lastblock.timestamp, 'test_account3 consolidatedstake6_acc3_2 starTime should be greater than or equal to latest block timestamp');
 
 
   // --- ONLY 6 STAKES SHOULD REMAIN THE REST MUST HAVE BEEN DELETED ---- //
   let consolidatedstake7_acc3_2 = await getstake(test_account3, 7);
   //console.log('consolidatedstake7_acc3_2 is', consolidatedstake7_acc3_2);
   console.log('consolidatedstake7_acc3_2 amount is', web3.utils.fromWei(consolidatedstake7_acc3_2.amount, "ether" ));
   console.log('consolidatedstake7_acc3_2 startTime is', consolidatedstake7_acc3_2.startTime.toString());
   console.log('consolidatedstake7_acc3_2 endTime is', consolidatedstake7_acc3_2.endTime.toString());
   assert.equal(web3.utils.fromWei(consolidatedstake7_acc3_2.amount, "ether" ), 0, 'test_account3 consolidatedstake7_acc3_2 amount should be 0 ETI');
 // --- ONLY 6 STAKES SHOULD REMAIN THE REST MUST HAVE BEEN DELETED ---- //

// -- TEST 2 YEAR LIMIT OF _endTime -- //
     // should fail to consolidate the stakes:
     await should_fail_to_stakescsldt(test_account3, _new_endTime, _min_limit, 8); // test_account3 has only 7 stakes
     let _more_than_2_years = lastblock.timestamp + 63075000; // 31536000 seconds = 1 year ==> 31536000 * 2 = 63 072 000 = 2 years
     await should_fail_to_stakescsldt(test_account3, _more_than_2_years, _min_limit, 6); // cannot consolidate with _endTime over 2 years
     // should fail to consolidate the stakes

      // consolidating just under 2 years should work:
      let _just_under_2_years = _more_than_2_years - 4000; // 31536000 seconds = 2 years
      await stakescsldt(test_account3, _just_under_2_years, _min_limit, 6);
// -- TEST 2 YEAR LIMIT OF _endTime -- //      

       // ---------- SECOND ROW   --------------  //



// ------------ Stake Consolidation -------------- //


// ----------------------  Make same tests for next Period ----------------------------- //

console.log('<--------------------------- ENTERING TESTS OF NEXT PERIOD I ---------------------------------- >');

// advance time so that we enter next period: 
await advanceseconds(REWARD_INTERVAL);

// --------------------- Making same tests but for next Period -----------------------------:

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

let IPFS1B = randomipfs();
let IPFS2B = randomipfs();
let IPFS3B = randomipfs();
let IPFS4B = randomipfs();
let IPFS5B = randomipfs();
let IPFS6B = randomipfs();
let IPFS7B = randomipfs();
let IPFS8B = randomipfs();


// Retrieve BLOCKEDETICAS:
OLD_BLOCKED_ETI_TEST_ACCOUNT = await EticaReleaseProtocolTestPhase2Instance.blockedeticas(test_account.address);
OLD_BLOCKED_ETI_TEST_ACCOUNT_2 = await EticaReleaseProtocolTestPhase2Instance.blockedeticas(test_account2.address);
OLD_BLOCKED_ETI_TEST_ACCOUNT_3 = await EticaReleaseProtocolTestPhase2Instance.blockedeticas(test_account3.address);
OLD_BLOCKED_ETI_TEST_ACCOUNT_4 = await EticaReleaseProtocolTestPhase2Instance.blockedeticas(test_account4.address);
OLD_BLOCKED_ETI_TEST_ACCOUNT_5 = await EticaReleaseProtocolTestPhase2Instance.blockedeticas(test_account5.address);
OLD_BLOCKED_ETI_TEST_ACCOUNT_6 = await EticaReleaseProtocolTestPhase2Instance.blockedeticas(test_account6.address);
OLD_BLOCKED_ETI_TEST_ACCOUNT_7 = await EticaReleaseProtocolTestPhase2Instance.blockedeticas(test_account7.address);

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

await createproposal(test_account, EXPECTED_FIRST_DISEASE_HASH, "Title 1 Malaria", "Description 1", IPFS1B, "", "", "Targets:[one_target_here,another_target_here]","Compounds:[one_compound_here, another_compound_here]","Use this field as the community created standards");
await createproposal(test_account2, EXPECTED_FIRST_DISEASE_HASH, "Title 2 Malaria", "Description 2", IPFS2B, "", "", "Targets:[one_target_here,another_target_here]","Compounds:[one_compound_here, another_compound_here]","Use this field as the community created standards");
await createproposal(test_account3, EXPECTED_FIRST_DISEASE_HASH, "Title 3 Malaria", "Description 3", IPFS3B, "", "", "Targets:[one_target_here,another_target_here]","Compounds:[one_compound_here, another_compound_here]","Use this field as the community created standards");
await createproposal(test_account4, EXPECTED_FIRST_DISEASE_HASH, "Title 4 Malaria", "Description 4", IPFS4B, "", "", "Targets:[one_target_here,another_target_here]","Compounds:[one_compound_here, another_compound_here]","Use this field as the community created standards");
await createproposal(test_account5, EXPECTED_FIRST_DISEASE_HASH, "Title 5 Malaria", "Description 5", IPFS5B, "", "", "Targets:[one_target_here,another_target_here]","Compounds:[one_compound_here, another_compound_here]","Use this field as the community created standards");
await createproposal(test_account5, EXPECTED_FIRST_DISEASE_HASH, "Title 6 Malaria", "Description 6", IPFS6B, IPFS7B, "", "Targets:[one_target_here,another_target_here]","Compounds:[one_compound_here, another_compound_here]","Use this field as the community created standards");
await createproposal(test_account5, EXPECTED_FIRST_DISEASE_HASH, "Title 7 Malaria", "Description 7", IPFS7B, "", IPFS8B, "Targets:[one_target_here,another_target_here]","Compounds:[one_compound_here, another_compound_here]","Use this field as the community created standards");

// should fail to duplicate a proposal whose raw_release_hash and disease_hash have already been stored into the system:
await should_fail_propose(test_account, EXPECTED_FIRST_DISEASE_HASH, "Title 8 Malaria", "Description 8", IPFS1B, "", "", "Targets:[one_target_here,another_target_here]","Compounds:[one_compound_here, another_compound_here]","Use this field as the community created standards");

let IPFS1B_WITH_FIRTDISEASEHASH = get_expected_keccak256_hash_two(IPFS1B, EXPECTED_FIRST_DISEASE_HASH);
let IPFS2B_WITH_FIRTDISEASEHASH = get_expected_keccak256_hash_two(IPFS2B, EXPECTED_FIRST_DISEASE_HASH);
let IPFS3B_WITH_FIRTDISEASEHASH = get_expected_keccak256_hash_two(IPFS3B, EXPECTED_FIRST_DISEASE_HASH);
let IPFS4B_WITH_FIRTDISEASEHASH = get_expected_keccak256_hash_two(IPFS4B, EXPECTED_FIRST_DISEASE_HASH);
let IPFS5B_WITH_FIRTDISEASEHASH = get_expected_keccak256_hash_two(IPFS5B, EXPECTED_FIRST_DISEASE_HASH);
let IPFS6B_WITH_FIRTDISEASEHASH = get_expected_keccak256_hash_two(IPFS6B, EXPECTED_FIRST_DISEASE_HASH);
let IPFS7B_WITH_FIRTDISEASEHASH = get_expected_keccak256_hash_two(IPFS7B, EXPECTED_FIRST_DISEASE_HASH);


// START COMMITING
await commitvote(test_account2, IPFS1B_WITH_FIRTDISEASEHASH, true, '50', "random123");
await commitvote(test_account3, IPFS1B_WITH_FIRTDISEASEHASH, true, '100', "random123");
await commitvote(test_account4, IPFS1B_WITH_FIRTDISEASEHASH, false, '50', "random123");
await commitvote(test_account5, IPFS1B_WITH_FIRTDISEASEHASH, true, '500', "random123");
await commitvote(test_account6, IPFS1B_WITH_FIRTDISEASEHASH, false, '350', "random123");
await commitvote(test_account7, IPFS1B_WITH_FIRTDISEASEHASH, false, '80', "random123");

//await should_fail_commitvote(test_account2, IPFS2B_WITH_FIRTDISEASEHASH, true, '5'); // should fail vote twice on same proposal
await commitvote(test_account3, IPFS2B_WITH_FIRTDISEASEHASH, false, '100', "random123");
await commitvote(test_account4, IPFS2B_WITH_FIRTDISEASEHASH, true, '500', "random123");
await commitvote(test_account5, IPFS2B_WITH_FIRTDISEASEHASH, false, '500', "random123");
await commitvote(test_account6, IPFS2B_WITH_FIRTDISEASEHASH, true, '35', "random123");
await commitvote(test_account7, IPFS2B_WITH_FIRTDISEASEHASH, false, '800', "random123");

await commitvote(test_account2, IPFS3B_WITH_FIRTDISEASEHASH, true, '5', "random123");
//await should_fail_commitvote(test_account3, IPFS3B_WITH_FIRTDISEASEHASH, false, '100');  // should fail vote twice on same proposal
await commitvote(test_account4, IPFS3B_WITH_FIRTDISEASEHASH, true, '490', "random123");
await commitvote(test_account5, IPFS3B_WITH_FIRTDISEASEHASH, false, '600', "random123");
await commitvote(test_account6, IPFS3B_WITH_FIRTDISEASEHASH, true, '35', "random123");
await commitvote(test_account7, IPFS3B_WITH_FIRTDISEASEHASH, true, '70', "random123");

await commitvote(test_account2, IPFS4B_WITH_FIRTDISEASEHASH, true, '5', "random123");
await commitvote(test_account3, IPFS4B_WITH_FIRTDISEASEHASH, true, '10', "random123");
//await should_fail_commitvote(test_account4, IPFS4B_WITH_FIRTDISEASEHASH, true, '50');  // should fail vote twice on same proposal
await commitvote(test_account5, IPFS4B_WITH_FIRTDISEASEHASH, true, '50', "random123");
await commitvote(test_account6, IPFS4B_WITH_FIRTDISEASEHASH, true, '35', "random123");
await commitvote(test_account7, IPFS4B_WITH_FIRTDISEASEHASH, true, '60', "random123");

// should fail to commitvote with incorrect amount for a proposal:
await should_fail_commitvote(test_account, IPFS4B_WITH_FIRTDISEASEHASH, true, '500000', "random123");
await should_fail_commitvote(test_account, IPFS4B_WITH_FIRTDISEASEHASH, true, '-500', "random123");
await should_fail_commitvote(test_account, IPFS4B_WITH_FIRTDISEASEHASH, true, '0', "random123");

// should fail for users to commitvote twice on same Proposal:
/* to deal with it latter:
await should_fail_commitvote(test_account2, IPFS1B_WITH_FIRTDISEASEHASH, true, '15', "random123");
await should_fail_commitvote(test_account3, IPFS1B_WITH_FIRTDISEASEHASH, false, '25', "random123");
await should_fail_commitvote(test_account5, IPFS2B_WITH_FIRTDISEASEHASH, true, '35', "random123");
await should_fail_commitvote(test_account6, IPFS3B_WITH_FIRTDISEASEHASH, true, '50', "random123");
await should_fail_commitvote(test_account7, IPFS4B_WITH_FIRTDISEASEHASH, true, '95', "random123");
*/
// END COMMITING

// ------- should fail revealing vote too early ------------ //
await should_fail_revealvote(test_account2, IPFS1B_WITH_FIRTDISEASEHASH, true, '50', "random123");
await should_fail_revealvote(test_account3, IPFS1B_WITH_FIRTDISEASEHASH, true, '100', "random123");
await should_fail_revealvote(test_account4, IPFS1B_WITH_FIRTDISEASEHASH, false, '50', "random123");
await should_fail_revealvote(test_account5, IPFS1B_WITH_FIRTDISEASEHASH, true, '500', "random123");
await should_fail_revealvote(test_account6, IPFS1B_WITH_FIRTDISEASEHASH, false, '350', "random123");
await should_fail_revealvote(test_account7, IPFS1B_WITH_FIRTDISEASEHASH, false, '80', "random123");

//await should_fail_revealvote(test_account2, IPFS2B_WITH_FIRTDISEASEHASH, true, '5'); // should fail vote twice on same proposal
await should_fail_revealvote(test_account3, IPFS2B_WITH_FIRTDISEASEHASH, false, '100', "random123");
await should_fail_revealvote(test_account4, IPFS2B_WITH_FIRTDISEASEHASH, true, '500', "random123");
await should_fail_revealvote(test_account5, IPFS2B_WITH_FIRTDISEASEHASH, false, '500', "random123");
await should_fail_revealvote(test_account6, IPFS2B_WITH_FIRTDISEASEHASH, true, '35', "random123");
await should_fail_revealvote(test_account7, IPFS2B_WITH_FIRTDISEASEHASH, false, '800', "random123");

await should_fail_revealvote(test_account2, IPFS3B_WITH_FIRTDISEASEHASH, true, '5', "random123");
//await should_fail_revealvote(test_account3, IPFS3B_WITH_FIRTDISEASEHASH, false, '100');  // should fail vote twice on same proposal
await should_fail_revealvote(test_account4, IPFS3B_WITH_FIRTDISEASEHASH, true, '490', "random123");
await should_fail_revealvote(test_account5, IPFS3B_WITH_FIRTDISEASEHASH, false, '600', "random123");
await should_fail_revealvote(test_account6, IPFS3B_WITH_FIRTDISEASEHASH, true, '35', "random123");
await should_fail_revealvote(test_account7, IPFS3B_WITH_FIRTDISEASEHASH, true, '70', "random123");

await should_fail_revealvote(test_account2, IPFS4B_WITH_FIRTDISEASEHASH, true, '5', "random123");
await should_fail_revealvote(test_account3, IPFS4B_WITH_FIRTDISEASEHASH, true, '10', "random123");
//await should_fail_revealvote(test_account4, IPFS4B_WITH_FIRTDISEASEHASH, true, '50');  // should fail vote twice on same proposal
await should_fail_revealvote(test_account5, IPFS4B_WITH_FIRTDISEASEHASH, true, '50', "random123");
await should_fail_revealvote(test_account6, IPFS4B_WITH_FIRTDISEASEHASH, true, '35', "random123");
await should_fail_revealvote(test_account7, IPFS4B_WITH_FIRTDISEASEHASH, true, '60', "random123");
// ------- should fail revealing vote too early ------------ //

// ------- advance time to enter revealing period: --------- //
console.log('DEFAULT_REVEALING_TIME is', DEFAULT_REVEALING_TIME.toNumber());
console.log('DEFAULT_VOTING_TIME is', DEFAULT_VOTING_TIME.toNumber());
await advanceseconds(DEFAULT_VOTING_TIME);

// Retrieve General Information of Proposals:
let _general_proposal1B = await EticaReleaseProtocolTestPhase2Instance.proposals(IPFS1B_WITH_FIRTDISEASEHASH);
let _general_proposal2B = await EticaReleaseProtocolTestPhase2Instance.proposals(IPFS2B_WITH_FIRTDISEASEHASH);
let _general_proposal3B = await EticaReleaseProtocolTestPhase2Instance.proposals(IPFS3B_WITH_FIRTDISEASEHASH);
let _general_proposal4B = await EticaReleaseProtocolTestPhase2Instance.proposals(IPFS4B_WITH_FIRTDISEASEHASH);
let _general_proposal5B = await EticaReleaseProtocolTestPhase2Instance.proposals(IPFS5B_WITH_FIRTDISEASEHASH);
let _general_proposal6B = await EticaReleaseProtocolTestPhase2Instance.proposals(IPFS6B_WITH_FIRTDISEASEHASH);
let _general_proposal7B = await EticaReleaseProtocolTestPhase2Instance.proposals(IPFS7B_WITH_FIRTDISEASEHASH);

// get proposals data:
let _proposal1B = await EticaReleaseProtocolTestPhase2Instance.propsdatas(IPFS1B_WITH_FIRTDISEASEHASH);
assert.equal(_proposal1B.nbvoters, '0', 'Proposal1B should have 0 nbvoters');

let _proposal2B = await EticaReleaseProtocolTestPhase2Instance.propsdatas(IPFS2B_WITH_FIRTDISEASEHASH);
assert.equal(_proposal2B.nbvoters, '0', 'Proposal2B should have 0 nbvoters');

let _proposal3B = await EticaReleaseProtocolTestPhase2Instance.propsdatas(IPFS3B_WITH_FIRTDISEASEHASH);
assert.equal(_proposal3B.nbvoters, '0', 'Proposal3B should have 0 nbvoters');

let _proposal4B = await EticaReleaseProtocolTestPhase2Instance.propsdatas(IPFS4B_WITH_FIRTDISEASEHASH);
assert.equal(_proposal4B.nbvoters, '0', 'Proposal4B should have 0 nbvoters');

let _proposal5B = await EticaReleaseProtocolTestPhase2Instance.propsdatas(IPFS5B_WITH_FIRTDISEASEHASH);
assert.equal(_proposal5B.nbvoters, '0', 'Proposal5B should have 0 nbvoters');

let _proposal6B = await EticaReleaseProtocolTestPhase2Instance.propsdatas(IPFS6B_WITH_FIRTDISEASEHASH);
assert.equal(_proposal6B.nbvoters, '0', 'Proposal6B should have 0 nbvoters');

let _proposal7B = await EticaReleaseProtocolTestPhase2Instance.propsdatas(IPFS7B_WITH_FIRTDISEASEHASH);
assert.equal(_proposal7B.nbvoters, '0', 'Proposal7B should have 0 nbvoters');



// (to be added latter) make new commits that should be too late and thus revealvote() of these commits should fail:
await commitvote(test_account8, IPFS2B_WITH_FIRTDISEASEHASH, true, '60', "random123");
await commitvote(test_account8, IPFS3B_WITH_FIRTDISEASEHASH, true, '10', "random123");
await commitvote(test_account8, IPFS4B_WITH_FIRTDISEASEHASH, false, '5', "random123");


// CHECKING PERIOD FORPROPS AGAINSTPROPS SYSTEM:
let second_period = await EticaReleaseProtocolTestPhase2Instance.periods(_general_proposal1B.period_id);
assert.equal(second_period.total_voters.toNumber(), 0, 'Second period should have 0 voter');
assert.equal(second_period.forprops.toNumber(), 0, 'Second period should have 0 forprops');
assert.equal(second_period.againstprops.toNumber(), 0, 'Second period should have 0 againstprops');

let proposal1B_last_status = await EticaReleaseProtocolTestPhase2Instance.proplststatus(second_period.id, IPFS1B_WITH_FIRTDISEASEHASH);
let proposal2B_last_status = await EticaReleaseProtocolTestPhase2Instance.proplststatus(second_period.id, IPFS2B_WITH_FIRTDISEASEHASH);
let proposal3B_last_status = await EticaReleaseProtocolTestPhase2Instance.proplststatus(second_period.id, IPFS3B_WITH_FIRTDISEASEHASH);
let proposal4B_last_status = await EticaReleaseProtocolTestPhase2Instance.proplststatus(second_period.id, IPFS4B_WITH_FIRTDISEASEHASH);
let proposal5B_last_status = await EticaReleaseProtocolTestPhase2Instance.proplststatus(second_period.id, IPFS5B_WITH_FIRTDISEASEHASH);
let proposal6B_last_status = await EticaReleaseProtocolTestPhase2Instance.proplststatus(second_period.id, IPFS6B_WITH_FIRTDISEASEHASH);
let proposal7B_last_status = await EticaReleaseProtocolTestPhase2Instance.proplststatus(second_period.id, IPFS7B_WITH_FIRTDISEASEHASH);
assert.equal(proposal1B_last_status.toString(), 3, 'proposal1B last status should have been updated to Singlevoter (3)');
assert.equal(proposal2B_last_status.toString(), 3, 'proposal2B last status should have been updated to Singlevoter (3)');
assert.equal(proposal3B_last_status.toString(), 3, 'proposal3B last status should have been updated to Singlevoter (3)');
assert.equal(proposal4B_last_status.toString(), 3, 'proposal4B last status should have been updated to Singlevoter (3)');
assert.equal(proposal5B_last_status.toString(), 3, 'proposal5B last status should have been updated to Singlevoter (3)');
assert.equal(proposal6B_last_status.toString(), 3, 'proposal6B last status should have been updated to Singlevoter (3)');
assert.equal(proposal7B_last_status.toString(), 3, 'proposal7B last status should have been updated to Singlevoter (3)');
// CHECKING PERIOD FORPROPS AGAINSTPROPS SYSTEM DONE


// assert we are within revealing period of proposal1
lstblock = await web3.eth.getBlock("latest");
assert(lstblock.timestamp > _proposal1B.endtime.toNumber(), 'Block timestamp should be higher than proposal1B endTime before testing REVEALVOTE');
assert(lstblock.timestamp <= _proposal1B.endtime.toNumber() + DEFAULT_REVEALING_TIME.toNumber(), 'Block timestamp should be lower or equal to _proposal1B.endTime + DEFAULT_REVEALING_TIME before testing REVEALVOTE');
console.log('lstblock.timestamp is', lstblock.timestamp);
console.log('_proposal1.endtime.toNumber() is', _proposal1.endtime.toNumber());
console.log('DEFAULT_REVEALING_TIME is', DEFAULT_REVEALING_TIME.toNumber());

await revealvote(test_account2, IPFS1B_WITH_FIRTDISEASEHASH, true, '50', "random123");
await revealvote(test_account3, IPFS1B_WITH_FIRTDISEASEHASH, true, '100', "random123");
await revealvote(test_account4, IPFS1B_WITH_FIRTDISEASEHASH, false, '50', "random123");
await revealvote(test_account5, IPFS1B_WITH_FIRTDISEASEHASH, true, '500', "random123");
await revealvote(test_account6, IPFS1B_WITH_FIRTDISEASEHASH, false, '350', "random123");
await revealvote(test_account7, IPFS1B_WITH_FIRTDISEASEHASH, false, '80', "random123");

// CHECKING PERIOD FORPROPS AGAINSTPROPS SYSTEM:
second_period = await EticaReleaseProtocolTestPhase2Instance.periods(_general_proposal1B.period_id);
assert.equal(second_period.total_voters.toNumber(), 6, 'Second period should have 6 voters');
assert.equal(second_period.forprops.toNumber(), 1, 'Second period should have 1 forprops');
assert.equal(second_period.againstprops.toNumber(), 0, 'Second period should have 0 againstprops');

proposal1B_last_status = await EticaReleaseProtocolTestPhase2Instance.proplststatus(second_period.id, IPFS1B_WITH_FIRTDISEASEHASH);
assert.equal(proposal1B_last_status.toString(), 1, 'proposal1B last status should have been updated to Accepted (1)');
// CHECKING PERIOD FORPROPS AGAINSTPROPS SYSTEM DONE


// assert we are within revealing period of proposal2
lstblock = await web3.eth.getBlock("latest");
assert(lstblock.timestamp > _proposal2B.endtime.toNumber(), 'Block timestamp should be higher than proposal2B endTime before testing REVEALVOTE');
assert(lstblock.timestamp <= _proposal2B.endtime.toNumber() + DEFAULT_REVEALING_TIME, 'Block timestamp should be lower or equal to _proposal2B.endTime + DEFAULT_REVEALING_TIME before testing REVEALVOTE');
//await should_fail_revealvote(test_account2, IPFS2B_WITH_FIRTDISEASEHASH, true, '5'); // should fail vote twice on same proposal
await revealvote(test_account3, IPFS2B_WITH_FIRTDISEASEHASH, false, '100', "random123");
await revealvote(test_account4, IPFS2B_WITH_FIRTDISEASEHASH, true, '500', "random123");
await revealvote(test_account5, IPFS2B_WITH_FIRTDISEASEHASH, false, '500', "random123");
await revealvote(test_account6, IPFS2B_WITH_FIRTDISEASEHASH, true, '35', "random123");
await revealvote(test_account7, IPFS2B_WITH_FIRTDISEASEHASH, false, '800', "random123");

// CHECKING PERIOD FORPROPS AGAINSTPROPS SYSTEM:
second_period = await EticaReleaseProtocolTestPhase2Instance.periods(_general_proposal1B.period_id);
assert.equal(second_period.total_voters.toNumber(), 11, 'Second period should have 11 voters');
assert.equal(second_period.forprops.toNumber(), 1, 'Second period should have 1 forprops');
assert.equal(second_period.againstprops.toNumber(), 1, 'Second period should have 1 againstprops');

proposal2B_last_status = await EticaReleaseProtocolTestPhase2Instance.proplststatus(second_period.id, IPFS2B_WITH_FIRTDISEASEHASH);
assert.equal(proposal2B_last_status.toString(), 0, 'proposal2B last status should have been updated to Rejected (0)');
// CHECKING PERIOD FORPROPS AGAINSTPROPS SYSTEM DONE


// assert we are within revealing period of proposal3
lstblock = await web3.eth.getBlock("latest");
assert(lstblock.timestamp > _proposal3B.endtime.toNumber(), 'Block timestamp should be higher than proposal3B endTime before testing REVEALVOTE');
assert(lstblock.timestamp <= _proposal3B.endtime.toNumber() + DEFAULT_REVEALING_TIME, 'Block timestamp should be lower or equal to _proposal3B.endTime + DEFAULT_REVEALING_TIME before testing REVEALVOTE');
await revealvote(test_account2, IPFS3B_WITH_FIRTDISEASEHASH, true, '5', "random123");
//await should_fail_revealvote(test_account3, IPFS3B_WITH_FIRTDISEASEHASH, false, '100');  // should fail vote twice on same proposal
await revealvote(test_account4, IPFS3B_WITH_FIRTDISEASEHASH, true, '490', "random123");
await revealvote(test_account5, IPFS3B_WITH_FIRTDISEASEHASH, false, '600', "random123");
await revealvote(test_account6, IPFS3B_WITH_FIRTDISEASEHASH, true, '35', "random123");
await revealvote(test_account7, IPFS3B_WITH_FIRTDISEASEHASH, true, '70', "random123");

// CHECKING PERIOD FORPROPS AGAINSTPROPS SYSTEM:
second_period = await EticaReleaseProtocolTestPhase2Instance.periods(_general_proposal1B.period_id);
assert.equal(second_period.total_voters.toNumber(), 16, 'Second period should have 16 voters');
assert.equal(second_period.forprops.toNumber(), 1, 'Second period should have 1 forprops');
assert.equal(second_period.againstprops.toNumber(), 2, 'Second period should have 2 againstprops');

proposal3B_last_status = await EticaReleaseProtocolTestPhase2Instance.proplststatus(second_period.id, IPFS3B_WITH_FIRTDISEASEHASH);
assert.equal(proposal3B_last_status.toString(), 0, 'proposal3B last status should have been updated to Rejected (0)');
// CHECKING PERIOD FORPROPS AGAINSTPROPS SYSTEM DONE



// assert we are within revealing period of proposal4
lstblock = await web3.eth.getBlock("latest");
assert(lstblock.timestamp > _proposal4B.endtime.toNumber(), 'Block timestamp should be higher than proposal4B endTime before testing REVEALVOTE');
assert(lstblock.timestamp <= _proposal4B.endtime.toNumber() + DEFAULT_REVEALING_TIME, 'Block timestamp should be lower or equal to _proposal4B.endTime + DEFAULT_REVEALING_TIME before testing REVEALVOTE');
await revealvote(test_account2, IPFS4B_WITH_FIRTDISEASEHASH, true, '5', "random123");
await revealvote(test_account3, IPFS4B_WITH_FIRTDISEASEHASH, true, '10', "random123");
//await should_fail_revealvote(test_account4, IPFS4B_WITH_FIRTDISEASEHASH, true, '50');  // should fail vote twice on same proposal
await revealvote(test_account5, IPFS4B_WITH_FIRTDISEASEHASH, true, '50', "random123");
await revealvote(test_account6, IPFS4B_WITH_FIRTDISEASEHASH, true, '35', "random123");
await revealvote(test_account7, IPFS4B_WITH_FIRTDISEASEHASH, true, '60', "random123");

// CHECKING PERIOD FORPROPS AGAINSTPROPS SYSTEM:
second_period = await EticaReleaseProtocolTestPhase2Instance.periods(_general_proposal1B.period_id);
assert.equal(second_period.total_voters.toNumber(), 21, 'Second period should have 21 voters');
assert.equal(second_period.forprops.toNumber(), 2, 'Second period should have 2 forprops');
assert.equal(second_period.againstprops.toNumber(), 2, 'Second period should have 2 againstprops');

proposal4B_last_status = await EticaReleaseProtocolTestPhase2Instance.proplststatus(second_period.id, IPFS4B_WITH_FIRTDISEASEHASH);
assert.equal(proposal4B_last_status.toString(), 1, 'proposal4B last status should have been updated to Accepted (1)');
// CHECKING PERIOD FORPROPS AGAINSTPROPS SYSTEM DONE




// assert we are within revealing period of proposal5
lstblock = await web3.eth.getBlock("latest");
assert(lstblock.timestamp > _proposal4B.endtime.toNumber(), 'Block timestamp should be higher than proposal4B endTime before testing REVEALVOTE');
assert(lstblock.timestamp <= _proposal4B.endtime.toNumber() + DEFAULT_REVEALING_TIME, 'Block timestamp should be lower or equal to _proposal4B.endTime + DEFAULT_REVEALING_TIME before testing REVEALVOTE');
// should fail to vote with incorrect amount for a proposal:
await should_fail_revealvote(test_account7, IPFS4B_WITH_FIRTDISEASEHASH, true, '500000', "random123");
await should_fail_revealvote(test_account3, IPFS4B_WITH_FIRTDISEASEHASH, true, '-500', "random123");
await should_fail_revealvote(test_account3, IPFS4B_WITH_FIRTDISEASEHASH, true, '0', "random123");


// assert we are within revealing period of proposal6
lstblock = await web3.eth.getBlock("latest");
assert(lstblock.timestamp > _proposal1B.endtime.toNumber(), 'Block timestamp should be higher than proposal1 endTime before testing REVEALVOTE');
assert(lstblock.timestamp <= _proposal1B.endtime.toNumber() + DEFAULT_REVEALING_TIME, 'Block timestamp should be lower or equal to _proposal1.endTime + DEFAULT_REVEALING_TIME before testing REVEALVOTE');

assert(lstblock.timestamp > _proposal2B.endtime.toNumber(), 'Block timestamp should be higher than proposal2B endTime before testing REVEALVOTE');
assert(lstblock.timestamp <= _proposal2B.endtime.toNumber() + DEFAULT_REVEALING_TIME, 'Block timestamp should be lower or equal to _proposal2B.endTime + DEFAULT_REVEALING_TIME before testing REVEALVOTE');

assert(lstblock.timestamp > _proposal3B.endtime.toNumber(), 'Block timestamp should be higher than proposal3B endTime before testing REVEALVOTE');
assert(lstblock.timestamp <= _proposal3B.endtime.toNumber() + DEFAULT_REVEALING_TIME, 'Block timestamp should be lower or equal to _proposal3B.endTime + DEFAULT_REVEALING_TIME before testing REVEALVOTE');

assert(lstblock.timestamp > _proposal4B.endtime.toNumber(), 'Block timestamp should be higher than proposal4B endTime before testing REVEALVOTE');
assert(lstblock.timestamp <= _proposal4B.endtime.toNumber() + DEFAULT_REVEALING_TIME, 'Block timestamp should be lower or equal to _proposal4B.endTime + DEFAULT_REVEALING_TIME before testing REVEALVOTE');


// should fail for users to revealvote twice on same Proposal:
await should_fail_revealvote(test_account2, IPFS1B_WITH_FIRTDISEASEHASH, true, '15', "random123");
await should_fail_revealvote(test_account3, IPFS1B_WITH_FIRTDISEASEHASH, false, '25', "random123");
await should_fail_revealvote(test_account5, IPFS2B_WITH_FIRTDISEASEHASH, true, '35', "random123");
await should_fail_revealvote(test_account6, IPFS3B_WITH_FIRTDISEASEHASH, true, '50', "random123");
await should_fail_revealvote(test_account7, IPFS4B_WITH_FIRTDISEASEHASH, true, '95', "random123");


// revealvote() of these commits should fail because the related commits were made too late:
await should_fail_revealvote(test_account8, IPFS2B_WITH_FIRTDISEASEHASH, true, '60', "random123");
await should_fail_revealvote(test_account8, IPFS3B_WITH_FIRTDISEASEHASH, true, '10', "random123");
await should_fail_revealvote(test_account8, IPFS4B_WITH_FIRTDISEASEHASH, false, '5', "random123");


// CHECK PROPOSALSDATA

_proposal1B = await EticaReleaseProtocolTestPhase2Instance.propsdatas(IPFS1B_WITH_FIRTDISEASEHASH);
assert.equal(_proposal1B.nbvoters, '6', 'Proposal1 should have 6 nbvoters');

_proposal2B = await EticaReleaseProtocolTestPhase2Instance.propsdatas(IPFS2B_WITH_FIRTDISEASEHASH);
assert.equal(_proposal2B.nbvoters, '5', 'Proposal2 should have 5 nbvoters');

_proposal3B = await EticaReleaseProtocolTestPhase2Instance.propsdatas(IPFS3B_WITH_FIRTDISEASEHASH);
assert.equal(_proposal3B.nbvoters, '5', 'Proposal3 should have 5 nbvoters');

_proposal4B = await EticaReleaseProtocolTestPhase2Instance.propsdatas(IPFS4B_WITH_FIRTDISEASEHASH);
assert.equal(_proposal4B.nbvoters, '5', 'Proposal4 should have 5 nbvoters');

_proposal5B = await EticaReleaseProtocolTestPhase2Instance.propsdatas(IPFS5B_WITH_FIRTDISEASEHASH);
assert.equal(_proposal5B.nbvoters, '0', 'Proposal5 should have 0 nbvoters');

_proposal6B = await EticaReleaseProtocolTestPhase2Instance.propsdatas(IPFS6B_WITH_FIRTDISEASEHASH);
assert.equal(_proposal6B.nbvoters, '0', 'Proposal6 should have 0 nbvoters');

_proposal7B = await EticaReleaseProtocolTestPhase2Instance.propsdatas(IPFS7B_WITH_FIRTDISEASEHASH);
assert.equal(_proposal7B.nbvoters, '0', 'Proposal7 should have 0 nbvoters');

console.log('----------------->   PROPOSALS NBVOTERS CHECKED  <-----------------');


assert.equal(web3.utils.fromWei(_proposal1B.forvotes.toString()), '650', 'Proposal1 should have 650 forvotes');
assert.equal(web3.utils.fromWei(_proposal1B.againstvotes.toString()), '480', 'Proposal1 should have 480 against votes');

assert.equal(web3.utils.fromWei(_proposal2B.forvotes.toString()), '535', 'Proposal2 should have 535 forvotes');
assert.equal(web3.utils.fromWei(_proposal2B.againstvotes.toString()), '1400', 'Proposal1 should have 1400 against votes');

assert.equal(web3.utils.fromWei(_proposal3B.forvotes.toString()), '600', 'Proposal3 should have 600 forvotes');
assert.equal(web3.utils.fromWei(_proposal3B.againstvotes.toString()), '600', 'Proposal3 should have 500 against votes');

assert.equal(web3.utils.fromWei(_proposal4B.forvotes.toString()), '160', 'Proposal4 should have 160 forvotes');
assert.equal(web3.utils.fromWei(_proposal4B.againstvotes.toString()), '0', 'Proposal4 should have 0 against votes');

console.log('----------------->   PROPOSALS FORVOTES AND AGAINTSVOTES CHECKED  <-----------------');

assert.equal(_proposal1B.prestatus, '1', 'Proposal1 prestatus should be Accepted');
assert.equal(_proposal2B.prestatus, '0', 'Proposal2 prestatus should be Rejected');
assert.equal(_proposal3B.prestatus, '0', 'Proposal3 prestatus should be Rejected');
assert.equal(_proposal4B.prestatus, '1', 'Proposal4 prestatus should be Accepted');
assert.equal(_proposal5B.prestatus, '3', 'Proposal5 prestatus should be SingleVoter');
assert.equal(_proposal6B.prestatus, '3', 'Proposal6 prestatus should be SingleVoter');
assert.equal(_proposal7B.prestatus, '3', 'Proposal7 prestatus should be SingleVoter');

console.log('----------------->   PROPOSALS PRESTATUS CHECKED  <-----------------');

assert.equal(_proposal1B.status, '2', 'Proposal1 status should be Pending');
assert.equal(_proposal2B.status, '2', 'Proposal2 status should be Pending');
assert.equal(_proposal3B.status, '2', 'Proposal3 status should be Pending');
assert.equal(_proposal4B.status, '2', 'Proposal4 status should be Pending');
assert.equal(_proposal5B.status, '2', 'Proposal5 status should be Pending');
assert.equal(_proposal6B.status, '2', 'Proposal6 status should be Pending');
assert.equal(_proposal7B.status, '2', 'Proposal7 status should be Pending');

console.log('----------------->   PROPOSALS STATUS CHECKED  <-----------------');

assert.equal(web3.utils.fromWei(_proposal1.lastcuration_weight, "ether" ), '650', 'Proposal1 should have a lastcuration_weight of 650');
assert.equal(web3.utils.fromWei(_proposal2.lastcuration_weight, "ether" ), '1400', 'Proposal2 should have a lastcuration_weight of 1400');
assert.equal(web3.utils.fromWei(_proposal3.lastcuration_weight, "ether" ), '0', 'Proposal3 should have a lastcuration_weight of 0');
assert.equal(web3.utils.fromWei(_proposal4.lastcuration_weight, "ether" ), '160', 'Proposal4 should have a lastcuration_weight of 160');
assert.equal(web3.utils.fromWei(_proposal5.lastcuration_weight, "ether" ), '0', 'Proposal5 should have a lastcuration_weight of 0');
assert.equal(web3.utils.fromWei(_proposal6.lastcuration_weight, "ether" ), '0', 'Proposal6 should have a lastcuration_weight of 0');
assert.equal(web3.utils.fromWei(_proposal7.lastcuration_weight, "ether" ), '0', 'Proposal7 should have a lastcuration_weight of 0');

console.log('----------------->   PROPOSALS LASTCURATIONWEIGHT CHECKED  <-----------------');

assert.equal(web3.utils.fromWei(_proposal1.lasteditor_weight, "ether" ), '650', 'Proposal1 should have a lasteditor_weight of 650');
assert.equal(web3.utils.fromWei(_proposal2.lasteditor_weight, "ether" ), '0', 'Proposal2 should have a lasteditor_weight of 0');
assert.equal(web3.utils.fromWei(_proposal3.lasteditor_weight, "ether" ), '0', 'Proposal3 should have a lasteditor_weight of 0');
assert.equal(web3.utils.fromWei(_proposal4.lasteditor_weight, "ether" ), '160', 'Proposal4 should have a lasteditor_weight of 160');
assert.equal(web3.utils.fromWei(_proposal5.lasteditor_weight, "ether" ), '0', 'Proposal5 should have a lasteditor_weight of 0');
assert.equal(web3.utils.fromWei(_proposal6.lasteditor_weight, "ether" ), '0', 'Proposal6 should have a lasteditor_weight of 0');
assert.equal(web3.utils.fromWei(_proposal7.lasteditor_weight, "ether" ), '0', 'Proposal7 should have a lasteditor_weight of 0');

console.log('----------------->   PROPOSALS LASTEDITORWEIGHT CHECKED  <-----------------');

assert.equal(_proposal1B.slashingratio.toNumber(), 1505, 'Proposal1 should have a slashingratio of 0.1505');
assert.equal(_proposal2B.slashingratio.toNumber(), 4471, 'Proposal2 should have a slashingratio of 0.4471');
assert.equal(_proposal3B.slashingratio.toNumber(), 0, 'Proposal3 should have a slashingratio of 0');
assert.equal(_proposal4B.slashingratio.toNumber(), 10000, 'Proposal4 should have a slashingratio of 1');
assert.equal(_proposal5B.slashingratio.toNumber(), 0, 'Proposal5 should have a slashingratio of 0');
assert.equal(_proposal6B.slashingratio.toNumber(), 0, 'Proposal6 should have a slashingratio of 0');
assert.equal(_proposal7B.slashingratio.toNumber(), 0, 'Proposal7 should have a slashingratio of 0');

console.log('----------------->   PROPOSALS SLASHINGRATIO CHECKED  <-----------------');


// Retrieve BLOCKEDETICAS:
NEW_BLOCKED_ETI_TEST_ACCOUNT = await EticaReleaseProtocolTestPhase2Instance.blockedeticas(test_account.address);
NEW_BLOCKED_ETI_TEST_ACCOUNT_2 = await EticaReleaseProtocolTestPhase2Instance.blockedeticas(test_account2.address);
NEW_BLOCKED_ETI_TEST_ACCOUNT_3 = await EticaReleaseProtocolTestPhase2Instance.blockedeticas(test_account3.address);
NEW_BLOCKED_ETI_TEST_ACCOUNT_4 = await EticaReleaseProtocolTestPhase2Instance.blockedeticas(test_account4.address);
NEW_BLOCKED_ETI_TEST_ACCOUNT_5 = await EticaReleaseProtocolTestPhase2Instance.blockedeticas(test_account5.address);
NEW_BLOCKED_ETI_TEST_ACCOUNT_6 = await EticaReleaseProtocolTestPhase2Instance.blockedeticas(test_account6.address);
NEW_BLOCKED_ETI_TEST_ACCOUNT_7 = await EticaReleaseProtocolTestPhase2Instance.blockedeticas(test_account7.address);

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
assert.equal(web3.utils.fromWei(NEW_BLOCKED_ETI_TEST_ACCOUNT_7, "ether" ), 1010);


// Retrieve General Information of Proposals:
_general_proposal1B = await EticaReleaseProtocolTestPhase2Instance.proposals(IPFS1B_WITH_FIRTDISEASEHASH);
_general_proposal2B = await EticaReleaseProtocolTestPhase2Instance.proposals(IPFS2B_WITH_FIRTDISEASEHASH);
_general_proposal3B = await EticaReleaseProtocolTestPhase2Instance.proposals(IPFS3B_WITH_FIRTDISEASEHASH);
_general_proposal4B = await EticaReleaseProtocolTestPhase2Instance.proposals(IPFS4B_WITH_FIRTDISEASEHASH);
_general_proposal5B = await EticaReleaseProtocolTestPhase2Instance.proposals(IPFS5B_WITH_FIRTDISEASEHASH);
_general_proposal6B = await EticaReleaseProtocolTestPhase2Instance.proposals(IPFS6B_WITH_FIRTDISEASEHASH);
_general_proposal7B = await EticaReleaseProtocolTestPhase2Instance.proposals(IPFS7B_WITH_FIRTDISEASEHASH);

// assert all proposals are in same Period (not necessary for contract integrity but we assume they are for next steps of Tests)
console.log('_general_proposal1B.period_id is', _general_proposal1B.period_id.toString());
console.log('_general_proposal7B.period_id is', _general_proposal7B.period_id.toString());

assert(_general_proposal1B.period_id.toString() == _general_proposal7B.period_id.toString(), "Please relaunch the test, proposal1B and proposal7B need to be created in same Period. Will be more lucky next time !");


// assert Period's curation_sum and editor_sum values are OK
let _period1B  = await EticaReleaseProtocolTestPhase2Instance.periods(_general_proposal1B.period_id);
console.log('_period1B is:', _period1B);
console.log('_period1B.reward_curation is:', web3.utils.fromWei(_period1B.reward_for_curation, "ether" ));
console.log('_period1B.reward_editor is:', web3.utils.fromWei(_period1B.reward_for_editor, "ether" ));
console.log('_period1B.total_voters is:', _period1B.total_voters.toString());
assert.equal(web3.utils.fromWei(_period1B.curation_sum, "ether" ), 2210); // Sum of proposals' curation_weight
assert.equal(web3.utils.fromWei(_period1B.editor_sum, "ether" ), 810); // Sum of proposals' editor_weight
assert.equal(_period1B.total_voters.toString(), "21"); // Period nb votes

// Should fail to clmpropbyhash too early: 
await should_fail_clmpropbyhash(test_account, IPFS1B_WITH_FIRTDISEASEHASH);

// advance time so that clmpropbyhash becomes possible: 
await advanceseconds(DEFAULT_VOTING_TIME);
console.log('waiting DEFAULT_TIME_VOTING seconds so that clmbyhash becomes possible');

// Should fail to revealvote too late:
await should_fail_revealvote(test_account2, IPFS5B_WITH_FIRTDISEASEHASH, true, '20');


OLD_BALANCE_ACCOUNT = await EticaReleaseProtocolTestPhase2Instance.balanceOf(test_account.address);  
OLD_BALANCE_ACCOUNT_2 = await EticaReleaseProtocolTestPhase2Instance.balanceOf(test_account2.address);
OLD_BALANCE_ACCOUNT_3 = await EticaReleaseProtocolTestPhase2Instance.balanceOf(test_account3.address);
OLD_BALANCE_ACCOUNT_4 = await EticaReleaseProtocolTestPhase2Instance.balanceOf(test_account4.address);
OLD_BALANCE_ACCOUNT_5 = await EticaReleaseProtocolTestPhase2Instance.balanceOf(test_account5.address);
OLD_BALANCE_ACCOUNT_6 = await EticaReleaseProtocolTestPhase2Instance.balanceOf(test_account6.address);
OLD_BALANCE_ACCOUNT_7 = await EticaReleaseProtocolTestPhase2Instance.balanceOf(test_account7.address);
OLD_BALANCE_ACCOUNT_8 = await EticaReleaseProtocolTestPhase2Instance.balanceOf(test_account8.address);

// should pass
await clmpropbyhash(test_account5, IPFS4B_WITH_FIRTDISEASEHASH);
await clmpropbyhash(test_account6, IPFS4B_WITH_FIRTDISEASEHASH);
await clmpropbyhash(test_account7, IPFS4B_WITH_FIRTDISEASEHASH);

await clmpropbyhash(test_account5, IPFS5B_WITH_FIRTDISEASEHASH);



MID_BALANCE_ACCOUNT = await EticaReleaseProtocolTestPhase2Instance.balanceOf(test_account.address);  
MID_BALANCE_ACCOUNT_2 = await EticaReleaseProtocolTestPhase2Instance.balanceOf(test_account2.address);
MID_BALANCE_ACCOUNT_3 = await EticaReleaseProtocolTestPhase2Instance.balanceOf(test_account3.address);
MID_BALANCE_ACCOUNT_4 = await EticaReleaseProtocolTestPhase2Instance.balanceOf(test_account4.address);
MID_BALANCE_ACCOUNT_5 = await EticaReleaseProtocolTestPhase2Instance.balanceOf(test_account5.address);
MID_BALANCE_ACCOUNT_6 = await EticaReleaseProtocolTestPhase2Instance.balanceOf(test_account6.address);
MID_BALANCE_ACCOUNT_7 = await EticaReleaseProtocolTestPhase2Instance.balanceOf(test_account7.address);
MID_BALANCE_ACCOUNT_8 = await EticaReleaseProtocolTestPhase2Instance.balanceOf(test_account8.address);


// ------------  ACCOUNT 5----------- //
let _expected_reward_acc5_prop_4B = await get_expected_reward(test_account5, IPFS4B_WITH_FIRTDISEASEHASH);
let _expected_reward_acc5_prop_5B = await get_expected_reward(test_account5, IPFS5B_WITH_FIRTDISEASEHASH);
let _expected_total_reward_B_acc5 =  _expected_reward_acc5_prop_4B + _expected_reward_acc5_prop_5B;
console.log('_expected_reward_acc5_prop4 is', _expected_reward_acc5_prop_4B);
console.log('_expected_reward_acc5_prop5 is', _expected_reward_acc5_prop_5B);
console.log('_expected_total_reward_B_acc5 is', _expected_total_reward_B_acc5);
// ---> because of significant figure issues we remove last 2 figures:
_expected_total_reward_B_acc5 = Number.parseFloat(_expected_total_reward_B_acc5).toPrecision(9);

let _effective_reward_B_acc5 = web3.utils.fromWei(MID_BALANCE_ACCOUNT_5, "ether" ) - web3.utils.fromWei(OLD_BALANCE_ACCOUNT_5, "ether" );
console.log('_effective_acc5 new ETI as REWARD:', _effective_reward_B_acc5);
// ---> because of significant figure issues we remove last 2 figures:
_effective_reward_B_acc5 = Number.parseFloat(_effective_reward_B_acc5).toPrecision(9);

// acc5 should have gotten exactly the expected REWARD calculated by get_expected_reward() :
assert.equal( _effective_reward_B_acc5, _expected_total_reward_B_acc5); // 122.67718490502358 == _expected_reward_acc5_prop_4B + _expected_reward_acc5_prop_5B

// ------------  ACCOUNT 5---------- //

// ------------  ACCOUNT 6----------- //
let _expected_reward_acc6_prop_4B = await get_expected_reward(test_account6, IPFS4B_WITH_FIRTDISEASEHASH);
let _expected_total_reward_B_acc6 =  _expected_reward_acc6_prop_4B;
console.log('_expected_reward_acc6_prop4 is', _expected_reward_acc6_prop_4B);
console.log('_expected_total_reward_B_acc6 is', _expected_total_reward_B_acc6);
// ---> because of significant figure issues we remove last 2 figures:
_expected_total_reward_B_acc6 = Number.parseFloat(_expected_total_reward_B_acc6).toPrecision(9);

let _effective_reward_B_acc6 = web3.utils.fromWei(MID_BALANCE_ACCOUNT_6, "ether" ) - web3.utils.fromWei(OLD_BALANCE_ACCOUNT_6, "ether" );
console.log('_effective_acc6 new ETI as REWARD:', _effective_reward_B_acc6);
// ---> because of significant figure issues we remove last 2 figures:
_effective_reward_B_acc6 = Number.parseFloat(_effective_reward_B_acc6).toPrecision(9);

// acc6 should have gotten exactly the expected REWARD calculated by get_expected_reward() :
assert.equal( _effective_reward_B_acc6, _expected_total_reward_B_acc6); // 62.94838356665059 == _expected_reward_acc6_prop_4B
// ----------- ACCOUNT 6   -----------  //

// ----- ACCOUNT 7  ------------ //
let _expected_reward_acc7_prop_4B = await get_expected_reward(test_account7, IPFS4B_WITH_FIRTDISEASEHASH);
let _expected_total_reward_B_acc7 =  _expected_reward_acc7_prop_4B;
console.log('_expected_reward_acc7_prop4 is', _expected_reward_acc7_prop_4B);
console.log('_expected_total_reward_B_acc7 is', _expected_total_reward_B_acc7);
// ---> because of significant figure issues we remove last 2 figures:
_expected_total_reward_B_acc7 = Number.parseFloat(_expected_total_reward_B_acc7).toPrecision(9);

let _effective_reward_B_acc7 = web3.utils.fromWei(MID_BALANCE_ACCOUNT_7, "ether" ) - web3.utils.fromWei(OLD_BALANCE_ACCOUNT_7, "ether" );
console.log('_effective_acc7 new ETI as REWARD:', _effective_reward_B_acc7);
// ---> because of significant figure issues we remove last 2 figures:
_effective_reward_B_acc7 = Number.parseFloat(_effective_reward_B_acc7).toPrecision(9);

// acc7 should have gotten exactly the expected REWARD calculated by get_expected_reward() :
assert.equal( _effective_reward_B_acc7, _expected_total_reward_B_acc7); // 113.906598834890 == _expected_reward_acc_7_prop_4B

console.log('MID BALANCES CHECKED');



await clmpropbyhash(test_account, IPFS1B_WITH_FIRTDISEASEHASH);
await clmpropbyhash(test_account2, IPFS1B_WITH_FIRTDISEASEHASH);
await clmpropbyhash(test_account3, IPFS1B_WITH_FIRTDISEASEHASH);
await clmpropbyhash(test_account4, IPFS1B_WITH_FIRTDISEASEHASH);
await clmpropbyhash(test_account5, IPFS1B_WITH_FIRTDISEASEHASH);
await clmpropbyhash(test_account6, IPFS1B_WITH_FIRTDISEASEHASH);
await clmpropbyhash(test_account7, IPFS1B_WITH_FIRTDISEASEHASH);

// next line should fail:
await should_fail_clmpropbyhash(test_account, IPFS2B_WITH_FIRTDISEASEHASH);

await clmpropbyhash(test_account2, IPFS2B_WITH_FIRTDISEASEHASH);
await clmpropbyhash(test_account3, IPFS2B_WITH_FIRTDISEASEHASH);
await clmpropbyhash(test_account4, IPFS2B_WITH_FIRTDISEASEHASH);
await clmpropbyhash(test_account5, IPFS2B_WITH_FIRTDISEASEHASH);
await clmpropbyhash(test_account6, IPFS2B_WITH_FIRTDISEASEHASH);
await clmpropbyhash(test_account7, IPFS2B_WITH_FIRTDISEASEHASH);



await clmpropbyhash(test_account2, IPFS3B_WITH_FIRTDISEASEHASH);
await clmpropbyhash(test_account3, IPFS3B_WITH_FIRTDISEASEHASH);
await clmpropbyhash(test_account4, IPFS3B_WITH_FIRTDISEASEHASH);
await clmpropbyhash(test_account5, IPFS3B_WITH_FIRTDISEASEHASH);
await clmpropbyhash(test_account6, IPFS3B_WITH_FIRTDISEASEHASH);
await clmpropbyhash(test_account7, IPFS3B_WITH_FIRTDISEASEHASH);



await clmpropbyhash(test_account2, IPFS4B_WITH_FIRTDISEASEHASH);
await clmpropbyhash(test_account3, IPFS4B_WITH_FIRTDISEASEHASH);
await clmpropbyhash(test_account4, IPFS4B_WITH_FIRTDISEASEHASH);
// next 3 should fail:
await should_fail_clmpropbyhash(test_account5, IPFS4B_WITH_FIRTDISEASEHASH);
await should_fail_clmpropbyhash(test_account6, IPFS4B_WITH_FIRTDISEASEHASH);
await should_fail_clmpropbyhash(test_account7, IPFS4B_WITH_FIRTDISEASEHASH);


// next 3 should fail:
await should_fail_clmpropbyhash(test_account2, IPFS5B_WITH_FIRTDISEASEHASH);
await should_fail_clmpropbyhash(test_account3, IPFS5B_WITH_FIRTDISEASEHASH);
await should_fail_clmpropbyhash(test_account4, IPFS5B_WITH_FIRTDISEASEHASH);
// next must fail because already called before when calculating middle balances:
await should_fail_clmpropbyhash(test_account5, IPFS5B_WITH_FIRTDISEASEHASH);
// next 2 should fail:
await should_fail_clmpropbyhash(test_account6, IPFS5B_WITH_FIRTDISEASEHASH);
await should_fail_clmpropbyhash(test_account7, IPFS5B_WITH_FIRTDISEASEHASH);




// next 3 should fail:
await should_fail_clmpropbyhash(test_account2, IPFS6B_WITH_FIRTDISEASEHASH);
await should_fail_clmpropbyhash(test_account3, IPFS6B_WITH_FIRTDISEASEHASH);
await should_fail_clmpropbyhash(test_account4, IPFS6B_WITH_FIRTDISEASEHASH);

await clmpropbyhash(test_account5, IPFS6B_WITH_FIRTDISEASEHASH);
// next 2 should fail:
await should_fail_clmpropbyhash(test_account6, IPFS6B_WITH_FIRTDISEASEHASH);
await should_fail_clmpropbyhash(test_account7, IPFS6B_WITH_FIRTDISEASEHASH);




// next 3 should fail:
await should_fail_clmpropbyhash(test_account2, IPFS7B_WITH_FIRTDISEASEHASH);
await should_fail_clmpropbyhash(test_account3, IPFS7B_WITH_FIRTDISEASEHASH);
await should_fail_clmpropbyhash(test_account4, IPFS7B_WITH_FIRTDISEASEHASH);
// should pass:
await clmpropbyhash(test_account5, IPFS7B_WITH_FIRTDISEASEHASH);
// next 2 should fail:
await should_fail_clmpropbyhash(test_account6, IPFS7B_WITH_FIRTDISEASEHASH);
await should_fail_clmpropbyhash(test_account7, IPFS7B_WITH_FIRTDISEASEHASH);

IPFS_IDONTEXIST_DISEASEHASH = randomipfs();

// next 3 should fail:
await should_fail_clmpropbyhash(test_account4, IPFS2B_WITH_FIRTDISEASEHASH);
await should_fail_clmpropbyhash(test_account5, IPFS7B_WITH_FIRTDISEASEHASH);
await should_fail_clmpropbyhash(test_account5, IPFS_IDONTEXIST_DISEASEHASH);


NEW_BALANCE_ACCOUNT = await EticaReleaseProtocolTestPhase2Instance.balanceOf(test_account.address);  
NEW_BALANCE_ACCOUNT_2 = await EticaReleaseProtocolTestPhase2Instance.balanceOf(test_account2.address);
NEW_BALANCE_ACCOUNT_3 = await EticaReleaseProtocolTestPhase2Instance.balanceOf(test_account3.address);
NEW_BALANCE_ACCOUNT_4 = await EticaReleaseProtocolTestPhase2Instance.balanceOf(test_account4.address);
NEW_BALANCE_ACCOUNT_5 = await EticaReleaseProtocolTestPhase2Instance.balanceOf(test_account5.address);
NEW_BALANCE_ACCOUNT_6 = await EticaReleaseProtocolTestPhase2Instance.balanceOf(test_account6.address);
NEW_BALANCE_ACCOUNT_7 = await EticaReleaseProtocolTestPhase2Instance.balanceOf(test_account7.address);
NEW_BALANCE_ACCOUNT_8 = await EticaReleaseProtocolTestPhase2Instance.balanceOf(test_account8.address);


// ACCOUNT 1:
let _expected_reward_acc1_prop_1B = await get_expected_reward(test_account, IPFS1B_WITH_FIRTDISEASEHASH);
let _expected_total_reward_B_acc1 =  _expected_reward_acc1_prop_1B;
_expected_total_reward_B_acc1 = Number.parseFloat(_expected_total_reward_B_acc1).toPrecision(9);
console.log('_expected_reward_acc1_prop1 is', _expected_reward_acc1_prop_1B);
console.log('_expected_total_reward_B_acc1 is', _expected_total_reward_B_acc1);

let _effective_reward_B_acc1 = web3.utils.fromWei(NEW_BALANCE_ACCOUNT, "ether" ) - web3.utils.fromWei(MID_BALANCE_ACCOUNT, "ether" );
_effective_reward_B_acc1 = Number.parseFloat(_effective_reward_B_acc1).toPrecision(9);
console.log('_effective_acc1 new ETI as REWARD:', _effective_reward_B_acc1);
// acc5 should have gotten exactly the expected REWARD calculated by get_expected_reward() :
assert.equal( _effective_reward_B_acc1, _expected_total_reward_B_acc1); // 13767.044628187738 == _expected_reward_acc5_prop_4B + _expected_reward_acc5_prop_5B


// --------------- ACCOUNT 2 -------------------  //

let _expected_reward_acc2_prop_1B = await get_expected_reward(test_account2, IPFS1B_WITH_FIRTDISEASEHASH);

let _expected_reward_acc2_prop_2B = await get_expected_reward(test_account2, IPFS2B_WITH_FIRTDISEASEHASH);

let _expected_reward_acc2_prop_3B = await get_expected_reward(test_account2, IPFS3B_WITH_FIRTDISEASEHASH);

let _expected_reward_acc2_prop_4B = await get_expected_reward(test_account2, IPFS4B_WITH_FIRTDISEASEHASH);

let _expected_reward_acc2_prop_5B = await get_expected_reward(test_account2, IPFS5B_WITH_FIRTDISEASEHASH);

let _expected_reward_acc2_prop_6B = await get_expected_reward(test_account2, IPFS6B_WITH_FIRTDISEASEHASH);

let _expected_reward_acc2_prop_7B = await get_expected_reward(test_account2, IPFS7B_WITH_FIRTDISEASEHASH);


let _expected_total_reward_B_acc2 =  _expected_reward_acc2_prop_1B + _expected_reward_acc2_prop_2B + _expected_reward_acc2_prop_3B + _expected_reward_acc2_prop_4B + _expected_reward_acc2_prop_5B + _expected_reward_acc2_prop_6B + _expected_reward_acc2_prop_7B;
// console.log('_expected_total_reward_B_acc2 is', _expected_total_reward_B_acc2);
// ---> because of significant figure issues we remove last 2 figures:
_expected_total_reward_B_acc2 = Number.parseFloat(_expected_total_reward_B_acc2).toPrecision(9);


let _effective_reward_B_acc2 = web3.utils.fromWei(NEW_BALANCE_ACCOUNT_2, "ether" ) - web3.utils.fromWei(MID_BALANCE_ACCOUNT_2, "ether" );
console.log('_effective_acc2 new ETI as REWARD:', _effective_reward_B_acc2);
// ---> because of significant figure issues we remove last 2 figures:
_effective_reward_B_acc2 = Number.parseFloat(_effective_reward_B_acc2).toPrecision(9);

// acc5 should have gotten exactly the expected REWARD calculated by get_expected_reward() :
assert.equal( _effective_reward_B_acc2, _expected_total_reward_B_acc2); // 188.6335518176314 == _expected_reward_acc5_prop_4B + _expected_reward_acc5_prop_5B

// --------------- ACCOUNT 2 -------------------  //


// --------------- ACCOUNT 3 -------------------  //

let _expected_reward_acc3_prop_1B = await get_expected_reward(test_account3, IPFS1B_WITH_FIRTDISEASEHASH);

let _expected_reward_acc3_prop_2B = await get_expected_reward(test_account3, IPFS2B_WITH_FIRTDISEASEHASH);

let _expected_reward_acc3_prop_3B = await get_expected_reward(test_account3, IPFS3B_WITH_FIRTDISEASEHASH);

let _expected_reward_acc3_prop_4B = await get_expected_reward(test_account3, IPFS4B_WITH_FIRTDISEASEHASH);

let _expected_reward_acc3_prop_5B = await get_expected_reward(test_account3, IPFS5B_WITH_FIRTDISEASEHASH);

let _expected_reward_acc3_prop_6B = await get_expected_reward(test_account3, IPFS6B_WITH_FIRTDISEASEHASH);

let _expected_reward_acc3_prop_7B = await get_expected_reward(test_account3, IPFS7B_WITH_FIRTDISEASEHASH);


let _expected_total_reward_B_acc3 =  _expected_reward_acc3_prop_1B + _expected_reward_acc3_prop_2B + _expected_reward_acc3_prop_3B + _expected_reward_acc3_prop_4B + _expected_reward_acc3_prop_5B + _expected_reward_acc3_prop_6B + _expected_reward_acc3_prop_7B;
 console.log('_expected_total_reward_B_acc3 is', _expected_total_reward_B_acc3);
// ---> because of significant figure issues we remove last 2 figures:
_expected_total_reward_B_acc3 = Number.parseFloat(_expected_total_reward_B_acc3).toPrecision(9);


let _effective_reward_B_acc3 = web3.utils.fromWei(NEW_BALANCE_ACCOUNT_3, "ether" ) - web3.utils.fromWei(MID_BALANCE_ACCOUNT_3, "ether" );
console.log('_effective_acc3 new ETI as REWARD:', _effective_reward_B_acc3);
// ---> because of significant figure issues we remove last 2 figures:
_effective_reward_B_acc3 = Number.parseFloat(_effective_reward_B_acc3).toPrecision(9);

// acc3 should have gotten exactly the expected REWARD calculated by get_expected_reward() :
assert.equal( _effective_reward_B_acc3, _expected_total_reward_B_acc3); // 188.6335518176314 == _expected_reward_acc5_prop_4B + _expected_reward_acc5_prop_5B

// --------------- ACCOUNT 3 -------------------  //

// --------------- ACCOUNT 4 -------------------  //

let _expected_reward_acc4_prop_1B = await get_expected_reward(test_account4, IPFS1B_WITH_FIRTDISEASEHASH);

let _expected_reward_acc4_prop_2B = await get_expected_reward(test_account4, IPFS2B_WITH_FIRTDISEASEHASH);

let _expected_reward_acc4_prop_3B = await get_expected_reward(test_account4, IPFS3B_WITH_FIRTDISEASEHASH);

let _expected_reward_acc4_prop_4B = await get_expected_reward(test_account4, IPFS4B_WITH_FIRTDISEASEHASH);

let _expected_reward_acc4_prop_5B = await get_expected_reward(test_account4, IPFS5B_WITH_FIRTDISEASEHASH);

let _expected_reward_acc4_prop_6B = await get_expected_reward(test_account4, IPFS6B_WITH_FIRTDISEASEHASH);

let _expected_reward_acc4_prop_7B = await get_expected_reward(test_account4, IPFS7B_WITH_FIRTDISEASEHASH);


let _expected_total_reward_B_acc4 =  _expected_reward_acc4_prop_1B + _expected_reward_acc4_prop_2B + _expected_reward_acc4_prop_3B + _expected_reward_acc4_prop_4B + _expected_reward_acc4_prop_5B + _expected_reward_acc4_prop_6B + _expected_reward_acc4_prop_7B;
// console.log('_expected_total_reward_B_acc3 is', _expected_total_reward_B_acc3);
// ---> because of significant figure issues we remove last 2 figures:
_expected_total_reward_B_acc4 = Number.parseFloat(_expected_total_reward_B_acc4).toPrecision(9);


let _effective_reward_B_acc4 = web3.utils.fromWei(NEW_BALANCE_ACCOUNT_4, "ether" ) - web3.utils.fromWei(MID_BALANCE_ACCOUNT_4, "ether" );
console.log('_effective_acc4 new ETI as REWARD:', _effective_reward_B_acc4);
// ---> because of significant figure issues we remove last 2 figures:
_effective_reward_B_acc4 = Number.parseFloat(_effective_reward_B_acc4).toPrecision(9);

// acc4 should have gotten exactly the expected REWARD calculated by get_expected_reward() :
assert.equal( _effective_reward_B_acc4, _expected_total_reward_B_acc4); // 188.6335518176314 == _expected_reward_acc5_prop_4B + _expected_reward_acc5_prop_5B

// --------------- ACCOUNT 4 -------------------  //


// --------------- ACCOUNT 5 -------------------  //

let _expected_reward_acc5_prop_1B = await get_expected_reward(test_account5, IPFS1B_WITH_FIRTDISEASEHASH);

let _expected_reward_acc5_prop_2B = await get_expected_reward(test_account5, IPFS2B_WITH_FIRTDISEASEHASH);

let _expected_reward_acc5_prop_3B = await get_expected_reward(test_account5, IPFS3B_WITH_FIRTDISEASEHASH);

//let _expected_reward_acc5_prop_4B = await get_expected_reward(test_account5, IPFS4B_WITH_FIRTDISEASEHASH); Already done

//let _expected_reward_acc5_prop_5B = await get_expected_reward(test_account5, IPFS5B_WITH_FIRTDISEASEHASH); Already done

let _expected_reward_acc5_prop_6B = await get_expected_reward(test_account5, IPFS6B_WITH_FIRTDISEASEHASH);

let _expected_reward_acc5_prop_7B = await get_expected_reward(test_account5, IPFS7B_WITH_FIRTDISEASEHASH);


_expected_total_reward_B_acc5 =  _expected_reward_acc5_prop_1B + _expected_reward_acc5_prop_2B + _expected_reward_acc5_prop_3B + _expected_reward_acc5_prop_6B + _expected_reward_acc5_prop_7B;
 console.log('_expected_total_reward_B_acc5 is', _expected_total_reward_B_acc5);
// ---> because of significant figure issues we remove last 2 figures:
_expected_total_reward_B_acc5 = Number.parseFloat(_expected_total_reward_B_acc5).toPrecision(9);


_effective_reward_B_acc5 = web3.utils.fromWei(NEW_BALANCE_ACCOUNT_5, "ether" ) - web3.utils.fromWei(MID_BALANCE_ACCOUNT_5, "ether" );
//console.log('_effective_acc5 new ETI as REWARD:', _effective_reward_B_acc5);
// ---> because of significant figure issues we remove last 2 figures:
_effective_reward_B_acc5 = Number.parseFloat(_effective_reward_B_acc5).toPrecision(9);

// acc4 should have gotten exactly the expected REWARD calculated by get_expected_reward() :
assert.equal( _effective_reward_B_acc5, _expected_total_reward_B_acc5); // 188.6335518176314 == _expected_reward_acc5_prop_4B + _expected_reward_acc5_prop_5B

// --------------- ACCOUNT 5 -------------------  //

// --------------- ACCOUNT 6 -------------------  //

let _expected_reward_acc6_prop_1B = await get_expected_reward(test_account6, IPFS1B_WITH_FIRTDISEASEHASH);

let _expected_reward_acc6_prop_2B = await get_expected_reward(test_account6, IPFS2B_WITH_FIRTDISEASEHASH);

let _expected_reward_acc6_prop_3B = await get_expected_reward(test_account6, IPFS3B_WITH_FIRTDISEASEHASH);

//let _expected_reward_acc5_prop_4B = await get_expected_reward(test_account5, IPFS4B_WITH_FIRTDISEASEHASH); Already done

let _expected_reward_acc6_prop_5B = await get_expected_reward(test_account6, IPFS5B_WITH_FIRTDISEASEHASH);

let _expected_reward_acc6_prop_6B = await get_expected_reward(test_account6, IPFS6B_WITH_FIRTDISEASEHASH);

let _expected_reward_acc6_prop_7B = await get_expected_reward(test_account6, IPFS7B_WITH_FIRTDISEASEHASH);


_expected_total_reward_B_acc6 =  _expected_reward_acc6_prop_1B + _expected_reward_acc6_prop_2B + _expected_reward_acc6_prop_3B + _expected_reward_acc6_prop_5B + _expected_reward_acc6_prop_6B + _expected_reward_acc6_prop_7B;
 console.log('_expected_total_reward_B_acc6 is', _expected_total_reward_B_acc6);
// ---> because of significant figure issues we remove last 2 figures:
_expected_total_reward_B_acc6 = Number.parseFloat(_expected_total_reward_B_acc6).toPrecision(9);


_effective_reward_B_acc6 = web3.utils.fromWei(NEW_BALANCE_ACCOUNT_6, "ether" ) - web3.utils.fromWei(MID_BALANCE_ACCOUNT_6, "ether" );
//console.log('_effective_acc6 new ETI as REWARD:', _effective_reward_B_acc6);
// ---> because of significant figure issues we remove last 2 figures:
_effective_reward_B_acc6 = Number.parseFloat(_effective_reward_B_acc6).toPrecision(9);

// acc6 should have gotten exactly the expected REWARD calculated by get_expected_reward() :
assert.equal( _effective_reward_B_acc6, _expected_total_reward_B_acc6); // 188.6335518176314 == _expected_reward_acc5_prop_4B + _expected_reward_acc5_prop_5B

// --------------- ACCOUNT 6 -------------------  //


// --------------- ACCOUNT 7 -------------------  //

let _expected_reward_acc7_prop_1B = await get_expected_reward(test_account7, IPFS1B_WITH_FIRTDISEASEHASH);

let _expected_reward_acc7_prop_2B = await get_expected_reward(test_account7, IPFS2B_WITH_FIRTDISEASEHASH);

let _expected_reward_acc7_prop_3B = await get_expected_reward(test_account7, IPFS3B_WITH_FIRTDISEASEHASH);

//let _expected_reward_acc7_prop_4B = await get_expected_reward(test_account7, IPFS4B_WITH_FIRTDISEASEHASH); Already done

let _expected_reward_acc7_prop_5B = await get_expected_reward(test_account7, IPFS5B_WITH_FIRTDISEASEHASH);

let _expected_reward_acc7_prop_6B = await get_expected_reward(test_account7, IPFS6B_WITH_FIRTDISEASEHASH);

let _expected_reward_acc7_prop_7B = await get_expected_reward(test_account7, IPFS7B_WITH_FIRTDISEASEHASH);


_expected_total_reward_B_acc7 =  _expected_reward_acc7_prop_1B + _expected_reward_acc7_prop_2B + _expected_reward_acc7_prop_3B + _expected_reward_acc7_prop_5B + _expected_reward_acc7_prop_6B + _expected_reward_acc7_prop_7B;
 console.log('_expected_total_reward_B_acc7 is', _expected_total_reward_B_acc7);
// ---> because of significant figure issues we remove last 2 figures:
_expected_total_reward_B_acc7 = Number.parseFloat(_expected_total_reward_B_acc7).toPrecision(9);


_effective_reward_B_acc7 = web3.utils.fromWei(NEW_BALANCE_ACCOUNT_7, "ether" ) - web3.utils.fromWei(MID_BALANCE_ACCOUNT_7, "ether" );
//console.log('_effective_acc7 new ETI as REWARD:', _effective_reward_B_acc7);
// ---> because of significant figure issues we remove last 2 figures:
_effective_reward_B_acc7 = Number.parseFloat(_effective_reward_B_acc7).toPrecision(9);

// acc6 should have gotten exactly the expected REWARD calculated by get_expected_reward() :
assert.equal( _effective_reward_B_acc7, _expected_total_reward_B_acc7); // 188.6335518176314 == _expected_reward_acc5_prop_4B + _expected_reward_acc5_prop_5B

// --------------- ACCOUNT 7 -------------------  //


// RECHECKING PROPOSAL DATA AFTER CLAIMING
console.log('RECHECKING OF PROPOSALS DATA STARTED');
_proposal1B = await EticaReleaseProtocolTestPhase2Instance.propsdatas(IPFS1B_WITH_FIRTDISEASEHASH);
assert.equal(_proposal1B.nbvoters, '6', 'Proposal1 should have 6 nbvoters');

_proposal2B = await EticaReleaseProtocolTestPhase2Instance.propsdatas(IPFS2B_WITH_FIRTDISEASEHASH);
assert.equal(_proposal2B.nbvoters, '5', 'Proposal2 should have 5 nbvoters');

_proposal3B = await EticaReleaseProtocolTestPhase2Instance.propsdatas(IPFS3B_WITH_FIRTDISEASEHASH);
assert.equal(_proposal3B.nbvoters, '5', 'Proposal3 should have 5 nbvoters');

_proposal4B = await EticaReleaseProtocolTestPhase2Instance.propsdatas(IPFS4B_WITH_FIRTDISEASEHASH);
assert.equal(_proposal4B.nbvoters, '5', 'Proposal4 should have 5 nbvoters');

_proposal5B = await EticaReleaseProtocolTestPhase2Instance.propsdatas(IPFS5B_WITH_FIRTDISEASEHASH);
assert.equal(_proposal5B.nbvoters, '0', 'Proposal5 should have 0 nbvoters');

_proposal6B = await EticaReleaseProtocolTestPhase2Instance.propsdatas(IPFS6B_WITH_FIRTDISEASEHASH);
assert.equal(_proposal6B.nbvoters, '0', 'Proposal6 should have 0 nbvoters');

_proposal7B = await EticaReleaseProtocolTestPhase2Instance.propsdatas(IPFS7B_WITH_FIRTDISEASEHASH);
assert.equal(_proposal7B.nbvoters, '0', 'Proposal7 should have 0 nbvoters');

console.log('----------------->   PROPOSALS NBVOTERS CHECKED  <-----------------');


assert.equal(web3.utils.fromWei(_proposal1B.forvotes.toString()), '650', 'Proposal1 should have 650 forvotes');
assert.equal(web3.utils.fromWei(_proposal1B.againstvotes.toString()), '480', 'Proposal1 should have 480 against votes');

assert.equal(web3.utils.fromWei(_proposal2B.forvotes.toString()), '535', 'Proposal2 should have 535 forvotes');
assert.equal(web3.utils.fromWei(_proposal2B.againstvotes.toString()), '1400', 'Proposal1 should have 1400 against votes');

assert.equal(web3.utils.fromWei(_proposal3B.forvotes.toString()), '600', 'Proposal3 should have 600 forvotes');
assert.equal(web3.utils.fromWei(_proposal3B.againstvotes.toString()), '600', 'Proposal3 should have 500 against votes');

assert.equal(web3.utils.fromWei(_proposal4B.forvotes.toString()), '160', 'Proposal4 should have 160 forvotes');
assert.equal(web3.utils.fromWei(_proposal4B.againstvotes.toString()), '0', 'Proposal4 should have 0 against votes');

console.log('----------------->   PROPOSALS FORVOTES AND AGAINTSVOTES CHECKED  <-----------------');

assert.equal(_proposal1B.prestatus, '1', 'Proposal1 prestatus should be Accepted');
assert.equal(_proposal2B.prestatus, '0', 'Proposal2 prestatus should be Rejected');
assert.equal(_proposal3B.prestatus, '0', 'Proposal3 prestatus should be Rejected');
assert.equal(_proposal4B.prestatus, '1', 'Proposal4 prestatus should be Accepted');
assert.equal(_proposal5B.prestatus, '3', 'Proposal5 prestatus should be SingleVoter');
assert.equal(_proposal6B.prestatus, '3', 'Proposal6 prestatus should be SingleVoter');
assert.equal(_proposal7B.prestatus, '3', 'Proposal7 prestatus should be SingleVoter');

console.log('----------------->   PROPOSALS PRESTATUS CHECKED  <-----------------');

assert.equal(_proposal1B.status, '1', 'Proposal1 status should be Accepted');
assert.equal(_proposal2B.status, '0', 'Proposal2 status should be Rejected');
assert.equal(_proposal3B.status, '0', 'Proposal3 status should be Rejected');
assert.equal(_proposal4B.status, '1', 'Proposal4 status should be Accepted');
assert.equal(_proposal5B.status, '0', 'Proposal5 status should be Rejected');
assert.equal(_proposal6B.status, '0', 'Proposal6 status should be Rejected');
assert.equal(_proposal7B.status, '0', 'Proposal7 status should be Rejected');

console.log('----------------->   PROPOSALS STATUS CHECKED  <-----------------');

assert.equal(web3.utils.fromWei(_proposal1.lastcuration_weight, "ether" ), '650', 'Proposal1 should have a lastcuration_weight of 650');
assert.equal(web3.utils.fromWei(_proposal2.lastcuration_weight, "ether" ), '1400', 'Proposal2 should have a lastcuration_weight of 1400');
assert.equal(web3.utils.fromWei(_proposal3.lastcuration_weight, "ether" ), '0', 'Proposal3 should have a lastcuration_weight of 0');
assert.equal(web3.utils.fromWei(_proposal4.lastcuration_weight, "ether" ), '160', 'Proposal4 should have a lastcuration_weight of 160');
assert.equal(web3.utils.fromWei(_proposal5.lastcuration_weight, "ether" ), '0', 'Proposal5 should have a lastcuration_weight of 0');
assert.equal(web3.utils.fromWei(_proposal6.lastcuration_weight, "ether" ), '0', 'Proposal6 should have a lastcuration_weight of 0');
assert.equal(web3.utils.fromWei(_proposal7.lastcuration_weight, "ether" ), '0', 'Proposal7 should have a lastcuration_weight of 0');

console.log('----------------->   PROPOSALS LASTCURATIONWEIGHT CHECKED  <-----------------');

assert.equal(web3.utils.fromWei(_proposal1.lasteditor_weight, "ether" ), '650', 'Proposal1 should have a lasteditor_weight of 650');
assert.equal(web3.utils.fromWei(_proposal2.lasteditor_weight, "ether" ), '0', 'Proposal2 should have a lasteditor_weight of 0');
assert.equal(web3.utils.fromWei(_proposal3.lasteditor_weight, "ether" ), '0', 'Proposal3 should have a lasteditor_weight of 0');
assert.equal(web3.utils.fromWei(_proposal4.lasteditor_weight, "ether" ), '160', 'Proposal4 should have a lasteditor_weight of 160');
assert.equal(web3.utils.fromWei(_proposal5.lasteditor_weight, "ether" ), '0', 'Proposal5 should have a lasteditor_weight of 0');
assert.equal(web3.utils.fromWei(_proposal6.lasteditor_weight, "ether" ), '0', 'Proposal6 should have a lasteditor_weight of 0');
assert.equal(web3.utils.fromWei(_proposal7.lasteditor_weight, "ether" ), '0', 'Proposal7 should have a lasteditor_weight of 0');

console.log('----------------->   PROPOSALS LASTEDITORWEIGHT CHECKED  <-----------------');

assert.equal(_proposal1B.slashingratio.toNumber(), 1505, 'Proposal1 should have a slashingratio of 0.1505');
assert.equal(_proposal2B.slashingratio.toNumber(), 4471, 'Proposal2 should have a slashingratio of 0.4471');
assert.equal(_proposal3B.slashingratio.toNumber(), 0, 'Proposal3 should have a slashingratio of 0');
assert.equal(_proposal4B.slashingratio.toNumber(), 10000, 'Proposal4 should have a slashingratio of 1');
assert.equal(_proposal5B.slashingratio.toNumber(), 0, 'Proposal5 should have a slashingratio of 0');
assert.equal(_proposal6B.slashingratio.toNumber(), 0, 'Proposal6 should have a slashingratio of 0');
assert.equal(_proposal7B.slashingratio.toNumber(), 0, 'Proposal7 should have a slashingratio of 0');

console.log('----------------->   PROPOSALS SLASHINGRATIO CHECKED  <-----------------');

console.log('RECHECKING OF PROPOSALS DATA DONE WITH SUCCESS');
// RECHECKING PROPOSALDATA DONE

// RECHECKINKG PERIOD NB VOTERS
assert.equal(_period1B.total_voters.toNumber(), 21, 'Period_1B should have 21 voters');
console.log('RECHECKING OF PERIOD TOTAL_VOTERS DONE WITH SUCCESS');
// RECHECKING PERIOD NB VOTERS

// TESTS GET ETICA BACK:
// Every account has made to stakes:
await stakeclmidx(test_account, 1);
await stakeclmidx(test_account, 1);

await should_fail_stakeclmidx(test_account2, 1);
await stakeclmidx(test_account2, 2);



// ----------------------  Make tests for Dynamic APPROVAL THRESHOLD ----------------------------- //

console.log('<--------------------------- ENTERING NEXT PERIOD: III  ---------------------------------- >');

// advance time so that we enter next period: 
await advanceseconds(REWARD_INTERVAL);

// make few proposals and revealvote() to actualize periodIII.forprops and period.againstprops OF period III:

let IPFS1C = randomipfs();
let IPFS2C = randomipfs();
let IPFS3C = randomipfs();
let IPFS4C = randomipfs();
let IPFS5C = randomipfs();
let IPFS6C = randomipfs();
let IPFS7C = randomipfs();
let IPFS8C = randomipfs();

let IPFS1C_WITH_FIRTDISEASEHASH = get_expected_keccak256_hash_two(IPFS1C, EXPECTED_FIRST_DISEASE_HASH);
let IPFS2C_WITH_FIRTDISEASEHASH = get_expected_keccak256_hash_two(IPFS2C, EXPECTED_FIRST_DISEASE_HASH);
let IPFS3C_WITH_FIRTDISEASEHASH = get_expected_keccak256_hash_two(IPFS3C, EXPECTED_FIRST_DISEASE_HASH);
let IPFS4C_WITH_FIRTDISEASEHASH = get_expected_keccak256_hash_two(IPFS4C, EXPECTED_FIRST_DISEASE_HASH);
let IPFS5C_WITH_FIRTDISEASEHASH = get_expected_keccak256_hash_two(IPFS5C, EXPECTED_FIRST_DISEASE_HASH);
let IPFS6C_WITH_FIRTDISEASEHASH = get_expected_keccak256_hash_two(IPFS6C, EXPECTED_FIRST_DISEASE_HASH);
let IPFS7C_WITH_FIRTDISEASEHASH = get_expected_keccak256_hash_two(IPFS7C, EXPECTED_FIRST_DISEASE_HASH);

await createproposal(test_account, EXPECTED_FIRST_DISEASE_HASH, "Title 1 Malaria", "Description 1", IPFS1C, "", "", "Targets:[one_target_here,another_target_here]","Compounds:[one_compound_here, another_compound_here]","Use this field as the community created standards");
await createproposal(test_account2, EXPECTED_FIRST_DISEASE_HASH, "Title 2 Malaria", "Description 2", IPFS2C, "", "", "Targets:[one_target_here,another_target_here]","Compounds:[one_compound_here, another_compound_here]","Use this field as the community created standards");

// New Period III should have been created and thus APPROVAL_THRESHOLD SHOULD HAVE BEEN UPDATED:
APPROVAL_THRESHOLD = await EticaReleaseProtocolTestPhase2Instance.APPROVAL_THRESHOLD();
console.log('NEW APPROVAL THRESHOLD IS ', APPROVAL_THRESHOLD.toString());
assert.equal(APPROVAL_THRESHOLD, '50', 'APPROVAL_THRESHOLD SHOULD BE 50');

await commitvote(test_account3, IPFS1C_WITH_FIRTDISEASEHASH, true, '5', "random123");
await commitvote(test_account4, IPFS2C_WITH_FIRTDISEASEHASH, true, '5', "random123");

// advance time to enter revealing Period:
await advanceseconds(DEFAULT_VOTING_TIME);

await revealvote(test_account3, IPFS1C_WITH_FIRTDISEASEHASH, true, '5', "random123");
await revealvote(test_account4, IPFS2C_WITH_FIRTDISEASEHASH, true, '5', "random123");





console.log('<--------------------------- ENTERING NEXT PERIOD: IV  ---------------------------------- >');

// advance time so that we enter next period: 
await advanceseconds(REWARD_INTERVAL);

// make few proposals and revealvote() to actualize periodIV.forprops and period.againstprops OF period III:

let IPFS1D = randomipfs();
let IPFS2D = randomipfs();
let IPFS3D = randomipfs();

let IPFS1D_WITH_FIRTDISEASEHASH = get_expected_keccak256_hash_two(IPFS1D, EXPECTED_FIRST_DISEASE_HASH);
let IPFS2D_WITH_FIRTDISEASEHASH = get_expected_keccak256_hash_two(IPFS2D, EXPECTED_FIRST_DISEASE_HASH);
let IPFS3D_WITH_FIRTDISEASEHASH = get_expected_keccak256_hash_two(IPFS3D, EXPECTED_FIRST_DISEASE_HASH);

await createproposal(test_account5, EXPECTED_FIRST_DISEASE_HASH, "Title 1 Malaria", "Description 1", IPFS1D, "", "", "Targets:[one_target_here,another_target_here]","Compounds:[one_compound_here, another_compound_here]","Use this field as the community created standards");
await createproposal(test_account5, EXPECTED_FIRST_DISEASE_HASH, "Title 2 Malaria", "Description 2", IPFS2D, "", "", "Targets:[one_target_here,another_target_here]","Compounds:[one_compound_here, another_compound_here]","Use this field as the community created standards");
await createproposal(test_account6, EXPECTED_FIRST_DISEASE_HASH, "Title 2 Malaria", "Description 2", IPFS3D, "", "", "Targets:[one_target_here,another_target_here]","Compounds:[one_compound_here, another_compound_here]","Use this field as the community created standards");


await commitvote(test_account3, IPFS2D_WITH_FIRTDISEASEHASH, true, '5', "random123");
await commitvote(test_account4, IPFS3D_WITH_FIRTDISEASEHASH, true, '5', "random123");

// advance time to enter revealing Period:
await advanceseconds(DEFAULT_VOTING_TIME);

await revealvote(test_account3, IPFS2D_WITH_FIRTDISEASEHASH, true, '5', "random123");
await revealvote(test_account4, IPFS3D_WITH_FIRTDISEASEHASH, true, '5', "random123");



console.log('<--------------------------- ENTERING NEXT PERIOD: V  ---------------------------------- >');

// advance time so that we enter next period: 
await advanceseconds(REWARD_INTERVAL);

// make few proposals and revealvote() to actualize periodIII.forprops and period.againstprops OF period III:

let IPFS1E = randomipfs();
let IPFS2E = randomipfs();
let IPFS3E = randomipfs();

let IPFS1E_WITH_FIRTDISEASEHASH = get_expected_keccak256_hash_two(IPFS1E, EXPECTED_FIRST_DISEASE_HASH);
let IPFS2E_WITH_FIRTDISEASEHASH = get_expected_keccak256_hash_two(IPFS2E, EXPECTED_FIRST_DISEASE_HASH);
let IPFS3E_WITH_FIRTDISEASEHASH = get_expected_keccak256_hash_two(IPFS3E, EXPECTED_FIRST_DISEASE_HASH);

await createproposal(test_account, EXPECTED_FIRST_DISEASE_HASH, "Title 1 Malaria", "Description 1", IPFS1E, "", "", "Targets:[one_target_here,another_target_here]","Compounds:[one_compound_here, another_compound_here]","Use this field as the community created standards");
await createproposal(test_account2, EXPECTED_FIRST_DISEASE_HASH, "Title 2 Malaria", "Description 2", IPFS2E, "", "", "Targets:[one_target_here,another_target_here]","Compounds:[one_compound_here, another_compound_here]","Use this field as the community created standards");
await createproposal(test_account3, EXPECTED_FIRST_DISEASE_HASH, "Title 2 Malaria", "Description 2", IPFS3E, "", "", "Targets:[one_target_here,another_target_here]","Compounds:[one_compound_here, another_compound_here]","Use this field as the community created standards");

// New Period V should have been created and thus APPROVAL_THRESHOLD SHOULD HAVE BEEN UPDATED:
APPROVAL_THRESHOLD = await EticaReleaseProtocolTestPhase2Instance.APPROVAL_THRESHOLD();
console.log('NEW APPROVAL THRESHOLD for PERIOD V IS ', APPROVAL_THRESHOLD.toString());
assert.equal(APPROVAL_THRESHOLD, '75', 'APPROVAL_THRESHOLD SHOULD BE 75');

await commitvote(test_account3, IPFS2E_WITH_FIRTDISEASEHASH, true, '5', "random123");
await commitvote(test_account4, IPFS3E_WITH_FIRTDISEASEHASH, false, '5', "random123");

// advance time to enter revealing Period:
await advanceseconds(DEFAULT_VOTING_TIME);

await revealvote(test_account3, IPFS2E_WITH_FIRTDISEASEHASH, true, '5', "random123");
await revealvote(test_account4, IPFS3E_WITH_FIRTDISEASEHASH, false, '5', "random123");

// ----------------------  Make tests for Dynamic APPROVAL THRESHOLD done ----------------------------- //

  console.log('------------------------------------- ETICA PROTOCOL SUCCESSFULLY PASSED THE TESTS OF PHASE 2 ---------------------------');

  })

  });


  async function printBalances(accounts) {
    // accounts.forEach(function(ac, i) {
       var balance_val = await (web3.eth.getBalance(accounts[0]));
       //console.log('acct 0 balance', web3.utils.fromWei(balance_val.toString() , 'ether') )
    // })
   }

   async function printEtiBalance(testaccount) {
       var balance_val = await EticaReleaseProtocolTestPhase2Instance.balanceOf(testaccount.address);
       console.log('ETI the balance of ', testaccount.address, 'is',  web3.utils.fromWei(balance_val.toString() , 'ether') );
       return balance_val;
   }

   async function transferto(testaccount) {

    console.log('transfering 10000 ETI from miner_account to test_account', testaccount.address);
    let test_accountbalancebefore = await EticaReleaseProtocolTestPhase2Instance.balanceOf(testaccount.address);
    let miner_accountbalancebefore = await EticaReleaseProtocolTestPhase2Instance.balanceOf(miner_account.address);
    console.log('miner_account ETI balance before:', web3.utils.fromWei(miner_accountbalancebefore, "ether" ));
    console.log('test_account', testaccount.address,'ETI balance before:', web3.utils.fromWei(test_accountbalancebefore, "ether" ));
    return EticaReleaseProtocolTestPhase2Instance.transfer(testaccount.address,  web3.utils.toWei('10000', 'ether'), {from: miner_account.address}).then(async function() {
      let test_accountbalanceafter = await EticaReleaseProtocolTestPhase2Instance.balanceOf(testaccount.address);
      let miner_accountbalanceafter = await EticaReleaseProtocolTestPhase2Instance.balanceOf(miner_account.address);
      console.log('miner_account ETI balance after:', web3.utils.fromWei(miner_accountbalanceafter, "ether" ));
      console.log('test_account', testaccount.address,'ETI balance after:', web3.utils.fromWei(test_accountbalanceafter, "ether" ));
     });

   }


   async function transferfromto(senderaccount, receiveraccount, amount) {

    console.log('transfering', amount,'ETI from senderaccount', senderaccount.address, 'to receiveraccount', receiveraccount.address);

    return EticaReleaseProtocolTestPhase2Instance.transfer(receiveraccount.address,  web3.utils.toWei(amount, 'ether'), {from: senderaccount.address}).then(async function() {
 
    console.log('transfered', amount,'ETI from senderaccount', senderaccount.address, 'to receiveraccount', receiveraccount.address);

     });

   }

   async function eticatobosom(useraccount, amount){

    console.log('---> Staking Eticas for Bosoms. Stake amount is', amount, 'ETI. User is ', useraccount.address);
    return EticaReleaseProtocolTestPhase2Instance.eticatobosoms(useraccount.address,  web3.utils.toWei(amount, 'ether'), {from: useraccount.address}).then(async function(receipt){
    console.log('---> The stake of Eticas for Bosoms worth', amount, 'ETI', 'was successfull');

      }).catch(async function(error){
        console.log('An error has occured !', error);
      })
   }


   async function stakescsldt(useraccount, endTime, min_limit, maxidx){

    console.log('---> Consolidating stakes. New endTime is', endTime, '.');
    return EticaReleaseProtocolTestPhase2Instance.stakescsldt(useraccount.address,  endTime, min_limit, maxidx, {from: useraccount.address}).then(async function(receipt){
    console.log('---> The consolidation of', endTime, ' endTime', 'was successfull');

      }).catch(async function(error){
        console.log('An error has occured !', error);
      })
   }

   async function should_fail_to_stakescsldt(useraccount, endTime, min_limit, maxidx){

    console.log('---> Should fail to consolidate with out of range params:  --> endTime:', endTime, '--> min_limit is:: ', min_limit, '--> maxidx is:', maxidx);
    await truffleAssert.fails(EticaReleaseProtocolTestPhase2Instance.stakescsldt(useraccount.address,  endTime, min_limit, maxidx, {from: useraccount.address}));
    console.log('---> As expected failed to consolidate with out of range params: --> endTime:', endTime, '--> min_limit is:: ', min_limit, '--> maxidx is:', maxidx);
   
  }

   async function getstake(_from_account, _idx){

    let _thestake = await EticaReleaseProtocolTestPhase2Instance.stakes(_from_account.address,_idx);
    return _thestake;

   }


   async function should_fail_eticatobosom(useraccount, amount){

    console.log('---> Staking Eticas for Bosoms. Stake amount is', amount, 'ETI. User is ', useraccount.address);
    await truffleAssert.fails(EticaReleaseProtocolTestPhase2Instance.eticatobosoms(useraccount.address,  web3.utils.toWei(amount, 'ether'), {from: useraccount.address}));
    console.log('---> As expected failed to make the stake worth', amount, 'ETI from user: ', useraccount.address);

   }

   // transfer that should fail:
   async function should_fail_transferfromto(senderaccount, receiveraccount, amount) {
     
    console.log('should fail transfering', amount,'ETI from senderaccount', senderaccount.address, 'to receiveraccount', receiveraccount.address);
    await truffleAssert.fails(EticaReleaseProtocolTestPhase2Instance.transfer(receiveraccount.address,  web3.utils.toWei(amount, 'ether'), {from: senderaccount.address}));
    console.log('as expected failed to transfer', amount,'ETI from senderaccount', senderaccount.address, 'to receiveraccount', receiveraccount.address);

  }

     // propose should fail:
     async function should_fail_propose(_from_account, _diseasehash, _title, _description, _raw_release_hash, _old_release_hash, _grandparent_hash, _firstfield, _secondfield, _thirdfield) {
     
      console.log('should fail to propose proposal with same raw_release_hash and diseasehash (', _raw_release_hash,' - ', _diseasehash, ')combination');
      await truffleAssert.fails(EticaReleaseProtocolTestPhase2Instance.propose(_diseasehash, _title, _description, _raw_release_hash, _old_release_hash, _grandparent_hash, _firstfield, _secondfield, _thirdfield, {from: _from_account.address}));
      console.log('as expected failed to propose proposal with same raw_release_hash and diseasehash (', _raw_release_hash,' - ', _diseasehash, ')combination');
  
    }

         // propose should fail:
         async function should_fail_revealvote(_from_account, _proposed_release_hash, _choice, _amount, _vary) {
     
          console.log('should fail this revealvote');
          await truffleAssert.fails(EticaReleaseProtocolTestPhase2Instance.revealvote(_proposed_release_hash, _choice, web3.utils.toWei(_amount, 'ether'), _vary, {from: _from_account.address}));
          console.log('as expected failed to make this revealvote');
      
        }

        async function should_fail_clmpropbyhash(_from_account, _proposalhash) {

          console.log('should fail to clmpropbyhash');
        await truffleAssert.fails(EticaReleaseProtocolTestPhase2Instance.clmpropbyhash(_proposalhash, {from: _from_account.address}));
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
    let _vote = await EticaReleaseProtocolTestPhase2Instance.votes(_rawrelease, _from_account.address);
    //console.log('_vote is', _vote);
    
    let _proposal = await EticaReleaseProtocolTestPhase2Instance.proposals(_rawrelease);
    let _proposaldatas = await EticaReleaseProtocolTestPhase2Instance.propsdatas(_rawrelease);
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

    let _period = await EticaReleaseProtocolTestPhase2Instance.periods(_proposal.period_id);
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


 async function createproposal(_from_account, _diseasehash, _title, _description, _raw_release_hash, _old_release_hash, _grandparent_hash, _firstfield, _secondfield, _thirdfield){

  console.log('................................  START CREATION OF NEW PROPOSAL', _title,' ....................... ');

  let oldproposalsCounter = await EticaReleaseProtocolTestPhase2Instance.proposalsCounter();

  let _from_accountbalancebefore = await EticaReleaseProtocolTestPhase2Instance.balanceOf(_from_account.address);
  //console.log('_from_account ETI balance before:', web3.utils.fromWei(_from_accountbalancebefore, "ether" ));

  let _from_accountbosomsbefore = await EticaReleaseProtocolTestPhase2Instance.bosoms(_from_account.address);
  //console.log('_from_account Bosoms before:', web3.utils.fromWei(_from_accountbosomsbefore, "ether" ));

  return EticaReleaseProtocolTestPhase2Instance.propose(_diseasehash, _title, _description, _raw_release_hash, _old_release_hash, _grandparent_hash, _firstfield, _secondfield, _thirdfield, {from: _from_account.address}).then(async function(response){

    let first_proposal = await EticaReleaseProtocolTestPhase2Instance.proposals(get_expected_keccak256_hash_two(_raw_release_hash, _diseasehash));
    let proposalsCounter = await EticaReleaseProtocolTestPhase2Instance.proposalsCounter();
    //console.log('THE FIRST PROPOSAL IS:', first_proposal);

    let first_proposal_ipfs = await EticaReleaseProtocolTestPhase2Instance.propsipfs(get_expected_keccak256_hash_two(_raw_release_hash, _diseasehash));
    //console.log('THE FIRST PROPOSAL IPFS IS:', first_proposal_ipfs);

    let first_proposal_data = await EticaReleaseProtocolTestPhase2Instance.propsdatas(get_expected_keccak256_hash_two(_raw_release_hash, _diseasehash));
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


 async function createdisease(_diseasename, _diseasedescription){

  console.log('................................  START CREATION OF NEW DISEASE', _diseasename,' ....................... ');

  // calculate expected hash of disease:
  let _expectedhash = get_expected_keccak256_hash(_diseasename);

  let test_accountbalance_before_createdisease = await EticaReleaseProtocolTestPhase2Instance.balanceOf(test_account.address);
  let contract_balance_before_createdisease = await EticaReleaseProtocolTestPhase2Instance.balanceOf(EticaReleaseProtocolTestPhase2Instance.address);
  //console.log('miner account balance after transfer is', web3.utils.fromWei(miner_accountbalanceafter_transfer, "ether" ));
   
  return EticaReleaseProtocolTestPhase2Instance.createdisease(_diseasename, _diseasedescription, {from: test_account.address}).then(async function(receipt){
   // check diseasesbyIds and diseasesbyNames mappings insertion:
let hashfromname = await EticaReleaseProtocolTestPhase2Instance.getdiseasehashbyName(_diseasename);
let indexfromhash = await EticaReleaseProtocolTestPhase2Instance.diseasesbyIds(_expectedhash);

assert.equal(indexfromhash, TOTAL_DISEASES + 1, '_expectedhash should have an entry in diseasesbyIds with value of total number of diseases created in the protocol');
assert.equal(hashfromname, _expectedhash, 'Disease should have an entry in diseasesbyNames with value of _expectedhash');
   
   
    let new_disease = await EticaReleaseProtocolTestPhase2Instance.diseases(indexfromhash);
    let diseasesCounter = await EticaReleaseProtocolTestPhase2Instance.diseasesCounter();
    let test_accountbalance_after_createdisease = await EticaReleaseProtocolTestPhase2Instance.balanceOf(test_account.address);
    let contract_balance_after_createdisease = await EticaReleaseProtocolTestPhase2Instance.balanceOf(EticaReleaseProtocolTestPhase2Instance.address);
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


 async function commitvote(_from_account, _proposed_release_hash, _choice, _amount, _vary){
  let expected_votehash = get_expected_votehash(_proposed_release_hash, _choice, _from_account.address, _vary);
  console.log('expected_votehash is', expected_votehash);
  return EticaReleaseProtocolTestPhase2Instance.commitvote(web3.utils.toWei(_amount, 'ether'), expected_votehash, {from: _from_account.address}).then(async function(response){

  console.log('................................  VOTED ON PROPOSAL ', _proposed_release_hash,' THE CHOICE IS', _choice,' and  VOTE AMOUNT IS', _amount,' ....................... ');
  });
 }

// vote commit should fail:
async function should_fail_commitvote(_from_account, _proposed_release_hash, _choice, _amount, _vary) {
console.log('should fail this commitvote');
let expected_votehash = get_expected_votehash(_proposed_release_hash, _choice, _from_account.address, _vary);
console.log('expected_votehash is', expected_votehash);
await truffleAssert.fails(EticaReleaseProtocolTestPhase2Instance.commitvote(web3.utils.toWei(_amount, 'ether'), expected_votehash, {from: _from_account.address}));
console.log('as expected failed to make this commitvote');
        }

 async function revealvote(_from_account, _proposed_release_hash, _choice, _amount, _vary){
  return EticaReleaseProtocolTestPhase2Instance.revealvote(_proposed_release_hash, _choice, web3.utils.toWei(_amount, 'ether'), _vary, {from: _from_account.address}).then(async function(response){

  console.log('................................  REVEALED ON PROPOSAL ', _proposed_release_hash,' THE CHOICE IS', _choice,' and  VOTE AMOUNT IS', _amount,' ....................... ');
  });
 }

 async function clmpropbyhash(_from_account, _proposed_release_hash){
  return EticaReleaseProtocolTestPhase2Instance.clmpropbyhash(_proposed_release_hash, {from: _from_account.address}).then(async function(response){

  console.log('................................  CLAIMED PROPOSAL ', _proposed_release_hash,' WITH SUCCESS ....................... ');
  });
 }


 async function stakeclmidx(_from_account, _index){
  let _from_accountbalancebefore = await EticaReleaseProtocolTestPhase2Instance.balanceOf(_from_account.address);
  let _from_accountstakebefore = await EticaReleaseProtocolTestPhase2Instance.stakes(_from_account.address, _index);
  return EticaReleaseProtocolTestPhase2Instance.stakeclmidx(_index, {from: _from_account.address}).then(async function(resp){
    assert(true);
    let _from_accountbalanceafter = await EticaReleaseProtocolTestPhase2Instance.balanceOf(_from_account.address);
    let _from_accountstakeafter = await EticaReleaseProtocolTestPhase2Instance.stakes(_from_account.address,1);
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
  await truffleAssert.fails(EticaReleaseProtocolTestPhase2Instance.stakeclmidx(_index, {from: _from_account.address}));
  console.log('as expected failed to make this stakeclmidx()');
 }


 async function stakesnap(_from_account, _index, _snapamount){
  let _nbstakes_before_from_account = await EticaReleaseProtocolTestPhase2Instance.stakesCounters(_from_account.address);
  //console.log('_nbstakes_before_from_account.toString() is', _nbstakes_before_from_account.toString());
  let _from_accountstakebefore = await EticaReleaseProtocolTestPhase2Instance.stakes(_from_account.address, _index);
  //console.log('_from_accountstakebefore is', _from_accountstakebefore);
  //console.log('_from_accountstakebefore amount is', web3.utils.fromWei(_from_accountstakebefore.amount, "ether"));
  
  return EticaReleaseProtocolTestPhase2Instance.stakesnap(_index, web3.utils.toWei(_snapamount, 'ether'), {from: _from_account.address}).then(async function(resp){
    assert(true);
    let _nbstakes_after_from_account = await EticaReleaseProtocolTestPhase2Instance.stakesCounters(_from_account.address);
    //console.log('_nbstakes_after_from_account.toString() is', _nbstakes_after_from_account.toString());
    let _from_accountstakeafter = await EticaReleaseProtocolTestPhase2Instance.stakes(_from_account.address, _index);
    let _newstake = await EticaReleaseProtocolTestPhase2Instance.stakes(_from_account.address, _nbstakes_after_from_account.toNumber());
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
  await truffleAssert.fails(EticaReleaseProtocolTestPhase2Instance.stakesnap(_index, web3.utils.toWei(_snapamount, 'ether'), {from: _from_account.address}));
  console.log('as expected failed to make this stakesnap()');
 }

 });
