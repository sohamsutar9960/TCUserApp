package intelizign.tcuserapp.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${react.endpoint}")
    String reactEndpoint;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Apply to all endpoints
                .allowedOrigins(reactEndpoint) // Allow specific origins
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH") // Allow specific methods
                .allowedHeaders("*") // Allow any header
                .allowCredentials(true) // Allow credentials (e.g., cookies)
                .maxAge(3600); // Cache the response for 1 hour
    }
}
