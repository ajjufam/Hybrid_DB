const connectMongo = require("./config/mongo");
const Product = require("./models/product.mongo");
const Tax = require("./models/tax.mongo");

async function seed() {
  await connectMongo();

  await Product.deleteMany({});
  await Tax.deleteMany({});

  await Product.insertMany([
    { name: "Fan", price: 5000 },
    { name: "TV", price: 15000 },
    { name: "Laptop", price: 150000 },
  ]);

  await Tax.insertMany([
    { productName: "Fan", gstPercent: 18, commissionPercent: 10 },
    { productName: "TV", gstPercent: 12, commissionPercent: 8 },
    { productName: "Laptop", gstPercent: 12, commissionPercent: 8 },
  ]);

  console.log("✅ Sample Data Inserted");
  process.exit(0);
}

seed();
