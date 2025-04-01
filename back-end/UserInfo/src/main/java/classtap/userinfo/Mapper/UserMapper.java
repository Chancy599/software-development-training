package classtap.userinfo.Mapper;

import classtap.userinfo.Pojo.users_information;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;


@Mapper
public interface UserMapper {
    @Insert("INSERT INTO users_information VALUES (#{id},#{name},#{password},#{gender},NULL,#{contact_information})")
    public boolean register(String id, String name, String password, String gender, String contact_information);


    @Select("select password from users_information where id=#{id}")
    public String getPassword(String id);

    @Select("select count(*) from users_information where id=#{id}")
    public int SameID(String id);

    @Update("UPDATE users_information " +
            "SET belong_information = CASE " +
            "WHEN belong_information IS NULL THEN JSON_ARRAY(#{newBelong}) " +
            "ELSE JSON_ARRAY_APPEND(belong_information, '$', #{newBelong}) " +
            "END " +
            "WHERE id = #{id}")
    public boolean updateBelong(String id,String newBelong);

    @Update("UPDATE users_information " +
            "SET belong_information = JSON_REMOVE(" +
            "    belong_information, " +
            "    JSON_UNQUOTE(JSON_SEARCH(belong_information, 'one', #{targetBelong}))" +
            ") " +
            "WHERE id = #{id} AND JSON_SEARCH(belong_information, 'one', #{targetBelong}) IS NOT NULL")
    public boolean deleteBelong(String id, String targetBelong);

    @Select("Select * from users_information where id=#{id}")
    public users_information getInfo(String id);


    @Update("UPDATE users_information " +
            "SET manage_information = CASE " +
            "WHEN manage_information IS NULL THEN JSON_ARRAY(#{newBelong}) " +
            "ELSE JSON_ARRAY_APPEND(manage_information, '$', #{newBelong}) " +
            "END " +
            "WHERE id = #{id}")
    public boolean updateManageBelong(String id,String newBelong);

    @Update("UPDATE users_information " +
            "SET manage_information = JSON_REMOVE(" +
            "    manage_information, " +
            "    JSON_UNQUOTE(JSON_SEARCH(manage_information, 'one', #{targetBelong}))" +
            ") " +
            "WHERE id = #{id} AND JSON_SEARCH(manage_information, 'one', #{targetBelong}) IS NOT NULL")
    public boolean deleteManageBelong(String id, String targetBelong);




    @Select("Select belong_information from users_information where id=#{id}")
    public String getBelong(String id);

    @Select("Select manage_information from users_information where id=#{id}")
    public String getManageBelong(String id);

}
