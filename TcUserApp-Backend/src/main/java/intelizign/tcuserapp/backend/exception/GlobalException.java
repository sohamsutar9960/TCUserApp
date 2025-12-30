package intelizign.tcuserapp.backend.exception;

import com.teamcenter.schemas.soa._2006_03.exceptions.InvalidCredentialsException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.ResourceAccessException;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalException {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> notFoundException(ResourceNotFoundException ex) {
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("message", ex.getMessage());
        map.put("success", false);
        map.put("status", HttpStatus.NOT_FOUND);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(map);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public final ResponseEntity<Object> handleBadCredentialsException(AuthenticationException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("message", ex.getMessage());
        body.put("success", false);
        body.put("status", HttpStatus.BAD_REQUEST.value());
        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public final ResponseEntity<Object> handleAccessDeniedException(AccessDeniedException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("message", ex.getMessage());
        body.put("success", false);
        body.put("status", HttpStatus.FORBIDDEN.value());
        return new ResponseEntity<>(body, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<Map<String, Object>> duplicateException(DuplicateResourceException ex) {
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("message", ex.getMessage());
        map.put("success", false);
        map.put("status", HttpStatus.CONFLICT);
        return ResponseEntity.status(HttpStatus.CONFLICT).body(map);
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<Map<String, Object>> invalidCredentialsException(InvalidCredentialsException ex) {
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("message", ex.getMessage());
        map.put("success", false);
        map.put("status", HttpStatus.BAD_REQUEST);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(map);
    }

    @ExceptionHandler(DeletionNotAllowedException.class)
    public ResponseEntity<Map<String, Object>> notAllowedException(DeletionNotAllowedException ex) {
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("message", ex.getMessage());
        map.put("success", false);
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(map);
    }

    @ExceptionHandler(TeamcenterException.class)
    public ResponseEntity<Map<String, Object>> teamcenterException(TeamcenterException ex) {
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("message", ex.getMessage());
        map.put("success", false);
        map.put("status", HttpStatus.BAD_REQUEST);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(map);
    }

    @ExceptionHandler(ResourceAccessException.class)
    public ResponseEntity<Map<String, Object>> resourceAccessException(ResourceAccessException ex) {
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("message", ex.getMessage());
        map.put("success", false);
        map.put("status", HttpStatus.GATEWAY_TIMEOUT);
        return ResponseEntity.status(HttpStatus.GATEWAY_TIMEOUT).body(map);
    }
}
