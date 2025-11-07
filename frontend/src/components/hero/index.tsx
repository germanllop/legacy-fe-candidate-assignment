const Hero = () => {
  return (
    <section className="relative min-h-[10vh] overflow-hidden bg-white bg-[url('https://cdn.prod.website-files.com/629721c1ce814027a946a7af/67ffa2b23cd980f6faa0c7a9_Box%20Frame%20Double.png')] bg-repeat bg-[length:100px_100px]">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(120%_120%_at_50%_40%,rgba(255,255,255,0)_0%,rgba(255,255,255,0.85)_60%,rgba(255,255,255,1)_85%)]" />

      <div className="absolute inset-0 pointer-events-none bg-linear-to-b from-white/60 via-transparent to-white/70" />

      <div className="relative z-10 flex flex-col items-center text-center px-6 py-24">
    
        <h1 className="mt-4 text-5xl sm:text-5xl font-semibold text-gray-900 leading-tight">
          Take-Home Task
        </h1>

        <h2 className="mt-1 text-5xl sm:text-5xl font-semibold text-blue-600 leading-tight">
          Web3 Message Signer & Verifier
        </h2>

      </div>
    </section>
  );
};

export { Hero };
