FROM mcr.microsoft.com/dotnet/sdk:8.0 as build
#эта папка внутри докерного образа
WORKDIR /app
EXPOSE 80

COPY API/Contracts/Contracts.csproj API/Contracts/Contracts.csproj
COPY API/NotificationService/NotificationService.csproj API/NotificationService/NotificationService.csproj
RUN dotnet restore API/NotificationService/NotificationService.csproj

#копируем остальные файлы проекта Auction
COPY API/NotificationService API/NotificationService
COPY API/Contracts API/Contracts

WORKDIR /app/API/NotificationService
RUN dotnet publish -c Release -o /app/API/out

#создание образа
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/API/out .
ENTRYPOINT [ "dotnet", "NotificationService.dll" ]
