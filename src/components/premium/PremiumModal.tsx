"use client";

import { Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import usePremiumModal from "@/hooks/usePremiumModal";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { createCheckoutSession } from "./actions";
import { env } from "@/env";

// const premiumFeatures = ["AI tools", "Up to 3 documents"];
const premiumPlusFeatures = [
  "AI meal suggestions",
  "Infinite meal plans",
  "Custom Design",
];

export default function PremiumModal() {
  const { open, setOpen } = usePremiumModal();

  const { toast } = useToast();

  const [loading, setLoading] = useState(false);

  async function handlePremiumClick(priceId: string) {
    try {
      setLoading(true);

      const redirectUrl = await createCheckoutSession(priceId);
      window.location.href = redirectUrl;
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", description: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!loading) {
          setOpen(open);
        }
      }}
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-center">Buildr AI Premium</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-6">
          <p className="text-center">
            Get a premium subscription to unlock all features.
          </p>
          <div className="w-full max-w-md">
            <div className="flex flex-col items-center space-y-5">
              <h3 className="bg-gradient-to-r from-yellow-600 to-yellow-400 bg-clip-text text-center text-lg font-bold text-transparent">
                Premium
              </h3>
              <ul className="w-full list-inside space-y-2">
                {premiumPlusFeatures.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center justify-center gap-2"
                  >
                    <Check className="size-4 flex-shrink-0 text-yellow-500" />
                    <span className="text-center">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                variant="premium"
                onClick={() =>
                  handlePremiumClick(
                    env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_PLUS_MONTHLY || "",
                  )
                }
                disabled={loading}
                className="w-full"
              >
                Get Premium
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
