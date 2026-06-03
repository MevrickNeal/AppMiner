export default function Features() {
  return (
    <section className="bg-white py-32 text-black">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          
          <div className="relative group">
            <p className="text-5xl md:text-7xl font-black text-black group-hover:text-gray-600 transition-colors tracking-tighter">99.9%</p>
            <div className="h-1 w-8 bg-black my-6 transition-all group-hover:w-full"></div>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">Uptime Rate</p>
          </div>

          <div className="relative group">
            <p className="text-5xl md:text-7xl font-black text-black group-hover:text-gray-600 transition-colors tracking-tighter">24/7</p>
            <div className="h-1 w-8 bg-black my-6 transition-all group-hover:w-full"></div>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">Expert Support</p>
          </div>

          <div className="relative group">
            <p className="text-5xl md:text-7xl font-black text-black group-hover:text-gray-600 transition-colors tracking-tighter">0%</p>
            <div className="h-1 w-8 bg-black my-6 transition-all group-hover:w-full"></div>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">Pool Fees</p>
          </div>

          <div className="relative group">
            <p className="text-5xl md:text-7xl font-black text-black group-hover:text-gray-600 transition-colors tracking-tighter">SAFE</p>
            <div className="h-1 w-8 bg-black my-6 transition-all group-hover:w-full"></div>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">Node Protocol</p>
          </div>

        </div>
      </div>
    </section>
  );
}
