use dep::std;
use std::hash::poseidon;

global TREE_DEPTH = 5;

// used merkle from noir std as example
// https://github.com/noir-lang/noir/blob/49e1b0c0d45565f3e87469b77f2fef0c283f6ea1/noir_stdlib/src/merkle.nr#L5
// Returns the merkle root of the tree from the provided leaf hash, 
// its hashpath and hash_path_bools to indicate wether to hash left or right
fn compute_merkle_root<N>(
    leaf_hash: Field, 
    hash_path: [ Field; N], 
    hash_path_bools: [bool; N]
    ) -> Field {

    let n = hash_path.len();
    let mut current = leaf_hash;
    for i in 0..n {
        let hash_right = hash_path_bools[i];
        if hash_right {
            current = poseidon::bn254::hash_2([hash_path[i], current]); 
        } else {
            current = poseidon::bn254::hash_2([current, hash_path[i]]);
        };
    }
    current
}

fn commitmentHasher(nullifierHashPreImage: Field, secret: Field, chainId: Field) -> (Field,Field) {
    let computedNullifierHash: Field = poseidon::bn254::hash_1([nullifierHashPreImage]);
    let commitmentHash: Field =  poseidon::bn254::hash_3([nullifierHashPreImage,secret, chainId]);
    (commitmentHash,computedNullifierHash)
}


fn main(
    // public
    root:pub Field,
    nullifierHash:pub Field, 
    recipient:pub Field, 
    chainId: pub Field,

    // private
    nullifierHashPreImage: Field,
    secret: Field,
    hash_path: [Field;TREE_DEPTH],
    hash_path_bools:  [bool; TREE_DEPTH],
    root_other_layer: Field,
    root_other_is_right: bool // left = L1, right = L2

    ) {
    // to make sure these are set and cant change
    assert(recipient != 0x0, "recipient shouldnt be 0");

    let (commitmentHash, computedNullifierHash) = commitmentHasher(nullifierHashPreImage, secret, chainId);

    let computed_root = compute_merkle_root(commitmentHash, hash_path, hash_path_bools);

    let (root_L1, root_L2) = if root_other_is_right {
            (computed_root, root_other_layer)
        } else {
            (root_other_layer, computed_root)
        };
    let computed_meta_root = poseidon::bn254::hash_2([root_L1, root_L2]);

    assert(computedNullifierHash == nullifierHash, "nullifier hash doesnt match");
    assert(computed_meta_root == root, "meta_root doesnt match");
}

// #[test]
// fn test_simple_merkle_proof() {
    
//     let hash_path = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20],[79,194,254,145,132,162,95,68,206,141,219,95,50,103,31,202,230,217,200,94,215,16,193,153,172,239,22,173,22,178,153,17],[13,130,106,71,79,133,28,86,48,82,217,41,239,13,170,112,246,88,171,169,186,8,79,81,246,227,72,60,19,192,229,154],[247,118,26,22,181,228,192,18,14,76,87,4,185,16,219,225,143,246,22,42,150,104,237,28,44,78,253,231,196,241,88,6],[206,156,224,154,10,178,89,214,209,76,163,220,215,78,108,107,158,125,144,116,191,246,105,115,212,197,124,205,255,219,42,130],[2,239,212,76,99,1,95,241,56,83,68,224,98,72,103,119,84,134,208,94,110,177,41,10,36,151,105,100,165,152,0,59],[196,222,197,132,93,64,124,226,172,46,104,36,187,120,87,196,177,56,248,25,229,120,157,93,17,232,18,219,16,200,70,205]];
//     let leaf = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,66,0];
//     let real_root = [218,130,62,147,72,0,144,187,88,40,196,24,198,243,240,151,71,112,62,173,29,168,116,56,198,174,231,247,158,128,233,2];
//     let hash_path_bools = [true,false,false,false,false,false,false];
//     let root = compute_merkle_root(leaf,hash_path, hash_path_bools);
    
//     // println("root");
//     // println(root);
//     assert(root == real_root);
// }
// #[test]
// fn test_commitment_hasher() {
//     //[...crypto.getRandomValues(new Uint8Array(Array(32)))]
//     let nullifierHashPreImage = [214,255,124,83,114,187,12,181,14,111,72,234,5,249,135,238,141,197,183,240,45,224,153,161,158,69,230,216,57,122,75,68];
//     let secret = [230,146,124,238,124,120,160,205,44,185,238,166,139,63,96,30,207,97,7,85,117,207,245,240,45,97,6,100,229,191,245,27];
//     let chainId = 2227728; //L1SLOAD aka L2 
//     let (commitmentHash, computedNullifierHash) = commitmentHasher(nullifierHashPreImage, secret, chainId);
//     println("commitmentHash");
//     println(commitmentHash);
//     println("computedNullifierHash");
//     println(computedNullifierHash);

//     // ethers.hexlify(new Uint8Array(computedNullifierHash))
// }


// #[test]
// fn test_main() {
//     let root: [u8;32] = [ 126, 110, 203, 158, 212, 147, 148, 125, 239, 239, 254, 80, 140, 158, 181, 10, 64, 30, 96,99, 86, 26, 58, 188, 197, 12, 248, 200, 203, 120, 238, 155 ];
//     let nullifierHash: [u8;32] = [ 206, 109, 123, 82, 130, 189, 154, 54, 97, 174, 6, 31, 238, 209, 219, 218, 78, 82, 171, 7, 59, 31, 146, 133, 190, 110, 21, 93, 156, 56, 212, 236 ];
//     let recipient: Field = 0x000000000000000000000000794464c8c91a2be4addabfdb82b6db7b1bb1dbc7;
//     let chainId = 2227728; //L1SLOAD aka L2 

//     let nullifierHashPreImage: [u8;32] =    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20 ];
//     let secret: [u8;32] =                   [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20 ];
//     let hash_path: [[u8;32];TREE_DEPTH] = [
//       [ 47, 229, 76, 96, 211, 172, 171, 243, 52, 58, 53, 182, 235, 161, 93, 180, 130, 27, 52, 15, 118,
//         231, 65, 226, 36, 150, 133, 237, 72, 153, 175, 108 ], [ 79, 194, 254, 145, 132, 162, 95, 68,
//         206, 141, 219, 95, 50, 103, 31, 202, 230, 217, 200, 94, 215, 16, 193, 153, 172, 239, 22, 173,
//         22, 178, 153, 17 ], [ 13, 130, 106, 71, 79, 133, 28, 86, 48, 82, 217, 41, 239, 13, 170, 112,
//         246, 88, 171, 169, 186, 8, 79, 81, 246, 227, 72, 60, 19, 192, 229, 154 ], [ 247, 118, 26, 22,
//         181, 228, 192, 18, 14, 76, 87, 4, 185, 16, 219, 225, 143, 246, 22, 42, 150, 104, 237, 28, 44,
//         78, 253, 231, 196, 241, 88, 6 ], [ 206, 156, 224, 154, 10, 178, 89, 214, 209, 76, 163, 220,
//         215, 78, 108, 107, 158, 125, 144, 116, 191, 246, 105, 115, 212, 197, 124, 205, 255, 219, 42,
//         130 ]
//     ];
//     let hash_path_bools:  [bool; TREE_DEPTH] =  [ false, false, false, false, false ];

//     let root_other_layer =  [ 2, 239, 212, 76, 99, 1, 95, 241, 56, 83, 68, 224, 98, 72, 103, 119, 84, 134, 208, 94, 110, 177, 41, 10, 36, 151, 105, 100, 165, 152, 0, 59 ];

//     let root_other_is_right = true;
//     main(
//         root,
//         nullifierHash, 
//         recipient, 
//         chainId,

//         nullifierHashPreImage,
//         secret,
//         hash_path,
//         hash_path_bools,
//         root_other_layer,
//         root_other_is_right
//     );

// }