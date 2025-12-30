package intelizign.tcuserapp.backend.itk.httpConverter;

import com.fasterxml.jackson.databind.ObjectMapper;
import intelizign.tcuserapp.backend.itk.model.ITKResponse;
import io.jsonwebtoken.io.IOException;
import org.springframework.http.HttpInputMessage;
import org.springframework.http.HttpOutputMessage;
import org.springframework.http.MediaType;
import org.springframework.http.converter.AbstractHttpMessageConverter;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.http.converter.HttpMessageNotWritableException;

public class StringToCustomModelConverter extends AbstractHttpMessageConverter<ITKResponse> {

    private final ObjectMapper objectMapper;

    public StringToCustomModelConverter() {
        super(new MediaType("text", "json")); // Handling text/json content type
        this.objectMapper = new ObjectMapper();
    }

    @Override
    protected boolean supports(Class<?> clazz) {
        return ITKResponse.class.equals(clazz);
    }

    @Override
    protected ITKResponse readInternal(Class<? extends ITKResponse> clazz, HttpInputMessage inputMessage)
            throws IOException, HttpMessageNotReadableException, java.io.IOException {
        String body = new String(inputMessage.getBody().readAllBytes());
        return objectMapper.readValue(body, ITKResponse.class);
    }

    @Override
    protected void writeInternal(ITKResponse customModel, HttpOutputMessage outputMessage)
            throws IOException, HttpMessageNotWritableException {
        // Implement this method if you need to support writing your model back to
        // response
    }
}
