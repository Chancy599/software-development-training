package classtap.face_recognition.Service;

import com.arcsoft.face.EngineConfiguration;
import com.arcsoft.face.FaceEngine;
import com.arcsoft.face.FaceFeature;
import com.arcsoft.face.FunctionConfiguration;


public interface UserService {

    void initialize(FaceEngine faceEngine, EngineConfiguration engineConfiguration,
                    FunctionConfiguration functionConfiguration);
    FaceFeature DoAnalyze(FaceEngine faceEngine,String path);
    float Compare(FaceEngine faceEngine,FaceFeature f1, FaceFeature f2);

}
