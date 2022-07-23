// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./SwapInterface.sol";

/** 
    MFX Membership NFTs - 3 Tier
    Author - ARRNAYA SAFU DEV (t.me/ARRN4YA)
    MetFX Watch-2-Earn Project on BSC - https://www.dextools.io/app/bnb/pair-explorer/0x48ff173df521d6231c3f879fbc1500dd477aced7

    MetFX offers three tiers of memberships - Bronze (tier 1), Silver (tier 2) & Gold (tier 3). Whitelisted wallets can
    buy the NFT of the tier that they have been whitelisted for. 1 wallet can only buy 1 NFT of any 1 tier and participate
    in Watch-2-Earn program on play.metfx.io.

    For more details regarding the earning rates and whitelist for memberships, join MetFX offical TG https://t.me/METFXWORLD
**/


interface IERC20 {
    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);

    /**
     * @dev Returns the amount of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the amount of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves `amount` tokens from the caller's account to `to`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address to, uint256 amount) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 amount) external returns (bool);

    /**
     * @dev Moves `amount` tokens from `from` to `to` using the
     * allowance mechanism. `amount` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);
}

/**
 * Stores constant shared between the token and liquidity manager contracts
 * Prevents accidental mismatches between contracts
 */
contract Shared {
    address constant public MFX = 0x6266a18F1605DA94e8317232ffa634C74646ac40; // MFX Mainnet address: 0x6266a18F1605DA94e8317232ffa634C74646ac40
    address constant public ROUTER = 0x10ED43C718714eb63d5aA57B78B54704E256024E ; // Pancakeswap Router address: 0x10ED43C718714eb63d5aA57B78B54704E256024E
}

contract TieredNFT is ERC721, Ownable, Shared {

    bool public saleIsActive = false;
    IERC20 public paymentToken;

    // Amount of wei raised
    uint256 public weiRaised;

    ISwapRouter02 public immutable swapRouter;

    // The tier struct will keep all the information about the tier
    struct Tier {
        uint256 price;
        uint256 priceInMFX;
        uint256 totalSupply;
        uint256 maxSupply;
        uint256 startingIndex;
        uint8 mintsPerAddress;
        string tierUri;
    }
    

    // Mapping used to limit the mints per tier
    mapping(uint256 => mapping(address => uint256)) addressCountsPerTier;
    // Mapping from token ID to owner address
    mapping(address => uint256) public ownedTokenId;



    // Tiered whitelisting
    mapping(address => bool) public _whitelistedForTier1;
    mapping(address => bool) public _whitelistedForTier2;
    mapping(address => bool) public _whitelistedForTier3;

    // Mapping where Tier structs are saved
    mapping (uint256=>Tier) public tiers;

    // BaseURI
    string private _baseURIextended;
    mapping(uint256 => string) private _tokenURIs;

    modifier isApprovedOrOwner(uint256 tokenId) {
        require(
            ownerOf(tokenId) == msg.sender,
            "ERC 721: Transfer caller not owner or approved"
        );
        _;
    }

    // https://stackoverflow.com/questions/64200059/solidity-problem-creating-a-struct-containing-mappings-inside-a-mapping
    constructor(string memory name, string memory symbol, address _token) ERC721(name, symbol) {
        tiers[0] = Tier({price: 0.1 ether, priceInMFX: 2000*10**18, totalSupply: 0, maxSupply: 1999999, startingIndex: 0, mintsPerAddress : 1, tierUri:"ipfs://bafkreib5fcblxyvhynbsxg47hbgsswbuxw3xuvipej7vnq5uqtpucpdeti/"});
        tiers[1] = Tier({price: 0.3 ether, priceInMFX: 4000*10**18, totalSupply: 0, maxSupply: 2999999, startingIndex: 2000000, mintsPerAddress : 1, tierUri:"ipfs://bafkreidwydtrxqt2ibj7btf5kdh6a6lnyiqsld5hcl2mgijlvxejlppvpu/"});
        tiers[2] = Tier({price: 0.5 ether, priceInMFX: 6000*10**18, totalSupply: 0, maxSupply: 3999999, startingIndex: 3000000, mintsPerAddress : 1, tierUri:"ipfs://bafkreiez4tgumh4yci2o6puwdn425jbamyksrlitkptmg3kxhzc7kmc77e/"});
        swapRouter = ISwapRouter02 (ROUTER);
        paymentToken = IERC20(_token);
    }

    // @param baseURI_ The baseURI to be used for all the NFTs
    // function setBaseURI(string memory baseURI_) external onlyOwner {
    //     _baseURIextended = baseURI_;
    // }

    // @param tokenId The tokenId of token whose URI we are changing
    // function _setTokenURI(uint256 tokenId, string memory _tokenURI) external onlyOwner{
    //     _tokenURIs[tokenId] = _tokenURI;
    // }

    function flipSaleState() public onlyOwner {
        saleIsActive = !saleIsActive;
    }
    
    function paymentInWeth() public view returns (bool) {
        return (address(paymentToken) == swapRouter.WETH());
    }

    // Collects payment if not in WETH and handles tokens with transfer taxes
    function collectPayment (address beneficiary, uint256 weiAmount) private returns (uint256) {
        if (paymentInWeth())
            return weiAmount;
        else {
            uint256 initialBalance = paymentToken.balanceOf (address(this));
            paymentToken.transferFrom (beneficiary, address(this), weiAmount);
            return paymentToken.balanceOf(address(this)) - (initialBalance);
        }
    }

    // Check the validity of receiving payment at this time - if valid then take payment (if required)
    function preValidatePurchase(address beneficiary, uint256 weiAmount) internal returns (uint256) {
        require (beneficiary != address(0), "beneficiary is the zero address");
        require (weiAmount != 0, "0 payment specified");
        return collectPayment (beneficiary, weiAmount);
    }

    // @param tier The tier of the NFT to be minted
    function mintTier1(uint tier) public payable {
        require(tier == 0, "Can only mint tier 1");
        require(saleIsActive, "Sale is not active");
        require(_whitelistedForTier1[msg.sender], "Not whitelisted for tier I");
        require(tiers[tier].totalSupply + 1 <= tiers[tier].maxSupply, "Exceeded max limit of allowed token mints");
        require(tiers[tier].price <= msg.value, "Not enough BNBs to mint the specified tier");
        require(addressCountsPerTier[tier][msg.sender] + 1 <= tiers[tier].mintsPerAddress, "Max number of mints per address reached");

        addressCountsPerTier[tier][msg.sender] = addressCountsPerTier[tier][msg.sender] + 1;
        uint256 tierTotalSuppy = tiers[tier].totalSupply;
        tiers[tier].totalSupply = tierTotalSuppy + 1;
        
        ownedTokenId[msg.sender] = tiers[tier].startingIndex + tierTotalSuppy;
        
        _safeMint(msg.sender, tiers[tier].startingIndex + tierTotalSuppy);
    }

    function mintTier1MFX(uint tier, uint256 weiAmount) public payable {
        address beneficiary = _msgSender();
        require(tier == 0, "Can only mint tier 1");
        require(saleIsActive, "Sale is not active");
        require(_whitelistedForTier1[msg.sender], "Not whitelisted for tier I");
        require(tiers[tier].totalSupply + 1 <= tiers[tier].maxSupply, "Exceeded max limit of allowed token mints");
        require(tiers[tier].priceInMFX <= weiAmount, "Not enough MFX to mint the specified tier");
        require(addressCountsPerTier[tier][msg.sender] + 1 <= tiers[tier].mintsPerAddress, "Max number of mints per address reached");
        uint256 paymentTransferred = preValidatePurchase (beneficiary, weiAmount);
        require (paymentTransferred > 0, "issue collecting payment");

        addressCountsPerTier[tier][msg.sender] = addressCountsPerTier[tier][msg.sender] + 1;
        uint256 tierTotalSuppy = tiers[tier].totalSupply;
        tiers[tier].totalSupply = tierTotalSuppy + 1;
        
        ownedTokenId[msg.sender] = tiers[tier].startingIndex + tierTotalSuppy;
        
        _safeMint(msg.sender, tiers[tier].startingIndex + tierTotalSuppy);

        // update state
        weiRaised = weiRaised + paymentTransferred;
    }

    function mintTier2(uint tier) public payable {
        require(tier == 1, "Can only mint tier 2");
        require(saleIsActive, "Sale is not active");
        require(_whitelistedForTier2[msg.sender], "Not whitelisted for tier II");
        require(tiers[tier].totalSupply + 1 <= tiers[tier].maxSupply, "Exceeded max limit of allowed token mints");
        require(tiers[tier].price <= msg.value, "Not enough BNBs to mint the specified tier");
        require(addressCountsPerTier[tier][msg.sender] + 1 <= tiers[tier].mintsPerAddress, "Max number of mints per address reached");

        addressCountsPerTier[tier][msg.sender] = addressCountsPerTier[tier][msg.sender] + 1;
        uint256 tierTotalSuppy = tiers[tier].totalSupply;
        tiers[tier].totalSupply = tierTotalSuppy + 1;

        ownedTokenId[msg.sender] = tiers[tier].startingIndex + tierTotalSuppy;

        _safeMint(msg.sender, tiers[tier].startingIndex + tierTotalSuppy);
        
    }

    function mintTier2MFX(uint tier, uint256 weiAmount) public payable {
        address beneficiary = _msgSender();
        require(tier == 1, "Can only mint tier 2");
        require(saleIsActive, "Sale is not active");
        require(_whitelistedForTier2[msg.sender], "Not whitelisted for tier II");
        require(tiers[tier].totalSupply + 1 <= tiers[tier].maxSupply, "Exceeded max limit of allowed token mints");
        require(tiers[tier].priceInMFX <= weiAmount, "Not enough BNBs to mint the specified tier");
        require(addressCountsPerTier[tier][msg.sender] + 1 <= tiers[tier].mintsPerAddress, "Max number of mints per address reached");
        uint256 paymentTransferred = preValidatePurchase (beneficiary, weiAmount);
        require (paymentTransferred > 0, "issue collecting payment");

        addressCountsPerTier[tier][msg.sender] = addressCountsPerTier[tier][msg.sender] + 1;
        uint256 tierTotalSuppy = tiers[tier].totalSupply;
        tiers[tier].totalSupply = tierTotalSuppy + 1;
        
        ownedTokenId[msg.sender] = tiers[tier].startingIndex + tierTotalSuppy;
        
        _safeMint(msg.sender, tiers[tier].startingIndex + tierTotalSuppy);

        // update state
        weiRaised = weiRaised + paymentTransferred;
    }

    function mintTier3(uint tier) public payable {
        require(tier == 2, "Can only mint tier 3");
        require(saleIsActive, "Sale is not active");
        require(_whitelistedForTier3[msg.sender], "Not whitelisted for tier III");
        require(tiers[tier].totalSupply + 1 <= tiers[tier].maxSupply, "Exceeded max limit of allowed token mints");
        require(tiers[tier].price <= msg.value, "Not enough BNBs to mint the specified tier");
        require(addressCountsPerTier[tier][msg.sender] + 1 <= tiers[tier].mintsPerAddress, "Max number of mints per address reached");

        addressCountsPerTier[tier][msg.sender] = addressCountsPerTier[tier][msg.sender] + 1;
        uint256 tierTotalSuppy = tiers[tier].totalSupply;
        tiers[tier].totalSupply = tierTotalSuppy + 1;

        ownedTokenId[msg.sender] = tiers[tier].startingIndex + tierTotalSuppy;
        
        _safeMint(msg.sender, tiers[tier].startingIndex + tierTotalSuppy);
        
    }

    function mintTier3MFX(uint tier, uint256 weiAmount) public payable {
        address beneficiary = _msgSender();
        require(tier == 2, "Can only mint tier 3");
        require(saleIsActive, "Sale is not active");
        require(_whitelistedForTier3[msg.sender], "Not whitelisted for tier III");
        require(tiers[tier].totalSupply + 1 <= tiers[tier].maxSupply, "Exceeded max limit of allowed token mints");
        require(tiers[tier].priceInMFX <= weiAmount, "Not enough BNBs to mint the specified tier");
        require(addressCountsPerTier[tier][msg.sender] + 1 <= tiers[tier].mintsPerAddress, "Max number of mints per address reached");
        uint256 paymentTransferred = preValidatePurchase (beneficiary, weiAmount);
        require (paymentTransferred > 0, "issue collecting payment");

        addressCountsPerTier[tier][msg.sender] = addressCountsPerTier[tier][msg.sender] + 1;
        uint256 tierTotalSuppy = tiers[tier].totalSupply;
        tiers[tier].totalSupply = tierTotalSuppy + 1;
        
        ownedTokenId[msg.sender] = tiers[tier].startingIndex + tierTotalSuppy;
        
        _safeMint(msg.sender, tiers[tier].startingIndex + tierTotalSuppy);

        // update state
        weiRaised = weiRaised + paymentTransferred;
    }

    //@dev can use this function to bulk whitelist wallet address for different tiers of NFTs

    function bulkWhitelistTier1(address[] memory accounts, bool state) external onlyOwner{
        for(uint256 i =0; i < accounts.length; i++){
            _whitelistedForTier1[accounts[i]] = state;

        }
    }

    function bulkWhitelistTier2(address[] memory accounts, bool state) external onlyOwner{
        for(uint256 i =0; i < accounts.length; i++){
            _whitelistedForTier2[accounts[i]] = state;

        }
    }

    function bulkWhitelistTier3(address[] memory accounts, bool state) external onlyOwner{
        for(uint256 i =0; i < accounts.length; i++){
            _whitelistedForTier3[accounts[i]] = state;

        }
    }

    //whitelist ends


    // @dev can use these functions to update the price and maxSupply for the tiers of NFTs
    function updateTier1(uint256 _newPrice, uint256 _mfxPrice, uint256 _newMaxSupply, uint8 _perWalletLimit, string memory _newUri) external onlyOwner {
        tiers[0].price = _newPrice;
        tiers[0].maxSupply = _newMaxSupply;
        tiers[0].mintsPerAddress = _perWalletLimit;
        tiers[0].tierUri = _newUri;
        tiers[0].priceInMFX = _mfxPrice * 10**18;
    }

    function updateTier2(uint256 _newPrice, uint256 _mfxPrice, uint256 _newMaxSupply, uint8 _perWalletLimit, string memory _newUri) external onlyOwner {
        tiers[1].price = _newPrice;
        tiers[1].maxSupply = _newMaxSupply;
        tiers[1].mintsPerAddress = _perWalletLimit;
        tiers[1].tierUri = _newUri;
        tiers[1].priceInMFX = _mfxPrice * 10**18;
    }

    function updateTier3(uint256 _newPrice, uint256 _mfxPrice, uint256 _newMaxSupply, uint8 _perWalletLimit, string memory _newUri) external onlyOwner {
        tiers[2].price = _newPrice;
        tiers[2].maxSupply = _newMaxSupply;
        tiers[2].mintsPerAddress = _perWalletLimit;
        tiers[2].tierUri = _newUri;
        tiers[2].priceInMFX = _mfxPrice * 10**18;
        
    }

    //Tier update ends

    //@dev can withdraw funds

    function withdraw() public onlyOwner {
        uint balance = address(this).balance;
        payable(msg.sender).transfer(balance);
    }

    function withdrawToken (address _token, address _account) external onlyOwner {
        require (_token != address(0), "FINU: Can't withdraw a token of zero address");
        require (_account != address(0), "FINU: Can't withdraw to the zero address");
        
        uint256 tokenBalance = IERC20(_token).balanceOf (address(this));
        
        if (tokenBalance > 0)
            IERC20(_token).transfer (_account, tokenBalance);
    }

    /* ========== VIEW METHODS ========== */


    // @param tier The tier of which the total supply should be returned
    // @return The total supply of the specified tier
    function tierTotalSupply(uint256 tier) external view returns (uint256) {
        return tiers[tier].totalSupply;
    }
    
    // @param tier The tier of which the price should be returned
    // @return The price of the specified tier
    function tierPrice(uint256 tier) external view returns (uint256) {
        return tiers[tier].price;
    }

    // @param tier The tier of which the URI should be returned
    // @return The URI of the specified tier
    function tokenUri(uint256 tokenId) public pure returns(string memory) {
        if(tokenId >= 0 || tokenId <= 1999999)
        return(
            string(abi.encodePacked(
                "ipfs://bafkreib5fcblxyvhynbsxg47hbgsswbuxw3xuvipej7vnq5uqtpucpdeti/"
            ))
        );
        else if(tokenId >= 2000000 || tokenId <= 2999999)
        return(
            string(abi.encodePacked(
                "ipfs://bafkreidwydtrxqt2ibj7btf5kdh6a6lnyiqsld5hcl2mgijlvxejlppvpu/"
            ))
        );
        else if(tokenId >= 3000000 || tokenId <= 3999999)
        return(
            string(abi.encodePacked(
                "ipfs://bafkreiez4tgumh4yci2o6puwdn425jbamyksrlitkptmg3kxhzc7kmc77e/"
            ))
        );
    }

    // @param tier The tier of which the max supply rice should be returned
    // @return The max supply of the specified tier
    function tierMaxSupply(uint256 tier) external view returns (uint256) {
        return tiers[tier].maxSupply;
    }

    // @return The max supply of all tiers summed up
    function totalMaxSupply() external view returns (uint256) {
        return tiers[0].maxSupply + tiers[1].maxSupply + tiers[2].maxSupply;
    }

    function updatePaymentToken(address _token) external onlyOwner {
        require(_token != address(0), "Can not set to dead address");
        paymentToken = IERC20(_token);
    }

    // @return The tokenURI of a specific tokenId
    // function tokenURI(uint256 tokenId) public view virtual override returns (string memory){
    //     return string(abi.encodePacked(_baseURIextended, _tokenURIs[tokenId]));
    // }

}