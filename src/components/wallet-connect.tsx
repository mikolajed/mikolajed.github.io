"use client";

import { useState } from "react";
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from "wagmi";
import { Wallet } from "lucide-react";
import { ConnectModal } from "./connect-modal";
import { cn } from "@/lib/utils";

export function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain, isPending: isSwitchingChain } = useSwitchChain();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const displayAddress = address 
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : null;

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all group",
          "bg-background/50 hover:bg-background border border-border backdrop-blur-sm",
          isConnected && "bg-primary/10 border-primary/20 text-primary"
        )}
      >
        <Wallet className="w-4 h-4" />
        <span>{isConnected ? displayAddress : "Connect Wallet"}</span>
        {isConnected && (
            <div className="w-2 h-2 rounded-full bg-green-500 ml-1 shadow-sm shadow-green-500/20" />
        )}
      </button>

      <ConnectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        connectors={connectors}
        connect={connect}
        isConnected={isConnected}
        address={address}
        chainId={chainId}
        switchChain={switchChain}
        isSwitchingChain={isSwitchingChain}
        disconnect={disconnect}
      />
    </>
  );
}
