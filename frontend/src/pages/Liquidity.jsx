import PoolTable from "../components/PoolTable";

export default function Liquidity() {
  const pools = []; // backend-fed

  return (
    <PoolTable
      pools={pools}
      actionLabel="Add"
      onAction={(p) => console.log("Add liquidity", p)}
    />
  );
}
