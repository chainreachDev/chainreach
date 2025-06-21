import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("ChainReach Protocol", function () {
    async function deployVaultFactoryFixture() {
        const [owner, brand, creator] = await ethers.getSigners();
        const verifier = owner;
        const VaultFactory = await ethers.getContractFactory("VaultFactory");
        const vaultFactory = await VaultFactory.deploy(verifier.address);
        return { vaultFactory, verifier, brand, creator };
    }

    it("Should allow a brand to create, fund, and complete a campaign", async function () {
        const { vaultFactory, verifier, brand, creator } = await loadFixture(deployVaultFactoryFixture);
        const payoutAmount = ethers.parseEther("1.0");
        const campaignData = "ipfs://QmT...1";

        await expect(vaultFactory.connect(brand).createVault(creator.address, payoutAmount, campaignData))
            .to.emit(vaultFactory, "VaultCreated");

        const vaultAddress = await vaultFactory.allVaults(0);
        const chainVault = await ethers.getContractAt("ChainVault", vaultAddress);

        await expect(brand.sendTransaction({ to: vaultAddress, value: payoutAmount }))
            .to.changeEtherBalances([brand, chainVault], [-payoutAmount, payoutAmount]);
        expect(await chainVault.status()).to.equal(1);

        await expect(chainVault.connect(verifier).verifyPost())
            .to.emit(chainVault, "PostVerified");
        expect(await chainVault.status()).to.equal(2);

        await expect(chainVault.connect(creator).withdraw())
            .to.changeEtherBalances([creator, chainVault], [payoutAmount, -payoutAmount]);
    });
});
