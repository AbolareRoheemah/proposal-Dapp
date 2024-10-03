import { useCallback, useContext } from "react";
import { toast } from "react-toastify";
import useContract from "./useContract";
import { useAppKitAccount } from "@reown/appkit/react";
import { useAppKitNetwork } from "@reown/appkit/react";
import { liskSepoliaNetwork } from "../connection";
import { GlobalStateContext } from "../context/GlobalContext";
import { parseEther } from "ethers";

const useVote = () => {
    const contract = useContract(true);
    const { address } = useAppKitAccount();
    const { chainId } = useAppKitNetwork();
    const {setVoteLoading} = useContext(GlobalStateContext)
    
    return useCallback(
        async (_proposalId) => {
            setVoteLoading(true)
            if (!address) {
                setVoteLoading(false)
                toast.error("Connect your wallet!");
                return;
            }
            if (Number(chainId) !== liskSepoliaNetwork.chainId) {
                setVoteLoading(false)
                toast.error("You are not connected to the right network");
                return;
            }

            if (!contract) {
                setVoteLoading(false)
                toast.error("Cannot get contract!");
                return;
            }

            try {
                const estimatedGas = await contract.vote.estimateGas(
                    _proposalId
                );
                const tx = await contract.vote(
                    _proposalId,
                    {
                        gasLimit: (estimatedGas * BigInt(120)) / BigInt(100),
                    }
                );
                const reciept = await tx.wait();

                if (reciept.status === 1) {
                    setVoteLoading(false)
                    toast.success("Vote successful");
                    return;
                }
                toast.error("Vote failed");
                setVoteLoading(false)
                return;
            } catch (error) {
                console.error("error while voting: ", error);
                setVoteLoading(false)
                toast.error("Voting errored");
            }
        },
        [address, chainId, contract]
    );
};

export default useVote;
