package classtap.face_recognition.Service.impl;
import classtap.face_recognition.Service.WxFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;

import org.springframework.web.client.RestTemplate;


import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class WxFileImpl implements WxFile {

    private static final String APP_ID = "wx2492d91b878e5ccc";
    private static final String APP_SECRET = "b16713acd97853660f83d7d009034b59";
    private static final String ENV_ID = "prod-7glwxii4e6eb93d8";
    private final RestTemplate restTemplate = new RestTemplate();

    // TODO: 替换为你的微信小程序 ID 和密钥

    //    private String getAccessToken() {
//        String url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + APP_ID + "&secret=" + APP_SECRET;
//        ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
//        if (response.getBody() != null && response.getBody().containsKey("access_token")) {
//            return response.getBody().get("access_token").toString();
//        } else {
//            throw new RuntimeException("获取 access_token 失败: " + response.getBody());
//        }
//    }

    //    @GetMapping("/getDownloadUrl")
//    public String getDownloadUrl(String fileId) {
//        String accessToken = getAccessToken();
//        String url = "https://api.weixin.qq.com/tcb/batchdownloadfile?access_token=" + accessToken;
//        return "https://7072-prod-7glwxii4e6eb93d8-1349374885.tcb.qcloud.la/FaceRecognition/"+fileId+".jpg";
//    }

    // 下载文件并返回

    public ResponseEntity<Resource> downloadFile(String fileId) {
        try {
            // 1. 获取文件的下载 URL
            String downloadUrl = "https://7072-prod-7glwxii4e6eb93d8-1349374885.tcb.qcloud.la/FaceRecognition/"+fileId+".jpg";

            // 2. 向 `downloadUrl` 发送请求，获取文件数据
            ResponseEntity<byte[]> response = restTemplate.exchange(downloadUrl, HttpMethod.GET, null, byte[].class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                // 3. 将下载的文件保存到指定路径
                saveFileToLocal(response.getBody(), "C:\\IdeaProjects\\face_recognition-Linux\\src\\main\\resources\\photos\\"+fileId+".jpg");

                // 4. 返回文件内容作为响应，供客户端下载
                ByteArrayResource resource = new ByteArrayResource(response.getBody());

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
                headers.setContentDisposition(ContentDisposition.attachment().filename("downloaded_file.png").build());

                return ResponseEntity.ok()
                        .headers(headers)
                        .body(resource);
            } else {
                throw new RuntimeException("文件下载失败: " + response.getStatusCode());
            }
        } catch (Exception e) {
            // 捕获异常并处理
            throw new RuntimeException("下载文件时发生错误", e);  // 你也可以记录日志或返回更具体的错误信息
        }
    }

    private void saveFileToLocal(byte[] fileData, String destinationPath) throws IOException {
        FileOutputStream fileOutputStream = new FileOutputStream(destinationPath);
        fileOutputStream.write(fileData);
        fileOutputStream.close();
        System.out.println("文件已成功保存到：" + destinationPath);
    }
}