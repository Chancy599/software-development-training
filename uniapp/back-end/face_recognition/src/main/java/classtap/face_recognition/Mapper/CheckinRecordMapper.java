package classtap.face_recognition.Mapper;

import classtap.face_recognition.Pojo.CheckinRecord;
import org.apache.ibatis.annotations.*;
import java.sql.Timestamp;
import java.util.List;

@Mapper
public interface CheckinRecordMapper {

    /**
     * 根据 classId 和 userId 查询签到记录
     * @param classId 班级 ID
     * @param userId 用户 ID
     * @return 签到记录列表
     */
    @Select("SELECT * FROM check_in_record WHERE class_id = #{classId} AND user_id = #{userId}  ")
    List<CheckinRecord> findByClassIdAndUserId(@Param("classId") String classId, @Param("userId") String userId);

    /**
     * 更新签到记录的状态和实际签到时间
     * @param record_id 记录 ID
     * @param state 签到状态
     * @param start_time 开始时间
     * @param actualTime 实际签到时间
     * @return 受影响的行数
     */
    @Update("UPDATE check_in_record SET state = #{state}, start_time= #{start_time} ,actual_time = #{actualTime} WHERE record_id = #{record_id}")
    int updateRecordState(@Param("record_id") String record_id, @Param("state") String state,@Param("start_time") Timestamp start_time, @Param("actualTime") Timestamp actualTime);
}