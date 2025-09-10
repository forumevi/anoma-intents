import { useState, useEffect } from "react";
import Image from "next/image";

type IntentType = "swap" | "transfer" | "stake" | "provide_liquidity" | "mint_nft";
type ChainType = "Ethereum" | "BSC" | "Polygon";

const intentOptions: { value: IntentType; label: string; icon: string; color: string }[] = [
  { value: "swap", label: "Swap", icon: "🔄", color: "bg-blue-200" },
  { value: "transfer", label: "Transfer", icon: "📤", color: "bg-orange-200" },
  { value: "stake", label: "Stake", icon: "📈", color: "bg-green-200" },
  { value: "provide_liquidity", label: "Provide Liquidity", icon: "💧", color: "bg-purple-200" },
  { value: "mint_nft", label: "Mint NFT", icon: "🎨", color: "bg-pink-200" },
];

const chainOptions: ChainType[] = ["Ethereum", "BSC", "Polygon"];
const chainStepTimes: Record<ChainType, number[]> = {
  Ethereum: [1000, 3000, 5000],
  BSC: [1000, 2000, 4000],
  Polygon: [1000, 2000, 3000],
};
const chainThemes: Record<ChainType, string> = {
  Ethereum: "bg-blue-50",
  BSC: "bg-yellow-50",
  Polygon: "bg-purple-50",
};

export default function IntentComposer() {
  const [intentType, setIntentType] = useState<IntentType>("swap");
  const [chain, setChain] = useState<ChainType>("Ethereum");
  const [param, setParam] = useState("");
  const [plan, setPlan] = useState<string[]>([]);
  const [displayedPlan, setDisplayedPlan] = useState<
    { step: string; status: "pending" | "done" | "zk" }[]
  >([]);

  const getIntentData = () => intentOptions.find((i) => i.value === intentType)!;

  const generatePlan = (): string[] => {
    const token = param || "TOKEN";
    const prefix = `[${chain}]`;
    switch (intentType) {
      case "swap":
        return [`${prefix} Initiate swap for ${token}`, `${prefix} Approve ${token} (🔒 ZK)`, `${prefix} Execu]()
