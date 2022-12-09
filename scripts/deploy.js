const hre = require("hardhat");
async function main() {
  const currentTimeStampInSeconds = Math.round(Date.now() / 1000);
  console.log(`Time in seconds is ${currentTimeStampInSeconds}`);
  const OneYearInSeconds = 365 * 24 * 60 * 60;
  console.log(`One Year in seconds is ${OneYearInSeconds}`);
  const unlockedTime = currentTimeStampInSeconds + OneYearInSeconds;
  console.log(`Unlock time is ${unlockedTime}`);
  const lockedAmount = hre.ethers.utils.parseEther("1");
  console.log(`Locked Amount is ${lockedAmount}`);
  const myTestcontractFactory = await hre.ethers.getContractFactory("MyTest");
  const myTestContract = await myTestcontractFactory.deploy(unlockedTime, {
    value: lockedAmount,
  });
  await myTestContract.deployed();
  console.log(`MyTest contract deployed at ${myTestContract.address}`);
}
main()
  .then(() => {
    console.log("SUCCESSFULL MAIN EXECUTION");
    process.exitCode = 0;
  })
  .catch((err) => {
    console.log(err);
    process.exitCode = 1;
  });
