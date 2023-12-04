package fr.univnantes.dde.boardgamemanager.domain;

import jakarta.persistence.metamodel.SetAttribute;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import javax.annotation.processing.Generated;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(BoardGame.class)
public abstract class BoardGame_ {

	public static volatile SingularAttribute<BoardGame, byte[]> cover;
	public static volatile SingularAttribute<BoardGame, Integer> maxPlayers;
	public static volatile SingularAttribute<BoardGame, Integer> minPlayers;
	public static volatile SingularAttribute<BoardGame, Series> series;
	public static volatile SingularAttribute<BoardGame, Integer> minAge;
	public static volatile SingularAttribute<BoardGame, Integer> playingTime;
	public static volatile SingularAttribute<BoardGame, String> coverContentType;
	public static volatile SingularAttribute<BoardGame, Integer> publicationYear;
	public static volatile SetAttribute<BoardGame, Publisher> publishers;
	public static volatile SingularAttribute<BoardGame, Long> id;
	public static volatile SetAttribute<BoardGame, Category> categories;
	public static volatile SingularAttribute<BoardGame, String> title;

	public static final String COVER = "cover";
	public static final String MAX_PLAYERS = "maxPlayers";
	public static final String MIN_PLAYERS = "minPlayers";
	public static final String SERIES = "series";
	public static final String MIN_AGE = "minAge";
	public static final String PLAYING_TIME = "playingTime";
	public static final String COVER_CONTENT_TYPE = "coverContentType";
	public static final String PUBLICATION_YEAR = "publicationYear";
	public static final String PUBLISHERS = "publishers";
	public static final String ID = "id";
	public static final String CATEGORIES = "categories";
	public static final String TITLE = "title";

}

