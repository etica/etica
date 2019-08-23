pragma solidity ^0.5.2;

/*
ETICA: a type1 civilization neutral protocol for medical research
KEVIN WAD OSSENI
*/


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

    uint public PERIOD_CURATION_REWARD_RATIO = 38196601125; // 38.196601125% of period reward will be used as curation reward
    uint public PERIOD_EDITOR_REWARD_RATIO = 61803398875; // 61.803398875% of period reward will be used as editor reward

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
      supply = 100 * (10**18); // initial supply equals 100 ETI
      balances[address(this)] = balances[address(this)].add(100 * (10**18)); // 100 ETI as the default contract balance. To avoid any issue that could arise from negative contract balance because of significant numbers approximations


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
           // 21 000 000 * 0.026180339887498948482045868343656 = 549 787,13763747791812296323521678‬ ETI (first year reward)
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
      // 21 000 000 * 0.026180339887498948482045868343656 = 549 787,13763747791812296323521678‬ ETI (first year reward)
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




contract EticaRelease is EticaToken {
  /* --------- PROD VALUES -------------
uint REWARD_INTERVAL = 7 days; // periods duration 7 jours
uint STAKING_DURATION = 28 days; // default stake duration 28 jours
uint ETICA_TO_BOSOM_RATIO = 1; // get 1 Bosom for each ETI staked
uint DEFAULT_VOTING_TIME = 21 days; // default voting duration 21 days
uint public DEFAULT_REVEALING_TIME = 7 days; // default revealing duration 7 days
     --------- PROD VALUES ------------- */

/* --------- TESTING VALUES -------------*/
uint public REWARD_INTERVAL = 1 minutes; // periods duration 7 jours
uint public STAKING_DURATION = 4 minutes; // default stake duration 28 jours
uint public ETICA_TO_BOSOM_RATIO = 1; // get 1 Bosom for each ETI staked
uint public DEFAULT_VOTING_TIME = 3 minutes; // default voting duration 21 days
uint public DEFAULT_REVEALING_TIME = 1 minutes; // default revealing duration 7 days
/* --------- TESTING VALUES -------------*/

uint public DISEASE_CREATION_AMOUNT = 100 * 10**uint(decimals); // 100 ETI amount to pay for creating a new disease. Necessary in order to avoid spam. Will create a function that periodically increase it in order to take into account inflation
uint public PROPOSAL_DEFAULT_VOTE = 10 * 10**uint(decimals); // 10 ETI amount to vote for creating a new proposal. Necessary in order to avoid spam. Will create a function that periodically increase it in order to take into account inflation


uint public APPROVAL_THRESHOLD = 5000; // threshold for proposal to be accepted. 5000 means 50.00 %, 6000 would mean 60.00%
uint public PERIODS_PER_THRESHOLD = 5; // number of Periods before readjusting APPROVAL_THRESHOLD
uint public SEVERITY_LEVEL = 4; // level of severity of the protocol, the higher the more slash to wrong voters
uint public PROPOSERS_INCREASER = 3; // the proposers should get more slashed than regular voters to avoid spam, the higher this var the more severe the protocol will be against bad proposers
uint public PROTOCOL_RATIO_TARGET = 7250; // 7250 means the Protocol has a goal of 72.50% proposals approved and 27.5% proposals rejected


struct Period{
    uint id;
    uint interval;
    uint curation_sum; // used for proposals weight system
    uint editor_sum; // used for proposals weight system
    uint total_voters; // Total nb of voters in this period
    uint reward_for_curation; // total ETI issued to be used as Period reward for Curation
    uint reward_for_editor; // total ETI issued to be used as Period reward for Editor
    uint forprops; // number of accepted proposals in this period
    uint againstprops; // number of rejected proposals in this period
}

  struct Stake{
      uint amount;
      uint startTime; // CREATION Time of the struct, doesnt represent the actual time when the stake STARTED as stakescsldt() can create consolidated Stakes with increased startTime
      uint endTime; // Time when the stake will be claimable
  }

// -----------  PROPOSALS STRUCTS  ------------  //

// general information of Proposal:
  struct Proposal{
      uint id;
      bytes32 proposed_release_hash; // Hash of "raw_release_hash + name of Disease"
      bytes32 disease_id;
      uint period_id;
      address proposer; // address of the proposer
      string title; // Title of the Proposal
      string description; // Description of the Proposal
  }

// main data of Proposal:
  struct ProposalData{

      uint starttime; // epoch time of the proposal
      uint endtime;  // voting limite
      uint finalized_time; // when first clmpropbyhash() was called
      ProposalStatus status; // Only updates once, when the voting process is over
      ProposalStatus prestatus; // Updates During voting process
      bool istie;  // will be initialized with value 0. if prop is tie it won't slash nor reward participants
      uint nbvoters;
      uint slashingratio; // solidity does not support float type. So will emulate float type by using uint
      uint forvotes;
      uint againstvotes;
      uint lastcuration_weight; // period curation weight of proposal
      uint lasteditor_weight; // period editor weight of proposal
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

  // -----------  PROPOSALS STRUCTS ------------  //

  // -----------  VOTES STRUCTS ----------------  //
  struct Vote{
    bytes32 proposal_hash; // proposed_release_hash of proposal
    bool approve;
    bool is_editor;
    uint amount;
    address voter; // address of the voter
    uint timestamp; // epoch time of the vote
    bool is_claimed; // keeps track of whether or not vote has been claimed to avoid double claim on same vote
  }

    struct Commit{
    uint amount;
    uint timestamp; // epoch time of the vote
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
mapping(bytes32 => uint) public diseasesbyIds; // get disease.index by giving its disease_hash: example: [leiojej757575ero] => [0]  where leiojej757575ero is disease_hash of a Disease
mapping(string => bytes32) private diseasesbyNames; // get disease.disease_hash by giving its name: example: ["name of a disease"] => [leiojej757575ero]  where leiojej757575ero is disease_hash of a Disease. Set visibility to private because mapping with strings as keys have issues when public visibility

// -----------  PROPOSALS MAPPINGS ------------  //
mapping(bytes32 => Proposal) public proposals;
uint public proposalsCounter;

mapping(bytes32 => ProposalData) public propsdatas;
mapping(bytes32 => ProposalIpfs) public propsipfs;
mapping(bytes32 => ProposalFreefield) public propsfreefields;
// -----------  PROPOSALS MAPPINGS ------------  //

// -----------  VOTES MAPPINGS ----------------  //
mapping(bytes32 => mapping(address => Vote)) public votes;
mapping(address => mapping(bytes32 => Commit)) public commits;
// -----------  VOTES MAPPINGS ----------------  //

mapping(address => uint) public bosoms;
mapping(address => mapping(uint => Stake)) public stakes;
mapping(address => uint) public stakesCounters; // keeps track of how many stakes for each user
mapping(address => uint) public stakesAmount; // keeps track of total amount of stakes for each user

// Blocked ETI amount, user has votes with this amount in process and can't retrieve this amount before the system knows if the user has to be slahed
mapping(address => uint) public blockedeticas;

// ---------- EVENTS ----------- //
event CreatedPeriod(uint period_id, uint interval);
event IssuedPeriod(uint period_id, uint periodreward, uint periodrwdcuration, uint periodrwdeditor);
event NewStake(address indexed staker, uint amount);
event StakeClaimed(address indexed staker, uint stakeidx);
event NewDisease(uint diseaseindex, string title, string description);
event NewProposal(bytes32 proposed_release_hash);
event VoteClaimed(address indexed voter, uint amount, bytes32 proposal_hash);
event NewCommit(bytes32 votehash);
event NewReveal(bytes32 votehash);
event NewSnap(uint stakeidx, uint amount);
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
period.reward_for_curation = uint((_periodsupply * PERIOD_CURATION_REWARD_RATIO).div(10**(11)));
period.reward_for_editor = uint((_periodsupply * PERIOD_EDITOR_REWARD_RATIO).div(10**(11)));


supply = supply + _periodsupply;
balances[address(this)] = balances[address(this)].add(_periodsupply);
PeriodsIssued[period.id] = _periodsupply;
PeriodsIssuedCounter = PeriodsIssuedCounter + 1;

emit IssuedPeriod(periodsCounter, _periodsupply, period.reward_for_curation, period.reward_for_editor);

return true;

}


// create a period
function newPeriod() internal {

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
    0x0, //_total_voters;
    0x0, //_reward_for_curation
    0x0, //_reward_for_editor
    0x0, // _forprops
    0x0 //_againstprops
  );

  // an interval cannot have 2 Periods
  IntervalsPeriods[_interval] = periodsCounter;
  IntervalsPeriodsCounter++;

  // issue ETI for this Period Reward
  issue(periodsCounter);


  //readjust APPROVAL_THRESHOLD every PERIODS_PER_THRESHOLD periods:
  if((periodsCounter - 1) % PERIODS_PER_THRESHOLD == 0 && periodsCounter > 1)
  {
    readjustThreshold();
  }

  emit CreatedPeriod(periodsCounter, _interval);
}

function readjustThreshold() internal {

uint _meanapproval = 0;
uint _totalfor = 0; // total of proposals accepetd
uint _totalagainst = 0; // total of proposals rejected


// calculate the mean approval rate (forprops / againstprops) of last PERIODS_PER_THRESHOLD Periods:
for(uint _periodidx = periodsCounter - PERIODS_PER_THRESHOLD; _periodidx <= periodsCounter - 1;  _periodidx++){
   _totalfor += periods[_periodidx].forprops;
   _totalagainst += periods[_periodidx].againstprops; 
}

  if(_totalfor + _totalagainst == 0){
   _meanapproval = 5000;
  }
  else{
   _meanapproval = uint(_totalfor.mul(10000).div(_totalfor + _totalagainst));
  }

// increase or decrease APPROVAL_THRESHOLD based on comparason between _meanapproval and PROTOCOL_RATIO_TARGET:

         // if there were not enough approvals:
         if( _meanapproval < PROTOCOL_RATIO_TARGET )
         {
           uint shortage_approvals_rate = (PROTOCOL_RATIO_TARGET.sub(_meanapproval));

           // require lower APPROVAL_THRESHOLD for next period:
           APPROVAL_THRESHOLD -= uint(((APPROVAL_THRESHOLD - 4500) * shortage_approvals_rate).div(10000));   // decrease by up to 100 % of (APPROVAL_THRESHOLD - 45)
         }else{
           uint excess_approvals_rate = uint((_meanapproval - PROTOCOL_RATIO_TARGET));

           // require higher APPROVAL_THRESHOLD for next period:
           APPROVAL_THRESHOLD += uint((10000 - APPROVAL_THRESHOLD) * excess_approvals_rate / 10000);   // increase by up to 100 % of (100 - APPROVAL_THRESHOLD)
         }


         if(APPROVAL_THRESHOLD < 4500) // high discouragement to vote against proposals
         {
           APPROVAL_THRESHOLD = 4500;
         }

         if(APPROVAL_THRESHOLD > 9900) // high discouragement to vote for proposals
         {
           APPROVAL_THRESHOLD = 9900;
         }

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



// ----  Get bosoms  ------  //

//bosomget(): Get bosoms and add Stake. Only contract is able to call this function:
function bosomget (address _staker, uint _amount) internal {

addStake(_staker, _amount);

uint newBosoms = _amount * ETICA_TO_BOSOM_RATIO;
bosoms[_staker] = bosoms[_staker].add(newBosoms);

}

// ----  Get bosoms  ------  //

// ----  add Stake ------  //

function addStake(address _staker, uint _amount) internal returns (bool success) {

    require(_amount > 0);
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

    require(_amount > 0);
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

// ----  add Stake ------  //

// ----  split Stake ------  //

function splitStake(address _staker, uint _amount, uint _startTime, uint _endTime) internal returns (bool success) {

    require(_amount > 0);
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

// ----  split Stake ------  //


// ----  Redeem a Stake ------  //
//stakeclmidx(): redeem a stake by its index
function stakeclmidx (uint _stakeidx) public {

  // we check that the stake exists
  require(_stakeidx > 0 && _stakeidx <= stakesCounters[msg.sender]);

  // we retrieve the stake
  Stake storage _stake = stakes[msg.sender][_stakeidx];

  // The stake must be over
  require(block.timestamp > _stake.endTime);

  // the amount to be unstaked must be less or equal to the amount of ETI currently marked as blocked in blockedeticas as they need to go through the clmpropbyhash before being unstaked !
  require(_stake.amount <= stakesAmount[msg.sender] - blockedeticas[msg.sender]);

  // transfer back ETI from contract to staker:
  balances[address(this)] = balances[address(this)].sub(_stake.amount);

  balances[msg.sender] = balances[msg.sender].add(_stake.amount);

  emit Transfer(address(this), msg.sender, _stake.amount);
  emit StakeClaimed(msg.sender, _stakeidx);

  // deletes the stake
  _deletestake(msg.sender, _stakeidx);

}

// ----  Redeem a Stake ------  //

// ----  Remove a Stake ------  //

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

// ----  Remove a Stake ------  //


// ----- Stakes consolidation  ----- //

// slashing function needs to loop trough stakes. Can create issues for claiming votes:
// The function stakescsldt() has been created to consolidate (gather) stakes when user has too much stakes
function stakescsldt(address _staker, uint _endTime, uint _min_limit, uint _maxidx) public {

// security to avoid blocking ETI by front end apps that could call function with too high _endTime:
require(_endTime < block.timestamp + 730 days); // _endTime cannot be more than two years ahead  

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
    else {
      // if _stakeidx > stakesCounters[msg.sender] it means the _deletestake() function has pushed the next stakes at the begining:
      _currentidx = _stakeidx - _nbdeletes; //Notice: initial stakesCounters[msg.sender] = stakesCounters[msg.sender] + _nbdeletes. 
      //So "_stackidx <= _maxidx <= initial stakesCounters[msg.sender]" ===> "_stakidx <= stakesCounters[msg.sender] + _nbdeletes" ===> "_stackidx - _nbdeletes <= stakesCounters[msg.sender]"
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

if (newAmount > 0){
// creates the new Stake
addConsolidation(msg.sender, newAmount, _endTime);
}

}

// ----- Stakes consolidation  ----- //

// ----- Stakes de-consolidation  ----- //

// this function is necessary because if user has a stake with huge amount and has blocked few ETI then he can't claim the Stake because
// stake.amount > StakesAmount - blockedeticas
function stakesnap(uint _stakeidx, uint _snapamount) public {

  require(_snapamount > 0);
  
  // we check that the stake exists
  require(_stakeidx > 0 && _stakeidx <= stakesCounters[msg.sender]);

  // we retrieve the stake
  Stake storage _stake = stakes[msg.sender][_stakeidx];


  // the stake.amount must be higher than _snapamount:
  require(_stake.amount > _snapamount);

  // calculate the amount of new stake:
  uint _restAmount = _stake.amount - _snapamount;
  
  // updates the stake amount:
  _stake.amount = _snapamount;


  // ----- creates a new stake with the rest -------- //
  stakesCounters[msg.sender] = stakesCounters[msg.sender] + 1;

  // store this stake in _staker's stakes with the index stakesCounters[_staker]
  stakes[msg.sender][stakesCounters[msg.sender]] = Stake(
      _restAmount, // stake amount
      block.timestamp, // startTime
      _stake.endTime // endTime
    );
  // ------ creates a new stake with the rest ------- //  

emit NewSnap(_stakeidx, _snapamount);

}

// ----- Stakes de-consolidation  ----- //


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
   if(diseasesbyIds[_diseasehash] != 0x0) revert();  //prevent the same disease from being created twice. The software manages diseases uniqueness based on their unique english name. Note that even the first disease will not have index of 0 thus should pass this check


   // store the Disease
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
  string memory old_release_hash, string memory grandparent_hash, string memory _firstfield, string memory _secondfield, string memory _thirdfield) public {

    //check if the disease exits
     require(diseasesbyIds[_diseasehash] > 0 && diseasesbyIds[_diseasehash] <= diseasesCounter);
     if(diseases[diseasesbyIds[_diseasehash]].disease_hash != _diseasehash) revert(); // second check not necessary but I decided to add it as the gas cost value for security is worth it


     bytes32 _proposed_release_hash = keccak256(abi.encode(raw_release_hash, _diseasehash));

     proposalsCounter = proposalsCounter + 1; // notice that first proposal will have the index of 1 thus not 0 !


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

       // Proposal freefields:
       ProposalFreefield storage proposalfree = propsfreefields[_proposed_release_hash];
       proposalfree.firstfield = _firstfield;
       proposalfree.secondfield = _secondfield;
       proposalfree.thirdfield = _thirdfield;


       //  Proposal Data:
       ProposalData storage proposaldata = propsdatas[_proposed_release_hash];
       proposaldata.status = ProposalStatus.Pending;
       proposaldata.istie = true;
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


    emit NewProposal(_proposed_release_hash);

}



 function defaultvote(bytes32 _proposed_release_hash) internal {

   require(bosoms[msg.sender] >= PROPOSAL_DEFAULT_VOTE); // this check is not mandatory as handled by safemath sub function: (bosoms[msg.sender].sub(PROPOSAL_DEFAULT_VOTE))

   //check if the proposal exists and that we get the right proposal:
   Proposal storage proposal = proposals[_proposed_release_hash];
   require(proposal.id > 0 && proposal.proposed_release_hash == _proposed_release_hash);


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
    vote.is_editor = true;
    vote.amount = PROPOSAL_DEFAULT_VOTE;
    vote.voter = msg.sender;
    vote.timestamp = block.timestamp;



      // UPDATE PROPOSAL:
      proposaldata.prestatus = ProposalStatus.Singlevoter;

 }


 function commitvote(uint _amount, bytes32 _votehash) public {

require(_amount > 0);

// only one commit
require (commits[msg.sender][_votehash].amount == 0);

 // Consume bosom:
 require(bosoms[msg.sender] >= _amount); // this check is not mandatory as handled by safemath sub function
 bosoms[msg.sender] = bosoms[msg.sender].sub(_amount);

 // Block Eticas in eticablkdtbl to prevent user from unstaking before eventual slash
 blockedeticas[msg.sender] = blockedeticas[msg.sender].add(_amount);

 // store _votehash in commits with _amount and current block.timestamp value:
 commits[msg.sender][_votehash].amount = _amount;
 commits[msg.sender][_votehash].timestamp = block.timestamp;

emit NewCommit(_votehash);

 }


 function revealvote(bytes32 _proposed_release_hash, bool _approved, uint _amount, string memory _vary) public {
 

// --- check commit --- //
bytes32 _votehash;
_votehash = keccak256(abi.encode(_proposed_release_hash, _approved, msg.sender, _vary));
emit NewReveal(_votehash);
require(commits[msg.sender][_votehash].amount > 0);
// --- check commit done --- //

//check if the proposal exists and that we get the right proposal:
Proposal storage proposal = proposals[_proposed_release_hash];
require(proposal.id > 0 && proposal.proposed_release_hash == _proposed_release_hash);


ProposalData storage proposaldata = propsdatas[_proposed_release_hash];

 // Verify commit was done within voting time:
 require( commits[msg.sender][_votehash].timestamp <= proposaldata.endtime);

 // Verify we are within revealing time:
 require( block.timestamp > proposaldata.endtime && block.timestamp <= proposaldata.endtime + DEFAULT_REVEALING_TIME);

 require(proposaldata.prestatus != ProposalStatus.Pending); // can vote for proposal only if default vote has changed prestatus of Proposal. Thus can vote only if default vote occured as supposed to

uint _old_proposal_curationweight = proposaldata.lastcuration_weight;
uint _old_proposal_editorweight = proposaldata.lasteditor_weight;


// get Period of Proposal:
Period storage period = periods[proposal.period_id];


// Check that vote does not already exist
// only allow one vote for each {raw_release_hash, voter} combinasion
bytes32 existing_vote = votes[proposal.proposed_release_hash][msg.sender].proposal_hash;
if(existing_vote != 0x0 || votes[proposal.proposed_release_hash][msg.sender].amount != 0) revert();  //prevent the same user from voting twice for same raw_release_hash. Double condition check for better security and slightly higher gas cost even though one would be enough !


 // store vote:
 Vote storage vote = votes[proposal.proposed_release_hash][msg.sender];
 vote.proposal_hash = proposal.proposed_release_hash;
 vote.approve = _approved;
 vote.is_editor = false;
 vote.amount = commits[msg.sender][_votehash].amount;
 vote.voter = msg.sender;
 vote.timestamp = block.timestamp;

 proposaldata.nbvoters = proposaldata.nbvoters + 1;

     // PROPOSAL VAR UPDATE
     if(_approved){
      proposaldata.forvotes = proposaldata.forvotes + commits[msg.sender][_votehash].amount;
     }
     else {
       proposaldata.againstvotes = proposaldata.againstvotes + commits[msg.sender][_votehash].amount;
     }


     // Determine slashing conditions
     bool _isapproved = false;
     bool _istie = false;
     uint totalVotes = proposaldata.forvotes + proposaldata.againstvotes;
     uint _forvotes_numerator = proposaldata.forvotes * 10000; // (newproposal_forvotes / totalVotes) will give a number between 0 and 1. Multiply by 10000 to store it as uint
     uint _ratio_slashing = 0;

     if ((_forvotes_numerator / totalVotes) > APPROVAL_THRESHOLD){
    _isapproved = true;
    }
    if ((_forvotes_numerator / totalVotes) == APPROVAL_THRESHOLD){
        _istie = true;
    }

    proposaldata.istie = _istie;

    if (_isapproved){
    _ratio_slashing = uint(((10000 - APPROVAL_THRESHOLD) * totalVotes).div(10000));
    _ratio_slashing = uint((proposaldata.againstvotes * 10000).div(_ratio_slashing));  
    proposaldata.slashingratio = uint(10000 - _ratio_slashing);
    }
    else{
    _ratio_slashing = uint((totalVotes * APPROVAL_THRESHOLD).div(10000));
    _ratio_slashing = uint((proposaldata.forvotes * 10000).div(_ratio_slashing));
    proposaldata.slashingratio = uint(10000 - _ratio_slashing);
    }

    // Make sure the slashing reward ratio is within expected range:
     require(proposaldata.slashingratio >=0 && proposaldata.slashingratio <= 10000);

        // updates period forvotes and againstvotes system
        ProposalStatus _newstatus = ProposalStatus.Rejected;
        if(_isapproved){
         _newstatus = ProposalStatus.Accepted;
        }

        if(proposaldata.prestatus == ProposalStatus.Singlevoter){

          if(_isapproved){
            period.forprops += 1;
          }
          else {
            period.againstprops += 1;
          }
        }
        // in this case the proposal becomes rejected after being accepted or becomes accepted after being rejected:
        else if(_newstatus != proposaldata.prestatus){

         if(_newstatus == ProposalStatus.Accepted){
          period.againstprops -= 1;
          period.forprops += 1;
         }
         // in this case proposal is necessarily Rejected:
         else {
          period.forprops -= 1;
          period.againstprops += 1;
         }

        }
        // updates period forvotes and againstvotes system done
        period.total_voters += 1;

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
             proposaldata.lastcuration_weight = proposaldata.forvotes;
             proposaldata.lasteditor_weight = proposaldata.forvotes;
             // Proposal approved, replace proposal curation and editor sum with forvotes
             period.curation_sum = period.curation_sum - _old_proposal_curationweight + proposaldata.lastcuration_weight;
             period.editor_sum = period.editor_sum - _old_proposal_editorweight + proposaldata.lasteditor_weight;
         }
         else{
             proposaldata.prestatus =  ProposalStatus.Rejected;
             proposaldata.lastcuration_weight = proposaldata.againstvotes;
             proposaldata.lasteditor_weight = 0;
             // Proposal rejected, replace proposal curation sum with againstvotes and remove proposal editor sum
             period.curation_sum = period.curation_sum - _old_proposal_curationweight + proposaldata.lastcuration_weight;
             period.editor_sum = period.editor_sum - _old_proposal_editorweight;
         }
         }
         

  }


  function clmpropbyhash(bytes32 _proposed_release_hash) public {

   //check if the proposal exists and that we get the right proposal:
   Proposal storage proposal = proposals[_proposed_release_hash];
   require(proposal.id > 0 && proposal.proposed_release_hash == _proposed_release_hash);


   ProposalData storage proposaldata = propsdatas[_proposed_release_hash];
   // Verify voting and revealing period is over
   require( block.timestamp > proposaldata.endtime + DEFAULT_REVEALING_TIME);

   
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

   // Check if Period is ready for claims or if it needs to wait more
   uint _min_intervals = uint((DEFAULT_VOTING_TIME + DEFAULT_REVEALING_TIME).div(REWARD_INTERVAL) + 1); // Minimum intervals before claimable
   require(_current_interval >= period.interval + _min_intervals); // Period not ready for claims yet. Need to wait more !

  // if status equals pending this is the first claim for this proposal
  if (proposaldata.status == ProposalStatus.Pending) {

  // SET proposal new status
  if (proposaldata.prestatus == ProposalStatus.Accepted) {
            proposaldata.status = ProposalStatus.Accepted;
  }
  else {
    proposaldata.status = ProposalStatus.Rejected;
  }

  proposaldata.finalized_time = block.timestamp;

  // NEW STATUS AFTER FIRST CLAIM DONE

  }


  // only slash and reward if prop is not tie:
  if (!proposaldata.istie) {
   
   // convert boolean to enum format for making comparasion with proposaldata.status possible:
   ProposalStatus voterChoice = ProposalStatus.Rejected;
   if(vote.approve){
     voterChoice = ProposalStatus.Accepted;
   }

   if(voterChoice != proposaldata.status) {
     // slash loosers: voter has voted wrongly and needs to be slashed
     uint _slashRemaining = vote.amount;
     uint _extraTimeInt = uint(STAKING_DURATION * SEVERITY_LEVEL * proposaldata.slashingratio / 10000);

     if(vote.is_editor){
     _extraTimeInt = uint(_extraTimeInt * PROPOSERS_INCREASER);
     }

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
   // get curation reward only if voter is not the proposer:
   if (!vote.is_editor){
   _reward_amount += (vote.amount * period.reward_for_curation) / (period.curation_sum);
   }

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
   }

  }   // end bracket if (proposaldata.istie not true)
  
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
