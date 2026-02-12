"use client";

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { VISITOR_PASS_ABI, VISITOR_PASS_ADDRESS } from "@/lib/guestbook-abi";

export function useVisitorPass(address?: `0x${string}`, targetChainId?: number, currentChainId?: number) {
  const { data: mintHash, writeContract: writeMint, isPending: isMinting, error: mintError } = useWriteContract();
  const { isLoading: isMintConfirming, isSuccess: isMintConfirmed } = useWaitForTransactionReceipt({ hash: mintHash });

  const { data: hasMintedData, refetch: refetchHasMinted, isLoading: isCheckingMint } = useReadContract({
    abi: VISITOR_PASS_ABI,
    address: VISITOR_PASS_ADDRESS,
    functionName: "hasMinted",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const { data: tokenId } = useReadContract({
    abi: VISITOR_PASS_ABI,
    address: VISITOR_PASS_ADDRESS,
    functionName: "visitorTokenId",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const { data: tokenURI } = useReadContract({
    abi: VISITOR_PASS_ABI,
    address: VISITOR_PASS_ADDRESS,
    functionName: "tokenURI",
    args: tokenId !== undefined ? [tokenId] : undefined,
    query: { enabled: tokenId !== undefined },
  });

  // If both IDs are provided, check match. If target not provided, maybe loose check?
  // For now, if provided, strict check. If not, default to true or let UI handle it.
  // Actually, if targetChainId is provided, we MUST be on it to write.
  const isValidChain = targetChainId && currentChainId ? currentChainId === targetChainId : true;
  const isLoading = isMinting || isMintConfirming;

  const mint = () => {
    if (isValidChain) { // Only allow mint if on correct chain
        writeMint({
            abi: VISITOR_PASS_ABI,
            address: VISITOR_PASS_ADDRESS,
            functionName: "mint",
        });
    }
  };

  return {
    hasMinted: !!hasMintedData,
    mint,
    isLoading,
    isMinting,
    isMintConfirming,
    isMintConfirmed,
    refetchHasMinted,
    isValidChain,
    mintError,
    tokenId,
    tokenURI: tokenURI as string | undefined
  };
}
