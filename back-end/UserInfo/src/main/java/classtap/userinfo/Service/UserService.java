package classtap.userinfo.Service;

import classtap.userinfo.Pojo.users_information;

public interface UserService {
    public boolean register(String id, String name, String password, String gender, String contact_information);
    public boolean login(String id, String password);
    public boolean updateBelong(String id, String newBelong);
    public users_information getInfo(String id);
    public boolean deleteBelong(String id, String targetBelong);
    public boolean updateManageBelong(String id, String newBelong);
    public boolean deleteManageBelong(String id, String targetBelong);
}
