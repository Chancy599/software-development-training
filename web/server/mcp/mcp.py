from fastapi import FastAPI, Request
from flask import Flask, jsonify, request, abort
from flask_cors import CORS
#from tools.tool_hello import router as hello_router
import httpx
import json
import requests
from openai import OpenAI
import whisper
import os
from opencc import OpenCC

app = Flask(__name__)
CORS(app)
#app.include_router(hello_router)
model = whisper.load_model("base", device="cpu")  # 程序启动时只加载一次，后面调用很快
cc = OpenCC('t2s')  # 't2s' 表示繁体转简体
GAODE_Key = "932ef7b6d2faa6db82c3b63d4fd4652c"
DEEKEEK_API_URL = "https://api.deepseek.com/chat/completions"  # 你自己的 deekseek 大模型接口
DEEKEEK_API_KEY = "sk-aa7f01e252d443b09f63a0518c0dbc7f"  # 如果有的话


def send_messages(messages):
    response = client.chat.completions.create(
        model="deepseek-chat",
        messages=messages,
        max_tokens=1024,
        temperature=0.7,
        stream=False,
        tools=tools
    )
    return response.choices[0].message


client= OpenAI(
    api_key=f"{DEEKEEK_API_KEY}",
    base_url="https://api.deepseek.com",
)


tools=[
    {
        "type": "function",
        "function":
            {
                "name": "start",  # 工具函数名称
                "description": "This tool is used to insect data into mysql base"
                               "returns boolean message with provided class_name, method, params, and duration",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "class_name": {"type": "string","description": "班级名字,是全汉字"},
                        "method": {"type": "string","description": "签到方法(enum类型，有CIPHER,GPS,FACE_SCAN,QRCODE四种类型)"},
                        "params": {"type": "object","description": "签到方法所需要的参数,格式为{{签到方法}:{签到参数}}，暗号中的汉字数字都要转为阿拉伯数字,字母都是大写,如果签到方法是定位，则需要具体的经纬度位置(此时签到参数格式为[经度,纬度])，而不是地点名称，如果签到方法是FACE_SCAN或者QRCODE，这里就填默认值123456"},
                        "duration": {"type": "string","description": "签到持续时长,要求是纯数字"},
                    },
                    "required": ["class_name", "method", "params", "duration"]
                }
            }

    },
{
        "type": "function",
        "function":
            {
                "name": "location",  # 工具函数名称
                "description": "This tool is used to get the location of a place through its name and city"
                               "returns boolean message with provided address",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "address": {"type": "string","description": "城市+具体地点名称"}
                    },
                    "required": ["address"]
                }
            }

    }
]

@app.route('/chat', methods=['POST'])
def chat():
    print(request.get_json())
    body = request.get_json()
    web_messages = body.get("message", [])
    print(web_messages)
    messages = [{"role": "user", "content": web_messages}]
    message = send_messages(messages)
    messages.append(message)

    tool = message.tool_calls[0]
    print(tool)
    data = json.loads(tool.function.arguments)
    if(tool.function.name=="location"):
        url = f"https://restapi.amap.com/v3/geocode/geo?Key={GAODE_Key}&address={data["address"]}"
        print(tool.function.name)
        print(data)
        # headers = {'Content-Type': 'application/json'}
        resp = requests.post(url, json=data)
        resp.raise_for_status()  # 检查响应状态码，如果不是 200 会抛出异常
        messages.append({"role": "tool", "tool_call_id": tool.id, "content": resp.text})
        message = send_messages(messages)
        messages.append(message)
        print(message.content)
        tool = message.tool_calls[0]
        print(tool)
        data = json.loads(tool.function.arguments)
    if(tool.function.name=="start"):
        url = f"http://localhost:5016/tool/{tool.function.name}"
        print(tool.function.name)
        print(data)
        # headers = {'Content-Type': 'application/json'}
        resp = requests.post(url, json=data)
        resp.raise_for_status()  # 检查响应状态码，如果不是 200 会抛出异常
        messages.append({"role": "tool", "tool_call_id": tool.id, "content": resp.text})
        message = send_messages(messages)
        print(message.content)
        return {"response": message.content}


def main(last_msg):
    messages = [{"role": "user", "content": last_msg}]
    message = send_messages(messages)
    messages.append(message)

    tool = message.tool_calls[0]
    print(tool)
    data = json.loads(tool.function.arguments)

    url = f"http://localhost:5016/tool/{tool.function.name}"
    print(tool.function.name)
    print(data)
   # headers = {'Content-Type': 'application/json'}
    resp = requests.post(url, json=data)
    resp.raise_for_status()  # 检查响应状态码，如果不是 200 会抛出异常
    messages.append({"role": "tool", "tool_call_id": tool.id, "content": resp.text})
    message = send_messages(messages)
    print(message.content)


@app.route('/upload_audio', methods=['POST'])
def upload_audio():
    if 'audio_file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
        # 确保 uploads 目录存在
    file = request.files['audio_file']
    upload_dir = './uploads'
    os.makedirs(upload_dir, exist_ok=True)
    filepath = os.path.join(upload_dir, file.filename)
    file.save(filepath)
    result = model.transcribe(filepath,language="zh")
    text = result['text']
    simplified_text = cc.convert(result['text'])
    print(simplified_text)
    simplified_text=simplified_text.replace("案号","暗号")
    simplified_text=simplified_text.replace("签道","签到")
    simplified_text=simplified_text.replace("般","班")
    return jsonify({'text': simplified_text})

if __name__ == '__main__':
     app.run(host='0.0.0.0', debug=True, port=5015)
#    main("对软件工程一班开启签到，采用暗号签到方法，暗号参数为ABC345,签到持续时间为15分钟")