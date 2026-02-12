"use client";

import { useSignMessage } from "wagmi";

export function useSign() {
  const { signMessageAsync, isPending: isSigning, error: signError } = useSignMessage();

  return {
    signMessageAsync,
    isSigning,
    signError,
  };
}
