package intelizign.tcuserapp.backend.controller.registration;

import intelizign.tcuserapp.backend.dto.UserResponse;
import intelizign.tcuserapp.backend.exception.DuplicateResourceException;
import intelizign.tcuserapp.backend.exception.ResourceNotFoundException;
import intelizign.tcuserapp.backend.model.User;
import intelizign.tcuserapp.backend.service.admin.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/izn/register")
public class UserController {

    @Autowired
    UserService userService;

    private final Logger logger = LoggerFactory.getLogger(UserController.class);

    @GetMapping("/findAllUser")
    public ResponseEntity<List<UserResponse>> getAllUser() {
        try {
            return ResponseEntity.ok(userService.getAllUsers());
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }

    @PostMapping("/saveUser")
    public ResponseEntity<UserResponse> saveUser(@RequestBody User user) {
        try {
            UserResponse userResponse = userService.addUser(user);
            if (userResponse != null) {
                return ResponseEntity.status(HttpStatus.CREATED).body(userResponse);
            }
        } catch (ResourceNotFoundException | DuplicateResourceException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @PutMapping("/updateUser")
    public ResponseEntity<UserResponse> updateUser(@RequestBody User updateUser) {
        try {
            UserResponse userResponse = userService.updateUser(updateUser);
            if (userResponse != null) {
                return ResponseEntity.ok(userResponse);
            }
        } catch (ResourceNotFoundException | DuplicateResourceException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @DeleteMapping("/deleteUser/{userId}")
    public ResponseEntity<String> deleteUser(@PathVariable String userId) {
        try {
            if (userService.findByUserId(Long.parseLong(userId))) {
                userService.deleteUser(Long.parseLong(userId));
                return ResponseEntity.ok().build();
            }
            throw new ResourceNotFoundException("No User found with userId " + userId);
        } catch (ResourceNotFoundException e) {
            logger.error(e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/getUser")
    public String getCurrentUser() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String currentUserName = authentication.getName();

            if (authentication.getPrincipal() instanceof UserDetails userDetails) {
                return userDetails.getUsername();
            } else {
                return currentUserName;
            }
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }

    @PostMapping("/getUser/search")
    public ResponseEntity<List<UserResponse>> getAllUserSearch(@RequestBody User userSearch) {
        try {
            List<UserResponse> userResponses = userService.getAllUserFromSearch(userSearch);
            if (userResponses != null) {
                return ResponseEntity.ok(userResponses);
            }
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/getUser/{gid}")
    public ResponseEntity<UserResponse> getUserByGid(@PathVariable String gid) {
        try {
            UserResponse userResponse = userService.getUserByGid(gid);
            if (userResponse != null) {
                return ResponseEntity.ok(userResponse);
            }
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
}
