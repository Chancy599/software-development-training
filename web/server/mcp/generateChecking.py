import requests
import mysql.connector
from datetime import datetime, timezone
from flask import Flask, jsonify, request, abort
import json
app = Flask(__name__)




def get_db_connection():
    try:
        connection = mysql.connector.connect(
            host="sh-cynosdbmysql-grp-c35fzur8.sql.tencentcdb.com",
            user="root",
            password="8S3VvXv9",
            database="check_in_record",
            port=24911
        )
        return connection
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        return None


# 模拟的类和枚举
class ClassInfo:
    def __init__(self, id):
        self.id = id


class ClassMember:
    class Role:
        MEMBER = 1

    def __init__(self, id, role):
        self.id = id
        self.role = role


class CheckinRecord:
    class State:
        ABSENT = 1

    def __init__(self):
        self.class_id = None
        self.user_id = None
        self.start_time = None
        self.valid_duration = None
        self.state = None
        self.cipher= None
        self.method= None
        self.location= None

    def save(self):
        if self.location is None:
            location_part = "NULL"
            location_values = ()
        else:
            location_part = "POINT(%s, %s)"
            location_values = (self.location[0], self.location[1])

        connection = get_db_connection()
        if connection:
            cursor = connection.cursor()
            try:

                query = f"""
                INSERT INTO check_in_record (class_id, user_id,start_time, valid_duration, state,cipher,method,location)
                VALUES (%s, %s, %s, %s, %s, %s,%s,{location_part})
                """
                values = (
                    self.class_id,
                    self.user_id,
                    self.start_time,
                    self.valid_duration,
                    self.state,
                    self.cipher,
                    self.method,
                )+location_values
                cursor.execute(query, values)
                connection.commit()
                return "Checkin record saved successfully."
            except mysql.connector.Error as err:
                return f"Error saving record: {err}"
            finally:
                cursor.close()
                connection.close()


class CheckinStrategy:
    def validate_params(self, method,params):
        pass

    def enrich_record(self, record, method,params):
        if "CIPHER" in params:
            record.cipher = params["CIPHER"]
        if "GPS" in params:
            location = params["GPS"]

            record.location = location
            print(record.location)



class StrategyFactory:
    def get_strategy(self, method):
        return CheckinStrategy()


def get_current_time_in_utc8():
    return datetime.now(timezone.utc).astimezone()


def create_base_record(class_id, user_id, member):
    record = CheckinRecord()
    record.class_id = class_id
    record.user_id = user_id
    record.member = member
    return record

def getCLassId(class_name):
    connection = get_db_connection()
    if connection is None:
        return []
    try:
        cursor = connection.cursor(dictionary=True)
        query = """
                SELECT class_id 
                FROM check_in_list.class_info
                WHERE class_name = %s
            """
        cursor.execute(query, (class_name,))
        result = cursor.fetchone()
        print(result)
        return result['class_id']
    except mysql.connector.Error as err:
        print(f"Error fetching members: {err}")
        return []
    finally:
        cursor.close()
        connection.close()

def get_check_members(class_id):
    """
    查询给定 class_id 下，role = 'MEMBER' 的所有成员，
    并返回 ClassMember 对象的列表。
    """
    connection = get_db_connection()
    if connection is None:
        return []
    try:
        cursor = connection.cursor(dictionary=True)
        query = """
            SELECT user_id AS id, role
            FROM check_in_list.class_member
            WHERE class_id = %s
              AND role = %s
        """
        cursor.execute(query, (class_id, 'MEMBER'))
        rows = cursor.fetchall()

        members = []
        for row in rows:
            # row['id'] 是 user_id，row['role'] 是字符串 'MEMBER'
            member = ClassMember(id=row['id'], role=ClassMember.Role.MEMBER)
            members.append(member)
        return members

    except mysql.connector.Error as err:
        print(f"Error fetching members: {err}")
        return []
    finally:
        cursor.close()
        connection.close()



@app.route('/tool/start', methods=['POST'])
def start_checkin_activity():
    try:
        # 1. 拿到策略
        data = request.get_json()
        if not data:
            return "No JSON data provided in the request", 400
        print(data)
        class_name = data.get('class_name')
        method = data.get('method')
        params = data.get('params')
        duration = data.get('duration')

        if not all([class_name, method, params, duration]):
            return "Missing required parameters: class_name, method, params, or duration", 400

        class_id=getCLassId(class_name)
        strategy = StrategyFactory().get_strategy(method)

        # 2. 拿到打卡成员列表，假设从数据库查
        members = get_check_members(class_id)
        start_time = get_current_time_in_utc8()

        # 3. 验参
        strategy.validate_params(method, params)

        # 4. 循环插入 ABSENT 记录
        for member in members:
            if member.role == ClassMember.Role.MEMBER:
                record = CheckinRecord()
                record.class_id = class_id
                record.user_id = member.id
                record.start_time = start_time
                record.method=method
                record.valid_duration = duration
                record.state = "ABSENT"
                strategy.enrich_record(record, method, params)
                result = record.save()
                print(result)

        return "finished", 200
    except Exception as e:
        return f"An error occurred: {str(e)}", 500




def getThingHappen(class_name:str, start_time:str) -> str:
    # 假设 "事件" 的值为一个字符串 "正常事件"，你可以根据实际情况修改
    event_value = "UML没有点名"
    return event_value


def member(class_name:str) -> dict[any,any]:
    # 假设 "事件" 的值为一个字符串 "正常事件"，你可以根据实际情况修改
    member=["1","2","cch","cxg"]
    data = {
        "class_name": class_name,
        "member": member
    }
    #json_data = json.dumps(data)
    return data

if __name__ == '__main__':
    #mcp.run(transport='stdio')
    app.run(host='0.0.0.0', debug=True, port=5016)
