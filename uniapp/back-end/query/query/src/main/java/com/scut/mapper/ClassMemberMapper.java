// ClassMemberMapper.java
package com.scut.mapper;

import com.scut.entities.CMQ_Detail;
import com.scut.entities.ClassMemberQuery;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface ClassMemberMapper {
    // 验证班级存在
    @Select("SELECT class_id FROM check_in_list.class_info WHERE class_id = #{classId} LIMIT 1")
    String getClassById(@Param("classId") String classId);

    // 查询已存在成员
    @Select({
            "<script>",
            "SELECT user_id FROM check_in_list.class_member",
            "WHERE class_id = #{classId}",
            "<if test='studentIds != null and studentIds.size() > 0'>",
            "  AND user_id IN",
            "  <foreach item='id' collection='studentIds' open='(' separator=',' close=')'>",
            "    #{id}",
            "  </foreach>",
            "</if>",
            "<if test='studentIds == null or studentIds.size() == 0'>",
            "  AND 1=0", // 空集合时返回空结果
            "</if>",
            "</script>"
    })
    List<String> getExistingMembers(
            @Param("classId") String classId,
            @Param("studentIds") List<String> studentIds
    );

    @Select({
            "<script>",
            "SELECT id FROM users_information.users_information",
            "WHERE id IN",
            "<foreach item='id' collection='userIds' open='(' separator=',' close=')'>",
            "   #{id}",
            "</foreach>",
            "</script>"
    })
    List<String> checkUsersExist(@Param("userIds") List<String> userIds);

    // 批量插入
    @Insert({
            "<script>",
            "INSERT INTO check_in_list.class_member (class_id, user_id, role)",
            "VALUES ",
            "<foreach item='studentId' collection='studentIds' separator=','>",
            "(#{classId}, #{studentId}, 'MEMBER')",
            "</foreach>",
            "</script>"
    })
    void batchInsert(
            @Param("classId") String classId,
            @Param("studentIds") List<String> studentIds
    );

    @Select({
            "<script>",
            "SELECT user_id FROM check_in_list.class_member",
            "WHERE class_id = #{classId}",
            "AND role = 'MEMBER'",
            "<if test='studentIds != null and studentIds.size() > 0'>", // 增加空集合判断
            "  AND user_id IN",
            "  <foreach item='id' collection='studentIds' open='(' separator=',' close=')'>",
            "    #{id}",
            "  </foreach>",
            "</if>",
            "<if test='studentIds == null or studentIds.size() == 0'>", // 空集合时添加永假条件
            "  AND 1=0",
            "</if>",
            "</script>"
    })
    List<String> getDeletableStudents(
            @Param("classId") String classId,
            @Param("studentIds") List<String> studentIds
    );

    @Update({
            "<script>",
            "UPDATE users_information.users_information",
            "SET belong_information = JSON_ARRAY_APPEND(",
            "   COALESCE(belong_information, '[]'), ",
            "   '$', ",
            "   #{classId}",
            ") ",
            "WHERE id = #{userId}",
            "AND NOT JSON_CONTAINS(COALESCE(belong_information, '[]'), #{classId}, '$')",
            "</script>"
    })
    int addClassToUserBelong(@Param("userId") String userId,
                             @Param("classId") String classId);

    @Select({
            "<script>",
            "SELECT user_id FROM check_in_list.class_member",
            "WHERE class_id = #{classId}",
            "AND user_id IN",
            "<foreach item='id' collection='studentIds' open='(' separator=',' close=')'>",
            "   CAST(#{id} AS CHAR)", // 确保类型匹配
            "</foreach>",
            "</script>"
    })
    List<String> getExistingMembersWithTypeCheck(
            @Param("classId") String classId,
            @Param("studentIds") List<String> studentIds
    );

    @Insert({
            "<script>",
            "INSERT IGNORE INTO check_in_list.class_member",
            "(class_id, user_id, role)",
            "VALUES",
            "<foreach item='id' collection='studentIds' separator=','>",
            "(#{classId}, CAST(#{id} AS CHAR), 'MEMBER')", // 双重类型保证
            "</foreach>",
            "</script>"
    })
    void safeBatchInsert(
            @Param("classId") String classId,
            @Param("studentIds") List<String> studentIds
    );

    // 批量删除成员
    @Delete({
            "<script>",
            "DELETE FROM check_in_list.class_member",
            "WHERE class_id = #{classId}",
            "AND user_id IN",
            "<foreach item='id' collection='studentIds' open='(' separator=',' close=')'>",
            "#{id}",
            "</foreach>",
            "</script>"
    })
    void batchDeleteMembers(
            @Param("classId") String classId,
            @Param("studentIds") List<String> studentIds
    );

    // 删除签到记录
    @Delete({
            "<script>",
            "DELETE FROM check_in_record.check_in_record",
            "WHERE class_id = #{classId}",
            "AND user_id IN", // 修改字段名
            "<foreach item='id' collection='studentIds' open='(' separator=',' close=')'>",
            "#{id}",
            "</foreach>",
            "</script>"
    })
    void deleteCheckinRecords(
            @Param("classId") String classId,
            @Param("studentIds") List<String> studentIds
    );


    // 查询任意角色的存在成员
    @Select({
            "<script>",
            "SELECT user_id FROM check_in_list.class_member",
            "WHERE class_id = #{classId} AND user_id IN",
            "<foreach item='id' collection='studentIds' open='(' separator=',' close=')'>",
            "#{id}",
            "</foreach>",
            "</script>"
    })
    List<String> getExistingMembersAnyRole(
            @Param("classId") String classId,
            @Param("studentIds") List<String> studentIds
    );

    @Select("SELECT id FROM users_information.users_information WHERE id = #{userId}")
    String checkUserExists(@Param("userId") String userId);

    @Select("SELECT u.id, u.name " +
            "FROM check_in_list.class_member cm " +
            "JOIN users_information.users_information u ON cm.user_id = u.id " +
            "WHERE cm.class_id = #{classId} AND cm.role = 'MEMBER'")
    List<ClassMemberQuery> getClassStudentsBrief(String classId);

    @Select("SELECT u.id, u.name, u.gender, u.contact_information " +
            "FROM check_in_list.class_member cm " +
            "JOIN users_information.users_information u ON cm.user_id = u.id " +
            "WHERE cm.class_id = #{classId} AND cm.user_id = #{userId} AND cm.role = 'MEMBER'")
    CMQ_Detail getStudentDetail(@Param("classId") String classId,
                                @Param("userId") String userId);

    @Delete("DELETE FROM check_in_record.check_in_record WHERE class_id = #{classId}")
    int deleteAllCheckinRecords(String classId);  // ① 先删记录

    @Delete("DELETE FROM check_in_list.class_member WHERE class_id = #{classId}")
    int deleteAllClassMembers(String classId);    // ② 再删成员

    @Delete("DELETE FROM check_in_list.class_info WHERE class_id = #{classId}")
    int deleteClassInfo(String classId);          // ③ 最后删班级

    @Select("SELECT user_id FROM check_in_list.class_member WHERE class_id = #{classId} AND role = 'MEMBER'")
    List<String> selectAllClassMemberIds(String classId);

    @Select("SELECT COUNT(1) FROM check_in_list.class_info WHERE class_id = #{classId}")
    int countClassById(@Param("classId") String classId);

}