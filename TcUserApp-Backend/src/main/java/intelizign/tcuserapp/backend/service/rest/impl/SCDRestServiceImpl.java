package intelizign.tcuserapp.backend.service.rest.impl;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Collections;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import intelizign.tcuserapp.backend.dto.SCDRestResponse;
import intelizign.tcuserapp.backend.service.rest.SCDRestService;

@Service
public class SCDRestServiceImpl implements SCDRestService {

	@Autowired
	private RestTemplate restTemplate;

	@Value("${api.endpoint}")
	private String endPoint;

	@Value("${api.username}")
	private String userName;

	@Value("${api.password}")
	private String password;

	private Logger logger = LoggerFactory.getLogger(SCDRestServiceImpl.class);

	@Override
	public SCDRestResponse getDataFromSCDAPI(String gid) {

		try {

			String auth = userName + ":" + password;
			byte[] encodedAuth = Base64.getEncoder().encode(auth.getBytes(StandardCharsets.US_ASCII));
			String authHeader = "Basic " + new String(encodedAuth);

			HttpHeaders httpHeaders = new HttpHeaders();
			httpHeaders.setAccept(Collections.singletonList(MediaType.APPLICATION_XML));
			httpHeaders.setContentType(MediaType.APPLICATION_XML);
			httpHeaders.set("Authorization", authHeader);

			HttpEntity<String> entity = new HttpEntity<>(httpHeaders);
			ResponseEntity<SCDRestResponse> responseEntity = restTemplate.exchange(endPoint + gid, HttpMethod.GET,
					entity, SCDRestResponse.class);

			return responseEntity.getBody();

		} catch (Exception e) {
			logger.error(e.getMessage());
		}
		return null;
	}
}
