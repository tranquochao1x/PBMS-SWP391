package com.parking.pbms.service.impl;

import com.parking.pbms.model.Account;
import com.parking.pbms.repository.AccountRepository;
import com.parking.pbms.service.LogoutService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class LogoutServiceImpl implements LogoutService {

    private final AccountRepository accountRepository;

    @Override
    public void logout(String username) {
        // Logout logic: Since using JWT tokens, client-side token deletion is enough
        // This is just a placeholder for future audit/tracking if needed
        Account account = accountRepository.findByUsernameIgnoreCase(username)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tài khoản: " + username));
        
        // Can add LastLogoutAt tracking here if needed in the future
        // account.setLastLogoutAt(LocalDateTime.now());
        // accountRepository.save(account);
    }
}
