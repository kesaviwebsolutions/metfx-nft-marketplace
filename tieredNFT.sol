// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

/** 
    - MFX Membership NFTs - 3 Tier
    - ARRNAYA SAFU DEV (t.me/ARRN4YA)
    - MetFX Watch-To-Earn Project on BSC
**/
contract TieredNFT is ERC721, Ownable {

    bool public saleIsActive = false;

    // The tier struct will keep all the information about the tier
    struct Tier {
        uint256 price;
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
    mapping (uint256=>Tier) tiers;

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
    constructor(string memory name, string memory symbol) ERC721(name, symbol) {
        tiers[0] = Tier({price: 0.18 ether, totalSupply: 0, maxSupply: 1999999, startingIndex: 0, mintsPerAddress : 1, tierUri:"https://ipfs.io/ipfs/QmPCWHpqeYKyVVw3LHkDwK5zUnMwqwuJMyGE6PTwyTCaYN?filename=watch-2-earn-bronze.mp4"});
        tiers[1] = Tier({price: 0.36 ether, totalSupply: 0, maxSupply: 2999999, startingIndex: 2000000, mintsPerAddress : 1, tierUri:"https://ipfs.io/ipfs/QmZ6iRPVvwMxSYa2dtWemjp5swCD7kNcyDRdGVL6isNMbx?filename=watch-2-earn-silver.mp4"});
        tiers[2] = Tier({price: 0.54 ether, totalSupply: 0, maxSupply: 3999999, startingIndex: 3000000, mintsPerAddress : 1, tierUri:"https://ipfs.io/ipfs/QmQ4GCBvBDWVaefjBr4PsmqLDSS6y4Rjyxo3YxKgqmuNc8?filename=watch-2-earn-gold.mp4"});
    }

    // @param baseURI_ The baseURI to be used for all the NFTs
    function setBaseURI(string memory baseURI_) external onlyOwner {
        _baseURIextended = baseURI_;
    }

    // @param tokenId The tokenId of token whose URI we are changing
    function _setTokenURI(uint256 tokenId, string memory _tokenURI) external onlyOwner{
        _tokenURIs[tokenId] = _tokenURI;
    }

    function flipSaleState() public onlyOwner {
        saleIsActive = !saleIsActive;
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

    function mintTier2(uint tier) public payable {
        require(tier == 1, "Can only mint tier 2");
        require(saleIsActive, "Sale is not active");
        require(_whitelistedForTier2[msg.sender], "Not whitelisted for tier I");
        require(tiers[tier].totalSupply + 1 <= tiers[tier].maxSupply, "Exceeded max limit of allowed token mints");
        require(tiers[tier].price <= msg.value, "Not enough BNBs to mint the specified tier");
        require(addressCountsPerTier[tier][msg.sender] + 1 <= tiers[tier].mintsPerAddress, "Max number of mints per address reached");

        addressCountsPerTier[tier][msg.sender] = addressCountsPerTier[tier][msg.sender] + 1;
        uint256 tierTotalSuppy = tiers[tier].totalSupply;
        tiers[tier].totalSupply = tierTotalSuppy + 1;

        ownedTokenId[msg.sender] = tiers[tier].startingIndex + tierTotalSuppy;

        _safeMint(msg.sender, tiers[tier].startingIndex + tierTotalSuppy);
        
    }

    function mintTier3(uint tier) public payable {
        require(tier == 2, "Can only mint tier 3");
        require(saleIsActive, "Sale is not active");
        require(_whitelistedForTier3[msg.sender], "Not whitelisted for tier I");
        require(tiers[tier].totalSupply + 1 <= tiers[tier].maxSupply, "Exceeded max limit of allowed token mints");
        require(tiers[tier].price <= msg.value, "Not enough BNBs to mint the specified tier");
        require(addressCountsPerTier[tier][msg.sender] + 1 <= tiers[tier].mintsPerAddress, "Max number of mints per address reached");

        addressCountsPerTier[tier][msg.sender] = addressCountsPerTier[tier][msg.sender] + 1;
        uint256 tierTotalSuppy = tiers[tier].totalSupply;
        tiers[tier].totalSupply = tierTotalSuppy + 1;

        ownedTokenId[msg.sender] = tiers[tier].startingIndex + tierTotalSuppy;
        
        _safeMint(msg.sender, tiers[tier].startingIndex + tierTotalSuppy);
        
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
    function updateTier1(uint256 _newPrice, uint256 _newMaxSupply, uint8 _perWalletLimit, string memory _newUri) external onlyOwner {
        tiers[0].price = _newPrice;
        tiers[0].maxSupply = _newMaxSupply;
        tiers[0].mintsPerAddress = _perWalletLimit;
        tiers[0].tierUri = _newUri;
    }

    function updateTier2(uint256 _newPrice, uint256 _newMaxSupply, uint8 _perWalletLimit, string memory _newUri) external onlyOwner {
        tiers[1].price = _newPrice;
        tiers[1].maxSupply = _newMaxSupply;
        tiers[1].mintsPerAddress = _perWalletLimit;
        tiers[1].tierUri = _newUri;
    }

    function updateTier3(uint256 _newPrice, uint256 _newMaxSupply, uint8 _perWalletLimit, string memory _newUri) external onlyOwner {
        tiers[2].price = _newPrice;
        tiers[2].maxSupply = _newMaxSupply;
        tiers[2].mintsPerAddress = _perWalletLimit;
        tiers[2].tierUri = _newUri;
    }

    //Tier update ends

    function withdraw() public onlyOwner {
        uint balance = address(this).balance;
        payable(msg.sender).transfer(balance);
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
    function tierURI(uint256 tier) external view returns (uint256) {
        return tiers[tier].tierUri;
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

    // @return The tokenURI of a specific tokenId
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory){
        return string(abi.encodePacked(_baseURIextended, _tokenURIs[tokenId]));
    }

}