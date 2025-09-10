import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="container mx-auto p-6">
      <header className="flex items-center justify-between mb-8">
        <Image src="/logo.png" alt="Anoma Logo" width={100} height={48} />
        <h1 className="text-3xl font-bold">Anoma Multi-Chain Demo</h1>
      </header>

      <main className="space-y-4">
        <p>
          Welcome to the Anoma Intent Composer demo! This prototype showcases privacy-focused cross-chain operations, token swaps, liquidity provision, staking, NFT minting, and inter-chain transfers. All actions are simulated with zero-knowledge logic for enhanced privacy visualization.
        </p>

        <Link href="/intent-composer">
          <a className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Go to Intent Composer
          </a>
        </Link>
      </main>
    </div>
  );
}
