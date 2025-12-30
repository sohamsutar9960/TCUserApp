package intelizign.tcuserapp.backend.controller.email;

import intelizign.tcuserapp.backend.service.email.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/izn/email")
public class EmailController {

    @Autowired
    EmailService emailService;

    private final Logger logger = LoggerFactory.getLogger(EmailController.class);

    @GetMapping("/send-email")
    public String sendEmail() {
        try {
            emailService.sendSimpleEmail("navinneriya07@gmail.com", "Test Subject", "This is the email body.");
            return "Email sent successfully";
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return "";
    }
}
