import prisma from "@/lib/prisma";
import Image from "next/image";
import logo from "@/assets/meal-logo.jpg";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import planPreview from "@/assets/plan-preview.jpg";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gray-100 px-5 py-12 text-center text-gray-900 md:flex-row md:text-start lg:gap-12">
      <div className="max-w-prose space-y-3">
        <Image
          src={logo}
          alt="Logo"
          width={150}
          height={150}
          className="mx-auto md:ms-0"
        />
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Create a{" "}
          <span className="inline-block bg-gradient-to-r from-yellow-600 to-yellow-400 bg-clip-text text-transparent">
            Document
          </span>{" "}
          in Minutes
        </h1>
        <p className="text-lg text-gray-500">
          Our <span className="font-bold">AI Buildr</span> helps you design a
          scientifically backed... based on your needs.
        </p>
        <Button asChild size="lg" variant="premium">
          <Link href="/resumes">Get started</Link>
        </Button>
      </div>
      <div>
        <Image
          src={planPreview}
          alt="Plan preview"
          width={600}
          className="shadow-md lg:rotate-[1.5deg]"
        />
      </div>
    </main>
  );
}
