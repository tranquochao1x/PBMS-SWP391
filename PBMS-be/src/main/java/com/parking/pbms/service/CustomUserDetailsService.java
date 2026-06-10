package com.parking.pbms.service;

import com.parking.pbms.model.Account;
import com.parking.pbms.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Locale;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final AccountRepository accountRepository;

    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {

        Account account = accountRepository
                .findByUsernameIgnoreCase(username)
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "Không tìm thấy tài khoản: " + username
                        )
                );

        boolean active = "ACTIVE".equalsIgnoreCase(account.getStatus());
        String roleName = account.getRoleName();

        return User.withUsername(account.getUsername())
                .password(account.getPasswordHash())
                .authorities(
                        "ROLE_" + (roleName != null ? roleName.toUpperCase(Locale.ROOT) : "USER")
                )
                .disabled(!active)
                .build();
    }
}
