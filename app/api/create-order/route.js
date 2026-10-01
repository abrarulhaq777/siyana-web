import Razorpay from "razorpay";

export async function POST(request) {
  try {
    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      return Response.json(
        { error: "Razorpay credentials not configured on server" },
        { status: 401 }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return Response.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const { amount, currency = "INR", receipt, notes } = body || {};

    const numericAmount = Number(amount);
    if (!amount || isNaN(numericAmount) || numericAmount < 100) {
      return Response.json(
        { error: "Amount must be at least 100 paise" },
        { status: 400 }
      );
    }

    const razorpay = new Razorpay({ key_id, key_secret });

    const options = {
      amount: Math.round(numericAmount),
      currency: currency || "INR",
      receipt: receipt || `rcpt_${Date.now()}`,
      notes: notes || {},
    };

    const order = await razorpay.orders.create(options);

    return Response.json({
      order_id: order.id,
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      key_id: key_id,
    });
  } catch (error) {
    console.error("Razorpay create-order error:", error);
    const statusCode =
      error?.statusCode === 401 ||
      (error?.error?.code === "BAD_REQUEST_ERROR" &&
        error?.error?.description?.toLowerCase().includes("authenticate"))
        ? 401
        : error?.statusCode || 500;

    return Response.json(
      {
        error:
          error?.error?.description ||
          error?.message ||
          "Failed to create Razorpay order",
      },
      { status: statusCode }
    );
  }
}
