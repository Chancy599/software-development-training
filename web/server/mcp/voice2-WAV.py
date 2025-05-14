import speech_recognition as sr
import os
from flask import request, jsonify, Flask
from flask_cors import CORS
from pydub import AudioSegment

app = Flask(__name__)
CORS(app)


@app.route('/upload_audio', methods=['POST'])
def upload_audio():
    if 'audio_file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['audio_file']
    upload_dir = './uploads'
    os.makedirs(upload_dir, exist_ok=True)

    # 保存原始文件（假设是 WebM 格式）
    webm_filepath = os.path.join(upload_dir, 'recording.webm')
    file.save(webm_filepath)
    print(123312)
    # 转换为 WAV 格式
    wav_filepath = os.path.join(upload_dir, 'recording.wav')
    try:
        audio = AudioSegment.from_file(webm_filepath, format='webm')
        audio.export(wav_filepath, format='wav')
    except Exception as e:
        # 清理文件并返回错误
        if os.path.exists(webm_filepath):
            os.remove(webm_filepath)
        return jsonify({'error': f'Failed to convert audio to WAV: {e}'}), 500
    print(1233133332)
    # 初始化语音识别
    recognizer = sr.Recognizer()

    try:
        # 加载 WAV 文件
        with sr.AudioFile(wav_filepath) as source:
            audio = recognizer.record(source)
        print(12666663312)
        # 使用 Google Speech Recognition 识别简体中文
        text = recognizer.recognize_google(audio, language='zh-CN')
        print(123399999999912)
        # 替换特定词汇
        text = text.replace("案号", "暗号")
        text = text.replace("签道", "签到")
        text = text.replace("三道", "签到")
        text = text.replace("般", "班")

        print(jsonify({'text': text}))
        return jsonify({'text': text})

    except sr.UnknownValueError:
        return jsonify({'error': 'Could not understand the audio'}), 400
    except sr.RequestError as e:
        return jsonify({'error': f'Could not request results; {e}'}), 500
    finally:
        # 清理临时文件
        if os.path.exists(webm_filepath):
            os.remove(webm_filepath)
        if os.path.exists(wav_filepath):
            os.remove(wav_filepath)


if __name__ == '__main__':
    app.run(host='0.0.0.0',debug=True, port=5014)