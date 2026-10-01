"use client";

import { useState } from "react";
import RazorpayCheckoutButton from "@/components/RazorpayCheckoutButton";

export default function CheckoutDemoPage() {
  const [amountRupees, setAmountRupees] = useState(100);
  const [paymentResult, setPaymentResult] = useState(null);

  const amountPaise = Math.round(Number(amountRupees || 1) * 100);

  return (
    <div className="min-h-screen bg-[#f7f5f0] px-6 py-16 text-[#141311]">
      <div className="mx-auto max-w-lg rounded-xs border border-black/10 bg-white p-8 shadow-sm">
        <header className="border-b border-black/10 pb-6 text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#b89558]">
            Standard Web Checkout
          </span>
          <h1 className="mt-2 font-serif text-3xl font-light">Razorpay Payment Test</h1>
          <p className="mt-2 text-xs text-black/60">
            Test Razorpay order creation, payment modal, and server signature verification.
          </p>
        </header>

        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-[11px] font-medium uppercase tracking-[0.16em] text-black/60">
              Amount (₹ INR)
            </label>
            <input
              type="number"
              min="1"
              value={amountRupees}
              onChange={(e) => setAmountRupees(e.target.value)}
              className="mt-1.5 w-full rounded-xs border border-black/15 bg-[#faf9f6] px-3.5 py-2.5 text-sm outline-none focus:border-[#b89558]"
              placeholder="100"
            />
            <p className="mt-1 text-[11px] text-black/40">
              = {amountPaise} paise (Minimum required: 100 paise / ₹1)
            </p>
          </div>

          <div className="pt-2">
            <RazorpayCheckoutButton
              amount={amountPaise}
              currency="INR"
              name="Siyana Atelier"
              description="Demo Payment Verification"
              prefill={{
                name: "Test Customer",
                email: "customer@example.com",
                contact: "9999999999",
              }}
              buttonText={`Pay ₹${amountRupees || 0} via Razorpay`}
              onSuccess={(data) => setPaymentResult({ status: "success", data })}
              onFailure={(err) => setPaymentResult({ status: "error", message: err.message })}
            />
          </div>

          {paymentResult && (
            <div className="mt-4 rounded-xs border border-black/10 bg-[#faf9f6] p-4 text-xs">
              <span className="font-semibold uppercase tracking-wider text-black/70">
                Last Result:
              </span>
              <pre className="mt-2 overflow-x-auto font-mono text-[11px] text-black/80">
                {JSON.stringify(paymentResult, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
