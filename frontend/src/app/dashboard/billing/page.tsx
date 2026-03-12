"use client";
import { billingService } from "@/lib/api";
import { useUser } from "@/hooks/useUser";
import { Button } from "@/components/ui/button";

export default function BillingPage() {
  const { user, isLoading } = useUser();

  const handleUpgrade = async () => {
    try {
      const url = await billingService.createCheckoutSession();
      window.location.href = url;
    } catch (error) {
      console.error("Failed to initiate checkout", error);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-8">
      {user?.subscription_status === 'active' ? (
        <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
          <p className="text-green-700 font-medium">You are currently on the Pro plan! 🎉</p>
        </div>
      ) : (
        <Button onClick={handleUpgrade}>Upgrade to Pro</Button>
      )}
    </div>
  );
}