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

    @Select("Select * from users_information where id=#{id}")
    public users_information getInfo(String id);


    @Select("Select belong_information from users_information where id=#{id}")
    public String getBelong(String id);

}
