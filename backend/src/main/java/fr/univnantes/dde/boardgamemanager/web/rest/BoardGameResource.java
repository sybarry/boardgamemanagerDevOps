package fr.univnantes.dde.boardgamemanager.web.rest;

import fr.univnantes.dde.boardgamemanager.domain.BoardGame;
import fr.univnantes.dde.boardgamemanager.repository.BoardGameRepository;
import fr.univnantes.dde.boardgamemanager.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link fr.univnantes.dde.boardgamemanager.domain.BoardGame}.
 */
@RestController
@RequestMapping("/api/board-games")
@Transactional
public class BoardGameResource {

  private final Logger log = LoggerFactory.getLogger(BoardGameResource.class);

  private static final String ENTITY_NAME = "boardGame";

  @Value("${jhipster.clientApp.name}")
  private String applicationName;

  private final BoardGameRepository boardGameRepository;

  public BoardGameResource(BoardGameRepository boardGameRepository) {
    this.boardGameRepository = boardGameRepository;
  }

  /**
   * {@code POST  /board-games} : Create a new boardGame.
   *
   * @param boardGame the boardGame to create.
   * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new boardGame, or with status {@code 400 (Bad Request)} if the boardGame has already an ID.
   * @throws URISyntaxException if the Location URI syntax is incorrect.
   */
  @PostMapping("")
  public ResponseEntity<BoardGame> createBoardGame(
    @Valid @RequestBody BoardGame boardGame
  ) throws URISyntaxException {
    log.debug("REST request to save BoardGame : {}", boardGame);
    if (boardGame.getId() != null) {
      throw new BadRequestAlertException(
        "A new boardGame cannot already have an ID",
        ENTITY_NAME,
        "idexists"
      );
    }
    BoardGame result = boardGameRepository.save(boardGame);
    return ResponseEntity
      .created(new URI("/api/board-games/" + result.getId()))
      .headers(
        HeaderUtil.createEntityCreationAlert(
          applicationName,
          true,
          ENTITY_NAME,
          result.getId().toString()
        )
      )
      .body(result);
  }

  /**
   * {@code PUT  /board-games/:id} : Updates an existing boardGame.
   *
   * @param id the id of the boardGame to save.
   * @param boardGame the boardGame to update.
   * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated boardGame,
   * or with status {@code 400 (Bad Request)} if the boardGame is not valid,
   * or with status {@code 500 (Internal Server Error)} if the boardGame couldn't be updated.
   * @throws URISyntaxException if the Location URI syntax is incorrect.
   */
  @PutMapping("/{id}")
  public ResponseEntity<BoardGame> updateBoardGame(
    @PathVariable(value = "id", required = false) final Long id,
    @Valid @RequestBody BoardGame boardGame
  ) throws URISyntaxException {
    log.debug("REST request to update BoardGame : {}, {}", id, boardGame);
    if (boardGame.getId() == null) {
      throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
    }
    if (!Objects.equals(id, boardGame.getId())) {
      throw new BadRequestAlertException(
        "Invalid ID",
        ENTITY_NAME,
        "idinvalid"
      );
    }

    if (!boardGameRepository.existsById(id)) {
      throw new BadRequestAlertException(
        "Entity not found",
        ENTITY_NAME,
        "idnotfound"
      );
    }

    BoardGame result = boardGameRepository.save(boardGame);
    return ResponseEntity
      .ok()
      .headers(
        HeaderUtil.createEntityUpdateAlert(
          applicationName,
          true,
          ENTITY_NAME,
          boardGame.getId().toString()
        )
      )
      .body(result);
  }

  /**
   * {@code PATCH  /board-games/:id} : Partial updates given fields of an existing boardGame, field will ignore if it is null
   *
   * @param id the id of the boardGame to save.
   * @param boardGame the boardGame to update.
   * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated boardGame,
   * or with status {@code 400 (Bad Request)} if the boardGame is not valid,
   * or with status {@code 404 (Not Found)} if the boardGame is not found,
   * or with status {@code 500 (Internal Server Error)} if the boardGame couldn't be updated.
   * @throws URISyntaxException if the Location URI syntax is incorrect.
   */
  @PatchMapping(
    value = "/{id}",
    consumes = { "application/json", "application/merge-patch+json" }
  )
  public ResponseEntity<BoardGame> partialUpdateBoardGame(
    @PathVariable(value = "id", required = false) final Long id,
    @NotNull @RequestBody BoardGame boardGame
  ) throws URISyntaxException {
    log.debug(
      "REST request to partial update BoardGame partially : {}, {}",
      id,
      boardGame
    );
    if (boardGame.getId() == null) {
      throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
    }
    if (!Objects.equals(id, boardGame.getId())) {
      throw new BadRequestAlertException(
        "Invalid ID",
        ENTITY_NAME,
        "idinvalid"
      );
    }

    if (!boardGameRepository.existsById(id)) {
      throw new BadRequestAlertException(
        "Entity not found",
        ENTITY_NAME,
        "idnotfound"
      );
    }

    Optional<BoardGame> result = boardGameRepository
      .findById(boardGame.getId())
      .map(existingBoardGame -> {
        if (boardGame.getTitle() != null) {
          existingBoardGame.setTitle(boardGame.getTitle());
        }
        if (boardGame.getMinPlayers() != null) {
          existingBoardGame.setMinPlayers(boardGame.getMinPlayers());
        }
        if (boardGame.getMaxPlayers() != null) {
          existingBoardGame.setMaxPlayers(boardGame.getMaxPlayers());
        }
        if (boardGame.getPublicationYear() != null) {
          existingBoardGame.setPublicationYear(boardGame.getPublicationYear());
        }
        if (boardGame.getMinAge() != null) {
          existingBoardGame.setMinAge(boardGame.getMinAge());
        }
        if (boardGame.getPlayingTime() != null) {
          existingBoardGame.setPlayingTime(boardGame.getPlayingTime());
        }
        if (boardGame.getCover() != null) {
          existingBoardGame.setCover(boardGame.getCover());
        }
        if (boardGame.getCoverContentType() != null) {
          existingBoardGame.setCoverContentType(
            boardGame.getCoverContentType()
          );
        }

        return existingBoardGame;
      })
      .map(boardGameRepository::save);

    return ResponseUtil.wrapOrNotFound(
      result,
      HeaderUtil.createEntityUpdateAlert(
        applicationName,
        true,
        ENTITY_NAME,
        boardGame.getId().toString()
      )
    );
  }

  /**
   * {@code GET  /board-games} : get all the boardGames.
   *
   * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
   * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of boardGames in body.
   */
  @GetMapping("")
  public List<BoardGame> getAllBoardGames(
    @RequestParam(required = false, defaultValue = "true") boolean eagerload
  ) {
    log.debug("REST request to get all BoardGames");
    if (eagerload) {
      return boardGameRepository.findAllWithEagerRelationships();
    } else {
      return boardGameRepository.findAll();
    }
  }

  /**
   * {@code GET  /board-games/:id} : get the "id" boardGame.
   *
   * @param id the id of the boardGame to retrieve.
   * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the boardGame, or with status {@code 404 (Not Found)}.
   */
  @GetMapping("/{id}")
  public ResponseEntity<BoardGame> getBoardGame(@PathVariable Long id) {
    log.debug("REST request to get BoardGame : {}", id);
    Optional<BoardGame> boardGame =
      boardGameRepository.findOneWithEagerRelationships(id);
    return ResponseUtil.wrapOrNotFound(boardGame);
  }

  /**
   * {@code DELETE  /board-games/:id} : delete the "id" boardGame.
   *
   * @param id the id of the boardGame to delete.
   * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
   */
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteBoardGame(@PathVariable Long id) {
    log.debug("REST request to delete BoardGame : {}", id);
    boardGameRepository.deleteById(id);
    return ResponseEntity
      .noContent()
      .headers(
        HeaderUtil.createEntityDeletionAlert(
          applicationName,
          true,
          ENTITY_NAME,
          id.toString()
        )
      )
      .build();
  }
}
