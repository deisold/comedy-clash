async function main() {
    const ComedyTheater = await ethers.getContractFactory("ComedyTheater");
    const comedyTheater = await ComedyTheater.deploy();
    await comedyTheater.deployed;
    console.log("ComedyTheater deployed to:", await comedyTheater.getAddress());
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  