import { useWallet } from "../context/WalletContext";


export default function WalletButton() {
  const { account, connect } = useWallet();

  if (!account) {
    return (
      <button
        onClick={connect}
        className="px-4 py-2 bg-primary rounded"
      >
        Connect Wallet
      </button>
    );
  }

  return (
    <div className="px-3 py-2 bg-border rounded text-sm">
      {account.slice(0, 6)}…{account.slice(-4)}
    </div>
  );
}
