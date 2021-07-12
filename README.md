- NodeJS_Chat

# reference1 : https://socket.io
# reference2 : https://github.com/adrianhajdin/project_chat_application

# 실행 방법
1. create-react-app ./
2. (package.json에 명시 되어있지 않은 경우)
3. npm install --save {install list}

- install list
### cors
### nodemon
### express
### socket.io
### react-router
### react-router-dom
### socket.io-client
### react-scroll-to-bottom
### react-emoji
### query-string

4. 각각 폴더 이동 후 실행
    - server 폴더 이동
    1. cd server
    2. npm run start

    - client 폴더 이동
    1. cd ./client
    2. npm run start

2. (package.json에 명시 되어있는 경우)
    - server 폴더 이동
    1. cd server
    2. npm install
    3. npm run start

    - client 폴더 이동
    1. cd ./client
    2. npm install
    3. npm run start


# 에러 날 경우
1. 빌드 에러 시
    - npm run build 실행 후 start 실행

2. 실행 시 이미 포트가 사용중이라고 한다면
    - 다른곳에 사용되는게 아닌 기존에 실행했던 server가 종료되지 않았다면 아래 명령어 실행 후 start
    - npx kill-port {포트번호}


## 간략 설명
1. server
    - express 서버 구성, client들이 접속 할 수 있는 공간 생성

2. client
    - 다수의 유저가 채팅 가능
    - localhost:3000 입장