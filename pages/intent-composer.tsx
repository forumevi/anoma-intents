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
  const [displayedPlan, setDisplayedPlan] = useState<{ step: string; status: "pending" | "done" | "zk" }[]>([]);

  const getIntentData = () => intentOptions.find((i) => i.value === intentType)!;

  const generatePlan = (): string[] => {
    const token = param || "TOKEN";
    const prefix = `[${chain}]`;
    let steps: string[] = [];

    switch (intentType) {
      case "swap":
        steps = [`${prefix} Initiate swap for ${token}`, `${prefix} Approve ${token} (🔒 ZK)`, `${prefix} Execute swap`];
        break;
      case "transfer":
        steps = [
          `${prefix} Verify recipient address (🔒 ZK)`,
          `${prefix} Transfer ${token}`,
          `${prefix} Confirm transaction (🔒 ZK)`,
        ];
        break;
      case "stake":
        steps = [`${prefix} Check staking pool`, `${prefix} Stake ${token} (🔒 ZK)`, `${prefix} Wait for confirmation`];
        break;
      case "provide_liquidity":
        steps = [
          `${prefix} Check pool liquidity`,
          `${prefix} Deposit ${token} (🔒 ZK)`,
          `${prefix} Receive LP tokens`,
        ];
        break;
      case "mint_nft":
        steps = [
          `${prefix} Verify NFT contract (🔒 ZK)`,
          `${prefix} Mint ${token} NFTs`,
          `${prefix} Confirm mint`,
        ];
        break;
      default:
        steps = [];
    }

    return steps; // <-- Mutlaka return
  };

  const handlePlan = () => {
    setPlan(generatePlan());
    setDisplayedPlan([]);
  };

  useEffect(() => {
    if (plan.length === 0) return;
    setDisplayedPlan([]);
    let i = 0;
    const stepTimes = chainStepTimes[chain];

    const runSteps = () => {
      if (i >= plan.length) return;
      const isZK = plan[i].includes("(🔒 ZK)");
      setDisplayedPlan((prev) => [...prev, { step: plan[i], status: isZK ? "zk" : "pending" }]);
      setTimeout(() => {
        setDisplayedPlan((prev) =>
          prev.map((s, idx) => (idx === i ? { ...s, status: isZK ? "zk" : "done" } : s))
        );
        i++;
        runSteps();
      }, stepTimes[i]);
    };
    runSteps();
  }, [plan, chain]);

  const intentData = getIntentData();

  return (
    <div className={`composer-container max-w-xl mx-auto p-6 rounded-xl shadow-lg mt-10 ${chainThemes[chain]}`}>
      <div className="flex justify-center mb-6">
        <Image src="/anoma-logo.png" alt="Anoma Logo" width={64} height={64} className="mr-2" />
        <h1 className="text-3xl font-bold text-center text-gray-800">Anoma Intent Composer</h1>
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Select Blockchain:</label>
        <select value={chain} onChange={(e) => setChain(e.target.value as ChainType)} className="w-full p-2 border rounded">
          {chainOptions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Select Intent Type:</label>
        <select
          value={intentType}
          onChange={(e) => setIntentType(e.target.value as IntentType)}
          className="w-full p-2 border rounded"
        >
          {intentOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Parameter:</label>
        <input
          type="text"
          value={param}
          onChange={(e) => setParam(e.target.value)}
          placeholder="Enter number of tokens or NFTs"
          className="w-full p-2 border rounded"
        />
      </div>

      <button
        disabled={!param || isNaN(Number(param))}
        onClick={handlePlan}
        className={`w-full py-2 rounded font-semibold text-white ${
          !param || isNaN(Number(param)) ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        Plan Intent
      </button>

      {displayedPlan.length > 0 && (
        <div className="plan-box mt-6 bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2 flex items-center">
            Execution Plan <span className="ml-2 text-yellow-500 font-bold">💰</span>
          </h2>
          {displayedPlan.map((item, idx) => (
            <div
              key={idx}
              className={`plan-step p-2 mb-2 rounded shadow-sm flex items-center animate-fade-in-up ${intentData.color}`}
              style={{ animationDelay: `${idx * 0.5}s` }}
            >
              <span className="mr-2">{intentData.icon}</span>
              <span className="flex-1">{item.status === "zk" ? "*** (ZK Verified)" : item.step}</span>
              {item.status === "pending" && <span className="ml-2 animate-spin">⏳</span>}
              {item.status === "done" && <span className="ml-2 text-green-600 font-bold">✅</span>}
              {item.status === "zk" && <span className="ml-2 text-purple-600 font-bold">🔒</span>}
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .animate-fade-in-up {
          opacity: 0;
          transform: translateY(10px);
          animation: fadeInUp 0.5s forwards;
        }
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
