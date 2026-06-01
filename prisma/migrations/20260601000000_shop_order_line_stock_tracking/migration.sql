-- Track inventory allocation per shop order line so stock can be decremented on
-- checkout and restored on cancel/return without double-counting.
ALTER TABLE "shop_order_line"
ADD COLUMN "stockTracked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "stockDecremented" BOOLEAN NOT NULL DEFAULT false;
