var EticaReleaseMining = artifacts.require("./EticaReleaseMining.sol");

var solidityHelper =  require('./solidity-helper');
var miningHelper =  require('./mining-helper-fast');
var networkInterfaceHelper =  require('./network-interface-helper');
const truffleAssert = require('truffle-assertions');
var abi = require('ethereumjs-abi');
var BN = require('bn.js');

console.log('------------------- WELCOME ON THE ETICA PROTOCOL ---------------');
console.log('---------------> NEUTRAL PROTOCOL FOR DECENTRALISED RESEARCH <------------------');
console.log('');


// This series of tests aims to test the functions that will update protocol costs
// The ProtocolTest contract has been initialised with an initial supply so that accounts don't have to mine

var PERIOD_CURATION_REWARD_RATIO = 0; // initialize global variable PERIOD_CURATION_REWARD_RATIO
var PERIOD_EDITOR_REWARD_RATIO = 0; // initialize global variable PERIOD_EDITOR_REWARD_RATIO
var DEFAULT_VOTING_TIME = 0; // initialize global variable DEFAULT_VOTING_TIME
var DEFAULT_REVEALING_TIME = 0;
var REWARD_INTERVAL = 0; // initialize global variable REWARD_INTERVAL
var ETH_PRICE_USD = 198.54;
var MININGTARGET = 0;

// test suite
contract('EticaReleaseMining', function(accounts){
  var EticaReleaseMiningInstance;
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

  it("testing ETICA MINING:", async function () {
    console.log('------------------------------------- Starting TESTS OF ETICA MINING  ---------------------------');

    return EticaReleaseMining.deployed().then(async function(instance){
      EticaReleaseMiningInstance = instance;
      await EticaReleaseMiningInstance.setminingtarget(100);
      MININGTARGET = await EticaReleaseMiningInstance.getMiningTarget(); 
      console.log('OLD MININGTARGET IS ', MININGTARGET.toString());
      let expectedminingtime = 400;
      let actualminingtime = 800;
      await EticaReleaseMiningInstance._reAdjustDifficulty(actualminingtime, expectedminingtime);
      MININGTARGET = await EticaReleaseMiningInstance.getMiningTarget(); 
      console.log('NEW MININGTARGET IS ', MININGTARGET.toString());
      let ntt = Math.pow(2, 220);
      console.log('ntt', ntt);
      await EticaReleaseMiningInstance.setminingtarget(100);

      MININGTARGET = await EticaReleaseMiningInstance.getMiningTarget(); 
      console.log('OLD MININGTARGET IS ', MININGTARGET.toString());
       expectedminingtime = 400;
       actualminingtime = 200;
      await EticaReleaseMiningInstance._reAdjustDifficulty(actualminingtime, expectedminingtime);
      MININGTARGET = await EticaReleaseMiningInstance.getMiningTarget(); 
      console.log('NEW MININGTARGET IS ', MININGTARGET.toString());



      await EticaReleaseMiningInstance.setminingtarget(100);
      MININGTARGET = await EticaReleaseMiningInstance.getMiningTarget(); 
      console.log('OLD MININGTARGET IS ', MININGTARGET.toString());
       expectedminingtime = 400;
       actualminingtime = 10;
      await EticaReleaseMiningInstance._reAdjustDifficulty(actualminingtime, expectedminingtime);
      MININGTARGET = await EticaReleaseMiningInstance.getMiningTarget(); 
      console.log('NEW MININGTARGET IS ', MININGTARGET.toString());


      await EticaReleaseMiningInstance.setminingtarget(100);
      MININGTARGET = await EticaReleaseMiningInstance.getMiningTarget(); 
      console.log('OLD MININGTARGET IS ', MININGTARGET.toString());
       expectedminingtime = 500;
       actualminingtime = 9000;
      await EticaReleaseMiningInstance._reAdjustDifficulty(actualminingtime, expectedminingtime);
      MININGTARGET = await EticaReleaseMiningInstance.getMiningTarget(); 
      console.log('NEW MININGTARGET IS ', MININGTARGET.toString());


      await EticaReleaseMiningInstance.setminingtarget(100);
      MININGTARGET = await EticaReleaseMiningInstance.getMiningTarget(); 
      console.log('OLD MININGTARGET IS ', MININGTARGET.toString());
       expectedminingtime = 500;
       actualminingtime = 865;
      await EticaReleaseMiningInstance._reAdjustDifficulty(actualminingtime, expectedminingtime);
      MININGTARGET = await EticaReleaseMiningInstance.getMiningTarget(); 
      console.log('NEW MININGTARGET IS ', MININGTARGET.toString());

      await EticaReleaseMiningInstance.setminingtarget(10);
      MININGTARGET = await EticaReleaseMiningInstance.getMiningTarget(); 
      console.log('OLD MININGTARGET IS ', MININGTARGET.toString());
       expectedminingtime = 500;
       actualminingtime = 23;
      await EticaReleaseMiningInstance._reAdjustDifficulty(actualminingtime, expectedminingtime);
      MININGTARGET = await EticaReleaseMiningInstance.getMiningTarget(); 
      console.log('NEW MININGTARGET IS ', MININGTARGET.toString());


      await EticaReleaseMiningInstance.setminingtarget(10);
      MININGTARGET = await EticaReleaseMiningInstance.getMiningTarget(); 
      console.log('OLD MININGTARGET IS ', MININGTARGET.toString());
       expectedminingtime = 500;
       actualminingtime = 62000;
      await EticaReleaseMiningInstance._reAdjustDifficulty(actualminingtime, expectedminingtime);
      MININGTARGET = await EticaReleaseMiningInstance.getMiningTarget(); 
      console.log('NEW MININGTARGET IS ', MININGTARGET.toString());

      });

    });


  async function updatecost(useraccount, _periodcounter){

    console.log('---> UPDATING COSTS', _periodcounter);
    return EticaReleaseMiningInstance.updatecost({from: useraccount.address}).then(async function(receipt){
    console.log('---> The cost update of DISEASE AND PROPOSAL AMOUNT CREATION was successfull', _periodcounter);

      }).catch(async function(error){
        console.log('An error has occured !', error);
      })
   }

 
  async function should_fail_to_updatecost(useraccount, _periodcounter){

    console.log('---> Should fail to updatecost within Period', _periodcounter);
    await truffleAssert.fails(EticaReleaseMiningInstance.updatecost({from: useraccount.address}));
    console.log('---> As expected failed updatecost within Period', _periodcounter);
   
  } 

  async function printBalances(accounts) {
    // accounts.forEach(function(ac, i) {
       var balance_val = await (web3.eth.getBalance(accounts[0]));
       //console.log('acct 0 balance', web3.utils.fromWei(balance_val.toString() , 'ether') )
    // })
   }

   async function printEtiBalance(testaccount) {
       var balance_val = await EticaReleaseMiningInstance.balanceOf(testaccount.address);
       console.log('ETI the balance of ', testaccount.address, 'is',  web3.utils.fromWei(balance_val.toString() , 'ether') );
       return balance_val;
   }

   async function transferto(testaccount) {

    console.log('transfering 10000 ETI from miner_account to test_account', testaccount.address);
    let test_accountbalancebefore = await EticaReleaseMiningInstance.balanceOf(testaccount.address);
    let miner_accountbalancebefore = await EticaReleaseMiningInstance.balanceOf(miner_account.address);
    console.log('miner_account ETI balance before:', web3.utils.fromWei(miner_accountbalancebefore, "ether" ));
    console.log('test_account', testaccount.address,'ETI balance before:', web3.utils.fromWei(test_accountbalancebefore, "ether" ));
    return EticaReleaseMiningInstance.transfer(testaccount.address,  web3.utils.toWei('10000', 'ether'), {from: miner_account.address}).then(async function() {
      let test_accountbalanceafter = await EticaReleaseMiningInstance.balanceOf(testaccount.address);
      let miner_accountbalanceafter = await EticaReleaseMiningInstance.balanceOf(miner_account.address);
      console.log('miner_account ETI balance after:', web3.utils.fromWei(miner_accountbalanceafter, "ether" ));
      console.log('test_account', testaccount.address,'ETI balance after:', web3.utils.fromWei(test_accountbalanceafter, "ether" ));
     });

   }


   async function transferfromto(senderaccount, receiveraccount, amount) {

    console.log('transfering', amount,'ETI from senderaccount', senderaccount.address, 'to receiveraccount', receiveraccount.address);

    return EticaReleaseMiningInstance.transfer(receiveraccount.address,  web3.utils.toWei(amount, 'ether'), {from: senderaccount.address}).then(async function() {
 
    console.log('transfered', amount,'ETI from senderaccount', senderaccount.address, 'to receiveraccount', receiveraccount.address);

     });

   }

   async function eticatobosom(useraccount, amount){

    console.log('---> Staking Eticas for Bosoms. Stake amount is', amount, 'ETI. User is ', useraccount.address);
    return EticaReleaseMiningInstance.eticatobosoms(useraccount.address,  web3.utils.toWei(amount, 'ether'), {from: useraccount.address}).then(async function(receipt){
    console.log('---> The stake of Eticas for Bosoms worth', amount, 'ETI', 'was successfull');

      }).catch(async function(error){
        console.log('An error has occured !', error);
      })
   }


   async function stakescsldt(useraccount, endTime, min_limit, maxidx){

    console.log('---> Consolidating stakes. New endTime is', endTime, '.');
    return EticaReleaseMiningInstance.stakescsldt(useraccount.address,  endTime, min_limit, maxidx, {from: useraccount.address}).then(async function(receipt){
    console.log('---> The consolidation of', endTime, ' endTime', 'was successfull');

      }).catch(async function(error){
        console.log('An error has occured !', error);
      })
   }

   async function should_fail_to_stakescsldt(useraccount, endTime, min_limit, maxidx){

    console.log('---> Should fail to consolidate with out of range params:  --> endTime:', endTime, '--> min_limit is:: ', min_limit, '--> maxidx is:', maxidx);
    await truffleAssert.fails(EticaReleaseMiningInstance.stakescsldt(useraccount.address,  endTime, min_limit, maxidx, {from: useraccount.address}));
    console.log('---> As expected failed to consolidate with out of range params: --> endTime:', endTime, '--> min_limit is:: ', min_limit, '--> maxidx is:', maxidx);
   
  }

   async function getstake(_from_account, _idx){

    let _thestake = await EticaReleaseMiningInstance.stakes(_from_account.address,_idx);
    return _thestake;

   }


   async function should_fail_eticatobosom(useraccount, amount){

    console.log('---> Staking Eticas for Bosoms. Stake amount is', amount, 'ETI. User is ', useraccount.address);
    await truffleAssert.fails(EticaReleaseMiningInstance.eticatobosoms(useraccount.address,  web3.utils.toWei(amount, 'ether'), {from: useraccount.address}));
    console.log('---> As expected failed to make the stake worth', amount, 'ETI from user: ', useraccount.address);

   }

   // transfer that should fail:
   async function should_fail_transferfromto(senderaccount, receiveraccount, amount) {
     
    console.log('should fail transfering', amount,'ETI from senderaccount', senderaccount.address, 'to receiveraccount', receiveraccount.address);
    await truffleAssert.fails(EticaReleaseMiningInstance.transfer(receiveraccount.address,  web3.utils.toWei(amount, 'ether'), {from: senderaccount.address}));
    console.log('as expected failed to transfer', amount,'ETI from senderaccount', senderaccount.address, 'to receiveraccount', receiveraccount.address);

  }

     // propose should fail:
     async function should_fail_propose(_from_account, _diseasehash, _title, _description, _raw_release_hash, _related_hash, _other_related_hash, _firstfield, _secondfield, _thirdfield) {
     
      console.log('should fail to propose proposal with same raw_release_hash and diseasehash (', _raw_release_hash,' - ', _diseasehash, ')combination');
      await truffleAssert.fails(EticaReleaseMiningInstance.propose(_diseasehash, _title, _description, _raw_release_hash, _related_hash, _other_related_hash, _firstfield, _secondfield, _thirdfield, {from: _from_account.address}));
      console.log('as expected failed to propose proposal with same raw_release_hash and diseasehash (', _raw_release_hash,' - ', _diseasehash, ')combination');
  
    }

         // propose should fail:
         async function should_fail_revealvote(_from_account, _proposed_release_hash, _choice, _vary) {
     
          console.log('should fail this revealvote');
          await truffleAssert.fails(EticaReleaseMiningInstance.revealvote(_proposed_release_hash, _choice, _vary, {from: _from_account.address}));
          console.log('as expected failed to make this revealvote');
      
        }

        async function should_fail_clmpropbyhash(_from_account, _proposalhash) {

          console.log('should fail to clmpropbyhash');
        await truffleAssert.fails(EticaReleaseMiningInstance.clmpropbyhash(_proposalhash, {from: _from_account.address}));
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
    let _vote = await EticaReleaseMiningInstance.votes(_rawrelease, _from_account.address);
    //console.log('_vote is', _vote);
    
    let _proposal = await EticaReleaseMiningInstance.proposals(_rawrelease);
    let _proposaldatas = await EticaReleaseMiningInstance.propsdatas(_rawrelease);
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

    let _period = await EticaReleaseMiningInstance.periods(_proposal.period_id);
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
  
    let oldproposalsCounter = await EticaReleaseMiningInstance.proposalsCounter();
  
    let _from_accountbalancebefore = await EticaReleaseMiningInstance.balanceOf(_from_account.address);
    //console.log('_from_account ETI balance before:', web3.utils.fromWei(_from_accountbalancebefore, "ether" ));
  
    let _from_accountbosomsbefore = await EticaReleaseMiningInstance.bosoms(_from_account.address);
    //console.log('_from_account Bosoms before:', web3.utils.fromWei(_from_accountbosomsbefore, "ether" ));
  
    return EticaReleaseMiningInstance.propose(_diseasehash, _title, _description, _raw_release_hash, _freefield, _chunkid, {from: _from_account.address}).then(async function(response){
  
      let first_proposal = await EticaReleaseMiningInstance.proposals(get_expected_keccak256_hash_two(_raw_release_hash, _diseasehash));
      let proposalsCounter = await EticaReleaseMiningInstance.proposalsCounter();
      //console.log('THE FIRST PROPOSAL IS:', first_proposal);
  
      //console.log('THE FIRST PROPOSAL IPFS IS:', first_proposal_ipfs);
  
      let first_proposal_data = await EticaReleaseMiningInstance.propsdatas(get_expected_keccak256_hash_two(_raw_release_hash, _diseasehash));
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

  let oldproposalsCounter = await EticaReleaseMiningInstance.proposalsCounter();

  let _from_accountbalancebefore = await EticaReleaseMiningInstance.balanceOf(_from_account.address);
  //console.log('_from_account ETI balance before:', web3.utils.fromWei(_from_accountbalancebefore, "ether" ));

  let _from_accountbosomsbefore = await EticaReleaseMiningInstance.bosoms(_from_account.address);
  //console.log('_from_account Bosoms before:', web3.utils.fromWei(_from_accountbosomsbefore, "ether" ));

  return EticaReleaseMiningInstance.propose.estimateGas(_diseasehash, _title, _description, _raw_release_hash, _freefield, _chunkid, {from: _from_account.address}).then(async function(response){

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

  let test_accountbalance_before_createdisease = await EticaReleaseMiningInstance.balanceOf(test_account.address);
  let contract_balance_before_createdisease = await EticaReleaseMiningInstance.balanceOf(EticaReleaseMiningInstance.address);
  //console.log('miner account balance after transfer is', web3.utils.fromWei(miner_accountbalanceafter_transfer, "ether" ));
   
  return EticaReleaseMiningInstance.createdisease(_diseasename, {from: test_account.address}).then(async function(receipt){
   // check diseasesbyIds and diseasesbyNames mappings insertion:
let hashfromname = await EticaReleaseMiningInstance.getdiseasehashbyName(_diseasename);
let indexfromhash = await EticaReleaseMiningInstance.diseasesbyIds(_expectedhash);

assert.equal(indexfromhash, TOTAL_DISEASES + 1, '_expectedhash should have an entry in diseasesbyIds with value of total number of diseases created in the protocol');
assert.equal(hashfromname, _expectedhash, 'Disease should have an entry in diseasesbyNames with value of _expectedhash');
   
   
    let new_disease = await EticaReleaseMiningInstance.diseases(indexfromhash);
    let diseasesCounter = await EticaReleaseMiningInstance.diseasesCounter();
    let test_accountbalance_after_createdisease = await EticaReleaseMiningInstance.balanceOf(test_account.address);
    let contract_balance_after_createdisease = await EticaReleaseMiningInstance.balanceOf(EticaReleaseMiningInstance.address);
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

  let test_accountbalance_before_createdisease = await EticaReleaseMiningInstance.balanceOf(test_account.address);
  let contract_balance_before_createdisease = await EticaReleaseMiningInstance.balanceOf(EticaReleaseMiningInstance.address);
  //console.log('miner account balance after transfer is', web3.utils.fromWei(miner_accountbalanceafter_transfer, "ether" ));
   
  return EticaReleaseMiningInstance.createdisease.estimateGas(_diseasename, {from: test_account.address}).then(async function(receipt){
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
  let _oldcommit = await EticaReleaseMiningInstance.commits(_from_account.address, expected_votehash);
  console.log('expected_votehash is', expected_votehash);
  return EticaReleaseMiningInstance.commitvote(web3.utils.toWei(_amount, 'ether'), expected_votehash, {from: _from_account.address}).then(async function(response){
  let _newcommit = await EticaReleaseMiningInstance.commits(_from_account.address, expected_votehash);
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
  let _oldcommit = await EticaReleaseMiningInstance.commits(_from_account.address, expected_votehash);
  console.log('expected_votehash is', expected_votehash);
  return EticaReleaseMiningInstance.commitvote.estimateGas(web3.utils.toWei(_amount, 'ether'), expected_votehash, {from: _from_account.address}).then(async function(response){
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
await truffleAssert.fails(EticaReleaseMiningInstance.commitvote(web3.utils.toWei(_amount, 'ether'), expected_votehash, {from: _from_account.address}));
console.log('as expected failed to make this commitvote');
        }

 async function revealvote(_from_account, _proposed_release_hash, _choice, _vary){
  return EticaReleaseMiningInstance.revealvote(_proposed_release_hash, _choice, _vary, {from: _from_account.address}).then(async function(response){
 let expected_votehash = get_expected_votehash(_proposed_release_hash, _choice, _from_account.address, _vary);
  let _newcommit = await EticaReleaseMiningInstance.commits(_from_account.address, expected_votehash);
  assert.equal(_newcommit.amount, 0, 'New commit amount should be 0 after revealvote');
  console.log('................................  REVEALED ON PROPOSAL ', _proposed_release_hash,' THE CHOICE IS',' ....................... ');
  });
 }

 async function getcost_revealvote(_from_account, _proposed_release_hash, _choice, _vary){
  return EticaReleaseMiningInstance.revealvote.estimateGas(_proposed_release_hash, _choice, _vary, {from: _from_account.address}).then(async function(response){
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
  return EticaReleaseMiningInstance.clmpropbyhash(_proposed_release_hash, {from: _from_account.address}).then(async function(response){

  console.log('................................  CLAIMED PROPOSAL ', _proposed_release_hash,' WITH SUCCESS ....................... ');
  });
 }

 async function getcost_clmpropbyhash(_from_account, _proposed_release_hash){
  return EticaReleaseMiningInstance.clmpropbyhash.estimateGas(_proposed_release_hash, {from: _from_account.address}).then(async function(response){

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
  let _from_accountbalancebefore = await EticaReleaseMiningInstance.balanceOf(_from_account.address);
  let _from_accountstakebefore = await EticaReleaseMiningInstance.stakes(_from_account.address, _index);
  return EticaReleaseMiningInstance.stakeclmidx(_index, {from: _from_account.address}).then(async function(resp){
    assert(true);
    let _from_accountbalanceafter = await EticaReleaseMiningInstance.balanceOf(_from_account.address);
    let _from_accountstakeafter = await EticaReleaseMiningInstance.stakes(_from_account.address,1);
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
  await truffleAssert.fails(EticaReleaseMiningInstance.stakeclmidx(_index, {from: _from_account.address}));
  console.log('as expected failed to make this stakeclmidx()');
 }


 async function stakesnap(_from_account, _index, _snapamount){
  let _nbstakes_before_from_account = await EticaReleaseMiningInstance.stakesCounters(_from_account.address);
  //console.log('_nbstakes_before_from_account.toString() is', _nbstakes_before_from_account.toString());
  let _from_accountstakebefore = await EticaReleaseMiningInstance.stakes(_from_account.address, _index);
  //console.log('_from_accountstakebefore is', _from_accountstakebefore);
  //console.log('_from_accountstakebefore amount is', web3.utils.fromWei(_from_accountstakebefore.amount, "ether"));
  
  return EticaReleaseMiningInstance.stakesnap(_index, web3.utils.toWei(_snapamount, 'ether'), {from: _from_account.address}).then(async function(resp){
    assert(true);
    let _nbstakes_after_from_account = await EticaReleaseMiningInstance.stakesCounters(_from_account.address);
    //console.log('_nbstakes_after_from_account.toString() is', _nbstakes_after_from_account.toString());
    let _from_accountstakeafter = await EticaReleaseMiningInstance.stakes(_from_account.address, _index);
    let _newstake = await EticaReleaseMiningInstance.stakes(_from_account.address, _nbstakes_after_from_account.toNumber());
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
  await truffleAssert.fails(EticaReleaseMiningInstance.stakesnap(_index, web3.utils.toWei(_snapamount, 'ether'), {from: _from_account.address}));
  console.log('as expected failed to make this stakesnap()');
 }

 });