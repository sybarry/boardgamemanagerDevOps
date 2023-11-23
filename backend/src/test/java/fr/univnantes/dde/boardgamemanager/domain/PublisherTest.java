package fr.univnantes.dde.boardgamemanager.domain;

import static fr.univnantes.dde.boardgamemanager.domain.BoardGameTestSamples.*;
import static fr.univnantes.dde.boardgamemanager.domain.PublisherTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import fr.univnantes.dde.boardgamemanager.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class PublisherTest {

  @Test
  void equalsVerifier() throws Exception {
    TestUtil.equalsVerifier(Publisher.class);
    Publisher publisher1 = getPublisherSample1();
    Publisher publisher2 = new Publisher();
    assertThat(publisher1).isNotEqualTo(publisher2);

    publisher2.setId(publisher1.getId());
    assertThat(publisher1).isEqualTo(publisher2);

    publisher2 = getPublisherSample2();
    assertThat(publisher1).isNotEqualTo(publisher2);
  }

  @Test
  void gamesTest() throws Exception {
    Publisher publisher = getPublisherRandomSampleGenerator();
    BoardGame boardGameBack = getBoardGameRandomSampleGenerator();

    publisher.addGames(boardGameBack);
    assertThat(publisher.getGames()).containsOnly(boardGameBack);
    assertThat(boardGameBack.getPublishers()).containsOnly(publisher);

    publisher.removeGames(boardGameBack);
    assertThat(publisher.getGames()).doesNotContain(boardGameBack);
    assertThat(boardGameBack.getPublishers()).doesNotContain(publisher);

    publisher.games(new HashSet<>(Set.of(boardGameBack)));
    assertThat(publisher.getGames()).containsOnly(boardGameBack);
    assertThat(boardGameBack.getPublishers()).containsOnly(publisher);

    publisher.setGames(new HashSet<>());
    assertThat(publisher.getGames()).doesNotContain(boardGameBack);
    assertThat(boardGameBack.getPublishers()).doesNotContain(publisher);
  }
}
