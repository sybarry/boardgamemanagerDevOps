package fr.univnantes.dde.boardgamemanager.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import fr.univnantes.dde.boardgamemanager.IntegrationTest;
import fr.univnantes.dde.boardgamemanager.domain.BoardGame;
import fr.univnantes.dde.boardgamemanager.repository.BoardGameRepository;
import jakarta.persistence.EntityManager;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Base64Utils;

/**
 * Integration tests for the {@link BoardGameResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class BoardGameResourceIT {

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final Integer DEFAULT_MIN_PLAYERS = 1;
    private static final Integer UPDATED_MIN_PLAYERS = 2;

    private static final Integer DEFAULT_MAX_PLAYERS = 1;
    private static final Integer UPDATED_MAX_PLAYERS = 2;

    private static final Integer DEFAULT_PUBLICATION_YEAR = 1;
    private static final Integer UPDATED_PUBLICATION_YEAR = 2;

    private static final Integer DEFAULT_MIN_AGE = 1;
    private static final Integer UPDATED_MIN_AGE = 2;

    private static final Integer DEFAULT_PLAYING_TIME = 1;
    private static final Integer UPDATED_PLAYING_TIME = 2;

    private static final byte[] DEFAULT_COVER = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_COVER = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_COVER_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_COVER_CONTENT_TYPE = "image/png";

    private static final String ENTITY_API_URL = "/api/board-games";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private BoardGameRepository boardGameRepository;

    @Mock
    private BoardGameRepository boardGameRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restBoardGameMockMvc;

    private BoardGame boardGame;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BoardGame createEntity(EntityManager em) {
        BoardGame boardGame = new BoardGame()
            .title(DEFAULT_TITLE)
            .minPlayers(DEFAULT_MIN_PLAYERS)
            .maxPlayers(DEFAULT_MAX_PLAYERS)
            .publicationYear(DEFAULT_PUBLICATION_YEAR)
            .minAge(DEFAULT_MIN_AGE)
            .playingTime(DEFAULT_PLAYING_TIME)
            .cover(DEFAULT_COVER)
            .coverContentType(DEFAULT_COVER_CONTENT_TYPE);
        return boardGame;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BoardGame createUpdatedEntity(EntityManager em) {
        BoardGame boardGame = new BoardGame()
            .title(UPDATED_TITLE)
            .minPlayers(UPDATED_MIN_PLAYERS)
            .maxPlayers(UPDATED_MAX_PLAYERS)
            .publicationYear(UPDATED_PUBLICATION_YEAR)
            .minAge(UPDATED_MIN_AGE)
            .playingTime(UPDATED_PLAYING_TIME)
            .cover(UPDATED_COVER)
            .coverContentType(UPDATED_COVER_CONTENT_TYPE);
        return boardGame;
    }

    @BeforeEach
    public void initTest() {
        boardGame = createEntity(em);
    }

    @Test
    @Transactional
    void createBoardGame() throws Exception {
        int databaseSizeBeforeCreate = boardGameRepository.findAll().size();
        // Create the BoardGame
        restBoardGameMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(boardGame)))
            .andExpect(status().isCreated());

        // Validate the BoardGame in the database
        List<BoardGame> boardGameList = boardGameRepository.findAll();
        assertThat(boardGameList).hasSize(databaseSizeBeforeCreate + 1);
        BoardGame testBoardGame = boardGameList.get(boardGameList.size() - 1);
        assertThat(testBoardGame.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testBoardGame.getMinPlayers()).isEqualTo(DEFAULT_MIN_PLAYERS);
        assertThat(testBoardGame.getMaxPlayers()).isEqualTo(DEFAULT_MAX_PLAYERS);
        assertThat(testBoardGame.getPublicationYear()).isEqualTo(DEFAULT_PUBLICATION_YEAR);
        assertThat(testBoardGame.getMinAge()).isEqualTo(DEFAULT_MIN_AGE);
        assertThat(testBoardGame.getPlayingTime()).isEqualTo(DEFAULT_PLAYING_TIME);
        assertThat(testBoardGame.getCover()).isEqualTo(DEFAULT_COVER);
        assertThat(testBoardGame.getCoverContentType()).isEqualTo(DEFAULT_COVER_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void createBoardGameWithExistingId() throws Exception {
        // Create the BoardGame with an existing ID
        boardGame.setId(1L);

        int databaseSizeBeforeCreate = boardGameRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restBoardGameMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(boardGame)))
            .andExpect(status().isBadRequest());

        // Validate the BoardGame in the database
        List<BoardGame> boardGameList = boardGameRepository.findAll();
        assertThat(boardGameList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkTitleIsRequired() throws Exception {
        int databaseSizeBeforeTest = boardGameRepository.findAll().size();
        // set the field null
        boardGame.setTitle(null);

        // Create the BoardGame, which fails.

        restBoardGameMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(boardGame)))
            .andExpect(status().isBadRequest());

        List<BoardGame> boardGameList = boardGameRepository.findAll();
        assertThat(boardGameList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllBoardGames() throws Exception {
        // Initialize the database
        boardGameRepository.saveAndFlush(boardGame);

        // Get all the boardGameList
        restBoardGameMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(boardGame.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].minPlayers").value(hasItem(DEFAULT_MIN_PLAYERS)))
            .andExpect(jsonPath("$.[*].maxPlayers").value(hasItem(DEFAULT_MAX_PLAYERS)))
            .andExpect(jsonPath("$.[*].publicationYear").value(hasItem(DEFAULT_PUBLICATION_YEAR)))
            .andExpect(jsonPath("$.[*].minAge").value(hasItem(DEFAULT_MIN_AGE)))
            .andExpect(jsonPath("$.[*].playingTime").value(hasItem(DEFAULT_PLAYING_TIME)))
            .andExpect(jsonPath("$.[*].coverContentType").value(hasItem(DEFAULT_COVER_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].cover").value(hasItem(Base64Utils.encodeToString(DEFAULT_COVER))));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllBoardGamesWithEagerRelationshipsIsEnabled() throws Exception {
        when(boardGameRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restBoardGameMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(boardGameRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllBoardGamesWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(boardGameRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restBoardGameMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(boardGameRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getBoardGame() throws Exception {
        // Initialize the database
        boardGameRepository.saveAndFlush(boardGame);

        // Get the boardGame
        restBoardGameMockMvc
            .perform(get(ENTITY_API_URL_ID, boardGame.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(boardGame.getId().intValue()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE))
            .andExpect(jsonPath("$.minPlayers").value(DEFAULT_MIN_PLAYERS))
            .andExpect(jsonPath("$.maxPlayers").value(DEFAULT_MAX_PLAYERS))
            .andExpect(jsonPath("$.publicationYear").value(DEFAULT_PUBLICATION_YEAR))
            .andExpect(jsonPath("$.minAge").value(DEFAULT_MIN_AGE))
            .andExpect(jsonPath("$.playingTime").value(DEFAULT_PLAYING_TIME))
            .andExpect(jsonPath("$.coverContentType").value(DEFAULT_COVER_CONTENT_TYPE))
            .andExpect(jsonPath("$.cover").value(Base64Utils.encodeToString(DEFAULT_COVER)));
    }

    @Test
    @Transactional
    void getNonExistingBoardGame() throws Exception {
        // Get the boardGame
        restBoardGameMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingBoardGame() throws Exception {
        // Initialize the database
        boardGameRepository.saveAndFlush(boardGame);

        int databaseSizeBeforeUpdate = boardGameRepository.findAll().size();

        // Update the boardGame
        BoardGame updatedBoardGame = boardGameRepository.findById(boardGame.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedBoardGame are not directly saved in db
        em.detach(updatedBoardGame);
        updatedBoardGame
            .title(UPDATED_TITLE)
            .minPlayers(UPDATED_MIN_PLAYERS)
            .maxPlayers(UPDATED_MAX_PLAYERS)
            .publicationYear(UPDATED_PUBLICATION_YEAR)
            .minAge(UPDATED_MIN_AGE)
            .playingTime(UPDATED_PLAYING_TIME)
            .cover(UPDATED_COVER)
            .coverContentType(UPDATED_COVER_CONTENT_TYPE);

        restBoardGameMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedBoardGame.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedBoardGame))
            )
            .andExpect(status().isOk());

        // Validate the BoardGame in the database
        List<BoardGame> boardGameList = boardGameRepository.findAll();
        assertThat(boardGameList).hasSize(databaseSizeBeforeUpdate);
        BoardGame testBoardGame = boardGameList.get(boardGameList.size() - 1);
        assertThat(testBoardGame.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testBoardGame.getMinPlayers()).isEqualTo(UPDATED_MIN_PLAYERS);
        assertThat(testBoardGame.getMaxPlayers()).isEqualTo(UPDATED_MAX_PLAYERS);
        assertThat(testBoardGame.getPublicationYear()).isEqualTo(UPDATED_PUBLICATION_YEAR);
        assertThat(testBoardGame.getMinAge()).isEqualTo(UPDATED_MIN_AGE);
        assertThat(testBoardGame.getPlayingTime()).isEqualTo(UPDATED_PLAYING_TIME);
        assertThat(testBoardGame.getCover()).isEqualTo(UPDATED_COVER);
        assertThat(testBoardGame.getCoverContentType()).isEqualTo(UPDATED_COVER_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void putNonExistingBoardGame() throws Exception {
        int databaseSizeBeforeUpdate = boardGameRepository.findAll().size();
        boardGame.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBoardGameMockMvc
            .perform(
                put(ENTITY_API_URL_ID, boardGame.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(boardGame))
            )
            .andExpect(status().isBadRequest());

        // Validate the BoardGame in the database
        List<BoardGame> boardGameList = boardGameRepository.findAll();
        assertThat(boardGameList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchBoardGame() throws Exception {
        int databaseSizeBeforeUpdate = boardGameRepository.findAll().size();
        boardGame.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBoardGameMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(boardGame))
            )
            .andExpect(status().isBadRequest());

        // Validate the BoardGame in the database
        List<BoardGame> boardGameList = boardGameRepository.findAll();
        assertThat(boardGameList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamBoardGame() throws Exception {
        int databaseSizeBeforeUpdate = boardGameRepository.findAll().size();
        boardGame.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBoardGameMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(boardGame)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the BoardGame in the database
        List<BoardGame> boardGameList = boardGameRepository.findAll();
        assertThat(boardGameList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateBoardGameWithPatch() throws Exception {
        // Initialize the database
        boardGameRepository.saveAndFlush(boardGame);

        int databaseSizeBeforeUpdate = boardGameRepository.findAll().size();

        // Update the boardGame using partial update
        BoardGame partialUpdatedBoardGame = new BoardGame();
        partialUpdatedBoardGame.setId(boardGame.getId());

        partialUpdatedBoardGame
            .minPlayers(UPDATED_MIN_PLAYERS)
            .maxPlayers(UPDATED_MAX_PLAYERS)
            .publicationYear(UPDATED_PUBLICATION_YEAR)
            .minAge(UPDATED_MIN_AGE)
            .playingTime(UPDATED_PLAYING_TIME)
            .cover(UPDATED_COVER)
            .coverContentType(UPDATED_COVER_CONTENT_TYPE);

        restBoardGameMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBoardGame.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBoardGame))
            )
            .andExpect(status().isOk());

        // Validate the BoardGame in the database
        List<BoardGame> boardGameList = boardGameRepository.findAll();
        assertThat(boardGameList).hasSize(databaseSizeBeforeUpdate);
        BoardGame testBoardGame = boardGameList.get(boardGameList.size() - 1);
        assertThat(testBoardGame.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testBoardGame.getMinPlayers()).isEqualTo(UPDATED_MIN_PLAYERS);
        assertThat(testBoardGame.getMaxPlayers()).isEqualTo(UPDATED_MAX_PLAYERS);
        assertThat(testBoardGame.getPublicationYear()).isEqualTo(UPDATED_PUBLICATION_YEAR);
        assertThat(testBoardGame.getMinAge()).isEqualTo(UPDATED_MIN_AGE);
        assertThat(testBoardGame.getPlayingTime()).isEqualTo(UPDATED_PLAYING_TIME);
        assertThat(testBoardGame.getCover()).isEqualTo(UPDATED_COVER);
        assertThat(testBoardGame.getCoverContentType()).isEqualTo(UPDATED_COVER_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void fullUpdateBoardGameWithPatch() throws Exception {
        // Initialize the database
        boardGameRepository.saveAndFlush(boardGame);

        int databaseSizeBeforeUpdate = boardGameRepository.findAll().size();

        // Update the boardGame using partial update
        BoardGame partialUpdatedBoardGame = new BoardGame();
        partialUpdatedBoardGame.setId(boardGame.getId());

        partialUpdatedBoardGame
            .title(UPDATED_TITLE)
            .minPlayers(UPDATED_MIN_PLAYERS)
            .maxPlayers(UPDATED_MAX_PLAYERS)
            .publicationYear(UPDATED_PUBLICATION_YEAR)
            .minAge(UPDATED_MIN_AGE)
            .playingTime(UPDATED_PLAYING_TIME)
            .cover(UPDATED_COVER)
            .coverContentType(UPDATED_COVER_CONTENT_TYPE);

        restBoardGameMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBoardGame.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBoardGame))
            )
            .andExpect(status().isOk());

        // Validate the BoardGame in the database
        List<BoardGame> boardGameList = boardGameRepository.findAll();
        assertThat(boardGameList).hasSize(databaseSizeBeforeUpdate);
        BoardGame testBoardGame = boardGameList.get(boardGameList.size() - 1);
        assertThat(testBoardGame.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testBoardGame.getMinPlayers()).isEqualTo(UPDATED_MIN_PLAYERS);
        assertThat(testBoardGame.getMaxPlayers()).isEqualTo(UPDATED_MAX_PLAYERS);
        assertThat(testBoardGame.getPublicationYear()).isEqualTo(UPDATED_PUBLICATION_YEAR);
        assertThat(testBoardGame.getMinAge()).isEqualTo(UPDATED_MIN_AGE);
        assertThat(testBoardGame.getPlayingTime()).isEqualTo(UPDATED_PLAYING_TIME);
        assertThat(testBoardGame.getCover()).isEqualTo(UPDATED_COVER);
        assertThat(testBoardGame.getCoverContentType()).isEqualTo(UPDATED_COVER_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void patchNonExistingBoardGame() throws Exception {
        int databaseSizeBeforeUpdate = boardGameRepository.findAll().size();
        boardGame.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBoardGameMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, boardGame.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(boardGame))
            )
            .andExpect(status().isBadRequest());

        // Validate the BoardGame in the database
        List<BoardGame> boardGameList = boardGameRepository.findAll();
        assertThat(boardGameList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchBoardGame() throws Exception {
        int databaseSizeBeforeUpdate = boardGameRepository.findAll().size();
        boardGame.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBoardGameMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(boardGame))
            )
            .andExpect(status().isBadRequest());

        // Validate the BoardGame in the database
        List<BoardGame> boardGameList = boardGameRepository.findAll();
        assertThat(boardGameList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamBoardGame() throws Exception {
        int databaseSizeBeforeUpdate = boardGameRepository.findAll().size();
        boardGame.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBoardGameMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(boardGame))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the BoardGame in the database
        List<BoardGame> boardGameList = boardGameRepository.findAll();
        assertThat(boardGameList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteBoardGame() throws Exception {
        // Initialize the database
        boardGameRepository.saveAndFlush(boardGame);

        int databaseSizeBeforeDelete = boardGameRepository.findAll().size();

        // Delete the boardGame
        restBoardGameMockMvc
            .perform(delete(ENTITY_API_URL_ID, boardGame.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<BoardGame> boardGameList = boardGameRepository.findAll();
        assertThat(boardGameList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
