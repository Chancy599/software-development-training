import mysql.connector

db_config_class = {
    'host': 'sh-cynosdbmysql-grp-c35fzur8.sql.tencentcdb.com',
    'port': 24911,
    'user': 'root',
    'password': '8S3VvXv9',
    'database': 'check_in_list',
    'charset': 'utf8mb4'
}

db_config_user = {
    'host': 'sh-cynosdbmysql-grp-c35fzur8.sql.tencentcdb.com',
    'port': 24911,
    'user': 'root',
    'password': '8S3VvXv9',
    'database': 'users_information',
    'charset': 'utf8mb4'
}
def class_transform(class_id):
    conn = mysql.connector.connect(**db_config_class)
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT class_name FROM class_info WHERE class_id = %s", (class_id,))
    result = cursor.fetchone()
    cursor.close()
    conn.close()
    return result['class_name'] if result else None

def user_transform(user_id):
    conn = mysql.connector.connect(**db_config_user)
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT name FROM users_information WHERE id = %s", (user_id,))
    result = cursor.fetchone()
    cursor.close()
    conn.close()
    return result['name'] if result else None


