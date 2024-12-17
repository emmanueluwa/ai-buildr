import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <main className="mx-auto max-w-7xl space-y-6 px-3 py-6 text-center">
      <h1 className="text-3xl font-bold">Billing Success</h1>
      <p>
        The checkout was successful, your pro account has been activated. Enjoy
        😼
      </p>
      <Button asChild>
        <Link href="/mealplans">Go to Meal Plans</Link>
      </Button>
    </main>
  );
}