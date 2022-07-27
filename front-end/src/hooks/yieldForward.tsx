import networkMapping from "../chain-info/deployments/map.json"
import YieldForwardContract from "../chain-info/contracts/ProvideLiquidity.json"
import { useContract, useContractWrite, usePrepareContractWrite } from 'wagmi'
import { useNetwork } from 'wagmi'

const contractAddress = networkMapping["4"]["ProvideLiquidity"][0]
export function YieldForward(recipient: String, tokenID: String) {
    const { config } = usePrepareContractWrite({
        addressOrName: contractAddress,
        contractInterface: YieldForwardContract.abi,
        functionName: "deposit",
        args: [recipient, tokenID]
    })
    return useContractWrite(config)
}