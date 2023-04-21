pragma solidity ^0.8.0;

contract BedContract {
    address public owner;
    string public name;
    uint public money;

    mapping(address => bool) public isLocked;
    mapping(address => uint) public ballanceOf;
    mapping (address => mapping(address => uint)) public allowance;

    event Burn(address indexed _from, uint indexed value);
    event Lock(address indexed _from);
    event Approve(address indexed _from, address indexed _to, uint indexed value);
    event Transfer(address indexed _from, address indexed _to, uint indexed value);
    event ChangeOwner(address indexed _from, address indexed _to);

    constructor(string memory _name, uint _money){
        owner = msg.sender;
        name = _name;
        ballanceOf[msg.sender] = _money;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    modifier isUnLocked() {
        require(isLocked[msg.sender] == false, "money is locked");
        _;
    }

    function burn(uint _value) public {
        require(ballanceOf[msg.sender] >= _value, "Not enough money to burn");
        ballanceOf[msg.sender] -= _value;
        emit Burn(msg.sender, _value);
    }

    function lock() public {
        isLocked[msg.sender] = true;
        emit Lock(msg.sender);
    }

    function changeOwner(address _to) public onlyOwner {
        owner = _to;
        emit ChangeOwner(msg.sender, _to);
    }

    function approve(address _to, uint _value) public isUnLocked {
        require(ballanceOf[msg.sender] >= _value, "Not enough money to approve");
        allowance[msg.sender][_to] += _value;
        emit Approve(msg.sender, _to, _value);
    }

    function transfer_from(address _from, address _to, uint _value) public {
        require(!isLocked[_from], "money is locked");
        require(allowance[_from][msg.sender] >= _value, "Not enough money allowance");
        allowance[_from][msg.sender] -= _value;
        ballanceOf[_to] += _value;
        ballanceOf[_from] -= _value;
        emit Transfer(_from, _to, _value);
    }

    function transfer(address _to, uint _value) public isUnLocked {
        require(ballanceOf[msg.sender] >= _value, "Not enough money to transfer");
        ballanceOf[msg.sender] -= _value;
        ballanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
    }
}