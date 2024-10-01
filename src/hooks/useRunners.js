import { useAppKitProvider } from "@reown/appkit/react";
import { BrowserProvider } from "ethers";
import { useEffect, useMemo, useState } from "react";
import { jsonRpcProvider } from "../constants/provider";

const useRunners = () => {
    const [signer, setSigner] = useState();
    const { walletProvider } = useAppKitProvider("eip155");

    const provider = useMemo(
        () => (walletProvider ? new BrowserProvider(walletProvider) : null),
        [walletProvider]
    );

    useEffect(() => {
        if (!provider) return;
        provider.getSigner().then((newSigner) => {
            if (newSigner === signer) return;
            setSigner(newSigner);
        });
    }, [provider]);
    return { provider, signer, readOnlyProvider: jsonRpcProvider };
};

export default useRunners;
