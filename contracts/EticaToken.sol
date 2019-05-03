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
    int public  reward; // Amount of ETI issued every week
    uint public initialreserve;
    uint public weeklyreward; // Amount of ETI issued every week
    address public founder;

    mapping(address => uint) public balances;

    mapping(address => mapping(address => uint)) allowed;

    //allowed[0x1111....][0x22222...] = 100;


    event Transfer(address indexed from, address indexed to, uint tokens);
    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);


    constructor() public{
      // Golden number power 2: 1,6180339887498948482045868343656 * 1,6180339887498948482045868343656 = 2.6180339887498948482045868343656; (need to multiple by 10^(-34) to get 0.26180339887498948482045868343656);
      inflationrate = 26180339887498948482045868343656‬;
      supply = 100 * (10**18); // initial supply equals 100 ETI
      balances[address(this)] = 100 * (10**18); // 100 ETI as the default contract balance. To avoid any issue that could arise from negative contract balance because of significant numbers approximations
      weeklyreward = 73253697051755847871906; // 381966020 ETI per century equals 73253,697051755847871905858707513 ETI Issued each week : (centuryreward / (100 * 52,1429));
      founder = msg.sender;
      initialreserve = supply - balances[founder] - balances[address(this)];
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
