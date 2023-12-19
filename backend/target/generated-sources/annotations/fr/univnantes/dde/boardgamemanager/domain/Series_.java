package fr.univnantes.dde.boardgamemanager.domain;

import jakarta.persistence.metamodel.SetAttribute;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import javax.annotation.processing.Generated;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(Series.class)
public abstract class Series_ {

	public static volatile SingularAttribute<Series, String> name;
	public static volatile SetAttribute<Series, BoardGame> games;
	public static volatile SingularAttribute<Series, Long> id;

	public static final String NAME = "name";
	public static final String GAMES = "games";
	public static final String ID = "id";

}

