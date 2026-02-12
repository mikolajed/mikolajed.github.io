"use client";

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { GUESTBOOK_ABI, GUESTBOOK_ADDRESS, PAGINATED_ABI, PAGINATED_ADDRESS } from "@/lib/guestbook-abi";

export function useGuestbook(address?: `0x${string}`, page: number = 1, pageSize: number = 10) {
  // Write Contract (Sign)
  const { data: hash, writeContract: writeSign, isPending: isSigning, error: signError } = useWriteContract();
  const { isLoading: isSignConfirming, isSuccess: isSignConfirmed } = useWaitForTransactionReceipt({ hash });

  // Read Total Count
  const { data: totalCount, refetch: refetchCount } = useReadContract({
    abi: PAGINATED_ABI,
    address: PAGINATED_ADDRESS,
    functionName: "getEntriesCount",
  });

  // Calculate pagination
  const total = Number(totalCount || 0);
  const totalPages = Math.ceil(total / pageSize);
  const offset = BigInt((page - 1) * pageSize);
  const limit = BigInt(pageSize);

  // Read Signatures
  const { data: signatures, refetch: refetchSignatures, isLoading: isLoadingSignatures } = useReadContract({
    abi: PAGINATED_ABI,
    address: PAGINATED_ADDRESS,
    functionName: "getEntries",
    args: [offset, limit],
  });

  const sign = (message: string, isEncrypted: boolean) => {
    // Note: The contract only takes a string. Encryption happens off-chain (or before calling this).
    // If isEncrypted is true, the 'message' argument should already be the encrypted string.
    writeSign({
        abi: GUESTBOOK_ABI,
        address: GUESTBOOK_ADDRESS,
        functionName: "sign",
        args: [message],
    });
  };

  // Read Owner Public Key
  const isCorrectChain = true; // Optimization: assume checked by caller or hook
  const { data: ownerPublicKey, refetch: refetchPublicKey } = useReadContract({
    abi: GUESTBOOK_ABI,
    address: GUESTBOOK_ADDRESS,
    functionName: "ownerPublicKey",
    // We can assume we only need this if we are going to encrypt or are deployer
  });

  // Set Public Key (Deployer only)
  const { writeContract: writeSetKey, isPending: isSettingKey, isSuccess: isSetKeySuccess } = useWriteContract();
  
  const setPublicKey = (key: `0x${string}`) => {
    writeSetKey({
        abi: GUESTBOOK_ABI,
        address: GUESTBOOK_ADDRESS,
        functionName: "setPublicKey",
        args: [key],
    });
  };

  return {
    // Write
    sign,
    isSigning,
    isSignConfirming,
    isSignConfirmed,
    signError,
    hash,

    // Read
    signatures: signatures ? [...signatures].reverse() : [], // Reverse to show newest first if needed, or handle in UI
    totalCount: total,
    totalPages,
    isLoadingSignatures,
    refetchCount,
    refetchSignatures,
    ownerPublicKey: ownerPublicKey as string | undefined, // It returns bytes, which is string in wagmi/viem usually
    setPublicKey,
    isSettingKey,
    isSetKeySuccess,
    refetchPublicKey
  };
}
