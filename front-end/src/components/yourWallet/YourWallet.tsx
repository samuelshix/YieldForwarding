import { Token } from "../Main"
import { Box, Button } from "@material-ui/core"
import { useCall, useEtherBalance, useEthers, useToken, useTokenBalance } from "@usedapp/core"
import { formatEther, formatUnits } from "ethers/lib/utils"
import { BigNumber } from "ethers"
import ProvideLiquidity from "../../chain-info/contracts/ProvideLiquidity.json"
export const YourWallet = () => {
    const { abi } = ProvideLiquidity
    // const [userBalance]: any = useCall({
    //     abi: abi,
    //     address: "0x22c45Ad85f1dBfC4BbF0B393874fb94668Ce2a4D",
    //     method: "balanceOf",
    //     args: [address],
    // }) ?? [0];

    // var balanceItems = Array.from(Array(Number(userBalance)).keys())
    const { account } = useEthers()
    const etherBalance = useEtherBalance(account) || BigNumber.from(0)
    const nfts = useToken("0xC36442b4a4522E871399CD717aBDD847Ab11FE88")
    const balance = nfts?.toString()
    const tokenBalance = useTokenBalance("0xC36442b4a4522E871399CD717aBDD847Ab11FE88", account)
    const formattedTokenBalance: number = tokenBalance ? parseFloat(formatUnits(tokenBalance, 18)) : 0
    return (
        <Box>
            <h1>Your Wallet</h1>
            <Box>
                <h2>{formattedTokenBalance}</h2>
                <Button>Deposit</Button>
            </Box>
        </Box>
    )
}