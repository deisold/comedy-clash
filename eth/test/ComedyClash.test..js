const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

const ONE_DAY_IN_SECS = 24 * 60 * 60;

describe("ComedyClash", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deploy(name, daysToFinish) {

        // const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;

        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount] = await ethers.getSigners();

        const ComedyClash = await ethers.getContractFactory("ComedyClash");
        const comedyClash = await ComedyClash.deploy(name, daysToFinish);

        const blockTimeStamp = await time.latest();

        return { comedyClash, blockTimeStamp, owner, otherAccount };
    }

    // Helper to wrap the fixture so loadFixture can use it properly
    function fixture(name, daysToFinish) {
        return async () => fixtureWithParams(name, daysToFinish);  // Returns a function
    }

    describe("Deployment", async function () {
        it("Should set the right values", async function () {
            const { comedyClash, blockTimeStamp, owner } = await deploy("Test", 2);
            expect(await comedyClash.manager()).to.equal(owner);
            expect(await comedyClash.closed()).to.false;
            expect(await comedyClash.description()).to.equal("Test");

            const diff = Number(await comedyClash.completionTimestamp()) - (blockTimeStamp + ONE_DAY_IN_SECS * 2);
            console.log(`completion time diff ${diff}`);

            expect(diff).to.equal(0);
        });
    });
});
