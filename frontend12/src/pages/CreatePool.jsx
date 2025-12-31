import { useEffect, useState } from "react";
import { useChain } from "../hooks/useChain";
import PoolTable from "../components/PoolTable";
import { fetchUndeployedPools } from "../services/pool.service";

export default function CreatePool() {
  const { chainId } = useChain();
  const [pairs, setPairs] = useState([]);

  useEffect(() => {
    if (!chainId) return;
    fetchUndeployedPools({ chainId }).then(setPairs);
  }, [chainId]);

  return (
    <PoolTable
      pools={pairs}
      actionLabel="Create"
      onAction={(p) => console.log("Create pool", p)}
    />
  );
}
