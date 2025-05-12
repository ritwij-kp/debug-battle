import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white">
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center min-h-screen">
        {/* Hero Section */}
        <div className="text-center space-y-8 max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-500 animate-gradient leading-normal md:leading-normal py-2">
            Ready? Set... Debug!
          </h1>
          <p className="text-xl md:text-2xl text-zinc-300 max-w-2xl mx-auto">
            Battle head-to-head in real-time debugging challenges. 
            Fix the bug first, claim the victory!
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <Link href="/debug">
              <Button 
                className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-8 py-6 text-lg rounded-full transition-all duration-200 transform hover:scale-105"
              >
                Play Now
              </Button>
            </Link>
            <Button 
              variant="outline"
              className="border-2 border-yellow-500 text-yellow-400 hover:text-yellow-300 hover:border-yellow-400 hover:bg-yellow-500/5 px-8 py-6 text-lg rounded-full transition-all duration-200 transform hover:scale-105"
            >
              Sign Up
            </Button>
          </div>

          {/* Feature Tags */}
          <div className="flex flex-wrap justify-center gap-4 mt-12">
            <span className="px-4 py-2 bg-zinc-800/50 rounded-full text-sm text-yellow-400/90">
              🎯 Real Codeforces Problems
            </span>
            <span className="px-4 py-2 bg-zinc-800/50 rounded-full text-sm text-yellow-400/90">
              ⚡ Real-time PvP
            </span>
            <span className="px-4 py-2 bg-zinc-800/50 rounded-full text-sm text-yellow-400/90">
              🏆 Competitive Debugging
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
