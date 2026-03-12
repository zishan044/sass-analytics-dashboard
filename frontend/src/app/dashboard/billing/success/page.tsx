import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

export default function SuccessPage() {
  const queryClient = useQueryClient();
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["user"] });
  }, []);
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
      <h1 className="text-3xl font-bold">Payment Successful!</h1>
      <p className="text-muted-foreground mt-2 mb-8">
        Your account has been upgraded to Pro. You now have full access.
      </p>
      <Button asChild>
        <Link href="/dashboard">Go to Dashboard</Link>
      </Button>
    </div>
  );
}
