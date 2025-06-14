CREATE TABLE
    IF NOT EXISTS invoices (
        id SERIAL PRIMARY KEY,
        order_id UUID NOT NULL, -- 🔥 Add this to group rows
        product_name VARCHAR(255) NOT NULL,
        quantity INT NOT NULL,
        base_price NUMERIC NOT NULL,
        gst NUMERIC NOT NULL,
        commission NUMERIC NOT NULL,
        total_amount NUMERIC NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );