// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ISA is Ownable {
    address public investor;
    uint256 public share;
    uint256 public returnMultiple;
    uint256 public allowance;
    bytes32 public ipfsHash;

    uint256 public balance; // should've actually been named `unallocated`
    uint256 public totalInvested;
    uint256 public totalRevenue;   
    uint256 public totalReturned;
    uint256 public investmentAllocated;
    uint256 public returnAllocated;
    uint256 public revenueAllocated;
    bool public closed;

    constructor(
        address _investor,
        uint256 _share,
        uint256 _returnMultiple,
        uint256 _allowance,
        bytes32 _ipfsHash
    ) {
        require(_returnMultiple > 10000, "Return multiple must be over 100.00%");
        require(_share < 10000, "Revenue share must be under 100.00%");
        investor = _investor;
        share = _share;
        returnMultiple = _returnMultiple;
        allowance = _allowance;
        ipfsHash = _ipfsHash;
        closed = false;
    }

    function invest() external payable {
        require(!closed, "The funding has closed for this contract");
        require(
            investor == msg.sender,
            "Only the investor can invest in this contract"
        );
        require(msg.value > 0, "Must invest more than 0 ETH");
        investmentAllocated += msg.value;
        totalInvested += msg.value;
    }

    event Received(address, uint);
    receive() external payable {
        balance += msg.value;
        emit Received(msg.sender, msg.value);
    }

    function investorCut() public view returns (uint256) {
        uint256 raw = balance + totalRevenue < allowance 
          ? 0 
          : (totalRevenue < allowance 
              ? balance + totalRevenue - allowance 
              : balance
            ) * share / 10000;
        uint256 space = (returnMultiple*totalInvested / 10000) - totalReturned;
        return raw < space ? raw : space;
    }

    function creatorWithdrawPreview() public view returns (uint256) {
        return investmentAllocated + revenueAllocated + balance - investorCut();
    }

    function investorWithdrawPreview() public view returns (uint256) {
        return returnAllocated + investorCut();
    }

    function creatorWithdraw() public {
        uint256 toInvestor = investorCut();
        uint256 total = investmentAllocated + revenueAllocated + balance - toInvestor;
        require(
            total > 0,
            "Nothing to withdraw"
        );

        totalRevenue += balance - toInvestor;
        totalReturned += toInvestor;
        returnAllocated += toInvestor;
        investmentAllocated = 0;
        revenueAllocated = 0;
        balance = 0;
        
        (bool success, ) = payable(owner()).call{value: total}("");
        require(
            success,
            "Address: unable to send value, recipient may have reverted"
        );
    }

    function investorWithdraw() public {
        uint256 toInvestor = investorCut();        
        uint256 total = returnAllocated + toInvestor;
        require(
            total > 0,
            "Nothing to withdraw"
        );
        
        totalRevenue += balance - toInvestor;
        totalReturned += toInvestor;
        revenueAllocated += balance - toInvestor;
        returnAllocated = 0;
        balance = 0;
        
        (bool success, ) = payable(investor).call{value: total}("");
        require(
            success,
            "Address: unable to send value, recipient may have reverted"
        );
    }

    function closeInvestments() public {
        require(
            msg.sender == owner(),
            "Only contract owner could close investments"
        );
        closed = true;
    }

    function reopenInvestments() public {
        require(
            msg.sender == owner(),
            "Only contract owner could reopen investments"
        );
        closed = false;
    }
}
