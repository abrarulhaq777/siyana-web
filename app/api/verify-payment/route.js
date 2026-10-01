import crypto from "node:crypto";

export async function POST(request) {
  try {
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_secret) {
      return Response.json(
        { success: false, error: "Razorpay secret key not configured on server" },
        { status: 500 }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return Response.json(
        { success: false, error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const order_id = body?.razorpay_order_id || body?.order_id;
    const payment_id = body?.razorpay_payment_id || body?.payment_id;
    const signature = body?.razorpay_signature || body?.signature;

    if (!order_id || !payment_id || !signature) {
      return Response.json(
        {
          success: false,
          error: "Missing required fields: order_id, payment_id, signature",
        },
        { status: 400 }
      );
    }

    // Algorithm: HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
    const expectedSignature = crypto
      .createHmac("sha256", key_secret)
      .update(`${order_id}|${payment_id}`)
      .digest("hex");

    const expectedBuffer = Buffer.from(expectedSignature);
    const signatureBuffer = Buffer.from(signature);

    const isMatch =
      expectedBuffer.length === signatureBuffer.length &&
      crypto.timingSafeEqual(expectedBuffer, signatureBuffer);

    if (!isMatch) {
      return Response.json(
        { success: false, error: "Signature verification failed" },
        { status: 400 }
      );
    }

    return Response.json({
      success: true,
      message: "Payment verified successfully",
      order_id,
      payment_id,
    });
  } catch (error) {
    console.error("Razorpay verify-payment error:", error);
    return Response.json(
      { success: false, error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
