package fr.univnantes.dde.boardgamemanager.domain;

import static fr.univnantes.dde.boardgamemanager.domain.BoardGameTestSamples.*;
import static fr.univnantes.dde.boardgamemanager.domain.SeriesTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import fr.univnantes.dde.boardgamemanager.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class SeriesTest {

  @Test
  void equalsVerifier() throws Exception {
    TestUtil.equalsVerifier(Series.class);
    Series series1 = getSeriesSample1();
    Series series2 = new Series();
    assertThat(series1).isNotEqualTo(series2);

    series2.setId(series1.getId());
    assertThat(series1).isEqualTo(series2);

    series2 = getSeriesSample2();
    assertThat(series1).isNotEqualTo(series2);
  }

  @Test
  void gamesTest() throws Exception {
    Series series = getSeriesRandomSampleGenerator();
    BoardGame boardGameBack = getBoardGameRandomSampleGenerator();

    series.addGames(boardGameBack);
    assertThat(series.getGames()).containsOnly(boardGameBack);
    assertThat(boardGameBack.getSeries()).isEqualTo(series);

    series.removeGames(boardGameBack);
    assertThat(series.getGames()).doesNotContain(boardGameBack);
    assertThat(boardGameBack.getSeries()).isNull();

    series.games(new HashSet<>(Set.of(boardGameBack)));
    assertThat(series.getGames()).containsOnly(boardGameBack);
    assertThat(boardGameBack.getSeries()).isEqualTo(series);

    series.setGames(new HashSet<>());
    assertThat(series.getGames()).doesNotContain(boardGameBack);
    assertThat(boardGameBack.getSeries()).isNull();
  }
}
