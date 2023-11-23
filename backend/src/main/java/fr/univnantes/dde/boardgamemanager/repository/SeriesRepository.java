package fr.univnantes.dde.boardgamemanager.repository;

import fr.univnantes.dde.boardgamemanager.domain.Series;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Series entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SeriesRepository extends JpaRepository<Series, Long> {}
