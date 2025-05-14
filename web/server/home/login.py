import mysql.connector
from flask import Flask, jsonify, request, abort
from flask_cors import CORS

app=Flask(__name__)
CORS(app)
def get_db_connection():
    try:
        connection = mysql.connector.connect(
            host="sh-cynosdbmysql-grp-c35fzur8.sql.tencentcdb.com",
            user="root",
            password="8S3VvXv9",
            database="users_information",
            port=24911
        )
        return connection
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        return None

def get_password(cursor, id):
    try:
        cursor.execute("SELECT password FROM users_information WHERE id = %s", (id,))
        result = cursor.fetchone()
        if result:
            return result[0]
        return None
    except mysql.connector.Error as e:
        print(f"数据库查询出错: {e}")
        return 数据库查询出错

@app.route("/login",methods=['POST'])
def login():
    if not request.is_json:
        return "Request must have Content-Type: application/json", 415
    data = request.get_json()
    if not data:
        return "No JSON data provided in the request", 400
    id = data.get('id')
    password = data.get('password')
    conn=get_db_connection()
    if conn is not None:
        try:
            cursor=conn.cursor()
            stored_password = get_password(cursor, id)
            if stored_password:
                return f"{password == stored_password}",200
            return "没有对应用户",402
        finally:
            cursor.close()
            conn.close()
    return False


if __name__ == "__main__":
        app.run(host='0.0.0.0', debug=True, port=5013)


