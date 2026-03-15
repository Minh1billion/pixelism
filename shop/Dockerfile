FROM eclipse-temurin:17-jdk-alpine AS builder
WORKDIR /app

RUN apk add --no-cache dos2unix

COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN dos2unix mvnw && chmod +x mvnw
RUN ./mvnw dependency:go-offline -B

COPY src ./src
RUN ./mvnw clean package -DskipTests -B

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/shop-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]