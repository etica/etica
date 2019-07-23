pragma solidity ^0.5.2;

// ONLY FOR TESTING !!!
// EticaReleaseProtocolTest: Same as EticaRelease contract but with initial ETI balance for miner_account to make tests easier
// You can copy and paste EticaRelease code here but with only modifying constructor function so that miner_account has some ETI immediatly after deployment without having to mine 
// Done this to avoid to wait too long so that miner_account has mined a block and thus has ETI available, we need a lot of ETI as all tests of this file assume enough ETI and don't deal with mining tests


// ----------------------------------------------------------------------------

// Safe maths

// ----------------------------------------------------------------------------

library SafeMath {

    function add(uint a, uint b) internal pure returns (uint c) {

        c = a + b;

        require(c >= a);

    }

    function sub(uint a, uint b) internal pure returns (uint c) {

        require(b <= a);

        c = a - b;

    }

    function mul(uint a, uint b) internal pure returns (uint c) {

        c = a * b;

        require(a == 0 || c / a == b);

    }

    function div(uint a, uint b) internal pure returns (uint c) {

        require(b > 0);

        c = a / b;

    }

}



library ExtendedMath {


    //return the smaller of the two inputs (a or b)
    function limitLessThan(uint a, uint b) internal pure returns (uint c) {

        if(a > b) return b;

        return a;

    }
}



contract ERC20Interface {
    function totalSupply() public view returns (uint);
    function balanceOf(address tokenOwner) public view returns (uint balance);
    function transfer(address to, uint tokens) public returns (bool success);


    function allowance(address tokenOwner, address spender) public view returns (uint remaining);
    function approve(address spender, uint tokens) public returns (bool success);
    function transferFrom(address from, address to, uint tokens) public returns (bool success);

    event Transfer(address indexed from, address indexed to, uint tokens);
    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
}



contract EticaToken is ERC20Interface{

    using SafeMath for uint;
    using ExtendedMath for uint;

    string public name = "Etica";
    string public symbol = "ETI";
    uint public decimals = 18;

    uint public supply;
    uint public inflationrate; // fixed inflation rate of phase2 (after Etica supply has reached 21 Million ETI)
    uint public  periodrewardtemp; // Amount of ETI issued per period during phase1 (before Etica supply has reached 21 Million ETI)

    uint public PERIOD_CURATION_REWARD_RATIO = 20; // 20% of period reward will be used as curation reward
    uint public PERIOD_EDITOR_REWARD_RATIO = 80; // 80% of period reward will be used as editor reward

    // We don't want fake Satoshi again. Using it to prove founder's identity
    address public founder;
    string public foundermsgproof;

    mapping(address => uint) public balances;

    mapping(address => mapping(address => uint)) allowed;

    //allowed[0x1111....][0x22222...] = 100;

    // ----------- Mining system state variables ------------ //
    uint public _totalMiningSupply;



     uint public latestDifficultyPeriodStarted;



    uint public epochCount; //number of 'blocks' mined


    uint public _BLOCKS_PER_READJUSTMENT = 2016;


    //a little number
    uint public  _MINIMUM_TARGET = 2**16;


    //a big number is easier ; just find a solution that is smaller
    //uint public  _MAXIMUM_TARGET = 2**224;  bitcoin uses 224
    uint public  _MAXIMUM_TARGET = 2**242; // used for tests 243 much faster, 242 seems to be the limit where mining gets much harder
    // uint public  _MAXIMUM_TARGET = 2**234; // used for prod


    uint public miningTarget;

    bytes32 public challengeNumber;   //generate a new one when a new reward is minted


    uint public blockreward;


    address public lastRewardTo;
    uint public lastRewardEthBlockNumber;

    bool locked = false;

    mapping(bytes32 => bytes32) solutionForChallenge;

    uint public tokensMinted;

    // ----------- Mining system state variables ------------ //




    event Transfer(address indexed from, address indexed to, uint tokens);
    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
    event Mint(address indexed from, uint blockreward, uint epochCount, bytes32 newChallengeNumber);


    constructor() public{
      supply = 1100000 * (10**18); // initial supply equals 1 100 000 ETI
      balances[address(this)] = balances[address(this)].add(1000000 * (10**18)); // 1 000 000 ETI as the default contract balance. To avoid any issue that could arise from negative contract balance because of significant numbers approximations
      balances[0x5FBd856f7f0c79723100FF6e1450cC1464D3fffC] = balances[0x5FBd856f7f0c79723100FF6e1450cC1464D3fffC].add(100000 * (10**18)); // 100 000 ETI to miner_account replace address with your miner_account address


      // ------------ PHASE 1 (before 21 Million ETI has been reached) -------------- //
      
      /* Phase 1:
      --> 10 500 000 ETI to be issued during phase 1 as periodrewardtemp for ETICA reward system
      --> 10 500 000 ETI to be distributed trough MINING as block reward
      */

      // --- PUBLISHING REWARD --- //
      // periodrewardtemp: Temporary fixed ETI issued per period (7 days) as reward of Etica System during phase 1. (Will be replaced by dynamic inflation of golden number at phase 2)
      // Calculation of periodrewardtemp:
        // The amount of reward will be about twice as much as the first rewards of phase 2
          // Calculation of first rewards of phase 2:
            // 21 000 000 * 0.26180339887498948482045868343656 = 549 787,13763747791812296323521678‬ ETI (first year reward)
              // 549 787,13763747791812296323521678‬ / 52.1429 = 10 543,854247413893706007207792754‬ ETI (first weeks reward of phase2 rough estimation)
                // 10 543,854247413893706007207792754‬ * 2 = 21087,708494827787412014415585507 ETI
      periodrewardtemp = 21087708494827787412014; // 21087,708494827787412014415585507 ETI per period (7 days) will take about 9,5491502812526287948853291408588 years to reach 10 500 000 ETI
      // --- PUBLISHING REWARD --- //

      // --- MINING REWARD --- //
      _totalMiningSupply = 10500000 * 10**uint(decimals);

      if(locked) revert();
      locked = true;

      tokensMinted = 0;


      // The amount of etica mined per 7 days will be twice of first rewards of phase 2
      // eSTIMATION of first rewards of phase 2:
      // 21 000 000 * 0.26180339887498948482045868343656 = 549 787,13763747791812296323521678‬ ETI (first year reward)
      // 549 787,13763747791812296323521678‬ / 52.1429 = 10 543,854247413893706007207792754‬ ETI (wide ESTIMATION of first weeks reward of phase2)
      // 10 543,854247413893706007207792754‬ * 2 = 21087,708494827787412014415585507 ETI per 7 days
      // 21087,708494827787412014415585507 ETI per 7 days = 20,920345728995820845252396414193‬ ETI per block (10 minutes)
      blockreward = 20920345728995820845;

      miningTarget = _MAXIMUM_TARGET;

      latestDifficultyPeriodStarted = block.timestamp;

      _startNewMiningEpoch();
      // --- MINING REWARD --- //

      // ------------ PHASE 1 (before 21 Million ETI has been reached) -------------- //
      

      // ------------ PHASE 2 (after the first 21 Million ETI have been issued) -------------- //

      // Golden number power 2: 1,6180339887498948482045868343656 * 1,6180339887498948482045868343656 = 2.6180339887498948482045868343656;
      // Thus yearly inflation target is 2.6180339887498948482045868343656%
      // inflationrate calculation:
      // Each Period is 7 days, so we need to get a weekly inflationrate from the yearlyinflationrate target (1.026180339887498948482045868343656): 
      // 1.026180339887498948482045868343656 ^(1 / 52.1429) = 1,0004957512263080183722688891602;
      // 1,0004957512263080183722688891602 - 1 = 0,0004957512263080183722688891602;
      // Hence weekly inflationrate is 0,04957512263080183722688891602%
      inflationrate = 4957512263080183722688891602;  // (need to multiple by 10^(-31) to get 0,0004957512263080183722688891602;

       // ------------ PHASE 2 (after the first 21 Million ETI have been issued) -------------- //


       //The founder gets nothing! You must mine or earn the Etica ERC20 token
       //balances[founder] = _totalMiningSupply;
       //Transfer(address(0), founder, _totalMiningSupply);
      founder = msg.sender;
      foundermsgproof = "Discovering our best Futures. Kevin Wad";
    }


    function allowance(address tokenOwner, address spender) view public returns(uint){
        return allowed[tokenOwner][spender];
    }


    //approve allowance
    function approve(address spender, uint tokens) public returns(bool){
        require(balances[msg.sender] >= tokens);
        require(tokens > 0);

        allowed[msg.sender][spender] = tokens;
        emit Approval(msg.sender, spender, tokens);
        return true;
    }

    //transfer tokens from the  owner account to the account that calls the function
    function transferFrom(address from, address to, uint tokens) public returns(bool){

      balances[from] = balances[from].sub(tokens);

      allowed[from][msg.sender] = allowed[from][msg.sender].sub(tokens);

      balances[to] = balances[to].add(tokens);

      emit Transfer(from, to, tokens);

      return true;
    }

    function totalSupply() public view returns (uint){
        return supply;
    }

    function balanceOf(address tokenOwner) public view returns (uint balance){
         return balances[tokenOwner];
     }


    function transfer(address to, uint tokens) public returns (bool success){
         require(tokens > 0);

         balances[msg.sender] = balances[msg.sender].sub(tokens);

         balances[to] = balances[to].add(tokens);

         emit Transfer(msg.sender, to, tokens);

         return true;
     }


     // -------------  Mining system functions ---------------- //

         function mint(uint256 nonce, bytes32 challenge_digest) public returns (bool success) {


             //the PoW must contain work that includes a recent ethereum block hash (challenge number) and the msg.sender's address to prevent MITM attacks
             bytes32 digest =  keccak256(abi.encodePacked(challengeNumber, msg.sender, nonce));

             //the challenge digest must match the expected
             if (digest != challenge_digest) revert();

             //the digest must be smaller than the target
             if(uint256(digest) > miningTarget) revert();


             //only allow one reward for each challenge
              bytes32 solution = solutionForChallenge[challengeNumber];
              solutionForChallenge[challengeNumber] = digest;
              if(solution != 0x0) revert();  //prevent the same answer from awarding twice


             //Cannot mint more tokens than there are: maximum ETI ever mined: _totalMiningSupply + blockreward
             assert(tokensMinted < _totalMiningSupply);

             tokensMinted = tokensMinted.add(blockreward);
             supply = supply.add(blockreward);
             balances[msg.sender] = balances[msg.sender].add(blockreward);

             //set readonly diagnostics data
             lastRewardTo = msg.sender;
             lastRewardEthBlockNumber = block.number;


              _startNewMiningEpoch();

               emit Mint(msg.sender, blockreward, epochCount, challengeNumber );

            return true;

         }


     //a new 'block' to be mined
     function _startNewMiningEpoch() internal {


       epochCount = epochCount.add(1);

       //every so often, readjust difficulty. Dont readjust when deploying
       if(epochCount % _BLOCKS_PER_READJUSTMENT == 0)
       {
         _reAdjustDifficulty();
       }


       //make the latest ethereum block hash a part of the next challenge for PoW to prevent pre-mining future blocks
       //do this last since this is a protection mechanism in the mint() function
       challengeNumber = blockhash(block.number - 1);

     }




     //https://en.bitcoin.it/wiki/Difficulty#What_is_the_formula_for_difficulty.3F
     //as of 2017 the bitcoin difficulty was up to 17 zeroes, it was only 8 in the early days

     //readjust the target by up to 50 percent
     function _reAdjustDifficulty() internal {

          // should get as close as possible to (2016 * 10 minutes) seconds => 1 209 600 seconds
         uint ethTimeSinceLastDifficultyPeriod = block.timestamp - latestDifficultyPeriodStarted;      

         //we want miners to spend 10 minutes to mine each 'block'
         uint targetTimePerDiffPeriod = _BLOCKS_PER_READJUSTMENT * 10 minutes; //Target is 1 209 600 seconds. (2016 * 10 minutes) seconds to mine _BLOCKS_PER_READJUSTMENT blocks of ETI.

         //if there were less eth seconds-timestamp than expected
         if( ethTimeSinceLastDifficultyPeriod < targetTimePerDiffPeriod )
         {
           uint excess_block_pct = (targetTimePerDiffPeriod.mul(100)).div( ethTimeSinceLastDifficultyPeriod );

           uint excess_block_pct_extra = excess_block_pct.sub(100).limitLessThan(1000);
           // If there were 5% more blocks mined than expected then this is 5.  If there were 100% more blocks mined than expected then this is 100.

           //make it harder
           miningTarget = miningTarget.sub(miningTarget.div(2000).mul(excess_block_pct_extra));   //by up to 50 %
         }else{
           uint shortage_block_pct = (ethTimeSinceLastDifficultyPeriod.mul(100)).div( targetTimePerDiffPeriod );

           uint shortage_block_pct_extra = shortage_block_pct.sub(100).limitLessThan(1000); //always between 0 and 1000

           //make it easier
           miningTarget = miningTarget.add(miningTarget.div(2000).mul(shortage_block_pct_extra));   //by up to 50 %
         }



         latestDifficultyPeriodStarted = block.timestamp;

         if(miningTarget < _MINIMUM_TARGET) //very difficult
         {
           miningTarget = _MINIMUM_TARGET;
         }

         if(miningTarget > _MAXIMUM_TARGET) //very easy
         {
           miningTarget = _MAXIMUM_TARGET;
         }
     }


     //this is a recent ethereum block hash, used to prevent pre-mining future blocks
     function getChallengeNumber() public view returns (bytes32) {
         return challengeNumber;
     }

     //the number of zeroes the digest of the PoW solution requires.  Auto adjusts
      function getMiningDifficulty() public view returns (uint) {
         return _MAXIMUM_TARGET.div(miningTarget);
     }

     function getMiningTarget() public view returns (uint) {
        return miningTarget;
    }


     //help debug mining software
     function getMintDigest(uint256 nonce, bytes32 challenge_digest, bytes32 challenge_number) public view returns (bytes32 digesttest) {

         bytes32 digest = keccak256(abi.encodePacked(challenge_number,msg.sender,nonce));

         return digest;

       }

         //help debug mining software
       function checkMintSolution(uint256 nonce, bytes32 challenge_digest, bytes32 challenge_number, uint testTarget) public view returns (bool success) {

           bytes32 digest = keccak256(abi.encodePacked(challenge_number,msg.sender,nonce));

           if(uint256(digest) > testTarget) revert();

           return (digest == challenge_digest);

         }


// ------------------      Mining system functions   -------------------------  //

// ------------------------------------------------------------------------

// Don't accept ETH

// ------------------------------------------------------------------------

function () payable external {

    revert();

}

}




contract EticaReleaseProtocolTest is EticaToken {
  /* --------- PROD VALUES -------------
uint REWARD_INTERVAL = 7 days; // periods duration 7 jours
uint STAKING_DURATION = 28 days; // default stake duration 28 jours
uint ETICA_TO_BOSOM_RATIO = 1; //
uint DEFAULT_VOTING_TIME = 28 days; // default stake duration 28 days
     --------- PROD VALUES ------------- */

/* --------- TESTING VALUES -------------*/
uint public REWARD_INTERVAL = 1 minutes; // periods duration 7 jours
uint public STAKING_DURATION = 4 minutes; // default stake duration 28 jours
uint public ETICA_TO_BOSOM_RATIO = 1; //
uint public DEFAULT_VOTING_TIME = 4 minutes; // default stake duration 28 days
/* --------- TESTING VALUES -------------*/

uint public DISEASE_CREATION_AMOUNT = 100 * 10**uint(decimals); // 100 ETI amount to pay for creating a new disease. Necessary in order to avoid spam. Will create a function that periodically increase it in order to take into account inflation
uint public PROPOSAL_DEFAULT_VOTE = 10 * 10**uint(decimals); // 10 ETI amount to pay for creating a new proposal. Necessary in order to avoid spam. Will create a function that periodically increase it in order to take into account inflation


uint TIER_ONE_THRESHOLD = 50; // threshold for proposal to be accepted. 50 means 50 %, 60 would mean 60%

struct Period{
    uint id;
    uint interval;
    uint curation_sum; // used for proposals weight system
    uint editor_sum; // used for proposals weight system
    uint total_voters; // TOTAL nb of voters in this period
    uint reward_for_curation; // total ETI issued to be used as Period reward for Curation
    uint reward_for_editor; // total ETI issued to be used as Period reward for Editor
}

  struct Stake{
      uint amount;
      uint startTime;
      uint endTime;
  }

  // -----------  PROPOSALS STRUCTS  ------------  //


// Stuct used only inside Proposals as Proposals' Targets.
// The software has no independent Target structs with Target ids and details ...
  struct Target{
      string name;
      string kind; // Example: GPCR, Enzyme, Protein Activity ...
      uint status; // Example: Exploration, Validation, Fully Validated, Null ...
      string freefield; // used by front end apps and communities to fit their needs and process
  }

  // Stuct used only inside Proposals as Proposals' Compounds.
  // The software has no independent Compounds structs with Compounds ids and details ...
    struct Compound{
        string name;
        string kind; // Example: Small Organic Molecules, Large Protein Molecules ...
        uint result; // Example: Failure, Success, Undertermined, Null ...
        string freefield; // used by front end apps and communities to fit their needs and process
    }


// general information of Proposal:
  struct Proposal{
      uint id;
      bytes32 proposed_release_hash; // Hash of "raw_release_hash + name of Disease"
      bytes32 disease_id;
      uint period_id;
      address proposer; // account address of the proposer
      string title; // Title of the Proposal
      string description; // Description of the Proposal
  }

// main data of Proposal:
  struct ProposalData{

      uint starttime; // epoch time of the proposal
      uint endtime;  // voting limite
      uint finalized_time; // when first voteclm() was called
      ProposalStatus status; // will be initialized with value ProposalStatus.Pending
      ProposalStatus prestatus; // will be initialzed with value ProposalStatus.Pending
      bool istie;  // will be initialized with value 0. if prop is tie it won't slash nor reward participants
      uint nbvoters;
      uint slashingratio; // will be initialized with value 0. solidity does not support float type. So will emulate float type by using uint
      uint forvotes;
      uint againstvotes;
      uint lastcuration_weight; // will be initialized with value 0.
      uint lasteditor_weight; // will be initialized with value 0.
  }

  struct ProposalIpfs{
    // IPFS hashes of the files:
    string raw_release_hash; // IPFS hash of the files of the proposal
    string old_release_hash; // raw IPFS hash of the old version
    string grandparent_hash; // raw IPFS hash of the grandparent
  }

  struct ProposalFreefield{
    string firstfield;
    string secondfield;
    string thirdfield;
  }


  struct ProposalTenor{
      Target[] targets;
      Compound[] compounds;
  }

  // -----------  PROPOSALS STRUCTS ------------  //

  // -----------  VOTES STRUCTS ----------------  //
  struct Vote{
    uint id; // not necessary, may remove this field
    bytes32 proposal_hash; // proposed_release_hash of proposal
    bool approve;
    bool is_editor;
    uint amount;
    address voter; // address of the voter
    uint timestamp; // epoch time of the vote
    bool is_claimed; // keeps tarck of whether or not vote has been claimed to avoid double claim on same vote
  }
    // -----------  VOTES STRUCTS ----------------  //

    // -----------  DISEASES STRUCTS ----------------  //

  struct Disease{
      bytes32 disease_hash;
      string name;
      string description;
  }

     // -----------  DISEASES STRUCTS ----------------  //

enum ProposalStatus { Rejected, Accepted, Pending, Singlevoter }

mapping(uint => Period) public periods;
uint public periodsCounter;
mapping(uint => uint) public PeriodsIssued; // keeps track of which periods have already issued ETI
uint public PeriodsIssuedCounter;
mapping(uint => uint) public IntervalsPeriods; // keeps track of which intervals have already a period
uint public IntervalsPeriodsCounter;


mapping(uint => Disease) public diseases; // keeps track of which intervals have already a period
uint public diseasesCounter;
mapping(bytes32 => uint) public diseasesbyIds; // example:    [leiojej757575ero] => [0]  where leiojej757575ero is id of a Disease
mapping(string => bytes32) private diseasesbyNames; // example:    ["name of a disease"] => [leiojej757575ero]  where leiojej757575ero is id of a Disease. Set visibility to private because mapping with strings as keys have issues when public visibility

// -----------  PROPOSALS MAPPINGS ------------  //
mapping(bytes32 => Proposal) public proposals;
uint public proposalsCounter;

mapping(bytes32 => ProposalData) public propsdatas;
mapping(bytes32 => ProposalIpfs) public propsipfs;
mapping(bytes32 => ProposalFreefield) public propsfreefields;
mapping(bytes32 => ProposalTenor) private propstenors;
// -----------  PROPOSALS MAPPINGS ------------  //

// -----------  VOTES MAPPINGS ----------------  //
mapping(bytes32 => mapping(address => Vote)) public votes;
// -----------  VOTES MAPPINGS ----------------  //

mapping(address => uint) public bosoms;
mapping(address => mapping(uint => Stake)) public stakes;
mapping(address => uint) public stakesCounters; // keeps track of how many stakes for each user
mapping(address => uint) public stakesAmount; // keeps track of total amount of stakes for each user
// stakes ----> slashing function will need to loop trough stakes. Can create issues for claiming votes:
// will create a function to gather stakes when user has to much stakes.
// The function will take a completion_time as parameter and will loop trough 50 indexes and will put all stakes with
// lower completion_time into a  single new stake with parameter completion_time

// Blocked ETI amount, user has votes with this amount in process and can't retrieve this amount before the system knows if the user has to be slahed
mapping(address => uint) public blockedeticas;

// ---------- EVENTS ----------- //
event CreatedPeriod(uint period_id, uint interval);
event IssuedPeriod(uint period_id, uint periodreward, uint periodrwdcuration, uint periodrwdeditor);
event NewStake(address indexed staker, uint amount);
event StakeClaimed(address indexed staker, uint stakeidx);
event NewDisease(uint diseaseindex, string title, string description);
event NewProposal(bytes32 proposed_release_hash, bytes32 diseasehash, string title, string description);
event VoteClaimed(address indexed voter, uint amount, bytes32 proposal_hash);
// ----------- EVENTS ---------- //



// -------------  PUBLISHING SYSTEM REWARD FUNCTIONS ---------------- //

function issue(uint _id) internal returns (bool success) {
  // we check whether there is at least one period
  require(periodsCounter > 0);

  // we check that the period exists
  require(_id > 0 && _id <= periodsCounter);

  // we retrieve the period
  Period storage period = periods[_id];

  // we check that the period is legit and has been retrieved
  require(period.id != 0);


//only allow one issuance for each period
uint rwd = PeriodsIssued[period.id];
if(rwd != 0x0) revert();  //prevent the same period from issuing twice

uint _periodsupply;

// era 2 (after 21 000 000 ETI has been reached)
if(supply >= 21000000 * 10**(decimals)){
_periodsupply = uint((supply * inflationrate).div(10**(31)));
}
// era 1 (before 21 000 000 ETI has been reached)
else {
  _periodsupply = periodrewardtemp;
}

// update Period Reward:
period.reward_for_curation = uint((_periodsupply * PERIOD_CURATION_REWARD_RATIO) / 100);
period.reward_for_editor = uint((_periodsupply * PERIOD_EDITOR_REWARD_RATIO) / 100);


supply = supply + _periodsupply;
balances[address(this)] = balances[address(this)].add(_periodsupply);
PeriodsIssued[period.id] = _periodsupply;
PeriodsIssuedCounter = PeriodsIssuedCounter + 1;

emit IssuedPeriod(periodsCounter, _periodsupply, period.reward_for_curation, period.reward_for_editor);

return true;

}

// --- WARNING this function should be internal, will be called by propose proposal function and by constructor for first call
// let public for testing only
// create a period
function newPeriod() public {

  uint _interval = uint((block.timestamp).div(REWARD_INTERVAL));

  //only allow one period for each interval
  uint rwd = IntervalsPeriods[_interval];
  if(rwd != 0x0) revert();  //prevent the same interval from having 2 periods


  periodsCounter++;

  // store this interval period
  periods[periodsCounter] = Period(
    periodsCounter,
    _interval,
    0x0, //_curation_sum
    0x0, //_editor_sum
    0x0, //_total_voters; // TOTAL nb of voters in this period
    0x0, //_reward_for_curation
    0x0 //_reward_for_editor
  );

  // an interval cannot have 2 Periods
  IntervalsPeriods[_interval] = periodsCounter;
  IntervalsPeriodsCounter++;

  // issue ETI for this Period Reward
  issue(periodsCounter);

  emit CreatedPeriod(periodsCounter, _interval);
}

// -------------  PUBLISHING SYSTEM REWARD FUNCTIONS ---------------- //


// -------------------- STAKING ----------------------- //
// eticatobosoms(): Stake etica in exchange for bosom
function eticatobosoms(address _staker, uint _amount) public returns (bool success){
  require(msg.sender == _staker);
  require(_amount > 0); // even if transfer require amount > 0 I prefer checking for more security and very few more gas
  // transfer _amount ETI from staker wallet to contract balance:
  transfer(address(this), _amount);

  // Get bosoms and add Stake
  bosomget(_staker, _amount);


  return true;

}



// ----  Get bosoms and add Stake ------  //

//bosomget(): Get bosoms and add Stake. Only contract must be able to call this function:
function bosomget (address _staker, uint _amount) internal {

addStake(_staker, _amount);

uint newBosoms = _amount * ETICA_TO_BOSOM_RATIO;
bosoms[_staker] = bosoms[_staker].add(newBosoms);

}


function addStake(address _staker, uint _amount) internal returns (bool success) {

    require(_amount > 0); // may not be necessary as _amount is uint but I let it for better security
    stakesCounters[_staker] = stakesCounters[_staker] + 1; // notice that first stake will have the index of 1 thus not 0 !


    // increase variable that keeps track of total value of user's stakes
    stakesAmount[_staker] = stakesAmount[_staker].add(_amount);

    uint endTime = block.timestamp + STAKING_DURATION;

    // store this stake in _staker's stakes with the index stakesCounters[_staker]
    stakes[_staker][stakesCounters[_staker]] = Stake(
      _amount, // stake amount
      block.timestamp, // startTime
      endTime // endTime
    );

    emit NewStake(_staker, _amount);

    return true;
}

function addConsolidation(address _staker, uint _amount, uint _endTime) internal returns (bool success) {

    require(_amount > 0); // may not be necessary as _amount is uint but I let it for better security
    stakesCounters[_staker] = stakesCounters[_staker] + 1; // notice that first stake will have the index of 1 thus not 0 !


    // increase variable that keeps track of total value of user's stakes
    stakesAmount[_staker] = stakesAmount[_staker].add(_amount);

    // store this stake in _staker's stakes with the index stakesCounters[_staker]
    stakes[_staker][stakesCounters[_staker]] = Stake(
      _amount, // stake amount
      block.timestamp, // startTime
      _endTime // endTime
    );

    emit NewStake(_staker, _amount);

    return true;
}



function splitStake(address _staker, uint _amount, uint _startTime, uint _endTime) internal returns (bool success) {

    require(_amount > 0); // may not be necessary as _amount is uint but I let it for better security
    stakesCounters[_staker] = stakesCounters[_staker] + 1; // notice that first stake will have the index of 1 thus not 0 !

    // store this stake in _staker's stakes with the index stakesCounters[_staker]
    stakes[_staker][stakesCounters[_staker]] = Stake(
      _amount, // stake amount
      _startTime, // startTime
      _endTime // endTime
    );

    emit NewStake(_staker, _amount);

    return true;
}

// ----  Get bosoms and add Stake ------  //


// ----  Redeem a Stake ------  //
//stakeclmidx(): redeem a stake by its index
function stakeclmidx (uint _stakeidx) public {

  // we check that the stake exists
  require(_stakeidx > 0 && _stakeidx <= stakesCounters[msg.sender]);

  // we retrieve the stake
  Stake storage _stake = stakes[msg.sender][_stakeidx];

  // The stake must be over
  require(block.timestamp > _stake.endTime);

  // the amount to be unstake must be less or equal to the amount of ETI currently marked as blocked in blockedeticas as they need to go through the clmpropbyhash before being unstaked !
  require(_stake.amount <= stakesAmount[msg.sender] - blockedeticas[msg.sender]);

  // transfer back ETI from contract to staker:
  balances[address(this)] = balances[address(this)].sub(_stake.amount);

  balances[msg.sender] = balances[msg.sender].add(_stake.amount);

  emit Transfer(address(this), msg.sender, _stake.amount);
  emit StakeClaimed(msg.sender, _stakeidx);

  // deletes the stake
  _deletestake(msg.sender, _stakeidx);

}

function _deletestake(address _staker,uint _index) internal {
  // we check that the stake exists
  require(_index > 0 && _index <= stakesCounters[_staker]);

  // decrease variable that keeps track of total value of user's stakes
  stakesAmount[_staker] = stakesAmount[_staker].sub(stakes[_staker][_index].amount);

  // replace value of stake to be deleted by value of last stake
  stakes[_staker][_index] = stakes[_staker][stakesCounters[_staker]];

  // remove last stake
  stakes[_staker][stakesCounters[_staker]] = Stake(
    0x0, // amount
    0x0, // startTime
    0x0 // endTime
    );

  // updates stakesCounter of _staker
  stakesCounters[_staker] = stakesCounters[_staker] - 1;

}

// ----  Redeem a Stake ------  //


// ----- Stakes consolidation  ----- //

function stakescsldt(address _staker, uint _endTime, uint _min_limit, uint _maxidx) public {

// _maxidx must be less or equal to nb of stakes and we set a limit for loop of 100:
require(_maxidx <= 100 && _maxidx <= stakesCounters[msg.sender]);

uint newAmount = 0;

uint _nbdeletes = 0;

uint _currentidx = 1;

for(uint _stakeidx = 1; _stakeidx <= _maxidx;  _stakeidx++) {
    // only consolidates if account nb of stakes >= 2 :
    if(stakesCounters[msg.sender] >= 2){

    if(_stakeidx <= stakesCounters[msg.sender]){
       _currentidx = _stakeidx;
    } 
    // if _stakeidx > stakesCounters[msg.sender] it means the deletes function has pushed the next stakes at the begining:
    else {
      _currentidx = _stakeidx - _nbdeletes; //Notice: initial stakesCounters[msg.sender] = stakesCounters[msg.sender] + _nbdeletes. 
      //So "_stackidx <= _maxidx <= initial stakesCounters[msg.sender]" ===> "_stakidx <= stakesCounters[msg.sender] + _nbdeletes" ===> "_stackidx - _nbdeletes <= stakesCounetrs[msg.sender]"
      require(_currentidx >= 1); // makes sure _currentidx is within existing stakes range
    }
      
      //if stake should end sooner than _endTime it can be consolidated into a stake that end latter:
      // Plus we check the stake.endTime is above the minimum limit the user is willing to consolidate. For instance user doesn't want to consolidate a stake that is ending tomorrow
      if(stakes[msg.sender][_currentidx].endTime <= _endTime && stakes[msg.sender][_currentidx].endTime >= _min_limit) {

        newAmount += stakes[msg.sender][_currentidx].amount;

        _deletestake(msg.sender, _currentidx);    

        _nbdeletes += 1;

      }  

    }
}

// creates the new Stake
addConsolidation(msg.sender, newAmount, _endTime);

}

// ----- Stakes consolidation  ----- //


function stakescount(address _staker) public view returns (uint slength){
  return stakesCounters[_staker];
}

// ----------------- STAKING ------------------ //


// -------------  PUBLISHING SYSTEM CORE FUNCTIONS ---------------- //
function createdisease(string memory _name, string memory _description) public {


  // --- REQUIRE PAYMENT FOR ADDING A DISEASE TO CREATE A BARRIER TO ENTRY AND AVOID SPAM --- //

  // make sure the user has enough ETI to create a disease
  require(balances[msg.sender] >= DISEASE_CREATION_AMOUNT);
  // transfer DISEASE_CREATION_AMOUNT ETI from user wallet to contract wallet:
  transfer(address(this), DISEASE_CREATION_AMOUNT);

  // --- REQUIRE PAYMENT FOR ADDING A DISEASE TO CREATE A BARRIER TO ENTRY AND AVOID SPAM --- //


  bytes32 _diseasehash = keccak256(abi.encode(_name));

  diseasesCounter = diseasesCounter + 1; // notice that first disease will have the index of 1 thus not 0 !

  //check: if the disease is new we continue, otherwise we exit
   if(diseasesbyIds[_diseasehash] != 0x0) revert();  //prevent the same disease from being created twice. The software manages diseases uniqueness based on their unique english name. Note that even the first disease will nott have index of 0 thus should pass this check


   // store this stake in _staker's stakes with the index stakesCounters[_staker]
   diseases[diseasesCounter] = Disease(
     _diseasehash,
     _name,
     _description
   );

   // Updates diseasesbyIds and diseasesbyNames mappings:
   diseasesbyIds[_diseasehash] = diseasesCounter;
   diseasesbyNames[_name] = _diseasehash;

   emit NewDisease(diseasesCounter, _name, _description);

}



function propose(bytes32 _diseasehash, string memory _title, string memory _description, string memory raw_release_hash,
  string memory old_release_hash, string memory grandparent_hash) public {

    //check if the disease exits
     require(diseasesbyIds[_diseasehash] > 0 && diseasesbyIds[_diseasehash] <= diseasesCounter);
     if(diseases[diseasesbyIds[_diseasehash]].disease_hash != _diseasehash) revert(); // second check not necessary but I decided to add it as the gas cost value for security is worth it


     bytes32 _proposed_release_hash = keccak256(abi.encode(raw_release_hash, _diseasehash));

     proposalsCounter = proposalsCounter + 1; // notice that first proposal will have the index of 1 thus not 0 !


     // store this disease in diseases mapping.
     // ------- Warning ----
     // Check that proposal does not already exist
     // only allow one proposal for each {raw_release_hash,  _diseasehash} combinasion
      bytes32 existing_proposal = proposals[_proposed_release_hash].proposed_release_hash;
      if(existing_proposal != 0x0 || proposals[_proposed_release_hash].id != 0) revert();  //prevent the same raw_release_hash from being submited twice on same proposal. Double check for better security and slightly higher gas cost even though one would be enough !

     uint _current_interval = uint((block.timestamp).div(REWARD_INTERVAL));

      // Create new Period if this current interval did not have its Period created yet
      if(IntervalsPeriods[_current_interval] == 0x0){
        newPeriod();
      }

     Proposal storage proposal = proposals[_proposed_release_hash];
     // ------- Warning ----

       proposal.id = proposalsCounter;
       proposal.disease_id = _diseasehash; // _diseasehash has already been checked to equal diseases[diseasesbyIds[_diseasehash]].disease_hash
       proposal.period_id = IntervalsPeriods[_current_interval];
       proposal.proposed_release_hash = _proposed_release_hash; // Hash of "raw_release_hash + name of Disease",
       proposal.proposer = msg.sender;
       proposal.title = _title;
       proposal.description = _description;


       // Proposal IPFS:
       ProposalIpfs storage proposalipfs = propsipfs[_proposed_release_hash];
       proposalipfs.raw_release_hash = raw_release_hash;
       proposalipfs.old_release_hash = old_release_hash;
       proposalipfs.grandparent_hash = grandparent_hash;


       //  Proposal Data:
       ProposalData storage proposaldata = propsdatas[_proposed_release_hash];
       //starttime,
       //endtime,
       //finalized_time,
       proposaldata.status = ProposalStatus.Pending;
       proposaldata.istie = false;
       proposaldata.prestatus = ProposalStatus.Pending;
       proposaldata.nbvoters = 0;
       proposaldata.slashingratio = 0;
       proposaldata.forvotes = 0;
       proposaldata.againstvotes = 0;
       proposaldata.lastcuration_weight = 0;
       proposaldata.lasteditor_weight = 0;
       proposaldata.starttime = block.timestamp;
       proposaldata.endtime = block.timestamp + DEFAULT_VOTING_TIME;


  // --- REQUIRE DEFAULT VOTE TO CREATE A BARRIER TO ENTRY AND AVOID SPAM --- //

  defaultvote(_proposed_release_hash);

  // --- REQUIRE DEFAULT VOTE TO CREATE A BARRIER TO ENTRY AND AVOID SPAM --- //


    emit NewProposal(_proposed_release_hash, _diseasehash, _title, _description);

}



 function defaultvote(bytes32 _proposed_release_hash) internal {

   require(bosoms[msg.sender] >= PROPOSAL_DEFAULT_VOTE); // may not be necessary as wil be handled by safemath sub function: bosoms[msg.sender].sub(PROPOSAL_DEFAULT_VOTE);

   //check if the proposal exists and that we get the right proposal:
   Proposal storage proposal = proposals[_proposed_release_hash];
   require(proposal.id > 0 && proposal.proposed_release_hash == _proposed_release_hash);

   // voterIsProposer can be used for the Linking Reward attribution:
   bool voterIsProposer = false;
   if (msg.sender == proposal.proposer) {
   voterIsProposer = true;
   }

   ProposalData storage proposaldata = propsdatas[_proposed_release_hash];
    // Verify voting is still in progress
    require( block.timestamp < proposaldata.endtime);


    // default vote can't be called twice on same proposal:
    // can vote for proposal only if default vote hasn't changed prestatus of Proposal yet. Thus can default vote only if default vote has not occured yet
    require(proposaldata.prestatus == ProposalStatus.Pending);

    // Consume bosom:
    bosoms[msg.sender] = bosoms[msg.sender].sub(PROPOSAL_DEFAULT_VOTE);


   // get Period of Proposal:
   Period storage period = periods[proposal.period_id];


    // Block Eticas in eticablkdtbl to prevent user from unstaking before eventual slash
    blockedeticas[msg.sender] = blockedeticas[msg.sender].add(PROPOSAL_DEFAULT_VOTE);


    // store vote:
    Vote storage vote = votes[proposal.proposed_release_hash][msg.sender];
    vote.proposal_hash = proposal.proposed_release_hash;
    vote.approve = true;
    vote.is_editor = voterIsProposer;
    vote.amount = PROPOSAL_DEFAULT_VOTE;
    vote.voter = msg.sender;
    vote.timestamp = block.timestamp;



      // UPDATE PROPOSAL:
      proposaldata.slashingratio = 100;
      proposaldata.forvotes = PROPOSAL_DEFAULT_VOTE;
      proposaldata.nbvoters = 1;
      proposaldata.prestatus = ProposalStatus.Singlevoter;
      proposaldata.lastcuration_weight = PROPOSAL_DEFAULT_VOTE;
      proposaldata.lasteditor_weight = PROPOSAL_DEFAULT_VOTE;

      // UPDATE PERIOD:
      period.curation_sum = period.curation_sum + PROPOSAL_DEFAULT_VOTE;
      period.editor_sum = period.editor_sum + PROPOSAL_DEFAULT_VOTE;
      period.total_voters += 1;

 }


 function votebyhash(bytes32 _proposed_release_hash, bool _approved, uint _amount) public {

//check if the proposal exists and that we get the right proposal:
Proposal storage proposal = proposals[_proposed_release_hash];
require(proposal.id > 0 && proposal.proposed_release_hash == _proposed_release_hash);

 bool voterIsProposer = false;
 if (msg.sender == proposal.proposer) {
 voterIsProposer = true;
 }


ProposalData storage proposaldata = propsdatas[_proposed_release_hash];
 // Verify voting is still in progress
 require( block.timestamp < proposaldata.endtime);

 require(proposaldata.prestatus != ProposalStatus.Pending); // can vote for proposal only if default vote has changed prestatus of Proposal. Thus can vote only if default vote occured as supposed to

uint _old_proposal_curationweight = proposaldata.lastcuration_weight;
uint _old_proposal_editorweight = proposaldata.lasteditor_weight;

 // Consume bosom:
 require(bosoms[msg.sender] >= _amount); // may not be necessary as handled by safemath sub function
 bosoms[msg.sender] = bosoms[msg.sender].sub(_amount);


// get Period of Proposal:
Period storage period = periods[proposal.period_id];


 // Block Eticas in eticablkdtbl to prevent user from unstaking before eventual slash
 blockedeticas[msg.sender] = blockedeticas[msg.sender].add(_amount);


// Check that vote does not already exist
// only allow one vote for each {raw_release_hash, voter} combinasion
bytes32 existing_vote = votes[proposal.proposed_release_hash][msg.sender].proposal_hash;
if(existing_vote != 0x0 || votes[proposal.proposed_release_hash][msg.sender].amount != 0) revert();  //prevent the same user from voting twice for same raw_release_hash. Double condition check for better security and slightly higher gas cost even though one would be enough !


 // store vote:
 Vote storage vote = votes[proposal.proposed_release_hash][msg.sender];
 vote.proposal_hash = proposal.proposed_release_hash;
 vote.approve = _approved;
 vote.is_editor = voterIsProposer;
 vote.amount = _amount;
 vote.voter = msg.sender;
 vote.timestamp = block.timestamp;

 proposaldata.nbvoters = proposaldata.nbvoters + 1;

     // PROPOSAL VAR UPDATE
     if(_approved){
      proposaldata.forvotes = proposaldata.forvotes + _amount;
     }
     else {
       proposaldata.againstvotes = proposaldata.againstvotes + _amount;
     }


     // Determine slashing conditions
     bool _isapproved = false;
     bool _istie = false;
     uint totalVotes = proposaldata.forvotes + proposaldata.againstvotes;
     uint _forvotes_numerator = proposaldata.forvotes * 100; // (newproposal_forvotes / totalVotes) will give a number between 0 and 1. Multiply by 100 to stare it as uint
     uint _forvotesdiff_numerator = (proposaldata.forvotes - proposaldata.againstvotes) * 100; // ((newproposal_forvotes - proposaldata.againstvotes) / totalVotes) will give a number between 0 and 1. Multiply by 100 to stare it as uint
     uint _againstvotesdiff_numerator = (proposaldata.againstvotes - proposaldata.forvotes) * 100; // ((proposaldata.againstvotes - newproposal_forvotes) / totalVotes) will give a number between 0 and 1. Multiply by 100 to stare it as uint

     if ((_forvotes_numerator / totalVotes) >= TIER_ONE_THRESHOLD){
    _isapproved = true;
    if ((_forvotes_numerator / totalVotes) == TIER_ONE_THRESHOLD){
        _istie = true;
    }
    }

    proposaldata.istie = _istie;

    if (_isapproved){
    proposaldata.slashingratio = _forvotesdiff_numerator / totalVotes;
    }
    else{
    proposaldata.slashingratio = _againstvotesdiff_numerator / totalVotes;
    }

    // Make sure no weird bugs cause the slash reward to under/overflow
     require(proposaldata.slashingratio >=0 && proposaldata.slashingratio <= 100);


         // Proposal and Period new weight
         if (_istie) {
         proposaldata.prestatus =  ProposalStatus.Rejected;
         proposaldata.lastcuration_weight = 0;
         proposaldata.lasteditor_weight = 0;
         // Proposal tied, remove proposal curation and editor sum
         period.curation_sum = period.curation_sum - _old_proposal_curationweight;
         period.editor_sum = period.editor_sum - _old_proposal_editorweight;
         }
         else {
             // Proposal approved, strengthen curation sum
         if (_isapproved){
             proposaldata.prestatus =  ProposalStatus.Accepted;
             proposaldata.lastcuration_weight = proposaldata.forvotes * proposaldata.nbvoters;
             proposaldata.lasteditor_weight = proposaldata.forvotes * proposaldata.nbvoters;
             // Proposal approved, replace proposal curation and editor sum with forvotes
             period.curation_sum = period.curation_sum - _old_proposal_curationweight + proposaldata.lastcuration_weight;
             period.editor_sum = period.editor_sum - _old_proposal_editorweight + proposaldata.lasteditor_weight;
         }
         else{
             proposaldata.prestatus =  ProposalStatus.Rejected;
             proposaldata.lastcuration_weight = proposaldata.againstvotes * proposaldata.nbvoters;
             proposaldata.lasteditor_weight = 0;
             // Proposal rejected, replace proposal curation sum with againstvotes and remove proposal editor sum
             period.curation_sum = period.curation_sum - _old_proposal_curationweight + proposaldata.lastcuration_weight;
             period.editor_sum = period.editor_sum - _old_proposal_editorweight;
         }
         }

         period.total_voters += 1;

  }


  function clmpropbyhash(bytes32 _proposed_release_hash) public {

   //check if the proposal exists and that we get the right proposal:
   Proposal storage proposal = proposals[_proposed_release_hash];
   require(proposal.id > 0 && proposal.proposed_release_hash == _proposed_release_hash);


   // verify voting still in progress
   ProposalData storage proposaldata = propsdatas[_proposed_release_hash];
   // Verify voting period is over
   require( block.timestamp > proposaldata.endtime);

   
    // we check that the vote exists
    Vote storage vote = votes[proposal.proposed_release_hash][msg.sender];
    require(vote.proposal_hash == _proposed_release_hash);
    
    // make impossible to claim same vote twice
    require(!vote.is_claimed);
    vote.is_claimed = true;



  
    // De-Block Eticas from eticablkdtbl to enable user to unstake these Eticas
    blockedeticas[msg.sender] = blockedeticas[msg.sender].sub(vote.amount);


    // get Period of Proposal:
    Period storage period = periods[proposal.period_id];

   uint _current_interval = uint((block.timestamp).div(REWARD_INTERVAL));

   // Check if Period is ready for claims or if needs to wait more
   uint _min_intervals = uint((DEFAULT_VOTING_TIME).div(REWARD_INTERVAL) + 1); // Minimum intervals before claimable
   require(_current_interval >= period.interval + _min_intervals); // Period not ready for claims yet. Need to wait more !

  // if status equals pending this is the first claim for this proposal
  if (proposaldata.status == ProposalStatus.Pending) {

  // SET proposal new status
  if (proposaldata.prestatus == ProposalStatus.Accepted || proposaldata.prestatus == ProposalStatus.Singlevoter) {
            proposaldata.status = ProposalStatus.Accepted;
  }
  else {
    proposaldata.status = ProposalStatus.Rejected;
  }

  proposaldata.finalized_time = block.timestamp;

  // NEW STATUS AFTER FIRST VOTE DONE

  }


  // only slash and reward if prop is not tie:
  if (!proposaldata.istie) {


   // voter has voted wrongly and needs to be slashed
   
   // convert boolean to enum format for making comparasion with proposaldata.status possible:
   ProposalStatus voterChoice = ProposalStatus.Rejected;
   if(vote.approve){
     voterChoice = ProposalStatus.Accepted;
   }

   if(voterChoice != proposaldata.status) {
     // slash loosers
     uint _slashRemaining = vote.amount;
     uint _extraTimeInt = uint(STAKING_DURATION * proposaldata.slashingratio / 100);

     // get the stakes

         for(uint _stakeidx = 1; _stakeidx <= stakesCounters[msg.sender];  _stakeidx++) {
      //if stake is too small and will only be able to take into account a part of the slash:
      if(stakes[msg.sender][_stakeidx].amount <= _slashRemaining) {
 
        stakes[msg.sender][_stakeidx].endTime = stakes[msg.sender][_stakeidx].endTime + _extraTimeInt;
        stakes[msg.sender][_stakeidx].startTime = block.timestamp;
        _slashRemaining = _slashRemaining - stakes[msg.sender][_stakeidx].amount;
        
       if(_slashRemaining == 0){
         break;
       }


      }
      else {
        // The slash amount does not fill a full stake, so the stake needs to be split
        uint newAmount = stakes[msg.sender][_stakeidx].amount - _slashRemaining;
        uint oldTimestamp = stakes[msg.sender][_stakeidx].startTime;
        uint oldCompletionTime = stakes[msg.sender][_stakeidx].endTime;

        // slash amount split in _slashRemaining and newAmount
        stakes[msg.sender][_stakeidx].amount = _slashRemaining; // only slash the part of the stake that amounts to _slashRemaining
        stakes[msg.sender][_stakeidx].endTime = stakes[msg.sender][_stakeidx].endTime + _extraTimeInt; // slash the stake

        if(newAmount > 0){
          // create a new stake with the rest of what remained from original stake that was split in 2
          splitStake(msg.sender, newAmount, oldTimestamp, oldCompletionTime);
        }

        break;




      }





    }

    // the slash is over
     

   }
   else {

   uint _reward_amount = 0;

   // check beforte diving by 0
   require(period.curation_sum > 0); // period curation sum pb !
   _reward_amount += (vote.amount * proposaldata.nbvoters * period.reward_for_curation) / (period.curation_sum);

       // if voter is editor and proposal accepted:
    if (vote.is_editor && proposaldata.status == ProposalStatus.Accepted){
          // check before dividing by 0
          require( period.editor_sum > 0); // Period editor sum pb !
          _reward_amount += (proposaldata.lasteditor_weight * period.reward_for_editor) / (period.editor_sum);
    }

    require(_reward_amount <= period.reward_for_curation + period.reward_for_editor); // "System logic error. Too much ETICA calculated for reward."

    // SEND ETICA AS REWARD
    balances[address(this)] = balances[address(this)].sub(_reward_amount);
    balances[msg.sender] = balances[msg.sender].add(_reward_amount);

    emit Transfer(address(this), msg.sender, _reward_amount);
    emit VoteClaimed(msg.sender, _reward_amount, _proposed_release_hash);
    //transferFrom(address(this), msg.sender, _reward_amount);


   }


  }   // end bracket if proposaldata.istie not true


  }

// -------------  PUBLISHING SYSTEM CORE FUNCTIONS ---------------- //



// -------------  GETTER FUNCTIONS ---------------- //
// get bosoms balance of user:
function bosomsOf(address tokenOwner) public view returns (uint _bosoms){
     return bosoms[tokenOwner];
 }

 function getdiseasehashbyName(string memory _name) public view returns (bytes32 _diseasehash){
     return diseasesbyNames[_name];
 }
// -------------  GETTER FUNCTIONS ---------------- //

}