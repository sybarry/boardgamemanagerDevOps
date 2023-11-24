package fr.univnantes.dde.boardgamemanager.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class BoardGameTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static BoardGame getBoardGameSample1() {
        return new BoardGame().id(1L).title("title1").minPlayers(1).maxPlayers(1).publicationYear(1).minAge(1).playingTime(1);
    }

    public static BoardGame getBoardGameSample2() {
        return new BoardGame().id(2L).title("title2").minPlayers(2).maxPlayers(2).publicationYear(2).minAge(2).playingTime(2);
    }

    public static BoardGame getBoardGameRandomSampleGenerator() {
        return new BoardGame()
            .id(longCount.incrementAndGet())
            .title(UUID.randomUUID().toString())
            .minPlayers(intCount.incrementAndGet())
            .maxPlayers(intCount.incrementAndGet())
            .publicationYear(intCount.incrementAndGet())
            .minAge(intCount.incrementAndGet())
            .playingTime(intCount.incrementAndGet());
    }
}
