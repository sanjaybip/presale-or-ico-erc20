// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Presale {
    //Token on sale;
    ERC20 public token;

    //Wallet where we collect fund (We can also collect money in contract)
    address payable public fundReceiver;

    //Token rate per Wei
    uint public tokenPerWei;

    // Total amount raised;
    uint public totalAmountRaised;

    // store buyer information
    mapping(address => uint) public buyerAddresses;

    // event
    event TokenPurchase(address indexed buyer, address indexed receiver, uint etherSent, uint tokenAmount);
    constructor(uint _tokenPerWei, address payable _receiverWallet, ERC20 _tokenAddress) {
        require(_tokenPerWei > 0, "Zero Token per Wei!");
        require(_receiverWallet != address(0), "Address can't be 0");
        tokenPerWei = _tokenPerWei;
        fundReceiver = _receiverWallet;
        token = ERC20(_tokenAddress);
    }

    //Fall back function in case someone send token to contract
    fallback() external payable {
        buyTokens(msg.sender);
    }

    receive() external payable {
        buyTokens(msg.sender);
    }

    function buyTokens(address _buyer) public payable {
        uint weiAmount = msg.value;

        validateBuyToken(_buyer, weiAmount);

        //calculate Token amount to be created
         uint tokenAmount = getTokenAmount(weiAmount);

        totalAmountRaised += weiAmount;

        processBuyToken(_buyer, tokenAmount);

        buyerAddresses[_buyer] = weiAmount;
        
        emit TokenPurchase(_buyer, fundReceiver, weiAmount, tokenAmount);

        forwardFund();
    }

    function validateBuyToken(address _buyer, uint _weiAmount) internal pure {
        require(_buyer != address(0), "Buyer address is invalid!");
        require(_weiAmount > 0, "No amount sent!");
    }

    function processBuyToken(address _buyer, uint _tokenAmount) internal {
        token.transfer(_buyer, _tokenAmount);
    }

    function getTokenAmount(uint _weiAmount) internal view returns(uint) {
        return tokenPerWei * _weiAmount;
    }

    function forwardFund() internal {
        (bool sent,) = fundReceiver.call{value : msg.value}("");
        require(sent, "Transaction Failed!");
    }
}
