import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from "wagmi";
import { foundry, sepolia } from "wagmi/chains";
import { CHAIN_ID } from "@/lib/guestbook-abi";
import { DEBUG } from "@/lib/constants";

export function useWallet() {
  const { address, isConnected, isConnecting, isReconnecting } = useAccount();
  const { connect, connectors, isPending: isConnectPending } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain, isPending: isSwitchingChain } = useSwitchChain();

  const isCorrectChain = chainId === CHAIN_ID;
  const supportedChains = DEBUG ? [foundry, sepolia] : [sepolia];

  return {
    address,
    isConnected,
    isConnecting: isConnecting || isReconnecting || isConnectPending,
    connect,
    connectors,
    disconnect,
    chainId,
    targetChainId: CHAIN_ID,
    isCorrectChain,
    switchChain,
    isSwitchingChain,
    supportedChains,
  };
}
