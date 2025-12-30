package intelizign.tcuserapp.backend.service.email;

public interface EmailService {

    void sendSimpleEmail(String toEmail, String subject, String body);
}
