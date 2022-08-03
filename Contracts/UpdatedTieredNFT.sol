/** 
    MFX Membership NFTs - 3 Tier
    Author - ARRNAYA SAFU DEV (t.me/ARRN4YA)
    MetFX Watch-2-Earn Project on BSC - https://www.dextools.io/app/bnb/pair-explorer/0x48ff173df521d6231c3f879fbc1500dd477aced7

    MetFX offers three tiers of memberships - Bronze (tier 1), Silver (tier 2) & Gold (tier 3). Whitelisted wallets can
    buy the NFT of the tier that they have been whitelisted for. 1 wallet can only buy 1 NFT of any 1 tier and participate
    in Watch-2-Earn program on play.metfx.io.

    For more details regarding the earning rates and whitelist for memberships, join MetFX offical TG https://t.me/METFXWORLD
**/

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./SwapInterface.sol";

interface IERC20 {
    /**
     * @dev Emitted when value tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that value may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a spender for an owner is set by
     * a call to {approve}. value is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);

    /**
     * @dev Returns the amount of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the amount of tokens owned by account.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves amount tokens from the caller's account to to.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address to, uint256 amount) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that spender will be
     * allowed to spend on behalf of owner through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Sets amount as the allowance of spender over the caller's tokens.
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
     * @dev Moves amount tokens from from to to using the
     * allowance mechanism. amount is then deducted from the caller's
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

/**
 * @dev Implementation of https://eips.ethereum.org/EIPS/eip-721[ERC721] Non-Fungible Token Standard, including
 * the Metadata extension, but not including the Enumerable extension, which is available separately as
 * {ERC721Enumerable}.
 */
contract ERC721 is Context, ERC165, IERC721, IERC721Metadata, Shared, Ownable {
    using Address for address;
    using Strings for uint256;

    bool public saleIsActive = true;
    IERC20 public paymentToken;

    // Amount of wei raised
    uint256 public mfxRaised;

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
    mapping(address => bool) public _whitelistedAdmin;

    // Mapping where Tier structs are saved
    mapping (uint256 => Tier) public tiers;

    // BaseURI
    string private _baseURIextended;
    mapping(uint256 => string) private _tokenURIs;

    // Token name
    string private _name;

    // Token symbol
    string private _symbol;

    // Mapping from token ID to owner address
    mapping(uint256 => address) private _owners;

    // Mapping owner address to token count
    mapping(address => uint256) private _balances;

    // Mapping from token ID to approved address
    mapping(uint256 => address) private _tokenApprovals;

    // Mapping from owner to operator approvals
    mapping(address => mapping(address => bool)) private _operatorApprovals;

    /**
     * @dev Initializes the contract by setting a `name` and a `symbol` to the token collection.
     */
    // https://stackoverflow.com/questions/64200059/solidity-problem-creating-a-struct-containing-mappings-inside-a-mapping
    constructor(string memory name, string memory symbol, address _token) {
        tiers[0] = Tier({price: 0.15 ether, priceInMFX: 2000*10**18, totalSupply: 0, maxSupply: 1999999, startingIndex: 0, mintsPerAddress : 1, tierUri:"ipfs://bafkreibyyn4l323rypnwq4a7k6sqfo6fjuu36buyu7zfir5ysxoh56s4ii/"});
        tiers[1] = Tier({price: 0.3 ether, priceInMFX: 4000*10**18, totalSupply: 0, maxSupply: 2999999, startingIndex: 2000000, mintsPerAddress : 1, tierUri:"ipfs://bafkreiejkesjbris5735m3dmk2xn42ckromgiridxnfhcldoqjb2xhufcq/"});
        tiers[2] = Tier({price: 0.45 ether, priceInMFX: 6000*10**18, totalSupply: 0, maxSupply: 3999999, startingIndex: 3000000, mintsPerAddress : 1, tierUri:"ipfs://bafkreihraqvhc4ycqdkjeeu6dvuqns2bn3ngrbrfwn7x4gkvcbm4joy4qq/"});
        swapRouter = ISwapRouter02 (ROUTER);
        paymentToken = IERC20(_token);
        _name = name;
        _symbol = symbol;
    }

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
    function mintNFT(uint tier) public payable {
        require(saleIsActive, "Sale is not active");
        //require(_whitelistedForTier1[msg.sender], "Not whitelisted for tier I");
        require(tiers[tier].totalSupply + 1 <= tiers[tier].maxSupply, "Exceeded max limit of allowed token mints");
        require(tiers[tier].price <= msg.value, "Not enough BNBs to mint the specified tier");
        //require(addressCountsPerTier[tier][msg.sender] + 1 <= tiers[tier].mintsPerAddress, "Max number of mints per address reached");
        require(addressCountsPerTier[tier][msg.sender] + 1 <= tiers[tier].mintsPerAddress, "Max number of mints per address reached");

            addressCountsPerTier[tier][msg.sender] = addressCountsPerTier[tier][msg.sender] + 1;
            uint256 tierTotalSuppy = tiers[tier].totalSupply;
            tiers[tier].totalSupply = tierTotalSuppy + 1;
        
            ownedTokenId[msg.sender] = tiers[tier].startingIndex + tierTotalSuppy;

            _safeMint(msg.sender, tiers[tier].startingIndex + tierTotalSuppy);
    }

    // @param whitelisted wallets can mint unlimited NFTs
    function mintNFTAdmin(uint tier, address to) public {
        require(_whitelistedAdmin[msg.sender], "Not whitelisted as admin");
        require(tiers[tier].totalSupply + 1 <= tiers[tier].maxSupply, "Exceeded max limit of allowed token mints");
        //require(tiers[tier].price <= msg.value, "Not enough BNBs to mint the specified tier");
        //require(addressCountsPerTier[tier][msg.sender] + 1 <= tiers[tier].mintsPerAddress, "Max number of mints per address reached");

            addressCountsPerTier[tier][to] = addressCountsPerTier[tier][to] + 1;
            uint256 tierTotalSuppy = tiers[tier].totalSupply;
            tiers[tier].totalSupply = tierTotalSuppy + 1;
        
            ownedTokenId[to] = tiers[tier].startingIndex + tierTotalSuppy;

            _safeMint(to, tiers[tier].startingIndex + tierTotalSuppy);
    }

    function mintMFX(uint tier, uint256 weiAmount) public payable {
        address beneficiary = _msgSender();
        require(saleIsActive, "Sale is not active");
        //require(_whitelistedForTier1[msg.sender], "Not whitelisted for tier I");
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
        mfxRaised = mfxRaised + paymentTransferred;
    }

    //@dev can use this function to bulk whitelist wallet address to mint free NFTs
    function whitelistAdmin(address wallet, bool state) external onlyOwner {
        require(wallet != address(0), "Can't set admin to zero address");
        _whitelistedAdmin[wallet] = state;
    }

    // @dev can use these functions to update the price and maxSupply for the tiers of NFTs
    function updateTierPrice(uint tier, uint256 _newPrice, uint256 _mfxPrice) external onlyOwner {
        tiers[tier].price = _newPrice;
        tiers[tier].priceInMFX = _mfxPrice * 10**18;
    }

    function updateTierDetails(uint tier, uint256 _newMaxSupply, uint8 _perWalletLimit, string memory _newUri) external onlyOwner {
        tiers[tier].maxSupply = _newMaxSupply;
        tiers[tier].mintsPerAddress = _perWalletLimit;
        tiers[tier].tierUri = _newUri;
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

    // @param tier The tier of which the URI should be returned
    // @return The URI of the specified tier
    function tokenUri(uint256 tokenId) public pure returns(string memory) {
        if(tokenId >= 0 && tokenId <= 1999999)
        return(
            string(abi.encodePacked(
                "ipfs://bafkreibyyn4l323rypnwq4a7k6sqfo6fjuu36buyu7zfir5ysxoh56s4ii/"
            ))
        );
        else if(tokenId >= 2000000 && tokenId <= 2999999)
        return(
            string(abi.encodePacked(
                "ipfs://bafkreiejkesjbris5735m3dmk2xn42ckromgiridxnfhcldoqjb2xhufcq/"
            ))
        );
        else if(tokenId >= 3000000 && tokenId <= 3999999)
        return(
            string(abi.encodePacked(
                "ipfs://bafkreihraqvhc4ycqdkjeeu6dvuqns2bn3ngrbrfwn7x4gkvcbm4joy4qq/"
            ))
        );
    }

    function updatePaymentToken(address _token) external onlyOwner {
        require(_token != address(0), "Can not set to dead address");
        paymentToken = IERC20(_token);
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165, IERC165) returns (bool) {
        return
            interfaceId == type(IERC721).interfaceId ||
            interfaceId == type(IERC721Metadata).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    /**
     * @dev See {IERC721-balanceOf}.
     */
    function balanceOf(address owner) public view virtual override returns (uint256) {
        require(owner != address(0), "ERC721: address zero is not a valid owner");
        return _balances[owner];
    }

    /**
     * @dev See {IERC721-ownerOf}.
     */
    function ownerOf(uint256 tokenId) public view virtual override returns (address) {
        address owner = _owners[tokenId];
        require(owner != address(0), "ERC721: invalid token ID");
        return owner;
    }

    /**
     * @dev See {IERC721Metadata-name}.
     */
    function name() public view virtual override returns (string memory) {
        return _name;
    }

    /**
     * @dev See {IERC721Metadata-symbol}.
     */
    function symbol() public view virtual override returns (string memory) {
        return _symbol;
    }


    /**
     * @dev See {IERC721Metadata-tokenURI}.
     */
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        _requireMinted(tokenId);

        string memory baseURI = _baseURI();
        return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, tokenId.toString())) : "";
    }

    /**
     * @dev Base URI for computing {tokenURI}. If set, the resulting URI for each
     * token will be the concatenation of the `baseURI` and the `tokenId`. Empty
     * by default, can be overridden in child contracts.
     */
    function _baseURI() internal view virtual returns (string memory) {
        return "";
    }

    /**
     * @dev See {IERC721-approve}.
     */
    function approve(address to, uint256 tokenId) public virtual override {
        address owner = ERC721.ownerOf(tokenId);
        require(to != owner, "ERC721: approval to current owner");

        require(
            _msgSender() == owner || isApprovedForAll(owner, _msgSender()),
            "ERC721: approve caller is not token owner or approved for all"
        );

        _approve(to, tokenId);
    }

    /**
     * @dev See {IERC721-getApproved}.
     */
    function getApproved(uint256 tokenId) public view virtual override returns (address) {
        _requireMinted(tokenId);

        return _tokenApprovals[tokenId];
    }

    /**
     * @dev See {IERC721-setApprovalForAll}.
     */
    function setApprovalForAll(address operator, bool approved) public virtual override {
        _setApprovalForAll(_msgSender(), operator, approved);
    }

    /**
     * @dev See {IERC721-isApprovedForAll}.
     */
    function isApprovedForAll(address owner, address operator) public view virtual override returns (bool) {
        return _operatorApprovals[owner][operator];
    }

    /**
     * @dev See {IERC721-transferFrom}.
     */
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override {
        //solhint-disable-next-line max-line-length
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: caller is not token owner or approved");

        _transfer(from, to, tokenId);
    }

    /**
     * @dev See {IERC721-safeTransferFrom}.
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override {
        safeTransferFrom(from, to, tokenId, "");
    }

    /**
     * @dev See {IERC721-safeTransferFrom}.
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory data
    ) public virtual override {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: caller is not token owner or approved");
        _safeTransfer(from, to, tokenId, data);
    }

    /**
     * @dev Safely transfers `tokenId` token from `from` to `to`, checking first that contract recipients
     * are aware of the ERC721 protocol to prevent tokens from being forever locked.
     *
     * `data` is additional data, it has no specified format and it is sent in call to `to`.
     *
     * This internal function is equivalent to {safeTransferFrom}, and can be used to e.g.
     * implement alternative mechanisms to perform token transfer, such as signature-based.
     *
     * Requirements:
     *
     * - `from` cannot be the zero address.
     * - `to` cannot be the zero address.
     * - `tokenId` token must exist and be owned by `from`.
     * - If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.
     *
     * Emits a {Transfer} event.
     */
    function _safeTransfer(
        address from,
        address to,
        uint256 tokenId,
        bytes memory data
    ) internal virtual {
        _transfer(from, to, tokenId);
        require(_checkOnERC721Received(from, to, tokenId, data), "ERC721: transfer to non ERC721Receiver implementer");
    }

    /**
     * @dev Returns whether `tokenId` exists.
     *
     * Tokens can be managed by their owner or approved accounts via {approve} or {setApprovalForAll}.
     *
     * Tokens start existing when they are minted (`_mint`),
     * and stop existing when they are burned (`_burn`).
     */
    function _exists(uint256 tokenId) internal view virtual returns (bool) {
        return _owners[tokenId] != address(0);
    }

    /**
     * @dev Returns whether `spender` is allowed to manage `tokenId`.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     */
    function _isApprovedOrOwner(address spender, uint256 tokenId) internal view virtual returns (bool) {
        address owner = ERC721.ownerOf(tokenId);
        return (spender == owner || isApprovedForAll(owner, spender) || getApproved(tokenId) == spender);
    }

    /**
     * @dev Safely mints `tokenId` and transfers it to `to`.
     *
     * Requirements:
     *
     * - `tokenId` must not exist.
     * - If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.
     *
     * Emits a {Transfer} event.
     */
    function _safeMint(address to, uint256 tokenId) internal virtual {
        _safeMint(to, tokenId, "");
    }

    /**
     * @dev Same as {xref-ERC721-_safeMint-address-uint256-}[`_safeMint`], with an additional `data` parameter which is
     * forwarded in {IERC721Receiver-onERC721Received} to contract recipients.
     */
    function _safeMint(
        address to,
        uint256 tokenId,
        bytes memory data
    ) internal virtual {
        _mint(to, tokenId);
        require(
            _checkOnERC721Received(address(0), to, tokenId, data),
            "ERC721: transfer to non ERC721Receiver implementer"
        );
    }

    /**
     * @dev Mints `tokenId` and transfers it to `to`.
     *
     * WARNING: Usage of this method is discouraged, use {_safeMint} whenever possible
     *
     * Requirements:
     *
     * - `tokenId` must not exist.
     * - `to` cannot be the zero address.
     *
     * Emits a {Transfer} event.
     */
    function _mint(address to, uint256 tokenId) internal virtual {
        require(to != address(0), "ERC721: mint to the zero address");
        require(!_exists(tokenId), "ERC721: token already minted");

        _beforeTokenTransfer(address(0), to, tokenId);

        _balances[to] += 1;
        _owners[tokenId] = to;

        emit Transfer(address(0), to, tokenId);

        _afterTokenTransfer(address(0), to, tokenId);
    }

    /**
     * @dev Destroys `tokenId`.
     * The approval is cleared when the token is burned.
     * This is an internal function that does not check if the sender is authorized to operate on the token.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     *
     * Emits a {Transfer} event.
     */
    function _burn(uint256 tokenId) internal virtual {
        address owner = ERC721.ownerOf(tokenId);

        _beforeTokenTransfer(owner, address(0), tokenId);

        // Clear approvals
        delete _tokenApprovals[tokenId];

        _balances[owner] -= 1;
        delete _owners[tokenId];

        emit Transfer(owner, address(0), tokenId);

        _afterTokenTransfer(owner, address(0), tokenId);
    }

    /**
     * @dev Transfers `tokenId` from `from` to `to`.
     *  As opposed to {transferFrom}, this imposes no restrictions on msg.sender.
     *
     * Requirements:
     *
     * - `to` cannot be the zero address.
     * - `tokenId` token must be owned by `from`.
     *
     * Emits a {Transfer} event.
     */
    function _transfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual {
        require(ERC721.ownerOf(tokenId) == from, "ERC721: transfer from incorrect owner");
        require(to != address(0), "ERC721: transfer to the zero address");

        _beforeTokenTransfer(from, to, tokenId);

        // Clear approvals from the previous owner
        delete _tokenApprovals[tokenId];

        _balances[from] -= 1;
        _balances[to] += 1;
        _owners[tokenId] = to;

        emit Transfer(from, to, tokenId);

        _afterTokenTransfer(from, to, tokenId);
    }

    /**
     * @dev Approve `to` to operate on `tokenId`
     *
     * Emits an {Approval} event.
     */
    function _approve(address to, uint256 tokenId) internal virtual {
        _tokenApprovals[tokenId] = to;
        emit Approval(ERC721.ownerOf(tokenId), to, tokenId);
    }

    /**
     * @dev Approve `operator` to operate on all of `owner` tokens
     *
     * Emits an {ApprovalForAll} event.
     */
    function _setApprovalForAll(
        address owner,
        address operator,
        bool approved
    ) internal virtual {
        require(owner != operator, "ERC721: approve to caller");
        _operatorApprovals[owner][operator] = approved;
        emit ApprovalForAll(owner, operator, approved);
    }

    /**
     * @dev Reverts if the `tokenId` has not been minted yet.
     */
    function _requireMinted(uint256 tokenId) internal view virtual {
        require(_exists(tokenId), "ERC721: invalid token ID");
    }

    /**
     * @dev Internal function to invoke {IERC721Receiver-onERC721Received} on a target address.
     * The call is not executed if the target address is not a contract.
     *
     * @param from address representing the previous owner of the given token ID
     * @param to target address that will receive the tokens
     * @param tokenId uint256 ID of the token to be transferred
     * @param data bytes optional data to send along with the call
     * @return bool whether the call correctly returned the expected magic value
     */
    function _checkOnERC721Received(
        address from,
        address to,
        uint256 tokenId,
        bytes memory data
    ) private returns (bool) {
        if (to.isContract()) {
            try IERC721Receiver(to).onERC721Received(_msgSender(), from, tokenId, data) returns (bytes4 retval) {
                return retval == IERC721Receiver.onERC721Received.selector;
            } catch (bytes memory reason) {
                if (reason.length == 0) {
                    revert("ERC721: transfer to non ERC721Receiver implementer");
                } else {
                    /// @solidity memory-safe-assembly
                    assembly {
                        revert(add(32, reason), mload(reason))
                    }
                }
            }
        } else {
            return true;
        }
    }

    /**
     * @dev Hook that is called before any token transfer. This includes minting
     * and burning.
     *
     * Calling conditions:
     *
     * - When `from` and `to` are both non-zero, ``from``'s `tokenId` will be
     * transferred to `to`.
     * - When `from` is zero, `tokenId` will be minted for `to`.
     * - When `to` is zero, ``from``'s `tokenId` will be burned.
     * - `from` and `to` are never both zero.
     *
     * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual {}

    /**
     * @dev Hook that is called after any transfer of tokens. This includes
     * minting and burning.
     *
     * Calling conditions:
     *
     * - when `from` and `to` are both non-zero.
     * - `from` and `to` are never both zero.
     *
     * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
     */
    function _afterTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual {}
}