package classtap.reason.Controller;

import classtap.reason.Entity.Reason;
import classtap.reason.Service.UserService;
import org.apache.ibatis.annotations.Delete;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class UserController {
    @Autowired
    UserService userService;

    @PutMapping("/AddReason")
    boolean AddReason(@RequestBody Reason reason){
        return userService.AddReason(reason);
    }

    @GetMapping("/GetReason")
    List<Reason> GetReason(String class_id){
        return userService.GetReason(class_id);
    }

    @DeleteMapping("/DeleteReason")
    boolean DeleteReason(int reason_id){
        return userService.DeleteReason(reason_id);
    }
}
