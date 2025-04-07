package classtap.userinfo.users_information.Pojo;


import java.util.List;

public class UserInfo {
    public enum Gender {
        MALE, FEMALE
    }
    private String id;
    private String name;
    private Gender gender;
    private List<String> belong_information;
   // private List<String> belong_information;
    private String contact_information;
    private List<String> manage_information;
    private List<String> belongInfo_name;
    private List<String> manageInfo_name;

    public UserInfo() {
    }

    public UserInfo(String id, String name, Gender gender,
                    List<String> belong_information, String contact_information, List<String> manage_information, List<String> belongInfo_name,List<String> manageInfo_name) {
        this.id = id;
        this.name = name;
        this.gender = gender;
        this.belong_information = belong_information;
        this.contact_information = contact_information;
        this.manage_information = manage_information;
        this.belongInfo_name = belongInfo_name;
        this.manageInfo_name = manageInfo_name;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Gender getGender() {
        return gender;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }

    public List<String> getBelong_information() {
        return belong_information;
    }

    public void setBelong_information(List<String> belong_information) {
        this.belong_information = belong_information;
    }

    public String getContact_information() {
        return contact_information;
    }

    public void setContact_information(String contact_information) {
        this.contact_information = contact_information;
    }
    public List<String> getManage_information() {
        return manage_information;
    }

    public void setManage_information(List<String> manage_information) {
        this.manage_information = manage_information;
    }

    public List<String> getbelongInfo_name() {
        return belongInfo_name;
    }

    public void setbelongInfo_name(List<String> belongInfo_name) {
        this.belongInfo_name = belongInfo_name;
    }

    public List<String> getmanageInfo_name() {
        return manageInfo_name;
    }

    public void setmanageInfo_name(List<String> manageInfo_name) {
        this.manageInfo_name = manageInfo_name;
    }

    @Override
    public String toString() {
        return "users_information{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", gender=" + gender +
                ", belong_information=" + belong_information +
                ", contact_information=" + contact_information +
                ", manage_information='" + manage_information + '\'' +
                ", belongInfo_name='" + belongInfo_name + '\'' +
                ", manageInfo_name='" + manageInfo_name + '\'' +
                '}';
    }

}
