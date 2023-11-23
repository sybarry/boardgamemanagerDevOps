package fr.univnantes.dde.boardgamemanager.repository;

import fr.univnantes.dde.boardgamemanager.domain.BoardGame;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the BoardGame entity.
 *
 * When extending this class, extend BoardGameRepositoryWithBagRelationships too.
 * For more information refer to https://github.com/jhipster/generator-jhipster/issues/17990.
 */
@Repository
public interface BoardGameRepository
  extends
    BoardGameRepositoryWithBagRelationships, JpaRepository<BoardGame, Long> {
  default Optional<BoardGame> findOneWithEagerRelationships(Long id) {
    return this.fetchBagRelationships(this.findOneWithToOneRelationships(id));
  }

  default List<BoardGame> findAllWithEagerRelationships() {
    return this.fetchBagRelationships(this.findAllWithToOneRelationships());
  }

  default Page<BoardGame> findAllWithEagerRelationships(Pageable pageable) {
    return this.fetchBagRelationships(
        this.findAllWithToOneRelationships(pageable)
      );
  }

  @Query(
    value = "select boardGame from BoardGame boardGame left join fetch boardGame.series",
    countQuery = "select count(boardGame) from BoardGame boardGame"
  )
  Page<BoardGame> findAllWithToOneRelationships(Pageable pageable);

  @Query(
    "select boardGame from BoardGame boardGame left join fetch boardGame.series"
  )
  List<BoardGame> findAllWithToOneRelationships();

  @Query(
    "select boardGame from BoardGame boardGame left join fetch boardGame.series where boardGame.id =:id"
  )
  Optional<BoardGame> findOneWithToOneRelationships(@Param("id") Long id);
}
