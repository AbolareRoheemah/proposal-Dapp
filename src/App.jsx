import { Box } from "@radix-ui/themes";
import Layout from "./components/Layout";
import CreateProposalModal from "./components/CreateProposalModal";
import Proposals from "./components/Proposals";
import useContract from "./hooks/useContract";
import { useCallback, useEffect, useState } from "react";
import { Contract } from "ethers";
import useRunners from "./hooks/useRunners";
import { Interface } from "ethers";
import ABI from "./ABI/proposal.json";

const multicallAbi = [
    "function tryAggregate(bool requireSuccess, (address target, bytes callData)[] calls) returns ((bool success, bytes returnData)[] returnData)",
];

function App() {
    const readOnlyProposalContract = useContract();
    const { readOnlyProvider } = useRunners();
    const [proposals, setProposals] = useState([]);
    const [proposalId, setProposalId] = useState([]);

    const fetchProposals = useCallback(async () => {
        if (!readOnlyProposalContract) return;

        const multicallContract = new Contract(
            import.meta.env.VITE_MULTICALL_ADDRESS,
            multicallAbi,
            readOnlyProvider
        );

        const itf = new Interface(ABI);

        try {
            const proposalCount = Number(
                await readOnlyProposalContract.proposalCount()
            );

            console.log('count', proposalCount)

            const proposalsIds = Array.from(
                { length: proposalCount - 1 },
                (_, i) => i + 1
            );

            console.log('ids', proposalsIds)

            const calls = proposalsIds.map((id) => ({
                target: import.meta.env.VITE_CONTRACT_ADDRESS,
                callData: itf.encodeFunctionData("proposals", [id]),
            }));

            console.log('calls', calls)

            const responses = await multicallContract.tryAggregate.staticCall(
                true,
                calls
            );

            console.log('responses', responses)

            const decodedResults = responses.map((res) =>
                itf.decodeFunctionResult("proposals", res.returnData)
            );

            console.log('decoded', decodedResults)

            const data = decodedResults.map((proposalStruct) => ({
                description: proposalStruct.description,
                amount: proposalStruct.amount,
                minRequiredVote: proposalStruct.minVotesToPass,
                votecount: proposalStruct.voteCount,
                deadline: proposalStruct.votingDeadline,
                executed: proposalStruct.executed,
            }));

            console.log('data', data)

            setProposals(data);
        } catch (error) {
            console.log("error fetching proposals: ", error);
        }
    }, [readOnlyProposalContract, readOnlyProvider]);

    const onProposalCreated = (proposalId, desc, to, amt, votingDeadline, minVotesToPass) => {
        console.log("newwww", proposalId, desc, to, amt, votingDeadline, minVotesToPass)
        setProposals((prevProposal) => ([...prevProposal, {
            description: desc,
            amount: amt,
            minRequiredVote: minVotesToPass,
            voteCount: 0,
            deadline: votingDeadline,
            executed: false,
            recipient: to
        }]))
        setProposalId(proposalId);
        
    }

    useEffect(() => {
        fetchProposals();
        if (!readOnlyProposalContract) return
        readOnlyProposalContract.on("ProposalCreated", onProposalCreated)
    }, [fetchProposals]);

    return (
        <Layout>
            <Box className="flex justify-end p-4">
                <CreateProposalModal />
            </Box>
            <Proposals proposals={proposals} />
        </Layout>
    );
}

export default App;
