package classtap.face_recognition.Service;

import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;

public interface WxFile {
    ResponseEntity<Resource> downloadFile(String fileId);
}
