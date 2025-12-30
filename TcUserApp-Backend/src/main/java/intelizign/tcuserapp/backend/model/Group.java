package intelizign.tcuserapp.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "Group")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Group {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long groupId;

    private String groupName;
    private String groupNamePath;
    private String uid;
    private Boolean isRoot;
    private String description;
    private String displayName;
    private Integer level;

    @ManyToOne
    @JoinColumn(name = "system_id")
    private System system;

    @OneToMany(mappedBy = "group", cascade = CascadeType.ALL)
    private List<Role> roles;

    @ManyToOne
    @JoinColumn(name = "parentGroupId")
    private Group parentGroup;

    @OneToMany(mappedBy = "parentGroup")
    private Set<Group> subGroups = new HashSet<>();
}
