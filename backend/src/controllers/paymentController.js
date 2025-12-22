const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const Order = require("../models/mysql/Order");
const OrderItem = require("../models/mysql/OrderItem");
const Cart = require("../models/mysql/Cart");
const CartItem = require("../models/mysql/CartItem");
const Product = require("../models/mysql/Product");

exports.createCheckoutSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({ message: "Shipping address is required" });
    }

    const cart = await Cart.findOne({
      where: { userId },
      include: [{ model: CartItem, include: [Product] }],
    });

    if (!cart || cart.CartItems.length === 0)
      return res.status(400).json({ message: "Cart is empty" });

    // Total calculation
    let total = 0;
    cart.CartItems.forEach(ci => {
      total += ci.quantity * ci.Product.price;
    });

    const line_items = cart.CartItems.map(ci => ({
      price_data: {
        currency: "eur",
        unit_amount: Math.round(ci.Product.price * 100),
        product_data: { name: ci.Product.name },
      },
      quantity: ci.quantity,
    }));

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: `${process.env.FRONTEND_URL}/payment-success`,
      cancel_url: `${process.env.FRONTEND_URL}/cart`,
      metadata: { userId, address }, // <-- pass shipping address
    });

    // Create pending order
    const order = await Order.create({
      userId,
      total,
      status: "pending",
      paymentMethod: "stripe",
      shippingAddress: address,
      stripeSessionId: session.id,
    });

    // Save order items
    for (const ci of cart.CartItems) {
      await OrderItem.create({
        orderId: order.id,
        productId: ci.productId,
        quantity: ci.quantity,
        price: ci.Product.price,
      });
    }

    // Clear cart immediately
    await CartItem.destroy({ where: { cartId: cart.id } });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    res.status(500).json({ message: error.message });
  }
};


exports.handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Webhook signature failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata.userId;

    try {
      const order = await Order.findOne({
        where: {
          stripeSessionId: session.id,
          userId
        }
      });

      if (!order) {
        console.log("Order not found for session:", session.id);
        return res.status(200).send("OK");
      }

      await order.update({ status: "paid" });

      // Clear cart
      const cart = await Cart.findOne({ where: { userId } });
      if (cart) {
        await CartItem.destroy({ where: { cartId: cart.id } });
      }

      console.log(`✔ Order ${order.id} marked PAID`);
    } catch (err) {
      console.error("Error processing payment:", err);
    }
  }

  res.status(200).send("OK");
};
