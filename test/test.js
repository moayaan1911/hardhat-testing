const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");
describe("MyTest", () => {
  async function runEveryTime() {
    const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
    const ONE_GWEI = 1000000000;
    const lockedAmount = ONE_GWEI;
    const unlockedTime = (await time.latest()) + ONE_YEAR_IN_SECS;
    // console.log(lockedAmount, unlockedTime);

    const [owner, otherAccount] = await ethers.getSigners();
    // console.log(owner, otherAccount);
    const myTestcontractFactory = await ethers.getContractFactory("MyTest");
    const myTest = await myTestcontractFactory.deploy(unlockedTime, {
      value: lockedAmount,
    });
    // console.log(myTest);
    return { myTest, unlockedTime, owner, otherAccount, lockedAmount };
  }

  describe("Deployment", () => {
    it("should check the lock time", async () => {
      const { myTest, unlockedTime } = await loadFixture(runEveryTime);
      expect(await myTest.unlockedTime()).to.equal(unlockedTime);
    });
    it("should check the owner", async () => {
      const { owner, myTest } = await loadFixture(runEveryTime);
      expect(await myTest.owner()).to.equal(owner.address);
    });
    it("should check the locked amount", async () => {
      const { lockedAmount, myTest } = await loadFixture(runEveryTime);
      expect(await ethers.provider.getBalance(myTest.address)).to.equal(
        lockedAmount
      );
    });

    it("should fail if unlocked is not in the future", async () => {
      const latestTime = await time.latest();
      const myTest = await hre.ethers.getContractFactory("MyTest");

      await expect(
        myTest.deploy(latestTime, { value: "1" })
      ).to.be.revertedWith("UnlockedTime should be of the future");
    });
  });

  describe("Withdraw", () => {
    it("should fail with custom error if withdraw early", async () => {
      const { myTest, owner } = await loadFixture(runEveryTime);
      await expect(myTest.connect(owner).withdraw()).to.be.revertedWith(
        "Wait till time period to complete"
      );
    });
    it("should fail if not owner", async () => {
      const { myTest, otherAccount } = await loadFixture(runEveryTime);
      await expect(myTest.connect(otherAccount).withdraw()).to.be.revertedWith(
        "You can't withdraw"
      );
    });
    it("should pass if owner and if time matched", async () => {
      const { myTest, owner, unlockedTime } = await loadFixture(runEveryTime);
      await time.increaseTo(unlockedTime);
      await expect(myTest.connect(owner).withdraw()).not.to.be.reverted;
    });
  });

  runEveryTime();
});
