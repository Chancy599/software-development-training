package classtap.face_recognition.Controller;

import classtap.face_recognition.Service.UserService;
import classtap.face_recognition.Service.WxFile;
import classtap.face_recognition.Service.impl.UserServiceImpl;
import classtap.face_recognition.Service.impl.WxFileImpl;
import com.arcsoft.face.EngineConfiguration;
import com.arcsoft.face.FaceEngine;
import com.arcsoft.face.FaceFeature;
import com.arcsoft.face.FunctionConfiguration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;

@RestController
public class UserController {
    @Autowired
    private final UserService userService=new UserServiceImpl();
    @Autowired
    private final WxFile wxfile=new WxFileImpl();
    public static String libName;

    static {
        // 初始化库名称
        libName = "arcsoft_face";
        // 获取操作系统名称并转换为小写
        String os = System.getProperty("os.name").toLowerCase();
        if (os.contains("win")) {
            // Windows 系统加载 DLL
            libName = "C:\\IdeaProjects\\face_recognition-Linux\\src\\main\\resources\\libs\\WIN64";
        } else {
            // Linux 系统加载 SO
            libName = "/usr/src/myapp/lib/LINUX64";
        }
    }
    FaceEngine faceEngine = new FaceEngine(libName);
    EngineConfiguration engineConfiguration = new EngineConfiguration();
    FunctionConfiguration functionConfiguration = new FunctionConfiguration();

    public UserController() throws NoSuchAlgorithmException, KeyManagementException {
    }

    @RequestMapping("/compare")
    public float Compare(String fileId1, String fileId2) {
        wxfile.downloadFile(fileId1);
        wxfile.downloadFile(fileId2);
        userService
                .initialize(faceEngine, engineConfiguration, functionConfiguration);
        FaceFeature faceFeature1= userService.DoAnalyze(faceEngine,"C:\\IdeaProjects\\face_recognition-Linux\\src\\main\\resources\\photos\\"+fileId1+".jpg");
        FaceFeature faceFeature2= userService.DoAnalyze(faceEngine,"C:\\IdeaProjects\\face_recognition-Linux\\src\\main\\resources\\photos\\"+fileId2+".jpg");
        return userService.Compare(faceEngine,faceFeature1,faceFeature2);
    }


}
