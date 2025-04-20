package classtap.face_recognition.Pojo;

import java.sql.Timestamp;

public class CheckinRecord {
    private String record_id;
    private String userId;
    private String classId;
    private Timestamp start_time;
    private String state;
    private String checkinCode;
    private long valid_duration;
    private Timestamp actualTime;

    // 定义 State 枚举
    public enum State {
        IN_TIME,
        LATE
    }

    // Getters and Setters
    public String getId() {
        return record_id;
    }

    public void setId(String id) {
        this.record_id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getClassId() {
        return classId;
    }

    public void setClassId(String classId) {
        this.classId = classId;
    }

    public Timestamp getStartTime() {
        return start_time;
    }

    public void setStartTime(Timestamp startTime) {
        this.start_time = startTime;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getCheckinCode() {
        return checkinCode;
    }

    public void setCheckinCode(String checkinCode) {
        this.checkinCode = checkinCode;
    }

    public long getValidDuration() {
        return valid_duration;
    }

    public void setValidDuration(long validDuration) {
        this.valid_duration = validDuration;
    }

    public Timestamp getActualTime() {
        return actualTime;
    }

    public void setActualTime(Timestamp actualTime) {
        this.actualTime = actualTime;
    }
}