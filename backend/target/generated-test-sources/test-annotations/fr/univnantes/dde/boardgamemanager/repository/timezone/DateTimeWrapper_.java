package fr.univnantes.dde.boardgamemanager.repository.timezone;

import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.time.OffsetTime;
import java.time.ZonedDateTime;
import javax.annotation.processing.Generated;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(DateTimeWrapper.class)
public abstract class DateTimeWrapper_ {

	public static volatile SingularAttribute<DateTimeWrapper, LocalDateTime> localDateTime;
	public static volatile SingularAttribute<DateTimeWrapper, LocalTime> localTime;
	public static volatile SingularAttribute<DateTimeWrapper, ZonedDateTime> zonedDateTime;
	public static volatile SingularAttribute<DateTimeWrapper, OffsetTime> offsetTime;
	public static volatile SingularAttribute<DateTimeWrapper, OffsetDateTime> offsetDateTime;
	public static volatile SingularAttribute<DateTimeWrapper, Long> id;
	public static volatile SingularAttribute<DateTimeWrapper, LocalDate> localDate;
	public static volatile SingularAttribute<DateTimeWrapper, Instant> instant;

	public static final String LOCAL_DATE_TIME = "localDateTime";
	public static final String LOCAL_TIME = "localTime";
	public static final String ZONED_DATE_TIME = "zonedDateTime";
	public static final String OFFSET_TIME = "offsetTime";
	public static final String OFFSET_DATE_TIME = "offsetDateTime";
	public static final String ID = "id";
	public static final String LOCAL_DATE = "localDate";
	public static final String INSTANT = "instant";

}

