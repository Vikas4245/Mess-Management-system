const { ethers } = require("hardhat");

async function main() {
    // Deploy VotingSystem contract
    const VotingSystem = await ethers.deployContract("VotingSystem");  
    await VotingSystem.waitForDeployment();
    console.log("VotingSystem contract deployed to:", await VotingSystem.getAddress());

    // Deploy MessAttendance contract
    // const MessAttendance = await ethers.deployContract("MessAttendance");
    // await MessAttendance.waitForDeployment();
    // console.log("MessAttendance contract deployed to:", await MessAttendance.getAddress());

    // // Deploy ComplaintSystem contract
    // const fineRecipient = "0x57D6c70891D01e66f8eb6919372cA7e3e426543e";
    // const ComplaintSystem = await ethers.deployContract("ComplaintSystem", [fineRecipient]);
    // await ComplaintSystem.waitForDeployment();
    // console.log("ComplaintSystem contract deployed to:", await ComplaintSystem.getAddress());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
