const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const separatorIndex = trimmed.indexOf('=');

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

function formatTableName(name) {
  return `\`${String(name).replace(/`/g, '``')}\``;
}

async function main() {
  loadEnvFile(path.join(process.cwd(), '.env.local'));
  loadEnvFile(path.join(process.cwd(), '.env'));

  const host = process.env.DB_HOST || 'localhost';
  const port = Number(process.env.DB_PORT || 3306);
  const user = process.env.DB_USER || 'testuser';
  const password = process.env.DB_PASSWORD || '1234';
  const database = process.env.DB_NAME || 'testdb';

  const connection = await mysql.createConnection({
    host,
    port,
    user,
    password,
    multipleStatements: false,
  });

  try {
    console.log(`[reset-testdb] Connected to ${host}:${port} as ${user}`);

    await connection.query(
      `CREATE DATABASE IF NOT EXISTS ${formatTableName(
        database
      )} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    await connection.query(`USE ${formatTableName(database)}`);

    const [existingTables] = await connection.query('SHOW TABLES');
    const tableNames = existingTables.map((row) => Object.values(row)[0]);

    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    for (const tableName of tableNames) {
      await connection.query(`DROP TABLE IF EXISTS ${formatTableName(tableName)}`);
      console.log(`[reset-testdb] Dropped table: ${tableName}`);
    }
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');

    await connection.query(`
      CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(191) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(30) NOT NULL DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await connection.query(`
      CREATE TABLE accounts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        account_number VARCHAR(30) NOT NULL,
        account_name VARCHAR(100) NOT NULL,
        account_type VARCHAR(30) NOT NULL,
        balance DECIMAL(15,2) NOT NULL DEFAULT 0,
        currency CHAR(3) NOT NULL DEFAULT 'KRW',
        status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_account_number (account_number),
        KEY idx_accounts_user_id (user_id),
        CONSTRAINT fk_accounts_user
          FOREIGN KEY (user_id) REFERENCES users (id)
          ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await connection.query(`
      CREATE TABLE transfers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        from_account_id INT NOT NULL,
        to_account_id INT NOT NULL,
        requested_by_user_id INT NOT NULL,
        amount DECIMAL(15,2) NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'COMPLETED',
        description VARCHAR(255) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        processed_at TIMESTAMP NULL DEFAULT NULL,
        KEY idx_transfers_from_account (from_account_id),
        KEY idx_transfers_to_account (to_account_id),
        KEY idx_transfers_user (requested_by_user_id),
        CONSTRAINT fk_transfers_from_account
          FOREIGN KEY (from_account_id) REFERENCES accounts (id),
        CONSTRAINT fk_transfers_to_account
          FOREIGN KEY (to_account_id) REFERENCES accounts (id),
        CONSTRAINT fk_transfers_user
          FOREIGN KEY (requested_by_user_id) REFERENCES users (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await connection.query(`
      CREATE TABLE account_transactions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        account_id INT NOT NULL,
        transfer_id INT DEFAULT NULL,
        counterparty_account_id INT DEFAULT NULL,
        transaction_type VARCHAR(20) NOT NULL,
        amount DECIMAL(15,2) NOT NULL,
        balance_after DECIMAL(15,2) NOT NULL,
        memo VARCHAR(255) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        KEY idx_transactions_account (account_id),
        KEY idx_transactions_transfer (transfer_id),
        KEY idx_transactions_counterparty (counterparty_account_id),
        CONSTRAINT fk_transactions_account
          FOREIGN KEY (account_id) REFERENCES accounts (id),
        CONSTRAINT fk_transactions_transfer
          FOREIGN KEY (transfer_id) REFERENCES transfers (id),
        CONSTRAINT fk_transactions_counterparty
          FOREIGN KEY (counterparty_account_id) REFERENCES accounts (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await connection.query(`
      CREATE TABLE audit_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT DEFAULT NULL,
        action_type VARCHAR(100) NOT NULL,
        target_type VARCHAR(100) NOT NULL,
        target_id INT DEFAULT NULL,
        details TEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        KEY idx_audit_logs_user (user_id),
        CONSTRAINT fk_audit_logs_user
          FOREIGN KEY (user_id) REFERENCES users (id)
          ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await connection.query(`
      CREATE TABLE inventory_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_initial VARCHAR(20) NOT NULL,
        product_name VARCHAR(100) NOT NULL,
        category VARCHAR(30) NOT NULL,
        status VARCHAR(30) NOT NULL,
        location VARCHAR(50) NOT NULL,
        storage_period VARCHAR(50) NOT NULL,
        inbound_date DATE NOT NULL,
        outbound_due_date DATE NOT NULL,
        expected_amount INT NOT NULL,
        contract_detail TEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    const users = [
      {
        id: 1,
        name: '관리자',
        email: 'admin@smartbank.local',
        password: 'Admin1234!',
        role: 'admin',
      },
      {
        id: 2,
        name: '김민수',
        email: 'minsu.kim@smartbank.local',
        password: 'User1234!',
        role: 'user',
      },
      {
        id: 3,
        name: '이서연',
        email: 'seoyeon.lee@smartbank.local',
        password: 'User1234!',
        role: 'user',
      },
      {
        id: 4,
        name: '박지훈',
        email: 'jihoon.park@smartbank.local',
        password: 'User1234!',
        role: 'user',
      },
    ];

    for (const seededUser of users) {
      const passwordHash = await bcrypt.hash(seededUser.password, 10);
      await connection.execute(
        `
          INSERT INTO users (id, name, email, password_hash, role)
          VALUES (?, ?, ?, ?, ?)
        `,
        [
          seededUser.id,
          seededUser.name,
          seededUser.email,
          passwordHash,
          seededUser.role,
        ]
      );
    }

    const accounts = [
      [1, 2, '110-100-000001', '민수 주거래 통장', 'checking', 3350000.0, 'KRW', 'ACTIVE'],
      [2, 2, '110-200-000002', '민수 적금 계좌', 'savings', 8200000.0, 'KRW', 'ACTIVE'],
      [3, 3, '220-100-000003', '서연 생활비 통장', 'checking', 2450000.0, 'KRW', 'ACTIVE'],
      [4, 4, '330-100-000004', '지훈 급여 통장', 'checking', 5120000.0, 'KRW', 'ACTIVE'],
      [5, 4, '330-200-000005', '지훈 예금 계좌', 'savings', 12000000.0, 'KRW', 'ACTIVE'],
    ];

    for (const account of accounts) {
      await connection.execute(
        `
          INSERT INTO accounts
            (id, user_id, account_number, account_name, account_type, balance, currency, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        account
      );
    }

    const transfers = [
      [
        1,
        1,
        3,
        2,
        150000.0,
        'COMPLETED',
        '월세 이체',
        '2026-04-18 09:10:00',
        '2026-04-18 09:10:05',
      ],
      [
        2,
        4,
        1,
        4,
        80000.0,
        'COMPLETED',
        '모임 정산',
        '2026-04-19 18:20:00',
        '2026-04-19 18:20:04',
      ],
      [
        3,
        2,
        5,
        2,
        500000.0,
        'COMPLETED',
        '예금 이체',
        '2026-04-20 08:45:00',
        '2026-04-20 08:45:03',
      ],
    ];

    for (const transfer of transfers) {
      await connection.execute(
        `
          INSERT INTO transfers
            (id, from_account_id, to_account_id, requested_by_user_id, amount, status, description, created_at, processed_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        transfer
      );
    }

    const accountTransactions = [
      [1, 1, 1, 3, 'DEBIT', 150000.0, 3270000.0, '월세 이체', '2026-04-18 09:10:05'],
      [2, 3, 1, 1, 'CREDIT', 150000.0, 2450000.0, '월세 입금', '2026-04-18 09:10:05'],
      [3, 4, 2, 1, 'DEBIT', 80000.0, 5120000.0, '모임 정산 송금', '2026-04-19 18:20:04'],
      [4, 1, 2, 4, 'CREDIT', 80000.0, 3350000.0, '모임 정산 입금', '2026-04-19 18:20:04'],
      [5, 2, 3, 5, 'DEBIT', 500000.0, 8200000.0, '예금 이체 출금', '2026-04-20 08:45:03'],
      [6, 5, 3, 2, 'CREDIT', 500000.0, 12000000.0, '예금 이체 입금', '2026-04-20 08:45:03'],
    ];

    for (const transaction of accountTransactions) {
      await connection.execute(
        `
          INSERT INTO account_transactions
            (id, account_id, transfer_id, counterparty_account_id, transaction_type, amount, balance_after, memo, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        transaction
      );
    }

    const auditLogs = [
      [
        1,
        1,
        'SEED_DATABASE',
        'database',
        null,
        JSON.stringify({ message: 'Initial database seed applied' }),
        '2026-04-22 08:00:00',
      ],
      [
        2,
        2,
        'USER_LOGIN',
        'user',
        2,
        JSON.stringify({ email: 'minsu.kim@smartbank.local' }),
        '2026-04-18 08:55:00',
      ],
      [
        3,
        2,
        'TRANSFER_COMPLETED',
        'transfer',
        1,
        JSON.stringify({ fromAccountId: 1, toAccountId: 3, amount: 150000 }),
        '2026-04-18 09:10:05',
      ],
      [
        4,
        4,
        'TRANSFER_COMPLETED',
        'transfer',
        2,
        JSON.stringify({ fromAccountId: 4, toAccountId: 1, amount: 80000 }),
        '2026-04-19 18:20:04',
      ],
      [
        5,
        2,
        'TRANSFER_COMPLETED',
        'transfer',
        3,
        JSON.stringify({ fromAccountId: 2, toAccountId: 5, amount: 500000 }),
        '2026-04-20 08:45:03',
      ],
    ];

    for (const log of auditLogs) {
      await connection.execute(
        `
          INSERT INTO audit_logs
            (id, user_id, action_type, target_type, target_id, details, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        log
      );
    }

    const inventoryItems = [
      [
        1,
        'TB',
        '전자부품 박스',
        '일반',
        '보관',
        'A-01-03',
        '30일',
        '2026-04-20',
        '2026-05-20',
        3200000,
        '월간 보관 계약 - 일반 창고',
      ],
      [
        2,
        'FR',
        '신선식품 냉장',
        '냉장',
        '출고 대기',
        'C-02-01',
        '14일',
        '2026-04-18',
        '2026-04-25',
        1450000,
        '냉장 물류 단기 계약',
      ],
      [
        3,
        'FZ',
        '냉동 해산물',
        '냉동',
        '보관',
        'F-01-02',
        '21일',
        '2026-04-16',
        '2026-05-07',
        2780000,
        '냉동 창고 보관 계약',
      ],
      [
        4,
        'TX',
        '의류 택배 물량',
        '일반',
        '출고 완료',
        'B-03-07',
        '7일',
        '2026-04-10',
        '2026-04-17',
        980000,
        '주간 출고 계약',
      ],
      [
        5,
        'MD',
        '의약품 냉장 보관',
        '냉장',
        '보관',
        'C-04-03',
        '10일',
        '2026-04-21',
        '2026-05-01',
        4100000,
        '의약품 전용 온도 관리 계약',
      ],
    ];

    for (const item of inventoryItems) {
      await connection.execute(
        `
          INSERT INTO inventory_items
            (
              id,
              product_initial,
              product_name,
              category,
              status,
              location,
              storage_period,
              inbound_date,
              outbound_due_date,
              expected_amount,
              contract_detail
            )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        item
      );
    }

    console.log('[reset-testdb] Database reset complete.');
    console.log('[reset-testdb] Seed users:');
    console.log('  - admin@smartbank.local / Admin1234!');
    console.log('  - minsu.kim@smartbank.local / User1234!');
    console.log('  - seoyeon.lee@smartbank.local / User1234!');
    console.log('  - jihoon.park@smartbank.local / User1234!');
  } finally {
    await connection.end();
  }
}

main().catch((error) => {
  console.error('[reset-testdb] Failed:', error);
  process.exit(1);
});
