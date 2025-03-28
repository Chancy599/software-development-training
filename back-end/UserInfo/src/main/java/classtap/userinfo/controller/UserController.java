package classtap.userinfo.controller;

import classtap.userinfo.Pojo.users_information;
import classtap.userinfo.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {

    @Autowired
    private UserService userservice;

    @RequestMapping("/register")
    public boolean Register(String id, String name, String password, String gender, String contact_information){
        return userservice.register(id,name,password,gender,contact_information);
    }

    @RequestMapping("/login")
    public boolean login(String id, String password){
        return userservice.login(id, password);
    }

    @RequestMapping("/updateBelong")
    public boolean updateBelong(String id, String newBelong) {
        return userservice.updateBelong(id, newBelong);
    }

    @RequestMapping("/getInfo")
    public users_information getInfo(String id){
        return userservice.getInfo(id);
    };
}
