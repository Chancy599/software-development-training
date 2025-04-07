package classtap.userinfo.check_in_list.Mapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;


@Mapper
public interface UserMapper2 {
    @Select("Select class_name from class_info where class_id=#{class_id}")
    public String getBelong(String class_id);

    @Select("Select class_name from class_info where class_id=#{class_id}")
    public String getManageBelong(String class_id);
}
