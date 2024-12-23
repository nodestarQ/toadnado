/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "../common";

export interface ToadnadoL2Interface extends Interface {
  getFunction(
    nameOrSignature:
      | "ROOT_HISTORY_SIZE"
      | "bridgeDebt"
      | "bridgeEth"
      | "commitments"
      | "commitmentsTreeRoots"
      | "currentRootIndex"
      | "deposit"
      | "ethPendingWithdrawals"
      | "filledSubtrees"
      | "getL1Root"
      | "getLastKnowL1Root"
      | "getLastKnowL2Root"
      | "getLastRoot"
      | "hashLeftRight"
      | "isKnownL1Root"
      | "isKnownL2Root"
      | "isSpent"
      | "isSpentArray"
      | "l1ToadnadoAddress"
      | "l2ScrollMessenger"
      | "levels"
      | "nextIndex"
      | "nullifiers"
      | "readSingleSlot"
      | "recieveBridgedEth"
      | "requestEthBridge"
      | "roots"
      | "sendLatestRootToL1"
      | "verifier"
      | "withdraw"
      | "withdrawPending"
      | "zeros"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic: "Deposit" | "PendingWithdrawal" | "Withdrawal"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "ROOT_HISTORY_SIZE",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "bridgeDebt",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "bridgeEth",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "commitments",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "commitmentsTreeRoots",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "currentRootIndex",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "deposit",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "ethPendingWithdrawals",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "filledSubtrees",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getL1Root",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getLastKnowL1Root",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getLastKnowL2Root",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getLastRoot",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "hashLeftRight",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "isKnownL1Root",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "isKnownL2Root",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "isSpent",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "isSpentArray",
    values: [BigNumberish[]]
  ): string;
  encodeFunctionData(
    functionFragment: "l1ToadnadoAddress",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "l2ScrollMessenger",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "levels", values?: undefined): string;
  encodeFunctionData(functionFragment: "nextIndex", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "nullifiers",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "readSingleSlot",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "recieveBridgedEth",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "requestEthBridge",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "roots", values: [BigNumberish]): string;
  encodeFunctionData(
    functionFragment: "sendLatestRootToL1",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "verifier", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "withdraw",
    values: [
      BigNumberish,
      BigNumberish,
      BigNumberish,
      AddressLike,
      BigNumberish,
      BytesLike
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawPending",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "zeros", values: [BigNumberish]): string;

  decodeFunctionResult(
    functionFragment: "ROOT_HISTORY_SIZE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "bridgeDebt", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "bridgeEth", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "commitments",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "commitmentsTreeRoots",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "currentRootIndex",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "deposit", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "ethPendingWithdrawals",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "filledSubtrees",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getL1Root", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getLastKnowL1Root",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getLastKnowL2Root",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getLastRoot",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "hashLeftRight",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isKnownL1Root",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isKnownL2Root",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "isSpent", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "isSpentArray",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "l1ToadnadoAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "l2ScrollMessenger",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "levels", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "nextIndex", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "nullifiers", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "readSingleSlot",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "recieveBridgedEth",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "requestEthBridge",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "roots", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "sendLatestRootToL1",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "verifier", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "withdrawPending",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "zeros", data: BytesLike): Result;
}

export namespace DepositEvent {
  export type InputTuple = [
    commitment: BigNumberish,
    leafIndex: BigNumberish,
    timestamp: BigNumberish
  ];
  export type OutputTuple = [
    commitment: bigint,
    leafIndex: bigint,
    timestamp: bigint
  ];
  export interface OutputObject {
    commitment: bigint;
    leafIndex: bigint;
    timestamp: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace PendingWithdrawalEvent {
  export type InputTuple = [recipient: AddressLike, nullifier: BigNumberish];
  export type OutputTuple = [recipient: string, nullifier: bigint];
  export interface OutputObject {
    recipient: string;
    nullifier: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace WithdrawalEvent {
  export type InputTuple = [recipient: AddressLike, nullifier: BigNumberish];
  export type OutputTuple = [recipient: string, nullifier: bigint];
  export interface OutputObject {
    recipient: string;
    nullifier: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface ToadnadoL2 extends BaseContract {
  connect(runner?: ContractRunner | null): ToadnadoL2;
  waitForDeployment(): Promise<this>;

  interface: ToadnadoL2Interface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  ROOT_HISTORY_SIZE: TypedContractMethod<[], [bigint], "view">;

  bridgeDebt: TypedContractMethod<[], [bigint], "view">;

  bridgeEth: TypedContractMethod<
    [_amount: BigNumberish, gasLimit: BigNumberish],
    [void],
    "nonpayable"
  >;

  commitments: TypedContractMethod<[arg0: BigNumberish], [boolean], "view">;

  commitmentsTreeRoots: TypedContractMethod<
    [arg0: BigNumberish],
    [boolean],
    "view"
  >;

  currentRootIndex: TypedContractMethod<[], [bigint], "view">;

  deposit: TypedContractMethod<
    [_preCommitment: BigNumberish],
    [void],
    "payable"
  >;

  ethPendingWithdrawals: TypedContractMethod<[], [bigint], "view">;

  filledSubtrees: TypedContractMethod<[arg0: BigNumberish], [bigint], "view">;

  getL1Root: TypedContractMethod<[key: BigNumberish], [bigint], "view">;

  getLastKnowL1Root: TypedContractMethod<[], [bigint], "view">;

  getLastKnowL2Root: TypedContractMethod<[], [bigint], "view">;

  getLastRoot: TypedContractMethod<[], [bigint], "view">;

  hashLeftRight: TypedContractMethod<
    [_left: BigNumberish, _right: BigNumberish],
    [bigint],
    "view"
  >;

  isKnownL1Root: TypedContractMethod<[_root: BigNumberish], [boolean], "view">;

  isKnownL2Root: TypedContractMethod<[_root: BigNumberish], [boolean], "view">;

  isSpent: TypedContractMethod<
    [_nullifierHash: BigNumberish],
    [boolean],
    "view"
  >;

  isSpentArray: TypedContractMethod<
    [_nullifierHashes: BigNumberish[]],
    [boolean[]],
    "view"
  >;

  l1ToadnadoAddress: TypedContractMethod<[], [string], "view">;

  l2ScrollMessenger: TypedContractMethod<[], [string], "view">;

  levels: TypedContractMethod<[], [bigint], "view">;

  nextIndex: TypedContractMethod<[], [bigint], "view">;

  nullifiers: TypedContractMethod<[arg0: BigNumberish], [boolean], "view">;

  readSingleSlot: TypedContractMethod<
    [l1_contract: AddressLike, slot: BigNumberish],
    [string],
    "view"
  >;

  recieveBridgedEth: TypedContractMethod<[], [void], "payable">;

  requestEthBridge: TypedContractMethod<
    [gasLimit: BigNumberish],
    [void],
    "nonpayable"
  >;

  roots: TypedContractMethod<[arg0: BigNumberish], [bigint], "view">;

  sendLatestRootToL1: TypedContractMethod<
    [gasLimit: BigNumberish],
    [void],
    "payable"
  >;

  verifier: TypedContractMethod<[], [string], "view">;

  withdraw: TypedContractMethod<
    [
      _l1root: BigNumberish,
      _l2root: BigNumberish,
      _nullifier: BigNumberish,
      _recipient: AddressLike,
      _amount: BigNumberish,
      snarkProof: BytesLike
    ],
    [void],
    "payable"
  >;

  withdrawPending: TypedContractMethod<
    [_nullifier: BigNumberish],
    [void],
    "nonpayable"
  >;

  zeros: TypedContractMethod<[i: BigNumberish], [bigint], "view">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "ROOT_HISTORY_SIZE"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "bridgeDebt"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "bridgeEth"
  ): TypedContractMethod<
    [_amount: BigNumberish, gasLimit: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "commitments"
  ): TypedContractMethod<[arg0: BigNumberish], [boolean], "view">;
  getFunction(
    nameOrSignature: "commitmentsTreeRoots"
  ): TypedContractMethod<[arg0: BigNumberish], [boolean], "view">;
  getFunction(
    nameOrSignature: "currentRootIndex"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "deposit"
  ): TypedContractMethod<[_preCommitment: BigNumberish], [void], "payable">;
  getFunction(
    nameOrSignature: "ethPendingWithdrawals"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "filledSubtrees"
  ): TypedContractMethod<[arg0: BigNumberish], [bigint], "view">;
  getFunction(
    nameOrSignature: "getL1Root"
  ): TypedContractMethod<[key: BigNumberish], [bigint], "view">;
  getFunction(
    nameOrSignature: "getLastKnowL1Root"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "getLastKnowL2Root"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "getLastRoot"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "hashLeftRight"
  ): TypedContractMethod<
    [_left: BigNumberish, _right: BigNumberish],
    [bigint],
    "view"
  >;
  getFunction(
    nameOrSignature: "isKnownL1Root"
  ): TypedContractMethod<[_root: BigNumberish], [boolean], "view">;
  getFunction(
    nameOrSignature: "isKnownL2Root"
  ): TypedContractMethod<[_root: BigNumberish], [boolean], "view">;
  getFunction(
    nameOrSignature: "isSpent"
  ): TypedContractMethod<[_nullifierHash: BigNumberish], [boolean], "view">;
  getFunction(
    nameOrSignature: "isSpentArray"
  ): TypedContractMethod<
    [_nullifierHashes: BigNumberish[]],
    [boolean[]],
    "view"
  >;
  getFunction(
    nameOrSignature: "l1ToadnadoAddress"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "l2ScrollMessenger"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "levels"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "nextIndex"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "nullifiers"
  ): TypedContractMethod<[arg0: BigNumberish], [boolean], "view">;
  getFunction(
    nameOrSignature: "readSingleSlot"
  ): TypedContractMethod<
    [l1_contract: AddressLike, slot: BigNumberish],
    [string],
    "view"
  >;
  getFunction(
    nameOrSignature: "recieveBridgedEth"
  ): TypedContractMethod<[], [void], "payable">;
  getFunction(
    nameOrSignature: "requestEthBridge"
  ): TypedContractMethod<[gasLimit: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "roots"
  ): TypedContractMethod<[arg0: BigNumberish], [bigint], "view">;
  getFunction(
    nameOrSignature: "sendLatestRootToL1"
  ): TypedContractMethod<[gasLimit: BigNumberish], [void], "payable">;
  getFunction(
    nameOrSignature: "verifier"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "withdraw"
  ): TypedContractMethod<
    [
      _l1root: BigNumberish,
      _l2root: BigNumberish,
      _nullifier: BigNumberish,
      _recipient: AddressLike,
      _amount: BigNumberish,
      snarkProof: BytesLike
    ],
    [void],
    "payable"
  >;
  getFunction(
    nameOrSignature: "withdrawPending"
  ): TypedContractMethod<[_nullifier: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "zeros"
  ): TypedContractMethod<[i: BigNumberish], [bigint], "view">;

  getEvent(
    key: "Deposit"
  ): TypedContractEvent<
    DepositEvent.InputTuple,
    DepositEvent.OutputTuple,
    DepositEvent.OutputObject
  >;
  getEvent(
    key: "PendingWithdrawal"
  ): TypedContractEvent<
    PendingWithdrawalEvent.InputTuple,
    PendingWithdrawalEvent.OutputTuple,
    PendingWithdrawalEvent.OutputObject
  >;
  getEvent(
    key: "Withdrawal"
  ): TypedContractEvent<
    WithdrawalEvent.InputTuple,
    WithdrawalEvent.OutputTuple,
    WithdrawalEvent.OutputObject
  >;

  filters: {
    "Deposit(uint256,uint32,uint256)": TypedContractEvent<
      DepositEvent.InputTuple,
      DepositEvent.OutputTuple,
      DepositEvent.OutputObject
    >;
    Deposit: TypedContractEvent<
      DepositEvent.InputTuple,
      DepositEvent.OutputTuple,
      DepositEvent.OutputObject
    >;

    "PendingWithdrawal(address,uint256)": TypedContractEvent<
      PendingWithdrawalEvent.InputTuple,
      PendingWithdrawalEvent.OutputTuple,
      PendingWithdrawalEvent.OutputObject
    >;
    PendingWithdrawal: TypedContractEvent<
      PendingWithdrawalEvent.InputTuple,
      PendingWithdrawalEvent.OutputTuple,
      PendingWithdrawalEvent.OutputObject
    >;

    "Withdrawal(address,uint256)": TypedContractEvent<
      WithdrawalEvent.InputTuple,
      WithdrawalEvent.OutputTuple,
      WithdrawalEvent.OutputObject
    >;
    Withdrawal: TypedContractEvent<
      WithdrawalEvent.InputTuple,
      WithdrawalEvent.OutputTuple,
      WithdrawalEvent.OutputObject
    >;
  };
}
