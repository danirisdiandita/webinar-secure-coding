import Image from "next/image";
import { VerticalSlidingText } from "./vertical-sliding-text";
import Link from "next/link";
import SocialProof from "./socialproof";

export default async function Hero() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-12 text-center overflow-hidden">
      {/* Main heading */}
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 dark:bg-clip-text dark:text-transparent dark:bg-gradient-to-r dark:from-slate-300 dark:to-slate-500">
        Secure Coding for Cyber Resilience
      </h1>
      {/* Subheading */}
      <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
        Membangun Kode yang Aman dan Tangguh dari Ancaman Siber
      </p>

      {/* CTA Button */}
      <Link
        href="/sign-up"
        className="bg-[#f3e5f5] hover:bg-[#e1bee7] text-black text-lg px-8 py-3 font-semibold rounded-full mb-12 dark:border-none border-2 border-black hover:shadow-[3px_3px_0px_#000] dark:hover:shadow-[3px_3px_0px_#fff]"
      >
        Sign Up for this app
      </Link>
    </section>
  );
}
