const MyToken = artifacts.require("MyToken");

contract("MyToken", (accounts) => {
  let myToken;

  beforeEach(async () => {
    myToken = await MyToken.new("My Token", "MYT", 1000);
  });

  it("should initialize the contract correctly", async () => {
    const name = await myToken.name();
    assert.equal(name, "My Token", "Incorrect name");

    const symbol = await myToken.symbol();
    assert.equal(symbol, "MYT", "Incorrect symbol");

    const totalSupply = await myToken.totalSupply();
    assert.equal(totalSupply, 1000, "Incorrect total supply");

    const owner = await myToken.owner();
    assert.equal(owner, accounts[0], "Incorrect owner");

    const balance = await myToken.balanceOf(accounts[0]);
    assert.equal(balance, 1000, "Incorrect balance");
  });

  it("should transfer tokens correctly", async () => {
    const amount = 100;
    const sender = accounts[0];
    const receiver = accounts[1];

    await myToken.transfer(receiver, amount, { from: sender });

    const senderBalance = await myToken.balanceOf(sender);
    assert.equal(senderBalance, 900, "Incorrect sender balance");

    const receiverBalance = await myToken.balanceOf(receiver);
    assert.equal(receiverBalance, 100, "Incorrect receiver balance");
  });

  it("should approve and transferFrom tokens correctly", async () => {
    const amount = 100;
    const sender = accounts[0];
    const spender = accounts[1];
    const receiver = accounts[2];

    await myToken.approve(spender, amount, { from: sender });
    const allowance = await myToken.allowance(sender, spender);
    assert.equal(allowance, amount, "Incorrect allowance");

    await myToken.transferFrom(sender, receiver, amount, { from: spender });

    const senderBalance = await myToken.balanceOf(sender);
    assert.equal(senderBalance, 900, "Incorrect sender balance");

    const receiverBalance = await myToken.balanceOf(receiver);
    assert.equal(receiverBalance, 100, "Incorrect receiver balance");
  });

  it("should burn tokens correctly", async () => {
    const amount = 100;
    const owner = accounts[0];

    await myToken.burn(amount, { from: owner });

    const totalSupply = await myToken.totalSupply();
    assert.equal(totalSupply, 900, "Incorrect total supply");

    const ownerBalance = await myToken.balanceOf(owner);
    assert.equal(ownerBalance, 900, "Incorrect owner balance");
  });

  it("should lock and unlock token transfer correctly", async () => {
    const owner = accounts[0];

    await myToken.lock(true, { from: owner });
    const isLocked = await myToken.isLocked();
    assert.equal(isLocked, true, "Token should be locked");

    try {
      await myToken.transfer(accounts[1], 100, { from: accounts[0] });
    } catch (error) {
      assert.include(
        error.message,
        "Token transfer is currently locked",
        "Incorrect error message"
      );
    }

    await myToken.lock(false, { from: owner });
    const isUnlocked = await myToken.isLocked();
    assert.equal(isUnlocked, false, "Token should be unlocked");

    await myToken.transfer(accounts[1], 100, { from: accounts[0] });
    const senderBalance = await myToken.balanceOf(accounts[0]);
    assert.equal(senderBalance, 900, "Incorrect sender balance");
    
    const receiverBalance = await myToken.balanceOf(accounts[1]);
    assert.equal(receiverBalance, 100, "Incorrect receiver balance");
});

it("should only allow the owner to lock and unlock token transfer", async () => {
    const owner = accounts[0];
    const nonOwner = accounts[1];
  
    // Check that non-owner cannot lock and unlock
    try {
      await myToken.lock(true, { from: nonOwner });
    } catch (error) {
      assert.include(
        error.message,
        "Only owner can call this function",
        "Incorrect error message"
      );
    }
  
    try {
      await myToken.lock(false, { from: nonOwner });
    } catch (error) {
      assert.include(
        error.message,
        "Only owner can call this function",
        "Incorrect error message"
      );
    }
  });
  
});  
