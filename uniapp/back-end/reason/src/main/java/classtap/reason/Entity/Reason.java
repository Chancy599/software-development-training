package classtap.reason.Entity;

public class Reason {

    private int reason_id;
    private String sender_id;
    private String sender_name;
    private String class_id;
   // private String class_name;
    private String start_time;
    private String word;
    private String photo_path;

    public int getReason_id() {
        return reason_id;
    }

    public void setReason_id(int reason_id) {
        this.reason_id = reason_id;
    }

    public String getSender_id() {
        return sender_id;
    }

    public void setSender_id(String sender_id) {
        this.sender_id = sender_id;
    }

    public String getClass_id() {
        return class_id;
    }

    public void setClass_id(String class_id) {
        this.class_id = class_id;
    }

    public String getSender_name() {
        return sender_name;
    }

    public void setSender_name(String sender_name) {
        this.sender_name = sender_name;
    }

    public String getStart_time() {
        return start_time;
    }

    public void setStart_time(String start_time) {
        this.start_time = start_time;
    }

    public String getWord() {
        return word;
    }

    public void setWord(String word) {
        this.word = word;
    }



    public String getPhoto_path() {
        return photo_path;
    }

    public void setPhoto_graph(String photo_path) {
        this.photo_path = photo_path;
    }


}
