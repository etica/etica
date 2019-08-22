var EticaReleaseProtocolTestDynamics = artifacts.require("./EticaReleaseProtocolTestDynamics.sol");

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
contract('EticaReleaseProtocolTestDynamics', function(accounts){
  var EticaReleaseProtocolTestDynamicsInstance;
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

  it("testing ETICA PROTOCOL DYNAMICS:", async function () {
    console.log('------------------------------------- Starting TESTS OF ETICA PROTOCOL DYNAMICS ---------------------------');

  // wait long enough so that miner_account has mined a block and thus has ETI available, we need a lot of ETI as all tests of this file assume enough ETI and don't deal with mining tests
  //await timeout(150000);
  return EticaReleaseProtocolTestDynamics.deployed().then(function(instance){
  EticaReleaseProtocolTestDynamicsInstance = instance;
  return EticaReleaseProtocolTestDynamicsInstance.balanceOf(miner_account.address);
  }).then(function(receipt){
  console.log('asserting miner_account has at least 100 000 ETI', web3.utils.fromWei(receipt, "ether" ), 'ETI');
  assert(web3.utils.fromWei(receipt, "ether" ) >= 100000, 'miner_account should have at least 100 000 ETI before starting the tests !');
  }).then(async function(){


    DEFAULT_VOTING_TIME = await EticaReleaseProtocolTestDynamicsInstance.DEFAULT_VOTING_TIME(); 
    console.log('DEFAULT_VOTING_TIME IS ', DEFAULT_VOTING_TIME);

    DEFAULT_REVEALING_TIME = await EticaReleaseProtocolTestDynamicsInstance.DEFAULT_REVEALING_TIME(); 
    console.log('DEFAULT_REVEALING_TIME IS ', DEFAULT_REVEALING_TIME);

    PERIOD_CURATION_REWARD_RATIO = await EticaReleaseProtocolTestDynamicsInstance.PERIOD_CURATION_REWARD_RATIO();
    console.log('PERIOD_CURATION_REWARD_RATIO IS ', PERIOD_CURATION_REWARD_RATIO);

    PERIOD_EDITOR_REWARD_RATIO = await EticaReleaseProtocolTestDynamicsInstance.PERIOD_EDITOR_REWARD_RATIO();
    console.log('PERIOD_EDITOR_REWARD_RATIO IS ', PERIOD_EDITOR_REWARD_RATIO);

    REWARD_INTERVAL = await EticaReleaseProtocolTestDynamicsInstance.REWARD_INTERVAL();
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

  let OLD_BALANCE_ACCOUNT = await EticaReleaseProtocolTestDynamicsInstance.balanceOf(test_account.address);  
  let OLD_BALANCE_ACCOUNT_2 = await EticaReleaseProtocolTestDynamicsInstance.balanceOf(test_account2.address);
  let OLD_BALANCE_ACCOUNT_3 = await EticaReleaseProtocolTestDynamicsInstance.balanceOf(test_account3.address);
  let OLD_BALANCE_ACCOUNT_4 = await EticaReleaseProtocolTestDynamicsInstance.balanceOf(test_account4.address);
  let OLD_BALANCE_ACCOUNT_5 = await EticaReleaseProtocolTestDynamicsInstance.balanceOf(test_account5.address);
  let OLD_BALANCE_ACCOUNT_6 = await EticaReleaseProtocolTestDynamicsInstance.balanceOf(test_account6.address);
  let OLD_BALANCE_ACCOUNT_7 = await EticaReleaseProtocolTestDynamicsInstance.balanceOf(test_account7.address);
  let OLD_BALANCE_ACCOUNT_8 = await EticaReleaseProtocolTestDynamicsInstance.balanceOf(test_account8.address);


   // TRANSFERS FROM MINER ACCOUNT:
   await transferfromto(test_account, test_account2, '1000');
   await transferfromto(test_account, test_account3, '1000');
   await transferfromto(test_account, test_account4, '1000');
   await transferfromto(test_account, test_account5, '1000');
   await transferfromto(test_account, test_account6, '1000');
   await transferfromto(test_account, test_account7, '1000');




  let NEW_BALANCE_ACCOUNT = await EticaReleaseProtocolTestDynamicsInstance.balanceOf(test_account.address);
  let NEW_BALANCE_ACCOUNT_2 = await EticaReleaseProtocolTestDynamicsInstance.balanceOf(test_account2.address);
  let NEW_BALANCE_ACCOUNT_3 = await EticaReleaseProtocolTestDynamicsInstance.balanceOf(test_account3.address);
  let NEW_BALANCE_ACCOUNT_4 = await EticaReleaseProtocolTestDynamicsInstance.balanceOf(test_account4.address);
  let NEW_BALANCE_ACCOUNT_5 = await EticaReleaseProtocolTestDynamicsInstance.balanceOf(test_account5.address);
  let NEW_BALANCE_ACCOUNT_6 = await EticaReleaseProtocolTestDynamicsInstance.balanceOf(test_account6.address);
  let NEW_BALANCE_ACCOUNT_7 = await EticaReleaseProtocolTestDynamicsInstance.balanceOf(test_account7.address);
  let NEW_BALANCE_ACCOUNT_8 = await EticaReleaseProtocolTestDynamicsInstance.balanceOf(test_account8.address);



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

// ----------------------  Make tests for Dynamic APPROVAL THRESHOLD ----------------------------- //

console.log('<--------------------------- ENTERING PERIOD: I  ---------------------------------- >');


// make few proposals and revealvote() to actualize periodIII.forprops and period.againstprops OF period III:

let IPFS1 = randomipfs();
let IPFS2 = randomipfs();
let IPFS3 = randomipfs();
let IPFS4 = randomipfs();
let IPFS5 = randomipfs();

let IPFS1_WITH_FIRTDISEASEHASH = get_expected_keccak256_hash_two(IPFS1, EXPECTED_FIRST_DISEASE_HASH);
let IPFS2_WITH_FIRTDISEASEHASH = get_expected_keccak256_hash_two(IPFS2, EXPECTED_FIRST_DISEASE_HASH);
let IPFS3_WITH_FIRTDISEASEHASH = get_expected_keccak256_hash_two(IPFS3, EXPECTED_FIRST_DISEASE_HASH);
let IPFS4_WITH_FIRTDISEASEHASH = get_expected_keccak256_hash_two(IPFS4, EXPECTED_FIRST_DISEASE_HASH);
let IPFS5_WITH_FIRTDISEASEHASH = get_expected_keccak256_hash_two(IPFS5, EXPECTED_FIRST_DISEASE_HASH);

await createdisease(FIRST_DISEASE_NAME, FIRST_DISEASE_DESC);
let indexfromhash = await EticaReleaseProtocolTestDynamicsInstance.diseasesbyIds(EXPECTED_FIRST_DISEASE_HASH);
let hashfromname = await EticaReleaseProtocolTestDynamicsInstance.getdiseasehashbyName(EXPECTED_FIRST_DISEASE_HASH);

await createproposal(test_account, EXPECTED_FIRST_DISEASE_HASH, "Title 1 Malaria", "Description 1", IPFS1, "", "", "Targets:[one_target_here,another_target_here]","Compounds:[one_compound_here, another_compound_here]","Use this field as the community created standards");
await createproposal(test_account2, EXPECTED_FIRST_DISEASE_HASH, "Title 2 Malaria", "Description 2", IPFS2, "", "", "Targets:[one_target_here,another_target_here]","Compounds:[one_compound_here, another_compound_here]","Use this field as the community created standards");
await createproposal(test_account3, EXPECTED_FIRST_DISEASE_HASH, "Title 3 Malaria", "Description 2", IPFS3, "", "", "Targets:[one_target_here,another_target_here]","Compounds:[one_compound_here, another_compound_here]","Use this field as the community created standards");

// Period I should have APPROVAL_THRESHOLD SET TO INITIAL THRESHOLD OF 50 SHOULD HAVE BEEN UPDATED:
APPROVAL_THRESHOLD = await EticaReleaseProtocolTestDynamicsInstance.APPROVAL_THRESHOLD();
console.log('period I APPROVAL THRESHOLD IS ', APPROVAL_THRESHOLD.toString());
assert.equal(APPROVAL_THRESHOLD, '5000', 'APPROVAL_THRESHOLD SHOULD BE 5000');

await commitvote(test_account3, IPFS1_WITH_FIRTDISEASEHASH, true, '5', "random123");
await commitvote(test_account4, IPFS2_WITH_FIRTDISEASEHASH, true, '5', "random123");
await commitvote(test_account5, IPFS3_WITH_FIRTDISEASEHASH, true, '5', "random123");

// advance time to enter revealing Period:
await advanceseconds(DEFAULT_VOTING_TIME);

await revealvote(test_account3, IPFS1_WITH_FIRTDISEASEHASH, true, '5', "random123");
await revealvote(test_account4, IPFS2_WITH_FIRTDISEASEHASH, true, '5', "random123");
await revealvote(test_account5, IPFS3_WITH_FIRTDISEASEHASH, true, '5', "random123");

// -->PERIOD I should have a 100% approval ratio

console.log('<--------------------------- ENTERING PERIOD: II  ---------------------------------- >');

// advance time so that we enter next period: 
await advanceseconds(REWARD_INTERVAL);

// make few proposals and revealvote() to actualize periodIII.forprops and period.againstprops OF period III:

let IPFS1B = randomipfs();
let IPFS2B = randomipfs();
let IPFS3B = randomipfs();
let IPFS4B = randomipfs();
let IPFS5B = randomipfs();

let IPFS1B_WITH_FIRTDISEASEHASH = get_expected_keccak256_hash_two(IPFS1B, EXPECTED_FIRST_DISEASE_HASH);
let IPFS2B_WITH_FIRTDISEASEHASH = get_expected_keccak256_hash_two(IPFS2B, EXPECTED_FIRST_DISEASE_HASH);
let IPFS3B_WITH_FIRTDISEASEHASH = get_expected_keccak256_hash_two(IPFS3B, EXPECTED_FIRST_DISEASE_HASH);
let IPFS4B_WITH_FIRTDISEASEHASH = get_expected_keccak256_hash_two(IPFS4B, EXPECTED_FIRST_DISEASE_HASH);
let IPFS5B_WITH_FIRTDISEASEHASH = get_expected_keccak256_hash_two(IPFS5B, EXPECTED_FIRST_DISEASE_HASH);

await createproposal(test_account, EXPECTED_FIRST_DISEASE_HASH, "Title 1 Malaria", "Description 1", IPFS1B, "", "", "Targets:[one_target_here,another_target_here]","Compounds:[one_compound_here, another_compound_here]","Use this field as the community created standards");
await createproposal(test_account2, EXPECTED_FIRST_DISEASE_HASH, "Title 2 Malaria", "Description 2", IPFS2B, "", "", "Targets:[one_target_here,another_target_here]","Compounds:[one_compound_here, another_compound_here]","Use this field as the community created standards");
await createproposal(test_account3, EXPECTED_FIRST_DISEASE_HASH, "Title 3 Malaria", "Description 2", IPFS3B, "", "", "Targets:[one_target_here,another_target_here]","Compounds:[one_compound_here, another_compound_here]","Use this field as the community created standards");

// Period I should have APPROVAL_THRESHOLD SET TO INITIAL THRESHOLD OF 50 SHOULD HAVE BEEN UPDATED:
APPROVAL_THRESHOLD = await EticaReleaseProtocolTestDynamicsInstance.APPROVAL_THRESHOLD();
console.log('period II APPROVAL THRESHOLD IS ', APPROVAL_THRESHOLD.toString());
assert.equal(APPROVAL_THRESHOLD, '5000', 'APPROVAL_THRESHOLD SHOULD BE 5000');

await commitvote(test_account3, IPFS1B_WITH_FIRTDISEASEHASH, true, '5', "random123");
await commitvote(test_account4, IPFS2B_WITH_FIRTDISEASEHASH, true, '5', "random123");
await commitvote(test_account5, IPFS3B_WITH_FIRTDISEASEHASH, true, '5', "random123");

// advance time to enter revealing Period:
await advanceseconds(DEFAULT_VOTING_TIME);

await revealvote(test_account3, IPFS1B_WITH_FIRTDISEASEHASH, true, '5', "random123");
await revealvote(test_account4, IPFS2B_WITH_FIRTDISEASEHASH, true, '5', "random123");
await revealvote(test_account5, IPFS3B_WITH_FIRTDISEASEHASH, true, '5', "random123");

// -->PERIOD II should have a 100% approval ratio

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
await createproposal(test_account2, EXPECTED_FIRST_DISEASE_HASH, "Title 2 Malaria", "Description 2", IPFS3C, "", "", "Targets:[one_target_here,another_target_here]","Compounds:[one_compound_here, another_compound_here]","Use this field as the community created standards");

// New Period III APPROVAL_THRESHOLD SHOULD HAVE BEEN UPDATED:
APPROVAL_THRESHOLD = await EticaReleaseProtocolTestDynamicsInstance.APPROVAL_THRESHOLD();
console.log('NEW APPROVAL THRESHOLD IS ', APPROVAL_THRESHOLD.toString());
assert.equal(APPROVAL_THRESHOLD, '6750', 'APPROVAL_THRESHOLD SHOULD BE 67.50%');

await commitvote(test_account3, IPFS1C_WITH_FIRTDISEASEHASH, true, '5', "random123");
await commitvote(test_account4, IPFS2C_WITH_FIRTDISEASEHASH, true, '5', "random123");
await commitvote(test_account5, IPFS3C_WITH_FIRTDISEASEHASH, true, '5', "random123");

// advance time to enter revealing Period:
await advanceseconds(DEFAULT_VOTING_TIME);

await revealvote(test_account3, IPFS1C_WITH_FIRTDISEASEHASH, true, '5', "random123");
await revealvote(test_account4, IPFS2C_WITH_FIRTDISEASEHASH, true, '5', "random123");
await revealvote(test_account5, IPFS3C_WITH_FIRTDISEASEHASH, true, '5', "random123");





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
APPROVAL_THRESHOLD = await EticaReleaseProtocolTestDynamicsInstance.APPROVAL_THRESHOLD();
console.log('NEW APPROVAL THRESHOLD for PERIOD V IS ', APPROVAL_THRESHOLD.toString());
assert.equal(APPROVAL_THRESHOLD, '7887', 'APPROVAL_THRESHOLD SHOULD BE 78.87%');

await commitvote(test_account3, IPFS2E_WITH_FIRTDISEASEHASH, true, '5', "random123");
await commitvote(test_account4, IPFS3E_WITH_FIRTDISEASEHASH, false, '5', "random123");

// advance time to enter revealing Period:
await advanceseconds(DEFAULT_VOTING_TIME);

await revealvote(test_account3, IPFS2E_WITH_FIRTDISEASEHASH, true, '5', "random123");
await revealvote(test_account4, IPFS3E_WITH_FIRTDISEASEHASH, false, '5', "random123");

// ----------------------  Make tests for Dynamic APPROVAL THRESHOLD done ----------------------------- //

  console.log('------------------------------------- ETICA PROTOCOL SUCCESSFULLY PASSED THE TESTS OF DYNAMICS ---------------------------');

  })

  });


  async function printBalances(accounts) {
    // accounts.forEach(function(ac, i) {
       var balance_val = await (web3.eth.getBalance(accounts[0]));
       //console.log('acct 0 balance', web3.utils.fromWei(balance_val.toString() , 'ether') )
    // })
   }

   async function printEtiBalance(testaccount) {
       var balance_val = await EticaReleaseProtocolTestDynamicsInstance.balanceOf(testaccount.address);
       console.log('ETI the balance of ', testaccount.address, 'is',  web3.utils.fromWei(balance_val.toString() , 'ether') );
       return balance_val;
   }

   async function transferto(testaccount) {

    console.log('transfering 10000 ETI from miner_account to test_account', testaccount.address);
    let test_accountbalancebefore = await EticaReleaseProtocolTestDynamicsInstance.balanceOf(testaccount.address);
    let miner_accountbalancebefore = await EticaReleaseProtocolTestDynamicsInstance.balanceOf(miner_account.address);
    console.log('miner_account ETI balance before:', web3.utils.fromWei(miner_accountbalancebefore, "ether" ));
    console.log('test_account', testaccount.address,'ETI balance before:', web3.utils.fromWei(test_accountbalancebefore, "ether" ));
    return EticaReleaseProtocolTestDynamicsInstance.transfer(testaccount.address,  web3.utils.toWei('10000', 'ether'), {from: miner_account.address}).then(async function() {
      let test_accountbalanceafter = await EticaReleaseProtocolTestDynamicsInstance.balanceOf(testaccount.address);
      let miner_accountbalanceafter = await EticaReleaseProtocolTestDynamicsInstance.balanceOf(miner_account.address);
      console.log('miner_account ETI balance after:', web3.utils.fromWei(miner_accountbalanceafter, "ether" ));
      console.log('test_account', testaccount.address,'ETI balance after:', web3.utils.fromWei(test_accountbalanceafter, "ether" ));
     });

   }


   async function transferfromto(senderaccount, receiveraccount, amount) {

    console.log('transfering', amount,'ETI from senderaccount', senderaccount.address, 'to receiveraccount', receiveraccount.address);

    return EticaReleaseProtocolTestDynamicsInstance.transfer(receiveraccount.address,  web3.utils.toWei(amount, 'ether'), {from: senderaccount.address}).then(async function() {
 
    console.log('transfered', amount,'ETI from senderaccount', senderaccount.address, 'to receiveraccount', receiveraccount.address);

     });

   }

   async function eticatobosom(useraccount, amount){

    console.log('---> Staking Eticas for Bosoms. Stake amount is', amount, 'ETI. User is ', useraccount.address);
    return EticaReleaseProtocolTestDynamicsInstance.eticatobosoms(useraccount.address,  web3.utils.toWei(amount, 'ether'), {from: useraccount.address}).then(async function(receipt){
    console.log('---> The stake of Eticas for Bosoms worth', amount, 'ETI', 'was successfull');

      }).catch(async function(error){
        console.log('An error has occured !', error);
      })
   }


   async function stakescsldt(useraccount, endTime, min_limit, maxidx){

    console.log('---> Consolidating stakes. New endTime is', endTime, '.');
    return EticaReleaseProtocolTestDynamicsInstance.stakescsldt(useraccount.address,  endTime, min_limit, maxidx, {from: useraccount.address}).then(async function(receipt){
    console.log('---> The consolidation of', endTime, ' endTime', 'was successfull');

      }).catch(async function(error){
        console.log('An error has occured !', error);
      })
   }

   async function should_fail_to_stakescsldt(useraccount, endTime, min_limit, maxidx){

    console.log('---> Should fail to consolidate with out of range params:  --> endTime:', endTime, '--> min_limit is:: ', min_limit, '--> maxidx is:', maxidx);
    await truffleAssert.fails(EticaReleaseProtocolTestDynamicsInstance.stakescsldt(useraccount.address,  endTime, min_limit, maxidx, {from: useraccount.address}));
    console.log('---> As expected failed to consolidate with out of range params: --> endTime:', endTime, '--> min_limit is:: ', min_limit, '--> maxidx is:', maxidx);
   
  }

   async function getstake(_from_account, _idx){

    let _thestake = await EticaReleaseProtocolTestDynamicsInstance.stakes(_from_account.address,_idx);
    return _thestake;

   }


   async function should_fail_eticatobosom(useraccount, amount){

    console.log('---> Staking Eticas for Bosoms. Stake amount is', amount, 'ETI. User is ', useraccount.address);
    await truffleAssert.fails(EticaReleaseProtocolTestDynamicsInstance.eticatobosoms(useraccount.address,  web3.utils.toWei(amount, 'ether'), {from: useraccount.address}));
    console.log('---> As expected failed to make the stake worth', amount, 'ETI from user: ', useraccount.address);

   }

   // transfer that should fail:
   async function should_fail_transferfromto(senderaccount, receiveraccount, amount) {
     
    console.log('should fail transfering', amount,'ETI from senderaccount', senderaccount.address, 'to receiveraccount', receiveraccount.address);
    await truffleAssert.fails(EticaReleaseProtocolTestDynamicsInstance.transfer(receiveraccount.address,  web3.utils.toWei(amount, 'ether'), {from: senderaccount.address}));
    console.log('as expected failed to transfer', amount,'ETI from senderaccount', senderaccount.address, 'to receiveraccount', receiveraccount.address);

  }

     // propose should fail:
     async function should_fail_propose(_from_account, _diseasehash, _title, _description, _raw_release_hash, _old_release_hash, _grandparent_hash, _firstfield, _secondfield, _thirdfield) {
     
      console.log('should fail to propose proposal with same raw_release_hash and diseasehash (', _raw_release_hash,' - ', _diseasehash, ')combination');
      await truffleAssert.fails(EticaReleaseProtocolTestDynamicsInstance.propose(_diseasehash, _title, _description, _raw_release_hash, _old_release_hash, _grandparent_hash, _firstfield, _secondfield, _thirdfield, {from: _from_account.address}));
      console.log('as expected failed to propose proposal with same raw_release_hash and diseasehash (', _raw_release_hash,' - ', _diseasehash, ')combination');
  
    }

         // propose should fail:
         async function should_fail_revealvote(_from_account, _proposed_release_hash, _choice, _amount, _vary) {
     
          console.log('should fail this revealvote');
          await truffleAssert.fails(EticaReleaseProtocolTestDynamicsInstance.revealvote(_proposed_release_hash, _choice, web3.utils.toWei(_amount, 'ether'), _vary, {from: _from_account.address}));
          console.log('as expected failed to make this revealvote');
      
        }

        async function should_fail_clmpropbyhash(_from_account, _proposalhash) {

          console.log('should fail to clmpropbyhash');
        await truffleAssert.fails(EticaReleaseProtocolTestDynamicsInstance.clmpropbyhash(_proposalhash, {from: _from_account.address}));
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
    let _vote = await EticaReleaseProtocolTestDynamicsInstance.votes(_rawrelease, _from_account.address);
    //console.log('_vote is', _vote);
    
    let _proposal = await EticaReleaseProtocolTestDynamicsInstance.proposals(_rawrelease);
    let _proposaldatas = await EticaReleaseProtocolTestDynamicsInstance.propsdatas(_rawrelease);
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

    let _period = await EticaReleaseProtocolTestDynamicsInstance.periods(_proposal.period_id);
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

  let oldproposalsCounter = await EticaReleaseProtocolTestDynamicsInstance.proposalsCounter();

  let _from_accountbalancebefore = await EticaReleaseProtocolTestDynamicsInstance.balanceOf(_from_account.address);
  //console.log('_from_account ETI balance before:', web3.utils.fromWei(_from_accountbalancebefore, "ether" ));

  let _from_accountbosomsbefore = await EticaReleaseProtocolTestDynamicsInstance.bosoms(_from_account.address);
  //console.log('_from_account Bosoms before:', web3.utils.fromWei(_from_accountbosomsbefore, "ether" ));

  return EticaReleaseProtocolTestDynamicsInstance.propose(_diseasehash, _title, _description, _raw_release_hash, _old_release_hash, _grandparent_hash, _firstfield, _secondfield, _thirdfield, {from: _from_account.address}).then(async function(response){

    let first_proposal = await EticaReleaseProtocolTestDynamicsInstance.proposals(get_expected_keccak256_hash_two(_raw_release_hash, _diseasehash));
    let proposalsCounter = await EticaReleaseProtocolTestDynamicsInstance.proposalsCounter();
    //console.log('THE FIRST PROPOSAL IS:', first_proposal);

    let first_proposal_ipfs = await EticaReleaseProtocolTestDynamicsInstance.propsipfs(get_expected_keccak256_hash_two(_raw_release_hash, _diseasehash));
    //console.log('THE FIRST PROPOSAL IPFS IS:', first_proposal_ipfs);

    let first_proposal_data = await EticaReleaseProtocolTestDynamicsInstance.propsdatas(get_expected_keccak256_hash_two(_raw_release_hash, _diseasehash));
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

  let test_accountbalance_before_createdisease = await EticaReleaseProtocolTestDynamicsInstance.balanceOf(test_account.address);
  let contract_balance_before_createdisease = await EticaReleaseProtocolTestDynamicsInstance.balanceOf(EticaReleaseProtocolTestDynamicsInstance.address);
  //console.log('miner account balance after transfer is', web3.utils.fromWei(miner_accountbalanceafter_transfer, "ether" ));
   
  return EticaReleaseProtocolTestDynamicsInstance.createdisease(_diseasename, _diseasedescription, {from: test_account.address}).then(async function(receipt){
   // check diseasesbyIds and diseasesbyNames mappings insertion:
let hashfromname = await EticaReleaseProtocolTestDynamicsInstance.getdiseasehashbyName(_diseasename);
let indexfromhash = await EticaReleaseProtocolTestDynamicsInstance.diseasesbyIds(_expectedhash);

assert.equal(indexfromhash, TOTAL_DISEASES + 1, '_expectedhash should have an entry in diseasesbyIds with value of total number of diseases created in the protocol');
assert.equal(hashfromname, _expectedhash, 'Disease should have an entry in diseasesbyNames with value of _expectedhash');
   
   
    let new_disease = await EticaReleaseProtocolTestDynamicsInstance.diseases(indexfromhash);
    let diseasesCounter = await EticaReleaseProtocolTestDynamicsInstance.diseasesCounter();
    let test_accountbalance_after_createdisease = await EticaReleaseProtocolTestDynamicsInstance.balanceOf(test_account.address);
    let contract_balance_after_createdisease = await EticaReleaseProtocolTestDynamicsInstance.balanceOf(EticaReleaseProtocolTestDynamicsInstance.address);
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
  return EticaReleaseProtocolTestDynamicsInstance.commitvote(web3.utils.toWei(_amount, 'ether'), expected_votehash, {from: _from_account.address}).then(async function(response){

  console.log('................................  VOTED ON PROPOSAL ', _proposed_release_hash,' THE CHOICE IS', _choice,' and  VOTE AMOUNT IS', _amount,' ....................... ');
  });
 }

// vote commit should fail:
async function should_fail_commitvote(_from_account, _proposed_release_hash, _choice, _amount, _vary) {
console.log('should fail this commitvote');
let expected_votehash = get_expected_votehash(_proposed_release_hash, _choice, _from_account.address, _vary);
console.log('expected_votehash is', expected_votehash);
await truffleAssert.fails(EticaReleaseProtocolTestDynamicsInstance.commitvote(web3.utils.toWei(_amount, 'ether'), expected_votehash, {from: _from_account.address}));
console.log('as expected failed to make this commitvote');
        }

 async function revealvote(_from_account, _proposed_release_hash, _choice, _amount, _vary){
  return EticaReleaseProtocolTestDynamicsInstance.revealvote(_proposed_release_hash, _choice, web3.utils.toWei(_amount, 'ether'), _vary, {from: _from_account.address}).then(async function(response){

  console.log('................................  REVEALED ON PROPOSAL ', _proposed_release_hash,' THE CHOICE IS', _choice,' and  VOTE AMOUNT IS', _amount,' ....................... ');
  });
 }

 async function clmpropbyhash(_from_account, _proposed_release_hash){
  return EticaReleaseProtocolTestDynamicsInstance.clmpropbyhash(_proposed_release_hash, {from: _from_account.address}).then(async function(response){

  console.log('................................  CLAIMED PROPOSAL ', _proposed_release_hash,' WITH SUCCESS ....................... ');
  });
 }


 async function stakeclmidx(_from_account, _index){
  let _from_accountbalancebefore = await EticaReleaseProtocolTestDynamicsInstance.balanceOf(_from_account.address);
  let _from_accountstakebefore = await EticaReleaseProtocolTestDynamicsInstance.stakes(_from_account.address, _index);
  return EticaReleaseProtocolTestDynamicsInstance.stakeclmidx(_index, {from: _from_account.address}).then(async function(resp){
    assert(true);
    let _from_accountbalanceafter = await EticaReleaseProtocolTestDynamicsInstance.balanceOf(_from_account.address);
    let _from_accountstakeafter = await EticaReleaseProtocolTestDynamicsInstance.stakes(_from_account.address,1);
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
  await truffleAssert.fails(EticaReleaseProtocolTestDynamicsInstance.stakeclmidx(_index, {from: _from_account.address}));
  console.log('as expected failed to make this stakeclmidx()');
 }


 async function stakesnap(_from_account, _index, _snapamount){
  let _nbstakes_before_from_account = await EticaReleaseProtocolTestDynamicsInstance.stakesCounters(_from_account.address);
  //console.log('_nbstakes_before_from_account.toString() is', _nbstakes_before_from_account.toString());
  let _from_accountstakebefore = await EticaReleaseProtocolTestDynamicsInstance.stakes(_from_account.address, _index);
  //console.log('_from_accountstakebefore is', _from_accountstakebefore);
  //console.log('_from_accountstakebefore amount is', web3.utils.fromWei(_from_accountstakebefore.amount, "ether"));
  
  return EticaReleaseProtocolTestDynamicsInstance.stakesnap(_index, web3.utils.toWei(_snapamount, 'ether'), {from: _from_account.address}).then(async function(resp){
    assert(true);
    let _nbstakes_after_from_account = await EticaReleaseProtocolTestDynamicsInstance.stakesCounters(_from_account.address);
    //console.log('_nbstakes_after_from_account.toString() is', _nbstakes_after_from_account.toString());
    let _from_accountstakeafter = await EticaReleaseProtocolTestDynamicsInstance.stakes(_from_account.address, _index);
    let _newstake = await EticaReleaseProtocolTestDynamicsInstance.stakes(_from_account.address, _nbstakes_after_from_account.toNumber());
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
  await truffleAssert.fails(EticaReleaseProtocolTestDynamicsInstance.stakesnap(_index, web3.utils.toWei(_snapamount, 'ether'), {from: _from_account.address}));
  console.log('as expected failed to make this stakesnap()');
 }

 });