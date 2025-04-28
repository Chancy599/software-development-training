package com.example.clock_in.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;
import java.util.Map;

@Configuration
@EnableTransactionManagement // 启用事务管理
@EnableJpaRepositories(
        basePackages = "com.example.clock_in.repository.record",
        entityManagerFactoryRef = "recordEntityManagerFactory",
        transactionManagerRef = "recordTransactionManager" // 指定事务管理器名称
)
public class RecordDataSourceConfig {

    @Bean(name = "recordDataSource")
    @ConfigurationProperties(prefix = "spring.datasource.record")
    public DataSource dataSource() {
        return DataSourceBuilder.create().build();
    }

    @Bean(name = "recordEntityManagerFactory")
    public LocalContainerEntityManagerFactoryBean entityManagerFactory(
            EntityManagerFactoryBuilder builder) {
        return builder
                .dataSource(dataSource())
                .packages("com.example.clock_in.entity.record")
                .persistenceUnit("record")
                // 添加方言配置（关键）
                .properties(Map.of(
                        "hibernate.dialect", "org.hibernate.spatial.dialect.mysql.MySQLSpatialDialect", // 移除版本号
                        "hibernate.jdbc.time_zone", "Asia/Shanghai"
                ))
                .build();
    }

    // 新增事务管理器
    @Bean(name = "recordTransactionManager")
    public PlatformTransactionManager recordTransactionManager(
            @Qualifier("recordEntityManagerFactory") LocalContainerEntityManagerFactoryBean recordEntityManagerFactory) {
        return new JpaTransactionManager(recordEntityManagerFactory.getObject());
    }
}