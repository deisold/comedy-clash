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
import type { NonPayableOverrides } from "../common";
import type { ComedyTheater, ComedyTheaterInterface } from "../ComedyTheater";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_description",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_durationInDays",
        type: "uint256",
      },
    ],
    name: "addShow",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getShowAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "manager",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "shows",
    outputs: [
      {
        internalType: "contract ComedyClash",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x6080604052348015600f57600080fd5b50336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555061254b8061005f6000396000f3fe608060405234801561001057600080fd5b506004361061004c5760003560e01c80631b5c3734146100515780631dcc1e101461006f57806330f0931e1461008b578063481c6a75146100bb575b600080fd5b6100596100d9565b60405161006691906102c2565b60405180910390f35b61008960048036038101906100849190610463565b6100e6565b005b6100a560048036038101906100a091906104bf565b610239565b6040516100b2919061056b565b60405180910390f35b6100c3610278565b6040516100d091906105a7565b60405180910390f35b6000600180549050905090565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610174576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161016b9061061f565b60405180910390fd5b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1683836040516101a69061029c565b6101b2939291906106ad565b604051809103906000f0801580156101ce573d6000803e3d6000fd5b5090506001819080600181540180825580915050600190039060005260206000200160009091909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550505050565b6001818154811061024957600080fd5b906000526020600020016000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b611e2a806106ec83390190565b6000819050919050565b6102bc816102a9565b82525050565b60006020820190506102d760008301846102b3565b92915050565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b610344826102fb565b810181811067ffffffffffffffff821117156103635761036261030c565b5b80604052505050565b60006103766102dd565b9050610382828261033b565b919050565b600067ffffffffffffffff8211156103a2576103a161030c565b5b6103ab826102fb565b9050602081019050919050565b82818337600083830152505050565b60006103da6103d584610387565b61036c565b9050828152602081018484840111156103f6576103f56102f6565b5b6104018482856103b8565b509392505050565b600082601f83011261041e5761041d6102f1565b5b813561042e8482602086016103c7565b91505092915050565b610440816102a9565b811461044b57600080fd5b50565b60008135905061045d81610437565b92915050565b6000806040838503121561047a576104796102e7565b5b600083013567ffffffffffffffff811115610498576104976102ec565b5b6104a485828601610409565b92505060206104b58582860161044e565b9150509250929050565b6000602082840312156104d5576104d46102e7565b5b60006104e38482850161044e565b91505092915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b600061053161052c610527846104ec565b61050c565b6104ec565b9050919050565b600061054382610516565b9050919050565b600061055582610538565b9050919050565b6105658161054a565b82525050565b6000602082019050610580600083018461055c565b92915050565b6000610591826104ec565b9050919050565b6105a181610586565b82525050565b60006020820190506105bc6000830184610598565b92915050565b600082825260208201905092915050565b7f4e6f7420746865206d616e616765720000000000000000000000000000000000600082015250565b6000610609600f836105c2565b9150610614826105d3565b602082019050919050565b60006020820190508181036000830152610638816105fc565b9050919050565b600081519050919050565b60005b8381101561066857808201518184015260208101905061064d565b60008484015250505050565b600061067f8261063f565b61068981856105c2565b935061069981856020860161064a565b6106a2816102fb565b840191505092915050565b60006060820190506106c26000830186610598565b81810360208301526106d48185610674565b90506106e360408301846102b3565b94935050505056fe608060405260008060146101000a81548160ff02191690831515021790555034801561002a57600080fd5b50604051611e2a380380611e2a833981810160405281019061004c91906102cd565b826000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550816001908161009b9190610553565b5062015180816100ab9190610654565b426100b69190610696565b6002819055505050506106ca565b6000604051905090565b600080fd5b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000610103826100d8565b9050919050565b610113816100f8565b811461011e57600080fd5b50565b6000815190506101308161010a565b92915050565b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b61018982610140565b810181811067ffffffffffffffff821117156101a8576101a7610151565b5b80604052505050565b60006101bb6100c4565b90506101c78282610180565b919050565b600067ffffffffffffffff8211156101e7576101e6610151565b5b6101f082610140565b9050602081019050919050565b60005b8381101561021b578082015181840152602081019050610200565b60008484015250505050565b600061023a610235846101cc565b6101b1565b9050828152602081018484840111156102565761025561013b565b5b6102618482856101fd565b509392505050565b600082601f83011261027e5761027d610136565b5b815161028e848260208601610227565b91505092915050565b6000819050919050565b6102aa81610297565b81146102b557600080fd5b50565b6000815190506102c7816102a1565b92915050565b6000806000606084860312156102e6576102e56100ce565b5b60006102f486828701610121565b935050602084015167ffffffffffffffff811115610315576103146100d3565b5b61032186828701610269565b9250506040610332868287016102b8565b9150509250925092565b600081519050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000600282049050600182168061038e57607f821691505b6020821081036103a1576103a0610347565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b6000600883026104097fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff826103cc565b61041386836103cc565b95508019841693508086168417925050509392505050565b6000819050919050565b600061045061044b61044684610297565b61042b565b610297565b9050919050565b6000819050919050565b61046a83610435565b61047e61047682610457565b8484546103d9565b825550505050565b600090565b610493610486565b61049e818484610461565b505050565b5b818110156104c2576104b760008261048b565b6001810190506104a4565b5050565b601f821115610507576104d8816103a7565b6104e1846103bc565b810160208510156104f0578190505b6105046104fc856103bc565b8301826104a3565b50505b505050565b600082821c905092915050565b600061052a6000198460080261050c565b1980831691505092915050565b60006105438383610519565b9150826002028217905092915050565b61055c8261033c565b67ffffffffffffffff81111561057557610574610151565b5b61057f8254610376565b61058a8282856104c6565b600060209050601f8311600181146105bd57600084156105ab578287015190505b6105b58582610537565b86555061061d565b601f1984166105cb866103a7565b60005b828110156105f3578489015182556001820191506020850194506020810190506105ce565b86831015610610578489015161060c601f891682610519565b8355505b6001600288020188555050505b505050505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b600061065f82610297565b915061066a83610297565b925082820261067881610297565b9150828204841483151761068f5761068e610625565b5b5092915050565b60006106a182610297565b91506106ac83610297565b92508282019050808211156106c4576106c3610625565b5b92915050565b611751806106d96000396000f3fe608060405234801561001057600080fd5b50600436106100b45760003560e01c80638f239a76116100715780638f239a761461017d578063aaf5eb681461019b578063ad73349e146101b9578063e8069f65146101f0578063f30cd5741461020c578063ffc6ff1e1461023c576100b4565b8063481c6a75146100b95780635790d088146100d7578063597e1fb5146100f35780636ec02be9146101115780637284e4161461012f578063732ff6201461014d575b600080fd5b6100c1610246565b6040516100ce9190610bb8565b60405180910390f35b6100f160048036038101906100ec9190610d2d565b61026a565b005b6100fb610386565b6040516101089190610def565b60405180910390f35b610119610399565b6040516101269190610e23565b60405180910390f35b61013761039f565b6040516101449190610ebd565b60405180910390f35b61016760048036038101906101629190610f0b565b61042d565b6040516101749190611008565b60405180910390f35b6101856105ce565b6040516101929190610e23565b60405180910390f35b6101a36105d4565b6040516101b09190610e23565b60405180910390f35b6101d360048036038101906101ce919061102a565b6105e0565b6040516101e7989796959493929190611057565b60405180910390f35b61020a60048036038101906102059190611116565b6107f0565b005b610226600480360381019061022191906111e1565b610a79565b6040516102339190610def565b60405180910390f35b610244610aa8565b005b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600060149054906101000a900460ff161561028457600080fd5b426002541161029257600080fd5b600360018160018154018082558091505003906000526020600020905050600460008154809291906102c390611250565b91905055506000600360016004546102db9190611298565b815481106102ec576102eb6112cc565b5b906000526020600020906009020190506004548160000181905550338160010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508381600201908161035b9190611507565b508281600301908161036d9190611507565b508181600401908161037f9190611507565b5050505050565b600060149054906101000a900460ff1681565b60045481565b600180546103ac9061132a565b80601f01602080910402602001604051908101604052809291908181526020018280546103d89061132a565b80156104255780601f106103fa57610100808354040283529160200191610425565b820191906000526020600020905b81548152906001019060200180831161040857829003601f168201915b505050505081565b610435610b53565b60038381548110610449576104486112cc565b5b9060005260206000209060090201600501828154811061046c5761046b6112cc565b5b90600052602060002090600302016040518060600160405290816000820180546104959061132a565b80601f01602080910402602001604051908101604052809291908181526020018280546104c19061132a565b801561050e5780601f106104e35761010080835404028352916020019161050e565b820191906000526020600020905b8154815290600101906020018083116104f157829003601f168201915b505050505081526020016001820180546105279061132a565b80601f01602080910402602001604051908101604052809291908181526020018280546105539061132a565b80156105a05780601f10610575576101008083540402835291602001916105a0565b820191906000526020600020905b81548152906001019060200180831161058357829003601f168201915b505050505081526020016002820160009054906101000a900460ff1660ff1660ff1681525050905092915050565b60025481565b670de0b6b3a764000081565b600381815481106105f057600080fd5b90600052602060002090600902016000915090508060000154908060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169080600201805461063f9061132a565b80601f016020809104026020016040519081016040528092919081815260200182805461066b9061132a565b80156106b85780601f1061068d576101008083540402835291602001916106b8565b820191906000526020600020905b81548152906001019060200180831161069b57829003601f168201915b5050505050908060030180546106cd9061132a565b80601f01602080910402602001604051908101604052809291908181526020018280546106f99061132a565b80156107465780601f1061071b57610100808354040283529160200191610746565b820191906000526020600020905b81548152906001019060200180831161072957829003601f168201915b50505050509080600401805461075b9061132a565b80601f01602080910402602001604051908101604052809291908181526020018280546107879061132a565b80156107d45780601f106107a9576101008083540402835291602001916107d4565b820191906000526020600020905b8154815290600101906020018083116107b757829003601f168201915b5050505050908060060154908060070154908060080154905088565b600060149054906101000a900460ff161561080a57600080fd5b426002541161081857600080fd5b60006003858154811061082e5761082d6112cc565b5b906000526020600020906009020190503373ffffffffffffffffffffffffffffffffffffffff168160010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff160361089a57600080fd5b6005600086815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff161561090257600080fd5b600060405180606001604052808681526020018581526020018460ff1681525090508160050181908060018154018082558091505060019003906000526020600020906003020160009091909190915060008201518160000190816109679190611507565b50602082015181600101908161097d9190611507565b5060408201518160020160006101000a81548160ff021916908360ff160217905550505060016005600088815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055508260ff16826006016000828254610a2191906115d9565b92505081905550816007016000815480929190610a3d90611250565b91905055508160070154670de0b6b3a76400008360060154610a5f919061160d565b610a69919061167e565b8260080181905550505050505050565b60056020528160005260406000206020528060005260406000206000915091509054906101000a900460ff1681565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610b36576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610b2d906116fb565b60405180910390fd5b6001600060146101000a81548160ff021916908315150217905550565b60405180606001604052806060815260200160608152602001600060ff1681525090565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000610ba282610b77565b9050919050565b610bb281610b97565b82525050565b6000602082019050610bcd6000830184610ba9565b92915050565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b610c3a82610bf1565b810181811067ffffffffffffffff82111715610c5957610c58610c02565b5b80604052505050565b6000610c6c610bd3565b9050610c788282610c31565b919050565b600067ffffffffffffffff821115610c9857610c97610c02565b5b610ca182610bf1565b9050602081019050919050565b82818337600083830152505050565b6000610cd0610ccb84610c7d565b610c62565b905082815260208101848484011115610cec57610ceb610bec565b5b610cf7848285610cae565b509392505050565b600082601f830112610d1457610d13610be7565b5b8135610d24848260208601610cbd565b91505092915050565b600080600060608486031215610d4657610d45610bdd565b5b600084013567ffffffffffffffff811115610d6457610d63610be2565b5b610d7086828701610cff565b935050602084013567ffffffffffffffff811115610d9157610d90610be2565b5b610d9d86828701610cff565b925050604084013567ffffffffffffffff811115610dbe57610dbd610be2565b5b610dca86828701610cff565b9150509250925092565b60008115159050919050565b610de981610dd4565b82525050565b6000602082019050610e046000830184610de0565b92915050565b6000819050919050565b610e1d81610e0a565b82525050565b6000602082019050610e386000830184610e14565b92915050565b600081519050919050565b600082825260208201905092915050565b60005b83811015610e78578082015181840152602081019050610e5d565b60008484015250505050565b6000610e8f82610e3e565b610e998185610e49565b9350610ea9818560208601610e5a565b610eb281610bf1565b840191505092915050565b60006020820190508181036000830152610ed78184610e84565b905092915050565b610ee881610e0a565b8114610ef357600080fd5b50565b600081359050610f0581610edf565b92915050565b60008060408385031215610f2257610f21610bdd565b5b6000610f3085828601610ef6565b9250506020610f4185828601610ef6565b9150509250929050565b600082825260208201905092915050565b6000610f6782610e3e565b610f718185610f4b565b9350610f81818560208601610e5a565b610f8a81610bf1565b840191505092915050565b600060ff82169050919050565b610fab81610f95565b82525050565b60006060830160008301518482036000860152610fce8282610f5c565b91505060208301518482036020860152610fe88282610f5c565b9150506040830151610ffd6040860182610fa2565b508091505092915050565b600060208201905081810360008301526110228184610fb1565b905092915050565b6000602082840312156110405761103f610bdd565b5b600061104e84828501610ef6565b91505092915050565b60006101008201905061106d600083018b610e14565b61107a602083018a610ba9565b818103604083015261108c8189610e84565b905081810360608301526110a08188610e84565b905081810360808301526110b48187610e84565b90506110c360a0830186610e14565b6110d060c0830185610e14565b6110dd60e0830184610e14565b9998505050505050505050565b6110f381610f95565b81146110fe57600080fd5b50565b600081359050611110816110ea565b92915050565b600080600080608085870312156111305761112f610bdd565b5b600061113e87828801610ef6565b945050602085013567ffffffffffffffff81111561115f5761115e610be2565b5b61116b87828801610cff565b935050604085013567ffffffffffffffff81111561118c5761118b610be2565b5b61119887828801610cff565b92505060606111a987828801611101565b91505092959194509250565b6111be81610b97565b81146111c957600080fd5b50565b6000813590506111db816111b5565b92915050565b600080604083850312156111f8576111f7610bdd565b5b600061120685828601610ef6565b9250506020611217858286016111cc565b9150509250929050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b600061125b82610e0a565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff820361128d5761128c611221565b5b600182019050919050565b60006112a382610e0a565b91506112ae83610e0a565b92508282039050818111156112c6576112c5611221565b5b92915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000600282049050600182168061134257607f821691505b602082108103611355576113546112fb565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b6000600883026113bd7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82611380565b6113c78683611380565b95508019841693508086168417925050509392505050565b6000819050919050565b60006114046113ff6113fa84610e0a565b6113df565b610e0a565b9050919050565b6000819050919050565b61141e836113e9565b61143261142a8261140b565b84845461138d565b825550505050565b600090565b61144761143a565b611452818484611415565b505050565b5b818110156114765761146b60008261143f565b600181019050611458565b5050565b601f8211156114bb5761148c8161135b565b61149584611370565b810160208510156114a4578190505b6114b86114b085611370565b830182611457565b50505b505050565b600082821c905092915050565b60006114de600019846008026114c0565b1980831691505092915050565b60006114f783836114cd565b9150826002028217905092915050565b61151082610e3e565b67ffffffffffffffff81111561152957611528610c02565b5b611533825461132a565b61153e82828561147a565b600060209050601f831160018114611571576000841561155f578287015190505b61156985826114eb565b8655506115d1565b601f19841661157f8661135b565b60005b828110156115a757848901518255600182019150602085019450602081019050611582565b868310156115c457848901516115c0601f8916826114cd565b8355505b6001600288020188555050505b505050505050565b60006115e482610e0a565b91506115ef83610e0a565b925082820190508082111561160757611606611221565b5b92915050565b600061161882610e0a565b915061162383610e0a565b925082820261163181610e0a565b9150828204841483151761164857611647611221565b5b5092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b600061168982610e0a565b915061169483610e0a565b9250826116a4576116a361164f565b5b828204905092915050565b7f4e6f7420746865206d616e616765720000000000000000000000000000000000600082015250565b60006116e5600f83610e49565b91506116f0826116af565b602082019050919050565b60006020820190508181036000830152611714816116d8565b905091905056fea264697066735822122039fec99df7b4c034393ef835114de31e4036087f88d07d21b36b409cf9d27ab664736f6c634300081b0033a26469706673582212206e39d2ebd495ec6eaede182794c1fc4229f2d7b623807b498b6f3a36c06b41aa64736f6c634300081b0033";

type ComedyTheaterConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ComedyTheaterConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ComedyTheater__factory extends ContractFactory {
  constructor(...args: ComedyTheaterConstructorParams) {
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
      ComedyTheater & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): ComedyTheater__factory {
    return super.connect(runner) as ComedyTheater__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ComedyTheaterInterface {
    return new Interface(_abi) as ComedyTheaterInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): ComedyTheater {
    return new Contract(address, _abi, runner) as unknown as ComedyTheater;
  }
}
