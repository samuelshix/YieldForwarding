// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity =0.7.6;
pragma abicoder v2;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@uniswap/v3-periphery/contracts/interfaces/INonfungiblePositionManager.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";

contract ProvideLiquidity is IERC721Receiver {
    // address public constant DAI = 0x6B175474E89094C44Da98b954EedeAC495271d0F;
    // address public constant USDC = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;

    // uint24 public constant poolFee = 3000;
    // INonfungiblePositionManager public constant nonfungiblePositionManager =
    //     INonfungiblePositionManager(0xC36442b4a4522E871399CD717aBDD847Ab11FE88);
    // address public constant nonfungiblePositionManager =
    // 0xC36442b4a4522E871399CD717aBDD847Ab11FE88;
    INonfungiblePositionManager public constant nonfungiblePositionManager =
        INonfungiblePositionManager(0xC36442b4a4522E871399CD717aBDD847Ab11FE88);

    /// @notice Represents the deposit of an NFT
    struct Deposit {
        address owner;
        address recipient;
        uint128 liquidity;
        address token0;
        address token1;
    }

    /// @dev deposits[tokenId] => Deposit
    mapping(uint256 => Deposit) public deposits;

    /// @dev yieldRecipients[tokenId] => yieldRecipient

    // modifier onlyOwner {
    // 	//is the message sender owner of the contract?
    //     require(msg.sender == owner);

    //     _;
    // }
    event createDeposit(address owner, uint256 tokenId);
    event addRecipient(address recipient, uint256 tokenid);

    // Implementing `onERC721Received` so this contract can receive custody of erc721 tokens
    function onERC721Received(
        address operator,
        address,
        uint256 tokenId,
        bytes calldata
    ) external override returns (bytes4) {
        // get position information
        require(
            msg.sender == address(nonfungiblePositionManager),
            "Not a Uniswap v3 NFT!"
        );
        _createDeposit(operator, tokenId);

        return this.onERC721Received.selector;
    }

    function _createDeposit(address owner, uint256 tokenId) internal {
        (
            ,
            ,
            address token0,
            address token1,
            ,
            ,
            ,
            uint128 liquidity,
            ,
            ,
            ,

        ) = nonfungiblePositionManager.positions(tokenId);
        emit createDeposit(owner, tokenId);
        // set the owner and data for position
        // operator is msg.sender
        deposits[tokenId] = Deposit({
            owner: owner,
            recipient: address(0),
            liquidity: liquidity,
            token0: token0,
            token1: token1
        });
    }

    function _addRecipient(address recipient, uint256 tokenId) internal {
        emit addRecipient(recipient, tokenId);
        deposits[tokenId].recipient = recipient;
    }

    function deposit(address recipient, uint256 tokenId) external {
        require(
            nonfungiblePositionManager.ownerOf(tokenId) == msg.sender,
            "You do not own this NFT!"
        );
        // require(
        //     deposits[tokenId].recipient == address(0),
        //     "This position has already been deposited!"
        // );
        _createDeposit(msg.sender, tokenId);
        _addRecipient(recipient, tokenId);
    }

    // function transferToContract(address user, uint256 _tokenId) public {
    //     _transfer(user, address(this), _tokenId);
    //     deposits[tokenId] =
    // }

    function collectAllFees(uint256 tokenId)
        external
        returns (uint256 amount0, uint256 amount1)
    {
        // Caller must own the ERC721 position
        // Call to safeTransfer will trigger `onERC721Received` which must return the selector else transfer will fail
        // nonfungiblePositionManager.safeTransferFrom(
        //     msg.sender,
        //     address(this),
        //     tokenId
        // );

        // set amount0Max and amount1Max to uint256.max to collect all fees
        // alternatively can set recipient to msg.sender and avoid another transaction in `sendToOwner`
        INonfungiblePositionManager.CollectParams
            memory params = INonfungiblePositionManager.CollectParams({
                tokenId: tokenId,
                recipient: address(this),
                amount0Max: type(uint128).max,
                amount1Max: type(uint128).max
            });

        (amount0, amount1) = nonfungiblePositionManager.collect(params);

        // forward yield to specified address
        _sendToRecipient(tokenId, amount0, amount1);
    }

    /// @notice Transfers funds to owner of NFT
    /// @param tokenId The id of the erc721
    /// @param amount0 The amount of token0
    /// @param amount1 The amount of token1
    function _sendToRecipient(
        uint256 tokenId,
        uint256 amount0,
        uint256 amount1
    ) private {
        // get yield recipient
        address recipient = deposits[tokenId].recipient;

        address token0 = deposits[tokenId].token0;
        address token1 = deposits[tokenId].token1;
        // send collected fees to recipient
        TransferHelper.safeTransfer(token0, recipient, amount0);
        TransferHelper.safeTransfer(token1, recipient, amount1);
    }

    /// @notice Transfers the NFT to the owner
    /// @param tokenId The id of the erc721
    function retrieveNFT(uint256 tokenId) external {
        // must be the owner of the NFT
        require(msg.sender == deposits[tokenId].owner, "Not the owner");
        // transfer ownership to original owner
        nonfungiblePositionManager.safeTransferFrom(
            address(this),
            msg.sender,
            tokenId
        );
        //remove information related to tokenId
        delete deposits[tokenId];
    }

    function tokenURI(uint256 tokenId) external view returns (string memory) {
        return nonfungiblePositionManager.tokenURI(tokenId);
    }
}
