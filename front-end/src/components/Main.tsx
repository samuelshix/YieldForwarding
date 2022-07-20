import { useEthers } from "@usedapp/core"
import helperConfig from "../helper-config.json"
import networkMapping from "../chain-info/deployments/map.json"
import { constants } from "ethers"
import { YourWallet } from "./yourWallet/YourWallet"

export type Token = {
    address: string;
}

export const Main = () => {
    const { chainId } = useEthers()

    // const networkName = chainId ? helperConfig[String(chainId)] : "dev"

    const contractAddress = networkMapping["4"]["ProvideLiquidity"][0]

    return (
        <YourWallet></YourWallet>
    )
}