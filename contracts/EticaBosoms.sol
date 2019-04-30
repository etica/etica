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
    uint public maxsupply;
    uint public centuryreward; // Amount of ETI issued every 100 years
    uint public weeklyreward; // Amount of ETI issued every week
    address public founder;

    mapping(address => uint) public balances;

    mapping(address => mapping(address => uint)) allowed;

    //allowed[0x1111....][0x22222...] = 100;


    event Transfer(address indexed from, address indexed to, uint tokens);
    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);


    constructor() public{
      maxsupply = 1000000000 * (10**18); // 1 Billion ETI
      supply = 618033980 * (10**18); // initial supply equals 618033980 ETI fibonacci golden ratio
      centuryreward = 381966020 * (10**18); // 381966020 ETI issued per century
      weeklyreward = 73253697051755847871906; // 381966020 ETI per century equals 73253,697051755847871905858707513 ETI Issued each week : (centuryreward / (100 * 52,1429));
      founder = msg.sender;
      balances[founder] = supply * 8 / 100;
      balances[address(this)] = supply - balances[founder];
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


contract EticaBosoms is EticaToken{
    address public admin;


    //starting with solidity version 0.5.0 only a payable address has the transfer() member function
    //it's mandatory to declare the variable payable
    address payable public deposit;

    //token price in wei: 1ETI = 0.001 ETHER, 1 ETHER = 1000 ETI
    uint tokenPrice = 1000000000000000;

    // 618033980 ETI fibonacci golden ratio
    uint public hardCap = 618033980000000000000000; // 618033980 ETI  equals 618033.980 Ether equals 618033980000000000000000 in wei

    uint public raisedAmount;

    uint public saleStart = now;
    uint public saleEnd = now + 604800; //one week
    uint public coinTradeStart = saleEnd + 604800; //transferable in a week after salesEnd

    uint public maxInvestment = 5000000000000000000;
    uint public minInvestment = 10000000000000000;

    enum State { beforeStart, running, afterEnd, halted}
    State public icoState;


    modifier onlyAdmin(){
        require(msg.sender == admin);
        _;
    }

    event Invest(address investor, uint value, uint tokens);


    //in solidity version > 0.5.0 the deposit argument must be payable
    constructor(address payable _deposit) public{
        deposit = _deposit;
        admin = msg.sender;
        icoState = State.beforeStart;
    }

    //emergency stop
    function halt() public onlyAdmin{
        icoState = State.halted;
    }

    //restart
    function unhalt() public onlyAdmin{
        icoState = State.running;
    }


    //only the admin can change the deposit address
    //in solidity version > 0.5.0 the deposit argument must be payable
    function changeDepositAddress(address payable newDeposit) public onlyAdmin{
        deposit = newDeposit;
    }


    //returns ico state
    function getCurrentState() public view returns(State){
        if(icoState == State.halted){
            return State.halted;
        }else if(block.timestamp < saleStart){
            return State.beforeStart;
        }else if(block.timestamp >= saleStart && block.timestamp <= saleEnd){
            return State.running;
        }else{
            return State.afterEnd;
        }
    }


    function invest() payable public returns(bool){
        //invest only in running
        icoState = getCurrentState();
        require(icoState == State.running);

        require(msg.value >= minInvestment && msg.value <= maxInvestment);

        uint tokens = msg.value / tokenPrice;

        //hardCap not reached
        require(raisedAmount + msg.value <= hardCap);

        raisedAmount += msg.value;

        //add tokens to investor balance from founder balance
        balances[msg.sender] += tokens;
        balances[founder] -= tokens;

        deposit.transfer(msg.value);//transfer eth to the deposit address

        //emit event
        emit Invest(msg.sender, msg.value, tokens);

        return true;


    }

    //the payable function must be declared external in solidity versions > 0.5.0
    function () payable external{
        invest();
    }



    function burn() public returns(bool){
        icoState = getCurrentState();
        require(icoState == State.afterEnd);
        balances[founder] = 0;

    }


    function transfer(address to, uint value) public returns(bool){
        require(block.timestamp > coinTradeStart);
        super.transfer(to, value);
    }

    function transferFrom(address _from, address _to, uint _value) public returns(bool){
        require(block.timestamp > coinTradeStart);
        super.transferFrom(_from, _to, _value);
    }

}
