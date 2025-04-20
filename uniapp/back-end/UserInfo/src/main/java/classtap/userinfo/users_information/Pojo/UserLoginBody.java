package classtap.userinfo.users_information.Pojo;

import java.util.List;

public class UserLoginBody {
    public enum Gender {
        MALE, FEMALE
    }
    private String id;
    private String password;

    public UserLoginBody(String id,String password) {
        this.id = id;
        this.password = password;
    }

    public String getId() {
        return id;
    }


    public String getPassword() {
        return password;
    }

    @Override
    public String toString() {
        return "users_information{" +
                "id=" + id +
                ", exp=" + password +
                '}';
    }
}
