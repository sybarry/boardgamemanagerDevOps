FROM docker.io/maven:3-eclipse-temurin-17 as build
WORKDIR /src/app

COPY . .

RUN mvn --settings ./settings.xml package -Pprod
#RUN mvn --settings ./settings.xml 

COPY application.yml /src/backend/rs/target/

CMD java -jar target/boardgamemanager-0.0.1-SNAPSHOT.jar  
