import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { ConnectWallet } from "@/components/connect-wallet";

// A shallow page component keeps App clean and lets us compose future routes easily
const Home = () => {
  return (
    <div className="w-full min-h-screen container mx-auto px-4 py-4">
      <Header githubLink="https://github.com/germanllop/legacy-fe-candidate-assignment" />
      <Hero />
      <ConnectWallet />
    </div>
  );
};

export { Home };
