"use client";

import { useState } from "react";
import Script from "next/script";

/**
 * Standard Razorpay Checkout Button Component
 *
 * @param {Object} props
 * @param {number} props.amount Amount in paise (minimum 100 paise = ₹1)
 * @param {string} [props.currency="INR"] Currency code
 * @param {string} [props.name="Siyana Atelier"] Merchant name shown in modal
 * @param {string} [props.description="Order Payment"] Order description
 * @param {string} [props.receipt] Receipt identifier
 * @param {Object} [props.prefill] Shopper prefill details: { name, email, contact }
 * @param {Function} [props.onSuccess] Callback when payment is verified: (data) => void
 * @param {Function} [props.onFailure] Callback when payment fails or cancelled: (error) => void
 * @param {string} [props.buttonText] Custom button label
 * @param {string} [props.className] Custom CSS classes for the button
 */
export default function RazorpayCheckoutButton({
  amount = 10000, // 10000 paise = ₹100
  currency = "INR",
  name = "Siyana Atelier",
  description = "Order Payment",
  receipt,
  prefill = {},
  onSuccess,
  onFailure,
  buttonText,
  className = "",
  disabled = false,
}) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const displayAmount = (amount / 100).toLocaleString("en-IN", {
    style: "currency",
    currency: currency,
  });

  async function handlePayment() {
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      // Ensure Razorpay SDK is loaded
      if (typeof window === "undefined" || !window.Razorpay) {
        throw new Error(
          "Razorpay SDK is not ready yet. Please check your internet connection."
        );
      }

      // STEP 1: BACKEND - Call /api/create-order
      const orderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round(amount),
          currency,
          receipt: receipt || `receipt_${Date.now()}`,
        }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok || !orderData.order_id) {
        throw new Error(orderData.error || "Failed to initiate payment order");
      }

      const keyId =
        process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || orderData.key_id;

      // STEP 2: FRONTEND - Open Razorpay Modal
      const options = {
        key: keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: name,
        description: description,
        order_id: orderData.order_id,
        prefill: {
          name: prefill.name || "",
          email: prefill.email || "",
          contact: prefill.contact || prefill.phone || "",
        },
        theme: {
          color: "#141311",
        },
        handler: async function (response) {
          // STEP 3: BACKEND - Verify Signature
          try {
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();

            if (!verifyRes.ok || !verifyData.success) {
              const err =
                verifyData.error || "Payment signature verification failed";
              setErrorMessage(err);
              onFailure?.(new Error(err));
              return;
            }

            setSuccessMessage(
              `Payment successful! Payment ID: ${response.razorpay_payment_id}`
            );
            onSuccess?.({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });
          } catch (verifyErr) {
            const msg =
              verifyErr.message || "Failed to reach verification service";
            setErrorMessage(msg);
            onFailure?.(verifyErr);
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            const cancelMsg = "Payment modal was closed by user.";
            setErrorMessage(cancelMsg);
            onFailure?.(new Error(cancelMsg));
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);

      // Handle payment failure event
      razorpayInstance.on("payment.failed", function (response) {
        setLoading(false);
        const failMsg =
          response.error?.description ||
          response.error?.reason ||
          "Payment transaction failed.";
        setErrorMessage(failMsg);
        onFailure?.(new Error(failMsg));
      });

      razorpayInstance.open();
    } catch (err) {
      setLoading(false);
      const msg = err.message || "An unexpected error occurred.";
      setErrorMessage(msg);
      onFailure?.(err);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
      />

      <button
        type="button"
        id="razorpay-checkout-button"
        onClick={handlePayment}
        disabled={loading || disabled}
        className={
          className ||
          "flex items-center justify-center gap-2 rounded-xs bg-[#141311] px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#f7f5f0] transition hover:bg-[#b89558] disabled:cursor-not-allowed disabled:opacity-50"
        }
      >
        {loading ? (
          <>
            <svg
              className="h-4 w-4 animate-spin text-current"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
            <span>Connecting Razorpay…</span>
          </>
        ) : (
          buttonText || `Pay with Razorpay (${displayAmount})`
        )}
      </button>

      {errorMessage && (
        <div
          role="alert"
          className="rounded-xs border border-red-300 bg-red-50 p-2.5 text-xs text-red-700"
        >
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div
          role="status"
          className="rounded-xs border border-emerald-300 bg-emerald-50 p-2.5 text-xs text-emerald-800"
        >
          {successMessage}
        </div>
      )}
    </div>
  );
}
