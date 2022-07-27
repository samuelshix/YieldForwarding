import { Box, Button, TextField, FormLabel, FormControl, FormHelperText, InputLabel, Input } from "@material-ui/core"
import { useEffect, useState } from "react"
import { useBalance, useContract, useProvider } from 'wagmi'
import axios from "axios"
import { DotenvConfigOutput } from "dotenv"
import positionManager from '../../chain-info/contracts/PositionManager.json'
import yieldForwarding from "../../chain-info/contracts/ProvideLiquidity.json"
import networkMapping from "../../chain-info/deployments/map.json"
import { useForm } from "../../hooks/useForm"
import { YieldForward } from "../../hooks/yieldForward"
interface Props {
    userAddress: string | undefined;
}
export const YourWallet = (props: Props) => {
    const { userAddress } = props
    const initialState = {
        address: "",
        tokenID: "",
    };
    const { onChange, onSubmit, values } = useForm(
        yieldForwardForm,
        initialState
    );
    async function yieldForwardForm() {
        values.tokenID = selectedNft
        console.log(YieldForward(values.address, values.tokenID))
    }
    const [NftElements, setNftElements] = useState<JSX.Element[]>([])
    const [test, settest] = useState<JSX.Element[]>([])
    const [selectedNft, setNft] = useState<number>(0)
    const [selectedAddress, setAddress] = useState<string>("")
    const [formValues, setValues] = useState(initialState);

    const apiKey = 'ZXKftwn8JJudnknytjrJyhtTkbUjhGYN'
    const alchemyURL = `https://eth-mainnet.alchemyapi.io/nft/v2/${apiKey}/getNFTMetadata`;

    const signer = useProvider()
    const positionManagerContract = useContract({
        addressOrName: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
        contractInterface: positionManager.abi,
        signerOrProvider: signer
    })
    const yieldForwardingContract = useContract({
        addressOrName: '0x8fAceDB5A4f9625AB6227a3d1D587D0814E5704c',
        contractInterface: yieldForwarding.abi,
        signerOrProvider: signer
    })
    const getNftForIndex = async (index: Number): Promise<boolean> => {
        // let hasMoreNFTs;
        return positionManagerContract.tokenOfOwnerByIndex(userAddress, index)
            .then(data => {
                console.log(data)
                let tokenID = parseInt(data)
                yieldForwardingContract.tokenURI(tokenID)
                    .then(data => {
                        let tokenURI = data
                        // console.log(tokenURI)
                        axios.get(`${alchemyURL}?contractAddress=0xC36442b4a4522E871399CD717aBDD847Ab11FE88&tokenId=${tokenID}`)
                            .then(data => {
                                settest(arr => [...arr,
                                <div onClick={() => setNft(tokenID)} key={tokenID} className="transition items-center justify-center ease-in-out p-5 delay-50 hover:scale-105 cursor-pointer hover:bg-indigo-100 bg-white duration-150 font-bold rounded-md">
                                    <h3>{data.data.metadata.name}</h3>
                                    <img src={data.data.media[0].raw} alt={data.data.metadata.name} />
                                </div>
                                ])
                            })
                    })
                return true
            }).catch(err => {
                return false
            })
    }
    useEffect(() => {
        const getNfts = async () => {
            let NftElements: Array<JSX.Element> = [];
            let index = 0
            let flag = true
            while (flag) {
                flag = await getNftForIndex(index)
                if (!flag) {
                    break
                }
                index++
            }
            console.log(NftElements)
            return NftElements
        }
        getNfts().then(nfts => {
            setNftElements(nfts)
        })
        // positionManagerContract.tokenOfOwnerByIndex('0x61cF6c0B69d5B031f6CFd3b30F5f70F3e12D571A', 0)
    }, [])
    // const [userBalance]: any = useCall({
    //     abi: abi,
    //     address: "0x22c45Ad85f1dBfC4BbF0B393874fb94668Ce2a4D",
    //     method: "balanceOf",
    //     args: [address],
    // }) ?? [0];

    // var balanceItems = Array.from(Array(Number(userBalance)).keys())
    // const { account } = useEthers()
    // const etherBalance = useEtherBalance(account) || BigNumber.from(0)
    // const nfts = useToken("0xC36442b4a4522E871399CD717aBDD847Ab11FE88")
    // const balance = nfts?.toString()
    // const tokenBalance = useTokenBalance("0xC36442b4a4522E871399CD717aBDD847Ab11FE88", account)
    // const formattedTokenBalance: number = tokenBalance ? parseFloat(formatUnits(tokenBalance, 18)) : 0

    return (
        <>
            <form className="" id="" onSubmit={onSubmit}>
                <h1 className="mt-10">Step 1: Select a pool below</h1>
                <Box className="grid grid-cols-2 gap-2 m-2 mt-5">
                    {test}
                </Box>
                {selectedNft > 0 &&
                    <h2 className="mt-5">{`Selected position: ${selectedNft}`}</h2>}
                <h2 className="mt-10">Step 2: Enter an address to send to</h2>
                <TextField id="filled-basic" onChange={onChange} label="Address" name="address" variant="filled" />
                <TextField type="number" style={{ display: "none" }} onChange={onChange} name="tokenID" value={selectedNft} />
                <FormHelperText id="yield-forwarding-about">100% of yields from your LP will be directed toward this address</FormHelperText>
                <button className="w-20 mt-4 mb-10 flex items-center justify-center transition ease-in-out hover:bg-indigo-500 duration-150 h-12 p-3 font-semibold hover:border-transparent text-white bg-black rounded-md">Submit</button>
            </form>
        </>
    )
}