import pandas as pd
import mysql.connector
from mysql.connector import Error
from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
import json
import uuid
import os
from werkzeug.utils import secure_filename
app=Flask(__name__)
CORS(app)

# 保存上传文件的路径
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

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


def update_usersInformation(conn,user_id,new_class_id):
    print(8888)
    if conn is None:
        return jsonify({"error": "Failed to connect to database"}), 500

    cursor = conn.cursor()
    select_query = "SELECT manage_information FROM users_information.users_information WHERE id = %s"
    cursor.execute(select_query, (user_id,))
    result = cursor.fetchone()
    print(f"MANAGE{result[0]}")

    if result is None:
        return jsonify({"error": "user_id not found"}), 404

    manage_info = result[0]

    try:
        if manage_info:  # 如果 manage_info 不为空
            manage_list = json.loads(manage_info)
        else:  # 如果 manage_info 为空，初始化为空列表
            manage_list = []
    except json.JSONDecodeError:
        manage_list = []  # 如果 JSON 格式错误，重置为空列表

    # 添加进去
    manage_list.append(new_class_id)

    # 转换回 JSON 字符串
    updated_manage_info = json.dumps(manage_list, ensure_ascii=False)

    update_query = "UPDATE users_information.users_information SET manage_information = %s WHERE id = %s"
    cursor.execute(update_query, (updated_manage_info, user_id))
    conn.commit()

@app.route("/excel_to_mysql", methods=['POST'])
def excel_to_mysql():
    # 检查是否有文件部分
    if 'file' not in request.files:
        return "Missing file part", 400

    file = request.files['file']
    if file.filename == '':
        return "No selected file", 400

    # 获取其他字段
    func = request.form.get('func')  # 可选字段

    # 保存文件到服务器本地
    filename = secure_filename(file.filename)
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(file_path)
    new_class_id = str(uuid.uuid4()).replace('-', '')[:16]
    print(f"classID:{new_class_id}")

    try:
        df = pd.read_excel(file_path)
        if 'member_name' not in df.columns or 'role' not in df.columns:
            return jsonify({"error": "'member_name' or 'role' column not found in Excel"}), 400

        # 获取唯一的 member_name
        member_names = df['member_name'].unique().tolist()

        # 查询对应的 user_id
        conn = get_db_connection()
        if conn is None:
            return jsonify({"error": "Failed to connect to database"}), 500

        cursor = conn.cursor()
        format_strings = ','.join(['%s'] * len(member_names))
        cursor.execute(
            f"SELECT name, id FROM users_information.users_information WHERE name IN ({format_strings})",
            tuple(member_names)
        )
        name_id_map = {row[0]: row[1] for row in cursor.fetchall()}

        # 替换 member_name 为 user_id
        df['user_id'] = df['member_name'].map(name_id_map)

        # 删除原始列
        df.drop(columns=['member_name'], inplace=True)
        df['class_id'] = new_class_id

        # 构建成员表 df_member 并去重避免主键冲突
        df_member = df[['class_id', 'user_id', 'role']]
        df_member = df_member.drop_duplicates(subset=['class_id', 'user_id'])
        df_member = df_member.where(pd.notnull(df_member), None)

        # 构建班级信息表 df_info
        df_info = df[df['role'] == 'MANAGER'].drop(columns=['role'])
        if 'user_id' not in df_info.columns:
            return jsonify({"error": "'user_id' column not found after mapping"}), 400
        df_info = df_info.rename(columns={'user_id': 'manager_id'})

        # 准备 SQL 插入语句
        columns_member = ', '.join(df_member.columns)
        placeholders_member = ', '.join(['%s'] * len(df_member.columns))
        columns_info = ', '.join(df_info.columns)
        placeholders_info = ', '.join(['%s'] * len(df_info.columns))

        if func == "新增班级":
            insert_query_member = f"INSERT INTO check_in_list.class_member ({columns_member}) VALUES ({placeholders_member})"
            insert_query_info = f"INSERT INTO check_in_list.class_info ({columns_info}) VALUES ({placeholders_info})"

            try:
                # 插入班级信息
                cursor.execute(insert_query_info, df_info.values[0].tolist())
                # 插入成员
                for row in df_member.values.tolist():
                    print(f"Inserting row into class_member: {row}")
                    cursor.execute(insert_query_member, row)



                # 更新用户表
                update_usersInformation(conn, str(df_info['manager_id'].iloc[0]), new_class_id)
                conn.commit()
                return jsonify({"message": f"{cursor.rowcount} rows inserted successfully."}), 200

            except Error as e:
                conn.rollback()
                print("插入失败，错误信息：", str(e))
                return jsonify({"error": f"MySQL Error: {str(e)}"}), 500

    except Exception as e:
        print("执行异常：", str(e))
        return jsonify({"error": f"Exception: {str(e)}"}), 500

    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals() and conn is not None:
            conn.close()


@app.route("/mysql_to_excel", methods=['GET'])
def mysql_to_excel():
    # 从查询参数获取数据
    func = request.args.get('func')
    class_name = request.args.get('class_name')
    start_time = request.args.get('start_time')

    # REMOVE THIS CHECK - This is causing the 415 error!
    # if not request.is_json:
    #     return "请求头中必须包含 Content-Type: application/json", 415

    if not func:
        return "缺少必要参数：'func'", 400

    if func == "班级名单":
        output_file = "C:\\Users\\rice\\Desktop\\111check111.xlsx"
        conn = None
        cursor = None

        try:
            conn = get_db_connection()
            cursor = conn.cursor(buffered=True)

            # 获取 class_id
            cursor.execute(
                "SELECT class_id FROM check_in_list.class_info WHERE class_name = %s",
                (class_name,)
            )
            result = cursor.fetchone()

            if not result:
                return f"未找到名为『{class_name}』的班级信息，请确认输入是否正确。", 404

            class_id = result[0]

            # 获取 class_member 中的记录
            cursor.execute(
                "SELECT user_id, role FROM check_in_list.class_member WHERE class_id = %s",
                (class_id,)
            )
            members = cursor.fetchall()

            if not members:
                return f"班级『{class_name}』下未查询到任何成员信息。", 404

            user_ids = [m[0] for m in members]

            # 查询 name
            format_strings = ','.join(['%s'] * len(set(user_ids)))
            cursor.execute(
                f"SELECT id, name FROM users_information.users_information WHERE id IN ({format_strings})",
                tuple(set(user_ids))
            )
            id_name_map = {row[0]: row[1] for row in cursor.fetchall()}

            # 构造 DataFrame 数据
            data = {
                "class_name": [class_name] * len(members),
                "member_name": [id_name_map.get(uid, f"未知用户({uid})") for uid in user_ids],
                "role": [m[1] for m in members]
            }

            df = pd.DataFrame(data)

            # 导出为 Excel
            df.to_excel(output_file, index=False)

            # 检查文件是否存在
            if os.path.exists(output_file):
                return send_file(output_file, as_attachment=True, download_name="exported_file.xlsx",
                                 mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            else:
                return "File not found", 404

        except Error as e:
            return f"数据库操作过程中发生错误：{e}", 500

        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()


    elif func == "签到名单":

        output_file = "C:\\Users\\rice\\Desktop\\111check111.xlsx"  # 使用固定路径，不从参数获取

        if not class_name:
            return "缺少必要参数：'class_name'", 400

        if not start_time:
            return "缺少必要参数：'start_time'", 400

        conn = None

        cursor = None

        try:

            conn = get_db_connection()

            cursor = conn.cursor(buffered=True)

            # 获取 class_id

            cursor.execute(

                "SELECT class_id FROM check_in_list.class_info WHERE class_name = %s",

                (class_name,)

            )

            result = cursor.fetchone()

            if not result:
                return f"未找到名为『{class_name}』的班级信息，请确认输入是否正确。", 404

            class_id = result[0]

            # 获取 check_in_record 中对应的记录

            cursor.execute(

                "SELECT * FROM check_in_record.check_in_record WHERE class_id = %s AND start_time=%s",

                (class_id, start_time)

            )

            records = cursor.fetchall()

            if not records:
                return f"班级『{class_name}』下未查询到签到信息。", 404

            # 获取所有列名

            all_columns = [desc[0] for desc in cursor.description]

            # 将需要剔除的字段排除

            excluded_columns = {"class_id", "cipher", "location", "record_id"}

            column_names = [col for col in all_columns if col not in excluded_columns]

            # 构建索引映射

            column_indices = {col: idx for idx, col in enumerate(all_columns)}

            # 构造 DataFrame 数据字典

            df_data = {

                "class_name": [class_name] * len(records)

            }

            # 查 name 并填充 df_data

            for col in column_names:

                if col == "user_id":

                    user_ids = [record[column_indices["user_id"]] for record in records]

                    # 查询所有相关的 name

                    if user_ids:  # 确保有用户ID再查询

                        format_strings = ','.join(['%s'] * len(set(user_ids)))

                        cursor.execute(

                            f"SELECT id, name FROM users_information.users_information WHERE id IN ({format_strings})",

                            tuple(set(user_ids))

                        )

                        id_name_map = {row[0]: row[1] for row in cursor.fetchall()}

                        df_data["member_name"] = [id_name_map.get(uid, f"未知用户({uid})") for uid in user_ids]

                else:

                    df_data[col] = [record[column_indices[col]] for record in records]

            df = pd.DataFrame(df_data)

            # 导出为 Excel

            df.to_excel(output_file, index=False)

            # 检查文件是否存在

            if os.path.exists(output_file):

                return send_file(output_file, as_attachment=True,

                                 download_name=f"{class_name}_{start_time}_签到名单.xlsx",

                                 mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')

            else:

                return "File not found", 404


        except Error as e:

            return f"数据库操作过程中发生错误：{e}", 500


        finally:

            if cursor:
                cursor.close()

            if conn:
                conn.close()

    return "不支持的功能类型", 400




@app.route('/getClassName', methods=['POST'])
def get_class_names():
    data = request.get_json()
    user_id = data.get('id')

    if not user_id:
        return jsonify({'error': 'Missing id'}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # 查询用户的 manage_information
        cursor.execute("SELECT manage_information FROM users_information.users_information WHERE id = %s", (user_id,))
        result = cursor.fetchone()

        if not result:
            return jsonify({'error': 'User not found'}), 404

        # manage_information 是字符串，需要解析
        manage_info = json.loads(result['manage_information'])  # 变成 Python list

        class_names = []
        for class_id in manage_info:
            cursor.execute("SELECT class_name FROM check_in_list.class_info WHERE class_id = %s", (class_id,))
            class_result = cursor.fetchone()
            if class_result:
                class_names.append(class_result['class_name'])

        return jsonify({'class_names': class_names})

    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


@app.route('/getStartTime', methods=['POST'])
def get_start_times():
    data = request.get_json()
    class_name = data.get('class_name')

    if not class_name:
        return jsonify({'error': 'Missing class_name'}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # 第一步：根据 class_name 查 class_id
        cursor.execute("SELECT class_id FROM check_in_list.class_info WHERE class_name = %s", (class_name,))
        result = cursor.fetchone()
        print(result)
        if not result:
            return jsonify({'error': 'Class name not found'}), 404

        class_id = result[0]

        # 第二步：根据 class_id 查 start_time
        cursor.execute("SELECT DISTINCT start_time FROM check_in_record.check_in_record WHERE class_id = %s", (class_id,))
        results = cursor.fetchall()

        # 格式化为字符串数组
        start_times = [row[0].strftime('%Y-%m-%d %H:%M:%S') for row in results]

        return jsonify({'start_times': start_times})

    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()



if __name__ == "__main__":
        app.run(host='0.0.0.0', debug=True, port=5012)


