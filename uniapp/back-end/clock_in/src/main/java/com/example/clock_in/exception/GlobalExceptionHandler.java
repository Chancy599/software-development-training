package com.example.clock_in.exception;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.time.format.DateTimeParseException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErrorResponse> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
        String errorMsg = "参数 '" + ex.getName() + "' 格式错误";
        Throwable rootCause = getRootCause(ex);
        errorMsg+=("参数 '{}' 转换失败，根本原因类型: {}"+ ex.getName()+ rootCause.getClass().getName());


        // 针对时间参数的详细解析错误
        if (ex.getName().equals("startTime") && rootCause instanceof DateTimeParseException) {
            DateTimeParseException parseEx = (DateTimeParseException) rootCause;
            errorMsg += "\n错误详情: " + parseEx.getMessage();
            errorMsg += "\n输入值: [" + parseEx.getParsedString() + "]";
            errorMsg += "\n错误位置: 第 " + parseEx.getErrorIndex() + " 个字符";
        }

        return ResponseEntity.badRequest().body(new ErrorResponse(400, "BAD_REQUEST", errorMsg));
    }

    // 获取根本原因
    private Throwable getRootCause(Throwable ex) {
        while (ex.getCause() != null && ex.getCause() != ex) {
            ex = ex.getCause();
        }
        return ex;
    }

    // 处理缺少必要参数
    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ErrorResponse> handleMissingParams(MissingServletRequestParameterException ex) {
        String errorMessage = "缺少必要参数: " + ex.getParameterName();
        return buildErrorResponse(HttpStatus.BAD_REQUEST, 400, "BAD_REQUEST", errorMessage);
    }

    // 其他原有异常处理...
    // (保留原有的 IllegalArgumentException 和 Exception 处理)

    // 统一构建错误响应
    private ResponseEntity<ErrorResponse> buildErrorResponse(
            HttpStatus status,
            int code,
            String errorType,
            String message
    ) {
        ErrorResponse error = new ErrorResponse(code, errorType, message);
        return ResponseEntity.status(status).body(error);
    }

    @Data
    @AllArgsConstructor
    public static class ErrorResponse {
        private int code;
        private String error;
        private String message;
    }
}