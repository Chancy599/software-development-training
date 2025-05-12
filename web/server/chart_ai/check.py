from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
from datetime import datetime
from transform import class_transform
from transform import user_transform

app = Flask(__name__)
CORS(app)

db_config = {
    'host': 'sh-cynosdbmysql-grp-c35fzur8.sql.tencentcdb.com',
    'port': 24911,
    'user': 'root',
    'password': '8S3VvXv9',
    'database': 'check_in_record',
    'charset': 'utf8mb4'
}

@app.route('/check/all_class_state')
def all_class_state():
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor(dictionary=True)

    query = """
        SELECT 
            class_id,
            COUNT(*) AS total_count,
            IFNULL(SUM(CASE WHEN state = 'IN_TIME' THEN 1 ELSE 0 END), 0) AS in_time_count
        FROM check_in_record
        GROUP BY class_id
        ORDER BY class_id
    """
    cursor.execute(query)
    raw_results = cursor.fetchall()

    results = []
    for row in raw_results:
        total = row['total_count']
        in_time = row['in_time_count']
        rate = f"{round(in_time / total * 100, 2)}%" if total > 0 else "0%"
        row['in_time_rate'] = rate
        row['class_name'] = class_transform(row['class_id'])
        results.append(row)

    cursor.close()
    conn.close()
    return jsonify(results)

@app.route('/check/single_class_startTime', methods=['POST'])
def single_class_startTime():
    data = request.get_json()
    class_id = data.get('class_id')
    if not class_id:
        return jsonify({'error': 'Missing class_id parameter'}), 400

    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor(dictionary=True)

    query = """
        SELECT 
            start_time,
            COUNT(*) AS total_count,
            IFNULL(SUM(CASE WHEN state = 'IN_TIME' THEN 1 ELSE 0 END), 0) AS in_time_count
        FROM check_in_record
        WHERE class_id = %s
        GROUP BY start_time
        ORDER BY start_time
    """
    cursor.execute(query, (class_id,))
    raw_results = cursor.fetchall()

    results = []
    for row in raw_results:
        total = row['total_count']
        in_time = row['in_time_count']
        rate = f"{round(in_time / total * 100, 2)}%" if total > 0 else "0%"
        row['in_time_rate'] = rate
        if isinstance(row['start_time'], datetime):
            row['start_time'] = row['start_time'].strftime('%Y-%m-%d %H:%M:%S')
        results.append(row)

    cursor.close()
    conn.close()
    return jsonify(results)

@app.route('/check/single_class_userId', methods=['POST'])
def single_class_userId():
    data = request.get_json()
    class_id = data.get('class_id')
    if not class_id:
        return jsonify({'error': 'Missing class_id parameter'}), 400

    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor(dictionary=True)

    query = """
        SELECT 
            user_id,
            COUNT(*) AS total_count,
            IFNULL(SUM(CASE WHEN state = 'IN_TIME' THEN 1 ELSE 0 END), 0) AS in_time_count
        FROM check_in_record
        WHERE class_id = %s
        GROUP BY user_id
        ORDER BY user_id
    """
    cursor.execute(query, (class_id,))
    raw_results = cursor.fetchall()

    results = []
    for row in raw_results:
        total = row['total_count']
        in_time = row['in_time_count']
        rate = f"{round(in_time / total * 100, 2)}%" if total > 0 else "0%"
        row['in_time_rate'] = rate
        row['user_name'] = user_transform(row['user_id'])
        results.append(row)

    cursor.close()
    conn.close()
    return jsonify(results)

@app.route('/check/single_startTime_state', methods=['POST'])
def single_startTime_state():
    data = request.get_json()
    class_id = data.get('class_id')
    start_time = data.get('start_time')
    if not class_id or not start_time:
        return jsonify({'error': 'Missing class_id or start_time parameter'}), 400

    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor(dictionary=True)

    query = """
        SELECT 
            COUNT(*) AS total_count,
            IFNULL(SUM(CASE WHEN state = 'IN_TIME' THEN 1 ELSE 0 END), 0) AS in_time_count,
            IFNULL(SUM(CASE WHEN state = 'ABSENT' THEN 1 ELSE 0 END), 0) AS absent_count,
            IFNULL(SUM(CASE WHEN state = 'REQUEST_LEAVE' THEN 1 ELSE 0 END), 0) AS request_leave_count,
            IFNULL(SUM(CASE WHEN state = 'LATE' THEN 1 ELSE 0 END), 0) AS late_count
        FROM check_in_record
        WHERE class_id = %s AND start_time = %s
    """
    cursor.execute(query, (class_id, start_time))
    result = cursor.fetchone()
    cursor.close()
    conn.close()

    total = result['total_count'] or 0
    if total > 0:
        result['in_time_ratio'] = f"{round(result['in_time_count'] / total * 100, 2)}%"
        result['absent_ratio'] = f"{round(result['absent_count'] / total * 100, 2)}%"
        result['request_leave_ratio'] = f"{round(result['request_leave_count'] / total * 100, 2)}%"
        result['late_ratio'] = f"{round(result['late_count'] / total * 100, 2)}%"
    else:
        result['in_time_ratio'] = result['absent_ratio'] = result['request_leave_ratio'] = result['late_ratio'] = "0%"

    return jsonify(result)

@app.route('/check/single_userId_state', methods=['POST'])
def single_userId_state():
    data = request.get_json()
    class_id = data.get('class_id')
    user_id = data.get('user_id')
    if not class_id or not user_id:
        return jsonify({'error': 'Missing class_id or user_id parameter'}), 400

    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor(dictionary=True)

    query = """
        SELECT 
            COUNT(*) AS total_count,
            IFNULL(SUM(CASE WHEN state = 'IN_TIME' THEN 1 ELSE 0 END), 0) AS in_time_count,
            IFNULL(SUM(CASE WHEN state = 'ABSENT' THEN 1 ELSE 0 END), 0) AS absent_count,
            IFNULL(SUM(CASE WHEN state = 'REQUEST_LEAVE' THEN 1 ELSE 0 END), 0) AS request_leave_count,
            IFNULL(SUM(CASE WHEN state = 'LATE' THEN 1 ELSE 0 END), 0) AS late_count
        FROM check_in_record
        WHERE class_id = %s AND user_id = %s
    """
    cursor.execute(query, (class_id, user_id))
    result = cursor.fetchone()
    cursor.close()
    conn.close()

    total = result['total_count'] or 0
    if total > 0:
        result['in_time_ratio'] = f"{round(result['in_time_count'] / total * 100, 2)}%"
        result['absent_ratio'] = f"{round(result['absent_count'] / total * 100, 2)}%"
        result['request_leave_ratio'] = f"{round(result['request_leave_count'] / total * 100, 2)}%"
        result['late_ratio'] = f"{round(result['late_count'] / total * 100, 2)}%"
    else:
        result['in_time_ratio'] = result['absent_ratio'] = result['request_leave_ratio'] = result['late_ratio'] = "0%"

    return jsonify(result)

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=5010)
