from brownie import network
from scripts.helpful_scripts import LOCAL_BLOCKCHAIN_ENVIRONMENTS, get_account
import pytest
from scripts.deploy import deploy_fund_me


def test_deposit():
    NFT = 21926
    account = get_account()
    recipient = get_account(index=1)
    contract = deploy_fund_me()
    contract.deposit(recipient, NFT, {"from": account})
    # print(contract.deposits(NFT))
    assert contract.deposits(NFT).recipient == recipient
