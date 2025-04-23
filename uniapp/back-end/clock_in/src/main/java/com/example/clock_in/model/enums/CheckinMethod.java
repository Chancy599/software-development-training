// 文件路径: src/main/java/com/example/clock_in/model/enums/CheckinMethod.java
package com.example.clock_in.model.enums;

public enum CheckinMethod {
    CIPHER,      // 密码签到
    QRCODE,      // 二维码签到
    GPS,         // GPS定位签到
    FACE_SCAN    // 人脸识别签到
}