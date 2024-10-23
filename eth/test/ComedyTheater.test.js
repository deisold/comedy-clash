require("@nomicfoundation/hardhat-toolbox/network-helpers");

const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

const comedyClashJSON = require ('../artifacts/contracts/ComedyClash.sol/ComedyClash.json');

// Extract the ABI
const comedyClashABI = comedyClashJSON.abi;

describe("ComedyTheater", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deploy() {
        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount] = await ethers.getSigners();

        const ComedyTheater = await ethers.getContractFactory("ComedyTheater");
        const comedyTheater = await ComedyTheater.deploy();

        return { comedyTheater, owner, otherAccount };
    }

    describe("Deployment", async function () {
        it("Should set the right values", async function () {
            const { comedyTheater, owner } = await deploy();

            expect(await comedyTheater.manager()).to.equal(owner);
            expect(await comedyTheater.getShowAmount()).to.equal(0);

        });
    });

    describe("Create new show", async function () {
        it("Should set the right values", async function () {
            const { comedyTheater, owner } = await deploy();

            const description = "Next Saturday new gigs on stage!";
            const submissionPeriodinDays = 5;

            await comedyTheater.addShow(description, submissionPeriodinDays);

            expect(await comedyTheater.getShowAmount()).to.equal(1);

            const comedyClashAddress = await comedyTheater.shows(0);
            const comedyClash = new ethers.Contract(comedyClashAddress, comedyClashABI, owner);

            expect(await comedyClash.description()).to.equal(description);
            expect(await comedyClash.manager()).to.equal(owner);

        });
    });
});