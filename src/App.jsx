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
  const contract = new Contract(
    import.meta.env.VITE_CONTRACT_ADDRESS,
    ABI,
    readOnlyProvider
  );
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

      const proposalsIds = Array.from(
        { length: proposalCount - 1 },
        (_, i) => i + 1
      );

      const calls = proposalsIds.map((id) => ({
        target: import.meta.env.VITE_CONTRACT_ADDRESS,
        callData: itf.encodeFunctionData("proposals", [id]),
      }));

      const responses = await multicallContract.tryAggregate.staticCall(
        true,
        calls
      );

      const decodedResults = responses.map((res) =>
        itf.decodeFunctionResult("proposals", res.returnData)
      );

      const data = decodedResults.map((proposalStruct, i) => {
        return {
            id: i + 1,
            description: proposalStruct.description,
            amount: proposalStruct.amount,
            minRequiredVote: proposalStruct.minVotesToPass,
            voteCount: proposalStruct.voteCount,
            deadline: proposalStruct.votingDeadline,
            executed: proposalStruct.executed,
            canExecute: (proposalStruct.voteCount >= proposalStruct.minVotesToPass && Number(proposalStruct.votingDeadline) * 1000 <= Date.now())
          }
      });
      setProposals(data);
    } catch (error) {
      console.log("error fetching proposals: ", error);
    }
  }, [readOnlyProposalContract, readOnlyProvider]);

  const onProposalCreated = (
    proposalId,
    desc,
    to,
    amt,
    votingDeadline,
    minVotesToPass
  ) => {
    setProposals((prevProposal) => [
      ...prevProposal,
      {
        id: proposalId,
        description: desc,
        amount: amt,
        minRequiredVote: minVotesToPass,
        voteCount: 0,
        deadline: votingDeadline,
        executed: false,
        recipient: to,
        canExecute: false
      },
    ]);
  };
  const onVoted = (proposalId, voter) => {
    console.log("vote event", voter, proposalId);
    setProposals((prevProposals) =>
      prevProposals.map((prev) => {
        
        if (prev.id === Number(proposalId)) {
          return { ...prev, voteCount: Number(prev.voteCount) + 1 };
        }
        return prev;
      })
    );
  };

  useEffect(() => {
    fetchProposals();
    if (!contract) return;
    contract.on("ProposalCreated", onProposalCreated);
    contract.on("Voted", onVoted);

    return () => {
      contract.removeListener("ProposalCreated");
      contract.removeListener("Voted");
    };
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
