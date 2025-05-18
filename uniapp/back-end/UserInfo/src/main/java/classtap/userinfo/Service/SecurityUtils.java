package classtap.userinfo.Service;

import org.apache.commons.codec.binary.Hex;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.util.Base64;

public class SecurityUtils {
    /**
     * Decrypt data using RSA private key
     */
    public static String rsaDecrypt(String base64Encrypted, PrivateKey privateKey) throws Exception {
        if (base64Encrypted == null || base64Encrypted.isEmpty()) {
            throw new IllegalArgumentException("Encrypted string is empty");
        }
        if (privateKey == null) {
            throw new IllegalArgumentException("Private key is empty");
        }

        try {
            Cipher cipher = Cipher.getInstance("RSA/ECB/PKCS1Padding"); // Specify proper padding mode
            cipher.init(Cipher.DECRYPT_MODE, privateKey);

            // Handle potential padding in base64 string
            byte[] encryptedBytes = Base64.getDecoder().decode(base64Encrypted.trim());
            byte[] decryptedBytes = cipher.doFinal(encryptedBytes);
            return new String(decryptedBytes, StandardCharsets.UTF_8);
        } catch (Exception e) {
            throw new Exception("RSA decryption failed: " + e.getMessage(), e);
        }
    }

    /**
     * Decrypt data using AES key and IV
     */
    public static String aesDecrypt(String base64Encrypted, String hexKey, String hexIv) throws Exception {
        if (base64Encrypted == null || hexKey == null || hexIv == null) {
            throw new IllegalArgumentException("Required parameters missing");
        }

        try {
            byte[] key = Hex.decodeHex(hexKey.toCharArray());
            byte[] iv = Hex.decodeHex(hexIv.toCharArray());
            byte[] encrypted = Base64.getDecoder().decode(base64Encrypted.trim());

            Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
            SecretKeySpec keySpec = new SecretKeySpec(key, "AES");
            IvParameterSpec ivSpec = new IvParameterSpec(iv);
            cipher.init(Cipher.DECRYPT_MODE, keySpec, ivSpec);

            byte[] result = cipher.doFinal(encrypted);
            return new String(result, StandardCharsets.UTF_8);
        } catch (Exception e) {
            throw new Exception("AES decryption failed: " + e.getMessage(), e);
        }
    }

    /**
     * Load RSA private key from PEM format
     */
    public static PrivateKey loadPrivateKey(String base64Pem) throws Exception {
        try {
            String privateKeyPEM = base64Pem
                    .replace("-----BEGIN PRIVATE KEY-----", "")
                    .replace("-----END PRIVATE KEY-----", "")
                    .replace("-----BEGIN RSA PRIVATE KEY-----", "")
                    .replace("-----END RSA PRIVATE KEY-----", "")
                    .replaceAll("\\s", "");

            byte[] encoded = Base64.getDecoder().decode(privateKeyPEM);
            PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(encoded);
            KeyFactory kf = KeyFactory.getInstance("RSA");
            return kf.generatePrivate(keySpec);
        } catch (Exception e) {
            throw new Exception("Failed to load private key: " + e.getMessage(), e);
        }
    }
}
