pragma solidity ^0.5.2;
// ----------------------------------------------------------------------------
//this ICO smart contract has been compiled and tested with the Solidity Version 0.5.2
//There are some minor changes comparing to ICO contract compiled with versions < 0.5.0
// ----------------------------------------------------------------------------

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
    string public name = "Etica";
    string public symbol = "ETI";
    uint public decimals = 18;

    uint public supply;
    // fixed inflation rate after etica supply has reached 21 Million
    uint public inflationrate;
    int public  periodrewardtemp; // Amount of ETI issued per period during phase1

    // We don't want fake Satoshi again. Using it to prove founder's identity
    address public founder;
    string public foundermsgproof;

    mapping(address => uint) public balances;

    mapping(address => mapping(address => uint)) allowed;

    //allowed[0x1111....][0x22222...] = 100;


    event Transfer(address indexed from, address indexed to, uint tokens);
    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);


    constructor() public{
      supply = 100 * (10**18); // initial supply equals 100 ETI
      balances[address(this)] = 100 * (10**18); // 100 ETI as the default contract balance. To avoid any issue that could arise from negative contract balance because of significant numbers approximations

      // PHASE 1

      // --- PAHSE 1 (before 21 Million ETI has been reached) --->  //
      // 10 500 000 ETI to be issued as periodrewardtemp for ETICA reward system
      // 10 500 000 ETI to be MINED

      // phase1 periodrewardtemp
      // fixed Etica issued per period during phase1 (before 21 Million ETI has been reached)
      // calculation:
      // The amount of reward has to be half of first rewards of phase 2
      // 21 000 000 * 0.26180339887498948482045868343656 = 549 787,13763747791812296323521678‬ ETI (first year reward)
      // 549 787,13763747791812296323521678‬ / 52.1429 = 10 543,854247413893706007207792754‬ ETI (first weeks reward of phase2)
      // 10 543,854247413893706007207792754‬ * 2 = 21087,708494827787412014415585507 ETI
      periodrewardtemp = 21087708494827787412014415585507; // 21087,708494827787412014415585507 ETI will take about 9,5491502812526287948853291408588 years to reach 10 500 000 ETI



      // phase1 mining


      // PHASE 1

      // PHASE 2
      // Golden number power 2: 1,6180339887498948482045868343656 * 1,6180339887498948482045868343656 = 2.6180339887498948482045868343656; (need to multiple by 10^(-34) to get 0.26180339887498948482045868343656);
      inflationrate = 26180339887498948482045868343656;

       // PHASE 2



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
        require(allowed[from][to] >= tokens);
        require(balances[from] >= tokens);

        balances[from] -= tokens;
        balances[to] += tokens;


        allowed[from][to] -= tokens;

        return true;
    }

    function totalSupply() public view returns (uint){
        return supply;
    }

    function balanceOf(address tokenOwner) public view returns (uint balance){
         return balances[tokenOwner];
     }


    function transfer(address to, uint tokens) public returns (bool success){
         require(balances[msg.sender] >= tokens && tokens > 0);

         balances[to] += tokens;
         balances[msg.sender] -= tokens;
         emit Transfer(msg.sender, to, tokens);
         return true;
     }
}
