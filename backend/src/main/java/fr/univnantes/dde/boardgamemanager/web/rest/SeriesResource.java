package fr.univnantes.dde.boardgamemanager.web.rest;

import fr.univnantes.dde.boardgamemanager.domain.Series;
import fr.univnantes.dde.boardgamemanager.repository.SeriesRepository;
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
 * REST controller for managing {@link fr.univnantes.dde.boardgamemanager.domain.Series}.
 */
@RestController
@RequestMapping("/api/series")
@Transactional
public class SeriesResource {

  private final Logger log = LoggerFactory.getLogger(SeriesResource.class);

  private static final String ENTITY_NAME = "series";

  @Value("${jhipster.clientApp.name}")
  private String applicationName;

  private final SeriesRepository seriesRepository;

  public SeriesResource(SeriesRepository seriesRepository) {
    this.seriesRepository = seriesRepository;
  }

  /**
   * {@code POST  /series} : Create a new series.
   *
   * @param series the series to create.
   * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new series, or with status {@code 400 (Bad Request)} if the series has already an ID.
   * @throws URISyntaxException if the Location URI syntax is incorrect.
   */
  @PostMapping("")
  public ResponseEntity<Series> createSeries(@Valid @RequestBody Series series)
    throws URISyntaxException {
    log.debug("REST request to save Series : {}", series);
    if (series.getId() != null) {
      throw new BadRequestAlertException(
        "A new series cannot already have an ID",
        ENTITY_NAME,
        "idexists"
      );
    }
    Series result = seriesRepository.save(series);
    return ResponseEntity
      .created(new URI("/api/series/" + result.getId()))
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
   * {@code PUT  /series/:id} : Updates an existing series.
   *
   * @param id the id of the series to save.
   * @param series the series to update.
   * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated series,
   * or with status {@code 400 (Bad Request)} if the series is not valid,
   * or with status {@code 500 (Internal Server Error)} if the series couldn't be updated.
   * @throws URISyntaxException if the Location URI syntax is incorrect.
   */
  @PutMapping("/{id}")
  public ResponseEntity<Series> updateSeries(
    @PathVariable(value = "id", required = false) final Long id,
    @Valid @RequestBody Series series
  ) throws URISyntaxException {
    log.debug("REST request to update Series : {}, {}", id, series);
    if (series.getId() == null) {
      throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
    }
    if (!Objects.equals(id, series.getId())) {
      throw new BadRequestAlertException(
        "Invalid ID",
        ENTITY_NAME,
        "idinvalid"
      );
    }

    if (!seriesRepository.existsById(id)) {
      throw new BadRequestAlertException(
        "Entity not found",
        ENTITY_NAME,
        "idnotfound"
      );
    }

    Series result = seriesRepository.save(series);
    return ResponseEntity
      .ok()
      .headers(
        HeaderUtil.createEntityUpdateAlert(
          applicationName,
          true,
          ENTITY_NAME,
          series.getId().toString()
        )
      )
      .body(result);
  }

  /**
   * {@code PATCH  /series/:id} : Partial updates given fields of an existing series, field will ignore if it is null
   *
   * @param id the id of the series to save.
   * @param series the series to update.
   * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated series,
   * or with status {@code 400 (Bad Request)} if the series is not valid,
   * or with status {@code 404 (Not Found)} if the series is not found,
   * or with status {@code 500 (Internal Server Error)} if the series couldn't be updated.
   * @throws URISyntaxException if the Location URI syntax is incorrect.
   */
  @PatchMapping(
    value = "/{id}",
    consumes = { "application/json", "application/merge-patch+json" }
  )
  public ResponseEntity<Series> partialUpdateSeries(
    @PathVariable(value = "id", required = false) final Long id,
    @NotNull @RequestBody Series series
  ) throws URISyntaxException {
    log.debug(
      "REST request to partial update Series partially : {}, {}",
      id,
      series
    );
    if (series.getId() == null) {
      throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
    }
    if (!Objects.equals(id, series.getId())) {
      throw new BadRequestAlertException(
        "Invalid ID",
        ENTITY_NAME,
        "idinvalid"
      );
    }

    if (!seriesRepository.existsById(id)) {
      throw new BadRequestAlertException(
        "Entity not found",
        ENTITY_NAME,
        "idnotfound"
      );
    }

    Optional<Series> result = seriesRepository
      .findById(series.getId())
      .map(existingSeries -> {
        if (series.getName() != null) {
          existingSeries.setName(series.getName());
        }

        return existingSeries;
      })
      .map(seriesRepository::save);

    return ResponseUtil.wrapOrNotFound(
      result,
      HeaderUtil.createEntityUpdateAlert(
        applicationName,
        true,
        ENTITY_NAME,
        series.getId().toString()
      )
    );
  }

  /**
   * {@code GET  /series} : get all the series.
   *
   * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of series in body.
   */
  @GetMapping("")
  public List<Series> getAllSeries() {
    log.debug("REST request to get all Series");
    return seriesRepository.findAll();
  }

  /**
   * {@code GET  /series/:id} : get the "id" series.
   *
   * @param id the id of the series to retrieve.
   * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the series, or with status {@code 404 (Not Found)}.
   */
  @GetMapping("/{id}")
  public ResponseEntity<Series> getSeries(@PathVariable Long id) {
    log.debug("REST request to get Series : {}", id);
    Optional<Series> series = seriesRepository.findById(id);
    return ResponseUtil.wrapOrNotFound(series);
  }

  /**
   * {@code DELETE  /series/:id} : delete the "id" series.
   *
   * @param id the id of the series to delete.
   * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
   */
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteSeries(@PathVariable Long id) {
    log.debug("REST request to delete Series : {}", id);
    seriesRepository.deleteById(id);
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
