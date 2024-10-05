import { useCallback, useContext } from "react";
import { toast } from "react-toastify";
import useContract from "./useContract";
import { useAppKitAccount } from "@reown/appkit/react";
import { useAppKitNetwork } from "@reown/appkit/react";
import { liskSepoliaNetwork } from "../connection";
import { parseEther } from "ethers";
import { GlobalStateContext } from "../context/GlobalContext";

const useCreateProposal = () => {
    const contract = useContract(true);
    const { address } = useAppKitAccount();
    const { chainId } = useAppKitNetwork();
    const {setLoading} = useContext(GlobalStateContext)
    return useCallback(
        async (description, recipient, amount, duration, minVote) => {
            setLoading(true)
            if (
                !description ||
                !recipient ||
                !amount ||
                !duration ||
                !minVote
            ) {
                toast.error("Missing field(s)");
                setLoading(false)
                return;
            }
            if (!address) {
                toast.error("Connect your wallet!");
                setLoading(false)
                return;
            }
            if (Number(chainId) !== liskSepoliaNetwork.chainId) {
                toast.error("You are not connected to the right network");
                setLoading(false)
                return;
            }

            if (!contract) {
                toast.error("Cannot get contract!");
                setLoading(false)
                return;
            }

            try {
                const estimatedGas = await contract.createProposal.estimateGas(
                    description,
                    recipient,
                    parseEther(amount),
                    duration,
                    minVote
                );
                const tx = await contract.createProposal(
                    description,
                    recipient,
                    parseEther(amount),
                    duration,
                    minVote,
                    {
                        gasLimit: (estimatedGas * BigInt(120)) / BigInt(100),
                    }
                );
                const reciept = await tx.wait();

                // console.log("recipt", reciept)

                if (reciept.status === 1) {
                    setLoading(false)
                    toast.success("Proposal Creation successful");
                    return;
                }
                toast.error("Proposal Creation failed");
                setLoading(false)
                return;
            } catch (error) {
                console.error("error while creating proposal: ", error);
                setLoading(false)
                toast.error("Proposal Creation errored");
            }
        },
        [address, chainId, contract]
    );
};

export default useCreateProposal;
