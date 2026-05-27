CREATE DATABASE IF NOT EXISTS reloop
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE reloop;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(80) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  carbon_coins INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS waste_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  item_id VARCHAR(60) NOT NULL UNIQUE,
  name VARCHAR(80) NOT NULL,
  material VARCHAR(60) NOT NULL,
  default_bin VARCHAR(80) NOT NULL,
  base_points INT NOT NULL,
  carbon_reduction_per_kg DECIMAL(8,3) NOT NULL DEFAULT 0,
  default_weight_kg DECIMAL(8,3) NOT NULL DEFAULT 0,
  is_recyclable BOOLEAN NOT NULL DEFAULT TRUE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS recycle_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  waste_type_id INT NOT NULL,
  item_name VARCHAR(80) NOT NULL,
  material VARCHAR(60) NOT NULL,
  size ENUM('小型', '中型', '大型') NOT NULL DEFAULT '中型',
  cleanliness ENUM('乾淨', '輕微殘留', '嚴重油污', '不適用') NOT NULL DEFAULT '乾淨',
  weight_kg DECIMAL(8,3) NOT NULL,
  points_earned INT NOT NULL DEFAULT 0,
  carbon_reduced_kg DECIMAL(8,2) NOT NULL DEFAULT 0,
  confidence DECIMAL(5,2) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_recycle_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_recycle_waste FOREIGN KEY (waste_type_id) REFERENCES waste_types(id)
);

CREATE TABLE IF NOT EXISTS coin_transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  type ENUM('earn', 'redeem', 'adjust') NOT NULL,
  amount INT NOT NULL,
  description VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_coin_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS rewards (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description VARCHAR(255) NOT NULL,
  cost INT NOT NULL,
  stock INT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS classification_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  image_mime VARCHAR(80) NULL,
  ai_provider VARCHAR(40) NULL,
  raw_result JSON NULL,
  normalized_item_id VARCHAR(60) NULL,
  confidence DECIMAL(5,2) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_classification_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

INSERT INTO waste_types
  (item_id, name, material, default_bin, base_points, carbon_reduction_per_kg, default_weight_kg, is_recyclable)
VALUES
  ('pet-bottle', 'PET 寶特瓶', '塑膠類', '塑膠回收桶', 40, 1.700, 0.030, TRUE),
  ('aluminum-can', '鋁罐', '金屬類', '金屬回收桶', 60, 9.100, 0.015, TRUE),
  ('cardboard', '紙板', '紙類', '紙類回收桶', 25, 0.900, 0.120, TRUE),
  ('glass-bottle', '玻璃瓶', '玻璃類', '玻璃回收桶', 45, 0.300, 0.250, TRUE),
  ('oily-lunchbox', '有油污餐盒', '污染回收物', '一般垃圾桶', 25, 0.000, 0.080, FALSE),
  ('general-waste', '一般垃圾', '不可回收物', '一般垃圾桶', 0, 0.000, 0.100, FALSE)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  material = VALUES(material),
  default_bin = VALUES(default_bin),
  base_points = VALUES(base_points),
  carbon_reduction_per_kg = VALUES(carbon_reduction_per_kg),
  default_weight_kg = VALUES(default_weight_kg),
  is_recyclable = VALUES(is_recyclable),
  is_active = TRUE;

INSERT INTO rewards (name, description, cost, stock)
VALUES
  ('星巴克咖啡折抵券', '買一杯指定飲品折抵 $50', 500, 50),
  ('環保購物袋', 'reloop 限定環保帆布包', 1200, 30),
  ('種一棵樹計畫', '捐助台灣造林協會植樹', 800, NULL),
  ('超商購物金 $100', '全家 / 7-11 現金折抵', 2000, 20),
  ('共享單車月票', 'YouBike 30 天無限次騎乘', 1500, 20),
  ('回收加倍活動票', '下次回收點數 x2 兌換券', 300, 100)
ON DUPLICATE KEY UPDATE name = name;
