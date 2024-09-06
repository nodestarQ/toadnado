/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../../common";
import type {
  UltraVerifier,
  UltraVerifierInterface,
} from "../../../contracts/plonk_vk.sol/UltraVerifier";

const _abi = [
  {
    inputs: [],
    name: "INVALID_VERIFICATION_KEY",
    type: "error",
  },
  {
    inputs: [],
    name: "MOD_EXP_FAILURE",
    type: "error",
  },
  {
    inputs: [],
    name: "OPENING_COMMITMENT_FAILED",
    type: "error",
  },
  {
    inputs: [],
    name: "PAIRING_FAILED",
    type: "error",
  },
  {
    inputs: [],
    name: "PAIRING_PREAMBLE_FAILED",
    type: "error",
  },
  {
    inputs: [],
    name: "POINT_NOT_ON_CURVE",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "expected",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "actual",
        type: "uint256",
      },
    ],
    name: "PUBLIC_INPUT_COUNT_INVALID",
    type: "error",
  },
  {
    inputs: [],
    name: "PUBLIC_INPUT_GE_P",
    type: "error",
  },
  {
    inputs: [],
    name: "PUBLIC_INPUT_INVALID_BN128_G1_POINT",
    type: "error",
  },
  {
    inputs: [],
    name: "getVerificationKeyHash",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "_proof",
        type: "bytes",
      },
      {
        internalType: "bytes32[]",
        name: "_publicInputs",
        type: "bytes32[]",
      },
    ],
    name: "verify",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561000f575f80fd5b50620400006103805260426103a0527f19ddbcaf3a8d46c15c0176fbb5b95e4dc57088ff13f4d1bd84c6bfa57dcdc0e06103c0527f30644259cd94e7dd5045d7a27013b7fcd21c9e3b7fa75222e7bda49b729b04016103e0527f2162516065b3757d36480a72300ffb61e4d816801f56d0777eb312ba510cc8a7610400527f17382fcfb0147ed7c1bd329c02d4254eacdf3eff757933ce5bcbae8bfdaad26c610420527f28623d115c3f3310b4473877f0a475add5bfc4afae065d9c52a71f1929a63676610440527f217f6e53148cde06c881a5253aeb70984a2c73515a8a66b3aeac905245c5f45e610460527f143fc30ca069d7447ddd994437b5a65ceeb361102f8ca0990a293aae0b73b15d610480527f2bcc6c2e83ec00c296d670cf4b976737c6443ea43407ce07f0924602f29a3cfe6104a0527f0310347e4e7d7b288184c5636a2f0bbb206e5cccec106fb247806d1c3097b9466104c0527f077049514b48c9ad25f5c6a6d1fd581a5f91e9c85c6238b809824061c771179d6104e0527f0b7b587d754e288730e11824792f6fdfb3d8b938132a99d41993faaf5114add3610500527f044cac9364d23ed034600739c830b16c1a5f76c55949d442fb41f6a17d353545610520527f15ecc673c19148263fa5220222e878b59a3fe68172b5a4d7fa3815bd4b427c81610540527e56f5706edf487f848bfd06d39547419ab7f74ed1aa45bc58090b264109631e610560527f194ebbce314aaace628083370be60504c8e2c17df3f535a1e7f79b599337c8e2610580527f2661fb19adea63d86ab4e48e093284e8ffcca05f4e7f67de89522d7580410db26105a0527f205ac28fda4fdf698837632243637ef4bfde59b7ac81b8884cf175dce9f05d7f6105c0527f2fed605f94fd6ca507b15fc50dc33d01ce034f30a4dc4a7b1e4995e4673bbbcf6105e0527f160ee1e8021540598127395e55f442be84ee39b9c20f679b91ff1cbc14e48ffd610600527f1e4d0d9f143eb9fed065afe71f2ca99d4a2f78ac0640bb5b34bf44f0aafad98c610620527f03f5529a26dcb379acedd5371921478e0866e1a5543773fdb31b458c6dfb72e6610640527f06ee424d56c29ce12a79177538cb3831574e06233ac6a29a0a840841125e22f0610660527f1c4eb2beb1bd114009d1794c781d7c7329e2f7b029218a0d72accf8c4240c59e610680527f0aed8ab0b2dbc2aedaf477324034b900499342a6e8181daa0dc9db0083e31b536106a0527f2daa6556078ad36a826d25519e1e925f6041e3c197e65d31d36eebb9b91ebdd26106c0527f2475e17c586fc4b9f0a95be90b67c400668dfaebdde9778bf8de67ebf9a3fa226106e0527f1bb53d43d8c05ae2cddca05cb3b00dd73d9c319d5ac13c149154a95dffebac51610700527f1f5e208fbf241c80a29ec8b1d352526373c0d4d71b9474befe93bb5a87968046610720527f2b193707bdd23d3e0b6e3209323fc5c5c03213a7822ba08ea5dfb3d0b350d33f610740527f2904d00db8d7938bdeb8d0405b17197ce082e01a3a86c101eae69d7b242fc285610760527f24ec4e91a34243b3f0a0cad6b3e3e197e896fff5bd1184e6f356ab0d2b9e8f18610780527f295b8cfdda100a52cfff8890498f4245cdf3acfe71d98db3b338453988f6df786107a0527f0474f7749df187ab47e1590590cddcfe2fda25c6ff4dfd26e7211f9730e4911f6107c0527f02d65a3f02db65058472601e184b9e0bc6619f0fec863b1e456bbe1cf238d0606107e0527f2d8baf693bf660e8fbc9ee8459ab99471e2e0010a1e7c7c0cedd07607d60711e610800527f215a1bb26337a4aaddc0d70a0ca1425448e582bbb026b47253328fe414fd9a6e610820527f225f3fbd31be1a72d035dd26b793c425832c21fd171a6490cd11a3ee9acd3da7610840527f0bfaa201bc5fdaceceab080752d855737b65c6cae330c210f6e11eeec0f55d41610860527f29a0fd2730430e495243c99258632fca2f9a7a61cb7ea74085d836c305de5a01610880527f2c41ac96755a67347d95ee5db9b1c7d446f99ab4464d5e9474f8e77b45f6f4a46108a0527f1cef0d7fe00189273d823a52be13592ffc6a2058755fa00034874bfe96f4e0b06108c0527f03621f9c105984266d9cc8a14d902aa37ced3b8b57a8c56fa3259f0a471985126108e0527f0f39969d0d67da991041098d671e156d7cc2d588eb009db86d2ea8b566ad21b4610900527f2f2efd0c8cf6a8c814cd35c3b1b736bd62dd277e626c42b145ee460e79dd9625610920527f11d15df59949bf412b177793aa1df316fdb755f56de473ff5e215b7d715f9e12610940527f2898b5a3815c103438949e1a3eeb495eabf51245297acad8cd2111e9ac7cd336610960527f2d03ec9ce0fc21cd05cc98e86992e9a51ce532e7e1ba64b1cb69cc74398a818a610980527f10e708623925edf38c53e7e87e0e686ec6961a2e72360e057a6d44af58418b876109a0525f6109c08190526109e0527f260e01b251f6f1c7e7ff4e580791dee8ea51d87a358e038b4efe30fac09383c1610a00527f0118c4d5b837bcc2bc89b5b398b5974e9f5944073b32078b7e231fec938883b0610a20527f04fc6369f7110fe3d25156c1bb9a72859cf2a04641f99ba4ee413c80da6a5fe4610a40527f22febda3c0c0632a56475b4214e5615e11e6dd3f96e6cea2854a87d4dacc5e55610a60527f036853f083780e87f8d7c71d111119c57dbe118c22d5ad707a82317466c5174c613300527f30644e72e131a029b85045b68181585d97816a916871ca8d3c208c16d87cfd47600161040051610420518382830984600386838609088583840914841693505050506104405161046051838283098460038683860908858384091484169350505050610480516104a0518382830984600386838609088583840914841693505050506104c0516104e05183828309846003868386090885838409148416935050815f5280602052505061050051610520518382830984600386838609088583840914841693505050506105405161056051838283098460038683860908858384091484169350505050610580516105a0518382830984600386838609088583840914841693505050506105c0516105e05183828309846003868386090885838409148416935050505061060051610620518382830984600386838609088583840914841693505050506106405161066051838283098460038683860908858384091484169350505050610680516106a0518382830984600386838609088583840914841693505050506106c0516106e05183828309846003868386090885838409148416935050505061070051610720518382830984600386838609088583840914841693505050506107405161076051838283098460038683860908858384091484169350505050610780516107a0518382830984600386838609088583840914841693505050506107c0516107e05183828309846003868386090885838409148416935050505061080051610820518382830984600386838609088583840914841693505050506108405161086051838283098460038683860908858384091484169350505050610880516108a0518382830984600386838609088583840914841693505050506108c0516108e05183828309846003868386090885838409148416935050505061090051610920518382830984600386838609088583840914841693505050506109405161096051838283098460038683860908858384091484169350505050610980516109a05183828309846003868386090885838409148416935050505080610aef57637e5769bf60e01b5f5260045ffd5b5050612b1e80610afe5f395ff3fe608060405234801561000f575f80fd5b5060043610610034575f3560e01c8063937f6a1014610038578063ea50d0e41461006b575b5f80fd5b6040517f0993e765d242177994b869e6e842e3c7169dc53768e7e63942c4bbfc95fff46281526020015b60405180910390f35b61007e610079366004612a2e565b61008e565b6040519015158152602001610062565b620400006103805260426103a0527f19ddbcaf3a8d46c15c0176fbb5b95e4dc57088ff13f4d1bd84c6bfa57dcdc0e06103c0527f30644259cd94e7dd5045d7a27013b7fcd21c9e3b7fa75222e7bda49b729b04016103e0527f2162516065b3757d36480a72300ffb61e4d816801f56d0777eb312ba510cc8a7610400527f17382fcfb0147ed7c1bd329c02d4254eacdf3eff757933ce5bcbae8bfdaad26c610420527f28623d115c3f3310b4473877f0a475add5bfc4afae065d9c52a71f1929a63676610440527f217f6e53148cde06c881a5253aeb70984a2c73515a8a66b3aeac905245c5f45e610460527f143fc30ca069d7447ddd994437b5a65ceeb361102f8ca0990a293aae0b73b15d610480527f2bcc6c2e83ec00c296d670cf4b976737c6443ea43407ce07f0924602f29a3cfe6104a0527f0310347e4e7d7b288184c5636a2f0bbb206e5cccec106fb247806d1c3097b9466104c0527f077049514b48c9ad25f5c6a6d1fd581a5f91e9c85c6238b809824061c771179d6104e0527f0b7b587d754e288730e11824792f6fdfb3d8b938132a99d41993faaf5114add3610500527f044cac9364d23ed034600739c830b16c1a5f76c55949d442fb41f6a17d353545610520527f15ecc673c19148263fa5220222e878b59a3fe68172b5a4d7fa3815bd4b427c81610540527e56f5706edf487f848bfd06d39547419ab7f74ed1aa45bc58090b264109631e610560527f194ebbce314aaace628083370be60504c8e2c17df3f535a1e7f79b599337c8e2610580527f2661fb19adea63d86ab4e48e093284e8ffcca05f4e7f67de89522d7580410db26105a0527f205ac28fda4fdf698837632243637ef4bfde59b7ac81b8884cf175dce9f05d7f6105c0527f2fed605f94fd6ca507b15fc50dc33d01ce034f30a4dc4a7b1e4995e4673bbbcf6105e0527f160ee1e8021540598127395e55f442be84ee39b9c20f679b91ff1cbc14e48ffd610600527f1e4d0d9f143eb9fed065afe71f2ca99d4a2f78ac0640bb5b34bf44f0aafad98c610620527f03f5529a26dcb379acedd5371921478e0866e1a5543773fdb31b458c6dfb72e6610640527f06ee424d56c29ce12a79177538cb3831574e06233ac6a29a0a840841125e22f0610660527f1c4eb2beb1bd114009d1794c781d7c7329e2f7b029218a0d72accf8c4240c59e610680527f0aed8ab0b2dbc2aedaf477324034b900499342a6e8181daa0dc9db0083e31b536106a0527f2daa6556078ad36a826d25519e1e925f6041e3c197e65d31d36eebb9b91ebdd26106c0527f2475e17c586fc4b9f0a95be90b67c400668dfaebdde9778bf8de67ebf9a3fa226106e0527f1bb53d43d8c05ae2cddca05cb3b00dd73d9c319d5ac13c149154a95dffebac51610700527f1f5e208fbf241c80a29ec8b1d352526373c0d4d71b9474befe93bb5a87968046610720527f2b193707bdd23d3e0b6e3209323fc5c5c03213a7822ba08ea5dfb3d0b350d33f610740527f2904d00db8d7938bdeb8d0405b17197ce082e01a3a86c101eae69d7b242fc285610760527f24ec4e91a34243b3f0a0cad6b3e3e197e896fff5bd1184e6f356ab0d2b9e8f18610780527f295b8cfdda100a52cfff8890498f4245cdf3acfe71d98db3b338453988f6df786107a0527f0474f7749df187ab47e1590590cddcfe2fda25c6ff4dfd26e7211f9730e4911f6107c0527f02d65a3f02db65058472601e184b9e0bc6619f0fec863b1e456bbe1cf238d0606107e0527f2d8baf693bf660e8fbc9ee8459ab99471e2e0010a1e7c7c0cedd07607d60711e610800527f215a1bb26337a4aaddc0d70a0ca1425448e582bbb026b47253328fe414fd9a6e610820527f225f3fbd31be1a72d035dd26b793c425832c21fd171a6490cd11a3ee9acd3da7610840527f0bfaa201bc5fdaceceab080752d855737b65c6cae330c210f6e11eeec0f55d41610860527f29a0fd2730430e495243c99258632fca2f9a7a61cb7ea74085d836c305de5a01610880527f2c41ac96755a67347d95ee5db9b1c7d446f99ab4464d5e9474f8e77b45f6f4a46108a0527f1cef0d7fe00189273d823a52be13592ffc6a2058755fa00034874bfe96f4e0b06108c0527f03621f9c105984266d9cc8a14d902aa37ced3b8b57a8c56fa3259f0a471985126108e0527f0f39969d0d67da991041098d671e156d7cc2d588eb009db86d2ea8b566ad21b4610900527f2f2efd0c8cf6a8c814cd35c3b1b736bd62dd277e626c42b145ee460e79dd9625610920527f11d15df59949bf412b177793aa1df316fdb755f56de473ff5e215b7d715f9e12610940527f2898b5a3815c103438949e1a3eeb495eabf51245297acad8cd2111e9ac7cd336610960527f2d03ec9ce0fc21cd05cc98e86992e9a51ce532e7e1ba64b1cb69cc74398a818a610980527f10e708623925edf38c53e7e87e0e686ec6961a2e72360e057a6d44af58418b876109a0525f6109c08190526109e08190527f260e01b251f6f1c7e7ff4e580791dee8ea51d87a358e038b4efe30fac09383c1610a00527f0118c4d5b837bcc2bc89b5b398b5974e9f5944073b32078b7e231fec938883b0610a20527f04fc6369f7110fe3d25156c1bb9a72859cf2a04641f99ba4ee413c80da6a5fe4610a40527f22febda3c0c0632a56475b4214e5615e11e6dd3f96e6cea2854a87d4dacc5e55610a60527f036853f083780e87f8d7c71d111119c57dbe118c22d5ad707a82317466c5174c613300526103a05182811461088357604051637667dc9b60e01b8152600481018290526024810184905260440160405180910390fd5b7f30644e72e131a029b85045b68181585d97816a916871ca8d3c208c16d87cfd477f30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f00000016024600435018281350661122052826020820135066112005282604082013506611260528260608201350661124052826080820135066112a0528260a082013506611280528260c0820135066112e0528260e0820135066112c05282610100820135066113205282610120820135066113005282610140820135066113605282610160820135066113405282610180820135066113a052826101a08201350661138052826101c0820135066113e052826101e0820135066113c05282610200820135066114205282610220820135066114005282610240820135066114605282610260820135066114405282610280820135066114a052826102a08201350661148052816102c08201350661160052816102e0820135066116205281610300820135066116405281610320820135066116605281610340820135066116805281610360820135066116a05281610380820135066116c052816103a0820135066116e052816103c08201350661170052816103e0820135066117205281610400820135066117405281610420820135066117605281610440820135066117805281610460820135066117a05281610480820135066117c052816104a0820135066117e052816104c08201350661180052816104e0820135066119605281610500820135066119805281610520820135066119a05281610540820135066119c052816105608201350661184052816105808201350661186052816105a08201350661188052816105c0820135066118a052816105e0820135066118c05281610600820135066118e05281610620820135066119005281610640820135066119205281610660820135066119405281610680820135066119e052816106a08201350661200052816106c08201350661202052816106e0820135066120405281610700820135066120605281610720820135066120805281610740820135066120a05281610760820135066120c05281610780820135066120e052816107a08201350661210052816107c08201350661212052826107e08201350661232052826108008201350661230052826108208201350661236052826108408201350661234052506109c05115610ce3576024803501806109e05160051b0190508035602082013560441b81019050604082013560881b81019050606082013560cc1b81019050608082013560a083013560441b8101905060c083013560881b8101905060e083013560cc1b8101905061010083013561012084013560441b8101905061014084013560881b8101905061016084013560cc1b810190506101808401356101a085013560441b810190506101c085013560881b810190506101e085013560cc1b810190508361340052826134205281613440528061346052868110878410168783108886101616610cdd576375d4fa5360e11b5f5260045ffd5b50505050505b6103805160e01b5f526103a05160e01b60045260085f208061348052602480350160206103a05102808260206134800137600435602401915060c0826134a083013760e0016134802083810661266081905290925090508281800961268052828161268051096126a05250805f526112e0516020526112c051604052611320516060526113005160805260a05f20905081810661260052805f5260016020535060215f90812082810661262052815261136051602052611340516040526113a0516060526113805160805260a09020818106612640819052828180096133205282816133205109613340528281613340510961336052806133805250805f526113e0516020526113c05160405261142051606052611400516080526114605160a0526114405160c0526114a05160e05261148051610100526101205f2090508181066126c052806126e0525061260051612620516103c051600180856001602480350160206103a0510281018360058a0984600c8b0999505b81831015610e9b57823585811085169450858a82089050858183018909975085818c01880996505084888209905084888b099950602083019250610e5c565b50505080610eb25763374a972f60e01b5f5260045ffd5b50508161300052806130205250505050508081600161260051086126205109806103805160015b81811015610eee578483840992508001610ed9565b5050613100528181800990508181820961312052506126c05161038051819060015b81811015610f25578483840992508001610f10565b50508061304052826001840382089050613300518084036103e051858286088684840992508687848808820990508684840992508687848808820990508687888686098808820990506103c051925086828609915086600188038708878485099450876001890389898b888d8b8c0909090896506130205194508493508782860994508488878709955085898388099650868a61312051890997508760205f526020805260206040528b8b8a0960605260028c036080528b60a05260205f60c05f60055afa610ffd57633e2529ef60e21b5f5260045ffd5b5f5198508b818a0990508b8b8a0998508b828a0991508b613120518a0998508b838a0992508b858a0998508b848a0993508b8a8a0998508b888a0997508b868a0998508b613020518d8b8c090998508b896130005109613060528b888b09613080528b848709613680528b8388096130a0528b826131005109613140528b8188096130c052505050505050505050505061264051506126005161262051828361190051840982611620510101846118e051850983611600510101098384611940518509836116605101018561192051860984611640510101098485868385096116a051096133805109858661198051870985611620510101876119605188098661160051010109925085866119c051870985611660510101876119a0518809866116405101010991508586878885870961208051096133805109870382089050856126405161338051096133805285868788613060518a0361208051086130c0510961338051098208905085612640516133805109613380528586878860018a036116a051086130a05109613380510982086135005250505050508061264051613380510961338052806117205161266051098182836120205161178051096116405108820890508161266051820990508182836120005161176051096116205108820890508161266051820990508182836119e0516117005109611600510882089050816118405183846126605161186051098586612680516118805109876126a0516118a05109080808826120c0518485612660516120e051098687612680516121005109886126a051612120510908080883846001612600510861262051098461262051866118c051870908935084818687612600518609860808925084838509935084856001612600510885099350846130a05161264051099250848385089350846116c0518509935084838603850893508481868761260051612060510961168051080892505050826130c05161332051098381850383089150836120a05183099150838461314051830983089150508261338051848386038508096135205250508061334051613380510961338052806116e0516116005109816117005161162051098261172051611640510983611740516116605109847f183227397098d014dc2822db40c0ac2e9419f4243cdcb848a1f0fac9f80000008687600389036117a0510888611760518a6116205161160051090909098586878889858a08880886088408611780510894505050505081828384856116605161160051086119e051870308611760510884600286036117a05108096126405109828384858685612040510887600189036117a051080985086117a05109613380510961354052505080613320516133805109613380526002810360038203826116005184036116205108836116205185036116405108846116405186036116605108856116605187036119e05108866133805188898888088a8b8b8a088c8a8e038e8c8d09080909099350868788612640516133805109898a8988088b8c8c8a088d8a8f038f8c8d090809090985089350868788613320516133805109898a8987088b8c8c89088d898f038f8b8c090809090985089350868788613340516133805109898a8986088b8c8c88088d888f038f8a8b090809090985089350505050836117c051820961356052505061336051613380518392500961338052806116205182036119e051088161204051612040510982611640516116405109836116e05185612040516116405109098485868384088785870888030886878788098889611620516119e0510861200051080908925050508261338051848561176051870360010884090990508261202051611640510883611640518503856116e05161204051090884858287611620518903612000510809868685090893505050828361264051613380510984856117605187036001088509099150826117e0518484840809613580525050806116205161162051098161164051611640510982611620518460118408098360048309915083600982099050836003840992508381850385848788611620516116205108612000510809089150508283846120205161164051088561164051611640510809840384856120005187036116205108850908915082613380518209905082836126405161338051098309915082611760518209905082611760518309915082836117e0518585850809613580510861358052505080613360516133805109613380528081611620516119e05109826120005161160051090881612020518303838461164051611620510985611660516116005109080882600160441b82099050826120405184038208905082828208905082611740518209905082600160441b830991508283612000516119e05109830891508261172051848561166051611640510886038508098361176051858661204051612020510887038761166051880808099250836117005185858786860808096135c0525050612000518291506140009009816119e0518208905081614000820990508161164051820890508161400082099050816116205182089050816140008209905081611600518208905081611660518303820890508161174051820990508161400061202051098261200051820890508261400082099050826119e05182089050826140008209905082611660518208905082614000820990508261164051820890508261204051840382089050826117605182099050826117205184838508096135e0525050806126605161164051098161162051820890508161266051820990508161160051820890508161266051820990508161178051820890508082611660518403830891508161364052826116005184036119e05108836116605185036120405108848560018703840883098586848803600108830991508585876126405189858b61264051890908090861362052856126605161202051099450856120005186089450856126605186099450856119e0518608945085612660518609945085858703612040510894508561164051870361202051089150858687878903600108840987858903600108099150858487036116605108868760018903830882099050868760018903880887099550866126405184099250868284089250866126405184099250868684089250866126405184099250868184089250508161360052505083611620518503612000510892508361164051850385868488036001088609089250836117005161362051099150838461174051850983089150838461176051613640510983089150836116e0518309915083846117a051613600510983089150836135c05183089250836135e05184089250836118005184099250836133805184099250826135a05283613340516133805109613380525050508061368051826135a0518461358051866135605188613540518a61352051613500510808080808096136608190526126e0516136a08190526136c0919091526102e460043501610520816136e03750506105606136a020818106612700525f81905260016020538160215f20066127205260026020538160215f20066127405260036020538160215f20066127605260046020538160215f20066127805260056020538160215f20066127a05260066020538160215f20066127c05260076020538160215f20066127e05260086020538160215f20066128005260096020538160215f200661282052600a6020538160215f200661284052600b6020538160215f200661286052600c6020538160215f200661288052600d6020538160215f20066128a052600e6020538160215f20066128c052600f6020538160215f20066128e05260106020538160215f20066129005260116020538160215f20066129205260126020538160215f20066129405260136020538160215f20066129605260146020538160215f20066129805260156020538160215f20066129a05260166020538160215f20066129c05260176020538160215f20066129e05260186020538160215f2006612a005260196020538160215f2006612a2052601a6020538160215f2006612a4052601b6020538160215f2006612a6052601c6020538160215f2006612a8052601d6020538160215f2006612aa052601d6020535060215f908120828106612ac05281526123205160205261230051604052612360516060526123405160805260a08120829006612b00526113c0516113e0518482800985600387838609088683840914611c42576328f6b59560e21b5f5260045ffd5b50613160919091526131805261140051611420518482800985600387838609088683840914611c7a576328f6b59560e21b5f5260045ffd5b50815f528060205250506130405160405260406131a060605f60075afa90506040613160608061316060065afa8116905061144051611460518482830985600387838609088683840914611cd7576328f6b59560e21b5f5260045ffd5b505f91909152602052613040518290800960405260406131a060605f60075afa16604061316060808160065afa81169050611480516114a0518482830985600387838609088683840914611d34576328f6b59560e21b5f5260045ffd5b505f91909152602052613040518290818180090960405260406131a060605f60075afa16604061316060808160065afa8116905061120051611220518482830985600387838609088683840914611d94576328f6b59560e21b5f5260045ffd5b50815f528060205250508161270051836001612b0051080960405260406131a060605f60075afa16604061316060808160065afa8116905061124051611260518482830985600387838609088683840914611df8576328f6b59560e21b5f5260045ffd5b50815f528060205250508161272051836001612b0051080960405260406131a060605f60075afa16604061316060808160065afa81169050611280516112a0518482830985600387838609088683840914611e5c576328f6b59560e21b5f5260045ffd5b50815f528060205250508161274051836001612b0051080960405260406131a060605f60075afa16604061316060808160065afa811690506112c0516112e0518482830985600387838609088683840914611ec0576328f6b59560e21b5f5260045ffd5b50815f528060205250508161276051836001612b0051080960405260406131a060605f60075afa16604061316060808160065afa8116905061130051611320518482830985600387838609088683840914611f24576328f6b59560e21b5f5260045ffd5b50815f528060205250508161278051836001612b0051080960405260406131a060605f60075afa16604061316060808160065afa8116905061134051611360518482830985600387838609088683840914611f88576328f6b59560e21b5f5260045ffd5b50815f52806020525050816127a051836001612b0051080960405260406131a060605f60075afa16604061316060808160065afa81169050611380516113a0518482830985600387838609088683840914611fec576328f6b59560e21b5f5260045ffd5b50815f52806020525050816127c051836001612b0051080960405260406131a060605f60075afa16604061316060808160065afa81169050610400515f52610420516020526127e05160405260406131a060605f60075afa16604061316060808160065afa81169050610440515f52610460516020526128005160405260406131a060605f60075afa16604061316060808160065afa81169050610480515f526104a0516020526128205160405260406131a060605f60075afa16604061316060808160065afa811690506104c0515f526104e0516020526128405160405260406131a060605f60075afa16604061316060808160065afa81169050610500515f52610520516020526128605160405260406131a060605f60075afa16604061316060808160065afa81169050610540515f52610560516020526128805160405260406131a060605f60075afa16604061316060808160065afa81169050610580515f526105a0516020526128a05160405260406131a060605f60075afa16604061316060808160065afa811690506105c0515f526105e0516020526128c05160405260406131a060605f60075afa16604061316060808160065afa81169050610600515f52610620516020526128e05160405260406131a060605f60075afa16604061316060808160065afa81169050610640515f52610660516020526129005160405260406131a060605f60075afa16604061316060808160065afa81169050610680515f526106a0516020526129205160405260406131a060605f60075afa16604061316060808160065afa811690506106c0515f526106e0516020526129405160405260406131a060605f60075afa16604061316060808160065afa81169050610700515f52610720516020526129605160405260406131a060605f60075afa16604061316060808160065afa81169050610740515f52610760516020526129805160405260406131a060605f60075afa16604061316060808160065afa81169050610780515f526107a051602052816129a051836001612b0051080960405260406131a060605f60075afa16604061316060808160065afa811690506107c0515f526107e051602052816129c051836001612b0051080960405260406131a060605f60075afa16604061316060808160065afa81169050610800515f5261082051602052816129e051836001612b0051080960405260406131a060605f60075afa16604061316060808160065afa81169050610840515f526108605160205281612a0051836001612b0051080960405260406131a060605f60075afa16604061316060808160065afa81169050610880515f526108a051602052612a205160405260406131a060605f60075afa16604061316060808160065afa811690506108c0515f526108e051602052612a405160405260406131a060605f60075afa16604061316060808160065afa81169050610900515f5261092051602052612a605160405260406131a060605f60075afa16604061316060808160065afa81169050610940515f5261096051602052612a805160405260406131a060605f60075afa16604061316060808160065afa81169050610980515f526109a051602052612aa05160405260406131a060605f60075afa16604061316060808160065afa8116905081826116005184612b00516119e051090861270051098283846116205186612b00516120005109086127205109820890508283846116405186612b00516120205109086127405109820890508283846116605186612b00516120405109086127605109820890508283846116805186612b00516120605109086127805109820890508283846116a05186612b00516120805109086127a05109820890508283846116c05186612b00516120a05109086127c051098208905082836116e0516127e051098208905082836117005161280051098208905082836117205161282051098208905082836117405161284051098208905082836117605161286051098208905082836117805161288051098208905082836117a0516128a051098208905082836117c0516128c051098208905082836117e0516128e051098208905082836118005161290051098208905082836119605161292051098208905082836119805161294051098208905082836119a05161296051098208905082836119c0516129805109820890508283846118405186612b00516120c05109086129a05109820890508283846118605186612b00516120e05109086129c05109820890508283846118805186612b00516121005109086129e05109820890508283846118a05186612b0051612120510908612a0051098208905082836118c051612a2051098208905082836118e051612a40510982089050828361190051612a60510982089050828361192051612a80510982089050828361194051612aa051098208905082613660518208905060015f5260026020528083036040525060406131a060605f60075afa16604061316060808160065afa168061273b57634e71976360e01b5f5260045ffd5b612b00516126c0516123005161232051868283098760038983860908888384091461276f576328f6b59560e21b5f5260045ffd5b50815f528060205250508060405260406131a060605f60075afa92506040613160608061316060065afa83169250612340516123605186828309876003898386090888838409146127c9576328f6b59560e21b5f5260045ffd5b50815f52806020525050836103c05185838509096040525060406131a060605f60075afa821691506040613220608061316060065afa82169150612300515f52612320516020526123405160405261236051606052806080526040806060604060075afa8216915060406131e060805f60065afa82169150613200518403613200526109c0511561291e5761340051613420518582830986600388838609088783840914612880576328f6b59560e21b5f5260045ffd5b505f919091526020528281800960405260406060805f60075afa82169150613440516134605185828309866003888386090887838409146128ca576328f6b59560e21b5f5260045ffd5b505f91825260205260409060608160075afa821691506132205160a0526132405160c05260406132206080606060065afa821691506131e0516040526132005160605260406131e060805f60065afa821691505b5080612933576301882d8160e01b5f5260045ffd5b613220515f52613240516020527f198e9393920d483a7260bfb731fb5d25f1aa493335a9e71297e485b7aef312c26040527f1800deef121f1e76426a00665e5c4479674322d4f75edadd46debd5cd992f6ed6060527f090689d0585ff075ec9e99ad690c3395bc4b313370b38ef355acdadcd122975b6080527f12c85ea5db8c6deb4aab71808dcb408fe3d1e7690c43d37b4ce6cc0166fa7daa60a0526131e05160c0526132005160e052610a005161010052610a205161012052610a405161014052610a60516101605260205f6101805f60085afa90505f518116612a225763d71fd26360e01b5f5260045ffd5b50505060015f5260205ff35b5f805f8060408587031215612a41575f80fd5b843567ffffffffffffffff80821115612a58575f80fd5b818701915087601f830112612a6b575f80fd5b813581811115612a79575f80fd5b886020828501011115612a8a575f80fd5b602092830196509450908601359080821115612aa4575f80fd5b818701915087601f830112612ab7575f80fd5b813581811115612ac5575f80fd5b8860208260051b8501011115612ad9575f80fd5b9598949750506020019450505056fea26469706673582212208b0e64f448f8ca94ad4209bf16242aa6e3981740a0cfebbb460fde8402add08664736f6c63430008170033";

type UltraVerifierConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: UltraVerifierConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class UltraVerifier__factory extends ContractFactory {
  constructor(...args: UltraVerifierConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(overrides || {});
  }
  override deploy(overrides?: NonPayableOverrides & { from?: string }) {
    return super.deploy(overrides || {}) as Promise<
      UltraVerifier & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): UltraVerifier__factory {
    return super.connect(runner) as UltraVerifier__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): UltraVerifierInterface {
    return new Interface(_abi) as UltraVerifierInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): UltraVerifier {
    return new Contract(address, _abi, runner) as unknown as UltraVerifier;
  }
}
