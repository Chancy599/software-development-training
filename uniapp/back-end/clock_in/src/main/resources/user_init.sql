-- 插入5条测试用户数据（兼容MySQL 5.7+）
INSERT INTO users_information (
    name,
    id,
    gender,
    password,
    belong_information,
    manage_information,
    contact_information
) VALUES
      ('John Doe', 'USER001', 'MALE', 'Test1234', NULL, NULL, '13800138000'),
      ('Jane Smith', 'USER002', 'FEMALE', 'SecurePwd9', NULL, NULL, '13912345678'),
      ('Mike Johnson', 'USER003', 'MALE', 'Pass2023', NULL, NULL, NULL),
      ('Emily Brown', 'USER004', 'FEMALE', 'Hello123', NULL, NULL, NULL),
      ('David Wilson', 'USER005', 'MALE', 'Wilson#6', NULL, NULL, '15198765432');