package classtap.userinfo.users_information.Pojo;

import java.util.List;

public class UserRegisterBody {
    public enum Gender {
        MALE, FEMALE
    }
    private String id;
    private String name;
    private String password;
    private String gender;
    private List<String> belong_information;
    // private List<String> belong_information;
    private String contact_information;

    public UserRegisterBody(String id, String name, String password, String gender,
                             String contact_information) {
        this.id = id;
        this.name = name;
        this.password = password;
        this.gender = gender;
        this.contact_information = contact_information;
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

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getContact_information() {
        return contact_information;
    }

    public void setContact_information(String contact_information) {
        this.contact_information = contact_information;
    }

    @Override
    public String toString() {
        return "users_information{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", exp=" + password +
                ", gender=" + gender +
                ", contact_information='" + contact_information + '\'' +
                '}';
    }
}
