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
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedListener,
  TypedContractMethod,
} from "./common";

export declare namespace ComedyClash {
  export type VotingStruct = {
    voter: string;
    comment: string;
    value: BigNumberish;
  };

  export type VotingStructOutput = [
    voter: string,
    comment: string,
    value: bigint
  ] & { voter: string; comment: string; value: bigint };
}

export interface ComedyClashInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "PRECISION"
      | "closeSubmission"
      | "closed"
      | "completionTimestamp"
      | "createSubmissions"
      | "createVotingForSubmission"
      | "description"
      | "getVoteForSubmission"
      | "manager"
      | "submissionCount"
      | "submissionVoters"
      | "submissions"
  ): FunctionFragment;

  encodeFunctionData(functionFragment: "PRECISION", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "closeSubmission",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "closed", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "completionTimestamp",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "createSubmissions",
    values: [string, string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "createVotingForSubmission",
    values: [BigNumberish, string, string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "description",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getVoteForSubmission",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "manager", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "submissionCount",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "submissionVoters",
    values: [BigNumberish, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "submissions",
    values: [BigNumberish]
  ): string;

  decodeFunctionResult(functionFragment: "PRECISION", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "closeSubmission",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "closed", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "completionTimestamp",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "createSubmissions",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "createVotingForSubmission",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "description",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getVoteForSubmission",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "manager", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "submissionCount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "submissionVoters",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "submissions",
    data: BytesLike
  ): Result;
}

export interface ComedyClash extends BaseContract {
  connect(runner?: ContractRunner | null): ComedyClash;
  waitForDeployment(): Promise<this>;

  interface: ComedyClashInterface;

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

  PRECISION: TypedContractMethod<[], [bigint], "view">;

  closeSubmission: TypedContractMethod<[], [void], "nonpayable">;

  closed: TypedContractMethod<[], [boolean], "view">;

  completionTimestamp: TypedContractMethod<[], [bigint], "view">;

  createSubmissions: TypedContractMethod<
    [_name: string, _topic: string, _preview: string],
    [void],
    "nonpayable"
  >;

  createVotingForSubmission: TypedContractMethod<
    [
      index: BigNumberish,
      _voter: string,
      _comment: string,
      _value: BigNumberish
    ],
    [void],
    "nonpayable"
  >;

  description: TypedContractMethod<[], [string], "view">;

  getVoteForSubmission: TypedContractMethod<
    [indexSubmission: BigNumberish, indexVote: BigNumberish],
    [ComedyClash.VotingStructOutput],
    "view"
  >;

  manager: TypedContractMethod<[], [string], "view">;

  submissionCount: TypedContractMethod<[], [bigint], "view">;

  submissionVoters: TypedContractMethod<
    [arg0: BigNumberish, arg1: AddressLike],
    [boolean],
    "view"
  >;

  submissions: TypedContractMethod<
    [arg0: BigNumberish],
    [
      [bigint, string, string, string, string, bigint, bigint, bigint] & {
        id: bigint;
        artist: string;
        name: string;
        topic: string;
        preview: string;
        averageTotal: bigint;
        averageCount: bigint;
        averageValue: bigint;
      }
    ],
    "view"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "PRECISION"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "closeSubmission"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "closed"
  ): TypedContractMethod<[], [boolean], "view">;
  getFunction(
    nameOrSignature: "completionTimestamp"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "createSubmissions"
  ): TypedContractMethod<
    [_name: string, _topic: string, _preview: string],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "createVotingForSubmission"
  ): TypedContractMethod<
    [
      index: BigNumberish,
      _voter: string,
      _comment: string,
      _value: BigNumberish
    ],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "description"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "getVoteForSubmission"
  ): TypedContractMethod<
    [indexSubmission: BigNumberish, indexVote: BigNumberish],
    [ComedyClash.VotingStructOutput],
    "view"
  >;
  getFunction(
    nameOrSignature: "manager"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "submissionCount"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "submissionVoters"
  ): TypedContractMethod<
    [arg0: BigNumberish, arg1: AddressLike],
    [boolean],
    "view"
  >;
  getFunction(
    nameOrSignature: "submissions"
  ): TypedContractMethod<
    [arg0: BigNumberish],
    [
      [bigint, string, string, string, string, bigint, bigint, bigint] & {
        id: bigint;
        artist: string;
        name: string;
        topic: string;
        preview: string;
        averageTotal: bigint;
        averageCount: bigint;
        averageValue: bigint;
      }
    ],
    "view"
  >;

  filters: {};
}