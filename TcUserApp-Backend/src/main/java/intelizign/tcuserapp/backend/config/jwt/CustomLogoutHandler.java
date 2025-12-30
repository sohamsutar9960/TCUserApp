package intelizign.tcuserapp.backend.config.jwt;

import intelizign.tcuserapp.backend.model.Token;
import intelizign.tcuserapp.backend.repository.admin.TokenRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.stereotype.Component;

@Component
public class CustomLogoutHandler implements LogoutHandler {

    @Autowired
    TokenRepository tokenRepository;

    @Override
    public void logout(HttpServletRequest request,
                       HttpServletResponse response,
                       Authentication authentication) {

        final String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer "))
            return;

        String token = authorizationHeader.substring(7);

        Token tokenInDB = tokenRepository.findByToken(token).orElse(null);
        if (tokenInDB != null) {
            tokenInDB.setLoggedOut(true);
            tokenRepository.save(tokenInDB);
        }
    }
}
