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

@Configuration
@EnableTransactionManagement // 启用事务管理
@EnableJpaRepositories(
        basePackages = "com.example.clock_in.repository.list",  // 扫描list包
        entityManagerFactoryRef = "listEntityManagerFactory",
        transactionManagerRef = "listTransactionManager" // 指定事务管理器名称
)
public class ListDataSourceConfig {

    @Bean(name = "listDataSource")
    @ConfigurationProperties(prefix = "spring.datasource.list")
    public DataSource dataSource() {
        return DataSourceBuilder.create().build();
    }

    @Bean(name = "listEntityManagerFactory")
    public LocalContainerEntityManagerFactoryBean entityManagerFactory(
            EntityManagerFactoryBuilder builder) {
        return builder
                .dataSource(dataSource())
                .packages("com.example.clock_in.entity.list")  // 扫描list实体包（包含两个实体）
                .persistenceUnit("list")
                .build();
    }

    // 新增事务管理器
    @Bean(name = "listTransactionManager")
    public PlatformTransactionManager listTransactionManager(
            @Qualifier("listEntityManagerFactory") LocalContainerEntityManagerFactoryBean listEntityManagerFactory) {
        return new JpaTransactionManager(listEntityManagerFactory.getObject());
    }

}