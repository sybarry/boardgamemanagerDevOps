FROM docker.io/maven:3-eclipse-temurin-17
WORKDIR /src/app
#RUN mvn package -Pprod
#COPY . .

#CMD java -jar target/boardgamemanager-0.0.1-SNAPSHOT.jar

COPY . .

RUN mvn --settings ./settings.xml package -Pprod
#RUN mvn --settings ./settings.xml 

COPY application.yml /src/backend/rs/target/

CMD java -jar target/boardgamemanager-0.0.1-SNAPSHOT.jar



  