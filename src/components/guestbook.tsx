"use client";

import { useState, useEffect, useMemo } from "react";
import { useAccount, useConnect, useDisconnect, useReadContract, useWriteContract, useWaitForTransactionReceipt, useChainId, useSwitchChain } from "wagmi";
import { GUESTBOOK_ABI, GUESTBOOK_ADDRESS, VISITOR_PASS_ABI, VISITOR_PASS_ADDRESS, CHAIN_ID } from "@/lib/guestbook-abi";
import { GuestbookPanel } from "./guestbook/guestbook-panel";
import { SignatureList } from "./guestbook/signature-list";

import { DEBUG } from "@/lib/constants";

const PAGE_SIZE = 50;

// ABI fragment for paginated getEntries(offset, limit)
const PAGINATED_ABI = [
  {
    type: "function",
    name: "getEntries",
    inputs: [
      { name: "_offset", type: "uint256", internalType: "uint256" },
      { name: "_limit", type: "uint256", internalType: "uint256" },
    ],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        internalType: "struct Guestbook.Entry[]",
        components: [
          { name: "signer", type: "address", internalType: "address" },
          { name: "message", type: "string", internalType: "string" },
          { name: "timestamp", type: "uint256", internalType: "uint256" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getEntriesCount",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
] as const;

export function GuestbookJourney() {
  const { address, isConnected } = useAccount();
  const currentChainId = useChainId();
  const { switchChain, isPending: isSwitchingChain } = useSwitchChain();

  const { disconnect } = useDisconnect();

  const { data: hash, writeContract, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  // Visitor Pass
  const { data: mintHash, writeContract: writeMint, isPending: isMinting } = useWriteContract();
  const { isLoading: isMintConfirming, isSuccess: isMintConfirmed } = useWaitForTransactionReceipt({ hash: mintHash });

  const { data: hasMinted, refetch: refetchHasMinted } = useReadContract({
    abi: VISITOR_PASS_ABI,
    address: VISITOR_PASS_ADDRESS,
    functionName: "hasMinted",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  // Step 1: Get total count
  const { data: totalCount, refetch: refetchCount } = useReadContract({
    abi: PAGINATED_ABI,
    address: GUESTBOOK_ADDRESS,
    functionName: "getEntriesCount",
    chainId: CHAIN_ID,
  });

  // Step 2: Calculate how many pages we need
  const total = totalCount ? Number(totalCount) : 0;
  const pageCount = Math.ceil(total / PAGE_SIZE);

  // Step 3: Fetch the latest page (last PAGE_SIZE entries)
  // For simplicity, we fetch offset 0 with limit = total (capped at a safe max)
  // This keeps behavior identical to before for small datasets
  const safeLimit = Math.min(total, 500); // cap at 500 entries max
  const safeOffset = total > safeLimit ? total - safeLimit : 0;

  const { data: entries, refetch: refetchEntries } = useReadContract({
    abi: PAGINATED_ABI,
    address: GUESTBOOK_ADDRESS,
    functionName: "getEntries",
    args: [BigInt(safeOffset), BigInt(safeLimit)],
    chainId: CHAIN_ID,
    query: { enabled: total > 0 },
  });

  const refetch = () => {
    refetchCount();
    refetchEntries();
  };

  const [mounted, setMounted] = useState(false);


  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (isConfirmed) {
      refetch();
    }
  }, [isConfirmed]);

  useEffect(() => {
    if (isMintConfirmed) {
      refetchHasMinted();
    }
  }, [isMintConfirmed, refetchHasMinted]);

  if (!mounted) return null;

  const handleMint = () => {
    if (currentChainId !== CHAIN_ID) {
      alert(`Please switch to ${DEBUG ? "Foundry (Localhost)" : "Sepolia"}`);
      return;
    }
    writeMint({
      abi: VISITOR_PASS_ABI,
      address: VISITOR_PASS_ADDRESS,
      functionName: "mint",
    });
  };

  return (
    <div className="flex-1 w-full grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-0 px-0 lg:px-12">
      {/* ─── LEFT: Interaction Panel ─── */}
      <GuestbookPanel 
        isConnected={isConnected}
        address={address}
        hasMinted={!!hasMinted}
        isMinting={isMinting}
        isMintConfirming={isMintConfirming}
        handleMint={handleMint}
        writeContract={writeContract}

        isPending={isPending}
        isConfirming={isConfirming}
      />

      {/* ─── RIGHT: Signatures Panel ─── */}
      <SignatureList entries={entries as any[] || []} address={address} />


    </div>
  );
}
