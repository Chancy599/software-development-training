package classtap.reason.Mapper;

import classtap.reason.Entity.Reason;
import org.apache.ibatis.annotations.*;

import java.util.List;


// 根据实际包名调整
@Mapper
public interface UserMapper {

    // 添加Reason记录
    @Insert("INSERT INTO reason (sender_id, class_id,start_time, word, photo_path) VALUES (#{sender_id}, #{class_id}, #{start_time},#{word}, #{photo_path})")
    boolean AddReason(Reason reason);

    // 根据条件删除Reason记录（这里假设根据某些合适的条件来删除，比如主键等，示例中暂简单按对象整体匹配，实际可能需要调整SQL语句）
    @Delete("DELETE FROM reason WHERE reason_id = #{reason_id}")
    boolean DeleteReason(int reason_id);

    // 根据条件获取Reason记录（同样假设根据合适条件获取，示例简单按对象整体匹配去查询，实际要优化）
    @Select("SELECT reason_id,sender_id,start_time, word, photo_path FROM reason WHERE class_id = #{class_id}")
    List<Reason> GetReason(String class_id);

    @Select("SELECT name FROM users_information.users_information WHERE id=#{sender_id}")
    String GetName(String sender_id);

    @Update("UPDATE check_in_record.check_in_record SET state = 'REQUEST_LEAVE',start_time = #{start_time} WHERE user_id = #{sender_id} AND class_id = #{class_id} AND start_time = #{start_time}")
    boolean UpdateState(Reason reason);



}
