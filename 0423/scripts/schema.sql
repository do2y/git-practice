-- 견적서 기본정보 테이블
CREATE TABLE IF NOT EXISTS estimates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  item_name VARCHAR(100) NOT NULL,
  contact_number VARCHAR(30) NOT NULL,
  product_name VARCHAR(100) NOT NULL,
  product_quantity VARCHAR(50) NOT NULL,
  region_name VARCHAR(100) NOT NULL,
  item_type VARCHAR(50) NOT NULL,
  pallet_count VARCHAR(30) NOT NULL,
  caution_text TEXT,
  status VARCHAR(30) DEFAULT '작성중',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 견적서 품목 목록 테이블
CREATE TABLE IF NOT EXISTS estimate_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  estimate_id INT NOT NULL,
  item_name VARCHAR(100) NOT NULL,
  quantity_text VARCHAR(100) NOT NULL,
  warehouse_name VARCHAR(100) NOT NULL,
  storage_type VARCHAR(50) NOT NULL,
  remark VARCHAR(100),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (estimate_id) REFERENCES estimates(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
