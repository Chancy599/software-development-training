from flask import Flask, jsonify, request
from flask_cors import CORS
from openai import OpenAI

app = Flask(__name__)
CORS(app)

DEEPSEEK_API_KEY = "sk-aa7f01e252d443b09f63a0518c0dbc7f"
DEEPSEEK_API_BASE = "https://api.deepseek.com/v1"

client = OpenAI(api_key=DEEPSEEK_API_KEY, base_url=DEEPSEEK_API_BASE)

# 自定义系统提示词
SYSTEM_PROMPT_1 = """
你是一名教育数据分析师，请根据提供的班级签到统计数据，生成一份包含以下内容的专业分析报告：

报告要求：
1. 分析每个班级的准时签到率
2. 对比不同班级的表现差异
3. 给出改进建议（如调整课程时间、加强考勤管理等）
4. 分析时可以生成表格，但不要生成图
5. 返回的数据是markdown形式的
6. 禁止添加任何形式的结束语，最后一条建议结束后立即停止
"""

SYSTEM_PROMPT_2 = """
作为教务管理人员，请分析该课程不同时间段的签到数据，生成包含以下要素的报告：

分析要求：
1. 用文字描述准时率变化趋势
2. 留意异常波动的时间点（如准时率骤降超过15%）
3. 提出针对性解决方案（如调整问题时间段的教学安排）
4. 分析时可以生成表格，但不要生成图
5. 返回的数据是markdown形式的
6. 禁止添加任何形式的结束语，最后一条建议结束后立即停止
"""

SYSTEM_PROMPT_3 = """
你是一名学生行为分析师，请根据班级学生签到数据生成分析报告：

分析要求：
1. 评估每位学生的准时签到表现
2. 标记低出勤率学生（准时率<75%）
3. 给出个性化改进建议（如学习计划调整）
4. 分析时可以生成表格，但不要生成图
5. 返回的数据是markdown形式的
6. 禁止添加任何形式的结束语，最后一条建议结束后立即停止
"""

SYSTEM_PROMPT_4 = """
作为课程质量监督员，请分析本次课程签到情况：

分析要求：
1. 计算各类考勤状态占比（准时/迟到/缺勤/请假）
2. 识别主要问题
3. 提供课程优化建议（如调整上课时间）
4. 分析时可以生成表格，但不要生成图
5. 返回的数据是markdown形式的
6. 禁止添加任何形式的结束语，最后一条建议结束后立即停止
"""

SYSTEM_PROMPT_5 = """
你是一名学业指导老师，请根据学生个人签到记录生成评估报告：

分析要求：
1. 评估该生的考勤稳定性
2. 指出需要改进的考勤问题
3. 给出具体成长建议（如时间管理技巧）
4. 分析时可以生成表格，但不要生成图
5. 返回的数据是markdown形式的
6. 禁止添加任何形式的结束语，最后一条建议结束后立即停止
"""

@app.route('/analysis/1', methods=['POST'])
def generate_response_1():
    try:
        data = request.get_json()
        if not data or 'content' not in data:
            return jsonify({"error": "请求必须包含 'content' 字段"}), 400

        # 自动构建 messages 结构（系统提示词 + 用户消息）
        messages = [
            {"role": "system", "content": SYSTEM_PROMPT_1},
            {"role": "user", "content": data['content']}  # 直接使用用户输入的 content
        ]

        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=messages,
            temperature=data.get('temperature', 0.7),
            max_tokens=data.get('max_tokens', 1024)
        )

        return jsonify({"response": response.choices[0].message.content})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/analysis/2', methods=['POST'])
def generate_response_2():
    try:
        data = request.get_json()
        if not data or 'content' not in data:
            return jsonify({"error": "请求必须包含 'content' 字段"}), 400

        # 自动构建 messages 结构（系统提示词 + 用户消息）
        messages = [
            {"role": "system", "content": SYSTEM_PROMPT_2},
            {"role": "user", "content": data['content']}  # 直接使用用户输入的 content
        ]

        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=messages,
            temperature=data.get('temperature', 0.7),
            max_tokens=data.get('max_tokens', 1024)
        )

        return jsonify({"response": response.choices[0].message.content})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/analysis/3', methods=['POST'])
def generate_response_3():
    try:
        data = request.get_json()
        if not data or 'content' not in data:
            return jsonify({"error": "请求必须包含 'content' 字段"}), 400

        # 自动构建 messages 结构（系统提示词 + 用户消息）
        messages = [
            {"role": "system", "content": SYSTEM_PROMPT_3},
            {"role": "user", "content": data['content']}  # 直接使用用户输入的 content
        ]

        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=messages,
            temperature=data.get('temperature', 0.7),
            max_tokens=data.get('max_tokens', 1024)
        )

        return jsonify({"response": response.choices[0].message.content})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/analysis/4', methods=['POST'])
def generate_response_4():
    try:
        data = request.get_json()
        if not data or 'content' not in data:
            return jsonify({"error": "请求必须包含 'content' 字段"}), 400

        # 自动构建 messages 结构（系统提示词 + 用户消息）
        messages = [
            {"role": "system", "content": SYSTEM_PROMPT_4},
            {"role": "user", "content": data['content']}  # 直接使用用户输入的 content
        ]

        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=messages,
            temperature=data.get('temperature', 0.7),
            max_tokens=data.get('max_tokens', 1024)
        )

        return jsonify({"response": response.choices[0].message.content})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/analysis/5', methods=['POST'])
def generate_response_5():
    try:
        data = request.get_json()
        if not data or 'content' not in data:
            return jsonify({"error": "请求必须包含 'content' 字段"}), 400

        # 自动构建 messages 结构（系统提示词 + 用户消息）
        messages = [
            {"role": "system", "content": SYSTEM_PROMPT_5},
            {"role": "user", "content": data['content']}  # 直接使用用户输入的 content
        ]

        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=messages,
            temperature=data.get('temperature', 0.7),
            max_tokens=data.get('max_tokens', 1024)
        )

        return jsonify({"response": response.choices[0].message.content})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=5011)