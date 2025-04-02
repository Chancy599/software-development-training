# 使用带 JDK 的精简镜像
FROM openjdk:17

# 复制 JAR 文件（避免被后续 COPY 覆盖）
COPY target/face_recognition-0.0.1-SNAPSHOT.jar /usr/src/myapp/app.jar

# 复制其他资源（不包含 target 目录）
COPY . /usr/src/myapp

# 设置工作目录
WORKDIR /usr/src/myapp
# 赋予库文件执行权限
RUN chmod +x /usr/src/myapp/lib/LINUX64/libarcsoft_face.so

# 暴露端口
EXPOSE 5002

# 修正路径并运行
CMD ["java", "-Djava.library.path=/usr/src/myapp/lib/LINUX64", "-jar", "app.jar"]