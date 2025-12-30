package intelizign.tcuserapp.backend.config.jwt;


import intelizign.tcuserapp.backend.repository.admin.TokenRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtTokenUtil {

    public static final String SECRET = "5367566B59703373367639792F423F4528482B4D6251655468576D5A71347437";

    @Value("${jwt.token.validity}")
    String ACCESS_TOKEN_VALIDITY; // 2 hrs

    @Value("${jwt.token.refresh}")
    String REFRESH_TOKEN_VALIDITY;

    @Autowired
    TokenRepository tokenRepository;

    public String generateToken(Map<String, Object> claims, String userName) {
        return createToken(claims, userName, Long.parseLong(ACCESS_TOKEN_VALIDITY)); // 5 minutes expiry
    }

    public String generateRefreshToken(String username) {
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, username, Long.parseLong(REFRESH_TOKEN_VALIDITY)); // 7 days expiry
    }

    private String createToken(Map<String, Object> claims, String subject, long expirationTime) {
        return Jwts.builder().setClaims(claims).setSubject(subject).setIssuedAt(new Date(System.currentTimeMillis())).setExpiration(new Date(System.currentTimeMillis() + expirationTime)).signWith(SignatureAlgorithm.HS256, SECRET).compact();
    }

    public Boolean validateToken(String token, String username) {
        final String extractedUsername = extractUsername(token);

        boolean isValidToken = tokenRepository.findByToken(token)
                .map(t -> !t.getLoggedOut())
                .orElse(false);

        return (extractedUsername.equals(username) && !isTokenExpired(token) && isValidToken);
    }

    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser().setSigningKey(SECRET).parseClaimsJws(token).getBody();
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Boolean isTokenExpired(String token) {
        return extractAllClaims(token).getExpiration().before(new Date());
    }

    /*public String getToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }*/
}

