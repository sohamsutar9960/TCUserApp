package intelizign.tcuserapp.backend;

import intelizign.tcuserapp.backend.config.CustomDTOConfig;
import intelizign.tcuserapp.backend.config.OtherConfig;
import intelizign.tcuserapp.backend.itk.config.CustomITKConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Import;

@SpringBootApplication
@Import({CustomDTOConfig.class, OtherConfig.class, CustomITKConfig.class})
public class TcUserAppBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(TcUserAppBackendApplication.class, args);
    }
}
