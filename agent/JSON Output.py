import json
from openai import OpenAI

client = OpenAI(
    api_key="sk-aa7f01e252d443b09f63a0518c0dbc7f",
    base_url="https://api.deepseek.com",
)

system_prompt = """
The user will provide some exam text. Please parse the "question" and "answer" and output them in JSON format. 

EXAMPLE INPUT: 
Which is the highest mountain in the world? Mount Everest.

EXAMPLE JSON OUTPUT:
{
    "className": "班级名称",
    "method": "签到方式（GPS、QRCODE、CIPHER、FACE四选一）",
    "validTime": "有效时长，单位是分钟"
}
"""

user_prompt = "我想在软件工程1班发起一个有效时长为30分钟的定位签到"

messages = [{"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}]

response = client.chat.completions.create(
    model="deepseek-chat",
    messages=messages,
    response_format={
        'type': 'json_object'
    }
)

print(json.loads(response.choices[0].message.content))
