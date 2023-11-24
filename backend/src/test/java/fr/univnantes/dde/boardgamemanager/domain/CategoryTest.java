package fr.univnantes.dde.boardgamemanager.domain;

import static fr.univnantes.dde.boardgamemanager.domain.BoardGameTestSamples.*;
import static fr.univnantes.dde.boardgamemanager.domain.CategoryTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import fr.univnantes.dde.boardgamemanager.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class CategoryTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Category.class);
        Category category1 = getCategorySample1();
        Category category2 = new Category();
        assertThat(category1).isNotEqualTo(category2);

        category2.setId(category1.getId());
        assertThat(category1).isEqualTo(category2);

        category2 = getCategorySample2();
        assertThat(category1).isNotEqualTo(category2);
    }

    @Test
    void gamesTest() throws Exception {
        Category category = getCategoryRandomSampleGenerator();
        BoardGame boardGameBack = getBoardGameRandomSampleGenerator();

        category.addGames(boardGameBack);
        assertThat(category.getGames()).containsOnly(boardGameBack);
        assertThat(boardGameBack.getCategories()).containsOnly(category);

        category.removeGames(boardGameBack);
        assertThat(category.getGames()).doesNotContain(boardGameBack);
        assertThat(boardGameBack.getCategories()).doesNotContain(category);

        category.games(new HashSet<>(Set.of(boardGameBack)));
        assertThat(category.getGames()).containsOnly(boardGameBack);
        assertThat(boardGameBack.getCategories()).containsOnly(category);

        category.setGames(new HashSet<>());
        assertThat(category.getGames()).doesNotContain(boardGameBack);
        assertThat(boardGameBack.getCategories()).doesNotContain(category);
    }
}
