from brownie import ProvideLiquidity, network, config, MockMint
import yaml
import json
import os
import shutil
from scripts.helpful_scripts import (
    get_account,
    LOCAL_BLOCKCHAIN_ENVIRONMENTS,
    deploy_mocks,
)

manager_address = "0xC36442B4A4522E871399CD717ABDD847AB11FE88"


def deploy_fund_me():
    account = get_account()
    print(f"The active network is {network.show_active()}")
    # print("Deploying Mocks...")
    # mock_mint = deploy_mocks(account)
    # tokenId = mock_mint.mintNewPosition()[0]
    # print(f"Newly minted position: {[i for i in MockMint.deposits(tokenId)]}")
    # mock_mint.retrieveNFT(tokenId)
    # print(f"Owner of NFT is {MockMint.nonfungiblePositionManager.ownerOf(tokenId)}")
    provide_liq = ProvideLiquidity.deploy(
        {"from": account},
        # publish_source=config["networks"][network.show_active()].get("verify", False),
    )
    # provide_liq.deposit()
    update_front_end()
    return provide_liq


def update_front_end():
    copy_folders_to_front_end("./build", "./front-end/src/chain-info")
    with open("brownie-config.yaml", "r") as brownie_config:
        config_dict = yaml.load(brownie_config, Loader=yaml.FullLoader)
        with open("./front-end/src/brownie-config.json", "w") as brownie_config_json:
            json.dump(config_dict, brownie_config_json)


def copy_folders_to_front_end(src, dest):
    if os.path.exists(dest):
        shutil.rmtree(dest)
    shutil.copytree(src, dest)


def main():
    contract = deploy_fund_me()
