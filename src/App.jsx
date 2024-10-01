import { Box } from "@radix-ui/themes";
import Layout from "./components/Layout";
import CreateProposalModal from "./components/CreateProposalModal";
import {
    useAppKitAccount,
    useAppKitProvider,
    useWalletInfo,
} from "@reown/appkit/react";

function App() {
    const { walletProvider } = useAppKitProvider("eip155");
    const { walletInfo } = useWalletInfo();
    const { address, status, isConnected } = useAppKitAccount();
    console.log("walletInfo: ", walletInfo);
    console.log("walletInfo: ", address, status, isConnected);

    console.log("walletProvider: ", walletProvider, useAppKitProvider);

    return (
        <Layout>
            <Box className="flex justify-end p-4">
                <CreateProposalModal />
            </Box>
        </Layout>
    );
}

export default App;
