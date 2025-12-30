package intelizign.tcuserapp.backend.config;

import intelizign.tcuserapp.backend.model.User;
import intelizign.tcuserapp.backend.model.UserRole;
import intelizign.tcuserapp.backend.repository.admin.UserRepository;
import intelizign.tcuserapp.backend.repository.admin.UserRoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    UserRepository userRepository;

    @Autowired
    UserRoleRepository userRoleRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {

        String adminRoleName = "ADMIN";
        if (userRoleRepository.findByRoleName(adminRoleName).isEmpty()) {
            UserRole userRole = new UserRole();
            userRole.setRoleName(adminRoleName);
            userRoleRepository.save(userRole);
        }

        String userRoleName = "USER";
        if (userRoleRepository.findByRoleName(userRoleName).isEmpty()) {
            UserRole userRole = new UserRole();
            userRole.setRoleName(userRoleName);
            userRoleRepository.save(userRole);
        }

        String managerRoleName = "MANAGER";
        if (userRoleRepository.findByRoleName(managerRoleName).isEmpty()) {
            UserRole userRole = new UserRole();
            userRole.setRoleName(managerRoleName);
            userRoleRepository.save(userRole);
        }

        String roleApproverRoleName = "ROLEAPPROVER";
        if (userRoleRepository.findByRoleName(roleApproverRoleName).isEmpty()) {
            UserRole userRole = new UserRole();
            userRole.setRoleName(roleApproverRoleName);
            userRoleRepository.save(userRole);
        }

        String userName = "MxAdmin";
        if (userRepository.findByUsername(userName).isEmpty()) {
            User user = new User();
            user.setGID("MXADMIN");
            user.setDepartment("Intelizign");
            user.setDisplayName("MxAdmin");
            user.setUsername(userName);
            user.setPassword(passwordEncoder.encode("1"));
            if (userRoleRepository.findByRoleName(adminRoleName).isPresent())
                user.setUserRole(userRoleRepository.findByRoleName(adminRoleName).get());
            userRepository.save(user);
        }
    }
}
