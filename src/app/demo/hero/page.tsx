"use client";

import { Web3MediaHero } from "@/components/ui/web3media-hero";
import { Bitcoin, Coins, DollarSign, Hexagon } from "lucide-react";

export default function Web3MediaHeroDemo() {
  return (
    <Web3MediaHero
      logo="Web3 Media"
      navigation={[
        { label: "Home", onClick: () => console.log("Home") },
        { label: "Gallery", onClick: () => console.log("Gallery") },
        { label: "Cases", onClick: () => console.log("Cases") },
        { label: "About us", onClick: () => console.log("About us") },
      ]}
      contactButton={{
        label: "Contact",
        onClick: () => console.log("Contact clicked"),
      }}
      title="Shaping the Future of"
      highlightedText="Web3 Visibility"
      subtitle="We empower brands to stand out in the decentralized era with creative campaigns, growth strategies, and community-driven marketing."
      ctaButton={{
        label: "Discover more",
        onClick: () => console.log("Discover more clicked"),
      }}
      cryptoIcons={[
        {
          icon: <Bitcoin className="w-10 h-10 text-orange-400" />,
          label: "BTC",
          position: { x: "10%", y: "20%" },
        },
        {
          icon: <Hexagon className="w-10 h-10 text-orange-400" />,
          label: "ETH",
          position: { x: "15%", y: "60%" },
        },
        {
          icon: <DollarSign className="w-10 h-10 text-orange-400" />,
          label: "USDC",
          position: { x: "80%", y: "25%" },
        },
        {
          icon: <Coins className="w-10 h-10 text-orange-400" />,
          label: "SOL",
          position: { x: "75%", y: "65%" },
        },
      ]}
      trustedByText="Trusted by"
      brands={[
        {
          name: "Aspida",
          logo: (
            <svg width="80" height="24" viewBox="0 0 80 24" fill="none">
              <text x="0" y="18" fill="rgba(255,255,255,0.5)" fontSize="16" fontWeight="600">
                Aspida
              </text>
            </svg>
          ),
        },
        {
          name: "Viral",
          logo: (
            <svg width="60" height="24" viewBox="0 0 60 24" fill="none">
              <text x="0" y="18" fill="rgba(255,255,255,0.5)" fontSize="16" fontWeight="600">
                Viral
              </text>
            </svg>
          ),
        },
        {
          name: "Navaid",
          logo: (
            <svg width="70" height="24" viewBox="0 0 70 24" fill="none">
              <text x="0" y="18" fill="rgba(255,255,255,0.5)" fontSize="16" fontWeight="600">
                Navaid
              </text>
            </svg>
          ),
        },
        {
          name: "Trenly",
          logo: (
            <svg width="70" height="24" viewBox="0 0 70 24" fill="none">
              <text x="0" y="18" fill="rgba(255,255,255,0.5)" fontSize="16" fontWeight="600">
                Trenly
              </text>
            </svg>
          ),
        },
        {
          name: "Aspida",
          logo: (
            <svg width="80" height="24" viewBox="0 0 80 24" fill="none">
              <text x="0" y="18" fill="rgba(255,255,255,0.5)" fontSize="16" fontWeight="600">
                Aspida
              </text>
            </svg>
          ),
        },
        {
          name: "Viral",
          logo: (
            <svg width="60" height="24" viewBox="0 0 60 24" fill="none">
              <text x="0" y="18" fill="rgba(255,255,255,0.5)" fontSize="16" fontWeight="600">
                Viral
              </text>
            </svg>
          ),
        },
      ]}
    />
  );
}
