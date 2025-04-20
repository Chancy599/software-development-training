# 使用基础的Java镜像
FROM openjdk:21

# 将构建好的Spring Boot JAR文件复制到容器中
COPY target/demo0328-0.0.1-SNAPSHOT.jar /usr/src/myapp/app.jar

# 设置工作目录
WORKDIR /usr/src/myapp

# 暴露 Spring Boot 应用程序的端口
EXPOSE 5004

# 运行 Spring Boot 应用程序
CMD ["java", "-jar", "app.jar"]