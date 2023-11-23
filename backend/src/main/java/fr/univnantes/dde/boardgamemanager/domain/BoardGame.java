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
 * A BoardGame.
 */
@Entity
@Table(name = "board_game")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class BoardGame implements Serializable {

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
  @Column(name = "title", nullable = false)
  private String title;

  @Column(name = "min_players")
  private Integer minPlayers;

  @Column(name = "max_players")
  private Integer maxPlayers;

  @Column(name = "publication_year")
  private Integer publicationYear;

  @Column(name = "min_age")
  private Integer minAge;

  @Column(name = "playing_time")
  private Integer playingTime;

  @Lob
  @Column(name = "cover")
  private byte[] cover;

  @Column(name = "cover_content_type")
  private String coverContentType;

  @ManyToOne(fetch = FetchType.LAZY)
  @JsonIgnoreProperties(value = { "games" }, allowSetters = true)
  private Series series;

  @ManyToMany(fetch = FetchType.LAZY)
  @JoinTable(
    name = "rel_board_game__publishers",
    joinColumns = @JoinColumn(name = "board_game_id"),
    inverseJoinColumns = @JoinColumn(name = "publishers_id")
  )
  @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
  @JsonIgnoreProperties(value = { "games" }, allowSetters = true)
  private Set<Publisher> publishers = new HashSet<>();

  @ManyToMany(fetch = FetchType.LAZY)
  @JoinTable(
    name = "rel_board_game__categories",
    joinColumns = @JoinColumn(name = "board_game_id"),
    inverseJoinColumns = @JoinColumn(name = "categories_id")
  )
  @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
  @JsonIgnoreProperties(value = { "games" }, allowSetters = true)
  private Set<Category> categories = new HashSet<>();

  // jhipster-needle-entity-add-field - JHipster will add fields here

  public Long getId() {
    return this.id;
  }

  public BoardGame id(Long id) {
    this.setId(id);
    return this;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getTitle() {
    return this.title;
  }

  public BoardGame title(String title) {
    this.setTitle(title);
    return this;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public Integer getMinPlayers() {
    return this.minPlayers;
  }

  public BoardGame minPlayers(Integer minPlayers) {
    this.setMinPlayers(minPlayers);
    return this;
  }

  public void setMinPlayers(Integer minPlayers) {
    this.minPlayers = minPlayers;
  }

  public Integer getMaxPlayers() {
    return this.maxPlayers;
  }

  public BoardGame maxPlayers(Integer maxPlayers) {
    this.setMaxPlayers(maxPlayers);
    return this;
  }

  public void setMaxPlayers(Integer maxPlayers) {
    this.maxPlayers = maxPlayers;
  }

  public Integer getPublicationYear() {
    return this.publicationYear;
  }

  public BoardGame publicationYear(Integer publicationYear) {
    this.setPublicationYear(publicationYear);
    return this;
  }

  public void setPublicationYear(Integer publicationYear) {
    this.publicationYear = publicationYear;
  }

  public Integer getMinAge() {
    return this.minAge;
  }

  public BoardGame minAge(Integer minAge) {
    this.setMinAge(minAge);
    return this;
  }

  public void setMinAge(Integer minAge) {
    this.minAge = minAge;
  }

  public Integer getPlayingTime() {
    return this.playingTime;
  }

  public BoardGame playingTime(Integer playingTime) {
    this.setPlayingTime(playingTime);
    return this;
  }

  public void setPlayingTime(Integer playingTime) {
    this.playingTime = playingTime;
  }

  public byte[] getCover() {
    return this.cover;
  }

  public BoardGame cover(byte[] cover) {
    this.setCover(cover);
    return this;
  }

  public void setCover(byte[] cover) {
    this.cover = cover;
  }

  public String getCoverContentType() {
    return this.coverContentType;
  }

  public BoardGame coverContentType(String coverContentType) {
    this.coverContentType = coverContentType;
    return this;
  }

  public void setCoverContentType(String coverContentType) {
    this.coverContentType = coverContentType;
  }

  public Series getSeries() {
    return this.series;
  }

  public void setSeries(Series series) {
    this.series = series;
  }

  public BoardGame series(Series series) {
    this.setSeries(series);
    return this;
  }

  public Set<Publisher> getPublishers() {
    return this.publishers;
  }

  public void setPublishers(Set<Publisher> publishers) {
    this.publishers = publishers;
  }

  public BoardGame publishers(Set<Publisher> publishers) {
    this.setPublishers(publishers);
    return this;
  }

  public BoardGame addPublishers(Publisher publisher) {
    this.publishers.add(publisher);
    return this;
  }

  public BoardGame removePublishers(Publisher publisher) {
    this.publishers.remove(publisher);
    return this;
  }

  public Set<Category> getCategories() {
    return this.categories;
  }

  public void setCategories(Set<Category> categories) {
    this.categories = categories;
  }

  public BoardGame categories(Set<Category> categories) {
    this.setCategories(categories);
    return this;
  }

  public BoardGame addCategories(Category category) {
    this.categories.add(category);
    return this;
  }

  public BoardGame removeCategories(Category category) {
    this.categories.remove(category);
    return this;
  }

  // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (!(o instanceof BoardGame)) {
      return false;
    }
    return getId() != null && getId().equals(((BoardGame) o).getId());
  }

  @Override
  public int hashCode() {
    // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
    return getClass().hashCode();
  }

  // prettier-ignore
    @Override
    public String toString() {
        return "BoardGame{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", minPlayers=" + getMinPlayers() +
            ", maxPlayers=" + getMaxPlayers() +
            ", publicationYear=" + getPublicationYear() +
            ", minAge=" + getMinAge() +
            ", playingTime=" + getPlayingTime() +
            ", cover='" + getCover() + "'" +
            ", coverContentType='" + getCoverContentType() + "'" +
            "}";
    }
}
