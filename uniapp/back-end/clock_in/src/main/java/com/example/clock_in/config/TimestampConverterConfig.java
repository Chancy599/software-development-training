package com.example.clock_in.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.format.FormatterRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

@Configuration
public class TimestampConverterConfig implements WebMvcConfigurer {

    // 注册自定义转换器
    @Override
    public void addFormatters(FormatterRegistry registry) {
        registry.addConverter(new StringToTimestampConverter());
    }

    // 具体转换器实现
    public static class StringToTimestampConverter
            implements Converter<String, Timestamp> {

        private final DateTimeFormatter formatter =
                DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        @Override
        public Timestamp convert(String source) {
            try {
                // 处理 URL 编码的空格（%20 或 +）
                String decodedSource = source.replace("+", " ");
                LocalDateTime localDateTime =
                        LocalDateTime.parse(decodedSource, formatter);
                return Timestamp.valueOf(localDateTime);
            } catch (DateTimeParseException e) {
                throw new IllegalArgumentException(
                        "时间格式错误，应为 yyyy-MM-dd HH:mm:ss", e
                );
            }
        }
    }
}