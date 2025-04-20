package classtap.userinfo.Service;

import classtap.userinfo.users_information.Pojo.UserInfo;
import classtap.userinfo.users_information.Pojo.users_information;

public interface UserService {
    public boolean register(String id, String name, String password, String gender, String contact_information);
    public boolean login(String id, String password);
    public boolean updateBelong(String id, String newBelong);
    public UserInfo getInfo(String id);
    public boolean deleteBelong(String id, String targetBelong);
    public boolean updateManageBelong(String id, String newBelong);
    public boolean deleteManageBelong(String id, String targetBelong);
}
