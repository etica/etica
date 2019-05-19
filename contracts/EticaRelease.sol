pragma solidity ^0.5.2;
// ----------------------------------------------------------------------------
//this ICO smart contract has been compiled and tested with the Solidity Version 0.5.2
//There are some minor changes comparing to ICO contract compiled with versions < 0.5.0
// ----------------------------------------------------------------------------


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
    // fixed inflation rate after etica supply has reached 21 Million
    uint public inflationrate;
    uint public  periodrewardtemp; // Amount of ETI issued per period during phase1

    // We don't want fake Satoshi again. Using it to prove founder's identity
    address public founder;
    string public foundermsgproof;

    mapping(address => uint) public balances;

    mapping(address => mapping(address => uint)) allowed;

    //allowed[0x1111....][0x22222...] = 100;

    // Mining system state variables
    uint public _totalMiningSupply;



     uint public latestDifficultyPeriodStarted;



    uint public epochCount;//number of 'blocks' mined


    uint public _BLOCKS_PER_READJUSTMENT = 1024;


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

    // Mining system state variables




    event Transfer(address indexed from, address indexed to, uint tokens);
    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
    event Mint(address indexed from, uint blockreward, uint epochCount, bytes32 newChallengeNumber);


    constructor() public{
      supply = 100 * (10**18); // initial supply equals 100 ETI
      balances[address(this)] = balances[address(this)].add(100 * (10**18)); // 100 ETI as the default contract balance. To avoid any issue that could arise from negative contract balance because of significant numbers approximations


      // PHASE 1 (before 21 Million ETI has been reached) -->
      // 10 500 000 ETI to be issued as periodrewardtemp for ETICA reward system
      // 10 500 000 ETI to be MINED


      // <--phase1--> periodrewardtemp:
      // fixed Etica issued per period (7 days) during phase1 (before 21 Million ETI has been reached)
      // The amount of reward will be twice of first rewards of phase 2
      // Calculation of first rewards of phase 2:
      // 21 000 000 * 0.26180339887498948482045868343656 = 549 787,13763747791812296323521678‬ ETI (first year reward)
      // 549 787,13763747791812296323521678‬ / 52.1429 = 10 543,854247413893706007207792754‬ ETI (first weeks reward of phase2)
      // 10 543,854247413893706007207792754‬ * 2 = 21087,708494827787412014415585507 ETI
      periodrewardtemp = 21087708494827787412014; // 21087,708494827787412014415585507 ETI per period (7 days) will take about 9,5491502812526287948853291408588 years to reach 10 500 000 ETI


      // <--phase1--> mining:
      _totalMiningSupply = 10500000 * 10**uint(decimals);

      if(locked) revert();
      locked = true;

      tokensMinted = 0;


      // The amount of etica mined per 7 days will be twice of first rewards of phase 2
      // Calculation of first rewards of phase 2:
      // 21 000 000 * 0.26180339887498948482045868343656 = 549 787,13763747791812296323521678‬ ETI (first year reward)
      // 549 787,13763747791812296323521678‬ / 52.1429 = 10 543,854247413893706007207792754‬ ETI (first weeks reward of phase2)
      // 10 543,854247413893706007207792754‬ * 2 = 21087,708494827787412014415585507 ETI per 7 days
      // 21087,708494827787412014415585507 ETI per 7 days = 20,920345728995820845252396414193‬ ETI per block (10 minutes)
      blockreward = 20920345728995820845;

      miningTarget = _MAXIMUM_TARGET;

      latestDifficultyPeriodStarted = block.number;

      _startNewMiningEpoch();

      // PHASE 1 <--

      // --> PHASE 2
      // Golden number power 2: 1,6180339887498948482045868343656 * 1,6180339887498948482045868343656 = 2.6180339887498948482045868343656;
      inflationrate = 26180339887498948482045868343656; // (need to multiple by 10^(-33) to get 0.026180339887498948482045868343656);

       // PHASE 2 <--


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

     //readjust the target by 5 percent
     function _reAdjustDifficulty() internal {


         uint ethBlocksSinceLastDifficultyPeriod = block.number - latestDifficultyPeriodStarted;
         //assume 360 ethereum blocks per hour

         //we want miners to spend 10 minutes to mine each 'block', about 60 ethereum blocks = one Mining system epoch
         uint epochsMined = _BLOCKS_PER_READJUSTMENT; //256

         uint targetEthBlocksPerDiffPeriod = epochsMined * 60; //should be 60 times slower than ethereum

         //if there were less eth blocks passed in time than expected
         if( ethBlocksSinceLastDifficultyPeriod < targetEthBlocksPerDiffPeriod )
         {
           uint excess_block_pct = (targetEthBlocksPerDiffPeriod.mul(100)).div( ethBlocksSinceLastDifficultyPeriod );

           uint excess_block_pct_extra = excess_block_pct.sub(100).limitLessThan(1000);
           // If there were 5% more blocks mined than expected then this is 5.  If there were 100% more blocks mined than expected then this is 100.

           //make it harder
           miningTarget = miningTarget.sub(miningTarget.div(2000).mul(excess_block_pct_extra));   //by up to 50 %
         }else{
           uint shortage_block_pct = (ethBlocksSinceLastDifficultyPeriod.mul(100)).div( targetEthBlocksPerDiffPeriod );

           uint shortage_block_pct_extra = shortage_block_pct.sub(100).limitLessThan(1000); //always between 0 and 1000

           //make it easier
           miningTarget = miningTarget.add(miningTarget.div(2000).mul(shortage_block_pct_extra));   //by up to 50 %
         }



         latestDifficultyPeriodStarted = block.number;

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
  /* --------- PROD -------------
uint TESTING_STARTING_BLOCK_NUMBER = 7739267; // used only for testing as ganache starts at block number 0
uint REWARD_INTERVAL = 42000; // periods duration (in number of blocks) 42000 blocks = 7 jours (6000 blocks per day)
uint STAKING_DURATION = 168000; // default stake duration (in number of blocks) 168000 blocks = 28 jours (6000 blocks per day)
uint ETICA_TO_BOSOM_RATIO = 1; //
     --------- PROD ------------- */


uint TESTING_STARTING_BLOCK_NUMBER = 7739267; // used only for testing as ganache starts at block number 0
uint REWARD_INTERVAL = 42; // periods duration (in number of blocks) 42000 blocks = 7 jours (6000 blocks per day)
uint STAKING_DURATION = 168; // default stake duration (in number of blocks) 168000 blocks = 28 jours (6000 blocks per day)
uint ETICA_TO_BOSOM_RATIO = 1; //


struct Period{
    uint id;
    uint interval;
    uint curation_sum;
    uint editor_sum;
    uint total_voters; // TOTAL nb of voters in this period
}

  struct Stake{
      uint amount;
      uint startBlock;
      uint endBlock;
  }

mapping(uint => Period) public periods;
uint public periodsCounter;
mapping(uint => uint) public PeriodsIssued; // keeps track of which periods have already issued ETI
uint public PeriodsIssuedCounter;
mapping(uint => uint) public IntervalsPeriods; // keeps track of which intervals have already a period
uint public IntervalsPeriodsCounter;
mapping(address => uint) public bosoms;
mapping(address => Stake[]) public stakes;
// stakes ----> slashing function will need to loop trough stakes. Can create issues for claiming votes:
// will create a function to gather stakes when user has to much stakes.
// The function will take a completion_time as parameter and will loop trough 50 indexes and will put all stakes with
// lower completion_time into a  single new stake with parameter completion_time

event CreatedPeriod(uint period_id, uint interval);
event IssuedPeriod(uint period_id, uint periodreward);
event NewStake(address indexed staker, uint amount);
event StakeClaimed(uint stakeidx);



// -------------  Reward system functions ---------------- //

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
 uint _rate = uint(inflationrate / 10**(33));
 _periodsupply = supply * _rate;
}
// era 1 (before 21 000 000 ETI has been reached)
else {
  _periodsupply = periodrewardtemp;
}

supply = supply + _periodsupply;
balances[address(this)] = balances[address(this)].add(_periodsupply);
PeriodsIssued[period.id] = _periodsupply;
PeriodsIssuedCounter = PeriodsIssuedCounter + 1;

emit IssuedPeriod(periodsCounter, _periodsupply);

return true;

}

// --- WARNING this function should be internal, will be called by propose proposal function
// let public for testing only
// create a period
function newPeriod() public {

  uint _interval = uint((block.number + TESTING_STARTING_BLOCK_NUMBER).div(REWARD_INTERVAL));

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
    0x0 //_total_voters; // TOTAL nb of voters in this period
  );

  // an interval cannot have 2 Periods
  IntervalsPeriods[_interval] = periodsCounter;
  IntervalsPeriodsCounter++;

  // issue ETI for this Period Reward
  issue(periodsCounter);

  emit CreatedPeriod(periodsCounter, _interval);
}




// -------------  Reward system functions ---------------- //


// ------- STAKING ---------- //
// Stake etica in exchange for bosom
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

// Only contract must be able to call this function:
function bosomget (address _staker, uint _amount) internal {

addStake(_staker, _amount);

uint newBosoms = _amount * ETICA_TO_BOSOM_RATIO;
bosoms[_staker] = bosoms[_staker].add(newBosoms);

}

function addStake(address _staker, uint _amount) internal returns (bool success) {
    Stake memory currentStake;

    currentStake.amount = _amount;
    currentStake.startBlock = block.number;
    currentStake.endBlock = block.number + STAKING_DURATION;

    stakes[_staker].push(currentStake);

    emit NewStake(_staker, _amount);

    return true;
}

// ----  Get bosoms and add Stake ------  //


// ----  Redeem a Stake ------  //

function stakeclmidx (uint _stakeidx) public {
  require(_stakeidx >= 0);

  Stake storage _stake = stakes[msg.sender][_stakeidx];

  // See if the stake is over
  require(block.number > _stake.endBlock);

  require(_stake.amount > 0);

  // transfer back ETI from contract to staker:
  balances[address(this)] = balances[address(this)].sub(_stake.amount);

  balances[msg.sender] = balances[msg.sender].add(_stake.amount);

  emit Transfer(address(this), msg.sender, _stake.amount);
  emit StakeClaimed(_stakeidx);

  // deletes the stake
  _deletestake(msg.sender, _stakeidx);

}

function _deletestake(address _staker,uint index) internal {
  Stake[] storage array = stakes[_staker];
  require(index < array.length);
  array[index] = array[array.length-1];
  delete array[array.length-1];
  array.length--;
}
// ----  Redeem a Stake ------  //





// ------- STAKING ---------- //

// get boms balance of user:
function bosomsOf(address tokenOwner) public view returns (uint _bosoms){
     return bosoms[tokenOwner];
 }


}
