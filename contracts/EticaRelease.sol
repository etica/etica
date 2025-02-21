pragma solidity ^0.8.22;
import { UD60x18, ud } from "@prb/math/src/UD60x18.sol";

/*
ETICA: a type1 civilization neutral protocol for medical research
KEVIN WAD
*/

/*
MIT License
Copyright © 26/08/2019, KEVIN WAD

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

The Software is provided “as is”, without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and noninfringement. In no event shall the authors or copyright holders be liable for any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with the software or the use or other dealings in the Software.
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



abstract contract ERC20Interface {
    function totalSupply() public view virtual returns (uint);
    function balanceOf(address tokenOwner) public view virtual returns (uint balance);
    function transfer(address to, uint tokens) public virtual returns (bool success);


    function allowance(address tokenOwner, address spender) public view virtual returns (uint remaining);
    function approve(address spender, uint tokens) public virtual returns (bool success);
    function transferFrom(address from, address to, uint tokens) public virtual returns (bool success);

    event Transfer(address indexed from, address indexed to, uint tokens);
    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
}



contract EticaToken is ERC20Interface{

    using SafeMath for uint;
    using SafeMath for uint256;
    using ExtendedMath for uint;

    string public name = "Etica";
    string public symbol = "ETI";
    uint public decimals = 18;

    uint public supply;
    uint public inflationrate; // fixed inflation rate of phase2 (after Etica supply has reached 21 Million ETI)
    uint public  periodrewardtemp; // Amount of ETI issued per period during phase1 (before Etica supply has reached 21 Million ETI)

    uint public PERIOD_CURATION_REWARD_RATIO = 38196601125; // 38.196601125% of period reward will be used as curation reward
    uint public PERIOD_EDITOR_REWARD_RATIO = 61803398875; // 61.803398875% of period reward will be used as editor reward

    uint public UNRECOVERABLE_ETI;

    // Etica is a neutral censorship resistant protocol for open source medical research without intellectual property
    string public constant initiatormsg = "This smart contract is running the Aegis Hardfork, Etica v5. Discovering our best Futures. No Intellectual Property, All proposals are made under the license Creative Commons Attribution 4.0 International (CC BY 4.0).";

    mapping(address => uint) public balances;

    mapping(address => mapping(address => uint)) allowed;

   

    // ----------- Mining system state variables ------------ //
    uint public _totalMiningSupply;



     uint public latestDifficultyPeriodStarted;



    uint public epochCount; //number of 'blocks' mined


    uint public _BLOCKS_PER_READJUSTMENT = 2016;


    //a little number
    uint public  _MINIMUM_TARGET = 2**2;


    //a big number is easier ; just find a solution that is smaller
    //uint public  _MAXIMUM_TARGET = 2**224;  bitcoin uses 224
    //uint public  _MAXIMUM_TARGET = 2**242; // used for tests 243 much faster, 242 seems to be the limit where mining gets much harder
    uint public  _MAXIMUM_TARGET = 2**224; // used for prod


    uint public miningTarget;

    bytes32 public challengeNumber;   //generate a new one when a new reward is minted


    uint public blockreward;


    address public lastRewardTo;
    uint public lastRewardEthBlockNumber;


    mapping(bytes32 => bytes32) solutionForChallenge;

    uint public tokensMinted;

    bytes32 RANDOMHASH;

    // ----------- Mining system state variables ------------ //




    //event Transfer(address indexed from, address indexed to, uint tokens);
    //event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
    event Mint(address indexed from, uint blockreward, uint epochCount, bytes32 newChallengeNumber);


    constructor() public{
      supply = 100 * (10**18); // initial supply equals 100 ETI
      balances[address(this)] = balances[address(this)].add(100 * (10**18)); // 100 ETI as the default contract balance.


    // ------------ PHASE 1 (before 21 Million ETI has been reached) -------------- //
      
      /* Phase 1 will last about 10 years:
      --> 11 550 000 ETI to be distributed through MINING as block reward
      --> 9 450 000 ETI to be issued during phase 1 as periodrewardtemp for ETICA reward system
      

      Phase1 is divided between 10 eras:
      Each Era will allocate 2 100 000 ETI between mining reward and the staking system reward.
      Each era is supposed to last about a year but can vary depending on hashrate.
      Era1: 90% ETI to mining and 10% ETI to Staking  |  Era2: 80% ETI to mining and 20% ETI to Staking
      Era3: 70% ETI to mining and 30% ETI to Staking  |  Era4: 60% ETI to mining and 40% ETI to Staking
      Era5: 50% ETI to mining and 50% ETI to Staking  |  Era6: 50% ETI to mining and 50% ETI to Staking
      Era7: 50% ETI to mining and 50% ETI to Staking  |  Era8: 50% ETI to mining and 50% ETI to Staking
      Era9: 50% ETI to mining and 50% ETI to Staking  |  Era10: 50% ETI to mining and 50% ETI to Staking
      Era1: 1 890 000 ETI as mining reward and 210 000 ETI as Staking reward
      Era2: 1 680 000 ETI as mining reward and 420 000 ETI as Staking reward
      Era3: 1 470 000 ETI as mining reward and 630 000 ETI as Staking reward 
      Era4: 1 260 000 ETI as mining reward and 840 000 ETI as Staking reward
      From Era5 to era10: 1 050 000 ETI as mining reward and 1 050 000 ETI as Staking reward
      */

      // --- STAKING REWARD --- //
       // periodrewardtemp: It is the temporary ETI issued per period (7 days) as reward of Etica System during phase 1. (Will be replaced by dynamic inflation of golden number at phase 2)
         // Calculation of initial periodrewardtemp:
         // 210 000 / 52.1429 = 4027.3939500871643119; ETI per week
      periodrewardtemp = 4027393950087164311900; // 4027.393950087164311900 ETI per period (7 days) for era1
      // --- STAKING REWARD --- //

      // --- MINING REWARD --- //
      _totalMiningSupply = 11550000 * 10**uint(decimals);


      tokensMinted = 0;

      // Calculation of initial blockreward:
      // 1 890 000 / 52.1429 = 36246.5455507844788073; ETI per week
      // amounts to 5178.0779358263541153286 ETI per day;
      // amounts to 215.7532473260980881386917 ETI per hour;
      // amounts to 35.9588745543496813564486167 ETI per block for era1 of phase1;
      blockreward = 35958874554349681356;

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


       //The creator gets nothing! The only way to earn Etica is to mine it or earn it as protocol reward
       //balances[creator] = _totalMiningSupply;
       //Transfer(address(0), creator, _totalMiningSupply);
    }


    function allowance(address tokenOwner, address spender) view public override returns(uint){
        return allowed[tokenOwner][spender];
    }


    //approve allowance
    function approve(address spender, uint tokens) public virtual override returns(bool){
        require(balances[msg.sender] >= tokens);
        require(tokens > 0);

        allowed[msg.sender][spender] = tokens;
        emit Approval(msg.sender, spender, tokens);
        return true;
    }

    //transfer tokens from the  owner account to the account that calls the function
    function transferFrom(address from, address to, uint tokens) public virtual override returns(bool){

      balances[from] = balances[from].sub(tokens);

      allowed[from][msg.sender] = allowed[from][msg.sender].sub(tokens);

      balances[to] = balances[to].add(tokens);

      emit Transfer(from, to, tokens);

      return true;
    }

    function totalSupply() public view override returns (uint){
        return supply;
    }

    function accessibleSupply() public view returns (uint){
        return supply.sub(UNRECOVERABLE_ETI);
    }

    function balanceOf(address tokenOwner) public view override returns (uint balance){
         return balances[tokenOwner];
     }


    function transfer(address to, uint tokens) public override returns (bool success){
         require(tokens > 0);

         balances[msg.sender] = balances[msg.sender].sub(tokens);

         balances[to] = balances[to].add(tokens);

         emit Transfer(msg.sender, to, tokens);

         return true;
     }


     // -------------  Mining system functions ---------------- //

         function mint(uint256 nonce, bytes32 challenge_digest) public returns (bool success) {

            // replaced by mintrandomX() since EticaV3
            return false;

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
       challengeNumber = blockhash(block.number.sub(1));
       challengeNumber = keccak256(abi.encode(challengeNumber, RANDOMHASH, epochCount)); // updates challengeNumber with merged mining protection

     }




     //readjust the target with same rules as bitcoin
     function _reAdjustDifficulty() internal {

         uint _oldtarget = miningTarget;

          // should get as close as possible to (2016 * 10 minutes) seconds => 1 209 600 seconds
         uint ethTimeSinceLastDifficultyPeriod = block.timestamp.sub(latestDifficultyPeriodStarted);      

         //we want miners to spend 10 minutes to mine each 'block'
         uint targetTimePerDiffPeriod = _BLOCKS_PER_READJUSTMENT.mul(10 minutes); //Target is 1 209 600 seconds. (2016 * 10 minutes) seconds to mine _BLOCKS_PER_READJUSTMENT blocks of ETI.

         //if there were less ethereum seconds-timestamp than expected, make it harder
         if( ethTimeSinceLastDifficultyPeriod < targetTimePerDiffPeriod )
         {

              uint denom = targetTimePerDiffPeriod.mul(1000).div(ethTimeSinceLastDifficultyPeriod);

              if(denom > 4000){
                  denom = 4000;
                }

              // New Mining Difficulty = Previous Mining Difficulty * (Time To Mine Last 2016 blocks / 1 209 600 seconds)  
              // Prevent underflow, (necessary since now _MAXIMUM_TARGET was set to max uint value)
              if (miningTarget < _MAXIMUM_TARGET.div(1000)) {
                  miningTarget = miningTarget.mul(1000).div(denom);
              } else {
                  miningTarget = _MAXIMUM_TARGET.div(denom);
              }

              // extra security (unecessary but we never know) the maximum factor of 4 will be applied as in bitcoin
              if(miningTarget < _oldtarget.div(4)){
                //make it harder
                miningTarget = _oldtarget.div(4);
              }

         }else{

                uint coeff = ethTimeSinceLastDifficultyPeriod.mul(1000).div(targetTimePerDiffPeriod);

                if(coeff > 4000){
                  coeff = 4000;
                }

                // New Mining Difficulty = Previous Mining Difficulty * (Time To Mine Last 2016 blocks / 1 209 600 seconds)
                // Prevent overflow, (necessary since now _MAXIMUM_TARGET was set to max uint value)
                if (miningTarget <= _MAXIMUM_TARGET.div(coeff)) {
                    miningTarget = miningTarget.mul(coeff).div(1000);
                } else {
                    miningTarget = _MAXIMUM_TARGET;
                }

                // extra security (unecessary but we never know)
                // the maximum factor of 4 will be applied as in bitcoin
                // Check for potential overflow before multiplication _oldtarget.mul(4) since _oldtarget can contain max solifdity uint value
                if (_oldtarget <= type(uint256).max.div(4)) {
                if (miningTarget > _oldtarget.mul(4)) {
                     miningTarget = _oldtarget.mul(4);
                    }
                }

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


    //mining reward only if the protocol didnt reach the max ETI supply that can be ever mined: 
    function getMiningReward() public view returns (uint) {
         if(tokensMinted <= _totalMiningSupply){
          return blockreward;
         }
         else {
          return 0;
         }
         
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

receive() external payable {

    revert();

}

}




contract EticaRelease is EticaToken {

using SafeMath for uint256;

  /* --------- PROD VALUES -------------  */
uint public REWARD_INTERVAL = 7 days; // periods duration 7 jours
uint public STAKING_DURATION = 28 days; // default stake duration 28 jours
uint public DEFAULT_VOTING_TIME = 21 days; // default voting duration 21 days
uint public DEFAULT_REVEALING_TIME = 7 days; // default revealing duration 7 days
    /* --------- PROD VALUES ------------- */

/* --------- TESTING VALUES -------------
uint public REWARD_INTERVAL = 1 minutes; // periods duration 7 jours
uint public STAKING_DURATION = 4 minutes; // default stake duration 28 jours
uint public DEFAULT_VOTING_TIME = 3 minutes; // default voting duration 21 days
uint public DEFAULT_REVEALING_TIME = 1 minutes; // default revealing duration 7 days
 --------- TESTING VALUES -------------*/

uint public DISEASE_CREATION_AMOUNT = 100 * 10**uint(decimals); // 100 ETI amount to pay for creating a new disease. Necessary in order to avoid spam. Will create a function that periodically increase it in order to take into account inflation
uint public PROPOSAL_DEFAULT_VOTE = 10 * 10**uint(decimals); // 10 ETI amount to vote for creating a new proposal. Necessary in order to avoid spam. Will create a function that periodically increase it in order to take into account inflation


uint public APPROVAL_THRESHOLD = 5000; // threshold for proposal to be accepted. 5000 means 50.00 %, 6000 would mean 60.00%
uint public PERIODS_PER_THRESHOLD = 5; // number of Periods before readjusting APPROVAL_THRESHOLD
uint public SEVERITY_LEVEL = 1; // level of severity of the protocol, the higher the more slash to wrong voters
uint public PROPOSERS_INCREASER = 1; // the proposers should get more slashed than regular voters to avoid spam, the higher this var the more severe the protocol will be against bad proposers
uint public PROTOCOL_RATIO_TARGET = 6180; // 6180 means the Protocol has a goal of 61.80% proposals approved and 38.2% proposals rejected
uint public LAST_PERIOD_COST_UPDATE = 0;


struct Period{
    uint id;
    uint interval;
    uint curation_sum; // used for proposals weight system
    uint editor_sum; // used for proposals weight system
    uint reward_for_curation; // total ETI issued to be used as Period reward for Curation
    uint reward_for_editor; // total ETI issued to be used as Period reward for Editor
    uint forprops; // number of accepted proposals in this period
    uint againstprops; // number of rejected proposals in this period
}

  struct Stake{
      uint amount;
      uint endTime; // Time when the stake will be claimable
  }

// -----------  PROPOSALS STRUCTS  ------------  //

// general information of Proposal:
  struct Proposal{
      uint id;
      bytes32 proposed_release_hash; // Hash of "raw_release_hash + name of Disease"
      bytes32 disease_id;
      uint period_id;
      uint chunk_id;
      address proposer; // address of the proposer
      string title; // Title of the Proposal
      string description; // Description of the Proposal
      string freefield;
      string raw_release_hash;
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
      uint approvalthreshold; // proposal approvalthreshold
  }

  // -----------  PROPOSALS STRUCTS ------------  //

    // -----------  CHUNKS STRUCTS ------------  //

    struct Chunk{
    uint id;
    bytes32 diseaseid; // hash of the disease
    uint idx;
    string title;
    string desc;
  }

  // -----------  CHUNKS STRUCTS ------------  //

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

mapping(bytes32 => mapping(uint => bytes32)) public diseaseproposals; // mapping of mapping of all proposals for a disease
mapping(bytes32 => uint) public diseaseProposalsCounter; // keeps track of how many proposals for each disease

// -----------  PROPOSALS MAPPINGS ------------  //
mapping(bytes32 => Proposal) public proposals;
mapping(uint => bytes32) public proposalsbyIndex; // get proposal.proposed_release_hash by giving its id (index): example: [2] => [huhihgfytoouhi]  where huhihgfytoouhi is proposed_release_hash of a Proposal
uint public proposalsCounter;

mapping(bytes32 => ProposalData) public propsdatas;
// -----------  PROPOSALS MAPPINGS ------------  //

// -----------  CHUNKS MAPPINGS ----------------  //
mapping(uint => Chunk) public chunks;
uint public chunksCounter;
mapping(bytes32 => mapping(uint => uint)) public diseasechunks; // chunks of a disease
mapping(uint => mapping(uint => bytes32)) public chunkproposals; // proposals of a chunk
mapping(bytes32 => uint) public diseaseChunksCounter; // keeps track of how many chunks for each disease
mapping(uint => uint) public chunkProposalsCounter; // keeps track of how many proposals for each chunk
// -----------  CHUNKS MAPPINGS ----------------  //

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
event CreatedPeriod(uint indexed period_id, uint interval);
event NewDisease(uint indexed diseaseindex, string title);
event NewProposal(bytes32 proposed_release_hash, address indexed _proposer, bytes32 indexed diseasehash, uint indexed chunkid);
event NewChunk(uint indexed chunkid, bytes32 indexed diseasehash);
event RewardClaimed(address indexed voter, uint amount, bytes32 proposal_hash);
event NewFee(address indexed voter, uint fee, bytes32 proposal_hash);
event NewSlash(address indexed voter, uint amount, bytes32 proposal_hash, uint duration);
event NewCommit(address indexed _voter, bytes32 votehash, uint amount);
event NewReveal(address indexed _voter, bytes32 indexed _proposal, uint amount);
event NewStake(address indexed staker, uint amount);
event StakeClaimed(address indexed staker, uint stakeamount);
event NewStakescsldt(address indexed staker, uint endtime, uint minlimit);
event NewStakesnap(address indexed staker, uint snapamount);
event TieClaimed(address indexed voter, bytes32 proposal_hash);
// ----------- EVENTS ---------- //

// WARNING NEW STORAGE VARIABLES V2 //
  
  // DO NOT INSERT THESE VARIABLES BEFORE OLDER VARIABLES, 
  // OTHERWISE WOULD CREATE STORAGE COLLISION:

  // -----------  Quadratic VOTES amount STRUCTS ----------------  //
  struct Qamount{
    uint amount;
  }
// -----------  QOTES MAPPINGS ----------------  //
mapping(address => mapping(bytes32 => Qamount)) public qamounts;
bool public UPDATEDV2 = false;
uint public DEFAULT_EXTRA_TIME = 7 days; // 7 days slash penalty for recover commits on proposals without voters

event NewRecover(address indexed _voter, bytes32 indexed _proposal, uint amount);


// WARNING NEW STORAGE VARIABLES V2 //

// WARNING NEW STORAGE VARIABLES V3 //

// DO NOT INSERT THESE VARIABLES BEFORE OLDER VARIABLES, 
// OTHERWISE WOULD CREATE STORAGE COLLISION:
bool public UPDATEDV3 = false;
mapping(bytes32 => mapping(bytes32 => bytes32)) public randomxSealSolutions; // randomxSealSolutions['challengeNumber']['mineraddress'] = validatedrandomXsolutionDiggest where validatedrandomXsolutionDiggest is a Keccak256 hash of (validatedrandomXsolution, difficulty)
bytes public randomxBlob;
bytes public randomxSeedhash;   //generate a new randomxSeedhash every SEEDHASH_EPOCH_BLOCKS, should always be size bytes32 but use bytes in case randomX changes seedhash size in the future
uint public SEEDHASH_EPOCH_BLOCKS = 410; // Adjusts randomxSeedhash about every 210 days (410/144) = 2.8 days
bytes32 public randomxBlobfirstpart; // first 32bytes of randomxBlob, used by Go process to verify nonce inputs

// WARNING NEW STORAGE VARIABLES V3 //

// WARNING NEW STORAGE VARIABLES V4 //
// OTHERWISE WOULD CREATE STORAGE COLLISION:
bool public UPDATEDV4 = false;
mapping(address => bool) public networkGuardAddresses; // Not used anymore, was introduced by in Persuance Hardfork in emergency exchange address blocking

// WARNING NEW STORAGE VARIABLES V4 //

// WARNING NEW STORAGE VARIABLES V5 //
bool public UPDATEDV5 = false;
uint public researchMinted = 0;

// WARNING NEW STORAGE VARIABLES V5 //


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

        // GUARDIAN HARDFORK TOKENOMICS, WITH ETI HALVINGS:
        // RESEARCH REWARDS HALVINGS
        if (tokensMinted <= 1890000 * 10**uint(decimals)) {
                // The research Year 1 duration was based on mining supply
                // Year 1: Initial block reward and research reward. 
                // Total issuance/year: 2.1M
                // Mining: 1,890,000 ETI/year Research: 210,000 ETI/year
            _periodsupply = 4027393950087164311900; // 4027.3939500871643119 ETI per week
        }
        else if (researchMinted < 1470000 * 10**uint(decimals)) {
                // Year 2-4: Adjusted block reward and research reward. 
                // Total issuance/year: 2.1M
                // Mining: 1,680,000 ETI/year Research: 420,000 ETI/year
                // 1470000 is the total research issuance/year for year 1 to year 4
                // 1470000 = 210000 + 420000 * 3
            _periodsupply = 8054787900174328623800; // 8054.7879001743286238 ETI per week
        }
        else if (researchMinted < 2550000 * 10**uint(decimals)) {
                // Year 4-8: First Research Halving
                // 270,000 ETI/year for research
                // First Halving: 2026-2030.
                // Total issuance/year: 1.35M
                // Mining: 1,080,000 ETI/year Research: 270,000 ETI/year
                // 2550000 is the total research issuance/year up to year 8
                // 2550000 = 1470000 + 270000 * 4

            _periodsupply = 5178077935826354115300; // 5178.0779358263541153 ETI per week
        }
        else if (researchMinted < 3090000 * 10**uint(decimals)) {
                // Second Research Halving
                // 135,000 ETI/year for research
                // Second Halving: 2030-2034
                // Total issuance/year: 675k ETI/year
                // Mining: 540,000 ETI/year Research: 135,000 ETI/year
                // 2550000 is the total research issuance/year up to year 8
                // 3090000 = 2550000 + 135000 * 4
                _periodsupply = 2589038967913177057700; // 2589.0389679131770577 ETI per week

        }
        else if (researchMinted < 3360000 * 10**uint(decimals)) {
                // Third Research Halving
                // 67,500 ETI/year for research
                // Third Halving: 2034-2038
                // Total issuance/year: 337.5k ETI/year
                // Mining: 270,000 ETI/year Research: 67,500 ETI/year
                // 3090000 is the total research issuance/year up to year 8
                // 3360000 = 3090000 + 67500 * 4
            _periodsupply = 1294519483956588528800; // 1294.5194839565885288 ETI per week
        }
        else {
            // Final Research Phase: 1% annual inflation for research (95% of total inflation)
            uint scaledSupply = supply.mul(10000);
            uint annualInflationScaled = scaledSupply.div(100);
            _periodsupply = (annualInflationScaled.mul(95).div(100)).div(521429);
        }

        // Update research tokens minted
        periodrewardtemp = _periodsupply;
        researchMinted = researchMinted.add(_periodsupply);



// update Period Reward:
period.reward_for_curation = uint((_periodsupply.mul(PERIOD_CURATION_REWARD_RATIO)).div(10**(11)));
period.reward_for_editor = uint((_periodsupply.mul(PERIOD_EDITOR_REWARD_RATIO)).div(10**(11)));


supply = supply.add(_periodsupply);
balances[address(this)] = balances[address(this)].add(_periodsupply);
PeriodsIssued[period.id] = _periodsupply;
PeriodsIssuedCounter = PeriodsIssuedCounter.add(1);

return true;

}


// create a period
function newPeriod() internal {

  uint _interval = uint((block.timestamp).div(REWARD_INTERVAL));

  //only allow one period for each interval
  uint rwd = IntervalsPeriods[_interval];
  if(rwd != 0x0) revert();  //prevent the same interval from having 2 periods


  periodsCounter = periodsCounter.add(1);

  // store this interval period
  periods[periodsCounter] = Period(
    periodsCounter,
    _interval,
    0x0, //_curation_sum
    0x0, //_editor_sum
    0x0, //_reward_for_curation
    0x0, //_reward_for_editor
    0x0, // _forprops
    0x0 //_againstprops
  );

  // an interval cannot have 2 Periods
  IntervalsPeriods[_interval] = periodsCounter;
  IntervalsPeriodsCounter = IntervalsPeriodsCounter.add(1);

  // issue ETI for this Period Reward
  issue(periodsCounter);


  //readjust APPROVAL_THRESHOLD every PERIODS_PER_THRESHOLD periods:
  if((periodsCounter.sub(1)) % PERIODS_PER_THRESHOLD == 0 && periodsCounter > 1)
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
for(uint _periodidx = periodsCounter.sub(PERIODS_PER_THRESHOLD); _periodidx <= periodsCounter.sub(1);  _periodidx++){
   _totalfor = _totalfor.add(periods[_periodidx].forprops);
   _totalagainst = _totalagainst.add(periods[_periodidx].againstprops); 
}

  if(_totalfor.add(_totalagainst) == 0){
   _meanapproval = 5000;
  }
  else{
   _meanapproval = uint(_totalfor.mul(10000).div(_totalfor.add(_totalagainst)));
  }

// increase or decrease APPROVAL_THRESHOLD based on comparason between _meanapproval and PROTOCOL_RATIO_TARGET:

         // if there were not enough approvals:
         if( _meanapproval < PROTOCOL_RATIO_TARGET )
         {
           uint shortage_approvals_rate = (PROTOCOL_RATIO_TARGET.sub(_meanapproval));

           // require lower APPROVAL_THRESHOLD for next period:
           APPROVAL_THRESHOLD = uint(APPROVAL_THRESHOLD.sub(((APPROVAL_THRESHOLD.sub(4500)).mul(shortage_approvals_rate)).div(10000)));   // decrease by up to 38.2 % of (APPROVAL_THRESHOLD - 45)
         }else{
           uint excess_approvals_rate = uint((_meanapproval.sub(PROTOCOL_RATIO_TARGET)));

           // require higher APPROVAL_THRESHOLD for next period:
           APPROVAL_THRESHOLD = uint(APPROVAL_THRESHOLD.add(((10000 - APPROVAL_THRESHOLD).mul(excess_approvals_rate)).div(10000)));   // increase by up to 38.2 % of (100 - APPROVAL_THRESHOLD)
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
bosoms[_staker] = bosoms[_staker].add(_amount);

}

// ----  Get bosoms  ------  //

// ----  add Stake ------  //

function addStake(address _staker, uint _amount) internal returns (bool success) {

    require(_amount > 0);
    stakesCounters[_staker] = stakesCounters[_staker].add(1); // notice that first stake will have the index of 1 thus not 0 !


    // increase variable that keeps track of total value of user's stakes
    stakesAmount[_staker] = stakesAmount[_staker].add(_amount);

    uint endTime = block.timestamp.add(STAKING_DURATION);

    // store this stake in _staker's stakes with the index stakesCounters[_staker]
    stakes[_staker][stakesCounters[_staker]] = Stake(
      _amount, // stake amount
      endTime // endTime
    );

    emit NewStake(_staker, _amount);

    return true;
}

function addConsolidation(address _staker, uint _amount, uint _endTime) internal returns (bool success) {

    require(_amount > 0);
    stakesCounters[_staker] = stakesCounters[_staker].add(1); // notice that first stake will have the index of 1 thus not 0 !


    // increase variable that keeps track of total value of user's stakes
    stakesAmount[_staker] = stakesAmount[_staker].add(_amount);

    // store this stake in _staker's stakes with the index stakesCounters[_staker]
    stakes[_staker][stakesCounters[_staker]] = Stake(
      _amount, // stake amount
      _endTime // endTime
    );

    emit NewStake(_staker, _amount);

    return true;
}

// ----  add Stake ------  //

// ----  split Stake ------  //

function splitStake(address _staker, uint _amount, uint _endTime) internal returns (bool success) {

    require(_amount > 0);
    stakesCounters[_staker] = stakesCounters[_staker].add(1); // notice that first stake will have the index of 1 thus not 0 !

    // store this stake in _staker's stakes with the index stakesCounters[_staker]
    stakes[_staker][stakesCounters[_staker]] = Stake(
      _amount, // stake amount
      _endTime // endTime
    );


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
  require(_stake.amount <= stakesAmount[msg.sender].sub(blockedeticas[msg.sender]));


  // Make sure user doesnt have excess Bosoms due to early stake claim without using bosoms:
  if(stakesAmount[msg.sender].sub(_stake.amount) < bosoms[msg.sender].add(blockedeticas[msg.sender])){

     if(stakesAmount[msg.sender].sub(_stake.amount).sub(blockedeticas[msg.sender]) > 0){
        bosoms[msg.sender] = stakesAmount[msg.sender].sub(_stake.amount).sub(blockedeticas[msg.sender]);
     }
     else {
        bosoms[msg.sender] = 0;
     }

  }

  // transfer back ETI from contract to staker:
  balances[address(this)] = balances[address(this)].sub(_stake.amount);

  balances[msg.sender] = balances[msg.sender].add(_stake.amount);

  emit Transfer(address(this), msg.sender, _stake.amount);
  emit StakeClaimed(msg.sender, _stake.amount);

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
    0x0 // endTime
    );

  // updates stakesCounter of _staker
  stakesCounters[_staker] = stakesCounters[_staker].sub(1);

}

// ----  Remove a Stake ------  //


// ----- Stakes consolidation  ----- //

// slashing function needs to loop through stakes. Can create issues for claiming votes:
// The function stakescsldt() has been created to consolidate (gather) stakes when user has too much stakes
function stakescsldt(uint _endTime, uint _min_limit, uint _maxidx) public {

// security to avoid blocking ETI by front end apps that could call function with too high _endTime:
require(_endTime < block.timestamp.add(730 days)); // _endTime cannot be more than two years ahead  

// _maxidx must be less or equal to nb of stakes and we set a limit for loop of 50:
require(_maxidx <= 50 && _maxidx <= stakesCounters[msg.sender]);

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
      _currentidx = _stakeidx.sub(_nbdeletes); //Notice: initial stakesCounters[msg.sender] = stakesCounters[msg.sender] + _nbdeletes. 
      //So "_stackidx <= _maxidx <= initial stakesCounters[msg.sender]" ===> "_stakidx <= stakesCounters[msg.sender] + _nbdeletes" ===> "_stackidx - _nbdeletes <= stakesCounters[msg.sender]"
      assert(_currentidx >= 1); // makes sure _currentidx is within existing stakes range
    }
      
      //if stake should end sooner than _endTime it can be consolidated into a stake that end latter:
      // Plus we check the stake.endTime is above the minimum limit the user is willing to consolidate. For instance user doesn't want to consolidate a stake that is ending tomorrow
      if(stakes[msg.sender][_currentidx].endTime <= _endTime && stakes[msg.sender][_currentidx].endTime >= _min_limit) {

        newAmount = newAmount.add(stakes[msg.sender][_currentidx].amount);

        _deletestake(msg.sender, _currentidx);    

        _nbdeletes = _nbdeletes.add(1);

      }  

    }
}

if (newAmount > 0){
// creates the new Stake
addConsolidation(msg.sender, newAmount, _endTime);
}

emit NewStakescsldt(msg.sender, _endTime, _min_limit);

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
  uint _restAmount = _stake.amount.sub(_snapamount);
  
  // updates the stake amount:
  _stake.amount = _snapamount;


  // ----- creates a new stake with the rest -------- //
  stakesCounters[msg.sender] = stakesCounters[msg.sender].add(1);
  require(stakesCounters[msg.sender] <= 100, "Cannot make more than 100 stakes"); // implements max 100 stakes

  // store this stake in _staker's stakes with the index stakesCounters[_staker]
  stakes[msg.sender][stakesCounters[msg.sender]] = Stake(
      _restAmount, // stake amount
      _stake.endTime // endTime
    );
  // ------ creates a new stake with the rest ------- //  

assert(_restAmount > 0);

emit NewStakesnap(msg.sender, _snapamount);

}

// ----- Stakes de-consolidation  ----- //


function stakescount(address _staker) public view returns (uint slength){
  return stakesCounters[_staker];
}

// ----------------- STAKING ------------------ //


// -------------  PUBLISHING SYSTEM CORE FUNCTIONS ---------------- //
function createdisease(string memory _name) public {
  
  require(keccak256(abi.encodePacked(_name)) != keccak256(abi.encodePacked('')));

  // --- REQUIRE PAYMENT FOR ADDING A DISEASE TO CREATE A BARRIER TO ENTRY AND AVOID SPAM --- //

  // make sure the user has enough ETI to create a disease
  require(balances[msg.sender] >= DISEASE_CREATION_AMOUNT);
  // transfer DISEASE_CREATION_AMOUNT ETI from user wallet to contract wallet:
  transfer(address(this), DISEASE_CREATION_AMOUNT);

  UNRECOVERABLE_ETI = UNRECOVERABLE_ETI.add(DISEASE_CREATION_AMOUNT);

  // --- REQUIRE PAYMENT FOR ADDING A DISEASE TO CREATE A BARRIER TO ENTRY AND AVOID SPAM --- //


  bytes32 _diseasehash = keccak256(abi.encode(_name));

  diseasesCounter = diseasesCounter.add(1); // notice that first disease will have the index of 1 thus not 0 !

  //check: if the disease is new we continue, otherwise we exit
   if(diseasesbyIds[_diseasehash] != 0x0) revert();  //prevent the same disease from being created twice. The software manages diseases uniqueness based on their unique english name. Note that even the first disease will not have index of 0 thus should pass this check
   require(diseasesbyNames[_name] == 0); // make sure it is not overwriting another disease thanks to unexpected string tricks from user

   // store the Disease
   diseases[diseasesCounter] = Disease(
     _diseasehash,
     _name
   );

   // Updates diseasesbyIds and diseasesbyNames mappings:
   diseasesbyIds[_diseasehash] = diseasesCounter;
   diseasesbyNames[_name] = _diseasehash;

   emit NewDisease(diseasesCounter, _name);

}



function propose(bytes32 _diseasehash, string memory _title, string memory _description, string memory raw_release_hash, string memory _freefield, uint _chunkid) public {

    //check if the disease exits
     require(diseasesbyIds[_diseasehash] > 0 && diseasesbyIds[_diseasehash] <= diseasesCounter);
     if(diseases[diseasesbyIds[_diseasehash]].disease_hash != _diseasehash) revert(); // second check not necessary but I decided to add it as the gas cost value for security is worth it

    require(_chunkid <= chunksCounter);

     bytes32 _proposed_release_hash = keccak256(abi.encode(raw_release_hash, _diseasehash));
     diseaseProposalsCounter[_diseasehash] = diseaseProposalsCounter[_diseasehash].add(1);
     diseaseproposals[_diseasehash][diseaseProposalsCounter[_diseasehash]] = _proposed_release_hash;

     proposalsCounter = proposalsCounter.add(1); // notice that first proposal will have the index of 1 thus not 0 !
     proposalsbyIndex[proposalsCounter] = _proposed_release_hash;

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
       proposal.raw_release_hash = raw_release_hash;
       proposal.freefield = _freefield;


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
       proposaldata.endtime = block.timestamp.add(DEFAULT_VOTING_TIME);
       proposaldata.approvalthreshold = APPROVAL_THRESHOLD;


// --- REQUIRE DEFAULT VOTE TO CREATE A BARRIER TO ENTRY AND AVOID SPAM --- //

    require(bosoms[msg.sender] >= PROPOSAL_DEFAULT_VOTE); // this check is not mandatory as handled by safemath sub function: (bosoms[msg.sender].sub(PROPOSAL_DEFAULT_VOTE))

    // Consume bosom:
    bosoms[msg.sender] = bosoms[msg.sender].sub(PROPOSAL_DEFAULT_VOTE);


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

      // if chunk exists and belongs to disease updates proposal.chunk_id:
      uint existing_chunk = chunks[_chunkid].id;
      if(existing_chunk != 0x0 && chunks[_chunkid].diseaseid == _diseasehash) {
        proposal.chunk_id = _chunkid;
        // updates chunk proposals infos:
        chunkProposalsCounter[_chunkid] = chunkProposalsCounter[_chunkid].add(1);
        chunkproposals[_chunkid][chunkProposalsCounter[_chunkid]] = proposal.proposed_release_hash;
      }

  // --- REQUIRE DEFAULT VOTE TO CREATE A BARRIER TO ENTRY AND AVOID SPAM --- //

  RANDOMHASH = keccak256(abi.encode(RANDOMHASH, _proposed_release_hash)); // updates RANDOMHASH

    emit NewProposal(_proposed_release_hash, msg.sender, proposal.disease_id, _chunkid);

}


 function updatecost() public {

// only start to increase PROPOSAL AND DISEASE COSTS once we are in phase2
require(supply >= 21000000 * 10**(decimals));
// update disease and proposal cost each 52 periods to take into account inflation:
require(periodsCounter % 52 == 0);
uint _new_disease_cost = supply.mul(47619046).div(10**13); // disease cost is 0.00047619046% of supply
uint _new_proposal_vote = supply.mul(47619046).div(10**14); // default vote amount is 0.000047619046% of supply

PROPOSAL_DEFAULT_VOTE = _new_proposal_vote;
DISEASE_CREATION_AMOUNT = _new_disease_cost;

assert(LAST_PERIOD_COST_UPDATE < periodsCounter);
LAST_PERIOD_COST_UPDATE = periodsCounter;

 }



 function commitvote(uint _amount, bytes32 _votehash) public {

 require(_amount > 10000);

 // Consume bosom:
 require(bosoms[msg.sender] >= _amount); // this check is not mandatory as handled by safemath sub function
 bosoms[msg.sender] = bosoms[msg.sender].sub(_amount);

 // Block Eticas in eticablkdtbl to prevent user from unstaking before eventual slash
 blockedeticas[msg.sender] = blockedeticas[msg.sender].add(_amount);

 // Make sure user doesnt have excess Bosoms before each vote, should never happen but added security:
 require(stakesAmount[msg.sender] >= bosoms[msg.sender].add(blockedeticas[msg.sender]), "EticaRelease: Excess bosoms for this new vote amount, claim some stakes before new vote");

 // store _votehash in commits with _amount and current block.timestamp value:
 commits[msg.sender][_votehash].amount = commits[msg.sender][_votehash].amount.add(_amount);
 commits[msg.sender][_votehash].timestamp = block.timestamp;

 RANDOMHASH = keccak256(abi.encode(RANDOMHASH, _votehash)); // updates RANDOMHASH

 emit NewCommit(msg.sender, _votehash, _amount);

 }


 function revealvote(bytes32 _proposed_release_hash, bool _approved, string memory _vary) public {
 

// --- check commit --- //
bytes32 _votehash;
_votehash = keccak256(abi.encode(_proposed_release_hash, _approved, msg.sender, _vary));

require(commits[msg.sender][_votehash].amount > 0);
// --- check commit done --- //

//check if the proposal exists and that we get the right proposal:
Proposal storage proposal = proposals[_proposed_release_hash];
require(proposal.id > 0 && proposal.proposed_release_hash == _proposed_release_hash);


ProposalData storage proposaldata = propsdatas[_proposed_release_hash];

 // Verify commit was done within voting time:
 require( commits[msg.sender][_votehash].timestamp <= proposaldata.endtime);

 // Verify we are within revealing time:
 require( block.timestamp > proposaldata.endtime && block.timestamp <= proposaldata.endtime.add(DEFAULT_REVEALING_TIME));

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

 proposaldata.nbvoters = proposaldata.nbvoters.add(1);


 uint qamount;

      if (commits[msg.sender][_votehash].amount < 1e18) {
            qamount = (commits[msg.sender][_votehash].amount).div(2);
      }
      else {
            qamount = ((ud(commits[msg.sender][_votehash].amount)).pow(ud(0.75e18))).intoUint256(); // quadratic vote amount x^0.75
      }

     qamounts[msg.sender][proposal.proposed_release_hash].amount = qamount;

     // PROPOSAL VAR UPDATE
     if(_approved){
      proposaldata.forvotes = proposaldata.forvotes.add(qamount);
     }
     else {
      proposaldata.againstvotes = proposaldata.againstvotes.add(qamount);
     }


     // Determine slashing conditions
     bool _isapproved = false;
     bool _istie = false;
     uint totalVotes = proposaldata.forvotes.add(proposaldata.againstvotes);
     uint _forvotes_numerator = proposaldata.forvotes.mul(10000); // (newproposal_forvotes / totalVotes) will give a number between 0 and 1. Multiply by 10000 to store it as uint
     uint _ratio_slashing = 0;

     if ((_forvotes_numerator.div(totalVotes)) > proposaldata.approvalthreshold){
    _isapproved = true;
    }
    if ((_forvotes_numerator.div(totalVotes)) == proposaldata.approvalthreshold){
        _istie = true;
    }

    proposaldata.istie = _istie;

    if (_isapproved){
    _ratio_slashing = uint(((10000 - proposaldata.approvalthreshold).mul(totalVotes)).div(10000));
    _ratio_slashing = uint((proposaldata.againstvotes.mul(10000)).div(_ratio_slashing));  
    proposaldata.slashingratio = uint(10000 - _ratio_slashing);
    }
    else{
    _ratio_slashing = uint((totalVotes.mul(proposaldata.approvalthreshold)).div(10000));
    _ratio_slashing = uint((proposaldata.forvotes.mul(10000)).div(_ratio_slashing));
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
            period.forprops = period.forprops.add(1);
          }
          else {
            period.againstprops = period.againstprops.add(1);
          }
        }
        // in this case the proposal becomes rejected after being accepted or becomes accepted after being rejected:
        else if(_newstatus != proposaldata.prestatus){

         if(_newstatus == ProposalStatus.Accepted){
          period.againstprops = period.againstprops.sub(1);
          period.forprops = period.forprops.add(1);
         }
         // in this case proposal is necessarily Rejected:
         else {
          period.forprops = period.forprops.sub(1);
          period.againstprops = period.againstprops.add(1);
         }

        }
        // updates period forvotes and againstvotes system done

         // Proposal and Period new weight
         if (_istie) {
         proposaldata.prestatus =  ProposalStatus.Rejected;
         proposaldata.lastcuration_weight = 0;
         proposaldata.lasteditor_weight = 0;
         // Proposal tied, remove proposal curation and editor sum
         period.curation_sum = period.curation_sum.sub(_old_proposal_curationweight);
         period.editor_sum = period.editor_sum.sub(_old_proposal_editorweight);
         }
         else {
             // Proposal approved, strengthen curation sum
         if (_isapproved){
             proposaldata.prestatus =  ProposalStatus.Accepted;
             proposaldata.lastcuration_weight = proposaldata.forvotes;
             proposaldata.lasteditor_weight = proposaldata.forvotes;
             // Proposal approved, replace proposal curation and editor sum with forvotes
             period.curation_sum = period.curation_sum.sub(_old_proposal_curationweight).add(proposaldata.lastcuration_weight);
             period.editor_sum = period.editor_sum.sub(_old_proposal_editorweight).add(proposaldata.lasteditor_weight);
         }
         else{
             proposaldata.prestatus =  ProposalStatus.Rejected;
             proposaldata.lastcuration_weight = proposaldata.againstvotes;
             proposaldata.lasteditor_weight = 0;
             // Proposal rejected, replace proposal curation sum with againstvotes and remove proposal editor sum
             period.curation_sum = period.curation_sum.sub(_old_proposal_curationweight).add(proposaldata.lastcuration_weight);
             period.editor_sum = period.editor_sum.sub(_old_proposal_editorweight);
         }
         }
         
        
        emit NewReveal(msg.sender, proposal.proposed_release_hash, vote.amount);
        // resets commit to save space: 
        _removecommit(_votehash);

  }

  function _removecommit(bytes32 _votehash) internal {
        commits[msg.sender][_votehash].amount = 0;
        commits[msg.sender][_votehash].timestamp = 0;
  }


  function clmpropbyhash(bytes32 _proposed_release_hash) public {

   //check if the proposal exists and that we get the right proposal:
   Proposal storage proposal = proposals[_proposed_release_hash];
   require(proposal.id > 0 && proposal.proposed_release_hash == _proposed_release_hash);


   ProposalData storage proposaldata = propsdatas[_proposed_release_hash];
   // Verify voting and revealing period is over
   require( block.timestamp > proposaldata.endtime.add(DEFAULT_REVEALING_TIME));

   
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
   uint _min_intervals = uint(((DEFAULT_VOTING_TIME.add(DEFAULT_REVEALING_TIME)).div(REWARD_INTERVAL)).add(1)); // Minimum intervals before claimable
   require(_current_interval >= period.interval.add(_min_intervals)); // Period not ready for claims yet. Need to wait more !

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
     uint _extraTimeInt = uint(STAKING_DURATION.mul(SEVERITY_LEVEL).mul(proposaldata.slashingratio).div(10000));

     if(vote.is_editor){
     _extraTimeInt = uint(_extraTimeInt.mul(PROPOSERS_INCREASER));
     }


// REQUIRE FEE if slashingratio is superior to 90.00%:
if(proposaldata.slashingratio > 9000){
    // 3% fee if voter is not proposer and 90% < slashingratio <= 99%
    uint _feeRemaining = uint(vote.amount.mul(3).div(100));

    // 7% fee if voter is not proposer and 99% < slashingratio
    if(proposaldata.slashingratio > 9900){
    _feeRemaining = uint(vote.amount.mul(7).div(100));
    }

    // 100% fee on collateral if voter is proposer
    if(vote.is_editor){
          _feeRemaining = vote.amount;
    }

    emit NewFee(msg.sender, _feeRemaining, vote.proposal_hash);  
    UNRECOVERABLE_ETI = UNRECOVERABLE_ETI.add(_feeRemaining);  
     // update _slashRemaining 
    _slashRemaining = vote.amount.sub(_feeRemaining);

         for(uint _stakeidxa = 1; _stakeidxa <= stakesCounters[msg.sender];  _stakeidxa++) {
      //if stake is big enough and can take into account the whole fee:
      if(stakes[msg.sender][_stakeidxa].amount > _feeRemaining) {
 
        stakes[msg.sender][_stakeidxa].amount = stakes[msg.sender][_stakeidxa].amount.sub(_feeRemaining);
        stakesAmount[msg.sender] = stakesAmount[msg.sender].sub(_feeRemaining);
        _feeRemaining = 0;
         break;
      }
      else {
        // The fee amount is more than or equal to a full stake, so the stake needs to be deleted:
          _feeRemaining = _feeRemaining.sub(stakes[msg.sender][_stakeidxa].amount);
          _deletestake(msg.sender, _stakeidxa);
          if(_feeRemaining == 0){
           break;
          }
      }
    }
}



// SLASH only if slash remaining > 0
if(_slashRemaining > 0){
  emit NewSlash(msg.sender, _slashRemaining, vote.proposal_hash, _extraTimeInt);
         for(uint _stakeidx = 1; _stakeidx <= stakesCounters[msg.sender];  _stakeidx++) {
      //if stake is too small and will only be able to take into account a part of the slash:
      if(stakes[msg.sender][_stakeidx].amount <= _slashRemaining) {
 
        if(stakes[msg.sender][_stakeidx].endTime > block.timestamp){
              stakes[msg.sender][_stakeidx].endTime = stakes[msg.sender][_stakeidx].endTime.add(_extraTimeInt);
        }
        else {
              stakes[msg.sender][_stakeidx].endTime = block.timestamp.add(_extraTimeInt);
        }
        
        _slashRemaining = _slashRemaining.sub(stakes[msg.sender][_stakeidx].amount);
        
       if(_slashRemaining == 0){
         break;
       }
      }
      else {
        // The slash amount does not fill a full stake, so the stake needs to be split
        uint newAmount = stakes[msg.sender][_stakeidx].amount.sub(_slashRemaining);
        uint oldCompletionTime = stakes[msg.sender][_stakeidx].endTime;

        // slash amount split in _slashRemaining and newAmount
        stakes[msg.sender][_stakeidx].amount = _slashRemaining; // only slash the part of the stake that amounts to _slashRemaining

        if(stakes[msg.sender][_stakeidx].endTime > block.timestamp){
              stakes[msg.sender][_stakeidx].endTime = stakes[msg.sender][_stakeidx].endTime.add(_extraTimeInt); // slash the stake
        }
        else {
              stakes[msg.sender][_stakeidx].endTime = block.timestamp.add(_extraTimeInt); // slash the stake
        }


        if(newAmount > 0){
          // create a new stake with the rest of what remained from original stake that was split in 2
          splitStake(msg.sender, newAmount, oldCompletionTime);
        }

        break;
      }
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

    // If vote used quadratic funding (only v1 votes dont use quadratic):
    if(qamounts[msg.sender][_proposed_release_hash].amount > 0){
    _reward_amount = _reward_amount.add((qamounts[msg.sender][_proposed_release_hash].amount.mul(period.reward_for_curation)).div(period.curation_sum));
    }
    else {
    _reward_amount = _reward_amount.add((vote.amount.mul(period.reward_for_curation)).div(period.curation_sum));
    }
   
   }

       // if voter is editor and proposal accepted:
    if (vote.is_editor && proposaldata.status == ProposalStatus.Accepted){
          // check before dividing by 0
          require( period.editor_sum > 0); // Period editor sum pb !
          _reward_amount = _reward_amount.add((proposaldata.lasteditor_weight.mul(period.reward_for_editor)).div(period.editor_sum));
    }

    require(_reward_amount <= period.reward_for_curation.add(period.reward_for_editor)); // "System logic error. Too much ETICA calculated for reward."

    // SEND ETICA AS REWARD
    balances[address(this)] = balances[address(this)].sub(_reward_amount);
    balances[msg.sender] = balances[msg.sender].add(_reward_amount);

    emit Transfer(address(this), msg.sender, _reward_amount);
    emit RewardClaimed(msg.sender, _reward_amount, _proposed_release_hash);
   }

  }   // end bracket if (proposaldata.istie not true)
  

  if(qamounts[msg.sender][_proposed_release_hash].amount > 0){
     qamounts[msg.sender][_proposed_release_hash].amount = 0;
  }

  // if proposaldata.istie is tie emit event so that blockchain can know this tx belongs to etica smart contract
  if(proposaldata.istie){
  emit TieClaimed(msg.sender, _proposed_release_hash);
  }
  

  }


    function createchunk(bytes32 _diseasehash, string memory _title, string memory _description) public {

  //check if the disease exits
  require(diseasesbyIds[_diseasehash] > 0 && diseasesbyIds[_diseasehash] <= diseasesCounter);
  if(diseases[diseasesbyIds[_diseasehash]].disease_hash != _diseasehash) revert(); // second check not necessary but I decided to add it as the gas cost value for security is worth it

  // --- REQUIRE PAYMENT FOR ADDING A CHUNK TO CREATE A BARRIER TO ENTRY AND AVOID SPAM --- //
  uint _cost = DISEASE_CREATION_AMOUNT.div(5);
  // make sure the user has enough ETI to create a chunk
  require(balances[msg.sender] >= _cost);
  // transfer DISEASE_CREATION_AMOUNT/5  ETI from user wallet to contract wallet:
  transfer(address(this), _cost);

  // --- REQUIRE PAYMENT FOR ADDING A CHUNK TO CREATE A BARRIER TO ENTRY AND AVOID SPAM --- //

  chunksCounter = chunksCounter.add(1); // get general id of Chunk

  // updates disease's chunks infos:
  diseaseChunksCounter[_diseasehash] = diseaseChunksCounter[_diseasehash].add(1); // Increase chunks index of Disease
  diseasechunks[_diseasehash][diseaseChunksCounter[_diseasehash]] = chunksCounter;
  

  // store the Chunk
   chunks[chunksCounter] = Chunk(
     chunksCounter, // general id of the chunk
     _diseasehash, // disease of the chunk
     diseaseChunksCounter[_diseasehash], // Index of chunk within disease
     _title,
     _description
   );

  UNRECOVERABLE_ETI = UNRECOVERABLE_ETI.add(_cost);
  emit NewChunk(chunksCounter, _diseasehash);

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

// ETICA V2 //

function updatev2() public {

// only update variables to v2 once
require(!UPDATEDV2);

PROPOSAL_DEFAULT_VOTE = 100 * 10**uint(decimals); // Pass from 10 ETI to 100 ETI. Amount to vote for creating a new proposal. Necessary in order to avoid spam.
_BLOCKS_PER_READJUSTMENT = 144;
_totalMiningSupply = 15750000 * 10**uint(decimals); // due to postponement of the increase of research rewards total max mineable supply increase
_reAdjustDifficulty();
if(miningTarget.mul(256) <= _MAXIMUM_TARGET)
{
  miningTarget = miningTarget.mul(256);
}

DEFAULT_EXTRA_TIME = 14 days; // 14 days slash penalty for recover commits on proposals without voters

UPDATEDV2 = true;

}


function recovercommit(bytes32 _proposed_release_hash, bool _approved, string memory _vary) public {
 

// --- check commit --- //
bytes32 _votehash;
_votehash = keccak256(abi.encode(_proposed_release_hash, _approved, msg.sender, _vary));

require(commits[msg.sender][_votehash].amount > 0);
// --- check commit done --- //

//check if the proposal exists and that we get the right proposal:
Proposal storage proposal = proposals[_proposed_release_hash];
require(proposal.id > 0 && proposal.proposed_release_hash == _proposed_release_hash);


ProposalData storage proposaldata = propsdatas[_proposed_release_hash];

 // Verify we are after proposal revealing time:
 require( block.timestamp > proposaldata.endtime.add(DEFAULT_REVEALING_TIME));


    // De-Block Eticas from eticablkdtbl to enable user to unstake these Eticas
    blockedeticas[msg.sender] = blockedeticas[msg.sender].sub(commits[msg.sender][_votehash].amount);


    // get Period of Proposal:
    Period storage period = periods[proposal.period_id];

    uint _current_interval = uint((block.timestamp).div(REWARD_INTERVAL));

    // Check if Period is ready for claims or if it needs to wait more
    uint _min_intervals = uint(((DEFAULT_VOTING_TIME.add(DEFAULT_REVEALING_TIME)).div(REWARD_INTERVAL)).add(1)); // Minimum intervals before claimable
    require(_current_interval >= period.interval.add(_min_intervals)); // Period not ready for claims yet. Need to wait more !

    // convert boolean to enum format for making comparasion with proposaldata.status possible:
    ProposalStatus voterChoice = ProposalStatus.Rejected;
    if(_approved){
      voterChoice = ProposalStatus.Accepted;
    }

     // slash loosers: voter has voted wrongly and needs to be slashed
     // Add x4 Penalty multiplier for not revealing on time
     uint _slashRemaining = commits[msg.sender][_votehash].amount;
     uint _extraTimeInt = uint(STAKING_DURATION.mul(SEVERITY_LEVEL).mul(4).mul(proposaldata.slashingratio).div(10000)); // Apply slash x4 higher than if vote had been revealed on time

     // if no voters on proposal apply default slash penalty: 
     if(proposaldata.prestatus == ProposalStatus.Singlevoter){
           _extraTimeInt = DEFAULT_EXTRA_TIME;
     }

     
     if(voterChoice == proposaldata.prestatus){
            // Add lesser Penalty multiplier if unreveal was on right side, based on opposite of the slashing ratio for wrong side vote (10001 - proposaldata.slashingratio)
            // proposaldata.slashingratio >= 0 and <= 10000, so use 10001 to avoid case extra time equals 0 (if slashing ratio 100%)
            _extraTimeInt = uint(STAKING_DURATION.mul(SEVERITY_LEVEL).mul(2).mul(10001 - proposaldata.slashingratio).div(10000));
     }
     

        // 10% base fee for all commits using this function
        uint _feeRemaining = uint(commits[msg.sender][_votehash].amount.mul(10).div(100));

        // REQUIRE FEE apply 20% fee (2 x 10%) if slashingratio is superior to 99.00%:
        if(proposaldata.slashingratio > 9900 && voterChoice != proposaldata.prestatus){
             _feeRemaining = uint(_feeRemaining.mul(2));
        }

        emit NewFee(msg.sender, _feeRemaining, _proposed_release_hash);  
        UNRECOVERABLE_ETI = UNRECOVERABLE_ETI.add(_feeRemaining);  
        // update _slashRemaining 
        _slashRemaining = commits[msg.sender][_votehash].amount.sub(_feeRemaining);

            for(uint _stakeidxa = 1; _stakeidxa <= stakesCounters[msg.sender];  _stakeidxa++) {
          //if stake is big enough and can take into account the whole fee:
          if(stakes[msg.sender][_stakeidxa].amount > _feeRemaining) {
    
            stakes[msg.sender][_stakeidxa].amount = stakes[msg.sender][_stakeidxa].amount.sub(_feeRemaining);
            stakesAmount[msg.sender] = stakesAmount[msg.sender].sub(_feeRemaining);
            _feeRemaining = 0;
            break;
          }
          else {
            // The fee amount is more than or equal to a full stake, so the stake needs to be deleted:
              _feeRemaining = _feeRemaining.sub(stakes[msg.sender][_stakeidxa].amount);
              _deletestake(msg.sender, _stakeidxa);
              if(_feeRemaining == 0){
              break;
              }
          }
        }

    // SLASH only if slash remaining > 0
    if(_slashRemaining > 0){
      emit NewSlash(msg.sender, _slashRemaining, _proposed_release_hash, _extraTimeInt);
            for(uint _stakeidx = 1; _stakeidx <= stakesCounters[msg.sender];  _stakeidx++) {
          //if stake is too small and will only be able to take into account a part of the slash:
          if(stakes[msg.sender][_stakeidx].amount <= _slashRemaining) {
    
            if(stakes[msg.sender][_stakeidx].endTime > block.timestamp){
                  stakes[msg.sender][_stakeidx].endTime = stakes[msg.sender][_stakeidx].endTime.add(_extraTimeInt);
            }
            else {
                  stakes[msg.sender][_stakeidx].endTime = block.timestamp.add(_extraTimeInt);
            }
            
            _slashRemaining = _slashRemaining.sub(stakes[msg.sender][_stakeidx].amount);
            
          if(_slashRemaining == 0){
            break;
          }
          }
          else {
            // The slash amount does not fill a full stake, so the stake needs to be split
            uint newAmount = stakes[msg.sender][_stakeidx].amount.sub(_slashRemaining);
            uint oldCompletionTime = stakes[msg.sender][_stakeidx].endTime;

            // slash amount split in _slashRemaining and newAmount
            stakes[msg.sender][_stakeidx].amount = _slashRemaining; // only slash the part of the stake that amounts to _slashRemaining

            if(stakes[msg.sender][_stakeidx].endTime > block.timestamp){
                  stakes[msg.sender][_stakeidx].endTime = stakes[msg.sender][_stakeidx].endTime.add(_extraTimeInt); // slash the stake
            }
            else {
                  stakes[msg.sender][_stakeidx].endTime = block.timestamp.add(_extraTimeInt); // slash the stake
            }


            if(newAmount > 0){
              // create a new stake with the rest of what remained from original stake that was split in 2
              splitStake(msg.sender, newAmount, oldCompletionTime);
            }

            break;
          }
        }
    }
    // the slash is over
  
  
  emit NewRecover(msg.sender, proposal.proposed_release_hash, commits[msg.sender][_votehash].amount);
  // resets commit to save space: 
  _removecommit(_votehash);


  }



  function recoverlostcommit(bytes32 _votehash) public {
 

    // --- check commit --- //
    require(commits[msg.sender][_votehash].amount > 0);
    // --- check commit done --- //


    // De-Block Eticas from eticablkdtbl to enable user to unstake these Eticas
    blockedeticas[msg.sender] = blockedeticas[msg.sender].sub(commits[msg.sender][_votehash].amount);


     // slash loosers: voter has voted wrongly and needs to be slashed
     // Add Penalty high multiplier, should be higher than recovercommit:
     uint _slashRemaining = commits[msg.sender][_votehash].amount;
     uint _extraTimeInt = DEFAULT_EXTRA_TIME; // Add Penalty high multiplier, should be higher than recovercommit:
     

        // 21% fee for all commits using this function
        // Add Penalty multiplier for not revealing on time
        uint _feeRemaining = uint(commits[msg.sender][_votehash].amount.mul(21).div(100)); // Add highest Penalty possible of the system for voters: 21% fee

        emit NewFee(msg.sender, _feeRemaining, bytes32(0));  
        UNRECOVERABLE_ETI = UNRECOVERABLE_ETI.add(_feeRemaining);  
        // update _slashRemaining 
        _slashRemaining = commits[msg.sender][_votehash].amount.sub(_feeRemaining);

            for(uint _stakeidxa = 1; _stakeidxa <= stakesCounters[msg.sender];  _stakeidxa++) {
          //if stake is big enough and can take into account the whole fee:
          if(stakes[msg.sender][_stakeidxa].amount > _feeRemaining) {
    
            stakes[msg.sender][_stakeidxa].amount = stakes[msg.sender][_stakeidxa].amount.sub(_feeRemaining);
            stakesAmount[msg.sender] = stakesAmount[msg.sender].sub(_feeRemaining);
            _feeRemaining = 0;
            break;
          }
          else {
            // The fee amount is more than or equal to a full stake, so the stake needs to be deleted:
              _feeRemaining = _feeRemaining.sub(stakes[msg.sender][_stakeidxa].amount);
              _deletestake(msg.sender, _stakeidxa);
              if(_feeRemaining == 0){
              break;
              }
          }
        }

    // SLASH only if slash remaining > 0
    if(_slashRemaining > 0){
      emit NewSlash(msg.sender, _slashRemaining, bytes32(0), _extraTimeInt);
            for(uint _stakeidx = 1; _stakeidx <= stakesCounters[msg.sender];  _stakeidx++) {
          //if stake is too small and will only be able to take into account a part of the slash:
          if(stakes[msg.sender][_stakeidx].amount <= _slashRemaining) {
    
            if(stakes[msg.sender][_stakeidx].endTime > block.timestamp){
                  stakes[msg.sender][_stakeidx].endTime = stakes[msg.sender][_stakeidx].endTime.add(_extraTimeInt);
            }
            else {
                  stakes[msg.sender][_stakeidx].endTime = block.timestamp.add(_extraTimeInt);
            }
            
            _slashRemaining = _slashRemaining.sub(stakes[msg.sender][_stakeidx].amount);
            
          if(_slashRemaining == 0){
            break;
          }
          }
          else {
            // The slash amount does not fill a full stake, so the stake needs to be split
            uint newAmount = stakes[msg.sender][_stakeidx].amount.sub(_slashRemaining);
            uint oldCompletionTime = stakes[msg.sender][_stakeidx].endTime;

            // slash amount split in _slashRemaining and newAmount
            stakes[msg.sender][_stakeidx].amount = _slashRemaining; // only slash the part of the stake that amounts to _slashRemaining

            if(stakes[msg.sender][_stakeidx].endTime > block.timestamp){
                  stakes[msg.sender][_stakeidx].endTime = stakes[msg.sender][_stakeidx].endTime.add(_extraTimeInt); // slash the stake
            }
            else {
                  stakes[msg.sender][_stakeidx].endTime = block.timestamp.add(_extraTimeInt); // slash the stake
            }


            if(newAmount > 0){
              // create a new stake with the rest of what remained from original stake that was split in 2
              splitStake(msg.sender, newAmount, oldCompletionTime);
            }

            break;
          }
        }
    }
    // the slash is over
  
  
  emit NewRecover(msg.sender, bytes32(0), commits[msg.sender][_votehash].amount);
  // resets commit to save space: 
  _removecommit(_votehash);


  }

// ETICA V2 // 


// ETICA V3 //

    function updatev3() public {

            // only update variables to v3 once
            require(!UPDATEDV3);

            PROPOSAL_DEFAULT_VOTE = 1000 * 10**uint(decimals); // Pass from 100 ETI to 1000 ETI. Amount for creating a new proposal. Necessary in order to avoid spam.

            randomxBlob = _generateRandomxBlob();

            randomxSeedhash = _generateNewSeedhash();

            _MAXIMUM_TARGET = type(uint256).max; // randomx Hardfork, same maxTarget as XMR (2^256 - 1)
            miningTarget = _MAXIMUM_TARGET.div(2500000);

            SEEDHASH_EPOCH_BLOCKS = 410;

            DISEASE_CREATION_AMOUNT = 500 * 10**uint(decimals);

            UPDATEDV3 = true;

    }

    function _generateRandomxBlob() internal returns (bytes memory) {
        bytes32 part1 = keccak256(abi.encode(blockhash(block.number - 1), RANDOMHASH, challengeNumber));
        bytes32 part2 = keccak256(abi.encode(part1, blockhash(block.number - 1), msg.sender));
        bytes16 part3 = bytes16(keccak256(abi.encode(part2, epochCount)));

        randomxBlobfirstpart = part1;
        
        return abi.encodePacked(part1, part2, part3);
    }

    function _generateNewSeedhash() internal view returns (bytes memory) {
      return abi.encodePacked(keccak256(abi.encode(randomxSeedhash, RANDOMHASH, challengeNumber)));
    }

    // Had to create new _startNewMiningEpoch because other instantiated before RandomX variables
     function _startNewMiningEpochRx() internal {


       epochCount = epochCount.add(1);

       //every so often, readjust difficulty. Dont readjust when deploying
       if(epochCount % _BLOCKS_PER_READJUSTMENT == 0)
       {
         _reAdjustDifficulty();
       }

       if(epochCount % SEEDHASH_EPOCH_BLOCKS == 0)
       {
         randomxSeedhash = _generateNewSeedhash();
       }


       //make the latest ethereum block hash a part of the next challenge for PoW to prevent pre-mining future blocks
       //do this last since this is a protection mechanism in the mint() function
       challengeNumber = blockhash(block.number.sub(1));
       challengeNumber = keccak256(abi.encode(challengeNumber, RANDOMHASH, epochCount)); // updates challengeNumber with merged mining protection
       // Generate RandomX blob
       randomxBlob = _generateRandomxBlob();

     }

    function mintrandomX(bytes4 nonce, bytes memory blockHeader, bytes32 currentChallenge, bytes memory randomxHash, uint claimedTarget, bytes memory seedHash, bytes8 extraNonce) public returns (bool success) {

             /*//the blockHeader must match the current randomxBlob
             if (blockHeader != randomxBlob) revert();*/
             require(keccak256(blockHeader) == keccak256(randomxBlob), "BlockHeader mismatch");

             //the challengeNumber must match the current challengeNumber
             if (currentChallenge != challengeNumber) revert();

             /*//the randomX seedHash must match the current randomxSeedhash
             if (seedHash != randomxSeedhash) revert(); */
             // Compare seedHash with randomxSeedhash
             require(keccak256(seedHash) == keccak256(randomxSeedhash), "Seedhash mismatch");

             if(claimedTarget > miningTarget) revert();

             bytes32 sendernoncehash = keccak256(abi.encodePacked(msg.sender, nonce));
             bytes32 solutionSeal = randomxSealSolutions[challengeNumber][sendernoncehash];
             if(solutionSeal == 0x0) revert();  // revert if no solutionSeal for this miner and challenge number

             // Check nonce, claimedTarget, randomxHash and seedhash are confirmed by randomX Go process, randomx process should have set expectedSolutionSeal in randomxSealSolutions
             bytes32 expectedSolutionSeal =  keccak256(abi.encodePacked(nonce, claimedTarget, seedHash, randomxHash));
             //makes sure solution was accepted with this nonce, randomxHash, claimedTarget and seedhash by randomX, the solutionSeal must match the expected
             if (expectedSolutionSeal !=  solutionSeal) revert();

            
              //only allow one reward for each challenge
              bytes32 solution = solutionForChallenge[challengeNumber];
              if(solution != 0x0) revert();  //prevent the same answer from awarding twice
              solutionForChallenge[challengeNumber] = solutionSeal;


            // GUARDIAN HARDFORK TOKENOMICS, WITH ETI HALVINGS:
            if (tokensMinted <= 1890000 * 10**uint(decimals)) {
                    // Year 1: Initial block reward and research reward. 
                    // Total issuance/year: 2.1M
                    // Mining: 1,890,000 ETI/year Research: 210,000 ETI/year
                    blockreward = 35958874554349681356; // 35.958874554349681356 ETI per block
            } 
           else if (tokensMinted < 6930000 * 10**uint(decimals)) {
                // Year 2-4: Adjusted block reward and research reward. 
                // Total issuance/year: 2.1M
                // Mining: 1,680,000 ETI/year Research: 420,000 ETI/year
                blockreward = 31963444048310827872; // 31.963444048310827872 ETI per block
            } 
            else if (tokensMinted < 11250000 * 10**uint(decimals)) {
                // First Halving: 2026-2030. 
                // Total issuance/year: 1.35M
                // Mining: 1,080,000 ETI/year Research: 270,000 ETI/year
                blockreward = 20547928316771246489; // 20.5479283167712464893847167 ETI per block
            } 
            else if (tokensMinted < 13410000 * 10**uint(decimals)) {
                // Second Halving: 2030-2034
                // Total issuance/year: 675k ETI/year
                // Mining: 540,000 ETI/year Research: 135,000 ETI/year
                blockreward = 10273964158385623244; // 10.2739641583856232447423667 ETI per block
            } 
            else if (tokensMinted < 14490000 * 10**uint(decimals)) {
                // Third Halving: 2034-2038
                // Total issuance/year: 337.5k ETI/year
                // Mining: 270,000 ETI/year Research: 67,500 ETI/year
                blockreward = 5136982079192811622; // 5.1369820791928116223215333 ETI per block
            } 
            else {
                // Transition Phase: 2038 onwards, 1% annual inflation
                // blocksPerYear = 52.1429 * 7 * 24 * 6 = 52560.0432
                // Scale up by 10,000 to handle fractional part
                uint scaledSupply = supply.mul(10000); // Scale up supply by 10,000 before dividing by 52560.0432 * 10 000
                
                // Calculate 1% of the scaled supply
                uint annualInflationScaled = scaledSupply.div(100);
                
                // Calculate block reward (5% of 1% annual inflation)
                blockreward = (annualInflationScaled.mul(5).div(100)).div(525600432); // 525600432 is 52560.0432 * 10,000
     
            }

             tokensMinted = tokensMinted.add(blockreward);
             //Cannot mint more tokens than there are: maximum ETI ever mined: _totalMiningSupply
             assert(tokensMinted < _totalMiningSupply);

             supply = supply.add(blockreward);
             balances[msg.sender] = balances[msg.sender].add(blockreward);


             //set readonly diagnostics data
             lastRewardTo = msg.sender;
             lastRewardEthBlockNumber = block.number;


              _startNewMiningEpochRx();

               emit Mint(msg.sender, blockreward, epochCount, challengeNumber );
               emit Transfer(address(this), msg.sender,blockreward);

            return true;
            
    }

    function checkMintRandomxInputs(bytes memory blockHeader, bytes32 currentChallenge, uint claimedTarget, bytes memory seedHash) public view returns (bool isValid, string memory errorMessage) {

          // Check if the blockHeader matches the current randomxBlob
          if (keccak256(blockHeader) != keccak256(randomxBlob)) {
              return (false, "BlockHeader mismatch");
          }

          // Check if the challengeNumber matches the current challengeNumber
          if (currentChallenge != challengeNumber) {
              return (false, "Challenge mismatch");
          }

          // Check if the seedHash matches the current randomxSeedhash
          if (keccak256(seedHash) != keccak256(randomxSeedhash)) {
              return (false, "Seedhash mismatch");
          }

          // Check if the claimedTarget is less than or equal to the current miningTarget
          if (claimedTarget > miningTarget) {
              return (false, "Claimed target too high");
          }

          // Check if a solution already exists for this challenge
          if (solutionForChallenge[challengeNumber] != 0x0) {
              return (false, "Challenge already has a solution");
          }

          // All checks passed
          return (true, "All parameters valid");

    }

// ETICA V3 //


// ETICA V4 //
// ETICA V4 smart contract updates just update two EticaToken functions, other Etica V4 updates happen at blockchain level    
    
    function updatev4() public {

            // only update variables to v4 once
            require(!UPDATEDV4);

            networkGuardAddresses[address(0x5CcCcb6d334197c7C4ba94E7873d0ef11381CD4e)] = true; // Xeggex exchange address

            UPDATEDV4 = true;

    }
    
    //transfer tokens from the  owner account to the account that calls the function
    function transferFrom(address from, address to, uint tokens) public override returns(bool){

      
      balances[from] = balances[from].sub(tokens);


      allowed[from][msg.sender] = allowed[from][msg.sender].sub(tokens);

      balances[to] = balances[to].add(tokens);

      emit Transfer(from, to, tokens);

      return true;
    }

    // updates approve function to remove the user balance requirements statements to make it compatible with Defi protocols
    function approve(address spender, uint tokens) public override returns(bool){
        allowed[msg.sender][spender] = tokens;
        emit Approval(msg.sender, spender, tokens);
        return true;
    }
// ETICA V4 //


// ETICA V5 //

    function updatev5() public {

      // only update variables to v5 once
      require(!UPDATEDV5);

      networkGuardAddresses[address(0x5CcCcb6d334197c7C4ba94E7873d0ef11381CD4e)] = false; // unblock Xeggex exchange address
      researchMinted = supply.sub(tokensMinted);

      UPDATEDV5 = true;
    }


// ETICA V5 //


}
