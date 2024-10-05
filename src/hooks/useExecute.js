import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import useContract from "./useContract";
import { useAppKitAccount } from "@reown/appkit/react";
import { useAppKitNetwork } from "@reown/appkit/react";
import { liskSepoliaNetwork } from "../connection";
import { GlobalStateContext } from "../context/GlobalContext";
import { parseEther } from "ethers";

const useExecute= () => {
    const contract = useContract(true);
    const { address } = useAppKitAccount();
    const { chainId } = useAppKitNetwork();
    const [canExecuteLoading, setCanExecuteLoading] = useState(false)
    const [canExecute, setCanExecute] = useState(false)
    
    const execute = useCallback(
        async (_proposalId) => {
            setCanExecuteLoading(true)
            if (!address) {
                setCanExecuteLoading(false)
                toast.error("Connect your wallet!");
                return;
            }
            if (Number(chainId) !== liskSepoliaNetwork.chainId) {
                setCanExecuteLoading(false)
                toast.error("You are not connected to the right network");
                return;
            }

            if (!contract) {
                setCanExecuteLoading(false)
                toast.error("Cannot get contract!");
                return;
            }

            try {
                const estimatedGas = await contract.executeProposal.estimateGas(
                    _proposalId
                );
                const tx = await contract.executeProposal(
                    _proposalId,
                    {
                        gasLimit: (estimatedGas * BigInt(120)) / BigInt(100),
                    }
                );
                const reciept = await tx.wait();

                if (reciept.status === 1) {
                    setCanExecuteLoading(false)
                    toast.success("Executesuccessful");
                    return;
                }
                toast.error("Executefailed");
                setCanExecuteLoading(false)
                return;
            } catch (error) {
                console.error("error while executing: ", error);
                setCanExecuteLoading(false)
                toast.error(error.reason);
            }
        },
        [address, chainId, contract]
    );
    return {canExecute, execute, canExecuteLoading}
};

export default useExecute;
