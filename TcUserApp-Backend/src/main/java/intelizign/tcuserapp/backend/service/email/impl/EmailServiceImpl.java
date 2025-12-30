package intelizign.tcuserapp.backend.service.email.impl;

import intelizign.tcuserapp.backend.service.email.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    private final Logger logger = LoggerFactory.getLogger(EmailServiceImpl.class);

    @Autowired
    JavaMailSender javaMailSender;

    @Override
    public void sendSimpleEmail(String toEmail, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject(subject);
            message.setText(body);
            message.setFrom("navinneriya07@gmail.com");

            javaMailSender.send(message);
            System.out.println("Mail sent successfully...");
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
    }
}
