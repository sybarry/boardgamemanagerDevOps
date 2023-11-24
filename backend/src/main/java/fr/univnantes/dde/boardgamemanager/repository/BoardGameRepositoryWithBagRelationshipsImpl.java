package fr.univnantes.dde.boardgamemanager.repository;

import fr.univnantes.dde.boardgamemanager.domain.BoardGame;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class BoardGameRepositoryWithBagRelationshipsImpl implements BoardGameRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<BoardGame> fetchBagRelationships(Optional<BoardGame> boardGame) {
        return boardGame.map(this::fetchPublishers).map(this::fetchCategories);
    }

    @Override
    public Page<BoardGame> fetchBagRelationships(Page<BoardGame> boardGames) {
        return new PageImpl<>(fetchBagRelationships(boardGames.getContent()), boardGames.getPageable(), boardGames.getTotalElements());
    }

    @Override
    public List<BoardGame> fetchBagRelationships(List<BoardGame> boardGames) {
        return Optional.of(boardGames).map(this::fetchPublishers).map(this::fetchCategories).orElse(Collections.emptyList());
    }

    BoardGame fetchPublishers(BoardGame result) {
        return entityManager
            .createQuery(
                "select boardGame from BoardGame boardGame left join fetch boardGame.publishers where boardGame.id = :id",
                BoardGame.class
            )
            .setParameter("id", result.getId())
            .getSingleResult();
    }

    List<BoardGame> fetchPublishers(List<BoardGame> boardGames) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, boardGames.size()).forEach(index -> order.put(boardGames.get(index).getId(), index));
        List<BoardGame> result = entityManager
            .createQuery(
                "select boardGame from BoardGame boardGame left join fetch boardGame.publishers where boardGame in :boardGames",
                BoardGame.class
            )
            .setParameter("boardGames", boardGames)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }

    BoardGame fetchCategories(BoardGame result) {
        return entityManager
            .createQuery(
                "select boardGame from BoardGame boardGame left join fetch boardGame.categories where boardGame.id = :id",
                BoardGame.class
            )
            .setParameter("id", result.getId())
            .getSingleResult();
    }

    List<BoardGame> fetchCategories(List<BoardGame> boardGames) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, boardGames.size()).forEach(index -> order.put(boardGames.get(index).getId(), index));
        List<BoardGame> result = entityManager
            .createQuery(
                "select boardGame from BoardGame boardGame left join fetch boardGame.categories where boardGame in :boardGames",
                BoardGame.class
            )
            .setParameter("boardGames", boardGames)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
