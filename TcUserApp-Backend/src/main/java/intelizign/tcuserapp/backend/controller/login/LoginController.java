package intelizign.tcuserapp.backend.controller.login;


import intelizign.tcuserapp.backend.config.MyUserDetails;
import intelizign.tcuserapp.backend.config.jwt.JwtTokenUtil;
import intelizign.tcuserapp.backend.dto.LoginResponse;
import intelizign.tcuserapp.backend.dto.UserResponse;
import intelizign.tcuserapp.backend.model.Token;
import intelizign.tcuserapp.backend.model.User;
import intelizign.tcuserapp.backend.repository.admin.TokenRepository;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class LoginController {

    @Autowired
    DaoAuthenticationProvider daoAuthenticationProvider;

    @Autowired
    JwtTokenUtil jwtTokenUtil;

    @Autowired
    UserDetailsService userDetailsService;

    @Autowired
    TokenRepository tokenRepository;

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    UserResponse userResponse;

    private final Logger logger = LoggerFactory.getLogger(LoginController.class);

    @PostMapping("/doLogin")
    public ResponseEntity<LoginResponse> doLogin(@RequestBody User user) {
        try {
            Authentication authentication = daoAuthenticationProvider.
                    authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));

            if (authentication.isAuthenticated()) {
                SecurityContextHolder.getContext().setAuthentication(authentication);
                Map<String, Object> claims = new HashMap<>();
                claims.put("roles", authentication.getAuthorities().toString());

                final String jwtToken = jwtTokenUtil.generateToken(claims, authentication.getName());
                final UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
                String username = jwtTokenUtil.extractUsername(jwtToken);
                Date expiration = jwtTokenUtil.extractExpiration(jwtToken);

                List<String> roles = userDetails
                        .getAuthorities()
                        .stream()
                        .map(GrantedAuthority::getAuthority)
                        .toList();

                MyUserDetails myUserDetails = (MyUserDetails) userDetails;
                modelMapper.map(myUserDetails.getUser(), userResponse);
                userResponse.setPassword(null);

                List<Token> tokens = tokenRepository.findAllTokenByUser(myUserDetails.getUser().getUserId());
                if (!tokens.isEmpty()) {
                    tokens.forEach(t -> {
                        t.setLoggedOut(true);
                    });
                }
                tokenRepository.saveAll(tokens);

                //save the token
                Token token = new Token();
                token.setToken(jwtToken);
                token.setUser(myUserDetails.getUser());
                token.setLoggedOut(false);
                tokenRepository.save(token);

                LoginResponse loginResponse = new LoginResponse(jwtToken, username, roles, expiration, userResponse);
                return ResponseEntity.ok(loginResponse);
            }
            throw new BadCredentialsException("No user found.");
        } catch (BadCredentialsException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }

    @PostMapping("/refreshToken")
    public ResponseEntity<?> refreshToken(@RequestBody String refreshToken) {
        return ResponseEntity.badRequest().body("Invalid refresh token");
    }
}
