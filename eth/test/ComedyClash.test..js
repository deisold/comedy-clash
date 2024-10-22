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

    async function createDefaultSubmissions(comedyClash) {
        const [owner, secondAccount, thirdAccount] = await ethers.getSigners();

        await comedyClash.connect(secondAccount).createSubmissions("Diego", "Dating in Playa", "Here we go!");
        await comedyClash.connect(thirdAccount).createSubmissions("Ben", "Life is simple", "Yeaaaaah!");
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

    describe("Close the submission time frame", async function () {
        it("Closing sumbission time frame throws error, since only permitted by manager", async function () {
            const { comedyClash, otherAccount } = await deploy("Test", 2);

            try {
                await comedyClash.connect(otherAccount).closeSubmission();
                expect(false)
            } catch (error) {
                expect(error);
            }
        });

        it("Closing sumbission time frame if called by manager", async function () {
            const { comedyClash, otherAccount } = await deploy("Test", 2);

            await comedyClash.closeSubmission();
            expect(await comedyClash.closed());
        });

    });

    describe("Create a new submission", async function () {
        it("Should set values right and add to submission array", async function () {
            const { comedyClash, otherAccount } = await deploy("Test", 2);

            const name = "Diego";
            const topic = "Dating in Playa";
            const preview = "Here we go!";

            await comedyClash.connect(otherAccount).createSubmissions(name, topic, preview);
            expect(await comedyClash.submissionCount()).to.equal(1);

            const newSubmission = await comedyClash.submissions(0);

            expect(newSubmission.id).to.equal(1);
            expect(newSubmission.artist).to.equal(otherAccount);
            expect(newSubmission.name).to.equal(name);
            expect(newSubmission.preview).to.equal(preview);
        });

        it("New submission is rejected when sumbission time frame is closed.", async function () {
            const { comedyClash, otherAccount } = await deploy("Test", 2);

            await comedyClash.closeSubmission();
            expect(await comedyClash.closed());

            try {
                const name = "Diego";
                const topic = "Dating in Playa";
                const preview = "Here we go!";

                await comedyClash.connect(otherAccount).createSubmissions(name, topic, preview);

                expect(false)
            } catch (error) {
                expect(error);
            }
        });

        it("New submission is rejected when sumbission time frame is over but submission not closed yet.", async function () {
            const { comedyClash, otherAccount } = await deploy("Test", 2);

            // Increase time by 3 days
            await ethers.provider.send("evm_increaseTime", [3 * ONE_DAY_IN_SECS]); // 3 days in seconds
            await ethers.provider.send("evm_mine"); // Mine a new block

            try {
                const name = "Diego";
                const topic = "Dating in Playa";
                const preview = "Here we go!";

                await comedyClash.connect(otherAccount).createSubmissions(name, topic, preview);

                expect(false)
            } catch (error) {
                expect(error);
            }
        });
    });

    describe("Votings", async function () {

        it("createVotingForSubmission", async function () {
            const { comedyClash, otherAccount } = await deploy("Test for voting", 2);
            await createDefaultSubmissions(comedyClash);

            const signers = await ethers.getSigners();
            const voterAddress = signers[5];

            const submissionIndex = 0;
            const voterName = "Nick";
            const voterComment = "Cool stuff";
            const voterRating = 5;
            await comedyClash
                .connect(voterAddress)
                .createVotingForSubmission(submissionIndex, voterName, voterComment, voterRating);

            // test
            const vote = await comedyClash.getVoteForSubmission(submissionIndex, 0);
            
            expect(vote).to.not.null;
            expect(vote.voter).equals(voterName);
            expect(vote.comment).equals(voterComment);
            expect(vote.value).equals(BigInt(voterRating));

        });

        it("createVotingForSubmission not possible a second time", async function () {
            const { comedyClash, otherAccount } = await deploy("Test for voting", 2);
            await createDefaultSubmissions(comedyClash);

            const signers = await ethers.getSigners();
            const voterAddress = signers[5];

            const submissionIndex = 0;
            const voterName = "Nick";
            const voterComment = "Cool stuff";
            const voterRating = 5;

            try {
                await comedyClash
                    .connect(voterAddress)
                    .createVotingForSubmission(submissionIndex, voterName, voterComment, voterRating);
                expect(false)
            } catch (error) {
                expect(error)
            }

        });
        it("createVotingForSubmission not possible for the artist of submission", async function () {
            const { comedyClash, secondAccount } = await deploy("Test for voting", 2);
            await createDefaultSubmissions(comedyClash);

            const submissionIndex = 0;
            const voterName = "Nick";
            const voterComment = "Cool stuff";
            const voterRating = 5;

            // secondAccount creates the submission at index 0
            try {
                await comedyClash
                    .connect(secondAccount)
                    .createVotingForSubmission(submissionIndex, voterName, voterComment, voterRating);
                expect(false)
            } catch (error) {
                expect(error)
            }

        });

    });

});
