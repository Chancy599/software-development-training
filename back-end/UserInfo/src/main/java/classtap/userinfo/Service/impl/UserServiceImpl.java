package classtap.userinfo.Service.impl;

import classtap.userinfo.Mapper.UserMapper;
import classtap.userinfo.Pojo.users_information;
import classtap.userinfo.Service.UserService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserMapper mapper;

    public boolean register(String id, String name, String password, String gender, String contact_information){

        if(mapper.SameID(id)==0) {
            return mapper.register(id, name, password, gender, contact_information);
        }
        else return false;
    }

    public boolean login(String id, String password){
        return password.equals(mapper.getPassword(id));
    }

    @Override
    public boolean updateBelong(String id, String newBelong) {
        return mapper.updateBelong(id, newBelong);
    }

    public boolean deleteBelong(String id, String targetBelong){
        return mapper.deleteBelong(id, targetBelong);
    }

    @Override
    public boolean updateManageBelong(String id, String newBelong) {
        return mapper.updateManageBelong(id, newBelong);
    }

    @Override
    public boolean deleteManageBelong(String id, String targetBelong) {
        return mapper.deleteManageBelong(id, targetBelong);
    }

    ;


    public users_information getInfo(String id){
        String jsonString1=mapper.getBelong(id);
        List<String> stringList1=new ArrayList<>();
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            stringList1 = objectMapper.readValue(jsonString1, new TypeReference<List<String>>() {});
        } catch (Exception e) {
            System.out.println("no");
        }

        String jsonString2=mapper.getManageBelong(id);
        List<String> stringList2=new ArrayList<>();
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            stringList2 = objectMapper.readValue(jsonString2, new TypeReference<List<String>>() {});
        } catch (Exception e) {
            System.out.println("no");
        }

        return new users_information
                (mapper.getInfo(id).getId(),mapper.getInfo(id).getName(),
                        mapper.getInfo(id).getPassword(),mapper.getInfo(id).getGender()
                        ,stringList1,mapper.getInfo(id).getContact_information(),stringList2);
    };

}
