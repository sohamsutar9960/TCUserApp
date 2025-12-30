package intelizign.tcuserapp.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "Country")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Country {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long countryId;

    private String countryCode;

    private String countryName;

    @OneToMany(mappedBy = "country", cascade = CascadeType.ALL)
    private List<UserRequest> userRequests;

}
