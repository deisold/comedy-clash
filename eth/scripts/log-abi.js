const hre = require("hardhat");

async function main() {
    const contractName = "ComedyTheater";
    
    // Load the artifact for your contract
    const artifact = await hre.artifacts.readArtifact(contractName);
    
    // Log the ABI to the console
    console.log("ABI:", JSON.stringify(artifact.abi));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
