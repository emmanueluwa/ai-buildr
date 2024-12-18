"use client";

import { Button } from "@/components/ui/button";
import { PlusSquare } from "lucide-react";
import Link from "next/link";

export default function CreateMealplanButton({}) {
  if (true) {
    return (
      <Button asChild className="mx-auto flex w-fit gap-2">
        <Link href="/editor">
          <PlusSquare className="size-5" />
          New Meal Plan
        </Link>
      </Button>
    );
  }
}
