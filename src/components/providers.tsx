"use client";

import { WagmiProvider, createConfig, http } from "wagmi";
import { sepolia, foundry } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { injected } from "wagmi/connectors";
import { ThemeProvider } from "./theme-provider";
import { DEBUG } from "@/lib/constants";

const debugConfig = createConfig({
  chains: [foundry, sepolia],
  connectors: [injected()],
  transports: {
    [foundry.id]: http(),
    [sepolia.id]: http(),
  },
});

const prodConfig = createConfig({
  chains: [sepolia],
  connectors: [injected()],
  transports: {
    [sepolia.id]: http(),
  },
});

const config = DEBUG ? debugConfig : prodConfig;
const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
