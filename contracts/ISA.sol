// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ISA {
    address public investor;
    uint256 public share;
    uint256 public cap;
    uint256 public allowance;
    bytes32 public ipfsHash;

    uint256 public invested;
    uint256 public balance;
    uint256 public totalRevenue;   
    uint256 public totalReturned; 
    uint256 public returnAllocated;
    uint256 public revenueAllocated;

    constructor(
        address _investor,
        uint256 _share,
        uint256 _cap,
        uint256 _allowance,
        bytes32 _ipfsHash
    ) {
        investor = _investor;
        share = _share;
        cap = _cap;
        allowance = _allowance;
        ipfsHash = _ipfsHash;
    }

    function invest() external payable {
        require(
            investor == msg.sender,
            "Only the investor can invest in this contract"
        );
        require(msg.value > 0, "Must invest more than 0 ETH");
        invested += msg.value;
    }

    event Received(address, uint);
    receive() external payable {
        balance += msg.value;
        totalRevenue += msg.value;
        emit Received(msg.sender, msg.value);
    }

    function creatorWithdraw() public {
        uint256 toInvestor = (balance + totalRevenue - allowance) * share / 100;
        totalRevenue += balance - toInvestor;
        totalReturned += toInvestor;
        returnAllocated += toInvestor;
        uint256 total = invested + revenueAllocated + balance - toInvestor;
        revenueAllocated = 0;
        
        (bool success, ) = payable(owner).call{value: total}("");
        require(
            success,
            "Address: unable to send value, recipient may have reverted"
        );
    }

    function investorWithdraw() public {
        uint256 toInvestor = (balance + totalRevenue - allowance) * share / 100;
        totalRevenue += balance - toInvestor;
        totalReturned += toInvestor;
        revenueAllocated += balance - toInvestor;
        uint256 total = returnAllocated + toInvestor;
        revenueAllocated = 0;
        
        (bool success, ) = payable(investor).call{value: total}("");
        require(
            success,
            "Address: unable to send value, recipient may have reverted"
        );
    }
}
