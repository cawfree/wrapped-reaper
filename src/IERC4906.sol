// SPDX-License-Identifier: CC0-1.0

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/interfaces/IERC165.sol";

/// @title EIP-721 Metadata Update Extension
/// @custom:url https://eips.ethereum.org/EIPS/eip-4906#specification
interface IERC4906 is IERC165, IERC721 {
    /// @dev This event emits when the metadata of a token is changed.
    /// So that the third-party platforms such as NFT market could
    /// timely update the images and related attributes of the NFT.
    event MetadataUpdate(uint256 _tokenId);

    /// @dev This event emits when the metadata of a range of tokens is changed.
    /// So that the third-party platforms such as NFT market could
    /// timely update the images and related attributes of the NFTs.
    event BatchMetadataUpdate(uint256 _fromTokenId, uint256 _toTokenId);
}
