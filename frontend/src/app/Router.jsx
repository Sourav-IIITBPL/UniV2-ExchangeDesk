import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Swap from "../pages/Swap";
import Liquidity from "../pages/Liquidity";
import Portfolio from "../pages/Portfolio";
import CreatePool from "../pages/CreatePool";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/swap" element={<Swap />} />
      <Route path="/liquidity" element={<Liquidity />} />
      <Route path="/portfolio" element={<Portfolio />} />
      <Route path="/create" element={<CreatePool />} />
    </Routes>
  );
}
