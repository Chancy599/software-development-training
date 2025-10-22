import json
import requests
import qrcode
from datetime import datetime
from io import BytesIO
from flask import Flask, request, jsonify
import urllib3

# 禁用不安全请求警告
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

app = Flask(__name__)

# 微信小程序配置
APP_ID = ""  # 你的 AppID
APP_SECRET = ""  # 你的 AppSecret
ENV_ID = ""  # 你的微信云托管环境 ID

def get_access_token():
    """获取微信小程序的 access_token"""
    url = f"https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid={APP_ID}&secret={APP_SECRET}"
    response = requests.get(url, verify=False)
    result = response.json()
    if "access_token" in result:
        return result["access_token"]
    else:
        raise Exception(f"获取 access_token 失败: {result}")

def get_upload_url(access_token, file_path):
    """获取上传文件的 URL"""
    url = f"https://api.weixin.qq.com/tcb/uploadfile?access_token={access_token}"
    payload = {
        "env": ENV_ID,
        "path": file_path
    }
    response = requests.post(url, json=payload, verify=False)
    result = response.json()
    if "url" in result:
        return result
    else:
        raise Exception(f"获取上传 URL 失败: {result}")

def upload_file(upload_info, file_data):
    """上传文件到微信云托管对象存储"""
    files = {
        "key": (None, upload_info["file_id"]),
        "Signature": (None, upload_info["authorization"]),
        "x-cos-security-token": (None, upload_info["token"]),
        "x-cos-meta-fileid": (None, upload_info["cos_file_id"]),
        "file": ("qrcode.png", file_data)
    }
    response = requests.post(upload_info["url"], files=files, verify=False)
    if response.status_code == 204:
        return upload_info["file_id"]
    else:
        raise Exception(f"上传文件失败: {response.text}")

def generate_qrcode_and_upload(class_id, start_time):
    """生成二维码并上传到微信云托管对象存储"""
    try:
        start_time_obj = datetime.strptime(start_time, "%Y-%m-%d %H:%M:%S")
    except ValueError:
        raise Exception("传入的 start_time 格式不正确，请使用 'YYYY-MM-DD HH:MM:SS' 格式")

    file_name = f"QRCode/{class_id}/{start_time_obj.strftime('%Y%m%d%H%M%S')}.png"

    qr_data = {
        "class_id": class_id,
        "start_time": start_time
    }

    qr_content = json.dumps(qr_data, ensure_ascii=False)

    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=10,
        border=4
    )
    qr.add_data(qr_content)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")

    img_byte_array = BytesIO()
    img.save(img_byte_array, format='PNG')
    img_byte_array.seek(0)

    try:
        access_token = get_access_token()
        upload_info = get_upload_url(access_token, file_name)
        file_id = upload_file(upload_info, img_byte_array)

        return file_id
    except Exception as e:
        return str(e), None

@app.route("/generate_qrcode", methods=["POST"])
def generate_qrcode():
    """处理前端请求，生成并上传二维码"""
    try:
        req_data = request.get_json()
        class_id = req_data.get("class_id", "null")
        start_time = req_data.get("start_time")

        file_id = generate_qrcode_and_upload(class_id, start_time)

        # 调整 file_id 格式
        prefix = "cloud://prod-7glwxii4e6eb93d8.7072-prod-7glwxii4e6eb93d8-1349374885"
        adjusted_file_id = f"{prefix}/cloud:/{file_id.split('cloud://')[1]}"

        return jsonify({
            "message": "二维码生成并上传成功",
            "file_id": adjusted_file_id
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True, port=5007)
