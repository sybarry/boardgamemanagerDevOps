package fr.univnantes.dde.boardgamemanager.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class SeriesTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Series getSeriesSample1() {
        return new Series().id(1L).name("name1");
    }

    public static Series getSeriesSample2() {
        return new Series().id(2L).name("name2");
    }

    public static Series getSeriesRandomSampleGenerator() {
        return new Series().id(longCount.incrementAndGet()).name(UUID.randomUUID().toString());
    }
}
