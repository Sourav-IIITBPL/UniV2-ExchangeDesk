import { Link } from "react-router-dom";
import WalletButton from "./WalletButton";

export default function Navbar() {
  return (
    <nav className="border-b border-border bg-card">
      <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
        <div className="flex gap-6 text-sm">
          <Link to="/">Home</Link>
          <Link to="/swap">Swap</Link>
          <Link to="/liquidity">Liquidity</Link>
          <Link to="/portfolio">Portfolio</Link>
          <Link to="/create">Create Pool</Link>
        </div>
        <WalletButton />
      </div>
    </nav>
  );
}
