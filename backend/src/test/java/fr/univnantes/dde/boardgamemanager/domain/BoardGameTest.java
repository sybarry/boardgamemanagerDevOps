package fr.univnantes.dde.boardgamemanager.domain;

import static fr.univnantes.dde.boardgamemanager.domain.BoardGameTestSamples.*;
import static fr.univnantes.dde.boardgamemanager.domain.CategoryTestSamples.*;
import static fr.univnantes.dde.boardgamemanager.domain.PublisherTestSamples.*;
import static fr.univnantes.dde.boardgamemanager.domain.SeriesTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import fr.univnantes.dde.boardgamemanager.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class BoardGameTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(BoardGame.class);
        BoardGame boardGame1 = getBoardGameSample1();
        BoardGame boardGame2 = new BoardGame();
        assertThat(boardGame1).isNotEqualTo(boardGame2);

        boardGame2.setId(boardGame1.getId());
        assertThat(boardGame1).isEqualTo(boardGame2);

        boardGame2 = getBoardGameSample2();
        assertThat(boardGame1).isNotEqualTo(boardGame2);
    }

    @Test
    void seriesTest() throws Exception {
        BoardGame boardGame = getBoardGameRandomSampleGenerator();
        Series seriesBack = getSeriesRandomSampleGenerator();

        boardGame.setSeries(seriesBack);
        assertThat(boardGame.getSeries()).isEqualTo(seriesBack);

        boardGame.series(null);
        assertThat(boardGame.getSeries()).isNull();
    }

    @Test
    void publishersTest() throws Exception {
        BoardGame boardGame = getBoardGameRandomSampleGenerator();
        Publisher publisherBack = getPublisherRandomSampleGenerator();

        boardGame.addPublishers(publisherBack);
        assertThat(boardGame.getPublishers()).containsOnly(publisherBack);

        boardGame.removePublishers(publisherBack);
        assertThat(boardGame.getPublishers()).doesNotContain(publisherBack);

        boardGame.publishers(new HashSet<>(Set.of(publisherBack)));
        assertThat(boardGame.getPublishers()).containsOnly(publisherBack);

        boardGame.setPublishers(new HashSet<>());
        assertThat(boardGame.getPublishers()).doesNotContain(publisherBack);
    }

    @Test
    void categoriesTest() throws Exception {
        BoardGame boardGame = getBoardGameRandomSampleGenerator();
        Category categoryBack = getCategoryRandomSampleGenerator();

        boardGame.addCategories(categoryBack);
        assertThat(boardGame.getCategories()).containsOnly(categoryBack);

        boardGame.removeCategories(categoryBack);
        assertThat(boardGame.getCategories()).doesNotContain(categoryBack);

        boardGame.categories(new HashSet<>(Set.of(categoryBack)));
        assertThat(boardGame.getCategories()).containsOnly(categoryBack);

        boardGame.setCategories(new HashSet<>());
        assertThat(boardGame.getCategories()).doesNotContain(categoryBack);
    }
}
