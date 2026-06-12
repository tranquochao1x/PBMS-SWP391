package com.parking.pbms.config;

import com.parking.pbms.model.Account;
import com.parking.pbms.repository.AccountRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initializeAccounts(
            AccountRepository accountRepository,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {
            createAccountIfMissing(
                    accountRepository,
                    passwordEncoder,
                    "admin",
                    "admin",
                    "Quản trị hệ thống",
                    "ADMIN"
            );

            createAccountIfMissing(
                    accountRepository,
                    passwordEncoder,
                    "staff01",
                    "staff01",
                    "Nhân viên 01",
                    "STAFF"
            );

            createAccountIfMissing(
                    accountRepository,
                    passwordEncoder,
                    "staff02",
                    "staff02",
                    "Nhân viên 02",
                    "STAFF"
            );

            createAccountIfMissing(
                    accountRepository,
                    passwordEncoder,
                    "user01",
                    "user01",
                    "Nguyễn Văn An",
                    "USER"
            );

            createAccountIfMissing(
                    accountRepository,
                    passwordEncoder,
                    "user02",
                    "user02",
                    "Trần Thị Bích",
                    "USER"
            );
        };
    }

    private void createAccountIfMissing(
            AccountRepository accountRepository,
            PasswordEncoder passwordEncoder,
            String username,
            String rawPassword,
            String fullName,
            String role
    ) {
        if (accountRepository
                .existsByUsernameIgnoreCase(username)) {
            return;
        }

        Account account = Account.builder()
                .username(username)
                .fullName(fullName)
                .passwordHash(
                        passwordEncoder.encode(rawPassword)
                )
                .role(role)
                .status("ACTIVE")
                .build();

        accountRepository.save(account);
    }
}
