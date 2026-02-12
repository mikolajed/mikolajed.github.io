import { createConfig, http } from "wagmi";
import { foundry, sepolia } from "wagmi/chains";
import { injected } from "wagmi/connectors";
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

export const config = DEBUG ? debugConfig : prodConfig;
