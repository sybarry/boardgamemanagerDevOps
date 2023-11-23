package fr.univnantes.dde.boardgamemanager.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Publisher.
 */
@Entity
@Table(name = "publisher")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Publisher implements Serializable {

  private static final long serialVersionUID = 1L;

  @Id
  @GeneratedValue(
    strategy = GenerationType.SEQUENCE,
    generator = "sequenceGenerator"
  )
  @SequenceGenerator(name = "sequenceGenerator")
  @Column(name = "id")
  private Long id;

  @NotNull
  @Column(name = "name", nullable = false)
  private String name;

  @ManyToMany(fetch = FetchType.LAZY, mappedBy = "publishers")
  @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
  @JsonIgnoreProperties(
    value = { "series", "publishers", "categories" },
    allowSetters = true
  )
  private Set<BoardGame> games = new HashSet<>();

  // jhipster-needle-entity-add-field - JHipster will add fields here

  public Long getId() {
    return this.id;
  }

  public Publisher id(Long id) {
    this.setId(id);
    return this;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getName() {
    return this.name;
  }

  public Publisher name(String name) {
    this.setName(name);
    return this;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Set<BoardGame> getGames() {
    return this.games;
  }

  public void setGames(Set<BoardGame> boardGames) {
    if (this.games != null) {
      this.games.forEach(i -> i.removePublishers(this));
    }
    if (boardGames != null) {
      boardGames.forEach(i -> i.addPublishers(this));
    }
    this.games = boardGames;
  }

  public Publisher games(Set<BoardGame> boardGames) {
    this.setGames(boardGames);
    return this;
  }

  public Publisher addGames(BoardGame boardGame) {
    this.games.add(boardGame);
    boardGame.getPublishers().add(this);
    return this;
  }

  public Publisher removeGames(BoardGame boardGame) {
    this.games.remove(boardGame);
    boardGame.getPublishers().remove(this);
    return this;
  }

  // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (!(o instanceof Publisher)) {
      return false;
    }
    return getId() != null && getId().equals(((Publisher) o).getId());
  }

  @Override
  public int hashCode() {
    // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
    return getClass().hashCode();
  }

  // prettier-ignore
    @Override
    public String toString() {
        return "Publisher{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}
