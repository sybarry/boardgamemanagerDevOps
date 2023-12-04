package fr.univnantes.dde.boardgamemanager.domain;

import jakarta.persistence.metamodel.SetAttribute;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import javax.annotation.processing.Generated;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(Category.class)
public abstract class Category_ {

	public static volatile SingularAttribute<Category, String> name;
	public static volatile SetAttribute<Category, BoardGame> games;
	public static volatile SingularAttribute<Category, String> description;
	public static volatile SingularAttribute<Category, Long> id;

	public static final String NAME = "name";
	public static final String GAMES = "games";
	public static final String DESCRIPTION = "description";
	public static final String ID = "id";

}

