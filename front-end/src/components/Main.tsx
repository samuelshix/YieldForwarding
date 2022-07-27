import helperConfig from "../helper-config.json"
import networkMapping from "../chain-info/deployments/map.json"
import { constants } from "ethers"
import { YourWallet } from "./yourWallet/YourWallet"
import { useBalance } from 'wagmi'
import { useState } from "react"
export type Token = {
    address: string;
}
interface Props {
    userAddress: string | undefined;
    isConnected: boolean;
}
export const Main = (props: Props) => {
    const contractAddress = networkMapping["4"]["ProvideLiquidity"][0]
    const { userAddress, isConnected } = props
    const { data, isError, isLoading } = useBalance({
        addressOrName: userAddress
    })
    return (
        <div className="mt-10">
            {isConnected ?
                <>
                    {isLoading ?? <div>Loading...</div>}
                    {isError ?? <div>Error</div>}
                    <YourWallet userAddress={userAddress} />
                </> :
                <h1 className="max-w-xl">Connect your wallet to get started.</h1>
            }

        </div>
    )
}