import { Flex, Text } from "@radix-ui/themes";
import Proposal from "./Proposal";
import {useContext} from 'react';
import { GlobalStateContext } from "../context/GlobalContext";

const Proposals = ({ proposals }) => {
    const {voteLoading} = useContext(GlobalStateContext)

    return (
        <Flex className="w-full flex gap-8 flex-wrap justify-around">
            {proposals.length === 0 ? (
                <Text>No data to display</Text>
            ) : (
                proposals.map(
                    ({
                        id,
                        deadline,
                        minRequiredVote,
                        amount,
                        description,
                        executed,
                        voteCount,
                        canExecute
                    }, index) => (
                        <Proposal
                            key={`${deadline}${minRequiredVote}`}
                            amount={amount}
                            deadline={deadline}
                            description={description}
                            executed={executed}
                            minRequiredVote={minRequiredVote}
                            voteCount={voteCount}
                            id={id}
                            canExecute={canExecute}
                        />
                    )
                )
            )}
        </Flex>
    );
};

export default Proposals;
