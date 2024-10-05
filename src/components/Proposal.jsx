import { Box, Button, Flex, Text } from "@radix-ui/themes";
import { formatEther } from "ethers";
import useVote from "../hooks/useVote";
import useExecute from "../hooks/useExecute";
import { useContext, useState } from "react";

const Proposal = ({
    description,
    amount,
    minRequiredVote,
    voteCount,
    deadline,
    executed,
    id,
    canExecute
}) => {
    const {vote:handleVote, voteLoading} = useVote();
    const {execute:handleExecute, canExecuteLoading} = useExecute();

    return (
        <Box className="bg-blue-400 rounded-md shadow-sm p-4 w-96">
            <Text className="text-2xl mb-4">Proposals</Text>
            <Box className="w-full">
                <Flex className="flex gap-4">
                    <Text>Description:</Text>
                    <Text className="font-bold">{description}</Text>
                </Flex>
                <Flex className="flex gap-4">
                    <Text>Amount:</Text>
                    <Text className="font-bold">{formatEther(amount)} ETH</Text>
                </Flex>
                <Flex className="flex gap-4">
                    <Text>Required Vote:</Text>
                    <Text className="font-bold">{Number(minRequiredVote)}</Text>
                </Flex>
                <Flex className="flex gap-4">
                    <Text>Vote Count:</Text>
                    <Text className="font-bold">{Number(voteCount)}</Text>
                </Flex>
                <Flex className="flex gap-4">
                    <Text>Deadline:</Text>
                    <Text className="font-bold">
                        {new Date(Number(deadline) * 1000).toLocaleDateString()}
                    </Text>
                </Flex>
                <Flex className="flex gap-4">
                    <Text>Executed:</Text>
                    <Text className="font-bold">{String(executed)}</Text>
                </Flex>
            </Box>
            {canExecute && !executed ? 
            <Button className="bg-green-500 text-white font-bold w-full mt-4 p-4 rounded-md shadow-sm" onClick={() => {handleExecute(id)}}>
            {canExecuteLoading ? 'Loading...' : 'Execute Proposal'}
            </Button>: executed ? null :
            <Button className="bg-slate-500 text-white font-bold w-full mt-4 p-4 rounded-md shadow-sm" onClick={() => {handleVote(id)}}>
            {voteLoading ? 'Loading...' : 'Vote'}
            </Button>
            }
        </Box>
    );
};

export default Proposal;
