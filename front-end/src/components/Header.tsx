import { Button, makeStyles } from "@material-ui/core"
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
interface Props {
    isConnected: boolean
    address: string | undefined
}

export const Header = (props: Props) => {
    const { isConnected, address } = props
    const { connect } = useConnect({
        connector: new InjectedConnector(),
    })
    const { disconnect } = useDisconnect()
    return (
        <nav className="bg-slate-100 border-gray-200 px-2 sm:px-4 py-2.5 rounded dark:bg-gray-900">
            <div className="container flex flex-wrap justify-between items-center mx-auto">

                <h1 className="self-center italic text-xl whitespace-nowrap dark:text-white">Yield Forwarding</h1>

                <div className="flex items-center">
                    {isConnected ?
                        <button onClick={() => disconnect()}
                            className="flex items-center justify-center transition ease-in-out delay-50 hover:scale-105 hover:bg-indigo-500 duration-150 h-12 p-3 font-semibold hover:border-transparent text-white bg-black rounded-md"
                        >Disconnect</button> :
                        <button className="flex items-center justify-center transition ease-in-out delay-50 hover:scale-105 hover:bg-indigo-500 duration-150 h-12 p-3 font-semibold hover:border-transparent text-white bg-black rounded-md"
                            onClick={() => connect()}>Connect Wallet</button>
                    }
                </div>
            </div>
        </nav>
        // <div className="bg-white border-gray-200 px-2 sm:px-4 py-2.5 rounded dark:bg-gray-900">
        //     <div className="">
        //         {isConnected ?
        //             <>
        //                 <h1 className="font-medium cursor-pointer mob:p-2 laptop:p-0">Connected to {address}</h1>
        //                 <button onClick={() => disconnect()}
        //                     className="absolute inset-x-0 h-30 w-25 text-sm tablet:text-base p-2 laptop:p-2 m-1 laptop:m-2 rounded-lg text-white bg-black transition-all duration-300 ease-out first:ml-0 hover:scale-105 active:scale-100"
        //                 >Disconnect</button>
        //             </> :
        //             <button className="absolute inset-x-0 h-30 w-25 text-sm tablet:text-base p-1 laptop:p-2 m-1 laptop:m-2 rounded-lg text-white bg-black transition-all duration-300 ease-out first:ml-0 hover:scale-105 active:scale-100"
        //                 onClick={() => connect()}>Connect Wallet</button>
        //         }
        //     </div>
        // </div>
    )
}
