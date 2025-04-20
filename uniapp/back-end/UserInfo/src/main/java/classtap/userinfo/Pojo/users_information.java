package classtap.userinfo.Pojo;


import java.util.List;

public class users_information {
    public enum Gender {
        MALE, FEMALE
    }
    private String id;
    private String name;
    private String password;
    private Gender gender;
    private List<String> belong_information;
   // private List<String> belong_information;
    private String contact_information;
    private List<String> manage_information;

    public users_information() {
    }

    public users_information(String id, String name, String password,Gender gender,
                             List<String> belong_information,String contact_information,List<String> manage_information) {
        this.id = id;
        this.name = name;
        this.password = password;
        this.gender = gender;
        this.belong_information = belong_information;
        this.contact_information = contact_information;
        this.manage_information = manage_information;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Gender getGender() {
        return gender;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }

    public List<String> getBelong_information() {
        return belong_information;
    }

    public void setBelong_information(List<String> belong_information) {
        this.belong_information = belong_information;
    }

    public String getContact_information() {
        return contact_information;
    }

    public void setContact_information(String contact_information) {
        this.contact_information = contact_information;
    }
    public List<String> getManage_information() {
        return manage_information;
    }

    public void setManage_information(List<String> belong_information) {
        this.manage_information = manage_information;
    }

    @Override
    public String toString() {
        return "users_information{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", exp=" + password +
                ", gender=" + gender +
                ", belong_information=" + belong_information +
                ", contact_information=" + contact_information +
                ", manage_information='" + manage_information + '\'' +
                '}';
    }

}
