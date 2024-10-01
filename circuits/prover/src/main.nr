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


/*
  commitmentHash (hashed onchain on deposit)
         /                      \
    pre_commitment_hash          amount (public)
 (hashed by user, private)
        |
    nullifierPerimg, secret, chain_id
*/
fn commitment_hasher(nullifier_hash_preimage: Field, secret: Field, chain_id: Field, amount: Field) -> (Field,Field) {
    let computed_nullifier_hash: Field = poseidon::bn254::hash_1([nullifier_hash_preimage]);
    let pre_commitment_hash: Field =  poseidon::bn254::hash_3([nullifier_hash_preimage,secret, chain_id]);
    let commitment: Field = poseidon::bn254::hash_2([pre_commitment_hash,amount]);
    (commitment,computed_nullifier_hash)
}



fn main(
    // public
    root:pub Field,
    nullifier_hash:pub Field, 
    recipient:pub Field, 
    chain_id: pub Field,
    amount: pub Field,

    // private
    nullifier_hash_preimage: Field,
    secret: Field,
    hash_path: [Field;TREE_DEPTH],
    hash_path_bools:  [bool; TREE_DEPTH],
    root_other_layer: Field,
    root_other_is_right: bool // left = L1, right = L2

    ) {
    // to make sure these are set and cant change
    assert(recipient != 0x0, "recipient shouldnt be 0");

    let (commitment, computed_nullifier_hash) = commitment_hasher(nullifier_hash_preimage, secret, chain_id, amount);
    println("commitment");
    println(commitment);
    
    let computed_root = compute_merkle_root(commitment, hash_path, hash_path_bools);
    println("computed_root");
    println(computed_root);

    let (root_L1, root_L2) = if root_other_is_right {
            (computed_root, root_other_layer)
        } else {
            (root_other_layer, computed_root)
        };
    let computed_meta_root = poseidon::bn254::hash_2([root_L1, root_L2]);

    assert(computed_nullifier_hash == nullifier_hash, "nullifier hash doesnt match");
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
//     let nullifier_hash_preimage = [214,255,124,83,114,187,12,181,14,111,72,234,5,249,135,238,141,197,183,240,45,224,153,161,158,69,230,216,57,122,75,68];
//     let secret = [230,146,124,238,124,120,160,205,44,185,238,166,139,63,96,30,207,97,7,85,117,207,245,240,45,97,6,100,229,191,245,27];
//     let chain_id = 2227728; //L1SLOAD aka L2 
//     let (pre_commitment_hash, computed_nullifier_hash) = commitment_hasher(nullifier_hash_preimage, secret, chain_id);
//     println("pre_commitment_hash");
//     println(pre_commitment_hash);
//     println("computed_nullifier_hash");
//     println(computed_nullifier_hash);

//     // ethers.hexlify(new Uint8Array(computed_nullifier_hash))
// }

#[test]
fn test_main() {
    let root = 0x2f6a832fd61aec0c03c0d6da26d668b8e9d4746998d6be238b85ba437241c518;
    let nullifier_hash= 0x16397f79558d5424a2875a5d187befb0ed23ecb1c658733368b6e3ae771ba2ca;
    let recipient= 0x0000000000000000000000003c44cdddb6a900fa2b585dd299e03d12fa4293bc;
    let nullifier_hash_preimage= 0x2946f2ea22e64f0a2e6ad55e72db98d52ab7c18657e87c42133546937fb90478;
    let secret= 0x16b328d0f5bf0e54821aa99bc48be7db5e6d2f58ea2e50f47cf4ee6403dd4a59;
    let chain_id= 31337;
    let amount= 0x2386f26fc10000;
    let hash_path= [
      0x00,
      0x2098f5fb9e239eab3ceac3f27b81e481dc3124d55ffed523a839ee8446b64864,
      0x1069673dcdb12263df301a6ff584a7ec261a44cb9dc68df067a4774460b1f1e1,
      0x18f43331537ee2af2e3d758d50f72106467c6eea50371dd528d57eb2b856d238,
      0x07f9d837cb17b0d36320ffe93ba52345f1b728571a568265caac97559dbc952a
    ];
    let hash_path_bools= [ false, false, false, false, false ];
    let root_other_layer= 0x2b94cf5e8746b3f5c9631f4c5df32907a699c58c94b2ad4d7b5cec1639183f55;
    let root_other_is_right= true;
    main(
        root,
        nullifier_hash, 
        recipient, 
        chain_id,
        amount,

        nullifier_hash_preimage,
        secret,
        hash_path,
        hash_path_bools,
        root_other_layer,
        root_other_is_right
    );

}