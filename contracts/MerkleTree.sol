// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;


contract MerkleTree{

  uint32 public levels;
  
  // merkle leafs
  mapping (uint256 => bytes32) public commitmentLeafs; //TODO remove this and use event scanning instead
  mapping(uint256 => bytes32) public filledSubtrees;
  mapping(uint256 => bytes32) public roots;
  uint32 public constant ROOT_HISTORY_SIZE = 30;
  uint32 public currentRootIndex = 0;
  uint32 public nextIndex = 0;

  constructor(uint32 _levels) {
    require(_levels > 0, "_levels should be greater than zero");
    require(_levels < 20, "_levels should be less than 20");
    levels = _levels;

    for (uint32 i = 0; i < _levels; i++) {
      filledSubtrees[i] = zeros(i);
    }

    roots[0] = zeros(_levels);
  }

  /**
    @dev Hash 2 tree leaves, returns keccak256(_left, _right)
  */
  function hashLeftRight(
    bytes32 _left,
    bytes32 _right
  ) public pure returns (bytes32) {
    return keccak256(abi.encodePacked(_left, _right)); 
  }

  function _insert(bytes32 _leaf) internal returns (uint32 index) {
    uint32 _nextIndex = nextIndex;
    require(_nextIndex != uint32(2)**levels, "Merkle tree is full. No more leaves can be added");
    uint32 currentIndex = _nextIndex;
    bytes32 currentLevelHash = _leaf;
    bytes32 left;
    bytes32 right;

    for (uint32 i = 0; i < levels; i++) {
      if (currentIndex % 2 == 0) {
        left = currentLevelHash;
        right = zeros(i);
        filledSubtrees[i] = currentLevelHash;
      } else {
        left = filledSubtrees[i];
        right = currentLevelHash;
      }
      currentLevelHash = hashLeftRight(left, right);
      currentIndex /= 2;
    }

    uint32 newRootIndex = (currentRootIndex + 1) % ROOT_HISTORY_SIZE;
    currentRootIndex = newRootIndex;
    roots[newRootIndex] = currentLevelHash;
    commitmentLeafs[_nextIndex] = _leaf; //storing leaf into mapping with the current index
    nextIndex = _nextIndex + 1;
    return _nextIndex;
  }

  /**
    @dev Whether the root is present in the root history
  */
  function isKnownRoot(bytes32 _root) internal view returns (bool) {
    if (_root == 0) {
      return false;
    }
    uint32 _currentRootIndex = currentRootIndex;
    uint32 i = _currentRootIndex;
    do {
      if (_root == roots[i]) {
        return true;
      }
      if (i == 0) {
        i = ROOT_HISTORY_SIZE;
      }
      i--;
    } while (i != _currentRootIndex);
    return false;
  }

  /**
    @dev Returns the last root
  */
  function getLastRoot() public view returns (bytes32) {
    return roots[currentRootIndex];
  }

  /// @dev provides Zero (Empty) elements for a keccka MerkleTree. Up to 32 levels
  function zeros(uint256 i) public pure returns (bytes32) {
         if (i == 0) return bytes32(0x2fe54c60d3acabf3343a35b6eba15db4821b340f76e741e2249685ed4899af6c);
    else if (i == 1) return bytes32(0x4fc2fe9184a25f44ce8ddb5f32671fcae6d9c85ed710c199acef16ad16b29911);
    else if (i == 2) return bytes32(0x0d826a474f851c563052d929ef0daa70f658aba9ba084f51f6e3483c13c0e59a);
    else if (i == 3) return bytes32(0xf7761a16b5e4c0120e4c5704b910dbe18ff6162a9668ed1c2c4efde7c4f15806);
    else if (i == 4) return bytes32(0xce9ce09a0ab259d6d14ca3dcd74e6c6b9e7d9074bff66973d4c57ccdffdb2a82);
    else if (i == 5) return bytes32(0x02efd44c63015ff1385344e0624867775486d05e6eb1290a24976964a598003b);
    else if (i == 6) return bytes32(0xc4dec5845d407ce2ac2e6824bb7857c4b138f819e5789d5d11e812db10c846cd);
    else if (i == 7) return bytes32(0x5fbe3f20c23f3bd6ac347917fb0903433e0b9a48373412348240a5f919bfde19);
    else if (i == 8) return bytes32(0x92d1b07e56b3da96b7917778cb657f2c513eaeeb4d1579a73b5ea316f25b7289);
    else if (i == 9) return bytes32(0xa08add5656d6d3d0827ef909f7647981eac42aa1f51970a752f130f718f6d76a);
    else if (i == 10) return bytes32(0x1704c5f297590d8ec62776b0714f4f3f2234bae0524035342b0da8b8988ebd79);
    else if (i == 11) return bytes32(0xc5ae2bd47379c2c6d1189cfc3d057948dc6054caf845fcacd8f7affe94b11944);
    else if (i == 12) return bytes32(0x12a161d6d5561062f387d91ad9f0f8966c0956afdb9e8325458b9e5057b82bdb);
    else if (i == 13) return bytes32(0x4ade524ba596de20bbe94507a761c45251ae7a27857ceb4287d9018525b99bc5);
    else if (i == 14) return bytes32(0x38287ad69151fa833bf4bf8b8eb6ffb39400a38f1a7e53b473f639c8c60fd5e4);
    else if (i == 15) return bytes32(0x57f2ade7d711707e785451f2aba6c95872c7fe03153a98b7327b4024e8068fa3);
    else if (i == 16) return bytes32(0xb1982e0d1b0de46a88d8b17941472e41a86d3ff64571ed8e0ca72d58633547fc);
    else if (i == 17) return bytes32(0xb7c60f8670af15eb32b4ee36727179bc085a3dde03d5f9a1486664ba576b30a6);
    else if (i == 18) return bytes32(0x5ff905c5c659a926b132ef3665a3de5d5a859c1d479e68851085bfc0348c5331);
    else if (i == 19) return bytes32(0xb4dfa78b912e98c9f7eb42d71eb537a02bf3173d44a2eb887a48b3972072dd8e);
    else if (i == 20) return bytes32(0x60919a16a2eb8b91cfb8ba1e5b4c155a76a14c217b5403edbd563f34e508ecdc);
    else revert("Index out of bounds");
  }
}