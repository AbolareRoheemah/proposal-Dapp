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
                        deadline,
                        minRequiredVote,
                        amount,
                        description,
                        executed,
                        votecount,
                    }, index) => (
                        <Proposal
                            key={`${deadline}${minRequiredVote}`}
                            amount={amount}
                            deadline={deadline}
                            description={description}
                            executed={executed}
                            minRequiredVote={minRequiredVote}
                            votecount={votecount}
                            id={index + 1}
                            loadingState={voteLoading}
                        />
                    )
                )
            )}
        </Flex>
    );
};

export default Proposals;
