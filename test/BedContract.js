const BedContract = artifacts.require("BedContract");

contract("BedContract", (accounts) => {
    let bedContract;

    beforeEach(async () => {
        bedContract = await BedContract.new("BedContract", 1000);
    })

    it("should init correctly", async () => {
        const name = await bedContract.name();
        assert.equal(name, "BedContract", "Incorrect name");
        const money = await bedContract.ballanceOf(accounts[0]);
        assert.equal(money, 1000, "Incorrect money");
        const owner = await bedContract.owner();
        assert.equal(owner, accounts[0], "Incorrect owner");
    })

    it("should burn correctly", async () => {
        const ballanceBeforeBurn = await bedContract.ballanceOf(accounts[0]);
        await bedContract.burn(500, {from: accounts[0]});
        const ballanceAfterBurn = await bedContract.ballanceOf(accounts[0]);
        assert.equal(ballanceBeforeBurn - ballanceAfterBurn, 500, "Incorrect burn");
    })

    it("should lock correctly", async () => {
        await bedContract.approve(accounts[1], 10, {from: accounts[0]});
        await bedContract.lock({from: accounts[0]});
        const isLocked = await bedContract.isLocked(accounts[0]);
        assert.equal(isLocked, true, "Incorrect locked");

        try {
            await bedContract.approve(accounts[2], 10, {from: accounts[0]});
            // assert.fail("Expected an error to be thrown at approve when lock");
        } catch (error) {
            assert.include(error.message, "money is locked", "Incorrect approve when locked")
        }

        try {
            await bedContract.transfer_from(accounts[0], accounts[2], 10, {from: accounts[1]});
            // assert.fail("Expected an error to be thrown at approve when transfer_from");
        } catch (error) {
            assert.include(error.message, "money is locked", "Incorrect transfer_from when locked")
        }

        try {
            await bedContract.transfer(accounts[1], 10, {from: accounts[0]});
            // assert.fail("Expected an error to be thrown at approve when transfer");
        } catch (error) {
            assert.include(error.message, "money is locked", "Incorrect transfer when locked")
        }
    })

    it("should approve correctly", async () => {
        await bedContract.approve(accounts[1], 50, {from: accounts[0]});
        const allowance = await bedContract.allowance(accounts[0], accounts[1]);
        assert.equal(allowance, 50, "Incorrect aprrove");
    })

    it("should transfer from correctly", async () => {
        const ballanceAccountFromBefore = await bedContract.ballanceOf(accounts[0]);
        const ballanceAccountToBefore = await bedContract.ballanceOf(accounts[2]);

        await bedContract.approve(accounts[1], 50, {from: accounts[0]});
        await bedContract.transfer_from(accounts[0], accounts[2], 50, {from: accounts[1]});

        const ballanceAccountFromAffter = await bedContract.ballanceOf(accounts[0]);
        const ballanceAccountToAffter = await bedContract.ballanceOf(accounts[2]);

        assert.equal(ballanceAccountFromAffter - ballanceAccountFromBefore, -50, "Incorrect ballance of from account when transfer_from");
        assert.equal(ballanceAccountToBefore - ballanceAccountToAffter, -50, "Incorrect ballance of to account when transfer_from");
    })

    it("should transfer correctly", async () => {
        const ballanceAccountFromBefore = await bedContract.ballanceOf(accounts[0]);
        const ballanceAccountToBefore = await bedContract.ballanceOf(accounts[2]);
        await bedContract.transfer(accounts[2], 50, {from: accounts[0]});
        const ballanceAccountFromAffter = await bedContract.ballanceOf(accounts[0]);
        const ballanceAccountToAffter = await bedContract.ballanceOf(accounts[2]);
        assert.equal(ballanceAccountFromAffter - ballanceAccountFromBefore, -50, "Incorrect ballance of from account when transfer");
        assert.equal(ballanceAccountToBefore - ballanceAccountToAffter, -50, "Incorrect ballance of to account when transfer");    
    })
})