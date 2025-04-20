package classtap.reason.Service;

import classtap.reason.Entity.Reason;
import classtap.reason.Mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    @Autowired
    UserMapper userMapper;
    public boolean AddReason(Reason reason){
        return userMapper.AddReason(reason);
    }

    public List<Reason> GetReason(String class_id){



        List<Reason> temp=userMapper.GetReason(class_id);

        for(Reason t : temp){
            String name=userMapper.GetName(t.getSender_id());
            t.setSender_name(name);
        }
        return temp;
    }

    public boolean DeleteReason(int reason_id){

        return userMapper.DeleteReason(reason_id);
    }
}
