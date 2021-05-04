// We import Chai to use its asserting functions here.
const { expect } = require("chai");

// `describe` is a Mocha function that allows you to organize your test. It's
// not actually needed, but having your test organized makes debugging them
// easier. All Mocha functions are available in the global scope.

// `describe` receives the name of a section of your test suite, and a callback.
// The callback must define the test of that section. This callback can't be
// an async function.

describe("Voting contract", function () {
    // Mocha has four functions that let you hook into the the test runner's
    // lifecyle. These are: `before`, `beforeEach`, `after`, `afterEach`.

    // They're very useful to setup the environment for test, and to clean it
    // up after they run.

    // A common pattern is to declare some variables, and assign them in the
    // `before` and `beforeEach` callbacks.

    let Voting;
    let hardhatVoting;
    let owner;
    let addr1;
    let addr2;
    let addrs;


    // `beforeEach` will run before each test, re-deploying the contract every
    // time. It receives a callback, which can be async.
    beforeEach(async function () {
        // Get the ContractFactory and Signers here.
        Voting = await ethers.getContractFactory("MoneyVote");
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

        // To deploy our contract, we just have to call Voting.deploy() and await
        // for it to be deployed(), which happens onces its transaction has been
        // mined.
        hardhatVoting = await Voting.deploy([ethers.utils.formatBytes32String('Sean Connery'),
            ethers.utils.formatBytes32String('Roger Moore'), ethers.utils.formatBytes32String('Daniel Craig')], 20, 1);
    });

    // You can nest describe calls to create subsections.
    describe("Deployment", function () {
        // `it` is another Mocha function. This is the one you use to define your
        // test. It receives the test name, and a callback function.

        // If the callback function is async, Mocha will `await` it.
        it("Verify no votes at creation", async function () {
            votes = await hardhatVoting.getVoteAmount();
            expect (votes).to.equal(0);
        });

        it("Verify empty contract balance at creation", async function () {
            balance = await hardhatVoting.getContractBalance();
            expect (balance).to.equal(0);
        });

        it("Verify end time at creation", async function () {
            endTime = await hardhatVoting.endTime();
            timeStamp = await hardhatVoting.timestamp();
            timeStamp = parseInt(timeStamp) + 20;
            expect (endTime).to.equal(timeStamp);
        });

        it("Verify vote value at creation", async function () {
            voteValue = await hardhatVoting.voteValue();
            expect (voteValue).to.equal(1);
        });
    });

    describe("Voting Transactions", function () {

        it("Should receive ether from buyIn", async function() {
            await hardhatVoting.connect(addr1).buyIn();
            balance = await hardhatVoting.getContractBalance();
            expect (balance).to.equal(0);
        });

        it("Should allow a vote for a candidate from two different voters", async function () {
            // Vote for Sean Connery from address 1
            await hardhatVoting.connect(owner).voteForCandidate(0);
            await hardhatVoting.connect(addr1).voteForCandidate(0);
            numVotes = await hardhatVoting.candidateList(0).totalVotes;
            expect (numVotes).to.equal(2);
        });

        // add your code here to test for second vote from same voter.  The test shold fail.
        // you can use code similar to the one below.

        it("Should not allow a vote for a non-existant candidate", async function () {
            await expect(
                hardhatVoting.voteForCandidate(3)
            )
                .to.be.reverted;

        });

        it("Should not allow a 2nd vote from the same voter", async function () {
            await hardhatVoting.connect(owner).voteForCandidate(0);
            await expect(
                hardhatVoting.connect(owner).voteForCandidate(0)
            ).to.be.reverted;
        });
    });

});