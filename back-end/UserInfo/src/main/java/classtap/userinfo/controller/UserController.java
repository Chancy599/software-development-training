package classtap.userinfo.controller;

import classtap.userinfo.Pojo.UserLoginBody;
import classtap.userinfo.Pojo.UserRegisterBody;
import classtap.userinfo.Pojo.users_information;
import classtap.userinfo.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
public class UserController {

    @Autowired
    private UserService userservice;

    @PostMapping("/register")
    public boolean Register(@RequestBody UserRegisterBody request){
        return userservice.register(request.getId(), request.getName(),request.getPassword(),request.getGender(),request.getContact_information());
    }

    @PostMapping("/login")
    public boolean login(@RequestBody UserLoginBody request){
        return userservice.login(request.getId(), request.getPassword());
    }

    @PutMapping("/updateBelong")
    public boolean updateBelong(String id, String newBelong) {
        return userservice.updateBelong(id, newBelong);
    }

    @DeleteMapping("/deleteBelong")
    public boolean deleteBelong(String id, String targetBelong){
        return userservice.deleteBelong(id, targetBelong);
    };


    @PutMapping("/updateManageBelong")
    public boolean updateManageBelong(String id, String newBelong) {
        return userservice.updateManageBelong(id, newBelong);
    }

    @DeleteMapping("/deleteManageBelong")
    public boolean deleteManageBelong(String id, String targetBelong){
        return userservice.deleteManageBelong(id, targetBelong);
    };


    @RequestMapping("/getInfo")
    public users_information getInfo(String id){
        return userservice.getInfo(id);
    };
}
