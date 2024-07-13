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
        let hash_right = hash_path_bools[i];
        if hash_right {
            current = hashKeccak2(hash_path[i], current);
        } else {
            current = hashKeccak2(current, hash_path[i]);
        };
        

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

#[test]
fn test_simple_merkle_proof() {
    
    let hash_path = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20],[79,194,254,145,132,162,95,68,206,141,219,95,50,103,31,202,230,217,200,94,215,16,193,153,172,239,22,173,22,178,153,17],[13,130,106,71,79,133,28,86,48,82,217,41,239,13,170,112,246,88,171,169,186,8,79,81,246,227,72,60,19,192,229,154],[247,118,26,22,181,228,192,18,14,76,87,4,185,16,219,225,143,246,22,42,150,104,237,28,44,78,253,231,196,241,88,6],[206,156,224,154,10,178,89,214,209,76,163,220,215,78,108,107,158,125,144,116,191,246,105,115,212,197,124,205,255,219,42,130],[2,239,212,76,99,1,95,241,56,83,68,224,98,72,103,119,84,134,208,94,110,177,41,10,36,151,105,100,165,152,0,59],[196,222,197,132,93,64,124,226,172,46,104,36,187,120,87,196,177,56,248,25,229,120,157,93,17,232,18,219,16,200,70,205]];
    let leaf = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,66,0];
    let real_root = [218,130,62,147,72,0,144,187,88,40,196,24,198,243,240,151,71,112,62,173,29,168,116,56,198,174,231,247,158,128,233,2];
    let hash_path_bools = [true,false,false,false,false,false,false];
    let root = compute_merkle_root(leaf,hash_path, hash_path_bools);
    
    println("root");
    println(root);
    assert(root == real_root);
}
