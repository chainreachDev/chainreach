// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ChainVault
 * @notice A smart contract for creating and managing individual influencer
 * marketing campaign vaults. This contract holds the funds for a campaign
 * and handles the payout logic based on verification.
 */
contract ChainVault {
    // State Variables
    address public brand;
    address public creator;
    uint256 public payoutAmount;
    string public campaignData;

    enum Status { Created, Funded, Completed, Cancelled }
    Status public status;

    // Events
    event VaultFunded(uint256 amount);
    event PostVerified();
    event PaymentWithdrawn(address indexed creator, uint256 amount);
    event CampaignCancelled();

    // Constructor
    constructor(
        address _brand,
        address _creator,
        uint256 _payoutAmount,
        string memory _campaignData
    ) {
        brand = _brand;
        creator = _creator;
        payoutAmount = _payoutAmount;
        campaignData = _campaignData;
        status = Status.Created;
    }

    // External Functions
    // NOTE: We will implement the logic for these functions next.
    // function fund() external payable {}
    // function verifyPost() external {}
    // function withdraw() external {}
    // function cancelCampaign() external {}
}
