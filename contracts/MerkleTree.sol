// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;
import "poseidon-solidity/PoseidonT3.sol";

contract MerkleTree{

  uint32 public levels;
  
  // merkle leafs
  mapping(uint256 => uint256) public filledSubtrees;
  mapping(uint256 => uint256) public roots;
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
    uint256 _left,
    uint256 _right
  ) public pure returns (uint256) {
    return  PoseidonT3.hash([_left, _right]); 
  }

  function _insert(uint256 _leaf) internal returns (uint32 index) {
    uint32 _nextIndex = nextIndex;
    require(_nextIndex != uint32(2)**levels, "Merkle tree is full. No more leaves can be added");
    uint32 currentIndex = _nextIndex;
    uint256 currentLevelHash = _leaf;
    uint256 left;
    uint256 right;

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
    nextIndex = _nextIndex + 1;
    return _nextIndex;
  }

  /**
    @dev Whether the root is present in the root history
  */
  function isKnownRoot(uint256 _root) internal view returns (bool) {
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
  function getLastRoot() public view returns (uint256) {
    return roots[currentRootIndex];
  }

  /// @dev provides Zero (Empty) elements for a keccka MerkleTree. Up to 32 levels
  function zeros(uint256 i) public pure returns (uint256) {
        if (i == 0) return uint256(0);
    else if (i == 1) return uint256(14744269619966411208579211824598458697587494354926760081771325075741142829156);
    else if (i == 2) return uint256(7423237065226347324353380772367382631490014989348495481811164164159255474657);
    else if (i == 3) return uint256(11286972368698509976183087595462810875513684078608517520839298933882497716792);
    else if (i == 4) return uint256(3607627140608796879659380071776844901612302623152076817094415224584923813162);
    else if (i == 5) return uint256(19712377064642672829441595136074946683621277828620209496774504837737984048981);
    else if (i == 6) return uint256(20775607673010627194014556968476266066927294572720319469184847051418138353016);
    else if (i == 7) return uint256(3396914609616007258851405644437304192397291162432396347162513310381425243293);
    else if (i == 8) return uint256(21551820661461729022865262380882070649935529853313286572328683688269863701601);
    else if (i == 9) return uint256(6573136701248752079028194407151022595060682063033565181951145966236778420039);
    else if (i == 10) return uint256(12413880268183407374852357075976609371175688755676981206018884971008854919922);
    else if (i == 11) return uint256(14271763308400718165336499097156975241954733520325982997864342600795471836726);
    else if (i == 12) return uint256(20066985985293572387227381049700832219069292839614107140851619262827735677018);
    else if (i == 13) return uint256(9394776414966240069580838672673694685292165040808226440647796406499139370960);
    else if (i == 14) return uint256(11331146992410411304059858900317123658895005918277453009197229807340014528524);
    else if (i == 15) return uint256(15819538789928229930262697811477882737253464456578333862691129291651619515538);
    else if (i == 16) return uint256(19217088683336594659449020493828377907203207941212636669271704950158751593251);
    else if (i == 17) return uint256(21035245323335827719745544373081896983162834604456827698288649288827293579666);
    else if (i == 18) return uint256(6939770416153240137322503476966641397417391950902474480970945462551409848591);
    else if (i == 19) return uint256(10941962436777715901943463195175331263348098796018438960955633645115732864202);
    else if (i == 20) return uint256(15019797232609675441998260052101280400536945603062888308240081994073687793470);
    else if (i == 21) return uint256(11702828337982203149177882813338547876343922920234831094975924378932809409969);
    else if (i == 22) return uint256(11217067736778784455593535811108456786943573747466706329920902520905755780395);
    else if (i == 23) return uint256(16072238744996205792852194127671441602062027943016727953216607508365787157389);
    else if (i == 24) return uint256(17681057402012993898104192736393849603097507831571622013521167331642182653248);
    else if (i == 25) return uint256(21694045479371014653083846597424257852691458318143380497809004364947786214945);
    else if (i == 26) return uint256(8163447297445169709687354538480474434591144168767135863541048304198280615192);
    else if (i == 27) return uint256(14081762237856300239452543304351251708585712948734528663957353575674639038357);
    else if (i == 28) return uint256(16619959921569409661790279042024627172199214148318086837362003702249041851090);
    else if (i == 29) return uint256(7022159125197495734384997711896547675021391130223237843255817587255104160365);
    else if (i == 30) return uint256(4114686047564160449611603615418567457008101555090703535405891656262658644463);
    else if (i == 31) return uint256(12549363297364877722388257367377629555213421373705596078299904496781819142130);
    else if (i == 32) return uint256(21443572485391568159800782191812935835534334817699172242223315142338162256601);
    else if (i == 33) return uint256(7694308195910501081009121293114024464085863242234210875116972222894508088593);

    else revert("Index out of bounds");
  }
}