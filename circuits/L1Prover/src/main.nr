use dep::std;

global TREE_DEPTH = 10;

fn hashKeccak2(first: [u8;32], second: [u8;32]) -> [u8;32] {
    let mut preImage: [u8;64] = [0;64];

    for i in 0 .. 32 {
        preImage[i] = first[i];
        
    }
    for i in 0 .. 32 {
        preImage[i+32] = second[i];
        
    }
    std::hash::keccak256(preImage,64)
}

// used merkle from noir std as example
// https://github.com/noir-lang/noir/blob/49e1b0c0d45565f3e87469b77f2fef0c283f6ea1/noir_stdlib/src/merkle.nr#L5
// Returns the merkle root of the tree from the provided leaf, its hashpath, domains, using a poseidon2 with the domain argument
fn compute_merkle_root<N>(leaf_hash: [u8;32], hash_path: [ [u8;32]; N], hash_path_bools: [bool; N]) -> [u8;32] {
    let n = hash_path.len();
    let mut current = leaf_hash;
    for i in 0..n {
        let path_bit = hash_path_bools[i];
        let (hash_first, hash_second) = if path_bit {
            (hash_path[i], current)
        } else {
            (current, hash_path[i])
        };
        current = hashKeccak2(hash_first, hash_second);

    }
    current
}

fn commitmentHasher(nullifierHashPreImage: [u8;32], secret: [u8;32]) -> ([u8;32],[u8;32]) {
    let computedNullifierHash:  [u8;32] = std::hash::keccak256(nullifierHashPreImage,32);
    let commitmentHash:  [u8;32] =hashKeccak2(nullifierHashPreImage,secret );
    (commitmentHash,computedNullifierHash)
}


fn main(
    root:pub [u8;32],
    nullifierHash:pub [u8;32], 
    recipient:pub Field, 
    //relayer:pub Field,
    // fee:pub Field,
    // refund:pub Field,
    chainId:pub Field,
    
    nullifierHashPreImage: [u8;32],
    secret: [u8;32],
    hash_path: [[u8;32];TREE_DEPTH],
    hash_path_bools:  [bool; TREE_DEPTH],
    ) {
    // to make sure these are set and cant change
    assert(recipient != 0x0);
    assert(chainId != 0x0);

    let (commitmentHash, computedNullifierHash) = commitmentHasher(nullifierHashPreImage, secret);
    let computed_root = compute_merkle_root(commitmentHash, hash_path, hash_path_bools);


    assert(computedNullifierHash == nullifierHash);
    assert(computed_root == root);
}

// #[test]
// fn test_main() {

// }
