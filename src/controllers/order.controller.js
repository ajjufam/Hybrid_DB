const Product = require("../models/product.mongo");
const Tax = require("../models/tax.mongo");
const pg = require("../config/db.config");
const { v4: uuidv4 } = require("uuid");

const placeOrder = async (req, res) => {
  try {
    const { products } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).send("❌ 'products' must be a non-empty array");
    }

    const orderId = uuidv4(); // 🔥 Generate unique order ID

    let totalInvoiceAmount = 0;
    const orderItems = [];

    for (const item of products) {
      const { productName, quantity } = item;

      // Fetch product from MongoDB
      const product = await Product.findOne({ name: productName });
      if (!product) {
        return res.status(404).send(`❌ Product '${productName}' not found`);
      }

      // Fetch tax details
      const taxDetails = await Tax.findOne({ productName });
      if (!taxDetails) {
        return res
          .status(404)
          .send(`❌ Tax details for '${productName}' not found`);
      }

      // Calculate price breakdown
      const basePrice = product.price * quantity;
      const gstAmount = (basePrice * taxDetails.gstPercent) / 100;
      const commission = (basePrice * taxDetails.commissionPercent) / 100;
      const total = basePrice + gstAmount + commission;

      // Insert into Postgres with order_id
      await pg.query(
        `INSERT INTO invoices (order_id, product_name, quantity, base_price, gst, commission, total_amount)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          orderId,
          productName,
          quantity,
          basePrice,
          gstAmount,
          commission,
          total,
        ]
      );

      totalInvoiceAmount += total;

      orderItems.push({
        productName,
        quantity,
        basePrice,
        gstAmount,
        commission,
        total,
      });
    }

    res.status(201).json({
      message: "✅ Order placed",
      orderId,
      totalInvoiceAmount,
      items: orderItems,
    });
  } catch (err) {
    console.error("❌ Server error:", err);
    res.status(500).send("❌ Internal server error");
  }
};

// ✅ New: Fetch all grouped invoices
const getAllInvoices = async (req, res) => {
  try {
    const result = await pg.query(
      `SELECT * FROM invoices ORDER BY created_at DESC`
    );

    const grouped = {};

    result.rows.forEach((row) => {
      const {
        order_id,
        product_name,
        quantity,
        base_price,
        gst,
        commission,
        total_amount,
        created_at,
      } = row;

      if (!grouped[order_id]) {
        grouped[order_id] = {
          orderId: order_id,
          createdAt: created_at,
          totalInvoiceAmount: 0,
          items: [],
        };
      }

      grouped[order_id].totalInvoiceAmount += parseFloat(total_amount);
      grouped[order_id].items.push({
        productName: product_name,
        quantity,
        basePrice: parseFloat(base_price),
        gstAmount: parseFloat(gst),
        commission: parseFloat(commission),
        total: parseFloat(total_amount),
      });
    });

    res.status(200).json({
      message: "✅ All Invoices Fetched",
      invoices: Object.values(grouped),
    });
  } catch (err) {
    console.error("❌ Error fetching invoices:", err);
    res.status(500).send("❌ Internal server error");
  }
};

module.exports = { placeOrder, getAllInvoices };
