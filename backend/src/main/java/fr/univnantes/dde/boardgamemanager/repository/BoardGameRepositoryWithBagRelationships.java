package fr.univnantes.dde.boardgamemanager.repository;

import fr.univnantes.dde.boardgamemanager.domain.BoardGame;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

public interface BoardGameRepositoryWithBagRelationships {
    Optional<BoardGame> fetchBagRelationships(Optional<BoardGame> boardGame);

    List<BoardGame> fetchBagRelationships(List<BoardGame> boardGames);

    Page<BoardGame> fetchBagRelationships(Page<BoardGame> boardGames);
}
